import type { QuartzPageTypePlugin, QuartzPluginData } from "@quartz-community/types"
import type { FolderPageOptions } from "@quartz-community/folder-page"

export declare function compareNotesNewestFirst(
  first: QuartzPluginData,
  second: QuartzPluginData,
): number

declare const NumberedFolderPage: QuartzPageTypePlugin<FolderPageOptions>
export default NumberedFolderPage
