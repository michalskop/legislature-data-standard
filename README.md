# Legislature Data Standard
A Popolo-based, Redoc-rendered specification for parliamentary/legislature data
used across CZ Parliament, EU, and regional assemblies. Versioned on GitHub Pages.


## Live docs
- Latest: https://michalskop.github.io/legislature-data-standard/latest/
- Popolo snapshot: https://michalskop.github.io/legislature-data-standard/popolo/
- Data Times: https://michalskop.github.io/legislature-data-standard/dt/
- Data Times analysis: https://michalskop.github.io/legislature-data-standard/dt.analyses/

## Universes
Build & publish all three “universes”

Locally (or via Action) run:

```
### Rebuild all schemas (Zod → JSON Schema)
npm run build:schemas

#### Popolo reference
STD_BRANCH=popolo STD_VERSION=popolo npm run build:openapi
STD_BRANCH=popolo STD_VERSION=popolo npm run release

#### DT base
STD_BRANCH=dt STD_VERSION=0.1.0 npm run build:openapi
STD_BRANCH=dt STD_VERSION=0.1.0 npm run release

#### DT analysis: votes (strict)
STD_BRANCH=dt.analyses/votes STD_VERSION=0.1.0 npm run build:openapi
STD_BRANCH=dt.analyses/votes STD_VERSION=0.1.0 npm run release
```
You’ll get:

```
dist/
  popolo/{popolo,latest}/...
  dt/{0.1.0,latest}/...
  dt.analyses/
    votes/{0.1.0,latest}/...
  latest/   # mirrors last run (decide which you want last)
  index.html   # main index (lists branches)
```

URLs:

```
Popolo: …/popolo/latest/

DT: …/dt/latest/

Votes analysis: …/dt.analyses/votes/latest/
(raw CSV table schema: …/dt.analyses/votes/latest/schemas/vote.dt.votes.strict.table.json)
```

local server:

```
python3 -m http.server 8080
