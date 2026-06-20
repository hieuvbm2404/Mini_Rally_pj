# Mini Rally — Project Development Plan

## Phase 0 — Nền tảng

Mockup coverage và danh sách màn hình còn thiếu được theo dõi tại [`Phase 0/PHASE0_MOCKUP_CHECKLIST.md`](Phase%200/PHASE0_MOCKUP_CHECKLIST.md).

Tiến độ production development, estimate/actual và timebox 1.5 ngày được theo dõi tại [`Phase 0/PHASE0_DEVELOPMENT_TRACKING.md`](Phase%200/PHASE0_DEVELOPMENT_TRACKING.md).

### 1. App Shell

- URL routing thật.
- Navigation và breadcrumb.
- Context hierarchy `Company/Workspace → Project → Team`.
- Main navigation `Home → Plan → Iteration Status → Quality → Portfolio → Releases → Reports`.
- `Backlog` là màn con mặc định của `Plan`.
- Permission-based menu.
- Global loading/error boundary.
- 404 và Access Denied.
- Notification badge đồng bộ.

### 2. Authentication

- Login/logout; mockup đầu tiên dùng tài khoản Workspace Admin.
- Session và refresh token.
- Forgot/reset password.
- Profile và đổi mật khẩu.
- Activate/suspend account.

### 3. Workspace

- Deployment hiện tại là single-company: `ACME Space Inc.` được cấu hình cố định như Workspace/tenant root.
- Không build Workspace List/Create/Edit/Archive UI trong MVP.
- Invite/remove/suspend member.
- Workspace role.
- Company settings tối thiểu; cấu hình tenant nâng cao thực hiện ngoài UI nếu cần.

### 4. Project

- Project List mockup đã có.
- Create/Edit/Archive/Restore Project.
- Project selector.
- Project key, ví dụ `NXP`.
- Project member và role.
- Project settings.
- Workflow mặc định.
- Team CRUD và Team membership.
- Gắn một Team vào nhiều Project thông qua `project_teams`.
- Team selector trong hierarchy dropdown.

## Phase 1 — Core Work Management

### 5. Work Item CRUD

Áp dụng cho Feature, Story, Task và Defect:

- Create/read/update/archive.
- Assign owner.
- Priority và status.
- Story point.
- Sprint và Release.
- Parent/child relationship.
- Labels.
- Search/filter/pagination.
- Bulk update.
- Activity log.

### 6. Work Item Detail

- Basic information.
- Description.
- Acceptance Criteria.
- Metadata.
- Related Work Items.
- Comments và mentions.
- Attachments.
- Watchers.
- Activity history.
- Field-level permission.

### 7. Child Task Management

```text
User Story
└── Tasks
```

- Add/Edit/Delete Task.
- Assign Task.
- Task status.
- Task list trong US Detail.
- Roll-up task progress lên US.

### 8. Task Time Tracking

- Original Estimate.
- Remaining Estimate.
- Log Time.
- Actual Time từ time logs.
- Estimate/Remaining/Actual roll-up lên US.
- Time-log history và permission.

## Phase 2 — Agile Execution

### 9. Backlog

Backlog là danh sách tập trung toàn bộ User Story (`US`) và Defect (`DE`) của Project/Team context:

- Rank và ưu tiên Work Item.
- Search/filter.
- Resizable columns.
- Pagination 10/25/50/100 records per page.
- Inline edit.
- Backlog reorder.
- Release assignment.
- Create Work Item với thứ tự type `Feature → Story → Defect → Task`.

Không hiển thị Unplanned, Sprint summary, Sprint filter, Sprint assignment hoặc cột Updated trong Backlog. Sprint management thuộc capability riêng; navigation dùng `Plan → Backlog`.

### 10. Sprint Management

- Create/Edit Sprint.
- Sprint goal và date range.
- Capacity.
- Planned points.
- Start Sprint.
- Close/Cancel Sprint.
- Khóa Sprint đã đóng.
- Chuyển item chưa hoàn thành.
- Sprint history.

### 11. Iteration Status

Thay cho `Track`:

- Sprint selector.
- Progress summary.
- Accepted/remaining points.
- Days remaining.
- Work Item list.
- Task Estimate/Remaining/Actual.
- Blocked items.
- List/Board toggle.
- Quick create.
- Bulk actions.

### 12. Board

- Status columns.
- Drag/drop đổi status.
- Workflow transition validation.
- WIP limit.
- Filter theo owner/type/priority.
- Blocked indicator.
- Open Work Item Detail.
- Viewer read-only.

## Phase 3 — Quality và Delivery

### 13. Quality / Defect

- Create Defect.
- Severity và Priority.
- Environment.
- Steps to Reproduce.
- Expected/Actual Result.
- Root Cause và Resolution.
- Link Defect với Story.
- Assign Dev.
- Verify/Reopen.
- Defect history.
- Quality summary.

### 14. Release Management

- Release CRUD.
- Assign Work Item.
- Included items.
- Open Defects.
- Blocked items.
- Release progress.
- Release readiness.
- Release activity/history.
- Released/Cancelled/Archived states.

## Phase 4 — Collaboration và Governance

### 15. Notifications

- Assigned, mentioned, comment và status events.
- Sprint/Release/Due Date notifications.
- Read/unread persistence.
- Deep-link tới Work Item.
- Notification preferences.
- Email notification sau MVP.

### 16. Roles & Permissions

- Workspace-level role.
- Project-level role.
- Permission codes.
- Backend enforcement.
- Field/action-level UI gating.
- Access Denied handling.

### 17. Settings & Audit

- Project settings.
- Workflow statuses/transitions.
- Labels.
- User management.
- Role permission matrix.
- Workspace settings.
- Audit log.
- Confirmation cho destructive actions.

## Phase 5 — Reporting

### 18. Dashboard & Reports

- Sprint Burndown.
- Velocity.
- Work Items by Status.
- Defect Summary.
- Workload.
- Blocked Items.
- Release Progress.
- Planned vs Completed.
- Estimate vs Actual.
- Export report.
- Date/project/sprint filters.

## Làm sau MVP

### 19. Portfolio

- Initiative.
- Feature/Epic hierarchy.
- Progress roll-up.
- Roadmap.
- Target Release.
- Cross-project tracking.

Portfolio có thể chưa xuất hiện trong MVP nếu chỉ phục vụ một team/project nhỏ.

## Thứ tự build khuyến nghị

```text
App Shell
→ Auth
→ Workspace
→ Project
→ Team + Project–Team mapping
→ Work Item CRUD
→ Work Item Detail
→ Child Task
→ Time Tracking
→ Backlog + Sprint
→ Iteration Status
→ Board
→ Quality
→ Release
→ Notification
→ RBAC/Settings
→ Reports
→ Portfolio
```

## Vertical slice đầu tiên

```text
Login bằng Workspace Admin
→ Chọn Company/Workspace → Project → Team
→ Tạo User Story
→ Mở Detail
→ Thêm Task
→ Estimate Task
→ Log Actual Time
→ Gán US vào Sprint
→ Xem tại Iteration Status
```
