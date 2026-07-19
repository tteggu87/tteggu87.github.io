import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/topNav.scss"

const links = [
  { label: "홈", path: "" },
  { label: "처음 읽기", path: "start-here" },
  { label: "노트", path: "notes" },
  { label: "소개", path: "about" },
]

const TopNav: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const root = pathToRoot(fileData.slug!)
  const current = fileData.slug === "index" ? "" : (fileData.slug ?? "")
  return (
    <nav class="top-nav" aria-label="주요 메뉴">
      {links.map(({ label, path }) => (
        <a
          class="internal"
          href={path === "" ? root : `${root}/${path}`}
          aria-current={
            current === path || (path !== "" && current.startsWith(`${path}/`)) ? "page" : undefined
          }
        >
          {label}
        </a>
      ))}
    </nav>
  )
}

TopNav.css = style
export default (() => TopNav) satisfies QuartzComponentConstructor
