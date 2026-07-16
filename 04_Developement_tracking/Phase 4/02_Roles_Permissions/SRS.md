# SRS - Phase 4.2 Roles & Permissions

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P4-ROLES-PERMISSIONS` |
| Status | In BA Baseline |
| Updated date | 2026-07-16 |
| Scope | Workspace/project roles, permission codes, backend enforcement, UI gating and access-denied handling |
| Priority | P4.2 - required for Governance |
| Depends on | Phase 0 auth/session, Phase 1-3 feature permissions, Phase 4.1 notification access rules |
| Mockup source | `03_Mockup Design/src/app/pages/SettingsPage.tsx` - Workspace > Roles & Permissions |
| Not included | Enterprise SSO policy administration, billing roles, external directory sync |

## 1. Goal

Roles & Permissions defines who can see and mutate workspace, project, team and work records. This feature turns earlier deferred permission notes into a single governance baseline.

BA decision: the mockup should follow the current production role model, not the older business-persona labels. PM, BA, Developer and Tester can remain user-facing business personas where helpful, but access control is driven by production role codes. Because MVP has one workspace that represents the company, `workspace_member` is removed; `workspace_admin` is the only workspace-level role.

## 2. Production Role Baseline

| Code | Role | Production slug | Intent |
|---|---|---|---|
| WA | Workspace Admin | `workspace_admin` | Full workspace ownership and workspace-level administration |
| PA | Project Admin | `project_admin` | Manage assigned project configuration, members and project work |
| PM | Project Member | `project_member` | Create and update delivery work inside accessible projects |
| PV | Project Viewer | `project_viewer` | Read-only access inside accessible projects |
| G | Guest | `guest` | No internal workspace access by default |

Legend for mockup action states:

| State | Meaning |
|---|---|
| E | Enabled action |
| R | Read-only access |
| D | Visible but disabled action |
| H | Hidden or denied |

Matrix edit rule:

| Rule | Decision |
|---|---|
| Who can edit the matrix | `workspace_admin` only |
| Editable roles | `project_admin`, `project_member`, `project_viewer`, `guest` |
| Locked role | `workspace_admin` column is locked as the system-owner baseline |
| Edit entry | Workspace Admin clicks `Edit` to unlock editable role cells |
| Editable values | `E`, `R`, `D`, `H` per screen/action/role cell |
| Save behavior | Workspace Admin clicks `Save`; matrix returns to locked display mode after save |

## 3. Screen / Action Matrix Draft

The matrix now reflects the mockup surfaces completed from Phase 0 through Phase 4. The detailed row-by-row matrix is visible in the mockup under `Settings > Workspace > Roles & Permissions`.

Navigation distinction:

| Entry point | Scope |
|---|---|
| Top-right gear / Workspace Settings | Workspace-wide settings, role matrix, user management, audit and configuration surfaces |
| Workspace dropdown / Manage Projects | Project, team and user management under the selected workspace |

Phase 5 deferred surfaces:

| Surface | Decision |
|---|---|
| Portfolio | Phase 5; RBAC revisited after Portfolio scope is defined |
| Top-level Release Tracking | Phase 5; belongs under Portfolio direction |
| Reports | Phase 5; RBAC revisited after Reports scope is defined |

Out-of-scope or removed from the Phase 4 core matrix:

| Item | Reason |
|---|---|
| Workspace create UI | Phase 0 single-company MVP does not expose Workspace creation/switching |
| Workspace Member role | Removed because MVP has one workspace/company; workspace-level access is covered by `workspace_admin` |
| Iteration start/close workflow | Phase 2 baseline uses create/edit/assignment flows, not a dedicated start/close sprint workflow |
| Team Board | Future Backlog; visible legacy mockup surface but not Phase 0-4 RBAC core |

Coverage groups:

| Area | Included actions | Main permission codes |
|---|---|---|
| Auth | Create session; View restored session; Delete session | `auth:session` |
| App Shell | View navigation/context/search results; Edit selected project/team context | `workspace:view`, `project:view`, `work_item:view` |
| Home | View dashboard, My Work, Recent Activity and Project Health | `project:view`, `work_item:view` |
| Manage Projects > Projects | View project list; Create project; Edit project/settings/status; Delete project | `project:view`, `project:create`, `project:edit`, `project:archive`, `project:restore`, `project:delete` |
| Manage Projects > Teams | View team list; Create team; Edit team info/status/members; Delete team access by deactivation | `workspace:manage_teams` |
| Manage Projects > Users | View users; Create user invitation; Edit prod role/status/team membership; Delete user access | `workspace:manage_members` |
| Backlog | View rows/search/filter/sort/page/resize; Create US/DE; Edit fields/release/iteration/rank; Delete work item | `work_item:view`, `work_item:create`, `work_item:edit`, `work_item:delete` |
| Work Item Detail | View fields/history; Create attachment/note mention; Edit fields/notes/relations/watchers; Delete attachment/work item | `work_item:view`, `work_item:edit`, `work_item:delete` |
| Task Dashboard/Detail | View child tasks/detail; Create task; Edit task fields/work product; Delete task | `work_item:view`, `work_item:edit` |
| Timeboxes > Iterations | View list/detail; Create iteration; Edit iteration/work item assignment; Delete iteration | `iteration:view`, `iteration:manage`, `work_item:edit` |
| Track > Iteration Status | View selector/metrics/items; Create US/DE in iteration; Edit item fields; Delete item from iteration view | `iteration:view`, `work_item:view`, `work_item:create`, `work_item:edit`, `work_item:delete` |
| Track > Team Status | View grouped status and related item/task detail; Edit capacity/task fields | `team_status:view`, `team_status:edit`, `work_item:view` |
| Timeboxes > Releases | View dashboard/detail; Create release; Edit release/artifacts; Delete release | `release:view`, `release:manage` |
| Timeboxes > Milestones | View dashboard/detail/artifacts; Create milestone; Edit fields/relations; Delete milestone | `milestone:view`, `milestone:manage` |
| Quality > Defect | View dashboard; Create defect; Edit defect fields; Delete defect | `quality:view`, `quality:edit`, `work_item:create`, `work_item:delete` |
| Notifications | View alerts and related US/DE; Edit notification read state | `work_item:view` |
| Settings | View personal/project/workspace/audit screens; Edit profile/project/workspace/role matrix settings | `workspace:view`, `project:view`, `project:edit`, `workspace:*`, `workspace:manage_members` |

## 4. Initial Task Breakdown

| ID | Task | Output | Status |
|---|---|---|---|
| P4-RBAC-01 | Define role model and permission matrix | Workspace/project role baseline and permission codes | Done / BA confirmed |
| P4-RBAC-02 | Define effective permission session contract | Session payload and permission evaluation rules | Pending |
| P4-RBAC-03 | Define backend access enforcement | Workspace/project membership and record access guards | Pending |
| P4-RBAC-04 | Define action-level permission rules | Create/edit/delete/archive/restore/read-only guards | Pending |
| P4-RBAC-05 | Define frontend route/action/field gating | UI visibility, disabled states and 403 handling | Pending |
| P4-RBAC-06 | Define verification scenarios | Viewer/read-only, unauthorized API rejection and context isolation | Pending |

## 5. Open Questions Gate

Questions will be raised before changing any rule that cannot be derived from the production role model.

Closed BA decisions:

- `workspace_member` is removed because this MVP has one workspace/company and does not need a non-admin workspace-level role.
- `guest` remains in the model as hidden/no internal access by default; future external collaborator behavior will require a separate scope decision.
