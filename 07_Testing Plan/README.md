# Mini Rally Testing Plan

This folder is the single entry point for BA testing from the completed Phase 0-4 audit through the Phase 5-6 deployed-product audit. The master workbook is `PHASE_0_6_AUDIT_TRACKER.xlsx` in this folder.

## Baseline và cách đọc kết quả — 2026-09-05

- [Master workbook](PHASE_0_6_AUDIT_TRACKER.xlsx) được nhận nguyên bản từ Git `b26a94b8`; ngày chạy, actual và trạng thái trong workbook là lịch sử được ghi, không phải kết quả test hôm nay.
- [DEV handoff hiện hành](03_Retest/DEV_HANDOFF_RETEST_PHASE_0_6.md) trỏ đến chi tiết xác nhận ngày 2026-08-17; báo cáo 2026-08-15 ở phần dưới chỉ là lịch sử.
- [Nguồn chuẩn nghiệp vụ](../04_Developement_tracking/RECONCILED_SOURCE_OF_TRUTH.md) ghi các hiệu chỉnh đã có xác nhận: ba trường Task độc lập, Project Key 1–10, Work Item Owner default current user khi hợp lệ và quyền theo SRS Phase 4.
- Workbook cũ trong `02_test_phase_5_6/` và các tracker Phase 0–4 vẫn được giữ nguyên ở local để đối chiếu; không đưa lại vào commit baseline. Không có lần gộp/sửa cell kết quả nào trong đợt này.
- `Current Access Baseline` trong master vẫn là snapshot ngày 2026-08-14. Các hàng nói WA không ở Team/Project member list phải đọc theo cập nhật WA operational membership/system row ngày 19–22/08. Chưa retest các nhánh mới trong đợt này.
- Các expected result cũ về Owner default hoặc quyền không ghi đè xác nhận BA. Khi chạy lại, ghi baseline, build, môi trường, dữ liệu và evidence; chỉ sửa trạng thái sau khi thực thi case được yêu cầu.
- `Phase 7 (After MVP)` có SRS/mockup riêng; master Phase 0–6 không chứng minh coverage hoặc Pass cho Phase 7.

## Structure

- `01_test_phase_1_to_4/`: test plans, scenarios, historical trackers, notes and evidence. Phase 0 is retained here as the authentication/app-shell precondition for Phase 1-4 regression. Superseded summary handoffs were removed on 2026-09-05.
- `02_test_phase_5_6/`: Phase 5-6 test plan, scenarios, historical observations and evidence.
- `03_Retest/`: current consolidated DEV handoff after the Phase 0-6 Fail/Partial retest. Only the handoff in this folder should be sent to DEV.

## Working rule

1. Compare SRS, approved mockup and deployed behavior.
2. The BA/user is the primary tester and records the result directly in `PHASE_0_6_AUDIT_TRACKER.xlsx`.
3. Codex only executes or re-tests a scenario when the user requests its exact Scenario ID.
4. Record evidence before changing a result.
5. Use `Pass`, `Partial`, `Fail`, `Blocked`, `Not Run`, `Future Backlog` or `Not Required` only.
6. A previous mockup pass or preliminary Codex observation is not a deployed-product pass; the user-owned run must be recorded separately.
7. BA confirms each functional checkpoint before the next mutation-heavy flow.
