import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { ConditionalRender, Flex } from "./quartz/components"
import HomeHero from "./quartz/components/HomeHero"
import ArticleDescription from "./quartz/components/ArticleDescription"
import HomeFeatured from "./quartz/components/HomeFeatured"
import ReaderMode from "./quartz/components/ReaderMode"
import TopNav from "./quartz/components/TopNav"
import { FirstImageSocialImage, PageTypes } from "./quartz/plugins"
import type { PageGenerator } from "./quartz/plugins/types"
import { RecentNotes as configureRecentNotes } from "./.quartz/plugins"

configureRecentNotes({
  filter: (file: { slug?: string }) => {
    const slug = file.slug ?? ""
    return (slug.startsWith("notes/") || slug.startsWith("projects/")) && !slug.endsWith("/index")
  },
})
const config = await loadQuartzConfig()
config.plugins.transformers.push(FirstImageSocialImage())

// Tag pages are useful as reader-facing filters, but most are too thin to be
// standalone search landing pages. Keep emitting them while excluding them
// from the sitemap, RSS, search index, explorer, and graph.
const tagPage = config.plugins.pageTypes?.find((pageType) => pageType.name === "TagPage")
if (tagPage?.generate) {
  const generateTagPages = tagPage.generate as unknown as PageGenerator
  tagPage.generate = ((args: Parameters<PageGenerator>[0]) =>
    generateTagPages(args).map((page) => ({
      ...page,
      data: { ...page.data, unlisted: true },
    }))) as unknown as NonNullable<typeof tagPage.generate>
}

const baseLayout = await loadQuartzLayout()
const homeHero = ConditionalRender({
  component: HomeHero(),
  condition: ({ fileData }) => fileData.slug === "index",
})
const homeFeatured = ConditionalRender({
  component: HomeFeatured(),
  condition: ({ fileData }) => fileData.slug === "index",
})
const articleDescription = ConditionalRender({
  component: ArticleDescription(),
  condition: ({ fileData }) => {
    const slug = fileData.slug ?? ""
    return slug.startsWith("notes/") && !slug.endsWith("/index")
  },
})
const header = Flex({
  components: [
    { Component: TopNav(), grow: true, align: "stretch" },
    { Component: ReaderMode(), shrink: false },
  ],
  gap: "0.5rem",
})
const contentLayout = baseLayout.byPageType.content ?? {}
const folderLayout = baseLayout.byPageType.folder ?? {}
const contentBeforeBody = [...(contentLayout.beforeBody ?? baseLayout.defaults.beforeBody ?? [])]
// Breadcrumbs (priority 5) comes before ArticleTitle (priority 10) in the
// configured content layout. Insert the public lead after the title and
// before note properties/date/meta.
contentBeforeBody.splice(2, 0, articleDescription)

export const layout = {
  ...baseLayout,
  defaults: {
    ...baseLayout.defaults,
    header: [header],
  },
  byPageType: {
    ...baseLayout.byPageType,
    folder: {
      ...folderLayout,
      header: [header],
    },
    content: {
      ...contentLayout,
      header: [header],
      beforeBody: [homeHero, homeFeatured, ...contentBeforeBody],
    },
  },
}

// YAML config creates a dispatcher while loading, before quartz.ts can apply
// local layout components. Replace that one dispatcher with our resolved layout.
config.plugins.emitters = config.plugins.emitters.filter(
  (emitter) => emitter.name !== "PageTypeDispatcher",
)
config.plugins.emitters.push(
  PageTypes.PageTypeDispatcher({ defaults: layout.defaults, byPageType: layout.byPageType }),
)

export default config
