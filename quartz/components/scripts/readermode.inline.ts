let isReaderMode = false

const emitReaderModeChangeEvent = (mode: "on" | "off") => {
  const event: CustomEventMap["readermodechange"] = new CustomEvent("readermodechange", {
    detail: { mode },
  })
  document.dispatchEvent(event)
}

const setReaderMode = (mode: "on" | "off") => {
  document.documentElement.setAttribute("reader-mode", mode)
  for (const readerModeButton of document.getElementsByClassName("readermode")) {
    readerModeButton.setAttribute("aria-pressed", String(mode === "on"))
  }
}

document.addEventListener("nav", () => {
  const switchReaderMode = () => {
    isReaderMode = !isReaderMode
    const newMode = isReaderMode ? "on" : "off"
    setReaderMode(newMode)
    emitReaderModeChangeEvent(newMode)
  }

  for (const readerModeButton of document.getElementsByClassName("readermode")) {
    readerModeButton.addEventListener("click", switchReaderMode)
    window.addCleanup(() => readerModeButton.removeEventListener("click", switchReaderMode))
  }

  // Set initial state
  setReaderMode(isReaderMode ? "on" : "off")
})
