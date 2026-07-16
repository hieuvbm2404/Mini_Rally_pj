# Phase 4 - Development Tracking

## 1. Tracking Information

| Attribute | Value |
|---|---|
| Phase | Phase 4 - Collaboration & Governance |
| Current delivery slice | Feature-by-feature BA handoff |
| Company scope | Single-company: `ACME Space Inc.` |
| Overall status | `P4.1 READY; P4.2 P4-RBAC-01 DONE; P4.3 PENDING` |
| Production implementation | Not started |
| Last updated | 2026-07-16 |

BA working rule:

- Phase 4 is split into 3 features and will be handled one feature at a time.
- Within a feature, complete one task, then wait for BA confirmation before starting the next task.
- If any business question appears, ask BA before deciding.
- Team Board remains Future Backlog and is not part of Phase 4 core scope.

## 2. Phase 4 Features

| Feature | Name | Purpose | BA status | Dev status |
|---|---|---|---|---|
| P4.1 | Notifications | In-app popup and Notification Center for US/DE assignment and Note mentions | Ready | Not started |
| P4.2 | Roles & Permissions | Workspace/project roles, permission codes, backend enforcement and UI action gating | P4-RBAC-01 Done | Not started |
| P4.3 | Settings & Audit | Workspace/project settings, workflow/label configuration, audit log and destructive confirmations | Pending | Not started |

## 3. Status Legend

| Status | Meaning |
|---|---|
| `PENDING` | Not yet started by BA |
| `IN BA BASELINE` | BA is drafting scope from current roadmap/mockup |
| `READY FOR BA REVIEW` | Draft is complete and waiting for BA confirmation before next task |
| `READY` | BA/mockup/SRS are ready for development |
| `NOT STARTED` | Production code not started |
| `IN PROGRESS` | Development in progress |
| `BLOCKED` | Cannot continue without dependency/decision |
| `DONE` | Code, tests and acceptance criteria passed |
| `DEFERRED` | Moved out of current phase/slice |

## 4. Development Task Plan - P4.1 Notifications

| ID | Module | Task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P4-NOTIF-01 | BA/SRS | Define notification scope and event taxonomy | `01_Notifications/SRS.md` baseline from roadmap and mockup | Phase 1-3 records | 1.0h | 1.0h | `DONE` |
| P4-NOTIF-02 | Contract | Define Notification DTO and API contracts | List, mark read, mark all read, popup and route target contracts | P4-NOTIF-01 | 1.0h | 0h | `PENDING` |
| P4-NOTIF-03 | Backend | Implement notification storage and query | Persist notifications, read/unread state, filters and pagination | P4-NOTIF-02 | 2.0h | 0h | `PENDING` |
| P4-NOTIF-04 | Backend | Emit US/DE assignment events | Create notification when US/DE assignee becomes the current user | P4-NOTIF-03 | 1.5h | 0h | `PENDING` |
| P4-NOTIF-05 | Backend | Emit US/DE Note mention events | Create notification when user is mentioned in a Note on a US/DE | P4-NOTIF-03 | 1.5h | 0h | `PENDING` |
| P4-NOTIF-06 | Frontend | Notification bell and unread badge | Badge count sourced from API/session state | P4-NOTIF-02, P4-NOTIF-03 | 1.0h | 0h | `PENDING` |
| P4-NOTIF-07 | Frontend | Notification center list and filters | All, Unread, Assigned and Mentions filters | P4-NOTIF-03 | 1.5h | 0h | `PENDING` |
| P4-NOTIF-08 | Frontend | Read/unread interactions | Item click marks read; Mark all as read persists | P4-NOTIF-03, P4-NOTIF-07 | 1.0h | 0h | `PENDING` |
| P4-NOTIF-09 | Frontend | Notification route to item | Card and Go to item open the related US/DE Work Item | P4-NOTIF-02, P4-NOTIF-07 | 1.0h | 0h | `PENDING` |
| P4-NOTIF-10 | Frontend | In-app popup | New assignment/mention notification appears as popup for the recipient | P4-NOTIF-02, P4-NOTIF-03 | 1.0h | 0h | `PENDING` |
| P4-NOTIF-11 | Security | Permission-aware notification access | Users only receive/read notifications for accessible workspace/project/team records | P4.2 baseline | 1.0h | 0h | `PENDING` |
| P4-NOTIF-12 | Verification | Notification tests | API, permission, persistence and UI smoke tests | P4-NOTIF-01..11 | 2.0h | 0h | `PENDING` |

## 5. Development Task Plan - P4.2 Roles & Permissions

| ID | Module | Task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P4-RBAC-01 | BA/SRS | Define role model and permission matrix | `02_Roles_Permissions/SRS.md` workspace/project roles and permission-code baseline, refined against Phase 0-4 mockup screens and shell entry points; `workspace_member` removed for single-workspace/company MVP | Phase 0-4 access rules | TBD | 1.5h | `DONE` |
| P4-RBAC-02 | Contract | Define effective permission session contract | Session payload and permission evaluation rules | P4-RBAC-01 | TBD | 0h | `PENDING` |
| P4-RBAC-03 | Backend | Enforce workspace/project membership | Access-denied behavior and data isolation | P4-RBAC-02 | TBD | 0h | `PENDING` |
| P4-RBAC-04 | Backend | Enforce action-level permissions | Create/edit/delete/archive/restore/read-only guards | P4-RBAC-02 | TBD | 0h | `PENDING` |
| P4-RBAC-05 | Frontend | Gate routes, menus and actions | Disabled/hidden UI states plus 403 page handling | P4-RBAC-02 | TBD | 0h | `PENDING` |
| P4-RBAC-06 | Verification | RBAC regression tests | Viewer/read-only, unauthorized API rejection and context isolation | P4-RBAC-01..05 | TBD | 0h | `PENDING` |

## 6. Development Task Plan - P4.3 Settings & Audit

| ID | Module | Task | Deliverable | Dependency | Estimate | Actual | Status |
|---|---|---|---|---|---:|---:|---|
| P4-SET-01 | BA/SRS | Define settings and audit scope | `03_Settings_Audit/SRS.md` workspace/project settings, workflow statuses, labels and audit log baseline | P4-RBAC-01 | TBD | 0h | `PENDING` |
| P4-SET-02 | Contract | Define settings APIs | Project/workspace settings, labels and workflow status contracts | P4-SET-01 | TBD | 0h | `PENDING` |
| P4-SET-03 | Backend | Implement settings persistence | Save and validate workspace/project settings | P4-SET-02 | TBD | 0h | `PENDING` |
| P4-SET-04 | Backend | Implement audit log query | Mutation audit events and filtered audit list | P4-RBAC-04, P4-SET-02 | TBD | 0h | `PENDING` |
| P4-SET-05 | Frontend | Settings screens | Company/project settings, labels, workflow and role matrix surfaces | P4-SET-02 | TBD | 0h | `PENDING` |
| P4-SET-06 | Frontend | Destructive confirmations | Confirm archive/delete/remove/suspend actions with clear copy | P4-RBAC-04, P4-SET-05 | TBD | 0h | `PENDING` |
| P4-SET-07 | Verification | Settings/audit tests | Persistence, permission, audit event and confirmation tests | P4-SET-01..06 | TBD | 0h | `PENDING` |

## 7. Current Task Gate

Current active task:

| Task | Status | BA confirmation needed before next task |
|---|---|---|
| P4-NOTIF-01 | Done / BA confirmed | No |
| P4-RBAC-01 | Done / BA confirmed | No |
