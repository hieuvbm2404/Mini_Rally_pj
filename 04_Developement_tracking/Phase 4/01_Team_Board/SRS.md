# SRS Draft - Phase 4 Team Board

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P4-TEAM-BOARD` |
| Status | Moved from Phase 3 / Pending BA confirmation |
| Updated date | 2026-07-07 |
| Scope | Track > Team Board |
| Priority | Phase 4 candidate |
| Depends on | Phase 2.3 Iteration Status, Phase 3 Team Status |
| Not included in Phase 3 | Team Board, board drag/drop execution, WIP enforcement, board transition rules |

## 1. BA Decision

On 2026-07-07, BA moved `Team Board` out of Phase 3 and into Phase 4.

Phase 3 now focuses on:

```text
Team Status -> Release Management -> Milestones
```

Team Board remains a future execution surface. It must not block Phase 3 documentation, mockup, or development planning.

## 2. Phase 4 Candidate Scope

Current mockup direction to preserve for Phase 4:

- Entry point: `Track > Team Board`.
- Iteration selector reads Iteration records from `Plan > Timeboxes`.
- Board works against work items assigned to the selected Iteration.
- Board columns: `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- Work item cards show type, id, title, priority, estimate, owner and blocked/task indicators.
- Card click opens Work Item Detail.
- Drag/drop between columns updates Schedule State only after transition rules are confirmed.
- WIP limits are Phase 4+ and need configuration rules.

## 3. Pending BA Confirmations

| ID | Question | Current note |
|---|---|---|
| P4-TB-Q01 | Should Team Board create Story/Defect only, or also Task/Feature? | Not decided |
| P4-TB-Q02 | Should drag/drop immediately update Schedule State? | Not decided |
| P4-TB-Q03 | What transition rules are allowed between states? | Not decided |
| P4-TB-Q04 | Is WIP limit required, and where is it configured? | Not decided |
| P4-TB-Q05 | Should existing backlog assignment be available on the board? | Phase 2 handles assignment from Backlog/Work Item Detail |
| P4-TB-Q06 | How does Start/Close Iteration and carry-over relate to Board? | Deferred |

## 4. Development Guidance

- Do not implement Team Board in Phase 3.
- Do not introduce a second work item store.
- Future Team Board must reuse Backlog/work_items and Iteration assignment data.
- Keep Schedule State enum aligned with Iteration Status unless BA defines a separate workflow.
- Treat this file as a placeholder until BA marks it `Ready for Development`.
