import assert from "node:assert/strict"
import test from "node:test"
import { compareNotesNewestFirst } from "../../local-plugins/numbered-folder-page/dist/index.js"

type TestPage = Parameters<typeof compareNotesNewestFirst>[0]

function page(slug: string, title: string, modified: string): TestPage {
  return {
    slug,
    frontmatter: { title },
    defaultDateType: "modified",
    dates: { modified: new Date(modified) },
  } as TestPage
}

test("notes sort by their leading publication number newest first", () => {
  const notes = [
    page("notes/five", "5. 다섯 번째 글", "2026-07-21"),
    page("notes/seven", "7. 일곱 번째 글", "2026-07-21"),
    page("notes/six", "6. 여섯 번째 글", "2026-07-21"),
    page("notes/one", "1. 첫 번째 글", "2026-07-19"),
  ]

  assert.deepEqual(
    notes.sort(compareNotesNewestFirst).map((note) => note.frontmatter?.title),
    ["7. 일곱 번째 글", "6. 여섯 번째 글", "5. 다섯 번째 글", "1. 첫 번째 글"],
  )
})

test("unnumbered notes fall back to modified date newest first", () => {
  const notes = [
    page("notes/older", "번호 없는 이전 글", "2026-07-19"),
    page("notes/newer", "번호 없는 최신 글", "2026-07-22"),
  ]

  assert.deepEqual(
    notes.sort(compareNotesNewestFirst).map((note) => note.frontmatter?.title),
    ["번호 없는 최신 글", "번호 없는 이전 글"],
  )
})

test("other folder pages keep date-first sorting", () => {
  const projects = [
    page("projects/one", "1. 오래된 프로젝트", "2026-07-19"),
    page("projects/two", "2. 최신 프로젝트", "2026-07-22"),
  ]

  assert.deepEqual(
    projects.sort(compareNotesNewestFirst).map((project) => project.frontmatter?.title),
    ["2. 최신 프로젝트", "1. 오래된 프로젝트"],
  )
})
