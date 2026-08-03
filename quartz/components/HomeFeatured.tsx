import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/homeFeatured.scss"

// Keep the homepage selection explicit. A missing slug is ignored so the
// homepage remains buildable while a newly published post is being merged.
const FEATURED_SLUGS: FullSlug[] = [
  "notes/llm-wiki/llm-wiki-origin-and-implementations" as FullSlug,
  "notes/온톨로지/llm-wiki-double-compilation" as FullSlug,
  "notes/온톨로지/authorization-aware-rag-graph-boundary" as FullSlug,
  "notes/온톨로지/generation-faithfulness-regression" as FullSlug,
  "notes/온톨로지/knowledge-centric-self-improvement" as FullSlug,
  "notes/온톨로지/path-predictability-semantic-authority" as FullSlug,
]

const HomeFeatured: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const featured = FEATURED_SLUGS.map((slug) => allFiles.find((page) => page.slug === slug))
    .filter((page) => page?.frontmatter?.title)
    .slice(0, 5)

  if (featured.length === 0) return null

  return (
    <section class="home-featured" aria-labelledby="home-featured-title">
      <div class="home-featured-heading">
        <p class="home-featured-kicker">START WITH A QUESTION</p>
        <h2 id="home-featured-title">지금 읽을 글</h2>
        <p>이 정원의 핵심 문제와 관점을 짧게 만나는 추천 읽기입니다.</p>
      </div>
      <ul class="home-featured-grid">
        {featured.map((page) => {
          const title = page!.frontmatter!.title
          const description = page!.frontmatter?.description

          return (
            <li class="home-featured-card">
              <a
                class="home-featured-link internal internal-link"
                href={resolveRelative(fileData.slug!, page!.slug!)}
              >
                <h3>{title}</h3>
                {typeof description === "string" && description.trim().length > 0 && (
                  <p>{description.trim()}</p>
                )}
                <span class="home-featured-read">
                  읽기 <span aria-hidden="true">→</span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

HomeFeatured.css = style

export default (() => HomeFeatured) satisfies QuartzComponentConstructor
