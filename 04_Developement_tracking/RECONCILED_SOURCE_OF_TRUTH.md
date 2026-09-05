# Mini Rally — Reconciled BA/FE Source of Truth

**Baseline review date:** 2026-09-05. This is a document reconciliation date, not a new BA approval or test run.
**Applies to:** Active Phase 0–6 BA documents, test pack and frontend mockup; Phase 7 Test Case/Results is a separate After-MVP mockup baseline.
**Scope:** business behavior, screen behavior and session-level FE mock state only. Database, API, infrastructure and persistence after browser refresh remain outside this source.

**Phase 6 addendum (2026-07-31):** Reports are BA/mockup confirmed under `Phase 6/PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md`. Portfolio Release Tracking is BA/mockup approved and closed for DEV handoff under `Phase 6/01_Release_Tracking/SRS.md`. These Phase 6 contracts supersede the earlier Future Backlog wording for these items only; the closed Phase 0–5 baseline remains unchanged.

**C1-C10 BA correction addendum (confirmed 2026-08-06, aligned 2026-08-09):** Team is optional on Work Items; Portfolio menu is Portfolio Items/Capacity Planning/Release Tracking; Iteration Status has no separate Type column; Team Status allows Filters and pagination but not local Search/Show Fields; User list excludes Phone and Teams while User Details keeps Phone; Notification Preferences remains Future Backlog; Velocity defaults to Last 10 and persists the user's 5/10 choice; Capacity Features use `Dependencies → Rollup → Estimated → Complete`; Iterations omit Project in single-Project scope but retain Task Estimate; Work Item Owner defaults to current user with explicit Unassigned and membership-scoped options.

**Project Access reconciliation (confirmed 2026-08-14):** `Workspace Admin` is the only company-level authority. Every other user may receive `Admin` or `Editor` independently per Project. A user without an assignment has no Project Access row; the Project is hidden and direct access is denied. Viewer and selectable No Access are Future Backlog. Only Workspace Admin manages company users, Projects, Teams, Project access and Team membership. This supersedes every older global-role rule.

**Workspace Admin Team membership addendum (confirmed 2026-08-19):** An active Workspace Admin may be manually added to or removed from one or more active Teams as an operational member. This membership is not automatic, does not create an Admin/Editor Project Access assignment and does not change or replace Workspace authority. WA may appear with a fixed `Workspace Admin` badge in relevant Project/Team member views. Removing WA from a Team removes only that Team membership and never removes Workspace access. This supersedes older wording that excluded Workspace Admin from Team membership.

**Workspace Admin Project-list addendum (confirmed 2026-08-21):** Every Project `Users & Permissions` list always includes the active Workspace Admin as a system-generated, read-only row with a fixed `Workspace Admin` badge. The row is independent of Project Access and Team membership, has no Access Level dropdown or Remove action, creates no `project_members` record and is excluded from Project-member metrics. `Add Existing User` continues to assign only Admin or Editor to eligible normal users.

**Project/Team assignment addendum (confirmed 2026-08-22):** Team membership is maintained from the selected Team by an `Add` action that opens a candidate modal. Candidates are limited to active users already eligible in the selected Project: normal users with active Admin/Editor Project Access plus the active Workspace Admin system user; disabled users, users outside the Project and users already effective in the Team are excluded. Adding a Team member never creates or changes Project Access. An active Team Lead is an operational Team member and receives no separate Owner privilege. Work Item `Owner` and optional `Dev Owner` use the same current Project/Team eligibility source: Admin is eligible across the Project, Editor only in an assigned active Team, and WA only when it is an active member of the selected Team. With no Team selected, Editor/WA Team members are not offered; `Unassigned`/`No Entry` remains available. The current user is the default Owner only when eligible. `Dev Owner` is a separate nullable responsibility and must not overwrite `Owner` or reuse `assignee_id`; implementation requires its own persistent user reference. A Defect may optionally link one active User Story from the same Project; the selector must not show Stories from another Project and the saved link must reload consistently in list, inline edit and detail views.

**Team key, context switch and Defect deletion addendum (confirmed 2026-08-22):** When creating a Team, Team Key is generated automatically from Team Name using the product's current generation rule. The generated value remains editable until the first successful save, must pass the final format/uniqueness validation and becomes immutable after creation. Selecting another Project or Team from the workspace context selector navigates to that context's Home screen and invalidates/refetches all Project/Team-scoped data; stale data from the previous context must not remain visible. An authorized user may delete a Defect through a confirmation flow. Deletion is soft delete using the Work Item lifecycle (`deleted_at`), removes the Defect and its dependent display from active Backlog/Quality/Iteration/report results, retains child Tasks, attachments, comments and relations for audit/recovery, and records the actor/action. `Closed` and `Closed Declined` remain normal lifecycle choices when the Defect should be retained; neither state is a prerequisite for deletion. Hard delete is not part of the current scope.

**Phase 7 Test Case and Results addendum (confirmed 2026-08-24):** Canonical detail is `Phase 7 (After MVP)/Test Case/SRS.md`. Story/Defect Detail contains Test Cases immediately after Tasks. Add New creates a blank Test Case and inherits Work Product, Project and actual Team from the parent; `All Teams` is only a viewing scope and is never stored as a Team. Owner defaults to the eligible current user; Assigned To defaults to Unassigned. Test Case Detail contains the confirmed content fields and Project-scoped assignment metadata; no repeatable Test Steps exist in Phase 7. Results sits next to Details. Add Result persists one execution output with Build, Date, Verdict, Duration, Tester and Notes. Results list shows Build, Date, Work Product, Verdict, Duration and Tester; click Build opens two-column Result Detail. Test Case Last Verdict and Last Run are read-only rollups from the newest Result. A run is the action that produces one Result; Phase 7 has no separate Test Run entity. Test Set, batch execution and scheduling remain Future Backlog.

## 1. Use this document

The repository entry point is [README](../README.md). [Baseline reconciliation](reconciliation/BASELINE_RECONCILIATION_2026-09-05.md) records the Git/local comparison and original user confirmations.

### Confirmed corrections restored in this baseline

- **BL-01, confirmed 2026-08-14:** Task Estimate, To Do and Actual are independent after create. Copy Estimate to a blank To Do once on create only. Completed/reopen never changes any hour value. The former equality formula and Completed-to-zero rule are superseded.
- **BL-02, accepted 2026-08-14:** Project Key allows 1–10 uppercase alphanumeric characters after normalization, caps input at 10, remains unique and immutable after creation. Team Key keeps its own SRS validation; the Project decision does not change Team Key.
- **BL-03, C10 confirmed 2026-08-06:** A new Story/Defect defaults Owner to the authenticated current user when eligible in the current Project/Team; the user can explicitly choose Unassigned. The later discussion about available options did not approve a universal Unassigned default. Fallback when the current user is ineligible remains unconfirmed; do not invent a fallback or assign an ineligible user. Task and Test Case defaults use their own SRS.
- Phase 4 Roles & Permissions is the current access authority. Team Status is hidden for Editor, while the Work Item Detail Tasks tab follows the Editor's normal Team-scoped Task permission.
- The C1–C10 paragraph above preserves the 2026-08-06 decision context. Its older User-list column wording is superseded by the current Settings SRS and the 2026-08-17 retest: Name, Email, Phone Number, Status and Last Login. This does not supersede the independently confirmed C10 Owner default.
- Capacity Feature Estimated and blank-allocation defaults follow the current Phase 5 SRS: allocated Team totals take precedence; Refined/Preliminary are forecasts/default suggestions before allocation. Committed Team demand remains the saved manual allocation and is not automatically recalculated when those forecasts change.

These corrections take precedence over older summaries and historical test expected results. Keep the original results as dated evidence; no new Pass/Fail is inferred from this update.

This is the current entry point for BA, FE development and QA. It consolidates the BA-confirmed reconciliation decisions C01–C07, mockup checkpoints M1–M5.3 and the closed Phase 5 `P5-GOV v4` baseline. If an older phase document conflicts with this file, update that document before implementation; do not create a new behavior from the older wording.

Implementation handoff and acceptance references are consolidated in:

- `reconciliation/DEV_HANDOFF.md`
- `Phase 5/PHASE5_DEV_HANDOFF.md`
- `Phase 6/PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md`
- `Mini_Rally_Product_Plan.xlsx`
- `../07_Testing Plan/01_test_phase_1_to_4/specs/E2E_AGILE_LIFECYCLE_RECONCILIATION.md`

## 2. Canonical Agile lifecycle

```text
Portfolio Epic
       ↓
Portfolio Feature
       ↓
Backlog US/DE -> Iteration -> child Tasks -> US/DE status -> Iteration status
       ↓
Release <-> Milestone
```

1. Release and Milestone may be created in either order and linked many-to-many.
2. A Milestone can span multiple Projects/Teams. When it has no linked Release, user manually sets Target Start/End. Once one or more Releases are linked, Target Start = `MIN(startDate)` and Target End = `MAX(endDate)` of the linked Releases; the derived values replace manual dates while the links exist.
3. A Story/Defect has zero or one Release and zero or many Milestones. Changing Release never removes existing selected Milestones. If a Release is selected, only *new* Milestone options are limited to that Release's related Milestones.
4. New US/DE defaults to Schedule State = Flow State = `Idea`.
5. New Iteration defaults to `Planning`. Assigning a US/DE does not change it. An authorized user manually changes it to `Committed` when the scope is committed. `Committed` never locks scope.
6. Plan > Backlog shows only Story/Defect items whose Iteration is `Unscheduled`. Assigning a Story/Defect to an Iteration removes it from Backlog and makes it visible in that Iteration's execution/status views; moving it back to `Unscheduled` returns it to Backlog.
7. Task is always a child of Story/Defect, inherits its parent Work Item context and never appears as a standalone Backlog/Iteration Status row.
8. Task `Estimate`, `To Do` and `Actual` are independent hour fields. On create only, an entered Estimate is copied once to a blank To Do; an explicitly entered To Do is preserved. Subsequent edits, completing and reopening a Task never recalculate or reset any of the three fields.
9. All child Tasks `Completed` auto-change the parent US/DE to `Completed`. Reopening any Task auto-changes the parent to `In-Progress`. Manual parent status changes remain available.
10. When an Iteration is non-empty and all assigned US/DE are `Accepted`, it auto-changes to `Accepted`. Manual Iteration status changes remain available; the system does not auto-reverse it.
11. Portfolio Items use `Epic -> Feature -> Story/Defect -> Task`. Rally's `Initiative` concept is labelled `Epic` in Mini Rally. Epic is Project-level and has no Team or Release assignment. Feature is the lowest Portfolio Item type and the only Portfolio Item type that attaches directly to Story/Defect. A Feature has zero or one Epic; a Story/Defect has zero or one Feature. The Portfolio header Type selector has only `Epic` and `Feature`: Epic renders only in `All Teams`; specific Team + Epic shows `Filter not show item`; specific Team + Feature shows only that Team's Features.
12. Feature has no Plan Estimate field. Capacity Planning stores committed demand as plan-specific manual `allocation.value`, while Feature progress bars show Story/Defect rollups. The `Percent Done by...` bars and left-side `Total Accepted Children` Points/Count meter use live child totals as denominator; the `Estimated Progress by...` bars use Feature top-down refined denominators (`refinedEstimate`, `refinedWorkItemCountEstimate`) or Preliminary Estimate fallback. Epic has the same four progress bars, but rolls up leaf Story/Defect through child Features and uses Epic-owned top-down denominators, not summed child Feature estimates. These Portfolio progress denominators do not drive Capacity demand. Deferred BA note 2026-07-27: the Preliminary Estimate fallback scale/mapping must become user-configurable from `Settings gear > Workspace > Project Management`; the current mock mapping is not a hard-coded final product rule.
13. Capacity Planning uses the Mini Rally hierarchy `Workspace -> Project -> Team`. Rally child Project/Scrum Team rows are represented as Team rows under the selected Project.
14. A Capacity Plan is unique per `Project + Release`, starts as `Draft`, and can be `Published`. Draft allocation rows are plan-specific and may split one Feature across multiple Teams. `Publish Without Updating Fields` changes visibility/status only; `Publish` also writes Release and planned dates to allocated Features without overwriting Feature Project/Team and without cascading to child Story/Defect.
15. A Story/Defect can own zero/many Test Cases through `work_product_id`. A Test Case has one direct Work Product, the confirmed validation fields and zero/many Test Results. Each Result is one saved execution output; repeatable Steps and a separate Test Run entity are not in Phase 7.

## 3. Status contracts

| Entity | Allowed values | Rule |
|---|---|---|
| Story / Defect Schedule State | Idea, Defined, In-Progress, Completed, Accepted, Release | Mirrors Flow State in both directions for the MVP |
| Story / Defect Flow State | Idea, Defined, In-Progress, Completed, Accepted, Release | Mirrors Schedule State in both directions for the MVP |
| Task State | Defined, In-Progress, Completed | Separate Task lifecycle |
| Defect State | Submitted, Open, Fixed, Closed, Closed Declined | Separate from Schedule/Flow State |
| Iteration State | Planning, Committed, Accepted | Assignment never auto-commits |
| Release State | Planning, Active, Accepted | Release management state, separate from US/DE state |
| Feature State | No Entry, Intake, Idea Prioritization, Problem Discovery, Solution Discovery, Feature Prioritization, Developing, Accepted, Measuring, Done, Cancelled | Portfolio lifecycle, separate from Story/Defect Schedule/Flow state |

`Code Review`, `Testing` and `Released` are not valid US/DE Schedule/Flow values. A screen must not silently normalize legacy values; invalid legacy data needs migration or validation at its source.

## 4. Screen and navigation boundaries

| Area | Current scope (Phase 7 is After MVP) |
|---|---|
| Plan | Backlog (Unscheduled Story/Defect only) and Timeboxes |
| Track | Iteration Status (List-only) and Team Status |
| Plan > Timeboxes > Releases | Sole Phase 3 Release create/edit/detail/artifact surface |
| Portfolio > Portfolio Items | **P5.1 closed for BA/mockup scope 2026-07-28.** Accepted `Epic -> Feature` hierarchy; Type filter, search/show-fields toolbar, root checkbox bulk actions, type-specific inline edit, Epic list/create/detail/children, Feature parent-Epic assignment and four progress bars. Epic has no Team or Release assignment. |
| Portfolio > Capacity Planning | **P5.2 closed for BA/mockup scope 2026-07-28.** Single-Release Plan list/detail; Team selection from Project Breakdown; Plan-level and Team-level Feature add; one-Team assignment and multi-Team allocation; manual/forecast Capacity; live Complete/Rollup; fixed planning Estimated; advisory exceed warnings; Publish variants and Revert to Draft |
| Portfolio > Release Tracking | **Not included in closed Phase 5. Phase 6 BA/mockup approved and closed for DEV handoff.** Dedicated surface governed by `Phase 6/01_Release_Tracking/SRS.md`; it is the final item in the Portfolio menu. |
| Reports | Phase 6: Iteration Burndown, Velocity and Team Capacity only; current Project/Team scope and historical/live semantics follow the Phase 6 report contract. |
| Portfolio > Release Planning | Future Backlog; not active in Phase 5 MVP |
| Team Board / Iteration Board | Future Backlog; absent from active navigation |
| Story/Defect Detail > Test Cases | Phase 7 After MVP: linked collection, create/detail, Project Type catalog, Results history/Add Result/Result Detail; no repeatable Steps or separate Test Run entity |
| Settings gear > Workspaces & Projects | Single Workspace -> Project -> Team administration tree. Workspace Admin alone performs Project/Team CRUD and manages Project access; Admin/Editor see only their assigned read-only structure. Project-specific Preliminary Estimate points and Hours per point are configurable by Workspace Admin. |
| Settings gear | Personal: Profile & Account, My Permissions. Administration: Workspace Settings, Users, Workspaces & Projects, Permission Model and Audit Log, filtered by effective access. |
| Settings > Users | WA-only company directory. List columns are Name, Email, Phone Number, Status and Last Login. User Details separates General from Project Access; normal users may have different Access Levels per Project. |
| Settings > Permission Model | Read-only explanation of Workspace Admin plus per-Project Admin and Editor. No custom E/R/D/H matrix editing in this MVP. |

Iteration Status shows current-context Story/Defect rows assigned to the selected Iteration only. `Tasks — N active` counts non-deleted child Tasks with State other than `Completed` under the scoped US/DE, per the Iteration Status SRS. The Work Item Detail child-task count includes all non-deleted child Tasks, including Completed. Totals derive Plan Estimate from scoped US/DE and Task Estimate/To Do from all their non-deleted child Tasks; Task Estimate is the explicit Task Estimate field, not `To Do + Actual`.

## 5. Identity and mock-state contract

The frontend mockup uses shared, session-level collections for Features, Work Items, Tasks, Test Cases, Iterations, Releases and Milestones. Create creates one record; Cancel creates none. Changes made in Portfolio, Backlog, Work Item Detail, Iteration Status, Team Status, Quality and Timeboxes must show the same ID and business values in the related screens during the session.

This does **not** claim persistence after refresh, API behavior or database behavior.

## 6. Access model

`Workspace Admin` is the only company-level authority and is assigned by internal/dev setup. Workspace Admin does not receive an Admin/Editor Project Access assignment and remains excluded from the `Add Existing User` candidate list for Project Access. An active WA may be manually added to an active Team as an operational member; this Team membership is stored separately from Project Access and does not change its company-wide authority.

An active WA is eligible to be Project Owner. When the WA is an active member of a Team, it is also eligible to be that Team's Lead and to own Work Items in that Team. Every Project `Users & Permissions` list always shows the WA as a system-generated, read-only row with a `Workspace Admin` badge, regardless of Team membership; no Admin/Editor Access Level or removal action is available for that row.

Every normal user receives an independent Access Level for each Project:

| Access level | Scope | Effective behavior |
|---|---|---|
| Admin | Assigned Project, automatically All Teams | Full delivery management, including Timeboxes, Release/Milestone, Team Status, Quality, Portfolio, Capacity and Reports; Project/Team/access structure remains read-only |
| Editor | Assigned Project and one or more assigned Teams | Create/Edit/Delete team-scoped US/DE/Task and Quality Defects; update Iteration Status; no planning or administration modules |
| Unassigned user | No Project assignment | Project is hidden and direct access is rejected safely; this is not a selectable permission |

Only Workspace Admin can invite/disable company users, CRUD Projects/Teams, assign Project access or maintain Team membership. Access in one Project never grants visibility in another Project. Team membership for WA controls operational eligibility and display only, not Project authorization. Project access and Team membership changes apply on next sign-in; company disable/removal applies on next refresh.

The detailed fixed capability baseline and synchronized User/Project/Team access journeys are governed by `Phase 4/02_Roles_Permissions/SRS.md`.

## 7. Deferred work

- Reports and Release Tracking remain outside the closed Phase 5 scope, but are no longer unconfirmed Future Backlog: they are governed as Phase 6 BA/mockup-approved work. Theme/deeper custom Portfolio Item hierarchy remains Future Backlog.
- Release Tracking's Burnup visual contract is approved. Production historical accuracy and readiness cannot be claimed until DEV implements trustworthy snapshots or auditable event history plus a persisted ideal baseline.
- Release Planning, Multi-Release/Plan of Plans, multiple what-if plans for the same Project+Release, automatic rebalance and velocity-driven automatic capacity: outside the Phase 5 MVP.
- Team Board, Iteration Board, drag/drop, WIP limit and board-specific transitions: Future Backlog.
- Refresh/API/database persistence and all infrastructure behavior: DevInt implementation/verification.

## 8. Required acceptance reference

Before accepting production FE work, use `../07_Testing Plan/README.md`, the master `../07_Testing Plan/PHASE_0_6_AUDIT_TRACKER.xlsx` and the relevant current scenarios, including `../07_Testing Plan/01_test_phase_1_to_4/specs/E2E_AGILE_LIFECYCLE_RECONCILIATION.md`. Dated logs remain evidence of their own run and may need retest after a rule changes. Phase 5 is closed at BA/mockup scope; its handoff is not production sign-off. Production acceptance requires shared identity, persistence, project scope, authorization, status/roll-up behavior and metrics to agree across screens. Phase 7 acceptance is separate from the Phase 0–6 master.
