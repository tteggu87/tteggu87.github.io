let isReaderMode = false

const applyReaderMode = (mode: "on" | "off") => {
  document.documentElement.setAttribute("reader-mode", mode)
  for (const button of document.getElementsByClassName("readermode")) {
    button.setAttribute("aria-pressed", String(mode === "on"))
  }
  document.dispatchEvent(new CustomEvent("readermodechange", { detail: { mode } }))
}

document.addEventListener("nav", () => {
  const toggle = () => {
    isReaderMode = !isReaderMode
    applyReaderMode(isReaderMode ? "on" : "off")
  }
  for (const button of document.getElementsByClassName("readermode")) {
    button.addEventListener("click", toggle)
    window.addCleanup(() => button.removeEventListener("click", toggle))
  }
  applyReaderMode(isReaderMode ? "on" : "off")
})
