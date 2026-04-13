# CONTRIBUTING.md placeholder for StellarFlow

- Every unit of work is a **GitHub Issue** with a defined scope
- Contributors pick up **one task at a time**
- Each task has a clear description of exactly what to build, what to avoid, and what the acceptance criteria are
- The Maintainer reviews every PR before anything is merged into `main`

There is no "just add something useful" contributions. Every change must map to an open Issue.

---

## Roles

| Role | Responsibilities |
|---|---|
| **Maintainer (Owner)** | Defines tasks, sets scope, reviews all PRs, resolves conflicts, merges approved work |
| **Contributor** | Picks up a scoped task, implements exactly what is described, submits a clean PR |

The Maintainer has final say on all merges. This is not up for debate — it protects the integrity of the base branch.

---

## Before You Start

### 1. Read the Architecture Document

Before contributing to **any** part of the project, you must read [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md). Understanding the system's layers — what lives on-chain, what lives off-chain, and why — is essential for staying within scope.

### 2. Set Up Your Environment

Make sure you have the following installed:

- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)
- [Node.js](https://nodejs.org/) v18+
- Git

### 3. Fork and Clone the Repository

```bash
# Fork the repo via GitHub UI, then:
git clone https://github.com/YOUR_USERNAME/stellarflow.git
cd stellarflow
git remote add upstream https://github.com/soro-forge/stellarflow.git
```

### 4. Always Work from an Up-to-Date Base

Before starting any task, sync your fork with the upstream `main` branch:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## How to Claim a Task

1. **Issues** are applied for through the [Stellar Wave Program on Drips](https://www.drips.network/wave).
2. Browse open issues labelled `status: open`
3. Read the issue **completely** — including the scope boundaries and acceptance criteria
4. Leave a comment: `"I'd like to work on this"` and wait for the Maintainer to assign it to you
5. **Do not start working until you are officially assigned.** Two contributors working on the same task creates merge conflicts and wasted effort
6. Once assigned, create your branch (see naming rules below) and begin

> **One task at a time.** Do not pick up a second task until your current PR has been reviewed and merged or closed.

---

## Branch Naming Rules

Every branch must follow this format:

```
<type>/<issue-number>-<short-description>
```

### Types

| Type | When to Use |
|---|---|
| `feat` | Adding new functionality |
| `fix` | Fixing a bug |
| `docs` | Documentation only changes |
| `test` | Adding or updating tests |
| `refactor` | Code restructuring with no behavior change |
| `chore` | Build process, config, tooling updates |

### Examples

```bash
feat/007-initialize-stream-function
fix/012-bps-validation-overflow
docs/003-readme-setup-instructions
test/015-distribute-unit-tests
```

Never use generic names like `my-changes`, `fix-stuff`, or `update`.

---

## Scope Rules — The Most Important Section

This is the section that determines whether your PR gets merged or rejected.

### The Golden Rule

> **Build exactly what the Issue describes. Nothing more. Nothing less.**

Each Issue defines:
- **What to implement** — the specific feature, function, or component
- **What NOT to touch** — files, functions, or areas explicitly out of scope
- **Acceptance criteria** — the conditions that must be true for the PR to be accepted

### Why This Matters

StellarFlow is built by multiple contributors working simultaneously. If you modify files outside your task's scope, you create:
- **Merge conflicts** with other contributors' branches
- **Unexpected behavior** in parts of the codebase no one reviewed
- **Delays** for every other contributor waiting for their PR to be merged

### What "Staying in Scope" Looks Like

- If your task is to build the `initialize_stream()` function, you write that function, its error types, and its unit tests. You do **not** refactor the storage module because you think it looks messy.
- If your task is a frontend component, you build that component only. You do **not** update the global styles file because you prefer a different color.
- If you notice a bug while working on your task, you **open a new Issue** to report it. You do not fix it in your current PR unless the Maintainer explicitly approves it.

### Requesting a Scope Expansion

If you believe your task genuinely requires touching something outside your defined scope, post a comment on the Issue explaining what and why. Wait for the Maintainer's response before proceeding.

---

## Commit Message Format

All commit messages must follow this format:

```
<type>(<scope>): <short description>

[optional body — explain WHY, not what]
```

### Examples

```
feat(contract): add initialize_stream function with BPS validation

fix(backend): handle missing webhook signature header gracefully

docs(readme): add soroban CLI setup instructions

test(contract): add unit tests for distribute edge cases
```

### Rules

- Use the **imperative mood**: "add", not "added" or "adding"
- Keep the first line under **72 characters**
- Do not end the first line with a period
- Reference the Issue number in the body if relevant: `Closes #007`

---

## Pull Request Process

### Before Submitting

- [ ] Your branch is up to date with `upstream/main`
- [ ] Your code compiles without errors
- [ ] All existing tests still pass
- [ ] You have written tests for your new code (where applicable)
- [ ] You have only touched files within your task's defined scope
- [ ] Your commit messages follow the format above

### Opening the PR

1. Push your branch to your fork
2. Open a Pull Request against `soro-forge/stellarflow:main`
3. Use the PR template (provided automatically)
4. Fill in every section of the template — do not leave sections blank
5. Link the Issue your PR resolves: `Closes #<issue-number>`

### The Review Process

- The Maintainer will review your PR within a reasonable timeframe
- You may receive requests for changes — address them promptly in new commits on the same branch (do not open a new PR)
- Once approved, the Maintainer will merge your PR
- Do not merge your own PRs under any circumstance

### After Merge

- Delete your feature branch
- Sync your local `main` with upstream before starting your next task

---

## Code Standards

### Rust / Soroban Contract

- Follow standard Rust formatting: run `cargo fmt` before committing
- Run `cargo clippy` and address all warnings
- All public functions must have doc comments (`///`)
- Every new function must have at least one unit test
- No `unwrap()` in production contract code — handle all errors explicitly with `Result`

### TypeScript / Backend

- Follow the project's ESLint configuration
- Run `npm run lint` before committing
- Use `async/await` over raw Promises
- All environment variables must go through the `.env` file — never hardcode keys or addresses

### TypeScript / Frontend

- Components must be typed — no implicit `any`
- Follow the component structure defined in the task Issue
- Do not introduce new npm packages without approval from the Maintainer (post a comment on the Issue first)

---

## Communication Guidelines

- All task-related discussion happens **on the GitHub Issue**, not in DMs
- If you are stuck, comment on the Issue — do not go silent for days
- If you can no longer complete a task you claimed, comment on the Issue immediately so it can be reassigned
- Be respectful and constructive in all code review feedback

---

## What Will Get Your PR Rejected

The following will result in an automatic rejection without extended review:

- **Out-of-scope changes** — touching files or functions not defined in your task
- **Missing tests** — new contract functions or backend logic with no tests
- **Broken existing tests** — your changes must not break any currently passing tests
- **Unresolved merge conflicts** — resolve all conflicts before requesting review
- **Hardcoded values** — no hardcoded addresses, keys, or configuration values
- **No Issue link** — every PR must close a specific Issue
- **Incomplete PR template** — all sections must be filled

---

## Questions?

If anything in this guide is unclear, open a **Discussion** on GitHub or comment on the relevant Issue. The Maintainer is here to help contributors succeed — but the scope rules exist for everyone's benefit and will be enforced consistently.

Thank you for contributing to StellarFlow and to the Soro-Forge community. Let's build something trustless. 🔱

