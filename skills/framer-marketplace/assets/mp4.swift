// Encode a recorded PNG frame sequence into an H.264 MP4, using AVFoundation.
//
// Why this exists: an APNG stores every frame whole, so a few seconds of
// photographic content runs to several megabytes. H.264 stores only what
// changed between frames and lands 10–30× smaller. There is no ffmpeg on this
// machine and `avconvert` transcodes existing video rather than building it
// from stills, but AVFoundation will happily write one — and it ships with
// macOS, so this needs nothing installed.
//
// Reads the `frames.json` manifest written by record.mjs so the real capture
// timings are preserved rather than resampled to a constant rate.
//
//   swiftc -O -o /tmp/mp4enc mp4.swift && /tmp/mp4enc --in frames --out loop.mp4
//
// Options: --bitrate <bits/sec, default 4_000_000>  --loops <n, default 1>

import AVFoundation
import AppKit
import Foundation

struct Frame: Decodable {
    let name: String
    let delay: Int
}

func arg(_ name: String, _ fallback: String? = nil) -> String? {
    let a = CommandLine.arguments
    guard let i = a.firstIndex(of: "--\(name)"), i + 1 < a.count else { return fallback }
    return a[i + 1]
}

guard let inDir = arg("in"), let outPath = arg("out") else {
    FileHandle.standardError.write("mp4.swift: --in <dir> and --out <file.mp4> are required\n".data(using: .utf8)!)
    exit(1)
}
let bitrate = Int(arg("bitrate", "4000000")!) ?? 4_000_000
let loops = max(1, Int(arg("loops", "1")!) ?? 1)

let dir = URL(fileURLWithPath: inDir)
let manifestURL = dir.appendingPathComponent("frames.json")
guard let data = try? Data(contentsOf: manifestURL),
      let frames = try? JSONDecoder().decode([Frame].self, from: data), !frames.isEmpty
else {
    FileHandle.standardError.write("mp4.swift: could not read \(manifestURL.path)\n".data(using: .utf8)!)
    exit(1)
}

func cgImage(_ url: URL) -> CGImage? {
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(src, 0, nil)
}

guard let first = cgImage(dir.appendingPathComponent(frames[0].name)) else {
    FileHandle.standardError.write("mp4.swift: could not read the first frame\n".data(using: .utf8)!)
    exit(1)
}
// H.264 requires even dimensions.
let width = first.width - (first.width % 2)
let height = first.height - (first.height % 2)

let outURL = URL(fileURLWithPath: outPath)
try? FileManager.default.removeItem(at: outURL)

let writer = try! AVAssetWriter(outputURL: outURL, fileType: .mp4)
let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: bitrate,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        AVVideoAllowFrameReorderingKey: true,
    ],
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: input,
    sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height,
    ]
)
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let timescale: CMTimeScale = 1000
var elapsedMs = 0
var written = 0

func append(_ image: CGImage, atMs ms: Int) {
    guard let pool = adaptor.pixelBufferPool else { return }
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(kCFAllocatorDefault, pool, &pb)
    guard let buffer = pb else { return }
    CVPixelBufferLockBaseAddress(buffer, [])
    let ctx = CGContext(
        data: CVPixelBufferGetBaseAddress(buffer),
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue
            | CGBitmapInfo.byteOrder32Little.rawValue
    )
    ctx?.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
    CVPixelBufferUnlockBaseAddress(buffer, [])

    while !input.isReadyForMoreMediaData { usleep(2000) }
    adaptor.append(buffer, withPresentationTime: CMTime(value: CMTimeValue(ms), timescale: timescale))
    written += 1
}

for _ in 0..<loops {
    for frame in frames {
        guard let image = cgImage(dir.appendingPathComponent(frame.name)) else { continue }
        append(image, atMs: elapsedMs)
        elapsedMs += max(frame.delay, 1)
    }
}

input.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()

if writer.status == .failed {
    FileHandle.standardError.write("mp4.swift: \(writer.error?.localizedDescription ?? "encoding failed")\n".data(using: .utf8)!)
    exit(1)
}

let size = (try? FileManager.default.attributesOfItem(atPath: outPath)[.size] as? Int) ?? 0
let mb = Double(size ?? 0) / 1_048_576
print(String(format: "%@: %d frames, %dx%d, %.1fs, %.2fMB",
             outPath, written, width, height, Double(elapsedMs) / 1000, mb))
