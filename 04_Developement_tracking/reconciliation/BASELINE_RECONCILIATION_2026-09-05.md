# Đối chiếu baseline Mini Rally — 2026-09-05

## Phạm vi đối chiếu ban đầu

Đồng bộ tài liệu baseline và luồng nghiệp vụ giữa bản local và bản Git `b26a94b827ce8e750f7f9fc00612b01ba2c87631` (2026-08-24), giữ các bổ sung local còn cần thiết. Không thay đổi DB/ERD, kiến trúc, code mockup, kết quả test, commit hoặc push.

## Quyết định có bằng chứng trực tiếp

| ID | Quyết định áp dụng | Bằng chứng xác nhận |
|---|---|---|
| BL-01 | Estimate, To Do, Actual của Task độc lập sau create. Chỉ copy Estimate sang To Do một lần khi tạo và To Do chưa được nhập. Completed/reopen không đổi ba trường giờ. | Ngày 2026-08-14, user: “nó chỉ có 1 hành vì copy Estimate -> todo khi tạo ... sau đó đều independent”; sau diễn giải “Completed không tự thay đổi ba trường”, user trả lời “ok”. Session `019fff48-ffac-7eb1-afb2-c0a25791d305`, dòng 28983, 28997, 29010, 29016. |
| BL-02 | Project Key chấp nhận 1–10 ký tự chữ/số, chuẩn hóa chữ hoa, tối đa 10; không còn yêu cầu tối thiểu 2. Quản lý Project ở Settings góc phải. | Ngày 2026-08-14, sau checkpoint A/11 ký tự/ab12, user: “case này cho pass, ko sao ... project sẽ được manage ở setting góc bên phải”. Cùng session, dòng 29173, 29179. |
| BL-03 | Work Item mới mặc định Owner là current user nếu thuộc tập người hợp lệ. Unassigned là lựa chọn rõ ràng, không phải mặc định thay thế C10 cho mọi Work Item. | C10 ngày 2026-08-06 và user “confirm”. Session `019f50c2-b6b3-7451-a1a0-d478555f6e17`, dòng 23413, 23419. |
| BL-04 | Lời xác nhận “unassigned + thành viên active của team” nói về tập lựa chọn, chưa đủ bằng chứng đổi default Work Item Owner. | Session 2026-08-14 nêu trên, dòng 29226, 29238. Không chuyển diễn giải của assistant thành quyết định mới của user. |

Các session ID/dòng trên là con trỏ bằng chứng hội thoại local, không phải yêu cầu chạy công cụ hoặc thay đổi quyền của sản phẩm.

## Cách gộp tài liệu

- Nhận các SRS/handoff/scenario cập nhật từ Git khi local còn là bản gốc cũ; gộp phần khác nhau theo nội dung, không ghi đè toàn bộ local.
- Giữ bổ sung local về WA Team membership, WA system row và Test Case/Results Phase 7. Những phần này không làm Phase 7 trở thành MVP hoặc production-ready.
- Giữ quyền Team Status theo SRS Phase 4 hiện hành: WA/Admin truy cập, Editor không truy cập màn Team Status. Quyền sửa Task trong Work Item Detail vẫn theo quyền US/DE/Task của Editor trong Team được gán; không nhầm hai màn hình.
- Nhận nội dung Git đã ghi nhận qua retest về Project khóa theo context ở Portfolio, Release progress chỉ ở Release Tracking và Artifacts Release/Milestone. Add New từ Artifacts vẫn là Future Backlog.
- Phân biệt số Task active ở Iteration Status (không Completed, không deleted) với tổng child Tasks ở Work Item Detail và các Totals giờ. Đồng bộ phần tóm tắt theo SRS Iteration Status.
- Master test được lấy nguyên bản từ Git tại `07_Testing Plan/PHASE_0_6_AUDIT_TRACKER.xlsx`. Workbook local cũ được giữ nguyên ở vị trí cũ làm bằng chứng lịch sử. Không gộp hoặc sửa trạng thái cell trong đợt này.
- Các kết quả và diễn giải cũ trong log/retest được giữ nguyên phía dưới thông báo lịch sử. Điểm vào handoff dẫn đến báo cáo xác nhận 2026-08-17; bản 2026-08-15 được giữ làm lịch sử. Handoff 2026-08-17 có hiệu chỉnh expected Owner theo BL-03; kết luận lỗi thiếu Team-member options không tự biến thành Pass.

## Điểm còn giới hạn

1. Nếu current user không hợp lệ làm Work Item Owner, baseline này chưa tự quyết định fallback. Unassigned vẫn là lựa chọn được phép; không tự chọn người ngoài scope. Tách nhánh này khi BA chốt hoặc khi tìm thấy bằng chứng xác nhận cụ thể.
2. C10 chỉ chốt default của Work Item Story/Defect; không tự áp dụng sang Task hoặc Test Case. Các đối tượng đó dùng SRS riêng.
3. Master test phản ánh snapshot Git và ngày chạy được ghi trong workbook. Các expected result về quyền/Owner cần đọc cùng nguồn chuẩn hiện hành; workbook không phải bằng chứng retest ngày 2026-09-05.
4. Product Plan, tài liệu DB/ERD/kiến trúc, Figma và code mockup không được chỉnh trong phạm vi này. Chưa tuyên bố chúng đồng bộ toàn bộ với nghiệp vụ sau rà soát.
5. Bản baseline sau gộp có chủ đích khác nguyên bản Git tại các quyết định đã xác nhận và các bổ sung local được giữ. Đồng bộ Git ở đây là nhận đủ lịch sử nền và giải quyết chênh lệch tài liệu, không xóa các sửa đổi chưa commit.

## Kiểm tra hoàn tất

- Đã kiểm tra nội dung Task hours, Work Item Owner, Project Key trong SRS, nguồn chuẩn và handoff/scenarios đang hoạt động. Quy tắc Task độc lập cũng được phản ánh vào Burndown: Task Completed có To Do khác 0 vẫn đóng góp giá trị đã lưu vào snapshot.
- Đã kiểm tra 131 file Markdown trong phạm vi tài liệu và 227 liên kết local: không có dấu merge conflict hoặc đường dẫn file đích bị thiếu.
- `git diff --check` không báo lỗi.
- Checksum 50 file DB/ERD/kiến trúc và mockup không đổi so với đầu đợt sửa. Phần DB đang hiển thị modified trong Git là thay đổi local có sẵn, được giữ nguyên.
- Cả 5 workbook có sẵn không đổi byte. Master mới khớp chính xác blob Git `b26a94b8`; không sửa cell/status.
- Nhánh local `main` đã nhận mốc lịch sử `b26a94b8`, không còn behind 4 commit. Các hiệu chỉnh baseline và bổ sung local vẫn ở working tree, chưa stage, commit hoặc push.
- Không chạy production retest hoặc nâng trạng thái nghiệm thu từ thao tác rà tài liệu.

## Rà lại và dọn file — 2026-09-05

Theo yêu cầu tiếp theo của user: “rà lại 1 lần nữa, file nào không cần thì có thể xóa”. Đã xóa 10 file khỏi các thư mục tài liệu; các dòng mô tả giữ toàn bộ handoff/plan ở phần đối chiếu ban đầu phía trên là trạng thái trước bước dọn này.

| Thư mục | File đã xóa | Lý do / nơi thay thế |
|---|---|---|
| `06_Dev testing align/` | `AUDIT_PLAN.md`, `RETEST_PLAN.md` | Kế hoạch đợt chạy đã kết thúc; kết quả gốc vẫn ở workbook, notes và evidence. Cách chạy hiện hành ở Testing index. |
| `06_Dev testing align/` | `DEVINT_PHASE_0_3_DEV_HANDOFF.md`, `DEVINT_PHASE_0_4_DEV_HANDOFF.md` | Handoff tổng hợp đã được thay thế bởi handoff retest Phase 0–6. Giữ tracker và bằng chứng cũ. |
| `07_Testing Plan/01_test_phase_1_to_4/` | `DEV_FIX_HANDOFF.md` | Bản tổng hợp cũ, không còn dùng giao DEV. |
| `07_Testing Plan/02_test_phase_5_6/` | `DEV_FIX_HANDOFF_PHASE_0_6.md`, `DEV_HANDOFF_FAIL_PARTIAL_PHASE_0_6_2026-08-14.md` | Báo cáo trước retest 17/08; dùng `03_Retest/` cho kết quả bàn giao mới hơn. Workbook và execution log cũ vẫn giữ. |
| `06_Dev testing align/` | `DEVINT_PHASE_0_4_AUDIT_TRACKER.xlsx.inspect.ndjson` | Dữ liệu xuất để công cụ đọc workbook, có thể tạo lại. |
| `06_Dev testing align/99_old/` | `DEVINT_PHASE_0_3_AUDIT_TRACKER.xlsx.inspect.ndjson` | Dữ liệu xuất để công cụ đọc workbook; không phải workbook kết quả gốc. |
| `07_Testing Plan/02_test_phase_5_6/` | `PHASE_0_6_AUDIT_TRACKER.xlsx.inspect.ndjson` | Dữ liệu xuất để công cụ đọc workbook, có thể tạo lại. |

- Giữ các workbook lịch sử, `BA_SRS_CORRECTIONS_RESPONSE.md`, `Codex_audit_06_tracker.md`, inventory triển khai, ghi nhận retest và code-feasibility: chúng chứa kết quả, quyết định hoặc bằng chứng riêng, chưa đủ căn cứ xóa.
- Giữ handoff retest ổn định làm điểm vào; chỉ bản xác nhận 17/08 là chi tiết hiện hành. Không thay ngày hoặc trạng thái của kết quả cũ.
- Sửa README và hướng dẫn tiếp tục trong `08_Convert to figma/`: bổ sung P8 đã confirmed theo hồ sơ, bỏ chỉ dẫn sai “không có Plan 8”, đánh dấu P0–P7 là lịch sử và dẫn quyền về SRS. Không sửa node/file Figma trực tiếp.
- Trước khi xóa, đã kiểm tra tham chiếu theo tên file trong Markdown/JSON và XML của các workbook: 7 tài liệu bị xóa chỉ tham chiếu lẫn nhau. Bản sao khôi phục và SHA-256 của cả 10 file nằm trong `.codex_tmp/baseline_20260905/cleanup_backup/` và `cleanup_manifest.json`; đây là bản sao local, chưa được bảo đảm bởi Git.
- Không dọn hàng loạt `outputs/` hoặc `.codex_tmp/`: có phiên bản workbook và dữ liệu công việc khác, chưa xác định là dư. Các bản sao phục hồi của lần sửa này được giữ đến khi baseline được chốt.
- Kiểm tra sau dọn: 170 file Markdown, 222 liên kết local, không có link hỏng hoặc dấu merge conflict; `git diff --check` đạt. 50 file được bảo vệ và 5 workbook gốc giữ nguyên checksum; master vẫn khớp byte với blob Git. Chưa stage, commit hoặc push.

## Phạm vi xuất bản được duyệt sau rà soát

User đã yêu cầu “ok, giúp tôi đẩy lên git”. Commit baseline chỉ gồm SRS, nguồn chuẩn nghiệp vụ, handoff triển khai và hướng dẫn đọc tài liệu. Những dòng “chưa commit/push” phía trên ghi trạng thái của các bước đối chiếu trước khi có yêu cầu xuất bản.

- DB/ERD, kiến trúc, code mockup và mọi workbook nằm ngoài commit.
- Theo yêu cầu giữ nguyên testcase, 4 file scenario cùng 2 file retest/báo cáo xác nhận ngày 17/08 có chỉnh sửa local không được stage. Các file này trên Git giữ nguyên nội dung trước lượt xuất bản; phần chỉnh sửa local được bảo toàn để user quyết định sau.
- Không đưa lại các workbook, execution log và báo cáo lịch sử chưa được Git theo dõi. Chúng tiếp tục được giữ ở local; bản clone mới dùng master và báo cáo đã có trên Git.
- README trong vùng testing và điểm vào handoff được cập nhật để phân biệt nguồn chuẩn nghiệp vụ với snapshot kiểm thử; không sửa actual/status trong báo cáo được xuất bản.
- `.codex_tmp/`, `outputs/` và backup chỉ ở local. Danh sách file đã xóa ở bước dọn không phát sinh Git deletion mới vì các file đó vốn không được theo dõi tại mốc `b26a94b8`.
