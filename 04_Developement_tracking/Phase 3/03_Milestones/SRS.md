# SRS - Phase 3.3 Milestones

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P3-MILESTONES` |
| Status | Core Ready / Artifact behavior deferred |
| Updated date | 2026-07-11 |
| Scope | Plan > Timeboxes > Milestones |
| Priority | Phase 3 candidate |
| Depends on | Phase 2.2 Timeboxes/Iterations, Phase 3.2 Release Management |
| Not included | Team Board, advanced portfolio roadmap, final Milestone artifact behavior |

## 1. Goal

Milestones provide delivery checkpoints across one or more Projects, Teams and Releases. They are date-based planning records used to track major delivery gates such as release candidate, security review, UAT sign-off and general availability.

## 2. Business Flow

```text
User opens Plan > Timeboxes
-> User switches Type to Milestones
-> User creates or opens a Milestone
-> User links it to one or more Projects, Teams and Releases
-> Artifact behavior is deferred for follow-up confirmation
-> System derives target start/end dates from linked Releases
-> Team reviews name, target dates, status and detail metadata
```

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| P3-MS-FR-001 | User can open `Plan > Timeboxes` and select `Milestones`. |
| P3-MS-FR-002 | Milestone dashboard shows only Name, Target Start Date, Target End Date and Status. |
| P3-MS-FR-003 | User can create a Milestone. |
| P3-MS-FR-004 | User can open Milestone detail. |
| P3-MS-FR-005 | Milestone detail shows Description and Notes rich text areas on the left, with metadata on the right. |
| P3-MS-FR-006 | Milestone statuses are `Planned`, `At Risk`, `Met`, `Missed`, `Cancelled`, `Completed`. |
| P3-MS-FR-007 | Milestone can be linked to multiple Releases. |
| P3-MS-FR-008 | Milestone can be linked to multiple Projects. |
| P3-MS-FR-009 | Milestone can be linked to multiple Teams. |
| P3-MS-FR-010 | Milestones are not Iterations and do not have velocity, task estimate or carry-over behavior. |
| P3-MS-FR-011 | Target Start Date is derived from the earliest Start Date among linked Releases. |
| P3-MS-FR-012 | Target End Date is derived from the latest Release Date among linked Releases. |
| P3-MS-FR-013 | Target Start Date and Target End Date are read-only derived fields for Milestones. |
| P3-MS-FR-014 | Milestone artifact behavior is deferred and is not part of the current dev-ready core SRS. |
| P3-MS-FR-015 | Milestone does not include a readiness checklist in Phase 3.3. |
| P3-MS-FR-016 | Milestone detail shows Projects, Teams and Releases as selected-count summary controls in the right metadata panel. |
| P3-MS-FR-017 | Clicking a Projects, Teams or Releases summary opens a selection modal with search and checkbox selection. |
| P3-MS-FR-018 | Mockup reserves a dedicated Artifacts tab beside Details; the right metadata panel is hidden while Artifacts is active. Final artifact behavior is deferred. |

## 4. Data Source Rules

- Milestone can span multiple Projects.
- Milestone can span multiple Teams.
- Milestone references one or more Releases.
- Target Start Date equals the earliest `startDate` among linked Releases.
- Target End Date equals the latest `releaseDate` among linked Releases.
- If the linked Release list changes, target dates must be recalculated immediately.
- Target dates are not manually editable for Milestones.
- Milestone artifact data model, allowed artifact types, linking behavior and permissions are deferred for follow-up confirmation.
- Projects, Teams and Releases are shown as compact selected-count summaries in the right metadata panel.
- User can click each summary to open a searchable modal and review/edit the selected items.
- Mockup shows an Artifacts tab beside Details with no right metadata panel, but artifact requirements are not final.
- Milestone does not include readiness checklist behavior in Phase 3.3.

## 5. Deferred Follow-Up Confirmations

| ID | Question | Current note |
|---|---|---|
| P3-MS-Q01 | Is Milestone required for Phase 3 or optional? | Confirmed for Phase 3 |
| P3-MS-Q02 | Does Milestone live under Timeboxes or Releases? | Confirmed under Timeboxes as a type beside Iterations and Releases |
| P3-MS-Q03 | Can Milestone link multiple Releases? | Confirmed: Milestone has a Release list |
| P3-MS-Q04 | Does Milestone need readiness checklist? | Confirmed: no readiness checklist |
| P3-MS-Q05 | Final status options? | Confirmed: Planned, At Risk, Met, Missed, Cancelled, Completed |
| P3-MS-Q06 | Can Milestone span multiple Projects and Teams? | Confirmed: multiple Projects and multiple Teams |
| P3-MS-Q07 | What exact artifact behavior does Milestone need? | Deferred follow-up; not blocking Milestone core handoff |

## 6. Acceptance Criteria

1. Milestones are visible as Phase 3 scope.
2. Milestone list/create/detail are available in mockup.
3. Milestone does not behave like Iteration velocity planning.
4. Milestone supports multiple linked Releases.
5. Target Start Date is calculated from the earliest linked Release start date.
6. Target End Date is calculated from the latest linked Release end/release date.
7. Milestone supports multiple Projects and multiple Teams.
8. Milestone artifact behavior is excluded from dev-ready acceptance criteria until BA confirmation.
9. Milestone dashboard remains limited to Name, Target Start Date, Target End Date and Status.
