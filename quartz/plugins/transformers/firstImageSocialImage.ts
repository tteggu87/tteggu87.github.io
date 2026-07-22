import fs from "node:fs"
import path from "node:path"
import { Root } from "mdast"
import { VFile } from "vfile"
import { EXIT, visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"
import { BuildCtx } from "../../util/ctx"
import { FilePath, slugifyFilePath } from "../../util/path"

const SUPPORTED_EXTENSIONS = new Set([".jpeg", ".jpg", ".png", ".webp"])
const PUBLIC_POST_PREFIXES = ["notes/", "projects/"]

function cleanLocalImageTarget(target: string): string | undefined {
  const trimmed = target.trim()
  if (
    trimmed.length === 0 ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    /^[a-z][a-z\d+.-]*:/i.test(trimmed)
  ) {
    return undefined
  }

  const withoutQuery = trimmed.split(/[?#]/, 1)[0]
  try {
    return decodeURIComponent(withoutQuery)
  } catch {
    return undefined
  }
}

export function inferFirstImageSocialUrl(
  ctx: BuildCtx,
  file: VFile,
  imageTarget: string,
): string | undefined {
  const baseUrl = ctx.cfg.configuration.baseUrl
  const relativePath = file.data.relativePath?.toString().replaceAll("\\", "/")
  if (
    !baseUrl ||
    !relativePath ||
    !PUBLIC_POST_PREFIXES.some((prefix) => relativePath.startsWith(prefix))
  ) {
    return undefined
  }

  const cleanTarget = cleanLocalImageTarget(imageTarget)
  if (!cleanTarget || !SUPPORTED_EXTENSIONS.has(path.extname(cleanTarget).toLowerCase())) {
    return undefined
  }

  const contentRoot = path.resolve(ctx.argv.directory)
  const sourceFile = path.resolve(
    file.data.filePath?.toString() ?? path.join(contentRoot, relativePath),
  )
  const imagePath = path.resolve(path.dirname(sourceFile), cleanTarget)
  const relativeAssetPath = path.relative(contentRoot, imagePath)
  if (
    relativeAssetPath === "" ||
    relativeAssetPath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeAssetPath) ||
    !fs.existsSync(imagePath) ||
    !fs.statSync(imagePath).isFile()
  ) {
    return undefined
  }

  const portableAssetPath = relativeAssetPath.split(path.sep).join("/") as FilePath
  const publicAssetPath = slugifyFilePath(portableAssetPath)
  return `https://${baseUrl}/${publicAssetPath}`
}

export function applyFirstImageSocialImage(ctx: BuildCtx, tree: Root, file: VFile): void {
  const frontmatter = file.data.frontmatter
  if (!frontmatter || frontmatter.socialImage || frontmatter.image || frontmatter.cover) {
    return
  }

  visit(tree, "image", (node) => {
    const socialImage = inferFirstImageSocialUrl(ctx, file, node.url)
    if (!socialImage) return

    frontmatter.socialImage = socialImage
    return EXIT
  })
}

export const FirstImageSocialImage: QuartzTransformerPlugin = () => ({
  name: "FirstImageSocialImage",
  markdownPlugins(ctx) {
    return [() => (tree: Root, file: VFile) => applyFirstImageSocialImage(ctx, tree, file)]
  },
})
