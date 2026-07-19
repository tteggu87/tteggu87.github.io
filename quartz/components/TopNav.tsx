import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/topNav.scss"

const links = [
  { label: "홈", path: "" },
  { label: "처음 읽기", path: "start-here" },
  { label: "노트", path: "notes" },
  { label: "프로젝트", path: "projects" },
  { label: "소개", path: "about" },
]

const TopNav: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const root = pathToRoot(fileData.slug!)

  return (
    <nav class="top-nav" aria-label="주요 메뉴">
      {links.map(({ label, path }) => (
        <a class="internal" href={path === "" ? root : `${root}/${path}`}>
          {label}
        </a>
      ))}
    </nav>
  )
}

TopNav.css = style

export default (() => TopNav) satisfies QuartzComponentConstructor
