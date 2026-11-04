import { Academie } from "./logos/Academie";
import { Bi } from "./logos/Bi";
import { CafeComete } from "./logos/CafeComete";
import { Club } from "./logos/Club";
import { Comete } from "./logos/Comete";
import { CometeCompany } from "./logos/CometeCompany";
import { Link } from "./logos/Link";
import { Mce } from "./logos/Mce";
import { MyComete } from "./logos/MyComete";
import { OnTime } from "./logos/OnTime";
import type { LogoRegistry } from "./types";

export const logoRegistry: LogoRegistry = {
  "comete-software": Comete,
  "comete-company": CometeCompany,
  ontime: OnTime,
  link: Link,
  bi: Bi,
  academie: Academie,
  club: Club,
  mce: Mce,
  cafe: CafeComete,
  mycomete: MyComete,
};
