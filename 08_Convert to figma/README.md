# Mini Rally — Convert Mockup to Figma

Thư mục này là workspace điều phối chuyển `03_Mockup Design` thành Figma design system và product screens có thể handoff cho dev.

## Đọc theo thứ tự

1. `AI_EXECUTION_WORKFLOW.md` — luật tự vận hành của AI.
2. `CONVERSION_PROGRESS.md` — plan hiện tại, gate và quyết định mở.
3. Folder của plan hiện tại, đọc `PLAN.md` trước rồi mới đọc artifacts trong folder đó.

## Cấu trúc

| Folder / file | Vai trò |
|---|---|
| `P0_Discovery_and_Scope/` | Inventory, scope lock, Figma preflight và quyết định baseline |
| `P1_Design_Rules_and_Foundations/` | Rules, Variables, styles, foundations |
| `P2_Core_Component_Library/` | Component library và variants |
| `P3_UX_Patterns_and_BE_Contracts/` | Data/RBAC patterns và UI/API contracts |
| `P4_Screens_Phase_0_1/` | Screen conversion Phase 0–1 |
| `P5_Screens_Phase_2_3/` | Screen conversion Phase 2–3 |
| `P6_Screens_Phase_4/` | Governance screens Phase 4 |
| `P7_Future_QA_and_Handoff/` | Future/reference code, QA, Dev Mode, Code Connect, final handoff |
| `P8_Phase_5_Portfolio_and_Capacity/` | Delta Portfolio và Capacity Planning; hồ sơ ghi nhận confirmed ngày 2026-07-29 |
| `CONVERSION_PROGRESS.md` | Source of truth cho trạng thái workflow |

Không tạo/sửa Figma ngoài plan đang active. Không chuyển Plan N+1 nếu gate Plan N chưa có xác nhận rõ ràng của user.

P0–P7 là bộ conversion ban đầu; P8 là delta đã hoàn tất theo hồ sơ. Đọc `P8_Phase_5_Portfolio_and_Capacity/P8_QA_AND_HANDOFF.md` cho Portfolio/Capacity. Những cập nhật nghiệp vụ sau conversion dùng SRS hiện hành; rà soát tài liệu ngày 2026-09-05 không xác minh lại hoặc sửa file Figma.

