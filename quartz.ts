import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { ConditionalRender, Flex } from "./quartz/components"
import HomeHero from "./quartz/components/HomeHero"
import ReaderMode from "./quartz/components/ReaderMode"
import TopNav from "./quartz/components/TopNav"
import { PageTypes } from "./quartz/plugins"
import { RecentNotes as configureRecentNotes } from "./.quartz/plugins"

configureRecentNotes({
  filter: (file: { slug?: string }) => {
    const slug = file.slug ?? ""
    return slug.startsWith("notes/") && slug !== "notes/index" && !slug.endsWith("/")
  },
})
const config = await loadQuartzConfig()
const baseLayout = await loadQuartzLayout()
const homeHero = ConditionalRender({
  component: HomeHero(),
  condition: ({ fileData }) => fileData.slug === "index",
})
const header = Flex({
  components: [
    { Component: TopNav(), grow: true, align: "stretch" },
    { Component: ReaderMode(), shrink: false },
  ],
  gap: "0.5rem",
})
const contentLayout = baseLayout.byPageType.content ?? {}

export const layout = {
  ...baseLayout,
  defaults: {
    ...baseLayout.defaults,
    header: [header],
  },
  byPageType: {
    ...baseLayout.byPageType,
    content: {
      ...contentLayout,
      header: [header],
      beforeBody: [homeHero, ...(contentLayout.beforeBody ?? baseLayout.defaults.beforeBody ?? [])],
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
