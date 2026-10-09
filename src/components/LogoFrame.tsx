// ---------------------------------------------------------------------------
// LogoFrame — internal composition helper
// ---------------------------------------------------------------------------
//
// Composes `ProductIcon`, `ProductRootName`, `ProductSuffix`, and the Comete
// tagline into the full logo shape for a given product. All top-level logo
// components (`Comete`, `OnTime`, `Link`, `Bi`, `Mce`, `Academie`, `Club`)
// are thin wrappers around this helper.
//
// Layout rules:
//   format="icon"                  → just `ProductIcon` (square).
//   taglineAlign="none"               → 144×32 wordmark + icon overlay.
//   taglineAlign="inline" (non-comete)→ wordmark + icon overlay + suffix inline.
//   taglineAlign="column" (non-comete)→ wordmark + icon overlay, suffix scaled 0.6
//                                    on a second row.
//   taglineAlign="column" (comete)    → wordmark + icon + "gestion pour la
//                                    sécurité privée" tagline below.
//
// Fallback colors (`colors` prop) are applied as CSS custom-property
// overrides on the wrapper — `ProductIcon`, `ProductRootName`, and
// `ProductSuffix` already consume the same custom properties, so the
// override cascades into each of them without touching their code.
//
// MyComete has a unique artwork (cloud + comet + "my" + "comète") and is
// kept as its own bespoke component outside of this composition path.
//
// Design notes:
// - The icon is positioned absolutely over the wordmark using the
//   product-specific `iconX` value (in wordmark-coordinate units). At
//   `size=32` the wordmark viewBox is 144 units → 1 unit = 1 pixel, so
//   the pixel offset is `iconX * size / 32`.
// - The icon's own viewBox is offset to `${iconX} 0 32 32` so its path
//   coordinates render at the same absolute position they had in the
//   legacy single-SVG version — hence the overlay matches pixel-for-pixel.

import type { CSSProperties, ReactElement } from "react";
import { getFallback } from "../fallbacks";
import { TAGLINE_PATHS } from "../tagline-paths";
import type {
  LogoAppearance,
  LogoColors,
  LogoFormat,
  LogoProduct,
  LogoTaglineAlign,
} from "../types";
import { getProductIconX, ProductIcon } from "./ProductIcon";
import { ProductRootName } from "./ProductRootName";
import { ProductSuffix, type ProductSuffixProduct } from "./ProductSuffix";

// ---------------------------------------------------------------------------
// Public types

type FrameProduct = Exclude<LogoProduct, "mycomete">;

export interface LogoFrameProps {
  /** Target product. */
  product: FrameProduct;
  /** Visual appearance. @default "brand" */
  appearance?: LogoAppearance;
  /** Display format. @default "logo" */
  format?: LogoFormat;
  /** TaglineAlign display mode. @default "inline" */
  taglineAlign?: LogoTaglineAlign;
  /** Rendered row height in pixels. @default 32 */
  size?: number;
  /** Optional explicit colour overrides (bypasses CSS tokens). */
  colors?: LogoColors;
  /** Additional CSS class on the wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Suffix mapping (products that have a ProductSuffix; comete handled inline).

const SUFFIX_PRODUCT_MAP: Record<
  Exclude<FrameProduct, "comete">,
  ProductSuffixProduct
> = {
  ontime: "ontime",
  link: "link",
  bi: "bi",
  mce: "mce",
  academie: "academie",
  club: "club",
  cafe: "cafe",
};

/** Hardcoded taglineAlign placement per product. */
const PARTICLE_POSITION: Record<
  Exclude<FrameProduct, "comete">,
  { inline: "right" | "left"; column: "top" | "bottom" }
> = {
  ontime: { inline: "right", column: "bottom" },
  link: { inline: "right", column: "bottom" },
  bi: { inline: "right", column: "bottom" },
  mce: { inline: "right", column: "bottom" },
  academie: { inline: "right", column: "bottom" },
  club: { inline: "right", column: "bottom" },
  cafe: { inline: "left", column: "top" },
};

// Scale applied to the suffix on `taglineAlign="column"` (matches legacy column layout).
const COLUMN_SCALE = 0.6;

// Tagline viewBox for comete column taglineAlign (= BOTTOM_VIEWBOX - wordmark row).
const COMETE_TAGLINE_VIEWBOX = "0 0 141 7";

// ---------------------------------------------------------------------------
// Helpers

/**
 * Build inline style that overrides the `--_logo-*` CSS custom properties
 * when the caller provided explicit `colors`. Each child component already
 * reads these variables, so the override cascades through the wrapper.
 */
function fallbackVars(
  colors: LogoColors | undefined,
  subtle: string | undefined,
): CSSProperties | undefined {
  if (!colors) return undefined;
  // Cast: React's CSSProperties doesn't model custom properties.
  const vars = {
    "--_logo-text": colors.text,
    "--_logo-icon": colors.icon,
    "--_logo-gradient-light": colors.gradientLight,
    "--_logo-gradient-dark": colors.gradientDark,
    "--_logo-subtle": subtle,
  } as Record<string, string>;
  return vars as CSSProperties;
}

/** Compose the wrapper class list (appearance class only when no fallback). */
function wrapperClass(
  appearance: LogoAppearance,
  fallback: boolean,
  className?: string,
): string | undefined {
  const parts: string[] = [];
  if (!fallback) parts.push(`comete-logo--${appearance}`);
  if (className) parts.push(className);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

// ---------------------------------------------------------------------------
// Comete tagline (inline-rendered because it's bespoke to this one product).

function CometeTagline({
  size,
  fallback,
}: {
  /** Height of the wordmark row in pixels (the tagline width matches). */
  size: number;
  /** Hex to paint with in fallback mode, rather than `--_logo-subtle`. */
  fallback?: string;
}): ReactElement {
  // Width: the tagline is natively ~141u wide, the wordmark is 144u, so we
  // keep wordmark width (144) to align both rows.
  const width = size * (144 / 32);
  const height = size * (7 / 32);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={COMETE_TAGLINE_VIEWBOX}
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <g transform="translate(1.5, 0)">
        {TAGLINE_PATHS.map((d) => (
          <path
            key={d}
            d={d}
            style={{ fill: fallback ?? "var(--_logo-subtle)" }}
          />
        ))}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component

/**
 * LogoFrame — composes the three public logo parts into the full logo shape.
 *
 * Not meant to be consumed directly by application code: use one of the
 * product-specific wrappers (`Comete`, `OnTime`, etc.) or the generic
 * `Logo` component instead.
 */
export function LogoFrame({
  product,
  appearance = "brand",
  format = "logo",
  taglineAlign = "inline",
  size = 32,
  colors,
  className,
}: LogoFrameProps): ReactElement {
  const hasFallback = colors !== undefined;
  const cls = wrapperClass(appearance, hasFallback, className);
  // Suffix/tagline tone in fallback mode depends on the surface the
  // appearance targets (white for brand/neutral, navy for inverse).
  const fallbackSubtle = colors
    ? (colors.subtle ?? getFallback(appearance).subtle)
    : undefined;
  const vars = fallbackVars(colors, fallbackSubtle);

  // ---------- Icon-only format -------------------------------------------
  if (format === "icon") {
    return (
      <span className={cls} style={{ display: "inline-flex", ...vars }}>
        <ProductIcon product={product} appearance={appearance} size={size} />
      </span>
    );
  }

  // ---------- Full logo: wordmark + icon overlay (+ optional suffix) ------
  const iconX = getProductIconX(product);
  const iconLeftPx = (iconX * size) / 32;

  // Wordmark row: position:relative so the icon can overlay at iconX.
  const wordmarkRow = (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: (144 * size) / 32,
        height: size,
        lineHeight: 0,
      }}
    >
      <ProductRootName appearance={appearance} size={size} />
      <span
        style={{
          position: "absolute",
          left: iconLeftPx,
          top: 0,
        }}
      >
        <ProductIcon product={product} appearance={appearance} size={size} />
      </span>
    </span>
  );

  // Comete — taglineAlign is the tagline (or nothing).
  if (product === "comete") {
    if (taglineAlign !== "column") {
      return (
        <span
          className={cls}
          style={{ display: "inline-flex", lineHeight: 0, ...vars }}
        >
          {wordmarkRow}
        </span>
      );
    }
    // taglineAlign="column" → wordmark above, tagline below at y≈35 (3u gap).
    return (
      <span
        className={cls}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "flex-start",
          lineHeight: 0,
          ...vars,
        }}
      >
        {wordmarkRow}
        <span style={{ marginTop: (3 * size) / 32 }}>
          <CometeTagline size={size} fallback={fallbackSubtle} />
        </span>
      </span>
    );
  }

  // Non-comete products — map to a ProductSuffix (when taglineAlign !== "none").
  const suffixProduct = SUFFIX_PRODUCT_MAP[product];
  const pos = PARTICLE_POSITION[product];

  if (taglineAlign === "none") {
    return (
      <span
        className={cls}
        style={{ display: "inline-flex", lineHeight: 0, ...vars }}
      >
        {wordmarkRow}
      </span>
    );
  }

  if (taglineAlign === "inline") {
    const gap = (11 * size) / 32;
    const suffixEl = (
      <ProductSuffix
        product={suffixProduct}
        appearance={appearance}
        size={size}
      />
    );
    return (
      <span
        className={cls}
        style={{
          display: "inline-flex",
          alignItems: "center",
          lineHeight: 0,
          ...vars,
        }}
      >
        {pos.inline === "left" && (
          <span style={{ marginRight: gap }}>{suffixEl}</span>
        )}
        {wordmarkRow}
        {pos.inline === "right" && suffixEl}
      </span>
    );
  }

  // taglineAlign === "column" → wordmark row + suffix scaled 0.6 on row 2.
  const suffixSize = size * COLUMN_SCALE;
  const gap = (3 * size) / 32;
  const suffixEl = (
    <span
      style={
        pos.column === "bottom" ? { marginTop: gap } : { marginBottom: gap }
      }
    >
      <ProductSuffix
        product={suffixProduct}
        appearance={appearance}
        size={suffixSize}
      />
    </span>
  );
  return (
    <span
      className={cls}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: pos.column === "bottom" ? "flex-end" : "flex-start",
        lineHeight: 0,
        ...vars,
      }}
    >
      {pos.column === "top" && suffixEl}
      {wordmarkRow}
      {pos.column === "bottom" && suffixEl}
    </span>
  );
}

LogoFrame.displayName = "LogoFrame";
