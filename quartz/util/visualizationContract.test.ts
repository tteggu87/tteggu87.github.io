import assert from "node:assert/strict"
import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import test from "node:test"

const root = process.cwd()

function filesUnder(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const target = path.join(directory, name)
    return statSync(target).isDirectory() ? filesUnder(target) : [target]
  })
}

test("interactive iframe host CSS uses a centered border-box contract", () => {
  const css = readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")
  const contract = css.match(/\.interactive-visualization-frame\s*\{([\s\S]*?)\n\}/)?.[1]

  assert.ok(contract, "missing .interactive-visualization-frame CSS contract")
  assert.match(contract, /box-sizing:\s*border-box/)
  assert.match(contract, /inline-size:\s*100%/)
  assert.match(contract, /max-inline-size:\s*100%/)
  assert.match(contract, /margin-inline:\s*auto/)
})

test("published Markdown iframes use the shared class and do not duplicate width or border geometry", () => {
  const markdownFiles = filesUnder(path.join(root, "content")).filter((file) =>
    file.endsWith(".md"),
  )
  const failures: string[] = []

  for (const file of markdownFiles) {
    const text = readFileSync(file, "utf8")
    const tags = text.match(/<iframe\b[\s\S]*?<\/iframe>/g) ?? []

    for (const tag of tags) {
      const relative = path.relative(root, file)
      if (!/class="[^"]*interactive-visualization-frame[^"]*"/.test(tag)) {
        failures.push(`${relative}: iframe is missing interactive-visualization-frame`)
      }
      if (/style="[^"]*(?:width|inline-size)\s*:/.test(tag)) {
        failures.push(`${relative}: iframe duplicates host width geometry inline`)
      }
      if (/style="[^"]*border\s*:/.test(tag)) {
        failures.push(`${relative}: iframe duplicates host border geometry inline`)
      }
    }
  }

  assert.deepEqual(failures, [])
})

test("responsive layout media queries use non-overlapping boundary ranges", () => {
  const variables = readFileSync(path.join(root, "quartz/styles/variables.scss"), "utf8")

  assert.match(
    variables,
    /\$mobile:\s*"\(max-width:\s*#\{map\.get\(\$breakpoints, mobile\) - 1px\}\)"/,
  )
  assert.match(
    variables,
    /\$tablet:\s*"\(min-width:\s*#\{map\.get\(\$breakpoints, mobile\)\}\) and \(max-width:\s*#\{map\.get\(\$breakpoints, desktop\) - 1px\}\)"/,
  )
  assert.match(variables, /\$desktop:\s*"\(min-width:\s*#\{map\.get\(\$breakpoints, desktop\)\}\)"/)
})

test("auto-sizing visualization documents keep their own viewport scroll-free", () => {
  const htmlFiles = filesUnder(path.join(root, "content/attachments")).filter((file) =>
    file.endsWith(".htm"),
  )
  const failures: string[] = []

  for (const file of htmlFiles) {
    const text = readFileSync(file, "utf8")
    if (!text.includes("window.frameElement")) continue

    const relative = path.relative(root, file)
    if (!text.includes("overflow: hidden")) {
      failures.push(`${relative}: missing iframe-internal overflow suppression`)
    }
    if (!text.includes('frame?.tagName === "IFRAME"')) {
      failures.push(`${relative}: missing guarded frameElement resize`)
    }
    if (/document\.(?:documentElement|body)\.scrollHeight/.test(text)) {
      failures.push(
        `${relative}: iframe height must come from a stable content root, not the viewport`,
      )
    }
  }

  assert.deepEqual(failures, [])
})
