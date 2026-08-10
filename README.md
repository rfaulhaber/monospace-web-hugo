# monospace-web-hugo

A Hugo theme port of [the monospace web](https://owickstrom.github.io/the-monospace-web/)
by Oskar Wickström — a design where every element is aligned to a grid of
character cells, one character wide by one line tall.

**[Live demo and component reference →](https://rfaulhaber.github.io/monospace-web-hugo/)**

No build step, no CSS framework, no webfont downloads, and about 130 lines of
JavaScript whose only job is keeping images on the grid.

```
╭─────────────────╮
│ MONOSPACE ROCKS │
╰─────────────────╯
```

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Required site configuration](#required-site-configuration)
- [Configuration](#configuration)
- [Writing content](#writing-content)
- [Customising](#customising)
- [Debug mode](#debug-mode)
- [Development](#development)
- [Credits and licence](#credits-and-licence)

## Requirements

Hugo **0.146.0 or newer**, standard or extended. That is the release which
introduced the template system this theme is written against
(`layouts/page.html`, `layouts/_partials/`, `layouts/_markup/`); on older
versions Hugo will refuse to load the theme rather than fail confusingly.

## Installation

### As a Hugo module (recommended)

```sh
hugo mod init github.com/you/your-site
```

```toml
# hugo.toml
[module]
  [[module.imports]]
    path = "github.com/rfaulhaber/monospace-web-hugo/themes/monospace-web"
```

Update later with `hugo mod get -u`.

### As a git submodule

```sh
git submodule add https://github.com/rfaulhaber/monospace-web-hugo.git themes/monospace-web-hugo
```

```toml
# hugo.toml
theme = "monospace-web-hugo/themes/monospace-web"
```

### By copying

Copy `themes/monospace-web/` into your site's `themes/` directory and set
`theme = "monospace-web"`. Simplest to start with, hardest to update.

## Required site configuration

Hugo merges only a subset of root configuration keys from a theme — `params`
and `menus` among them, `markup` and `pagination` not. Anything the theme
declared under `[markup]` would be discarded without a word, so these settings
have to live in **your** site's configuration:

```toml
[markup]
  [markup.goldmark]
    [markup.goldmark.parser]
      wrapStandAloneImageWithinParagraph = false
    [markup.goldmark.renderer]
      unsafe = true
  [markup.highlight]
    noClasses = false
```

| Setting | Why it matters | If you skip it |
| --- | --- | --- |
| `wrapStandAloneImageWithinParagraph` | Lets the image render hook see `.IsBlock`. | Images render bare; no captioned `<figure>`. |
| `unsafe` | The design uses raw HTML in content — tables carrying the width classes, `<figure><pre>` diagrams, form grids. | Goldmark strips that markup. |
| `noClasses` | Chroma emits classes the stylesheet can restyle. | Code blocks render in Monokai, clashing with the monochrome palette. |

`example/hugo.toml` is a complete, working configuration to copy from.

## Configuration

Every param below is optional and has a working default.

### Masthead

The site header is a table pairing the title against a right-aligned block of
metadata. Rows appear only for the params you set; configure none and it
degrades to the title alone.

```toml
[params]
  subtitle    = "A minimalist design exploration"
  author      = "Ada Lovelace"
  authorURL   = "https://example.com"
  version     = "v1.0.0"
  license     = "MIT"
  showUpdated = true   # "Updated" row, from the site's last content change
```

### Content

| Param | Default | Effect |
| --- | --- | --- |
| `dateFormat` | `2006-01-02` | Go layout string, or a Hugo token such as `:date_long`. |
| `listStyle` | `table` | `table` aligns dates and titles in columns; `summary` uses headings and excerpts. Overridable per page in front matter. |
| `mainSection` | `posts` | Which section the home page lists. Falls back to all regular pages if the section is empty. |
| `homePostCount` | `10` | How many posts the home page shows before linking to the full section. |
| `homePostsHeading` | `Posts` | Heading above that list. |
| `toc` / `tocTitle` | `false` / `Contents` | Table of contents. Per page: `toc = true` in front matter. |
| `showLastmod` | `false` | Show "updated *date*" under a page title when it differs from the publish date. |
| `footer` | — | Markdown replacing the default copyright line. |
| `copyrightYear` | current year | Start year; renders as a range once the years differ. |
| `description` | — | Fallback `<meta name="description">`. |
| `favicon` | — | Path to an icon. Omit to rely on `/favicon.ico` auto-discovery. |
| `debugGrid` | `false` | Adds the Debug mode checkbox. See below. |
| `languageDirection` | — | Sets `dir` on `<html>`; use `rtl` where appropriate. |

### Appearance

Overrides are emitted as CSS custom properties. Anything left unset keeps the
stylesheet's own value.

```toml
[params.style]
  fontFamily      = '"JetBrains Mono", monospace'
  fontURL         = "https://example.com/jetbrains-mono.css"
  lineHeight      = "1.20rem"
  borderThickness = "2px"
  pageWidth       = "80ch"

  [params.style.light]
    text = "#000"
    textAlt = "#666"
    background = "#fff"
    backgroundAlt = "#eee"
  [params.style.dark]
    text = "#fff"
    textAlt = "#aaa"
    background = "#000"
    backgroundAlt = "#111"
```

Light and dark are independent: the overrides are emitted inside
`prefers-color-scheme` queries, so restyling one scheme cannot silently break
the other. Dark mode follows the reader's system preference and there is no
toggle — matching upstream.

### Fonts

The theme ships no webfont and makes no third-party requests. `--font-family`
defaults to a system monospace stack (`ui-monospace`, Cascadia Code, Menlo,
DejaVu Sans Mono, …), which is fast, private, and already installed.

To use a specific face, point `fontURL` at a stylesheet declaring it and set
`fontFamily` to its name. The theme emits a `<link rel="stylesheet">` with a
`preconnect` rather than an `@import` inside CSS — an `@import` serialises the
two requests and delays first paint by a full round trip.

Whatever you choose, choose something genuinely monospaced. The layout is
measured in `ch` units — the advance width of the digit zero — so a
proportional font makes `1ch` meaningless and the grid collapses.

## Writing content

Most content needs no special markup: the theme styles standard elements to land
on the grid. The extras are these.

### Width classes

Tables adjust to the grid automatically. **Exactly one column may grow** — mark
it `width-auto` and shrink-wrap the rest with `width-min`.

```html
<table>
  <thead>
    <tr>
      <th class="width-min">Name</th>
      <th class="width-auto">Description</th>
    </tr>
  </thead>
  ...
</table>
```

### `tree`

Turns a nested markdown list into a directory tree. Use the percent
delimiters — the body has to be parsed as markdown.

```markdown
{{%/* tree */%}}
- **nvme0n1p2**
    - usr
        - local
        - bin
    - tmp
{{%/* /tree */%}}
```

### `grid`

Divides horizontal space evenly between its children, rounded down to whole
characters, so the total is usually a little under 100%. Up to nine children —
the stylesheet enumerates the cases one at a time, because
`:has(> :last-child:nth-child(n))` cannot be parameterised. Pass
`element="form"` to emit a `<form>`.

```markdown
{{</* grid element="form" */>}}
<label>First name <input type="text" /></label>
<label>Last name <input type="text" /></label>
{{</* /grid */>}}
```

To let one cell absorb the remainder, give it `style="flex-grow: 1"`.

### ASCII diagrams

Wrap [box-drawing characters](https://en.wikipedia.org/wiki/Box-drawing_characters)
in `<figure><pre>` to set them apart and add a caption. Fenced code blocks work
too.

### Images

A standalone image with alt text becomes a `<figure>` with the alt text as its
caption. Images in a [page bundle](https://gohugo.io/content-management/page-bundles/)
also get intrinsic `width`/`height` attributes, so the browser can reserve space
before they load.

## Customising

Override any template by copying it to the same path in your own site —
`layouts/_partials/footer.html` shadows the theme's copy. The useful seams:

| File | Purpose |
| --- | --- |
| `layouts/_partials/masthead.html` | The header table and menu. |
| `layouts/_partials/footer.html` | Simpler to set `params.footer` first. |
| `layouts/_partials/post-list.html` | How page lists render. |
| `layouts/_markup/render-image.html` | Image markup and figure captions. |
| `assets/css/main.css` | Shadowing this replaces the stylesheet wholesale; for colours and metrics prefer `[params.style]`. |

The stylesheet is deliberately a near-verbatim copy of upstream's `index.css`,
with divergences confined to a clearly marked section at the bottom. That keeps
it cheap to diff against upstream when it changes.

## Debug mode

```toml
[params]
  debugGrid = true
```

Adds a **Debug mode** checkbox to the header. Ticking it overlays the character
grid and highlights, in red, any element whose top edge does not sit on a
half-cell boundary.

This is the tool to reach for when writing custom CSS. The single rule that
governs the whole design is that **every vertical measurement is a multiple of
`--line-height`**; the overlay is how you find out where you broke it.

## Development

With Nix:

```sh
nix develop           # hugo + prettier
nix build             # render the example site to result/
```

Without:

```sh
hugo server --source example
```

The example site in `example/` is both the demo and the test fixture: it
exercises every component the theme styles. CI builds it with
`--panicOnWarning`, so a deprecation warning or a missing layout fails the
build.

`themes/monospace-web/` deliberately contains no `content/` directory. Hugo
mounts a theme's content into the consuming site, so demo posts shipped there
would appear in every site that installs the theme.

## Credits and licence

Design and original CSS/JS by [Oskar Wickström](https://wickstrom.tech/)
([the-monospace-web](https://github.com/owickstrom/the-monospace-web)), MIT
licensed. Hugo port by [Ryan Faulhaber](https://github.com/rfaulhaber), also MIT.
See [LICENSE](LICENSE).

Original inspiration: [U.S. Graphics Company](https://x.com/usgraphics).
