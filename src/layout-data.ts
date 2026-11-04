// ---------------------------------------------------------------------------
// Column-layout configuration for product logos
// ---------------------------------------------------------------------------
//
// When align="column", the product name text is repositioned below the
// "Comete" wordmark using an SVG <g transform="...">. The values below
// are derived from the Figma column layout (node 2935:5994) normalised
// to the standard 32-height viewBox system:
//
//   Row 1 (y 0..32):  wordmark "comete" + comet icon (unchanged)
//   Row 2 (y ~35+):   product name, scaled by COLUMN_SCALE, right-aligned
//                      so its right edge meets x = 144 (= wordmark width)
//
// Formula per product:
//   tx = RIGHT_EDGE - COLUMN_SCALE * maxX
//   ty = COLUMN_Y - COLUMN_SCALE * minY
//   transform = `translate(tx, ty) scale(COLUMN_SCALE)`

/** Uniform scale applied to the product-name text in column layout. */
export const COLUMN_SCALE = 0.6;

/** Y position of the product-name text top in column layout. */
const COLUMN_Y = 35;

/** Right edge for product name alignment (2px margin from viewBox edge). */
const RIGHT_EDGE = 142;

/** Column viewBox — same for all products (width = wordmark, height fits two rows). */
export const COLUMN_VIEWBOX = "0 0 144 60";

/** Wordmark-only viewBox — used when suffix="none" (hide product name, show only wordmark). */
export const WORDMARK_VIEWBOX = "0 0 144 32";

/**
 * Per-product column layout configuration.
 *
 * `rowViewBox`:            original viewBox (row layout)
 * `productNameTransform`:  SVG transform for the <g> wrapping product-name paths
 *
 * Bounding boxes (minX, maxX, minY) are approximated from the SVG path data.
 */
export const ENTITY_LAYOUTS = {
  ontime: {
    rowViewBox: "0 0 286 32",
    productNameTransform: `translate(${r(RIGHT_EDGE - COLUMN_SCALE * 284.5)}, ${r(COLUMN_Y - COLUMN_SCALE * 2)}) scale(${COLUMN_SCALE})`,
  },
  link: {
    rowViewBox: "0 0 217 32",
    productNameTransform: `translate(${r(RIGHT_EDGE - COLUMN_SCALE * 217.1)}, ${r(COLUMN_Y - COLUMN_SCALE * 2.6)}) scale(${COLUMN_SCALE})`,
  },
  bi: {
    rowViewBox: "0 0 185 32",
    productNameTransform: `translate(${r(RIGHT_EDGE - COLUMN_SCALE * 185.6)}, ${r(COLUMN_Y - COLUMN_SCALE * 2.76)}) scale(${COLUMN_SCALE})`,
  },
  club: {
    rowViewBox: "0 0 236 32",
    productNameTransform: `translate(${r(RIGHT_EDGE - COLUMN_SCALE * 234.7)}, ${r(COLUMN_Y - COLUMN_SCALE * 0)}) scale(${COLUMN_SCALE})`,
  },
  mce: {
    rowViewBox: "0 0 234 32",
    productNameTransform: `translate(${r(RIGHT_EDGE - COLUMN_SCALE * 233.7)}, ${r(COLUMN_Y - COLUMN_SCALE * 10.5)}) scale(${COLUMN_SCALE})`,
  },
  academie: {
    rowViewBox: "0 0 350 32",
    productNameTransform: `translate(${r(RIGHT_EDGE - COLUMN_SCALE * 348.9)}, ${r(COLUMN_Y - COLUMN_SCALE * 2.1)}) scale(${COLUMN_SCALE})`,
  },
  cafe: {
    rowViewBox: "0 0 214 32",
    productNameTransform: `translate(${r(RIGHT_EDGE - COLUMN_SCALE * 56.5)}, ${r(COLUMN_Y - COLUMN_SCALE * 0)}) scale(${COLUMN_SCALE})`,
  },
} as const;

/** Round to 2 decimal places for readable SVG transform values. */
function r(n: number): number {
  return Math.round(n * 100) / 100;
}
