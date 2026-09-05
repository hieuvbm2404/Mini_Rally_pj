# Mini Rally — tài liệu hiện hành

**Baseline rà soát:** 2026-09-05. Đối chiếu bản Git `b26a94b8` ngày 2026-08-24 với các bổ sung local và xác nhận nghiệp vụ của BA. Ngày rà soát không thay thế ngày phê duyệt hoặc ngày chạy test.

Mini Rally trong repository này là bộ tài liệu BA, mockup và bằng chứng kiểm thử. Trạng thái tài liệu/mockup không chứng minh production đã triển khai hoặc nghiệm thu xong.

## Đọc theo thứ tự

1. [Nguồn chuẩn nghiệp vụ](04_Developement_tracking/RECONCILED_SOURCE_OF_TRUTH.md) — scope, luồng xuyên phase và các quyết định đã xác nhận.
2. [Bàn giao DEV Phase 0–6](04_Developement_tracking/reconciliation/DEV_HANDOFF.md) — luồng triển khai và nguồn nghiệm thu.
3. SRS của module trong `04_Developement_tracking/Phase */` — yêu cầu chi tiết; Phase 4 Roles & Permissions là nguồn quyền truy cập hiện hành.
4. [Testing index](<07_Testing Plan/README.md>) — tracker master, handoff retest và cách đọc lịch sử.
5. [Ghi nhận đối chiếu baseline](04_Developement_tracking/reconciliation/BASELINE_RECONCILIATION_2026-09-05.md) — nguồn xác nhận, phần đã gộp và giới hạn còn lại.

## Phạm vi và trạng thái

| Phạm vi | Tài liệu hiện hành | Ý nghĩa trạng thái |
|---|---|---|
| Phase 0–4 | App shell/auth, Project/Team, Work Item/Task, Iteration, Release/Milestone, Quality, quyền và Settings | Có SRS và bằng chứng DevInt theo từng lần chạy; xem master để biết kết quả được ghi nhận, không suy ra toàn bộ production đã Pass |
| Phase 5 | [Portfolio Items và Capacity Planning](<04_Developement_tracking/Phase 5/PHASE5_DEV_HANDOFF.md>) | BA/mockup closed ngày 2026-07-28; production cần bằng chứng riêng |
| Phase 6 | [Reports contract](<04_Developement_tracking/Phase 6/PHASE6_REPORTS_BUSINESS_AND_DATA_CONTRACT.md>) và [Release Tracking](<04_Developement_tracking/Phase 6/01_Release_Tracking/SRS.md>) | BA/mockup approved; thuộc scope hiện hành, không còn là Future Backlog |
| Phase 7 After MVP | [Test Case và Test Results](<04_Developement_tracking/Phase 7 (After MVP)/Test Case/SRS.md>) | Mockup approved ngày 2026-08-24; riêng scope After MVP, chưa có kết luận production |
| Future Backlog | [Danh mục](04_Developement_tracking/Future_Backlog/) | Chỉ triển khai khi được đưa vào scope; không dùng để đánh Fail cho phase hiện hành |

## Quy ước sử dụng

- Xác nhận trực tiếp của BA là căn cứ xử lý mâu thuẫn. Không mặc định một file mới hơn hoặc ghi “source of truth” là đúng khi nội dung trái xác nhận đã lưu.
- Quyết định đã được khôi phục bằng chứng: Task có ba trường giờ độc lập; Completed không tự đổi To Do; Project Key 1–10 ký tự; Work Item Owner mặc định current user khi hợp lệ. Chi tiết và ngoại lệ ở nguồn chuẩn.
- `Mini_Rally_Product_Plan.xlsx` là kế hoạch có ngày baseline riêng, không phải bảng trạng thái production trực tiếp. Workbook kế hoạch chưa được cập nhật trong đợt này.
- Các tracker cũ và log test được giữ nguyên làm lịch sử; chỉ có một master theo Testing index. Không chuyển kết quả cũ thành Pass của baseline mới nếu chưa chạy lại.
- Tài liệu Figma có phạm vi/ngày conversion riêng. Khi quyền hoặc scope khác SRS hiện hành, dùng SRS và ghi nhận phần Figma cần cập nhật.
- Đợt này không thay đổi DB/ERD, kiến trúc, code mockup hay kết quả trong các workbook. Những lớp đó chưa được chứng nhận đồng bộ với baseline nghiệp vụ này.
