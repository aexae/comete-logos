import fs from "node:fs";

const DIR = "figma-export";
const read = (f) => fs.readFileSync(`${DIR}/${f}`, "utf8");

function parse(file) {
  const s = read(file);
  const vb = /viewBox="([^"]+)"/.exec(s)[1];
  const w = Number(/width="(\d+)"/.exec(s)[1]);
  const h = Number(/height="(\d+)"/.exec(s)[1]);
  const paths = [...s.matchAll(/<path\s+d="([^"]+)"/g)].map((m) => m[1]);
  return { vb, w, h, paths };
}

const icon = parse(
  "entity=orca, appearance=black, format=icon, align=none.svg",
);
const inline = parse(
  "entity=orca, appearance=black, format=logo, align=none.svg",
);
const column = parse(
  "entity=orca, appearance=black, format=logo, align=column.svg",
);

// Controle : les variantes blanches doivent avoir EXACTEMENT la meme geometrie.
for (const [b, wf] of [
  [icon, "entity=orca, appearance=white, format=icon, align=none.svg"],
  [inline, "entity=orca, appearance=white, format=logo, align=none.svg"],
  [column, "entity=orca, appearance=white, format=logo, align=column.svg"],
]) {
  const white = parse(wf);
  const same =
    white.vb === b.vb &&
    JSON.stringify(white.paths) === JSON.stringify(b.paths);
  if (!same)
    throw new Error(`geometrie divergente entre noir et blanc : ${wf}`);
}

const block = (
  name,
  o,
) => `/** ${name} — viewBox ${o.vb}, boite naturelle ${o.w} × ${o.h}. */
export const ${name}_VIEWBOX = "${o.vb}";
export const ${name}_NATURAL_WIDTH = ${o.w};
export const ${name}_NATURAL_HEIGHT = ${o.h};
export const ${name}_PATHS: readonly string[] = [
${o.paths.map((d) => `  "${d}",`).join("\n")}
];`;

const out = `// ---------------------------------------------------------------------------
// Orca — tracés exportés tels quels depuis Figma
// ---------------------------------------------------------------------------
//
// Orca n'est pas une sous-marque Comète : son logo ne contient ni le wordmark
// « comète », ni la comète, ni un suffixe produit. C'est un dessin autonome,
// d'où des tracés propres plutôt qu'une entrée dans \`wordmark-paths.ts\`.
//
// Les trois géométries sont indépendantes — \`inline\` et \`column\` ne sont pas
// un reflow l'une de l'autre : le mot n'y est pas dessiné de la même façon
// (bas-de-casse avec l'orque logé dans le « o » d'un côté, capitale de
// l'autre). Ne pas tenter de dériver l'une de l'autre.
//
// Fichiers sources (Figma › ❖ Logo › Components) :
//   entity=orca, appearance=black|white, format=icon, align=none
//   entity=orca, appearance=black|white, format=logo, align=none
//   entity=orca, appearance=black|white, format=logo, align=column
// Les variantes noire et blanche ont des tracés identiques au \`fill\` près :
// la couleur vient des tokens, comme pour les autres logos.

${block("ORCA_ICON", icon)}

${block("ORCA_INLINE", inline)}

${block("ORCA_COLUMN", column)}
`;

fs.writeFileSync("src/orca-paths.ts", out);
console.log("src/orca-paths.ts ecrit");
console.log(`icon   ${icon.paths.length} tracé(s)  ${icon.vb}`);
console.log(`inline ${inline.paths.length} tracé(s)  ${inline.vb}`);
console.log(`column ${column.paths.length} tracé(s)  ${column.vb}`);
