# Legislature Data Standard

A Popolo-based specification for parliamentary/legislature data, used across CZ Parliament, EU, and regional assemblies.

Schemas are written in **TypeScript (Zod)**, compiled to **JSON Schema**, and published as browsable **OpenAPI/Redoc** docs on GitHub Pages. `dist/` is not committed — it is built and deployed automatically by GitHub Actions on every push to `main`.

## Live docs

- **DT (latest):** https://michalskop.github.io/legislature-data-standard/dt/latest/
- **DT.analyses:** https://michalskop.github.io/legislature-data-standard/dt.analyses/
- **Popolo:** https://michalskop.github.io/legislature-data-standard/popolo/

## Schema namespaces

### Popolo (`popolo`)

Base [Popolo](https://www.popoloproject.com/) types: `Person`, `Organization`, `Membership`, `Post`, `ContactDetail`, `NameComponent`, `Motion`, `VoteEvent`, `Count`, `Vote`, `Area`, `Event`, `Speech`.

### DT (`dt`)

Opinionated extensions for legislature data. All DT types are subsets/refinements of their Popolo counterparts with stricter IDs, explicit array wrappers, and additional fields.

| Schema | File |
|---|---|
| Person / Persons | `person.dt`, `persons.dt` |
| Term / Terms | `term.dt`, `terms.dt` |
| Organization / Organizations | `organization.dt`, `organizations.dt` |
| Membership / Memberships | `membership.dt`, `memberships.dt` |
| Motion / Motions | `motion.dt`, `motions.dt` |
| VoteEvent / VoteEvents | `vote-event.dt`, `vote-events.dt` |
| Vote / VotesTable (row) | `vote.dt`, `votes-table.dt` |
| Count | `count.dt` |
| PersonsTable (row) | `persons-table.dt` |
| VoteEventObjection / VoteEventObjections | `vote-event-objection.dt`, `vote-event-objections.dt` |

`VoteEventObjection` records cases where an MP (or a body) challenged the outcome of a vote event — either a procedural objection (`event_objection`) or a correction where the MP stated they voted differently from their intention (`vote_correction`).

### DT.analyses (`dt.analyses/…`)

Output schemas for derived analyses. Each analysis has its own sub-namespace.

| Analysis | Schemas |
|---|---|
| `all-members` | `all-members.dt.analyses`, `all-members-table.dt.analyses` |
| `current-members` | `current-members.dt.analyses`, `current-members-table.dt.analyses` |
| `current-term` | `current-term.dt.analyses` |
| `all-groups` | `all-groups.dt.analyses`, `all-groups-table.dt.analyses` |
| `current-groups` | `current-groups.dt.analyses`, `current-groups-table.dt.analyses` |
| `attendance-definition` | `attendance-definition.dt.analyses`, `attendance-definition-table.dt.analyses` |
| `attendance` | `attendance.dt.analyses`, `attendance-table.dt.analyses` |

## Repository structure

```
legislature-data-standard/
├─ schemas/
│  ├─ *.popolo.schema.ts       # Popolo type definitions (Zod)
│  ├─ *.dt.schema.ts           # DT type definitions (Zod)
│  ├─ *.dt.analyses.schema.ts  # DT.analyses type definitions (Zod)
│  └─ _registry.ts             # Popolo registry (legacy)
├─ scripts/
│  ├─ build.ts                 # Zod → JSON Schema compiler
│  ├─ write-openapi.js         # JSON Schema → OpenAPI spec
│  ├─ release.js               # copies build artefacts into dist/
│  └─ generate-frictionless.py # generates Frictionless Data descriptors
├─ .github/workflows/
│  └─ deploy.yml               # builds all namespaces and deploys to GitHub Pages
├─ dist/                       # build output — not committed, deployed by CI
├─ package.json
└─ tsconfig.json
```

## Local development

```bash
npm install

# Compile all Zod schemas to JSON Schema (writes to dist/dt/latest/schemas/ etc.)
npm run build:schemas

# Build OpenAPI spec for a specific namespace
STD_BRANCH=dt STD_VERSION=0.1.0 npm run build:openapi

# Copy artefacts into dist/ tree
STD_BRANCH=dt STD_VERSION=0.1.0 npm run release

# Preview locally
python3 -m http.server 8080
# open http://localhost:8080/dist/dt/latest/
```

Available namespaces / `STD_BRANCH` values: `popolo`, `dt`, `dt.analyses/all-members`, `dt.analyses/current-members`, `dt.analyses/current-term`, `dt.analyses/all-groups`, `dt.analyses/current-groups`, `dt.analyses/attendance-definition`, `dt.analyses/attendance`.

## Adding a new schema

1. Create `schemas/<name>.<namespace>.schema.ts` with a Zod schema export.
2. Import it and add it to the `SCHEMAS` array in `scripts/build.ts`.
3. If it needs its own OpenAPI/Redoc page, add a build+release step to `.github/workflows/deploy.yml`.
4. Push to `main` — GitHub Actions builds and deploys automatically.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for commit message conventions.
