# Commit Message Convention

This repository follows the **Conventional Commits** standard.

Each commit message has the form:

<type>(<scope>): <short summary>

### Common types

| Type | Purpose |
|------|----------|
| `feat` | New schema, new field, or new feature |
| `fix` | Bug fix, broken build, or incorrect generation |
| `docs` | Documentation or README changes |
| `style` | Code style / formatting only |
| `refactor` | Internal refactoring without functional change |
| `test` | Adding or adjusting tests or examples |
| `ci` | Continuous integration / GitHub Actions / deployment changes |
| `chore` | Maintenance tasks, version bumps, dependency updates |

### Examples

feat(schema): add DtPerson (family_name and given_names)
fix(release): keep both Popolo and DT in dist
docs(readme): describe schema versioning and branches
ci(pages): build Popolo first, DT last so /latest mirrors DT


### Why

- Easier to read commit history  
- Enables automated changelog generation later  
- Keeps repo tidy and structured
