import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import test from "node:test"

const root = process.cwd()

test("folder listings hide tags and release the tag track", () => {
  const css = readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")

  assert.match(
    css,
    /\.page-listing li\.section-li > \.section\s*\{\s*grid-template-columns:\s*fit-content\(8em\) minmax\(0, 1fr\)/,
  )
  assert.match(css, /\.page-listing li\.section-li > \.section > \.tags\s*\{\s*display:\s*none/)
})

test("phone article typography keeps natural spacing at the denser baseline", () => {
  const css = readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")

  assert.match(css, /body:not\(\[data-slug="index"\]\) article\s*\{\s*font-size:\s*1rem/)
  assert.match(
    css,
    /body:not\(\[data-slug="index"\]\) article :is\(p, li\)\s*\{\s*line-height:\s*1\.65/,
  )
  assert.match(css, /body:not\(\[data-slug="index"\]\) article p\s*\{\s*text-wrap:\s*wrap/)
  assert.doesNotMatch(css, /text-align:\s*justify/)
})
