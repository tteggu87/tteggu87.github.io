import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/articleDescription.scss"

const ArticleDescription: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const description = fileData.frontmatter?.description

  if (typeof description !== "string" || description.trim().length === 0) {
    return null
  }

  return <p class="article-description">{description.trim()}</p>
}

ArticleDescription.css = style

export default (() => ArticleDescription) satisfies QuartzComponentConstructor
