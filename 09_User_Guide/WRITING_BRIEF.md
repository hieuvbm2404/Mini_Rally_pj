# Sườn và hướng dẫn viết Rova User Guide

Ngày lập: 2026-09-07. Đây là brief cho người/AI viết tài liệu, chưa phải hướng dẫn sử dụng đã nghiệm thu.

## 1. Mục tiêu và phạm vi bản đầu

Giúp người mới đăng nhập, chọn đúng Project/Team, tạo và xử lý công việc, theo dõi tiến độ; giúp Workspace Admin thiết lập người dùng và phạm vi làm việc.

- Đối tượng: người thực hiện công việc, người quản lý delivery và Workspace Admin. PM/BA/DEV/QA là công việc thực tế, không phải tên quyền trong hệ thống.
- Quyền cần giải thích đúng: Workspace Admin, Admin theo Project, Editor theo Team được gán.
- Môi trường mục tiêu: production `https://rova.qnsc.vn/`. Xác nhận lại giao diện trước khi chụp hình hoặc mô tả thao tác cụ thể.
- Viết tiếng Việt; giữ nguyên tên nút, trường và menu tiếng Anh đang hiển thị.
- Mỗi bài hướng dẫn giải quyết một việc. Không tổ chức theo Phase phát triển và không chép nguyên SRS.
- Chỉ xuất bản thao tác đã xác minh cho môi trường mục tiêu. Tính năng chưa xác minh giữ trong danh sách cần kiểm tra của tác giả.
- Test Case/Test Results thuộc Phase 7 After MVP trong baseline hiện có. Chưa đưa vào bản đầu nếu chưa xác nhận triển khai; không suy ra đã có trên production từ mockup.
- Không sửa SRS, testcase kiểm thử, DB, code hay dữ liệu nghiệp vụ trong quá trình viết. Không tự commit/push.

## 2. Cách bắt đầu

1. Chọn người đọc chính của bản đầu và một tình huống xuyên suốt, ví dụ Team cần bổ sung chức năng tìm kiếm.
2. Lập bảng các bài dự kiến theo mục lục dưới đây; mỗi bài ghi nguồn, quyền cần có và phần chưa xác minh.
3. Viết thử bài **Tạo User Story và chọn Owner**. Đây là bài mẫu để chốt giọng văn, mức chi tiết và cách chú thích ảnh.
4. Cho một người chưa quen hệ thống làm theo bài mẫu. Sửa chỗ họ phải hỏi thêm hoặc không biết kết quả đúng là gì.
5. Khi bài mẫu đạt, viết tiếp luồng công việc hằng ngày; phần quản trị và báo cáo viết sau.

Không cần hoàn tất tất cả chương trước khi cho người dùng thử đọc.

## 3. Mục lục đề xuất và cách viết từng phần

| Phần | Nội dung cần viết | Cách viết / đầu ra người đọc cần đạt |
|---|---|---|
| 00. Bắt đầu và tìm đúng bài | Tài liệu dành cho ai, môi trường/phiên bản/ngày xác minh, mục lục theo nhu cầu và quyền | Có lối đọc nhanh: mới dùng, làm công việc hằng ngày, quản lý tiến độ, quản trị. Nêu rõ phần nào nằm ngoài bản này. |
| 01. Làm quen với Rova | Workspace, Project, Team; Epic, Feature, US, DE, Task; Iteration, Release, Milestone; quyền truy cập | Mỗi khái niệm 1–2 câu kèm ví dụ. Giải thích các quan hệ bằng tình huống, tránh trình bày chúng thành một chuỗi phân cấp duy nhất. Phân biệt người tạo, Owner và quyền thao tác. |
| 02. Truy cập và chọn phạm vi | Đăng nhập, chọn Project/Team, Home, điều hướng, tìm kiếm, thông báo, tài khoản cá nhân | Người đọc mở đúng phạm vi trước khi làm việc. Có nhánh không thấy Project/Team hoặc gặp Access Denied và người cần liên hệ. Không yêu cầu đổi quyền để làm theo bài. |
| 03. Quản lý Backlog và tạo công việc | Tìm/lọc US/DE, tạo US, tạo DE, chọn Team/Owner, sửa thông tin, liên kết Feature hoặc Parent Story khi phù hợp | Tách bài theo mục tiêu: tạo US, ghi nhận DE, sửa công việc, tìm công việc. Giải thích trường bắt buộc, mặc định, danh sách lựa chọn và vị trí item sau khi lưu. |
| 04. Testing | Test Cases trên US/DE, Test Case Detail, Test Results, Last Verdict/Last Run và Test Case Type theo Project | Đi theo luồng Work Item → Test Case → Test Result. Giải thích nội dung Test Case, dữ liệu của từng lần chạy và cách giữ lịch sử; không đưa Test Plan/Test Run chưa có trên production. |
| 05. Lập kế hoạch Iteration | Tạo/chọn Iteration, lập Planned Velocity, đưa US/DE vào Iteration, đổi Iteration, trả về Unscheduled, cập nhật trạng thái Iteration | Dùng một nhóm công việc xuyên suốt. Mỗi bước chỉ ra công việc xuất hiện ở đâu sau thao tác; phân biệt Planned Velocity theo Points với Task Estimate theo giờ, và trạng thái Iteration với trạng thái US/DE. Chỉ ghi quyền tạo/sửa đã xác minh. |
| 06. Thực hiện công việc hằng ngày | Mở US/DE, tạo Task con, giao việc, cập nhật trạng thái, Estimate/To Do/Actual, time entry nếu có, nội dung/attachment/lịch sử | Tách cập nhật trạng thái khỏi cập nhật giờ. Giải thích cái gì hệ thống tự đổi và cái gì người dùng phải nhập. Không đồng nhất giờ Actual với time entry nếu chưa xác minh cơ chế. |
| 07. Xử lý lỗi và theo dõi Team | Theo dõi DE, liên kết Story, các trạng thái lỗi, Iteration Status và Team Status | Giải thích Defect State khác Schedule/Flow State. Với mỗi màn tiến độ, viết ai dùng, đang nhìn phạm vi nào và hành động tiếp theo. Đánh dấu giới hạn truy cập của từng quyền. |
| 08. Quản lý Release và Milestone | Tạo/sửa timebox, liên kết Release–Milestone, gán công việc, xem artifacts, theo dõi Release | Tách nơi quản lý thông tin Release với nơi theo dõi tiến độ Release. Giải thích ngày nhập tay/ngày suy ra từ liên kết và tác động khi đổi liên kết. Không dùng một thao tác giả định chung cho mọi loại artifact. |
| 09. Portfolio và Capacity Planning | Epic/Feature, liên kết công việc, tạo Capacity Plan, phân bổ Team, forecast, publish và theo dõi | Mở đầu bằng khi nào người dùng cần chức năng này. Dùng ví dụ số nhỏ; giải thích dự báo và giá trị phân bổ đã lưu. Với mỗi lựa chọn Publish, nêu chính xác trường nào thay đổi sau thao tác đã xác minh. |
| 10. Đọc báo cáo | Iteration Burndown, Velocity, Team Capacity, bộ lọc và trạng thái không có dữ liệu | Mỗi báo cáo trả lời một câu hỏi quản lý. Nêu dữ liệu đầu vào, đơn vị, khoảng thời gian, lịch sử hay hiện tại; ví dụ cách đọc và một cách hiểu sai cần tránh. Không cần SQL hoặc công thức kỹ thuật dài. |
| 11. Quản trị Workspace | Người dùng, Project, Team, Admin/Editor assignment, Team membership, cấu hình liên quan, archive/restore nếu có | Phần riêng cho Workspace Admin. Viết theo việc: thêm người, cấp quyền Project, thêm Team member, thay đổi quyền, ngừng sử dụng. Phân biệt rõ membership với authority; nêu hậu quả trước bước xác nhận. |
| 12. Agile Guideline | Cách viết User Story, Acceptance Criteria và Defect đủ rõ để refinement và kiểm thử | Đưa template, ví dụ và checklist chất lượng; phân biệt yêu cầu mới với lỗi và không biến AC thành Test Case chi tiết. |

Có thể phát hành phần 00–06 trước, bổ sung 07–12 theo nhu cầu và độ sẵn sàng của production.

## 4. Mẫu bắt buộc cho mỗi bài thao tác

```markdown
# [Động từ + việc cần hoàn thành]

## Khi nào dùng
[1–2 câu mô tả mục tiêu và tình huống.]

## Trước khi bắt đầu
- Quyền cần có: [...]
- Project/Team hoặc dữ liệu cần chuẩn bị: [...]

## Các bước
1. Mở [đường dẫn menu đã xác minh].
2. Chọn/nhập [...].
3. Kiểm tra [...] rồi chọn [nút lưu đã xác minh].

## Kết quả mong đợi
[Dữ liệu xuất hiện ở đâu, trạng thái/giá trị nào thay đổi, cách kiểm tra đã lưu.]

## Trường hợp khác
[Chỉ các nhánh liên quan, ví dụ không có người phù hợp trong Owner.]

## Xem tiếp
[Liên kết bài kế tiếp hoặc bài xử lý lỗi liên quan.]
```

Quy tắc viết:

- Một bước chứa một hành động chính; câu ngắn, chủ động, không viết “tiến hành thực hiện”.
- Đường dẫn menu phải được kiểm tra ở đúng môi trường; không đoán từ tên file code hoặc SRS.
- Chỉ giải thích field khi người dùng cần chọn hoặc có thể hiểu sai. Bảng field có thể dùng các cột: Tên trên UI, Cần nhập gì, Bắt buộc?, Lưu ý.
- Ảnh chỉ đặt ở bước khó tìm, màn nhiều lựa chọn hoặc kết quả cần đối chiếu. Đánh số chú thích khớp bước; che thông tin nhạy cảm và dùng dữ liệu minh họa phù hợp.
- Không có ảnh thật thì đặt `[CẦN ẢNH: màn hình, phạm vi, trạng thái cần chụp]`; không tạo ảnh giả rồi gọi là production.
- Với xóa/archive/publish/đổi quyền: giải thích tác động trước bước xác nhận và cách khôi phục nếu sản phẩm thực sự hỗ trợ.
- Giữ ghi chú nguồn và trạng thái kiểm chứng trong bảng của tác giả; bản đọc cho người dùng không chứa ID testcase, API, schema, session hay ghi chú nội bộ của AI.

## 5. Bài mẫu nên viết trước: Tạo User Story và chọn Owner

Mục tiêu: người dùng tạo được US trong đúng Project/Team và hiểu ai có thể được chọn làm Owner.

Các ý bắt buộc:

1. Điều kiện quyền và phạm vi đã chọn.
2. Mở form tạo, chọn Story, nhập Title và kiểm tra Project/Team.
3. Giải thích Owner khác người tạo. Không viết “Workspace Admin luôn có trong Owner” hoặc “Workspace Admin luôn bị loại”.
4. Khi Workspace Admin là member của Team, tên có thể xuất hiện; khi không là member thì không được chọn chính mình trong Team đó. Không suy rộng quan sát này thành quy tắc của mọi vai trò.
5. Hướng dẫn chọn Owner hợp lệ hoặc No Entry theo form đã xác minh; giải thích default dựa trên điều kiện cụ thể.
6. Mô tả lưu và kiểm tra item sau lưu chỉ khi có bằng chứng thực hiện thành công; không coi nút Create đang bật là bằng chứng backend đã lưu.

Bằng chứng UI trong cuộc trao đổi ngày 2026-09-05: tài khoản WA Hieu có membership ở Maintainer nên form US hiện tên và chọn mặc định. Ở OnlyS, danh sách Owner của cả US/DE chỉ có member Team và No Entry; sau khi nhập Title, Create được bật. Form đã hủy, chưa bấm lưu. Đây là quan sát có ngày, cần kiểm tra lại nếu UI/build thay đổi; không phải kết quả test end-to-end.

## 6. Nguồn và cách xử lý chỗ không khớp

- [README dự án](../README.md): phạm vi và đường dẫn tài liệu.
- [Nguồn chuẩn nghiệp vụ](../04_Developement_tracking/RECONCILED_SOURCE_OF_TRUTH.md): luồng và quy tắc đã chốt.
- [DEV handoff](../04_Developement_tracking/reconciliation/DEV_HANDOFF.md): quan hệ giữa các module.
- [SRS quyền](<../04_Developement_tracking/Phase 4/02_Roles_Permissions/SRS.md>): điều kiện truy cập và Team membership.
- [SRS tạo Work Item](<../04_Developement_tracking/Phase 1/02_Work_Item_Create/SRS.md>): tham khảo cho bài mẫu.
- SRS của module tương ứng và giao diện production được phép quan sát: đối chiếu thao tác cụ thể.

SRS mô tả nghiệp vụ dự kiến; production cho biết hành vi đang có. Nếu khác nhau, ghi hai phía và xin BA quyết định cách diễn đạt. Không tự sửa SRS, không gọi một lỗi production là nghiệp vụ chuẩn, không mô tả tính năng chỉ có trong mockup như tính năng đã triển khai.

Bảng làm việc của tác giả:

| Bài | Nguồn | Môi trường/ngày xác minh | Đã kiểm tra đến đâu | Chỗ chưa rõ | Trạng thái |
|---|---|---|---|---|---|
| Tạo User Story | SRS Work Item Create | Điền khi kiểm tra | UI / lưu / mở lại | Ghi cụ thể | Draft / Needs verification / Ready for review / Approved |

Chỉ đổi thành Approved sau khi BA review và người dùng có thể làm theo. Không cập nhật workbook testcase để phản ánh tiến độ viết guideline.

## 7. Prompt giao cho AI khác

```text
Bạn là người viết hướng dẫn sử dụng Rova cho người dùng cuối.

Đọc 09_User_Guide/WRITING_BRIEF.md và các nguồn được dẫn trong đó.
Mục tiêu là viết tiếng Việt dễ hiểu, theo công việc người dùng cần làm.
Giữ nguyên tên nút/menu tiếng Anh; không chép SRS và không đưa DB/API vào user guide.

Đầu tiên:
1. Đề xuất danh sách bài bản đầu theo mục lục, ghi rõ bài nào chưa đủ bằng chứng production.
2. Liệt kê ngắn thông tin còn thiếu: đối tượng chính, môi trường/build, ảnh và dữ liệu demo.
3. Viết DUY NHẤT bài mẫu “Tạo User Story và chọn Owner” theo template trong brief.
4. Đính kèm bảng nguồn, điều kiện quyền và các điểm cần xác minh cho BA.
5. Dừng ở bài mẫu để nhận phản hồi trước khi viết các bài còn lại.

Không tự đoán nút, đường dẫn, quyền, default, thông báo lỗi hoặc kết quả lưu.
Nếu chưa được truy cập production, đánh dấu CẦN XÁC MINH; không tự điền bằng mockup.
Việc viết guideline không tự cho phép tạo/xóa dữ liệu production hay thay đổi quyền.
Phân biệt quan sát giao diện với bằng chứng lưu và mở lại thành công.
Nếu SRS và production khác nhau, báo BA; không tự chọn một bên làm quy tắc mới.
Không đưa Phase 7/Future Backlog vào hướng dẫn production khi chưa xác nhận triển khai.
Chỉ tạo/cập nhật các bản nháp trong 09_User_Guide. Không sửa DB, SRS, code,
testcase/workbook kiểm thử hoặc lịch sử kết quả. Không tự commit/push.
```

## 8. Checklist review một bài trước khi phát hành

- Người đọc biết bài giúp làm gì và mình có quyền làm hay không.
- Menu, nút và ảnh khớp môi trường/phiên bản được ghi.
- Dữ liệu cần chuẩn bị được nêu đủ; làm theo các bước không cần đoán.
- Có kết quả sau lưu và cách kiểm tra; không nhầm trạng thái UI với dữ liệu đã lưu.
- Có nhánh thường gặp liên quan trực tiếp, không biến thành danh sách lỗi giả định dài.
- Các số liệu, default và tác động tự động đều có nguồn xác minh.
- Không chứa dữ liệu nhạy cảm, tính năng chưa triển khai hoặc hướng dẫn trái quyền.
- Đã có người dùng thử làm theo và BA duyệt.
