# @aexae/comete-logos

Bibliothèque des **logos produits Comète** sous forme de composants React. Les couleurs et le rendu light/dark sont pilotés par les design tokens `--logo-comete-*` de `@aexae/comete-design-tokens`.

## Installation

Le package est publié sur GitHub Packages. Configurer le registry dans un `.npmrc` :

```ini
@aexae:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_AUTH_TOKEN}
```

```bash
pnpm add @aexae/comete-logos
```

Peer dependencies : `react` (18 ou 19) et `@aexae/comete-design-tokens` (^0.11.0).

## Utilisation

```tsx
import { Comete, OnTime, Bi } from "@aexae/comete-logos";
import "@aexae/comete-design-tokens/css";

<Comete size={48} />                                  // logo complet, appearance brand
<OnTime format="icon" size={32} />                    // icône seule
<Bi taglineAlign="column" appearance="inverse" />     // nom produit sur une 2e ligne
```

La feuille de style est importée automatiquement par le barrel export : aucun import CSS supplémentaire n'est nécessaire. Elle reste accessible explicitement via `@aexae/comete-logos/styles`.

## Logos disponibles

| Composant | Produit | `LogoProduct` |
|---|---|---|
| `Comete` | Comète (logo principal) | `comete` |
| `OnTime` | Comète On Time | `ontime` |
| `Link` | Comète Link | `link` |
| `Bi` | Comète BI | `bi` |
| `Mce` | Comète MCE | `mce` |
| `Academie` | Comète Académie | `academie` |
| `Club` | Comète Club | `club` |
| `CafeComete` | Café Comète | `cafe` |
| `MyComete` | MyComète | `mycomete` |

### Registry dynamique

```tsx
import { logoRegistry, type LogoProduct } from "@aexae/comete-logos";

function ProductLogo({ product }: { product: LogoProduct }) {
  const Logo = logoRegistry[product];
  return <Logo size={40} />;
}
```

## Props

Tous les logos partagent la même interface `LogoProps` :

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `appearance` | `"brand" \| "neutral" \| "inverse"` | `"brand"` | Apparence visuelle |
| `format` | `"icon" \| "logo"` | `"logo"` | Icône seule ou logo complet (icône + wordmark) |
| `taglineAlign` | `"none" \| "inline" \| "column"` | `"inline"` | Placement du nom de produit / de la tagline |
| `size` | `number` | `32` | Hauteur de rendu en pixels — la largeur suit proportionnellement |
| `colors` | `LogoColors` | — | Override de couleurs en inline (**fallback uniquement**, voir plus bas) |
| `className` | `string` | — | Classes CSS additionnelles |

Les autres props SVG sont transmises à l'élément `<svg>`.

### `taglineAlign`

- `none` — wordmark « comete » seul (viewBox 144×32), sans nom de produit
- `inline` — wordmark + nom de produit sur la même ligne
- `column` — nom de produit sur une seconde ligne, mis à l'échelle 0,6 et aligné à droite (viewBox 144×60). Sur `Comete`, affiche la tagline *« gestion pour la sécurité privée »*

### Types exportés

`LogoProps` · `LogoProduct` · `LogoAppearance` · `LogoFormat` · `LogoTaglineAlign` · `LogoColors` · `LogoRegistry`

`LogoType` et `LogoSuffix` sont conservés en alias **dépréciés** de `LogoFormat` et `LogoTaglineAlign`.

## Theming

Les apparences appliquent la classe `.comete-logo--{appearance}`, qui mappe des variables internes vers les tokens de thème :

| Apparence | Texte / icône | Dégradé |
|---|---|---|
| `brand` | `--logo-comete-default` | `--logo-comete-gradient-{light,dark}` |
| `neutral` | `--logo-comete-neutral` | aplati sur `--logo-comete-neutral` |
| `inverse` | `--logo-comete-inverted` | `--logo-comete-gradient-{light,dark}` |

Le wordmark secondaire (« on time », « bi », …) utilise `--logo-comete-subtle` pour rester visuellement en retrait.

### Bascule light / dark

Le SVG embarque deux corps de comète (`.comete-logo__light` multi-tracés, `.comete-logo__dark` tracé compound `evenodd`), affichés selon le thème et l'apparence :

| Apparence | Thème clair | Thème sombre |
|---|---|---|
| `brand` | LightBody | DarkBody |
| `neutral` | DarkBody | DarkBody |
| `inverse` | DarkBody | LightBody |

Le thème est piloté par l'attribut `data-theme` sur un ancêtre (typiquement `<html>`), comme pour le reste de l'écosystème.

### Prop `colors` — fallback

À n'utiliser que si les CSS custom properties ne sont pas disponibles (emails, exports statiques, rendu hors thème). Les valeurs fournies sont appliquées en inline à la place des classes ; elles surchargent les mêmes custom properties, donc l'override cascade dans toutes les parties du logo.

```tsx
<Comete colors={{
  text: "#1E3661",
  icon: "#1E3661",
  gradientLight: "#FFF146",
  gradientDark: "#F8BF01",
}} />
```

Les valeurs par défaut (miroir du thème clair) sont exposées dans `src/fallbacks.ts`.

## Parties composables

Pour des compositions sur mesure, les briques internes sont exportées :

| Export | Rôle |
|---|---|
| `ProductIcon` | Icône comète seule |
| `ProductRootName` | Wordmark « comete » |
| `ProductSuffix` | Nom de produit (+ `getProductSuffixMetrics` pour ses métriques) |

## Architecture

```
comete-logos/
├── src/
│   ├── logos/*.tsx           # 9 logos produits (wrappers autour de LogoFrame)
│   ├── components/
│   │   ├── LogoFrame.tsx     # Composition icône + wordmark + suffixe/tagline
│   │   ├── ProductIcon.tsx
│   │   ├── ProductRootName.tsx
│   │   └── ProductSuffix.tsx
│   ├── wordmark-paths.ts     # Tracés SVG du wordmark
│   ├── tagline-paths.ts      # Tracés SVG des taglines
│   ├── layout-data.ts        # Métriques du layout column (échelle, transforms)
│   ├── fallbacks.ts          # Couleurs de repli hors tokens
│   ├── registry.ts           # Map LogoProduct → composant
│   ├── styles/logos.css      # Apparences → tokens + bascule light/dark
│   └── types.ts
└── dist/                     # Build ESM (tsup)
```

L'icône est superposée au wordmark via un offset `iconX` exprimé en unités de la viewBox du wordmark (144 unités = `size` × 4,5), ce qui garantit un alignement au pixel quelle que soit la taille.

`MyComete` a un dessin propre (nuage + comète + « my » + « comète ») et reste en dehors du chemin de composition `LogoFrame`.

## Commandes

```bash
pnpm build        # Bundle ESM (tsup) + copie de logos.css
pnpm typecheck    # Vérification TypeScript
pnpm lint         # Biome
pnpm lint:fix     # Biome avec auto-correction
pnpm clean        # Supprime dist/
```

`prepublishOnly` enchaîne `typecheck` → `lint` → `build`.

## Stack

React 18/19 · TypeScript strict · ESM uniquement · tsup (splitting + treeshake) · Biome · Node ≥ 22

## Écosystème

| Package | Rôle |
|---|---|
| [`@aexae/comete-design-tokens`](https://github.com/aexae/comete-design-tokens) | Source des tokens `--logo-comete-*` |
| [`@aexae/comete-design-system`](https://github.com/aexae/comete-design-system) | Consommateur (composant `Logo`) |

## Licence

AGPL-3.0-only
