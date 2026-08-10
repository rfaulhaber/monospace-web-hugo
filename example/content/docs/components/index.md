+++
title = 'Component Reference'
subtitle = 'Every element the theme styles, and the markup that produces it'
date = 2024-01-02T09:00:00-07:00
weight = 10
toc = true
draft = false
+++

Most of this page is plain markdown. The theme styles standard elements to fall
on the grid, so ordinary writing needs no special markup at all. The handful of
extra classes and shortcodes are documented below.

## Text

This is a regular paragraph. Text can be **strong**, _emphasised_, `inline
code`, ~~struck through~~, or a [link](https://gohugo.io). Abbreviations get a
dotted underline: <abbr title="HyperText Markup Language">HTML</abbr>. Keys are
rendered as <kbd>Ctrl</kbd> + <kbd>C</kbd>, and <mark>highlighted text</mark>
inverts the palette.

A horizontal rule is drawn as a double line:

---

Block quotes take a rule in the margin:

> The page is responsive, shrinking in character-sized steps. Standard elements
> should just work, at least that's the goal.

Content can be folded away in a `<details>` element:

<details>
<summary>A short summary of the contents</summary>
<p>Hidden gems.</p>
</details>

## Lists

A plain bulleted list:

* Banana
* Paper boat
* Cucumber
* Rocket

Ordered lists nest with dotted numbering, which is done with CSS counters rather
than the browser's own list markers:

1. Goals
1. Motivations
    1. Intrinsic
    1. Extrinsic
1. Second-order effects

Definition lists:

<dl>
  <dt>Grid cell</dt>
  <dd>One character wide, one line tall. The unit everything is measured in.</dd>
  <dt>Off-grid</dt>
  <dd>An element whose top edge is not on a half-cell boundary.</dd>
</dl>

### Trees

The `tree` shortcode turns a nested markdown list into a directory tree. Note
the percent delimiters — the body has to be parsed as markdown:

```text
{{%/* tree */%}}
- **nvme0n1p2**
    - usr
        - local
        - bin
    - tmp
{{%/* /tree */%}}
```

{{% tree %}}
- **nvme0n1p2**
    - usr
        - local
        - share
        - libexec
        - include
        - sbin
        - src
        - lib64
        - lib
        - bin
        - games
            - solitaire
            - snake
            - tic-tac-toe
        - media
    - media
    - run
    - tmp
{{% /tree %}}

## Tables

Tables adjust to the grid automatically and are responsive. The one rule to know
is that **exactly one column may grow**: mark it `width-auto` and shrink-wrap the
rest with `width-min`.

<table>
<thead>
  <tr>
    <th class="width-min">Name</th>
    <th class="width-auto">Dimensions</th>
    <th class="width-min">Position</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Boboli Obelisk</td>
    <td>1.41m &times; 1.41m &times; 4.87m</td>
    <td>43°45'50.78"N 11°15'3.34"E</td>
  </tr>
  <tr>
    <td>Pyramid of Khafre</td>
    <td>215.25m &times; 215.25m &times; 136.4m</td>
    <td>29°58'34"N 31°07'51"E</td>
  </tr>
</tbody>
</table>

Markdown tables work too; they just have no way to carry the width classes, so
the browser distributes the columns itself.

| Setting | Default |
| ------- | ------- |
| `dateFormat` | `2006-01-02` |
| `listStyle` | `table` |
| `mainSection` | `posts` |

## Forms

Buttons:

<nav>
    <button>Reset</button>
    <button>Save</button>
</nav>

Inputs, laid out with the `grid` shortcode:

{{< grid element="form" >}}
<label>First name <input type="text" placeholder="Placeholder..." /></label>
<label>Last name <input type="text" placeholder="Text goes here..." /></label>
<label>Age <input type="text" value="30" /></label>
{{< /grid >}}

Radio buttons and checkboxes are redrawn as squares and circles on the grid:

{{< grid element="form" >}}
<label><input name="radio" type="radio" /> Option #1</label>
<label><input name="radio" type="radio" /> Option #2</label>
<label><input name="radio" type="checkbox" checked /> Option #3</label>
{{< /grid >}}

## Grids

The `grid` shortcode divides the horizontal space evenly between its children,
rounded down to whole characters — so the total width is usually a little under
100%. Here are six, with increasing cell counts:

{{< grid >}}<input readonly value="1" />{{< /grid >}}
{{< grid >}}<input readonly value="1" /><input readonly value="2" />{{< /grid >}}
{{< grid >}}<input readonly value="1" /><input readonly value="2" /><input readonly value="3" />{{< /grid >}}
{{< grid >}}<input readonly value="1" /><input readonly value="2" /><input readonly value="3" /><input readonly value="4" />{{< /grid >}}
{{< grid >}}<input readonly value="1" /><input readonly value="2" /><input readonly value="3" /><input readonly value="4" /><input readonly value="5" />{{< /grid >}}
{{< grid >}}<input readonly value="1" /><input readonly value="2" /><input readonly value="3" /><input readonly value="4" /><input readonly value="5" /><input readonly value="6" />{{< /grid >}}

To let one cell absorb the remainder, give it `flex-grow: 1`:

{{< grid >}}<input readonly value="1" /><input readonly value="2" /><input readonly value="3!" style="flex-grow: 1;" /><input readonly value="4" /><input readonly value="5" /><input readonly value="6" />{{< /grid >}}

Nine children is the limit. The stylesheet enumerates the cases one at a time,
because `:has(> :last-child:nth-child(n))` cannot be parameterised.

## Code

Fenced code blocks are highlighted by Chroma, restyled here in the theme's own
two-step grey ramp — weight and italics carry the distinctions that colour
normally would.

```go
// gridCellDimensions measures a cell rather than computing it: 1ch depends on
// the font that actually loaded, not the one that was requested.
func Render(w io.Writer, p *Page) error {
    if p == nil {
        return errors.New("nil page")
    }
    return tmpl.ExecuteTemplate(w, "page.html", p)
}
```

## ASCII drawings

Draw in `<pre>` tags with
[box-drawing characters](https://en.wikipedia.org/wiki/Box-drawing_characters):

```
╭─────────────────╮
│ MONOSPACE ROCKS │
╰─────────────────╯
```

Wrap one in a `<figure>` to set it apart and give it a caption:

<figure>
<pre>
┌───────┐ ┌───────┐ ┌───────┐
│Actor 1│ │Actor 2│ │Actor 3│
└───┬───┘ └───┬───┘ └───┬───┘
    │         │         │    
    │         │  msg 1  │    
    │         │────────►│    
    │         │         │    
    │  msg 2  │         │    
    │────────►│         │    
┌───┴───┐ ┌───┴───┐ ┌───┴───┐
│Actor 1│ │Actor 2│ │Actor 3│
└───────┘ └───────┘ └───────┘</pre>
<figcaption>Example: Message passing.</figcaption>
</figure>

Charts work too:

<figure><pre>
                      Things I Have
                                              
    │                                     ████ Usable
15  │
    │                                     ░░░░ Broken
    │
12  │             ░            
    │             ░            
    │   ░         ░              
 9  │   ░         ░              
    │   ░         ░              
    │   ░         ░                    ░
 6  │   █         ░         ░          ░
    │   █         ░         ░          ░
    │   █         ░         █          ░
 3  │   █         █         █          ░
    │   █         █         █          ░
    │   █         █         █          ░
 0  └───▀─────────▀─────────▀──────────▀─────────────
      Socks     Jeans     Shirts   USB Drives
</pre></figure>

## Media

Images and video extend to the width of the page. A standalone image with alt
text becomes a `<figure>` with the alt text as its caption:

![Bryce Canyon National Park (2023)](bryce-canyon.jpg)

The interesting part is invisible: an image's height is decided by its aspect
ratio, so it lands on an arbitrary pixel value and pushes everything below it
off the grid. A small script measures each one on load and on resize, then adds
just enough bottom padding to round it up to a whole number of lines. Turn on
Debug mode and resize the window to watch it hold.
