// Styles
import "./styles/logos.css";

export type { EntityIconProps } from "./components/EntityIcon";
// Composable logo parts
export { EntityIcon } from "./components/EntityIcon";
export type { EntityRootNameProps } from "./components/EntityRootName";
export { EntityRootName } from "./components/EntityRootName";
export type {
  EntitySuffixProps,
  SuffixEntity,
} from "./components/EntitySuffix";
export {
  EntitySuffix,
  getEntitySuffixMetrics,
} from "./components/EntitySuffix";
export { Academie } from "./logos/Academie";
export { Bi } from "./logos/Bi";
export { CafeComete } from "./logos/CafeComete";
export { Club } from "./logos/Club";
// Logos
export { Comete } from "./logos/Comete";
export { CometeCompany } from "./logos/CometeCompany";
export { Link } from "./logos/Link";
export { Mce } from "./logos/Mce";
export { OnTime } from "./logos/OnTime";
export { logoRegistry } from "./registry";

// Types
export type {
  LogoAppearance,
  LogoColors,
  LogoEntity,
  LogoFormat,
  LogoProduct,
  LogoProps,
  LogoRegistry,
  LogoSuffix,
  LogoTaglineAlign,
  LogoType,
} from "./types";
