<p align="center">
  <img src="https://raw.githubusercontent.com/pantion-dialogs/pantion-dialogs/main/.github/images/manakin.png" alt="Pantion" width="80">
</p>

<h1 align="center">The Pantion Dialog</h1>

<p align="center"><strong>Agent coding is fast. Your intent is the bottleneck.</strong></p>

Today's coding agents can outcode humans on speed and execution.

But great software isn't just code. It's **decisions**: defaults, edge cases, permissions, failure behavior, data boundaries, trade-offs. Agents guess those decisions silently — and when they guess wrong, you end up in correction loops.

The Pantion Dialog turns those decisions into a **Canon** — a converged dialog with no ambiguity left — before your agent writes a single line. And not just for software. The same dialog works for images, video, and any domain where AI generates from your intent.

### The five-second version

> **You:** "I want a booking app."
>
> **Pantion:** "What happens on double booking?"
>
> **You:** "First wins. Second gets alternatives."
>
> **Pantion:** "Locked. That decision won't be guessed later."

## Quick start

Pantion works best with **Claude Code**. It also installs on Cursor, Windsurf, Gemini CLI, and Codex — experience varies by model.

**1. Install**

```bash
npx @pantion/dialogs install --client claude
```

Or install for all supported clients at once:

```bash
npx @pantion/dialogs install --all
```

Supported clients: `claude`, `cursor`, `windsurf`, `gemini`, `codex`

**2. Start a dialog**

Describe what you want to build in natural language. Your agent calls Pantion automatically.

> I want to start a Pantion dialog for a CLI tool that converts markdown files to a static website.

Pantion asks targeted questions until your intent has converged, then saves the canon. That's it.

## See it in action: automatic mode

Don't want to answer questions? In **automatic mode**, Pantion generates the entire dialog for you — you just describe your idea and review the result.

> I want to start an automatic Pantion dialog for a web alarm clock with multiple timers

Pantion generates a full convergence dialog in seconds:

```
ASSISTANT: What is the core intent?
PANTION: A browser-based alarm clock with multiple independent timers ⚡

ASSISTANT: What are the inputs?
PANTION: Timer name, duration (HH:MM:SS or MM:SS), optional label ⚡

ASSISTANT: What happens when a timer finishes?
PANTION: Audio alert + visual flash. Audio stops on click/tap. ⚡

ASSISTANT: How many timers can run simultaneously?
PANTION: No hard limit. UI scrolls. ⚡ Performance is the natural cap.

ASSISTANT: What does this NOT do?
PANTION: No accounts, no server, no persistence across browser sessions ⚡
```

The `⚡` marks are conservative assumptions — decisions Pantion made for you. Review, adjust what you disagree with, and the canon is ready.

Two modes:

| Mode | How to start | Best for |
|------|-------------|----------|
| **Normal** | "I want to start a Pantion dialog for..." | Complex systems, precise control |
| **Automatic** | "I want to start an automatic Pantion dialog for..." | Quick exploration, simple projects |

## How it works

Pantion is an MCP server. Your coding agent connects to it, and it guides the conversation — asking one question at a time until there's nothing meaningful left to ask. That's convergence.

```
Idea → Dialog → Canon → Spec files → Build
```

1. **Dialog** — Pantion asks targeted questions to remove ambiguity. When new questions stop yielding new behavior, your intent has converged.
2. **Canon** — The verbatim conversation becomes the source of truth. Decisions, rejected alternatives, rationale — all preserved.
3. **Build** — Your coding agent reads the spec files or the canon directly via MCP resources. Point your agent at `canon/<project>/spec/` — or let it read the canon via `pantion://canons/<project>/dialog`.

## What you get

```
canon/<project>/
├── dialog.md                  # the converged dialog — source of truth
└── spec/
    ├── requirements.md        # intent, functional & non-functional requirements
    ├── constraints.md         # HARD vs FLEX decisions, forbidden actions
    └── success-criteria.md    # definition of done, acceptance criteria
```

Optional (generated when applicable): `api-spec.md`, `data-model.md`, `architecture.md`.

For image and video dialogs, the canon translates to generator-agnostic prompts and creative briefs instead of spec files.

Canon files are written to `./canon/` in your project root by default.

These files outlive tools, models, and rebuilds. Your intent survives. Everything else is replaceable.

## Why it feels different

- **It stops silent defaults.** Decisions get made explicitly, not implicitly by the model.
- **It separates HARD from FLEX.** Non-negotiables and adjustable defaults — clearly labeled, so agents know what they can touch and what they can't.
- **It preserves rationale.** "Why this, not that?" stays attached to the spec.
- **It reduces variance across runs.** Same Canon, more predictable builds and rebuilds.
- **Better LLM → stronger Pantion.** Pantion doesn't run its own model — your agent's LLM conducts the dialog. A more capable model asks sharper questions, catches more edge cases, and produces tighter canons. As models improve, so does every Pantion dialog — automatically, without updates.

> PRDs describe. Canons decide.

---

## Tools

| Tool | Description |
|------|-------------|
| `pantion_start` | Open the router — guides you to the right action |
| `pantion_dialog` | Start a convergence dialog (normal or automatic mode) |
| `pantion_check-convergence` | Validate whether a dialog has structurally converged |
| `pantion_save-canon` | Save the converged dialog as a canon |
| `pantion_resume` | Continue a DRAFT dialog across sessions |
| `pantion_approve` | Authorize a converged canon (HUMAN STAMP) |
| `pantion_reject` | Reject a canon — needs changes before it can proceed |
| `pantion_list-canons` | List all canons in a project |
| `pantion_translate` | Generate spec files from a canon |
| `pantion_version` | Show Pantion server version |

Works with any agent that speaks [MCP](https://modelcontextprotocol.io/). Best experience with Claude Code.

---

<details>
<summary><strong>Reference: resources, lifecycle, dialogs</strong></summary>

### MCP resources

| Resource | Content |
|----------|---------|
| `pantion://canons/{name}/dialog` | The canon (verbatim dialog) |
| `pantion://canons/{name}/summary` | Derived summary |
| `pantion://canons/index` | Canon index |
| `pantion://dialogs` | Available dialogs |
| `pantion://dialogs/{name}/rules` | Dialog-specific convergence rules |
| `pantion://souls` | Available interaction styles |
| `pantion://protocol/intent` | Core principles |

### Canon lifecycle

```
DRAFT → CONVERGED → APPROVED (HUMAN STAMP)
```

### Dialogs

| Dialog | Domain |
|-------|--------|
| `software` | Software development |
| `image` | Image generation |
| `video` | Video generation |
| `router` | Routing dialog — guides to the right action |

### Souls

Souls control conversation style (tone, jargon level, pacing) without changing what gets covered. Three bundled: `default`, `beginner`, `young`.

</details>

---

## License

[Pantion Evaluation License v1.0](LICENSE) — Copyright (c) 2026 Tom Neijman

## Links

[pantion.org](https://pantion.org) · [X/Twitter](https://x.com/pantiondialog) · [info@pantion.org](mailto:info@pantion.org)

---

<p align="center">
  <img src="https://raw.githubusercontent.com/pantion-dialogs/pantion-dialogs/main/.github/images/manakin-front.png" alt="Pantion manakin" width="100"><br>
  <em>Agent coding is here to stay. The Pantion Dialog makes it reliable.</em>
</p>
