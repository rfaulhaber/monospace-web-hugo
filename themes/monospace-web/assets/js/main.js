/**
 * Adapted from the-monospace-web by Oskar Wickström.
 * Licensed under the MIT License
 * (https://github.com/owickstrom/the-monospace-web/blob/main/LICENSE.md)
 *
 * Two jobs:
 *
 *  1. Keep media on the grid. An image's rendered height is dictated by its
 *     aspect ratio and the column width, so it lands on an arbitrary pixel
 *     value. Left alone it pushes everything below it off the character grid.
 *     We measure it and add just enough bottom padding to round it up to a
 *     whole number of cells.
 *
 *  2. Drive the debug overlay, which paints the grid and flags any element
 *     whose top edge is not on a half-cell boundary.
 */

(() => {
  "use strict";

  // Measure a cell by rendering one, rather than parsing --line-height: the
  // value is in rem and 1ch depends on the font that actually loaded.
  function gridCellDimensions() {
    const element = document.createElement("div");
    element.style.position = "fixed";
    element.style.height = "var(--line-height)";
    element.style.width = "1ch";
    document.body.appendChild(element);
    const rect = element.getBoundingClientRect();
    document.body.removeChild(element);
    return { width: rect.width, height: rect.height };
  }

  function adjustMediaPadding() {
    const cell = gridCellDimensions();
    if (cell.height === 0) return;

    function setHeightFromRatio(media, ratio) {
      const rect = media.getBoundingClientRect();
      const realHeight = rect.width / ratio;
      const diff = cell.height - (realHeight % cell.height);
      media.style.setProperty("padding-bottom", `${diff}px`);
    }

    // Used when intrinsic dimensions are unavailable (a broken image, a video
    // that never loaded metadata): assume 2:1 and snap to the nearest cell.
    function setFallbackHeight(media) {
      const rect = media.getBoundingClientRect();
      const height = Math.round(rect.width / 2 / cell.height) * cell.height;
      media.style.setProperty("height", `${height}px`);
    }

    function onMediaLoaded(media) {
      let width, height;
      switch (media.tagName) {
        case "IMG":
          width = media.naturalWidth;
          height = media.naturalHeight;
          break;
        case "VIDEO":
          width = media.videoWidth;
          height = media.videoHeight;
          break;
      }
      if (width > 0 && height > 0) {
        setHeightFromRatio(media, width / height);
      } else {
        setFallbackHeight(media);
      }
    }

    for (const media of document.querySelectorAll("img, video")) {
      switch (media.tagName) {
        case "IMG":
          if (media.complete) {
            onMediaLoaded(media);
          } else {
            media.addEventListener("load", () => onMediaLoaded(media));
            media.addEventListener("error", () => setFallbackHeight(media));
          }
          break;
        case "VIDEO":
          switch (media.readyState) {
            case HTMLMediaElement.HAVE_CURRENT_DATA:
            case HTMLMediaElement.HAVE_FUTURE_DATA:
            case HTMLMediaElement.HAVE_ENOUGH_DATA:
              onMediaLoaded(media);
              break;
            default:
              media.addEventListener("loadeddata", () => onMediaLoaded(media));
              media.addEventListener("error", () => setFallbackHeight(media));
              break;
          }
          break;
      }
    }
  }

  // Table internals are positioned by the table, not the grid, so flagging them
  // would be noise.
  const IGNORED_TAGS = new Set(["THEAD", "TBODY", "TFOOT", "TR", "TD", "TH"]);

  // A half-cell is 9.6px at the default 16px root, and neither 9.6 nor the
  // sub-pixel values getBoundingClientRect returns are exactly representable in
  // binary floating point: `124.8 % 9.6` evaluates to ~1.4e-14, not 0. Testing
  // the remainder against zero therefore flags almost every element on the
  // page. Anything genuinely misaligned is off by whole pixels, so half a pixel
  // of slack separates the two cases cleanly.
  const TOLERANCE_PX = 0.5;

  function checkOffsets() {
    const cell = gridCellDimensions();
    if (cell.height === 0) return;
    const half = cell.height / 2;
    const elements = document.querySelectorAll(
      "body :not(.debug-grid, .debug-toggle)",
    );
    for (const element of elements) {
      if (IGNORED_TAGS.has(element.tagName)) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      const remainder = (rect.top + window.scrollY) % half;
      const drift = Math.min(remainder, half - remainder);
      element.classList.toggle("off-grid", drift > TOLERANCE_PX);
    }
  }

  function onResize() {
    adjustMediaPadding();
    if (document.body.classList.contains("debug")) checkOffsets();
  }

  adjustMediaPadding();
  window.addEventListener("load", adjustMediaPadding);
  window.addEventListener("resize", onResize);

  // Absent unless the site enables params.debugGrid.
  const debugToggle = document.querySelector(".debug-toggle");
  if (debugToggle) {
    const onDebugToggle = () => {
      document.body.classList.toggle("debug", debugToggle.checked);
      if (debugToggle.checked) checkOffsets();
    };
    debugToggle.addEventListener("change", onDebugToggle);
    onDebugToggle();
  }
})();
