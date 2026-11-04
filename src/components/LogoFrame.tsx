// ---------------------------------------------------------------------------
// LogoFrame — internal composition helper
// ---------------------------------------------------------------------------
//
// Composes `ProductIcon`, `ProductRootName`, `ProductSuffix`, and the Comete
// tagline into the full logo shape for a given entity. All top-level logo
// components (`Comete`, `OnTime`, `Link`, `Bi`, `Mce`, `Academie`, `Club`)
// are thin wrappers around this helper.
//
// Layout rules:
//   format="icon"                  → just `ProductIcon` (square).
//   format="wordmark"              → the standalone Figma wordmark drawing
//                                    (letters + ring "o", no icon), scaled to
//                                    the row height; suffix / tagline rules
//                                    unchanged.
//   taglineAlign="none"               → 144×32 wordmark + icon overlay.
//   taglineAlign="inline" (non-comete)→ wordmark + icon overlay + suffix inline.
//   taglineAlign="column" (non-comete)→ wordmark + icon overlay, suffix scaled 0.6
//                                    on a second row.
//   taglineAlign="column" (comete-*)   → wordmark + icon + "logiciels de la
//                                    sécurité privée" tagline below.
//   `comete` is the ERP logo (defaults to no tagline), `comete-company`
//   the company logo (defaults to the tagline below) — same artwork.
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
//   entity-specific `iconX` value (in wordmark-coordinate units). At
//   `size=32` the wordmark viewBox is 144 units → 1 unit = 1 pixel, so
//   the pixel offset is `iconX * size / 32`.
// - The icon's own viewBox is offset to `${iconX} 0 32 32` so its path
//   coordinates render at the same absolute position they had in the
//   legacy single-SVG version — hence the overlay matches pixel-for-pixel.

import type { CSSProperties, ReactElement } from "react";
import { getFallback } from "../fallbacks";
import {
  TAGLINE_NATURAL_HEIGHT,
  TAGLINE_NATURAL_WIDTH,
  TAGLINE_PATHS,
  TAGLINE_VIEWBOX,
} from "../tagline-paths";
import type {
  LogoAppearance,
  LogoColors,
  LogoEntity,
  LogoFormat,
  LogoTaglineAlign,
} from "../types";
import {
  WORDMARK_NATURAL_HEIGHT,
  WORDMARK_NATURAL_WIDTH,
} from "../wordmark-paths";
import { getEntityIconX, ProductIcon } from "./ProductIcon";
import { ProductRootName } from "./ProductRootName";
import { ProductSuffix, type ProductSuffixProduct } from "./ProductSuffix";

// ---------------------------------------------------------------------------
// Public types

type FrameEntity = Exclude<LogoEntity, "mycomete">;

export interface LogoFrameProps {
  /** Target entity. */
  entity: FrameEntity;
  /** Visual appearance. @default "brand" */
  appearance?: LogoAppearance;
  /** Display format. @default "logo" */
  format?: LogoFormat;
  /** TaglineAlign display mode. @default "inline" ("column" for comete-company) */
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

type CometeEntity = "comete-software" | "comete-company";
type SuffixedEntity = Exclude<FrameEntity, CometeEntity>;

const SUFFIX_PRODUCT_MAP: Record<SuffixedEntity, ProductSuffixProduct> = {
  ontime: "ontime",
  link: "link",
  bi: "bi",
  mce: "mce",
  academie: "academie",
  club: "club",
  cafe: "cafe",
};

/** Hardcoded taglineAlign placement per entity. */
const PARTICLE_POSITION: Record<
  SuffixedEntity,
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

// Gap between the wordmark row and the tagline (Figma: 4.65 units of a 32 row).
const COMETE_TAGLINE_GAP = 4.65;

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
// Comete tagline (inline-rendered because it's bespoke to this one entity).

function CometeTagline({
  size,
  fallback,
}: {
  /** Height of the wordmark row in pixels (the tagline width matches). */
  size: number;
  /** Hex to paint with in fallback mode, rather than `--_logo-subtle`. */
  fallback?: string;
}): ReactElement {
  // Natural box 141.4 × 7.35 in wordmark-row units (32 = `size`).
  const width = (size * TAGLINE_NATURAL_WIDTH) / 32;
  const height = (size * TAGLINE_NATURAL_HEIGHT) / 32;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={TAGLINE_VIEWBOX}
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {TAGLINE_PATHS.map((d) => (
        <path
          key={d}
          d={d}
          style={{ fill: fallback ?? "var(--_logo-subtle)" }}
        />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component

/**
 * LogoFrame — composes the three public logo parts into the full logo shape.
 *
 * Not meant to be consumed directly by application code: use one of the
 * entity-specific wrappers (`Comete`, `OnTime`, etc.) or the generic
 * `Logo` component instead.
 */
export function LogoFrame({
  entity,
  appearance = "brand",
  format = "logo",
  taglineAlign: taglineAlignProp,
  size = 32,
  colors,
  className,
}: LogoFrameProps): ReactElement {
  // Default placement: "inline" everywhere, except the company logo whose
  // identity is the wordmark + tagline ("column").
  const taglineAlign: LogoTaglineAlign =
    taglineAlignProp ?? (entity === "comete-company" ? "column" : "inline");
  const hasFallback = colors !== undefined;
  const cls = wrapperClass(appearance, hasFallback, className);
  // Suffix/tagline tone in fallback mode depends on the surface the
  // appearance targets (white for brand/neutral, navy for inverted).
  const fallbackSubtle = colors
    ? (colors.subtle ?? getFallback(appearance).subtle)
    : undefined;
  const vars = fallbackVars(colors, fallbackSubtle);

  // ---------- Icon-only format -------------------------------------------
  if (format === "icon") {
    return (
      <span className={cls} style={{ display: "inline-flex", ...vars }}>
        <ProductIcon entity={entity} appearance={appearance} size={size} />
      </span>
    );
  }

  // ---------- Full logo: wordmark + icon overlay (+ optional suffix) ------
  // format="wordmark" → the "o" is a letter, no icon overlay.
  const isWordmark = format === "wordmark";
  const iconX = getEntityIconX(entity);
  const iconLeftPx = (iconX * size) / 32;

  // Row width: 144 units for the logo letters, the Figma wordmark box ratio
  // for the wordmark drawing (both rendered at `size` height).
  const rowWidth = isWordmark
    ? (size * WORDMARK_NATURAL_WIDTH) / WORDMARK_NATURAL_HEIGHT
    : (144 * size) / 32;

  // Wordmark row: position:relative so the icon can overlay at iconX.
  const wordmarkRow = (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: rowWidth,
        height: size,
        lineHeight: 0,
      }}
    >
      <ProductRootName
        appearance={appearance}
        size={size}
        format={isWordmark ? "wordmark" : "logo"}
      />
      {!isWordmark && (
        <span
          style={{
            position: "absolute",
            left: iconLeftPx,
            top: 0,
          }}
        >
          <ProductIcon entity={entity} appearance={appearance} size={size} />
        </span>
      )}
    </span>
  );

  // Comete (ERP or company) — taglineAlign is the tagline (or nothing).
  if (entity === "comete-software" || entity === "comete-company") {
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
    // taglineAlign="column" → wordmark above, tagline below (Figma gap 4.65u).
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
        <span style={{ marginTop: (COMETE_TAGLINE_GAP * size) / 32 }}>
          <CometeTagline size={size} fallback={fallbackSubtle} />
        </span>
      </span>
    );
  }

  // Non-comete products — map to a ProductSuffix (when taglineAlign !== "none").
  const suffixed: SuffixedEntity = entity;
  const suffixProduct = SUFFIX_PRODUCT_MAP[suffixed];
  const pos = PARTICLE_POSITION[suffixed];

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
