# SRS — Phase 1.3 Work Item Detail

## 0. Document Control

| Thuộc tính | Giá trị |
|---|---|
| Module ID | `P1-WI-DETAIL` |
| Trạng thái | Draft for Development |
| Ngày cập nhật | 2026-08-24 |
| Phạm vi | Full page detail cho Story/Defect, gồm child Tasks và Test Cases |
| Ưu tiên | P1 — bắt buộc |
| Phụ thuộc | Work Item List/Create, Content, Activity Log |
| Không bao gồm | Custom workflow designer, Test Set/regression scheduling, child stories |

> **Phase ownership update 2026-08-24:** Test Case and Test Results are moved to `Phase 7 (After MVP)/Test Case/SRS.md`. That SRS is canonical; the Test Case notes retained here are only Work Item integration context.

## 1. Mục tiêu

Work Item Detail là nơi user xem/sửa dữ liệu nghiệp vụ của Story/Defect. UI gồm banner, tab Details/Tasks/Test Cases/Revision History, vùng nội dung trái và field sidebar phải.

## 1.1 DevInt Audit Reconciliation - 2026-07-24

BA confirmed the current Detail state display contract:

- `Schedule State` is the six-box state control.
- `Flow State` is a dropdown.
- Both fields use the same six-value catalog and mirror in both directions.
- Team is optional: blank Team means Project backlog; selected Team means Team backlog.
- Tasks under the Work Item use only one Task State and do not expose Schedule/Flow State.

## 2. Tài liệu tham chiếu

| Tài liệu | Phần tham chiếu | Mục đích |
|---|---|---|
| [`PHASE1_MOCKUP_CHECKLIST.md`](../PHASE1_MOCKUP_CHECKLIST.md) | Work Item Detail | Kiểm coverage |
| [`mini_rally_database_design.md`](../../../01_DB%20design/mini_rally_database_design.md) | §8.1, §9, §10, §11, §12 | Schema |
| [`WorkItemDetailPage.tsx`](../../../03_Mockup%20Design/src/app/pages/WorkItemDetailPage.tsx) | Work Item detail | Mockup |
| [`shared.tsx`](../../../03_Mockup%20Design/src/app/components/shared.tsx) | Summary panel | Collapse behavior |

## 3. Functional Requirements

| ID | Requirement |
|---|---|
| WID-FR-001 | Click item ID từ Backlog mở full Work Item Detail. |
| WID-FR-002 | Header hiển thị Type, Item Key, Title. |
| WID-FR-003 | Có icon collapse để thu về summary panel. |
| WID-FR-004 | Tab Details hiển thị Description, Attachments, Notes, Release Notes. |
| WID-FR-005 | Tab Tasks hiển thị task list full width. |
| WID-FR-006 | Tab Revision History hiển thị basic activity log. |
| WID-FR-007 | Sidebar hiển thị Owner, optional Dev Owner, Project, Team, Schedule State, Flow State, Plan Estimate, Release, Milestones, Iteration. Nếu Work Item là Defect thì hiển thị thêm Priority và optional Parent User Story. |
| WID-FR-008 | Field update phải persist DB và ghi activity log. |
| WID-FR-009 | Project/team/status/release/iteration dropdown chỉ hiển thị option hợp lệ. |
| WID-FR-010 | User không có Admin/Editor assignment trong Project không thấy item và direct URL phải bị từ chối an toàn. |
| WID-FR-011 | Refresh/direct URL detail phải load đúng item. |
| WID-FR-012 | Schedule State và Flow State dùng cùng catalog `Idea/Defined/In-Progress/Completed/Accepted/Release`; đổi một field phải phản ánh field còn lại trong MVP. |
| WID-FR-012A | UI rendering: Schedule State uses the six-box control; Flow State uses a dropdown. |
| WID-FR-013 | Rule Schedule/Flow áp dụng cho Story/Defect; child Task tiếp tục chỉ dùng `Defined/In-Progress/Completed`. |
| WID-FR-014 | Work Item có zero/one Release và zero/many Milestones. Milestone selector luôn giữ visible các giá trị đã chọn; đổi Release không tự thêm/xóa Milestone. Nếu đã có Release, chỉ option thêm mới bị lọc theo Milestone liên kết Release đó. |
| WID-FR-015 | Gán Work Item vào Iteration chỉ thay đổi membership; không tự chuyển Iteration sang Committed và không khóa scope. Lifecycle Iteration tham chiếu Phase 2. |
| WID-FR-016 | Owner và Dev Owner là hai trách nhiệm độc lập. Cả hai dùng cùng candidate source theo Project/Team; đổi Dev Owner không được ghi đè Owner. `Unassigned`/`No Entry` luôn hợp lệ. |
| WID-FR-017 | Khi Team được chọn, candidate gồm active Admin của Project, active Editor thuộc Team và active WA là member của Team. Khi Team trống, không offer Editor/WA Team members. Team Lead không có bypass riêng. |
| WID-FR-018 | Parent User Story của Defect là optional, chỉ chọn active Story cùng Project và phải persist/reload nhất quán. |
| WID-FR-019 | Story và Defect có tab `Test Cases` nằm ngay sau `Tasks`; tab hiển thị số Test Case liên kết trực tiếp với Work Item. |
| WID-FR-020 | Test Cases tab là collection full-width, hiển thị Rank, ID, Name, Type, Method, Priority, Owner, Last Verdict và Last Run. Không hiển thị Steps trên list view. |
| WID-FR-021 | `Add New` mở modal Test Case trống, yêu cầu Name và cho chọn Type, Method, Priority, Owner. Khi tạo từ tab này, hệ thống tự điền Work Product bằng chính Story/Defect đang mở; không yêu cầu user chọn lại và không tự sao chép Title/Description. |
| WID-FR-022 | Một Test Case chỉ có một Work Product trực tiếp tại một thời điểm. Work Product hợp lệ là active Story hoặc Defect cùng Project. |
| WID-FR-023 | Phase 7 không có repeatable Test Steps. Test Case dùng một Validation Input và một Validation Expected Result theo SRS Phase 7. |
| WID-FR-024 | Test Set và lịch chạy regression không nằm trong tab Test Cases của Work Item; đó là scope Quality riêng. |
| WID-FR-025 | Mỗi Project mới tự sinh 5 Test Case Type: `Acceptance`, `Functional`, `Regression`, `Performance`, `Usability`. Không có cấu hình Test Case Type ở tầng Workspace. |
| WID-FR-026 | Workspace Admin quản lý danh mục riêng của từng Project: `Add New` mở modal Name, Save thêm Type vào list; click dấu `×` phải mở confirm dialog. Cancel giữ nguyên; xác nhận mới loại Type khỏi danh sách chọn mới của Project. |
| WID-FR-027 | Type name required, trim khoảng trắng, tối đa 60 ký tự và unique không phân biệt hoa/thường trong Project. Xóa Type đã được dùng không được sửa/xóa giá trị lịch sử trên Test Case cũ. |
| WID-FR-028 | Click Test Case ID từ collection mở Test Case Detail. Detail dùng layout hai cột đồng nhất Work Item Detail. Bên trái có Description, Objective, Pre-conditions, Validation Input, Validation Expected Result, Post-conditions, Notes và Attachments. |
| WID-FR-029 | Sidebar Test Case Detail bỏ Rank và hiển thị Owner, Project, Team, Assigned To, Type, Method, Priority, Last Verdict, Last Run, Work Product. Project/Team kế thừa Work Product; `All Teams` không được lưu thành Team. Last Verdict/Last Run/Work Product là read-only. |
| WID-FR-030 | Owner và Assigned To là hai trách nhiệm độc lập. Cả hai selector chỉ hiển thị active users đã là member của Project chứa Test Case; thay đổi một field không ghi đè field còn lại. |

## 4. Screen Mapping với Mockup

| UI area | Mockup component | Production behavior |
|---|---|---|
| Banner | `WorkItemDetailPage` header | Route `/work-items/:itemKey` hoặc `/p/:projectKey/work-items/:itemKey` |
| Collapse icon | `onMinimize` | Trở về Backlog + summary panel selected |
| Details tab | `RichTextEditor`, `AttachmentBlock` | Persist rich fields/attachments |
| Tasks tab | `TASKS` table | Query child tasks |
| Test Cases tab | `TestCasesView`, `AddTestCaseModal` | Query/create Test Cases qua Work Product relation |
| Test Case Detail | `TestCaseDetailView` | Click Test Case ID; load/patch Test Case và giữ Work Product hiện tại |
| Revision tab | `RevisionHistoryPanel` | Query `activity_logs` |
| Sidebar | `Field` controls | Patch field-level updates |

## 5. DB ↔ UI Field Mapping

| UI field | API DTO | DB source/target | Mục đích | Rule/null handling |
|---|---|---|---|---|
| Type badge | `type` | `work_items.type` | Story/Defect label | Read-only in Phase 1 |
| ID | `itemKey` | `work_items.item_key` | Stable human key | Read-only |
| Title | `title` | `work_items.title` | Item name | Required; editable if permission |
| Description | `description` | `work_items.description` | Business description | Nullable; rich text sanitized |
| Attachments | `attachments[]` | `attachments.work_item_id` | Files linked to item | Empty list if none |
| Notes | `notes` | `work_items.notes` | Internal notes | Nullable; requires Phase 1 migration |
| Release Notes | `releaseNotes` | `work_items.release_notes` | Technical writer content | Nullable; requires Phase 1 migration |
| Owner | `assignee` | `work_items.assignee_id → users` | Primary responsible person | Nullable → Unassigned/No Entry; validate shared Project/Team candidate rule |
| Dev Owner | `devOwner` / `devOwnerId` | Dedicated nullable user reference, e.g. `work_items.dev_owner_id → users` | Secondary delivery responsibility | Must not reuse or overwrite `assignee_id`; schema migration required; same candidate rule as Owner |
| Project | `project` | `work_items.project_id → projects` | Scope | Required; changing project is advanced, may be disabled |
| Team | `team` | `work_items.team_id → teams` | Team scope | Nullable; blank = Project backlog; if selected, validate `project_teams` |
| Schedule State | `scheduleState` | `work_items.schedule_state` | Trạng thái lập lịch/độ chín nghiệp vụ | Required; enum `Idea/Defined/In-Progress/Completed/Accepted/Release`; default Idea; mirror Flow State trong MVP |
| Flow State | `flowState` | `work_items.flow_state` | Trạng thái luồng thực thi | Required; cùng enum/default với Schedule State; mirror Schedule State trong MVP |
| Priority | `priority` | `work_items.priority` | Mức ưu tiên Defect | Chỉ show/edit khi `type='defect'`; enum `Low/Normal/High/Urgent/None` |
| Plan Estimate | `planEstimate` | `work_items.story_point` | Story point estimate | Nullable/decimal >=0 |
| Release | `release` | `work_items.release_id → releases` | Release target | Nullable → Unscheduled |
| Milestones | `milestoneIds[]` | Work Item–Milestone relation | Zero/many Milestone targets | Selected values persist; add-new options filter by current Release relation |
| Iteration | `iteration` | `work_items.sprint_id → sprints` | Sprint/iteration assignment | Nullable → Unscheduled |
| Parent User Story (Defect only) | `userStory` / `userStoryId` | Dedicated Defect-to-Story relation or nullable FK | Optional owning Story | Target must be active `story` in the same Project; do not overload a hierarchy field if that would replace another required parent relation |
| Test Cases | `testCases[]` | `test_cases.work_product_id → work_items.id` | Collection kiểm thử trực tiếp của Story/Defect | Một Test Case có đúng một Work Product; chỉ active Story/Defect cùng Project |
| Test Case content | `description/objective/preconditions/validationInput/validationExpectedResult/postconditions/notes` | Các cột tương ứng trên `test_cases` | Nội dung kiểm thử ở cột trái Test Case Detail | Nullable; rich text sanitized |
| Test Case Detail fields | `owner/project/team/assignedTo/type/method/priority/lastVerdict/lastRun` | Các cột/FK tương ứng trên `test_cases` | Metadata ở sidebar phải | Owner/Assigned To validate Project membership; Project/Team/Last Run read-only; Type cũ vẫn render nếu catalog đã deactivate |
| Test Case Attachments | `attachments[]` | `attachments.test_case_id → test_cases.id` | File đính kèm Test Case | Mỗi attachment có đúng một parent target; giữ tenant/project scope |
| Test Results | `results[]` | `test_case_results.test_case_id → test_cases.id` | Lịch sử output của các lần thực thi | SRS Phase 7 là canonical; không có bảng Test Run riêng |
| Created/Updated | `audit` | `created_at`, `updated_at`, `created_by`, `updated_by` | Audit/debug | Not necessarily visible in Phase 1 |

## 6. API Contracts

```text
GET   /api/v1/work-items/:itemKey
PATCH /api/v1/work-items/:id
GET   /api/v1/work-items/:id/test-cases
POST  /api/v1/work-items/:id/test-cases
GET   /api/v1/test-cases/:id
PATCH /api/v1/test-cases/:id
```

Patch request supports partial update:

```json
{
  "title": "Updated title",
  "description": "<p>...</p>",
  "notes": "<p>...</p>",
  "releaseNotes": "<p>...</p>",
  "assigneeId": "uuid",
  "devOwnerId": "uuid",
  "teamId": "uuid",
  "scheduleState": "In-Progress",
  "flowState": "In-Progress",
  "priority": "Urgent",
  "storyPoint": 8,
  "releaseId": "uuid",
  "milestoneIds": ["uuid"],
  "sprintId": "uuid",
  "userStoryId": "uuid"
}
```

## 7. Validation Rules

- `title` required, max 500.
- `storyPoint >= 0`.
- `teamId` must be active team linked to project.
- `assigneeId` and `devOwnerId` are independently nullable and must satisfy the same active Project/Team candidate rule. Changing Team must invalidate or clear any named value that is no longer eligible; it must never silently keep an invalid user.
- An active Team Lead is eligible only through normal Team membership; the lead label is not a bypass.
- `scheduleState` and `flowState` must be one of `Idea`, `Defined`, `In-Progress`, `Completed`, `Accepted`, `Release`.
- Story/Defect update của một trong hai field phải lưu cùng giá trị cho field còn lại trong MVP; không dùng legacy `Code Review`, `Testing` hoặc spelling `Released`.
- `priority` is accepted only for Defect and must be one of `Low`, `Normal`, `High`, `Urgent`, `None`.
- `releaseId` and `sprintId` must belong to same project.
- `milestoneIds[]` accepts zero or more valid Milestones. Changing `releaseId` never removes existing values; it limits only the option set for adding another Milestone.
- Assigning `sprintId` does not auto-commit the Iteration or lock scope.
- `userStoryId` is accepted only for Defect and must reference an active Story in the same Project.
- Test Case `name` required; `workProductId` phải là active Story/Defect cùng Project và một Test Case chỉ giữ một Work Product trực tiếp.
- Test Case không có repeatable Test Steps trong Phase 7; Validation Input/Expected Result là hai field trực tiếp trên Test Case.
- Test Case `typeId` phải trỏ đến active Type của chính Project chứa Work Product.
- Khi thêm Type, API phải từ chối tên trùng không phân biệt hoa/thường trong Project.
- Remove trên UI phải qua confirm dialog rồi mới deactivate/soft remove khỏi catalog chọn mới; Cancel không thay đổi catalog. Test Case cũ vẫn đọc được Type đã lưu.
- Rich text must be sanitized.
- Cannot patch soft-deleted item.

## 8. Permission Rules

| Action | Permission |
|---|---|
| View detail | `work_item.view` |
| Edit title/content/sidebar | `work_item.update` |
| Change Schedule State / Flow State | `work_item.status.update` |
| Change Defect Priority | `work_item.priority.update` |
| Change release/iteration | `work_item.schedule.update` |
| Upload attachment | `work_item.attachment.upload` |
| View activity | `work_item.activity.view` |
| View Test Cases | `test_case.view` trong Project của Work Item |
| Add/edit Test Case | `test_case.create` / `test_case.update` trong Project của Work Item |
| Add/remove Project Test Case Type | Workspace Admin tại `Workspaces & Projects`; Admin/Editor chỉ đọc catalog |

## 9. Acceptance Criteria

1. Direct open `/work-items/:itemKey` loads correct Story/Defect.
2. Details tab render Description/Attachments/Notes/Release Notes.
3. Sidebar updates persist after refresh.
4. Invalid team/release/iteration from another project is rejected.
5. User không có Project assignment không thấy item và direct URL bị từ chối an toàn.
6. Every update writes activity log with old/new value.
7. Collapse icon returns user to summary panel state without losing selected item.
8. Owner and Dev Owner selectors show the same eligible Project/Team candidates, allow No Entry and persist independently after refresh.
9. Changing Team refreshes both candidate lists and prevents saving an ineligible Owner or Dev Owner.
10. Defect Parent User Story lists only active Stories from the same Project and the saved relation reloads in detail.
11. Story/Defect detail shows `Test Cases` immediately after `Tasks`, with the current linked count and collection columns.
12. `Add New` creates one blank-template Test Case linked to the current Work Item; Cancel creates none.
13. A newly created Test Case shows `Not Run`, has no Last Run, and remains visible after reload when persistence is implemented.
14. API rejects linking a Test Case to a deleted Work Item, a Work Item in another Project, or more than one direct Work Product.
15. Every newly created Project starts with exactly five seeded default Types.
16. `Add New` opens a Name modal; Save adds the value only to the selected Project and Cancel creates none.
17. Duplicate Type names, including case-only differences, are rejected within the Project.
18. Clicking `×` removes the Type from new-Test-Case options but existing Test Cases retain the historical value.
19. Clicking `×` first opens a confirmation dialog; Cancel keeps the Type and Confirm deactivates it.
20. Clicking a Test Case ID opens its detail with Description on the left and list metadata on the right; Back returns to the same Test Cases collection.
21. A deactivated historical Type remains visible on Test Case Detail and is not offered for newly created Test Cases.
22. Test Case Detail shows all confirmed content sections and Attachments on the left; Rank is not shown in the sidebar.
23. Project and Team are auto-filled from the current creation context and cannot be changed directly on Test Case Detail.
24. Owner and Assigned To list only active Project members, persist independently and reject a user outside the Project.

## 10. Implementation Breakdown

```text
WID-T01 Detail GET API + DTO
WID-T02 PATCH API + field validation
WID-T03 FE detail page integration
WID-T04 Sidebar field patch/save UX
WID-T05 Rich content persistence hooks
WID-T06 Collapse/summary behavior
WID-T07 Permission/read-only states
WID-T08 Tests
WID-T09 Test Case collection GET/create API + Work Product validation
WID-T10 Test Case tab/Add New integration
WID-T11 Phase 7 Test Case detail and Results handoff
WID-T12 Project Test Case Type catalog + seed/add/deactivate API
```
