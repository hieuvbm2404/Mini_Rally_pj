# SRS - Phase 3.4 Quality / Defect

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P3-QUALITY-DEFECT` |
| Status | Dashboard Ready / Workflow actions deferred |
| Updated date | 2026-07-11 |
| Scope | `Quality > Defect` dashboard |
| Priority | Phase 3 candidate |
| Depends on | Phase 1 Work Item base, Phase 2 Backlog/Detail behavior |
| Not included | Final defect workflow actions, automation rules, advanced quality governance |

## 1. Current Confirmed Direction

- Quality has a dedicated top navigation entry.
- Defect has a dedicated dashboard under `Quality > Defect`.
- Current mockup opens a defect dashboard using the Backlog dashboard template.
- Defects shown in `Quality > Defect` are the same Defect work items used in Backlog; Quality is a dedicated defect view, not a separate defect source.
- Confirmed dashboard columns: Rank, ID, Name, User Story, Severity, Priority, State, Flow State, Fixed In Build, Iteration, Submitted By and Owner.
- Dashboard supports search, filter placeholder, row selection, bulk-action placeholder, sortable/resizable columns, pagination and detail panel.
- Phase 3.4 handoff covers the dashboard view and confirmed field option sets. Detailed workflow actions are deferred.

## 2. Confirmed Dashboard Columns

| Column | Notes |
|---|---|
| Rank | Defect ordering column. |
| ID | Defect ID. |
| Name | Defect title/name. |
| User Story | Linked user story. |
| Severity | Defect severity. |
| Priority | Defect priority. |
| State | Defect state. |
| Flow State | Defect flow state. |
| Fixed In Build | Build where fix is/will be available. |
| Iteration | Assigned iteration. |
| Submitted By | User who submitted the defect. |
| Owner | Current owner. |

## 3. Deferred Follow-Up Confirmations

| ID | Question | Current note |
|---|---|---|
| P3-QA-Q01 | Does P3.4 cover only Defect dashboard or wider Quality workflows? | Confirmed for current handoff: Defect dashboard only |
| P3-QA-Q02 | What is the final defect lifecycle/state transition set? | Option sets confirmed; transition rules deferred |
| P3-QA-Q03 | Which columns are required on the Defect dashboard? | Confirmed: Rank, ID, Name, User Story, Severity, Priority, State, Flow State, Fixed In Build, Iteration, Submitted By, Owner |
| P3-QA-Q04 | Which bulk actions are in Phase 3.4? | Deferred follow-up |
| P3-QA-Q05 | Is defect creation inline, modal-only, or both? | Deferred follow-up |

## 4. Confirmed Defect Field Options

| Field | Options |
|---|---|
| Severity | None, Critical, Major Problem, Minor Problem, Trivial |
| Priority | None, Urgent, High, Normal, Low |
| State | Submitted, Open, Fixed, Closed, Closed Declined |
| Flow State | Idea, Defined, In-Progress, Completed, Accepted, Released |

## 5. Draft Acceptance Direction

1. User can open `Quality > Defect`.
2. Defect dashboard is separate from Team Status, Release and Milestone screens.
3. Defect dashboard uses Backlog-style table behavior.
4. Defect dashboard shows the confirmed column set.
5. Defect workflow action details are deferred and do not block dashboard handoff.
