import { FolderPage } from "@quartz-community/folder-page"

const notesPrefix = "notes/"
const leadingNumber = /^(\d+)(?=\s*[.:：-]|\s)/

function titleOf(page) {
  return page.frontmatter?.title?.trim() ?? ""
}

function noteNumber(page) {
  if (!page.slug?.startsWith(notesPrefix)) return undefined

  const match = titleOf(page).match(leadingNumber)
  return match ? Number.parseInt(match[1], 10) : undefined
}

function dateValue(page) {
  const date = page.dates?.[page.defaultDateType]
  return date instanceof Date ? date.getTime() : 0
}

function isFolder(page) {
  return page.slug?.endsWith("/index") ?? false
}

export function compareNotesNewestFirst(first, second) {
  const firstIsFolder = isFolder(first)
  const secondIsFolder = isFolder(second)
  if (firstIsFolder !== secondIsFolder) return firstIsFolder ? -1 : 1

  const firstNumber = noteNumber(first)
  const secondNumber = noteNumber(second)
  if (firstNumber !== undefined && secondNumber !== undefined && firstNumber !== secondNumber) {
    return secondNumber - firstNumber
  }
  if (firstNumber !== undefined && secondNumber === undefined) return -1
  if (firstNumber === undefined && secondNumber !== undefined) return 1

  const dateDifference = dateValue(second) - dateValue(first)
  if (dateDifference !== 0) return dateDifference

  return titleOf(first).localeCompare(titleOf(second), "ko-KR", {
    numeric: true,
    sensitivity: "base",
  })
}

export default function NumberedFolderPage(options) {
  return FolderPage({ ...options, sort: compareNotesNewestFirst })
}
