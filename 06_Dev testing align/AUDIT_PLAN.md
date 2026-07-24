# DevInt Audit Plan — un-tested checkpoints (Phase 1 leftovers → Phase 2 → Phase 3)

**Created:** 2026-07-23 · **Environment:** `https://rally-dev.qnsc.vn/` (Microsoft SSO, `hieuvbm@qnsc.vn`)
**Follows:** `README.md` working rule + same discipline as `RETEST_PLAN.md`. First-time audit (not retest).

## Objective
Audit checkpoints never executed, comparing three sources: **Business Expected ↔ Mockup ↔ DevInt Actual**. Record evidence, classify, BA confirms per phase before moving on.

## Classification
- ✅ **Match** — correct vs business + mockup.
- 🟡 **Partial Match** — partly correct.
- ❌ **Gap** — divergent; log a new Gap Log row.
- ⛔ **Blocked** — missing data/dependency.
- 🔵 **New Divergence** vs both SRS and mockup → stop and ask BA.

## Order
**Step 0 — Quick wins (previously Blocked, now unblockable):**
- `P1-CREATE-02` Create with details (create now works)
- `P0-SHELL-02` Team filter (Team Alpha now linked to NXP)
- `P1-TEAM-01/02` Settings > Teams (Team Alpha + data exist)

**Step 1 — Phase 1 leftovers:** `P1-CONTENT-01` (Description/Notes/Attachments), `P1-HIST-01` (Revision History).

**Step 2 — Phase 2:** `P2-IT-01` → `P2-IT-02` → `P2-IS-01` → `P2-IS-02` → `P2-IS-04` → `P2-BL-01`.

**Step 3 — Phase 3:** `P3-TS-01` → `P3-REL-01/02` → `P3-MS-01/02/03` → `P3-QA-01/02`.

## Self-run
Per checkpoint: navigate → observe (read_page/screenshot/network) → compare 3 sources → classify → one-line result + evidence. Run a whole phase/group, then stop to report.

## BA confirmation gates
- **Main gate:** end of each phase/group → present result table, BA confirms once → update tracker → continue.
- **Stop immediately** on a New Divergence or any risky/hard-to-reverse action.

## Safety / mutation
Create/edit uses the `DEVINT-AUDIT` prefix, non-destructive, restored after. No role/workspace-settings mutation, no hard delete, no accepting/closing a real sprint without approval. No passwords/tokens in files.

## Tracker updates
Never overwrite history. Per checkpoint → update **Screen Inventory** Audit Status + BA Confirmation; each divergence → append a new **Gap Log** row with BA Decision as confirmed. Update the Audit Control live summary.
