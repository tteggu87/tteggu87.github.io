import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { Root } from "mdast"
import { VFile } from "vfile"
import { BuildCtx } from "../../util/ctx"
import { FilePath } from "../../util/path"
import { applyFirstImageSocialImage, inferFirstImageSocialUrl } from "./firstImageSocialImage"

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "quartz-first-og-"))
  const content = path.join(root, "content")
  const postPath = path.join(content, "notes", "sample.md")
  const imagePath = path.join(content, "attachments", "sample", "hero.png")
  fs.mkdirSync(path.dirname(postPath), { recursive: true })
  fs.mkdirSync(path.dirname(imagePath), { recursive: true })
  fs.writeFileSync(postPath, "post")
  fs.writeFileSync(imagePath, "image")

  const ctx = {
    argv: { directory: content },
    cfg: { configuration: { baseUrl: "example.com" } },
  } as BuildCtx
  const file = new VFile({ path: postPath })
  file.data.relativePath = "notes/sample.md" as FilePath
  file.data.filePath = postPath as FilePath
  file.data.frontmatter = { title: "Sample" }

  return { root, ctx, file }
}

test("resolves an existing local post image to its public absolute URL", (t) => {
  const { root, ctx, file } = fixture()
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))

  assert.equal(
    inferFirstImageSocialUrl(ctx, file, "../attachments/sample/hero.png"),
    "https://example.com/attachments/sample/hero.png",
  )
})

test("ignores unsupported, remote, missing, and non-public images", (t) => {
  const { root, ctx, file } = fixture()
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))

  assert.equal(inferFirstImageSocialUrl(ctx, file, "https://cdn.example.com/hero.png"), undefined)
  assert.equal(inferFirstImageSocialUrl(ctx, file, "../attachments/sample/hero.svg"), undefined)
  assert.equal(inferFirstImageSocialUrl(ctx, file, "../attachments/sample/missing.png"), undefined)

  file.data.relativePath = "about.md" as FilePath
  assert.equal(inferFirstImageSocialUrl(ctx, file, "attachments/sample/hero.png"), undefined)
})

test("uses the first eligible image and preserves an explicit social image", (t) => {
  const { root, ctx, file } = fixture()
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const tree: Root = {
    type: "root",
    children: [
      { type: "paragraph", children: [{ type: "image", url: "https://cdn.example.com/a.png" }] },
      {
        type: "paragraph",
        children: [{ type: "image", url: "../attachments/sample/hero.png" }],
      },
    ],
  }

  applyFirstImageSocialImage(ctx, tree, file)
  assert.equal(
    file.data.frontmatter?.socialImage,
    "https://example.com/attachments/sample/hero.png",
  )

  file.data.frontmatter = { title: "Sample", socialImage: "https://example.com/manual.png" }
  applyFirstImageSocialImage(ctx, tree, file)
  assert.equal(file.data.frontmatter?.socialImage, "https://example.com/manual.png")
})
