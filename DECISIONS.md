# Decisions

## 19/11/2026 : peer `@aexae/comete-design-tokens` élargi à `>=0.17.0`

- **Décision** : la peer dependency passe de `^0.17.0` à `>=0.17.0` (package.json et README).
- **Raison** : en 0.x, `^0.17.0` ne couvre que 0.17.x. Le design system installe les tokens 0.23.0, d'où un avertissement « unmet peer » à chaque `pnpm install`. Le paquet ne dépend que de l'existence de ses tokens de couleur, présents depuis 0.17.0.
- **Publié le 25/11/2026** en 0.15.1 (tag `v0.15.1`), à la demande d'Axel. Le code généré et le lockfile sont inchangés.

## 06/11/2026 : audit des contraintes de redimensionnement des logos

- **Contexte** : demande de verifier que tous les logos ont des contraintes
  valides (scale/scale) et ne cassent jamais au redimensionnement.
- **Constat** :
  - **Paquet npm** (composants React SVG) : deja conforme. `viewBox` partout,
    `width`/`height` verrouilles sur le ratio du viewBox, pas de
    `preserveAspectRatio="none"`, pas de `.svg` brut. Aucune deformation possible
    via la prop `size`. Aucune correction.
  - **Source Figma** (page "❖ Logo") : cassee. ~700 noeuds de contenu avec des
    contraintes autres que SCALE/SCALE (dominant `CENTER/SCALE`). Les composants
    ne sont pas en Auto Layout, donc les contraintes pilotent le redimensionnement :
    tirer un coin deforme le dessin.
- **Decision** :
  - Correctif applique directement dans Figma via le **serveur MCP officiel**
    (`use_figma`, API Plugin), a la demande explicite d'Axel. L'API REST Figma
    etant en lecture seule, elle n'a servi qu'a l'audit.
  - Correctif minimal (SCALE/SCALE) retenu plutot qu'une refonte Auto Layout,
    conformement a la demande ("scale/scale"). La piste Auto Layout reste
    consignee dans TODO.md pour arbitrage design.
  - Outils conserves dans le repo : `tools/audit-figma-constraints.mjs` (audit
    lecture seule reproductible) et `tools/figma-fix-logo-constraints.js`
    (correctif rejouable via plugin "Scripter", en secours).
- **Execute le 06/11/2026** (via MCP officiel) :
  - Passe 1 (8 sets de la page "❖ Logo") : 848 noeuds mis en SCALE/SCALE. 259
    "erreurs" attendues = vecteurs dans des instances (non surchargeables), qui
    heritent de leurs masters.
  - Passe 2 (vrais masters de geometrie, sur une autre page) : les logos Dark
    instancient `_Code parts / <LogoProductIcon|RootName|Suffix>`
    (`19205:21110`, `19205:21305`, `19205:21347`) dont les vecteurs ne sont pas
    surchargeables depuis une instance. 474 noeuds mis en SCALE/SCALE, 0 erreur.
  - **Verification** : l'audit REST tombe a **0** noeud non-scale sur les 8 sets
    (Light/Dark/Mono/AppIcon/Events + `_LogoEntity*`). Test visuel : instance
    `ontime` logo inline redimensionnee x5 (286x32 -> 1430x160), ratio inchange
    (8.9375), aucune deformation ; instance de test supprimee.
  - Historique de versions Figma disponible pour rollback si besoin.

## 09/11/2026 : SCALE/SCALE conserve, pas de passage en Auto Layout

- **Contexte** : demande d'evaluer le passage des logos en Auto Layout (piste
  laissee ouverte dans TODO.md le 06/11/2026).
- **Constat** : Auto Layout ne met pas le contenu a l'echelle, il le reagence
  (gaps, alignement, hug/fill). Tirer un coin d'un frame Auto Layout redistribue
  l'espace au lieu de scaler proportionnellement. Cela aurait regresse le
  comportement de redimensionnement au coin corrige la veille (SCALE/SCALE).
- **Decision** : on **garde SCALE/SCALE** sur tous les logos, pas de refonte
  Auto Layout. SCALE/SCALE est la mecanique Figma correcte pour conserver les
  proportions au redimensionnement, qui etait la demande initiale. La piste Auto
  Layout (gain cote composition/maintenance uniquement) est fermee.
