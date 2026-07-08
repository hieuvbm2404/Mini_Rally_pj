# SRS - Phase 3.1 Team Status

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P3-TEAM-STATUS` |
| Status | Ready for Development |
| Updated date | 2026-07-08 |
| Scope | `Track > Team Status` |
| Priority | P3.1 - required |
| Depends on | Phase 1 Work Item base, Phase 2.1 Backlog Enhancement, Phase 2.2 Timeboxes > Iterations, Phase 2.3 Iteration Status |
| Mockup source | `03_Mockup Design/src/app/pages/TeamStatusPage.tsx` |
| Not included in P3.1 | Team Board, board drag/drop, WIP limits, Release CRUD, Milestone CRUD, Quality workflow |

## 1. Goal

Team Status provides a Rally-like team execution dashboard for one selected Iteration. The page lets a PM/SM/lead view team workload by member, review the task rows owned by each member, update member capacity, update task name, and update task execution state.

This screen is not a board. It is a dense status table grouped by member/owner. Team Board is moved to Phase 4.

## 2. Reference Documents

| Document | Purpose |
|---|---|
| `PHASE3_MOCKUP_CHECKLIST.md` | Phase 3 mockup coverage and BA decisions |
| `PHASE3_DEVELOPMENT_TRACKING.md` | Development task breakdown |
| `../Phase 2/03_Iteration_Status/SRS.md` | Iteration selector and dense table baseline |
| `../Phase 2/01_Backlog_Enhancement/SRS.md` | Work Item source and inline edit behavior |
| `../Phase 2/02_Iterations/SRS.md` | Iteration/Timebox source records |
| `03_Mockup Design/src/app/pages/TeamStatusPage.tsx` | Approved Team Status mockup |
| `03_Mockup Design/src/app/model.ts` | Mock data source |
| `05_Architecture/DATABASE_SCHEMA.md` | Physical DB mapping reference |

## 3. Actors

- Workspace Admin.
- Project Manager / Scrum Master.
- Product Owner / BA.
- Developer / QA.
- Viewer.

Current mockup uses Workspace Admin. Production must enforce permissions in the API even when the UI hides or disables edit controls.

## 4. Terminology

| Term | Meaning |
|---|---|
| Team Status | P3.1 screen under `Track` showing team execution status for one Iteration. |
| Iteration | Timebox/Sprint-like record created under `Plan > Timeboxes > Iterations`. |
| Member group | One owner/member row with expandable task rows underneath. |
| Task row | A task-level execution row assigned to a member. The row displays a task ID, task name, work product, release, state, estimates and owner. |
| Work Product | The parent Story/Defect/Feature referenced by a task row. Displayed as `US...` or `DE...` in the Work Product column. |
| Capacity | Member capacity in hours for the selected Iteration. Editable inline at member-group level. |
| Estimate | Estimated task hours for the row or group total. |
| ToDo | Remaining task hours. |
| Actuals | Actual task hours or calculated actual rollup. |
| Task State | Task-level state shown in Team Status. Allowed values are exactly `Defined`, `In-Progress`, `Completed`. |

## 5. Business Rules / Business Flow

Business flow:

```text
User selects Workspace Project/Team context
-> User opens Track > Team Status
-> User selects an Iteration using the same selector pattern as Iteration Status
-> System loads task execution rows for the selected Iteration and Team
-> Rows are grouped by task owner/member
-> User expands/collapses each member group
-> User can inline edit member Capacity
-> User can inline edit Task Name and Task State
-> Task State updates are persisted and reflected in the parent Work Product status
```

Rules:

- Team Status reads the selected Project/Team context from the global workspace selector.
- Iteration selector options are filtered to Iterations that belong to the selected Project/Team context.
- Team Status shows task-level rows, not parent Story/Defect rows in the ID column.
- The ID column must display task IDs such as `TA-404821`.
- `US...` and `DE...` values belong in the Work Product column.
- Work Product column must identify the parent work product and show a truncated title.
- Task State options are exactly `Defined`, `In-Progress`, `Completed`.
- Legacy or broader work item states such as `Idea`, `Accepted`, `Release`, `Code Review`, `Testing` must not be shown as Team Status task-state options.
- If source data has `Idea`, display it as `Defined` in Team Status.
- If source data has `Accepted`, `Release`, or equivalent terminal states, display it as `Completed` in Team Status.
- When a task row is changed to `Completed`, the referenced Work Product (`US` or `DE`) must have execution status updated to `Completed`.
- Team Status must not create or duplicate Work Items.
- Team Status must not move cards between board columns.
- Member Capacity is scoped to the selected Iteration and member.
- Task Name editing updates the task title only. It must not rename the parent Work Product.
- Row click outside inline controls opens the existing Work Item Detail for the referenced task or parent work product, based on production routing.
- Inline controls must stop row navigation.

## 6. Functional Requirements

| ID | Requirement |
|---|---|
| P3-TS-FR-001 | User can open `Track > Team Status`. |
| P3-TS-FR-002 | Page breadcrumb displays current Project, `Track`, and `Team status`. |
| P3-TS-FR-003 | Page uses the same Iteration selector pattern as Iteration Status: previous button, combined Iteration name/date selector, next button. |
| P3-TS-FR-004 | Iteration selector reads options from Timeboxes/Iterations. |
| P3-TS-FR-005 | Changing Iteration refreshes the grouped table data and totals. |
| P3-TS-FR-006 | Page does not show the Team Status search input. |
| P3-TS-FR-007 | Page does not show a KPI strip above the table. |
| P3-TS-FR-008 | Main content is a dense resizable table aligned with the Iteration Status table template. |
| P3-TS-FR-009 | Header typography, row height and font size must match the approved Iteration Status dense table style. |
| P3-TS-FR-010 | Table columns are: Rank, ID, Task Name, Work Product, Release, State, Capacity, Estimate, ToDo, Actuals, Owner. |
| P3-TS-FR-011 | All columns support resize behavior. |
| P3-TS-FR-012 | Column header sort affordance is shown, matching Iteration Status template. |
| P3-TS-FR-013 | The table includes a totals row below the header for Capacity, Estimate, ToDo and Actuals. |
| P3-TS-FR-014 | Rows are grouped by Owner/Member. |
| P3-TS-FR-015 | Each member group shows avatar, owner name, task count, progress percent, capacity, estimate, todo and actuals. |
| P3-TS-FR-016 | Member group expand/collapse uses an arrow-only button without a visible bordered square. |
| P3-TS-FR-017 | User with edit permission can inline edit member Capacity. |
| P3-TS-FR-018 | Capacity accepts numeric hours greater than or equal to 0. |
| P3-TS-FR-019 | User with edit permission can inline edit Task Name. |
| P3-TS-FR-020 | Task Name edit preserves or normalizes display prefix such as `DEV -` or `QA -` in the UI, but stores the task title as the editable title field. |
| P3-TS-FR-021 | User with edit permission can inline edit Task State. |
| P3-TS-FR-022 | Task State dropdown options are exactly `Defined`, `In-Progress`, `Completed`. |
| P3-TS-FR-023 | Task ID column displays task IDs only, for example `TA-404821`. |
| P3-TS-FR-024 | Work Product column displays the parent work product ID/title, for example `US4821: Implement...` or `DE1142: Dashboard...`. |
| P3-TS-FR-025 | Release column displays the release assigned to the task/work product. |
| P3-TS-FR-026 | Estimate, ToDo and Actuals are shown as numeric hour values. |
| P3-TS-FR-027 | Owner column displays the task owner name. |
| P3-TS-FR-028 | Viewer can read the page but cannot edit Capacity, Task Name or Task State. |
| P3-TS-FR-029 | User without edit permission sees non-editable values or disabled controls. |
| P3-TS-FR-030 | Inline edit failure must show field-level or toast error and revert or keep the previous persisted value. |
| P3-TS-FR-031 | Row click opens Work Item Detail without losing the selected Iteration context. |
| P3-TS-FR-032 | Team Board menu item may remain visible in mockup, but Team Board is not a P3.1 deliverable. |

## 7. Screen Mapping With Approved Mockup

| UI area | Approved mockup behavior | Production behavior |
|---|---|---|
| Navigation | `Track > Team status` | Opens Team Status route/page |
| Breadcrumb | `Nexus Platform 2025 > Track > Team status` | Uses current Project name from workspace context |
| Iteration selector | Label `Iteration`, previous/next buttons, combined name/date dropdown | Reuse Iteration Status selector component/pattern |
| Search input | Removed | No Team Status-specific quick search in P3.1 |
| KPI strip | Removed | No KPI cards above table in P3.1 |
| Table header | Dense header with sort icon and resize handle | Same visual template as Iteration Status |
| Totals row | Capacity, Estimate, ToDo, Actuals totals | Calculated from filtered groups |
| Member row | Owner avatar/name/task count, progress bar, inline Capacity | Group by task owner/member |
| Task row ID | Type badge `Task` plus `TA-...` | Task-level identity |
| Task Name | Inline editable input | Updates task title |
| Work Product | Parent `US/DE` ID and title | Link/reference to parent Story/Defect |
| State | Dropdown with `Defined`, `In-Progress`, `Completed` | Updates task state and parent work product status rule |
| Capacity | Empty on task row, editable on member group row | Member/iteration capacity, not per-task capacity |
| Estimate/ToDo/Actuals | Numeric hours | From task estimate/remaining/actual rollups |
| Collapse | Arrow only | No boxed border around arrow |

## 8. Data Model And Field Mapping

### 8.1 Query Context

| UI field/source | API field | DB/source | Rule |
|---|---|---|---|
| Workspace Project | `projectId` | `projects.id` | Required |
| Workspace Team | `teamId` | `teams.id` | Required unless current app context explicitly supports `All Teams` |
| Selected Iteration | `iterationId` | `iterations.id` / `planning.sprints.id` | Required |

### 8.2 Team Status Response

Suggested DTO:

```ts
type TeamStatusResponse = {
  projectId: string;
  teamId: string;
  iteration: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  totals: {
    capacityHours: number;
    estimateHours: number;
    todoHours: number;
    actualHours: number;
  };
  groups: TeamStatusMemberGroupDto[];
};

type TeamStatusMemberGroupDto = {
  owner: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  capacityHours: number;
  taskCount: number;
  estimateHours: number;
  todoHours: number;
  actualHours: number;
  progressPercent: number;
  tasks: TeamStatusTaskRowDto[];
};

type TeamStatusTaskRowDto = {
  id: string;
  taskKey: string;
  title: string;
  displayName: string;
  workProduct: {
    id: string;
    key: string;
    type: "Story" | "Defect" | "Feature";
    title: string;
    status: string;
  };
  release?: {
    id: string;
    name: string;
  } | null;
  state: "Defined" | "In-Progress" | "Completed";
  estimateHours: number;
  todoHours: number;
  actualHours: number;
  owner: {
    id: string;
    displayName: string;
  };
  rank?: string | null;
};
```

### 8.3 UI Field Mapping

| UI field | API DTO | DB/source | Editable | Rule/null handling |
|---|---|---|---|---|
| Rank | `tasks[].rank` | `tasks.rank` or `work_items.rank` | No in P3.1 | Used for display/sort only |
| ID | `tasks[].taskKey` | Task key/id | No | Must be task ID, not parent US/DE |
| Task Name | `tasks[].title` | Task title | Yes | Required after trim |
| Work Product | `tasks[].workProduct` | Parent work item | No | Must display US/DE parent ID/title |
| Release | `tasks[].release.name` | Release relation | No in P3.1 | Nullable -> blank |
| State | `tasks[].state` | Task execution state | Yes | Only Defined/In-Progress/Completed |
| Capacity | `groups[].capacityHours` | Member iteration capacity | Yes | Group row only; numeric >= 0 |
| Estimate | `tasks[].estimateHours` / group total | Task estimate | No in P3.1 | Default 0 |
| ToDo | `tasks[].todoHours` / group total | Remaining task hours | No in P3.1 | Default 0 |
| Actuals | `tasks[].actualHours` / group total | Time tracking or task actuals | No in P3.1 | Default 0 |
| Owner | `tasks[].owner.displayName` | Task owner | No in P3.1 | Required for grouped rows; unassigned can appear as `Unassigned` only if backend supports it |

### 8.4 Capacity Storage

Production should persist member capacity by Project/Team/Iteration/User.

Suggested logical table:

| Field | Rule |
|---|---|
| `project_id` | Required |
| `team_id` | Required |
| `iteration_id` | Required |
| `user_id` | Required |
| `capacity_hours` | Numeric >= 0 |
| `created_at`, `updated_at` | Audit timestamps |
| Unique key | `(project_id, team_id, iteration_id, user_id)` |

If an existing capacity table already exists, map this concept to that table and keep the API contract stable.

### 8.5 Task State Values

Allowed values in Team Status:

| UI value | API value suggestion | Meaning |
|---|---|---|
| Defined | `defined` | Task is ready but not actively being worked |
| In-Progress | `in_progress` | Task is being worked |
| Completed | `completed` | Task is complete |

Normalization for read:

| Source value | Team Status display |
|---|---|
| `Idea` | `Defined` |
| `Defined` | `Defined` |
| `In-Progress` | `In-Progress` |
| `Code Review` | `In-Progress` |
| `Testing` | `In-Progress` |
| `Completed` | `Completed` |
| `Accepted` | `Completed` |
| `Release` | `Completed` |

## 9. API Contracts

### 9.1 Get Team Status

```http
GET /api/team-status?projectId={projectId}&teamId={teamId}&iterationId={iterationId}
```

Response: `TeamStatusResponse`.

Rules:

- Validate that the user can access the requested Project/Team.
- Validate that the Iteration belongs to the requested Project/Team.
- Return groups ordered by owner display name or configured team order.
- Return task rows ordered by rank, then task key.
- Return empty groups only if product decides to show all members; approved P3.1 mockup shows members with tasks.

### 9.2 Update Member Capacity

```http
PATCH /api/team-status/capacity
Content-Type: application/json

{
  "projectId": "project-1",
  "teamId": "team-1",
  "iterationId": "iteration-1",
  "userId": "user-1",
  "capacityHours": 54
}
```

Response:

```json
{
  "userId": "user-1",
  "capacityHours": 54
}
```

Rules:

- Requires edit permission for Team Status or iteration planning.
- `capacityHours` must be numeric and >= 0.
- Upsert by `(projectId, teamId, iterationId, userId)`.
- Return validation error if user is not a member of the selected Team.

### 9.3 Update Task From Team Status

```http
PATCH /api/team-status/tasks/{taskId}
Content-Type: application/json

{
  "title": "DEV - Implement SSO authentication via SAML 2.0 for enterprise tenant onboarding",
  "state": "Completed"
}
```

Response:

```json
{
  "id": "task-1",
  "taskKey": "TA-404821",
  "title": "Implement SSO authentication via SAML 2.0 for enterprise tenant onboarding",
  "state": "Completed",
  "workProduct": {
    "id": "story-4821",
    "key": "US4821",
    "status": "Completed"
  }
}
```

Rules:

- Accept partial patch for `title` and/or `state`.
- `title` is required if included and must be non-empty after trim.
- `state` must be one of `Defined`, `In-Progress`, `Completed`.
- If `state = Completed`, update the referenced Work Product status to `Completed`.
- Reject updates when the task does not belong to the selected Project/Team/Iteration context.
- Reject Viewer or unauthorized role mutation even if the UI allows a direct API call.

### 9.4 Error Contract

Use the standard API error envelope already defined for prior phases.

Required validation cases:

| Case | Expected result |
|---|---|
| Missing `iterationId` | 400 validation error |
| Iteration from another Project/Team | 400 or 403 validation/access error |
| Capacity < 0 | 400 field validation error |
| Empty title | 400 field validation error |
| Unsupported task state | 400 field validation error |
| Viewer patch attempt | 403 permission error |
| Task not in selected context | 404 or 403, based on existing API convention |

## 10. Calculation Rules

| Field | Calculation |
|---|---|
| Group Capacity | Persisted capacity for selected member/iteration; default 0 or configured team default if none exists |
| Total Capacity | Sum of visible group `capacityHours` |
| Task Estimate | Task estimate hours |
| Group Estimate | Sum of visible task `estimateHours` for member |
| Total Estimate | Sum of group estimates |
| Task ToDo | Remaining task hours |
| Group ToDo | Sum of visible task `todoHours` for member |
| Total ToDo | Sum of group todo |
| Task Actuals | Actual task hours from time tracking or task actual field |
| Group Actuals | Sum of visible task `actualHours` for member |
| Total Actuals | Sum of group actuals |
| Progress Percent | `actualHours / estimateHours * 100`, capped at 100; if estimate is 0, show 0 |

All calculations must use the same filtered task set returned by the selected Project/Team/Iteration query.

## 11. Permissions

| Role/permission | Read Team Status | Edit Capacity | Edit Task Name | Edit Task State |
|---|---:|---:|---:|---:|
| Workspace Admin | Yes | Yes | Yes | Yes |
| Project Manager / Scrum Master | Yes | Yes | Yes | Yes |
| Product Owner / BA | Yes | Optional by product permission | Optional by product permission | Optional by product permission |
| Developer / QA | Yes | No by default | Own tasks only if permission allows | Own tasks only if permission allows |
| Viewer | Yes | No | No | No |

If the production RBAC model does not yet support field-level permissions, enforce a simple `can_edit_team_status` permission and keep Viewer read-only.

## 12. Acceptance Criteria

1. `Track > Team Status` opens a dedicated Team Status screen.
2. Team Status uses the selected Project/Team context.
3. Iteration selector uses the same visual/control pattern as Iteration Status.
4. Iteration selector displays Iteration name and date range in one control.
5. Previous/next iteration buttons update the selected Iteration.
6. Team Status does not show a local search input.
7. Team Status does not show a KPI strip above the table.
8. Table columns are exactly Rank, ID, Task Name, Work Product, Release, State, Capacity, Estimate, ToDo, Actuals, Owner.
9. Table header, row height and font size match the Iteration Status dense table template.
10. Columns are resizable.
11. Rows are grouped by owner/member.
12. Member group rows show progress, editable capacity, estimate, todo and actuals.
13. Collapse/expand control is arrow-only without visible button border.
14. Task row ID shows a task ID such as `TA-404821`.
15. Work Product column shows parent `US` or `DE` ID/title.
16. Task Name is inline editable for authorized users.
17. State dropdown is inline editable for authorized users.
18. State dropdown contains only `Defined`, `In-Progress`, `Completed`.
19. Updating a task to `Completed` updates the referenced parent Work Product to `Completed`.
20. Capacity is inline editable at member group level for authorized users.
21. Viewer can read Team Status but cannot edit Capacity, Task Name or State.
22. Inline edit validation errors are visible and do not silently corrupt table data.
23. Row click opens the existing detail flow without triggering when clicking inline controls.
24. Team Board, drag/drop, WIP limits and board transition rules are not required for P3.1.

## 13. Test Scenarios

| ID | Scenario | Expected result |
|---|---|---|
| P3-TS-TS-001 | Open `Track > Team Status` as Workspace Admin | Team Status page loads |
| P3-TS-TS-002 | Select Sprint 24.3 | Member groups and task rows for Sprint 24.3 are shown |
| P3-TS-TS-003 | Click previous/next Iteration | Table refreshes to selected Iteration |
| P3-TS-TS-004 | Resize ID column | Column width changes without breaking table alignment |
| P3-TS-TS-005 | Collapse Marcus Webb group | Only member group row remains visible |
| P3-TS-TS-006 | Expand Marcus Webb group | Task rows reappear |
| P3-TS-TS-007 | Edit Marcus Webb capacity from 54 to 60 | Capacity persists and total capacity updates |
| P3-TS-TS-008 | Enter capacity -1 | Validation error; previous value remains |
| P3-TS-TS-009 | Edit task name | Task title persists; parent Work Product title is unchanged |
| P3-TS-TS-010 | Clear task name | Validation error; previous title remains |
| P3-TS-TS-011 | Open State dropdown | Only Defined/In-Progress/Completed are available |
| P3-TS-TS-012 | Change task state to Completed | Task state persists; parent US/DE status becomes Completed |
| P3-TS-TS-013 | Source state Accepted is returned by backend | UI displays Completed |
| P3-TS-TS-014 | Source state Idea is returned by backend | UI displays Defined |
| P3-TS-TS-015 | Viewer opens Team Status | Values are readable but inline edit controls are disabled/read-only |
| P3-TS-TS-016 | Viewer calls PATCH task API directly | API returns 403 |
| P3-TS-TS-017 | Request Iteration from another Team | API rejects with validation/access error |
| P3-TS-TS-018 | Click task row outside inline inputs | Existing detail route opens |
| P3-TS-TS-019 | Click State dropdown | Row detail does not open |
| P3-TS-TS-020 | Empty Iteration has no tasks | Page shows empty table state without crashing |

## 14. Development Task Breakdown

| ID | Task | Deliverable |
|---|---|---|
| P3-TS-01 | Define API DTO/OpenAPI for Team Status | Query response, capacity patch and task patch contracts |
| P3-TS-02 | Implement Team Status query backend | Grouped owner/member task data for selected Project/Team/Iteration |
| P3-TS-03 | Implement capacity storage | Upsert member capacity by Project/Team/Iteration/User |
| P3-TS-04 | Implement task patch behavior | Update task title/state from Team Status |
| P3-TS-05 | Implement parent Work Product completion propagation | Task Completed updates parent US/DE status to Completed |
| P3-TS-06 | Implement permission guards | Read/edit permissions and Viewer read-only enforcement |
| P3-TS-07 | Build Team Status route/page | `Track > Team Status` page with approved layout |
| P3-TS-08 | Build Iteration selector reuse | Same selector pattern as Iteration Status |
| P3-TS-09 | Build grouped dense table | Header, totals row, group rows, task rows |
| P3-TS-10 | Build inline edit controls | Capacity, Task Name, State |
| P3-TS-11 | Build column resizing | Persistent or local table resizing |
| P3-TS-12 | Add tests | API, permissions, calculation, UI smoke and regression coverage |

## 15. Out Of Scope

| Item | Target |
|---|---|
| Team Board | Phase 4 |
| Board drag/drop | Phase 4 |
| WIP limits | Phase 4 |
| Board transition validation | Phase 4 |
| Release Management | P3.2 |
| Milestones | P3.3 |
| Quality/Defect workflow | Later Phase 3 slice after mockup approval |
| Advanced reporting/charts | Reports phase |
| Saved Team Status views | Future |

## 16. Ready For Development Checklist

- [x] Scope confirmed by BA.
- [x] Approved mockup exists.
- [x] Team Status is dashboard/table, not board.
- [x] Team Board moved to Phase 4.
- [x] Iteration selector behavior specified.
- [x] Table columns specified.
- [x] Grouping by member specified.
- [x] Inline editable fields specified.
- [x] Task State values specified.
- [x] Work Product completion rule specified.
- [x] Data mapping specified.
- [x] API contracts specified.
- [x] Permissions specified.
- [x] Acceptance criteria specified.
- [x] Test scenarios specified.
