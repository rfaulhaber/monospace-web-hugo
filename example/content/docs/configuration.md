+++
title = 'Configuration'
subtitle = 'Site params, and the settings Hugo will not let a theme set for you'
date = 2024-01-03T09:00:00-07:00
weight = 20
toc = true
draft = false
+++

## Required site configuration

Hugo merges only some root configuration keys from a theme — `params` and
`menus` among them, `markup` and `pagination` not. Anything the theme put under
`[markup]` would be silently discarded, so these three settings have to live in
your own site's configuration:

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

What each one buys you:

<table>
<thead>
  <tr>
    <th class="width-min">Setting</th>
    <th class="width-auto">Why</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><code>wrapStandAloneImageWithinParagraph</code></td>
    <td>When true (Hugo's default), Goldmark wraps a standalone image in a
    <code>&lt;p&gt;</code>. A <code>&lt;figure&gt;</code> inside a
    <code>&lt;p&gt;</code> is invalid HTML, so the render hook cannot produce
    captioned figures.</td>
  </tr>
  <tr>
    <td><code>unsafe</code></td>
    <td>The design leans on raw HTML in content — tables carrying the width
    classes, <code>&lt;figure&gt;&lt;pre&gt;</code> diagrams, form grids. Without
    it Goldmark strips them.</td>
  </tr>
  <tr>
    <td><code>noClasses</code></td>
    <td>Set to false so Chroma emits classes instead of inline colours, letting
    the stylesheet render code in the theme's palette. Leave it at Hugo's
    default and you get Monokai, which fights the design.</td>
  </tr>
</tbody>
</table>

## Params

All optional. Every one of these has a working default.

### Masthead

<table>
<thead>
  <tr><th class="width-min">Param</th><th class="width-auto">Effect</th></tr>
</thead>
<tbody>
  <tr><td><code>subtitle</code></td><td>Displayed under the site title.</td></tr>
  <tr><td><code>author</code>, <code>authorURL</code></td><td>Adds an "Author" row, linked if a URL is given.</td></tr>
  <tr><td><code>version</code></td><td>Adds a "Version" row.</td></tr>
  <tr><td><code>license</code></td><td>Adds a "License" row.</td></tr>
  <tr><td><code>showUpdated</code></td><td>Adds an "Updated" row from the site's last content change. Default true.</td></tr>
</tbody>
</table>

Rows are built from whichever params are set. Configure none and the masthead
degrades to the site title alone.

### Content

<table>
<thead>
  <tr><th class="width-min">Param</th><th class="width-auto">Effect</th></tr>
</thead>
<tbody>
  <tr><td><code>dateFormat</code></td><td>A Go layout string or a Hugo token such as <code>:date_long</code>. Default <code>2006-01-02</code>.</td></tr>
  <tr><td><code>listStyle</code></td><td><code>table</code> (default) aligns dates and titles in columns; <code>summary</code> uses headings and excerpts. Overridable per page in front matter.</td></tr>
  <tr><td><code>mainSection</code></td><td>Which section the home page lists. Default <code>posts</code>.</td></tr>
  <tr><td><code>homePostCount</code></td><td>How many to show before linking to the full section. Default 10.</td></tr>
  <tr><td><code>toc</code>, <code>tocTitle</code></td><td>Table of contents on every page. Per page: <code>toc = true</code> in front matter.</td></tr>
  <tr><td><code>showLastmod</code></td><td>Show "updated &lt;date&gt;" under a page title when it differs from the publish date.</td></tr>
  <tr><td><code>footer</code></td><td>Markdown replacing the default copyright line.</td></tr>
  <tr><td><code>description</code></td><td>Fallback <code>&lt;meta name=description&gt;</code>.</td></tr>
  <tr><td><code>debugGrid</code></td><td>Adds the Debug mode checkbox. Default false.</td></tr>
</tbody>
</table>

### Appearance

Anything left unset keeps the stylesheet's own value.

```toml
[params.style]
  fontFamily      = '"JetBrains Mono", monospace'
  fontURL         = "https://example.com/jetbrains-mono.css"
  lineHeight      = "1.20rem"
  borderThickness = "2px"
  pageWidth       = "80ch"

  [params.style.light]
    text = "#000"; textAlt = "#666"
    background = "#fff"; backgroundAlt = "#eee"
  [params.style.dark]
    text = "#fff"; textAlt = "#aaa"
    background = "#000"; backgroundAlt = "#111"
```

Light and dark are independent. Setting one does not disturb the other — the
overrides are emitted inside `prefers-color-scheme` queries precisely so that
restyling light mode cannot silently break dark mode.

## Fonts

The theme ships no webfont and makes no network requests. `--font-family`
defaults to a system monospace stack, which renders as Menlo, Cascadia Code, DejaVu
Sans Mono or whatever your reader already has.

To use a specific face, set `fontURL` to a stylesheet that declares it and
`fontFamily` to its name. The theme emits a `<link rel="stylesheet">` with a
`preconnect`, rather than an `@import` inside CSS — an `@import` serialises the
two requests and delays first paint by a full round trip.

Whatever you pick, pick something genuinely monospaced. The entire layout is
measured in `ch` units, which is the advance width of the digit zero; a
proportional font makes `1ch` meaningless and the grid collapses.
