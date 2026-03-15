# /pantion-help — Guide to all Pantion commands

Give the user a clear overview, tailored to what they want to do.

---

## STEP 1: RECOGNIZE THE SITUATION

Look at the context:
- Is there already a `canon/` directory? → existing Pantion project
- Is there code but no `canon/`? → existing project without Pantion
- Is there nothing? → new project

---

## STEP 2: SHOW THE OVERVIEW

Say:

"Here are all Pantion commands. I've grouped them by what you want to do:

---

### 🆕 Build something new

| Command | What it does |
|---------|-------------|
| `/pantion-start` | Full protocol: describe your idea → I ask questions → canon → project files → build |
| `/pantion-quick` | Quick variant: fewer questions, conservative assumptions (⚡), ideal for prototypes |

---

### 📦 Existing project

| Command | What it does |
|---------|-------------|
| `/pantion-onboard` | Add Pantion to a project that already has code (three strategies: forward-only / full reverse / partial) |
| `/pantion-reverse` | Extract intent from existing codebase → generate canon (not describing the code, but the intent) |

---

### 🔧 Continue working on a canon

| Command | What it does |
|---------|-------------|
| `/pantion-resume` | Continue converging on a DRAFT canon (across multiple sessions) |
| `/pantion-amend` | Apply a change to an existing CONVERGED canon |
| `/pantion-redialog` | Re-evaluate a converged canon with a better model (gap analysis + supplementary dialog) |
| `/pantion-translate` | Translate canon to project specification files (requirements, constraints, specs) |

---

### 🏗️ Scale & structure

| Command | What it does |
|---------|-------------|
| `/pantion-decompose` | Split large system into architect canon + interface canons + component canons |

---

### ✅ Quality

| Command | What it does |
|---------|-------------|
| `/pantion-check` | Check whether canons are complete, consistent, and build-ready |

---

### 🔄 Protocol evolution

| Command | What it does |
|---------|-------------|
| `/pantion-update` | Upgrade the protocol itself — ⚠️ may introduce breaking changes |
| `/pantion-migrate` | Update project to new protocol after an upgrade |

---

### ❓ This command

| Command | What it does |
|---------|-------------|
| `/pantion-help` | This overview |

---

**Not sure which command you need?** Just tell me what you want to do, and I'll point you in the right direction."

---

## STEP 3: REDIRECT

If the user asks a question or describes what they want after seeing the overview, redirect:

| The user says... | Redirect to |
|-----------------|-------------|
| "I want to build something new" | `/pantion-start` or `/pantion-quick` |
| "I already have code and want to use Pantion" | `/pantion-onboard` |
| "I want to understand what my code does" | `/pantion-reverse` |
| "I was working on something but stopped" | `/pantion-resume` |
| "I want to change something in an existing canon" | `/pantion-amend` |
| "I just want to generate the project files" | `/pantion-translate` |
| "My system is too big" | `/pantion-decompose` |
| "I want to check if everything is correct" | `/pantion-check` |
| "I have a better model now" / "My canon is too shallow" | `/pantion-redialog` |
| "I want to upgrade Pantion itself" | `/pantion-update` |
| "My project doesn't work anymore after a Pantion update" | `/pantion-migrate` |
| "What is Pantion?" | Explain briefly (see below) |

---

## IF THE USER ASKS: "WHAT IS PANTION?"

Say:

"Pantion is a protocol that helps you go from idea to working system through a structured conversation.

Instead of writing a spec, you describe what you want to build. I ask the right questions until your intent is clear — no more guesswork. That conversation becomes the source of truth (the 'canon'). Everything that follows — code, configuration, documentation — is derived from that canon.

Core principle: **code is replaceable, intent is rebuildable.**

Want to get started? Type `/pantion-start` for the full protocol, or `/pantion-quick` if you want to prototype quickly."
