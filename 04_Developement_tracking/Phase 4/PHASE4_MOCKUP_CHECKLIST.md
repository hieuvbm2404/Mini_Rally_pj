# Phase 4 - Mockup Coverage Checklist

Synced date: 2026-07-16

## 1. Phase Scope

Phase 4 is split into 3 features so BA can approve one feature and one task at a time:

1. P4.1 Notifications.
2. P4.2 Roles & Permissions.
3. P4.3 Settings & Audit.

BA working rule:

- Finish the current task, wait for BA confirmation, then move to the next task.
- If a question appears, ask BA before deciding.
- Team Board is Future Backlog and is not part of Phase 4 core scope.

## 2. P4.1 Notifications Current Mockup Scope

Current observed behavior:

- Bell icon in top navigation opens the `Notifications` page.
- Page header shows title, unread count and `Mark all as read`.
- Filters shown: `All`, `Unread`, `Assigned`, `Mentions`.
- Popup notification appears for the newest unread assignment/mention notification.
- Notification cards show title, body, project context, actor avatar and relative time.
- Unread notifications have distinct visual treatment.
- Clicking a notification marks it read in local mock state.
- Clicking a notification or `Go to item` routes to the related US/DE Work Item detail.

## 3. Mockup Coverage Summary

| Area | Requirement | Mockup status | Mockup source | Notes |
|---|---|---:|---|---|
| Notification entry | Top nav bell opens Notification Center | Done | `App.tsx`, `layout.tsx` | Bell currently has icon-only behavior |
| Unread count | Header displays unread count | Done | `NotificationsPage.tsx` | Local mock data |
| Filters | Only approved category tabs are visible | Done | `NotificationsPage.tsx` | Approved tabs: All, Unread, Assigned, Mentions |
| Popup | New unread assignment/mention shows a popup | Done | `NotificationsPage.tsx` | Local mock display only |
| Read one | Click notification marks it read | Done | `NotificationsPage.tsx` | Local state only |
| Mark all read | Header action marks all read | Done | `NotificationsPage.tsx` | Local state only |
| Item route | Notification card and `Go to item` route to related US/DE | Done | `NotificationsPage.tsx`, `App.tsx` | Opens Work Item Detail in mockup |
| Preferences | Notification preferences | Not in scope | `01_Notifications/SRS.md` | Removed from Phase 4.1 baseline |
| Permission guard | User only sees allowed notifications | Business rule | `01_Notifications/SRS.md` | Requires P4.2 alignment |

## 4. P4.1 Acceptance Checklist

### Mockup Baseline

- [x] Bell opens Notifications page.
- [x] Notifications page shows unread count.
- [x] Notifications page shows category filters.
- [x] Notification card displays core event information.
- [x] Read/unread visual treatment is present.
- [x] Clicking a notification can mark it read.
- [x] Mark all as read exists.
- [x] Popup is shown for an unread assignment/mention notification.
- [x] Clicking notification opens related US/DE Work Item detail.
- [x] Clicking `Go to item` opens related US/DE Work Item detail.

### Development Must Verify

- [ ] API returns only current user's notifications.
- [ ] API unread count matches UI count.
- [ ] Read/unread state persists.
- [ ] Mark all as read persists.
- [ ] Filters return correct categories.
- [ ] US/DE assignment creates notification for assigned user only.
- [ ] US/DE Note mention creates notification popup/list entry for mentioned user only.
- [ ] Notification card displays enough US/DE context for the user.
- [ ] Assignment notification route opens assigned US/DE.
- [ ] Mention notification route opens US/DE containing the Note mention.
- [ ] Inaccessible targets show safe access-denied/not-found states.
- [ ] Notification creation respects project/team access.

## 5. P4.2 Roles & Permissions Current Mockup Scope

Current observed/planned behavior:

- Workspace > Roles & Permissions uses production role codes instead of older business-persona roles.
- Role list includes `workspace_admin`, `project_admin`, `project_member`, `project_viewer` and `guest`.
- `workspace_member` is removed because this MVP has one workspace/company; workspace-level access is admin-only.
- `guest` remains hidden/no internal access by default for possible future external collaborator scope.
- Matrix is organized by Phase 0-4 screen and CRUD-style action so BA/dev can see where View, Create, Edit and Delete operations should be enabled, read-only, disabled or hidden.
- Legend states: `E` Enabled, `R` Read-only, `D` Disabled, `H` Hidden/Denied.
- PM/BA/Developer/Tester remain business personas only and do not define permission grants.
- Top-right gear is labeled as Workspace Settings for workspace-wide configuration.
- Workspace dropdown action is labeled Manage Projects for project/team/user management under the workspace.
- Manage Projects > Users role dropdown uses production role slugs.
- Workspace Admin can click `Edit` to unlock permission states for other production roles, then click `Save` to lock the matrix again.
- Workspace Admin role column is locked as the system-owner baseline.
- Portfolio, top-level Release Tracking and Reports are marked Phase 5 deferred in the plan/docs and excluded from Phase 4 RBAC core.

### P4.2 Mockup Coverage Summary

| Area | Requirement | Mockup status | Mockup source | Notes |
|---|---|---:|---|---|
| Prod roles | Show prod role codes and slugs | Done | `SettingsPage.tsx` | Workspace Admin, Project Admin, Project Member, Project Viewer, Guest |
| Screen/action matrix | Break permissions by Phase 0-4 screen and CRUD-style user action | Done | `SettingsPage.tsx` | Matrix rows include Auth, App Shell, Home, Manage Projects, Backlog, Work Item Detail, Task, Timeboxes, Track, Quality, Notifications, Settings and Audit |
| Action states | Show enable/read-only/disabled/hidden decision | Done | `SettingsPage.tsx` | E/R/D/H legend visible |
| Role selection | Select a role and visually inspect its column | Done | `SettingsPage.tsx` | Selected column is highlighted |
| Phase 5 exclusion | Exclude Portfolio, top-level Release Tracking and Reports from Phase 4 core | Done | `02_Roles_Permissions/SRS.md` | RBAC returns after Phase 5 scope; no UI banner in matrix |
| Shell entry points | Distinguish Workspace Settings from Manage Projects | Done | `layout.tsx`, `ProjectsPage.tsx` | Top-right gear opens workspace-wide settings; workspace dropdown opens project/team/user management |
| Manage Projects Users prod role | User modal/list use production role slugs | Done | `ProjectsPage.tsx` | Replaces persona roles in workspace user management |
| Permission edit flow | Workspace Admin clicks Edit, changes non-WA role states, then clicks Save | Done | `SettingsPage.tsx` | Dropdown values: E/R/D/H only appear in edit mode; WA locked |
| Backend enforcement | API permission guard | Not in mockup | `02_Roles_Permissions/SRS.md` | Requires dev implementation |
| Access denied | 403/not-found UI states | Pending | TBD | To define in later RBAC task |

### P4.2 Acceptance Checklist - P4-RBAC-01

- [x] Mockup follows production role model.
- [x] Matrix is grouped by screen/action.
- [x] Action wording uses explicit `View`, `Create`, `Edit` or `Delete` verbs instead of generic workflow labels.
- [x] Each action has an intended permission code.
- [x] Each role/action has E/R/D/H state.
- [x] Documentation records the draft matrix.
- [x] Matrix excludes Phase 5 Portfolio, Release Tracking and Reports.
- [x] Top-right gear is workspace-wide settings.
- [x] Workspace dropdown Manage Projects opens project/team/user management under the workspace.
- [x] Manage Projects Users role dropdown uses prod role slugs.
- [x] Workspace Admin can click `Edit` to unlock E/R/D/H cells for non-WA roles.
- [x] Workspace Admin can click `Save` to lock the matrix after changes.
- [x] Workspace Admin column remains locked.
- [x] BA removed `workspace_member` from MVP role scope.
- [x] BA confirmed `guest` remains hidden/no internal access by default.

## 6. P4.3 Settings & Audit Placeholder

Detailed mockup checklist will be filled when BA starts Feature 3.

Initial expected areas:

- Workspace settings.
- Project settings.
- Workflow statuses/transitions.
- Labels.
- User management.
- Audit log.
- Destructive action confirmations.
