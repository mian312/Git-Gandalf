# Git Gandalf — Local LLM-Powered Pre-Commit Code Reviewer

> "You Shall Not Commit."

Ever had that moment right after pushing code where you realize you just committed something sketchy? Yeah, we've all been there. **Git Gandalf is here to save you from yourself** — it's a lightweight pre-commit hook that whispers warnings (or screams STOP) before you accidentally ship buggy code.

It uses a local LLM running on *your* machine to review your changes just before they leave your git history. No cloud, no external APIs, no corporate surveillance. Just good old-fashioned paranoia, now automated.

---

## What You'll Need

- **Node.js v18+** (any recent version will do)
- **Git** (you're already using it, right?)
- **A local LLM** running somewhere (we like [LM Studio](https://lmstudio.ai) or [Ollama](https://ollama.ai), but use whatever you've got)

That's it. Seriously.

---

## Getting Started (5 Minutes, Tops)

### 1. Clone and Navigate

```bash
git clone <your-repo-url>
cd git-gandalf
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Drop in the Git Hook

Create this file:

```bash
.git/hooks/pre-commit
```

And paste this in:

```sh
#!/bin/sh

git diff --cached | node gitgandalf.js

exit $?
```

### 4. Make It Executable

```bash
chmod +x .git/hooks/pre-commit
```

Done. You're protected now.

---

## How the Magic Happens

When you try to commit, here's the journey your code takes:

```
git commit
    ↓
pre-commit hook wakes up
    ↓
git diff --cached (what are you trying to sneak in?)
    ↓
Git Gandalf analyzes it
    ↓
Local LLM reviews the code
    ↓
Decision time: ALLOW, WARN, or BLOCK?
    ↓
Exit code tells git: yes/no/maybe
```

Simple. Linear. Predictable.

---

## The Three Verdicts

Git Gandalf doesn't do ambiguity. You get one of three answers:

| Risk Level | What Happens                    | Meaning                                    |
| ---------- | ------------------------------- | ------------------------------------------ |
| **LOW**    | ✔ ALLOW                         | Your code looks clean. Go forth.           |
| **MEDIUM** | ⚠ WARN                          | Something's fishy. You *can* commit, but consider fixing it first. |
| **HIGH**   | ✖ BLOCK                         | Nope. Not happening. Fix it.               |

---

## What You'll Actually See

### When Everything's Good

```
✔ Git Gandalf Review
Risk: LOW
Decision: ALLOW
Summary: Safe changes
Issues: None
```

Nice and clean. Your commit goes through.

### When There's a Hiccup

```
⚠ Git Gandalf Review
Risk: MEDIUM
Decision: WARN
Summary: Needs review
Issues:
 - Possible edge case not handled
```

Git lets it through, but you got the heads-up.

### When It's a Hard No

```
✖ Git Gandalf Review
Risk: HIGH
Decision: BLOCK
Summary: Critical issue detected
Issues:
 - Possible auth bypass

Commit has been blocked due to high risk.
```

Your commit dies here. Fix the issue and try again.

---

## "But I *Really* Need to Commit This Right Now"

We get it. Life happens. You can absolutely bypass the hook:

```bash
git commit --no-verify
```

But you're flying without a safety net now. Don't say Gandalf didn't warn you.

---

## The Trust Model (Why Git Gandalf Won't Betray You)

Git Gandalf is built on the principle of **fail loudly, not silently**. Something goes wrong? You'll know about it. No hidden failures, no silent passes.

| What Happens                | What Git Gandalf Does |
| --------------------------- | --------------------- |
| LLM goes offline            | WARN                  |
| LLM takes too long          | WARN                  |
| LLM returns garbage         | BLOCK                 |
| Internal error / crash      | BLOCK                 |
| Your code is actually solid | ALLOW                 |

Every single run returns a decision. Every decision is logged. You're never left wondering what just happened.

---

## Fair Warnings (Things to Know)

- **You need a running LLM.** It won't work without one.
- **It doesn't understand language-specific best practices yet.** We're working on that.
- **No configuration files.** It does one thing, and it does it simply.
- **No fallback models.** If your LLM is down, you get a WARN and move on.
- **Massive diffs (>200KB) get rejected.** Keep your commits focused anyway.

---

## The Philosophy Behind Git Gandalf

We built this with a few principles in mind:

✓ **No bloated frameworks** — just clean Node.js code  
✓ **Stateless** — every run is independent, no state management headaches  
✓ **Fail loud** — you always know what happened  
✓ **Trust no one** — the LLM is untrusted, always validated  
✓ **Never modify your code** — Git Gandalf only watches and judges

---

## Status: Ready to Rock

All the core features are done and tested:

- ✅ Pre-commit hook integration
- ✅ Diff parsing and analysis
- ✅ Metadata extraction
- ✅ Local LLM integration
- ✅ Policy decision logic
- ✅ Terminal output formatting
- ✅ Exit code control
- ✅ Failure handling and recovery

---

## License & Contributing

Throw issues at us. Make pull requests. Let's make code safer together.

Have fun, and may your commits always be clean. 🧙‍♂️
