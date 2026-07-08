# Phase 3 - Development Tracking

## 1. Tracking Information

| Attribute | Value |
|---|---|
| Phase | Phase 3 - Team Status, Release Management, Milestones, Quality/Defect |
| Current delivery slice | P3.2 - Release Management documentation alignment |
| Company scope | Single-company: `ACME Space Inc.` |
| Overall status | `P3.1 READY; P3.2 RELEASE DOCS UPDATED WITH OPEN BA CONFIRMATIONS` |
| P3.1 Mockup | Approved |
| P3.1 SRS | Ready for Development |
| Production implementation | Not started |
| Last updated | 2026-07-08 |

BA decisions:

- P3.1 Team Status is approved as a dense dashboard/table grouped by member.
- Team Board moves to Phase 4.
- Team Board menu can remain visible in the mockup for now, but it is not part of P3.1.
- P3.2 Release Management Timeboxes dashboard behavior is documented: inline edit, resizable columns and locked create modal type.
- P3.2 still requires final BA confirmations for deeper business rules before it is marked fully Ready for Development.
- P3.3 Milestones remains pending later documentation/review.
- P3.4 Quality/Defect requires separate mockup approval before its SRS/checklist is finalized.
- Timeline file should be updated only after Phase 3 documentation and mockup are aligned across approved slices.

## 2. Status Legend

| Status | Meaning |
|---|---|
| `NOT STARTED` | Production code not started |
| `READY` | BA/mockup/SRS are ready for development |
| `IN PROGRESS` | Development in progress |
| `BLOCKED` | Cannot continue without dependency/decision |
| `IN REVIEW` | Code complete, under review/test |
| `DONE` | Code, tests and acceptance criteria passed |
| `DEFERRED` | Moved out of current phase/slice |
| `PENDING MOCKUP` | Needs mockup review before dev-ready SRS |

## 3. Progress Summary

| Group | Total tasks | Ready | Done | In Progress | Blocked | Not Started | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| Team Status P3.1 | 12 | 12 | 0 | 0 | 0 | 12 | `READY` |
| Release Management P3.2 | 12 | 7 | 0 | 0 | 0 | 12 | `BUSINESS CONFIRMATIONS OPEN` |
| Milestones P3.3 | 7 | 0 | 0 | 0 | 0 | 7 | `PENDING MOCKUP` |
| Quality/Defect P3.4 | TBD | 0 | 0 | 0 | 0 | TBD | `PENDING MOCKUP` |

## 4. Development Task Plan - P3.1 Team Status

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P3-TS-01 | Contract | Define Team Status OpenAPI/DTO | Query response, capacity patch, task patch contracts | P2.3 | 1.0h | 0h | `NOT STARTED` |
| P3-TS-02 | Backend | Implement Team Status query | Groups by owner/member for selected Project/Team/Iteration | P3-TS-01 | 2.0h | 0h | `NOT STARTED` |
| P3-TS-03 | Backend | Implement member capacity persistence | Upsert capacity by Project/Team/Iteration/User | P3-TS-01 | 1.5h | 0h | `NOT STARTED` |
| P3-TS-04 | Backend | Implement task inline patch | Patch task title/state from Team Status | P3-TS-01 | 1.5h | 0h | `NOT STARTED` |
| P3-TS-05 | Backend | Propagate completed task to Work Product | Task Completed updates referenced US/DE status to Completed | P3-TS-04 | 1.0h | 0h | `NOT STARTED` |
| P3-TS-06 | Backend | Permission guards | Viewer read-only and edit permission enforcement | P3-TS-01 | 1.0h | 0h | `NOT STARTED` |
| P3-TS-07 | Frontend | Team Status route/page | `Track > Team Status` page shell | P3-TS-01 | 1.0h | 0h | `NOT STARTED` |
| P3-TS-08 | Frontend | Iteration selector reuse | Same picker behavior as Iteration Status | P3-TS-07 | 0.75h | 0h | `NOT STARTED` |
| P3-TS-09 | Frontend | Dense grouped table | Header, totals row, member rows, task rows | P3-TS-02 | 2.0h | 0h | `NOT STARTED` |
| P3-TS-10 | Frontend | Inline edit controls | Capacity, Task Name, State dropdown | P3-TS-03, P3-TS-04 | 1.5h | 0h | `NOT STARTED` |
| P3-TS-11 | Frontend | Column resize behavior | Resizable Team Status columns | P3-TS-09 | 0.75h | 0h | `NOT STARTED` |
| P3-TS-12 | Verification | Team Status tests | API, permission, calculation, UI smoke tests | P3-TS-01..11 | 2.0h | 0h | `NOT STARTED` |

## 5. P3.1 Delivery Dependencies

| Dependency | Required behavior |
|---|---|
| Work Item / Task model | Must support task-level row identity and parent Work Product reference |
| Iteration model | Must expose Iterations filtered by Project/Team |
| Release relation | Must expose release name for task/work product row |
| Capacity storage | Must support per-member capacity for selected Iteration |
| Permissions | Must distinguish read from edit access |
| Existing detail flow | Row click should reuse Work Item Detail routing |

## 6. P3.1 Acceptance Checklist

- [ ] API returns Team Status groups for selected Project/Team/Iteration.
- [ ] API rejects Iteration from another Project/Team.
- [ ] API returns task IDs in task rows and parent US/DE in Work Product.
- [ ] API normalizes unsupported source states for Team Status display.
- [ ] Capacity PATCH persists valid values.
- [ ] Capacity PATCH rejects invalid negative values.
- [ ] Task PATCH persists title.
- [ ] Task PATCH accepts only Defined/In-Progress/Completed.
- [ ] Task Completed updates parent US/DE state to Completed.
- [ ] Viewer direct PATCH returns 403.
- [ ] Frontend page opens from Track menu.
- [ ] Frontend Iteration picker matches Iteration Status picker.
- [ ] Frontend table matches approved dense template.
- [ ] Frontend supports group collapse/expand.
- [ ] Frontend supports inline Capacity edit.
- [ ] Frontend supports inline Task Name edit.
- [ ] Frontend supports inline State edit.
- [ ] Frontend supports column resizing.
- [ ] Row click opens detail; inline controls do not trigger detail.
- [ ] Empty result state is handled.

## 7. Development Task Plan - P3.2 Release Management

P3.2 Timeboxes dashboard mockup is approved. Current confirmed direction:

- Release Management is Project-level.
- Release lives under `Plan > Timeboxes > Releases`.
- Timeboxes dashboard supports inline edit and resizable columns.
- Create Release modal locks Type to Release.
- Release status values are `Planning`, `Active`, `Accepted`.
- Release detail needs Theme and Notes rich text areas.
- Right panel fields include Start Date, Release Date, Project, State, Planned Velocity, Plan Estimate, Task Roll-up, Accepted and Version.

| ID | Module | Development task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P3-REL-01 | Contract | Define Release DTO/OpenAPI | List/create/detail/update contracts | P2 work item model | TBD | 0h | `NOT STARTED` |
| P3-REL-02 | Backend | Implement Project-level Release model | Release fields and state enum | P3-REL-01 | TBD | 0h | `NOT STARTED` |
| P3-REL-03 | Backend | Release list query | Project-filtered list with sort/page/search | P3-REL-02 | TBD | 0h | `NOT STARTED` |
| P3-REL-04 | Backend | Inline update API | PATCH Name/Theme/dates/Project/velocity/estimate/state | P3-REL-02 | TBD | 0h | `NOT STARTED` |
| P3-REL-05 | Backend | Release detail query | Theme/Notes/right-panel fields | P3-REL-02 | TBD | 0h | `NOT STARTED` |
| P3-REL-06 | Frontend | Timeboxes Release dashboard | Inline editable/resizable list | P3-REL-01 | TBD | 0h | `NOT STARTED` |
| P3-REL-07 | Frontend | Create Release modal | Type locked to Release | P3-REL-01 | TBD | 0h | `NOT STARTED` |
| P3-REL-08 | Frontend | Release detail page | Theme/Notes/right-panel layout | P3-REL-05 | TBD | 0h | `NOT STARTED` |
| P3-REL-09 | Security | Permission guards | Viewer read-only and API 403 | P3-REL-01 | TBD | 0h | `NOT STARTED` |
| P3-REL-10 | Verification | Release dashboard tests | Inline edit/resize/type lock/state enum | P3-REL-01..09 | TBD | 0h | `NOT STARTED` |
| P3-REL-11 | Verification | Release detail tests | Detail fields and permissions | P3-REL-08 | TBD | 0h | `NOT STARTED` |
| P3-REL-12 | BA | Close open business rule | Release readiness rule | BA | TBD | 0h | `BLOCKED` |

## 8. Development Task Plan - P3.3 Milestones

P3.3 is pending later mockup/docs review. Current remembered direction:

- Milestones live as a type beside Iterations/Releases/Milestones under Timeboxes.

Detailed task plan will be refreshed only after Milestones mockup/docs are explicitly approved.

## 9. Development Task Plan - P3.4 Quality/Defect

P3.4 is pending mockup review. Quality/Defect remains Phase 3 scope, but no dev-ready SRS is finalized yet.

## 10. Deferred Items And Scope Boundaries

| Item | Status | Target |
|---|---|---|
| Team Board | `DEFERRED` | Phase 4 |
| Board drag/drop status transition | `DEFERRED` | Phase 4 |
| WIP limits | `DEFERRED` | Phase 4 |
| Saved Team Status views | `DEFERRED` | Future |
| Advanced charts/reports | `DEFERRED` | Reports phase |

## 11. Open BA Confirmations

No open BA confirmation remains for P3.1 Team Status.

Open confirmations for later Phase 3 slices:

- P3.2 Release readiness rule.
- P3.3 final Milestone status enum.
- P3.3 Milestone relationship to Release.
- P3.3 Owner field requirement.
- P3.3 dedicated Milestone columns.
- P3.4 Quality/Defect screen scope and workflow.
