#!/usr/bin/env node
/**
 * Record a scripted interaction as a timestamped PNG frame sequence.
 *
 * Drives headless Chrome over the DevTools protocol using Node's built-in
 * WebSocket — no dependencies, nothing to install.
 *
 * Frames are pulled with `Page.captureScreenshot` on a clock rather than with
 * `Page.startScreencast`. Screencast only emits on compositor commits, and
 * headless Chrome without a display produces almost none: it yields a single
 * frame and then goes quiet no matter how the throttling flags are set.
 * captureScreenshot forces a frame every call, and because CSS transitions run
 * on the real clock the animation advances between calls exactly as it would
 * on screen. The cost is a soft frame rate (~20–30fps at listing sizes), so
 * each frame's true timestamp is recorded for the encoder to use.
 *
 * Usage:
 *   node record.mjs --url "http://127.0.0.1:5230/?bare=1" --out frames \
 *                   --width 1000 --height 563 --ms 6400 --script steps.mjs \
 *                   --expect "document.querySelectorAll('[data-x]').length > 0"
 *
 * --script is a module exporting `steps`: [{ at: <ms>, js: "<expression>" }],
 * evaluated in the page on cue — that is how the interaction is performed.
 */
import { spawn } from "node:child_process"
import { mkdir, rm, writeFile } from "node:fs/promises"
import { setTimeout as sleep } from "node:timers/promises"

const arg = (name, fallback) => {
    const i = process.argv.indexOf(`--${name}`)
    return i === -1 ? fallback : process.argv[i + 1]
}

const URL_ = arg("url")
const OUT = arg("out", "frames")
const WIDTH = Number(arg("width", 1000))
const HEIGHT = Number(arg("height", 563))
const MS = Number(arg("ms", 6000))
const SCALE = Number(arg("scale", 1))
const FPS = Number(arg("fps", 25))
const SETTLE = Number(arg("settle", 3500))
const PORT = Number(arg("port", 9333))
const SCRIPT = arg("script")
const EXPECT = arg("expect")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if (!URL_) {
    console.error("record.mjs: --url is required")
    process.exit(1)
}

const chrome = spawn(CHROME, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-background-timer-throttling",
    `--window-size=${WIDTH},${HEIGHT}`,
    "about:blank",
])
chrome.on("error", (e) => {
    console.error("chrome failed to launch:", e.message)
    process.exit(1)
})

let target = null
for (let i = 0; i < 60 && !target; i++) {
    await sleep(250)
    try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/list`)
        target = (await res.json()).find((t) => t.type === "page")
    } catch {}
}
if (!target) {
    console.error("could not reach Chrome's debugging endpoint")
    chrome.kill()
    process.exit(1)
}

const ws = new WebSocket(target.webSocketDebuggerUrl)
let nextId = 1
const pending = new Map()
const send = (method, params = {}) =>
    new Promise((resolve) => {
        const id = nextId++
        pending.set(id, resolve)
        ws.send(JSON.stringify({ id, method, params }))
    })

await new Promise((r) => ws.addEventListener("open", r))
ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg.result)
        pending.delete(msg.id)
    }
})

await send("Page.enable")
await send("Runtime.enable")
await send("Emulation.setFocusEmulationEnabled", { enabled: true })
await send("Emulation.setDeviceMetricsOverride", {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: SCALE,
    mobile: false,
})
await send("Page.navigate", { url: URL_ })
// Fonts, imagery and any fit/measure pass must settle before recording, or the
// opening frames capture the component mid-arrangement.
await sleep(SETTLE)

// Guard: prove the component is actually on screen before recording a single
// frame. Without this a dead server records Chrome's error page — a perfectly
// valid, perfectly animated file of nothing, which structural validation of
// the output cannot catch because the structure is fine.
if (EXPECT) {
    const check = await send("Runtime.evaluate", {
        expression: EXPECT,
        returnByValue: true,
    })
    if (!check?.result?.value) {
        const title = await send("Runtime.evaluate", {
            expression: "document.title + ' | ' + document.body.innerText.slice(0, 120)",
            returnByValue: true,
        })
        console.error(
            `record.mjs: --expect did not hold, refusing to record.\n` +
                `  expression: ${EXPECT}\n` +
                `  page: ${title?.result?.value ?? "(unknown)"}`
        )
        ws.close()
        chrome.kill()
        process.exit(1)
    }
}

const steps = SCRIPT ? (await import(`${process.cwd()}/${SCRIPT}`)).steps : []
const queue = [...steps].sort((a, b) => a.at - b.at)

const frames = []
const started = Date.now()
const interval = 1000 / FPS

while (Date.now() - started < MS) {
    const t = Date.now() - started
    while (queue.length && queue[0].at <= t) {
        await send("Runtime.evaluate", { expression: queue.shift().js })
    }
    const shot = await send("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
        captureBeyondViewport: false,
    })
    if (shot?.data) frames.push({ t: Date.now() - started, data: shot.data })
    const spent = Date.now() - started - t
    if (spent < interval) await sleep(interval - spent)
}

ws.close()
chrome.kill()

await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })
const manifest = []
let i = 0
for (const f of frames) {
    const name = `frame-${String(i).padStart(4, "0")}.png`
    await writeFile(`${OUT}/${name}`, Buffer.from(f.data, "base64"))
    // Delay = gap to the NEXT frame; the last frame holds briefly before loop.
    const next = frames[i + 1]
    manifest.push({ name, delay: next ? next.t - f.t : 400 })
    i++
}
await writeFile(`${OUT}/frames.json`, JSON.stringify(manifest, null, 1))

const span = frames.length ? frames[frames.length - 1].t : 0
console.log(
    `captured ${frames.length} frames over ${span}ms ` +
        `(~${Math.round((frames.length / (span || 1)) * 1000)}fps) → ${OUT}/`
)
