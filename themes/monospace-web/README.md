# Monospace Web

A Hugo theme port of [the monospace web](https://owickstrom.github.io/the-monospace-web/)
by Oskar Wickström: every element aligned to a grid of character cells.

Requires Hugo **0.146.0 or newer**.

## Quick start

```toml
# hugo.toml
theme = "monospace-web"

# Hugo does not merge these from a theme, so they must live here.
[markup]
  [markup.goldmark]
    [markup.goldmark.parser]
      wrapStandAloneImageWithinParagraph = false
    [markup.goldmark.renderer]
      unsafe = true
  [markup.highlight]
    noClasses = false

[params]
  subtitle  = "A minimalist design exploration"
  author    = "Ada Lovelace"
  authorURL = "https://example.com"
  debugGrid = true   # overlays the character grid, for developing CSS
```

Every param is documented inline in [`hugo.toml`](hugo.toml).

## Full documentation

- **[README](https://github.com/rfaulhaber/monospace-web-hugo#readme)** —
  installation, configuration reference, customising
- **[Live demo](https://rfaulhaber.github.io/monospace-web-hugo/)** — every
  component with the markup that produces it

## Licence

MIT. The stylesheet and grid script are derived from
[the-monospace-web](https://github.com/owickstrom/the-monospace-web), also MIT.
See [LICENSE](LICENSE).
