# Branching & Merge Strategy

Two owners, one trunk. `main` is always deployable; all work happens on short-lived branches created from `main` and merged back through a pull request (PR).

## Rules

1. **Never commit directly to `main`.** Protect it on GitHub: require a PR and one approval, and block force-pushes.
2. **Every branch is created from an up-to-date `main`.**
3. **Keep branches short-lived**: ideally merged within 1–3 days. Small PRs are easier to review and conflict less.
4. **The other owner reviews and approves.** Never merge your own PR without the other owner's approval.
5. **Delete the branch after merging.**

## Branch naming

`<type>/<short-description>`, lowercase, hyphenated.

| Type | Use for | Example |
|------|---------|---------|
| `feat/` | New features | `feat/contact-form` |
| `fix/` | Bug fixes | `fix/mobile-nav-overflow` |
| `chore/` | Tooling, deps, config | `chore/upgrade-next` |
| `docs/` | Documentation only | `docs/branching-readme` |

## Workflow

```bash
# 1. Start from fresh main
git checkout main
git pull origin main
git checkout -b feat/my-change

# 2. Work and commit in small steps
git add .
git commit -m "Add contact form validation"

# 3. Before opening the PR, bring in anything new from main
git fetch origin
git rebase origin/main        # resolve conflicts here, not in the PR
git push -u origin feat/my-change   # use --force-with-lease after a rebase

# 4. Open a PR into main, get approval from the other owner, then merge
```

## Merging

- Use **Squash and merge**: one clean commit per PR on `main`, so history stays readable and any change is easy to revert.
- The PR title becomes the commit message, so write it clearly.
- Merge only when the PR is approved and the build/lint passes.
- After merging, both owners run `git checkout main && git pull` before starting new work.

## Avoiding conflicts between two owners

- **Agree who is touching what** before starting (a quick message is enough). Avoid both editing the same files or components at once.
- **Pull `main` often** and rebase your branch onto it daily if the branch lives longer than a day.
- **Don't push to each other's branches** unless asked. If you need to build on unmerged work, say so and branch from that branch explicitly.
- **Keep unrelated changes out of a PR** (formatting sweeps, renames, dependency bumps get their own PR, merged quickly).

## Hotfixes

Same flow, just faster: branch `fix/<issue>` from `main`, open a PR, get a quick review from the other owner, squash-merge. No separate hotfix branch is needed because `main` is the only long-lived branch.

## Why not Git Flow / a `develop` branch?

With two people and a single deployable site, a long-lived `develop` branch adds merge overhead and drift without real benefit. Trunk-based development with short-lived branches gives the same safety through PR review and keeps `main` as the single source of truth.
