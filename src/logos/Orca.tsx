// ---------------------------------------------------------------------------
// Orca — logo de la marque Orca (enveloppe fine autour de LogoFrame).
//
// Seul logo du paquet qui ne soit pas une sous-marque Comète : pas de wordmark
// « comète », pas de comète, pas de suffixe produit. Comme pour `Comete`, il
// n'y a jamais de tagline — mais ici parce qu'il n'en existe pas, et non parce
// qu'on la masque.
//
// `taglineAlign` n'y choisit donc pas la place d'une tagline, mais le lockup :
//   "inline" (défaut) → le mot « orca », l'orque logée dans le « o »
//   "column"          → l'orque au-dessus, « Orca » en dessous
// Ce sont deux dessins Figma distincts, pas deux mises en page du même.

import type { ReactElement } from "react";
import { LogoFrame } from "../components/LogoFrame";
import type { LogoProps } from "../types";

export function Orca(props: LogoProps): ReactElement {
  return <LogoFrame entity="orca" {...props} />;
}

Orca.displayName = "Orca";
