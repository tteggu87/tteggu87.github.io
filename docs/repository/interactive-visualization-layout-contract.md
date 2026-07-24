# Interactive visualization host-layout contract

## Purpose

This note records the layout regression investigation for Quartz articles that embed same-origin interactive visualizations. It is the repository-level source of truth for keeping the host article centered and readable while an iframe changes height dynamically.

## Incident

A mobile screenshot of `notes/ontology-in-the-agentic-era` appeared visually left-heavy below the interactive explorer. The report arrived after PR #29, which added interactive visualizations to articles 1, 3, and 5.

### What did not change

The suspected latest change was not the static cause:

- Article 2 had the same Git blob at merge commits `761524e8` and `76953064`: `90a01d4f...`.
- `quartz/styles/custom.scss` also had the same blob at both commits: `6c46537f...`.
- A 390px mobile-browser measurement before the iframe was introduced (`ba6eeb7`) and on the affected deployment produced the same host-reading geometry:
  - article left: `17.59375px`
  - article width: `354.8125px`
  - paragraph `text-align`: `start`
  - paragraph `text-wrap`: `pretty`

Therefore PR #29 did not move article 2 to the left, and the article had historically inherited start alignment.

### Actual defects and visual trigger

One layout defect and one pre-existing visual characteristic were found.

1. **The iframe exceeded the article by two pixels.** The inline style combined `width: 100%` with a 1px border on each side while retaining the default `box-sizing: content-box`. On a 390px viewport the article measured `354.8125px`, but the iframe outer box measured `356.8125px`.
2. **Korean mobile copy looked left-heavy.** The host stylesheet inherited `text-align: start` and `text-wrap: pretty`. That was not a regression. Mobile justification was evaluated as a separate typography option and rejected as the default because narrow Korean and mixed Latin lines gained uneven spacing and, with `word-break: keep-all`, extra lines.

## Canonical fix

### Shared iframe class

All article-owned interactive iframes use the shared class below. Presentation geometry belongs in the stylesheet; only an initial or viewport-specific height remains inline.

```scss
.interactive-visualization-frame {
  display: block;
  box-sizing: border-box;
  inline-size: 100%;
  max-inline-size: 100%;
  margin-inline: auto;
  overflow: hidden;
  border: 1px solid currentColor;
  border-radius: 12px;
  background: transparent;
}
```

Example:

```html
<iframe
  class="interactive-visualization-frame"
  src="/attachments/example/explorer.htm"
  scrolling="no"
  sandbox="allow-scripts allow-same-origin"
  style="height:920px"
></iframe>
```

### Stable auto-height measurement

An auto-sizing visualization measures an explicit content root such as `.app` or `#explorer`
with `getBoundingClientRect().height`. It must not derive the next iframe height from
`document.documentElement.scrollHeight` or `document.body.scrollHeight`: those values can track
the iframe viewport, so writing the result back to `frameElement.style.height` creates an
unbounded resize feedback loop.

Height writes are guarded by a small difference threshold, and a `ResizeObserver` watches the
content root rather than the document viewport. This lets tabs and responsive reflow update the
embed while keeping an unchanged state idempotent.

### Reading alignment stays independent

The iframe geometry fix did not change article typography. Direct paragraphs retain start alignment and `pretty` wrapping at mobile, tablet, and desktop sizes. A later, separately reviewed phone typography change restored the denser Quartz 4 baseline (`1rem` copy with `1.65` line height below `600px`) without using full justification. The narrow layout keeps natural Korean/Latin spacing while reducing the visual dominance of ragged line endings.

Folder listings use the same narrow breakpoint as Quartz's hidden tag list. When tags become `display: none`, the listing grid must also collapse from date/title/tags to date/title; otherwise the invisible third track keeps one sixth of the row empty.

### Responsive breakpoints do not overlap

Quartz uses one active layout range at a time:

- mobile: up to `799px`
- tablet: `800px` through `1199px`
- desktop: `1200px` and above

The former inclusive ranges matched both mobile and tablet at `800px`, and both tablet and desktop at `1200px`. The non-overlapping ranges keep the selected grid deterministic at the boundary pixels.

## Required checks

A visualization release is incomplete until the host article and iframe are both checked.

1. The reading column is horizontally centered: left and right free space differ by no more than 2px.
2. `iframe.getBoundingClientRect().width <= article.getBoundingClientRect().width + 0.5`.
3. The iframe computed `box-sizing` is `border-box`.
4. `document.documentElement.scrollWidth <= window.innerWidth + 1` on the host and inside the iframe.
5. Every dynamic state is opened; iframe height differs from measured content height by no more than 6px.
6. Article alignment is unchanged from the start-aligned baseline unless a separate typography change is intentionally reviewed.
7. Exactly one responsive layout range matches at `799px`, `800px`, `1199px`, and `1200px`.
8. The exact deployed URL is retested after the matching merge commit succeeds.
9. At `600px` and below, folder rows resolve to exactly two grid tracks and the tag list remains hidden.
10. Repeated height samples in an unchanged visualization state remain stable within 1px.

## Do not repeat

- Do not duplicate full iframe geometry in Markdown inline styles.
- Do not use `width: 100%` plus borders without `border-box`.
- Do not size an iframe from the child document viewport's `scrollHeight`.
- Do not validate only the iframe's internal scroll state.
- Do not infer a host-layout regression from timing alone; compare file hashes and measured geometry with the last known-good commit.
- Do not claim an old alignment was restored when the historical computed style was already `start`; record the distinction between the actual regression and the newly standardized reading preference.
- Do not bundle a typography preference with an iframe geometry fix.
