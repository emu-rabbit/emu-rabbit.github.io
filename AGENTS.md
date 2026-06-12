# Local Codex Notes

## Agent Skill Environment

This project uses the shared Frozen Rabbit agent skill structure under `.agents`.
For every task, agents should start from the core skills:

1. `.agents/skills/core/language_policy.md`
2. `.agents/skills/core/global_standards.md`
3. `.agents/skills/core/goal_oriented_design.md`
4. `.agents/skills/core/decision_traceability.md`
5. `.agents/skills/core/documentation_sync.md`

Before planning or editing, agents must also search the decision history for
task-relevant prior decisions:

1. `.agents/decisions/decision_history.md`

Then read the project mission documents:

1. `.agents/mission/project_mission.md`
2. `.agents/mission/feature_domains.md`
3. `.agents/mission/product_experience.md`

When planning technology choices, static-site architecture, asset strategy,
deployment, page modules, performance, accessibility, or long-term maintainability,
also read:

1. `.agents/architecture/README.md`
2. `.agents/architecture/technical_architecture.md`
3. Any task-relevant `.agents/architecture/modules/*.md`

When writing, editing, or reviewing code, also read:

1. `.agents/skills/professional/development_standards.md`

When creating or changing UI, layout, CSS, visual identity, responsive behavior,
copy, assets, or user interaction, also read:

1. `.agents/skills/professional/ui_ux_standards.md`

Visual inspection for this project is performed by the user. Agents should not
start browser screenshots, headless visual checks, or in-app Browser visual QA
unless the user explicitly asks for that tool. After UI or image changes, agents
should complete mechanical checks such as build/typecheck, asset paths,
HTML/CSS/DOM structure, image sizing attributes, lazy/fetch-priority settings,
accessibility attributes, and obvious overflow or layout-shift risks, then hand
the preview back to the user for visual review.

Use `.agents/skills/_skill_template.md` when adding new project-specific skills.

When the user asks to `add and commit all`, `commit all`, `全部提交`, or otherwise
submit all current changes, read:

1. `.agents/workflows/add-commit-all.md`

## Project Direction

`emu-rabbit.github.io` is a very lightweight static website for the project
owner's personal profile and self-introduction. It should feel highly authored,
custom, and visually distinctive rather than like a generic resume template,
SaaS landing page, or card-stack portfolio clone.

Agents should protect these defaults:

- Keep the site lightweight and static unless a stronger need is confirmed.
- Use Vite + TypeScript as the default first implementation stack. Do not add
  Vue, another UI framework, a client router, or state management unless the page
  genuinely needs data-driven reactive UI beyond small progressive interactions.
- Treat fast first view rendering as a primary technical decision filter: core
  landing-page content should be present in HTML and not wait for JavaScript.
- Treat visual identity, typography, motion, layout, and content hierarchy as
  first-class work, not decoration after the page is assembled.
- Keep the brand atmosphere gentle, free, comfortable, intimate, and personal;
  avoid cold professional resume language, generic SaaS/portfolio polish, and
  data-dashboard visual cues such as chart-like bars, numbers, or infographic
  accents unless the user explicitly asks for them.
- Treat desktop and mobile as separate first-class compositions. Background
  art, hero layout, reading rhythm, and spacing must be intentionally checked on
  both; do not rely on cropping or passive scaling as the final mobile design.
- Favor semantic HTML, CSS, small progressive JavaScript, and simple build steps.
- Avoid importing unrelated Freezer Space product goals, privacy models,
  Flutter/Firebase assumptions, relationship context, or domain-specific features.
- Keep mobile and desktop quality equally intentional.
- Make copy and layout feel personal, specific, and designed for the owner.

## Scope Of Imported Skills

The initial `.agents` files were adapted from the sibling `freezer_space`
repository, but only project-agnostic values and practices were imported:

- `core/`: language policy, global behavior standards, goal-oriented design,
  decision traceability, and documentation synchronization.
- `decisions/`: high-signal decision history with strict anti-noise rules.
- `mission/`: this project's personal static-site identity, feature domains,
  and product experience direction.
- `architecture/`: lightweight static-site architecture and reusable module
  architecture templates.
- `professional/`: general development and UI/UX standards adapted for a
  custom personal static website.
- `workflows/add-commit-all.md`: classify changes by content, then stage and
  commit each group separately.
- `_skill_template.md`: template for future skills.

Do not copy Freezer Space-specific mission, relationship, Flutter, Firebase,
auth, membership, PWA, contract, finance, or private-space rules into this
project unless the user explicitly asks for them.

## Language

Default to Traditional Chinese for user-facing communication and project
documentation, while preserving English for code identifiers, technical terms,
commands, API names, and established project names.

## File Encoding

All `.agents`, Markdown, skill, and workflow files should be stored as UTF-8
without BOM. On Windows PowerShell, read Chinese Markdown with:

```powershell
Get-Content -Encoding UTF8 <path>
```

If output appears garbled, stop relying on that content and reread it with
explicit UTF-8 encoding before making decisions.

## Windows npm / nvm-windows sandbox note

If a future Codex agent cannot find or run `npm` on this machine, do not assume
Node.js is missing. On 2026-05-09 we found:

- `nvm-windows` is installed at `C:\Users\User\AppData\Local\nvm`.
- The active nvm Node symlink is `C:\nvm4w\nodejs`.
- `nvm list` showed Node `22.18.0` active and `18.20.8` also installed.
- `C:\nvm4w\nodejs` contains `node.exe`, `npm.cmd`, and `npx.cmd`.
- However, Codex workspace-write sandbox blocks direct execution/read access to
  `C:\nvm4w\nodejs`, so PATH can contain nvm but `npm` still fails inside agent
  shell commands.
- Codex app exposes `node.exe` and the npm/npx shims at
  `C:\Users\User\AppData\Local\OpenAI\Codex\bin`.

Current workaround installed on 2026-05-09 and cache target corrected on
2026-05-14:

- Added `npm.cmd` and `npx.cmd` shims to
  `C:\Users\User\AppData\Local\OpenAI\Codex\bin`.
- Copied the npm CLI package from nvm Node into
  `C:\tmp\codex-node\node_modules\npm`.
- The shims call Codex bundled `node.exe` and run:
  - `C:\tmp\codex-node\node_modules\npm\bin\npm-cli.js`
  - `C:\tmp\codex-node\node_modules\npm\bin\npx-cli.js`
- The shims must set `npm_config_cache=C:\tmp\codex-npm-cache`. Do not point npm
  cache at `%CD%\.codex-npm-cache`; that creates repo-local tooling noise.

Validation commands:

```powershell
Get-Command npm
npm --version      # expected 10.9.3 as of 2026-05-19
npx --version      # expected 10.9.3 as of 2026-05-19
npm config get cache  # expected C:\tmp\codex-npm-cache
npm cache verify  # if this hits EPERM under Codex sandbox, rerun with require_escalated
```

If `Get-Command npm` fails but
`C:\Users\User\AppData\Local\OpenAI\Codex\bin\npm.cmd` exists, check the shell
PATH before assuming npm is missing. Some Codex desktop shells have had
`C:\Users\User\AppData\Local\OpenAI\Codex\bin\<session-id>` on PATH without the
parent `bin` directory. For that shell, prepend the parent bin directory before
running npm:

```powershell
$pathValue = $env:Path
if (Test-Path Env:PATH) { Remove-Item Env:PATH }
$env:Path = "C:\Users\User\AppData\Local\OpenAI\Codex\bin;$pathValue"
Get-Command npm
npm config get cache
```

PowerShell can also fail when both `Path` and `PATH` environment variables
exist, with an error like `An item with the same key has already been added` /
`已經加入項目。字典中的索引鍵: 'Path' 加入的索引鍵: 'PATH'`. Before using
`Start-Process`, normalize the duplicate key in the current shell:

```powershell
$pathValue = $env:Path
if (Test-Path Env:PATH) { Remove-Item Env:PATH }
$env:Path = $pathValue
Start-Process -FilePath npm -ArgumentList @('run','dev') -WindowStyle Hidden
```

The fixed `C:\tmp\codex-npm-cache` cache avoids repo-local noise, but Codex
sandbox may still reject writes to `C:\tmp` in some sessions. If an npm command
that writes cache fails with `EPERM` under `C:\tmp\codex-npm-cache`, rerun that
command with Codex `require_escalated` permission rather than moving the cache
back into the repo.

For Vite dev servers, do not patch individual repos to work around sandbox
writes. Vite may need to create or update files under `node_modules\.vite-temp`.
If direct startup fails with an error like `EPERM: operation not permitted, open
... node_modules\.vite-temp\...`, rerun the dev-server command with Codex
`require_escalated` permission and explain that Vite needs to write its
`node_modules` temp/dependency cache.

If this breaks again:

1. Check whether `C:\Users\User\AppData\Local\OpenAI\Codex\bin\npm.cmd` and
   `npx.cmd` still exist. Codex app updates may overwrite this directory.
2. Check whether `C:\tmp\codex-node\node_modules\npm\bin\npm-cli.js` and
   `npx-cli.js` still exist. `C:\tmp` cleanup may remove them.
3. If missing, recreate the shim and copy npm from
   `C:\nvm4w\nodejs\node_modules\npm` with user approval, because those
   locations are outside the normal workspace sandbox.
4. Keep the shim cache target at `C:\tmp\codex-npm-cache`.
5. Avoid spending time searching for npm in Codex primary runtime first; in this
   environment it had `node.exe` but no exposed npm/corepack CLI.
