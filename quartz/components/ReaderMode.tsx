// @ts-ignore
import readerModeScript from "./scripts/readermode.inline"
import styles from "./styles/readermode.scss"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const ReaderMode: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  const label = i18n(cfg.locale).components.readerMode.title
  return (
    <button
      type="button"
      class={classNames(displayClass, "readermode")}
      aria-label={label}
      aria-pressed="false"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v15a2.8 2.8 0 0 0-2.5-1.5H4z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17a2.8 2.8 0 0 1 2.5-1.5H20z" />
      </svg>
    </button>
  )
}

ReaderMode.beforeDOMLoaded = readerModeScript
ReaderMode.css = styles
export default (() => ReaderMode) satisfies QuartzComponentConstructor
