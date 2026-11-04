import { Academie } from "./logos/Academie";
import { Bi } from "./logos/Bi";
import { CafeComete } from "./logos/CafeComete";
import { Club } from "./logos/Club";
import { Comete } from "./logos/Comete";
import { CometeCompany } from "./logos/CometeCompany";
import { Link } from "./logos/Link";
import { Mce } from "./logos/Mce";
import { OnTime } from "./logos/OnTime";
import type { LogoRegistry } from "./types";

// Alphabetical: this order is what pickers (Storybook, registries) display.
export const logoRegistry: LogoRegistry = {
  academie: Academie,
  bi: Bi,
  cafe: CafeComete,
  club: Club,
  "comete-company": CometeCompany,
  "comete-software": Comete,
  link: Link,
  mce: Mce,
  ontime: OnTime,
};
