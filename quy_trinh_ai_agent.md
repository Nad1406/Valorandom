# QUY TRÌNH PHÁT TRIỂN DỰ ÁN VỚI AI CODING AGENT

## STEP 1: PROTOTYPE & DESIGN
- **Công cụ đề xuất:** Claude Design / V0 / v.v.
- **Quy trình:** Tạo bản mẫu (Prototype) -> Review (Đánh giá) -> Tinh chỉnh lặp lại.
- **Lưu ý:** Bước này được thực hiện song song và đối chiếu trực tiếp (together) với việc viết PRD ở Step 2.

## STEP 2: TÀI LIỆU CHUẨN (Lưu trực tiếp trong Source Code)
Bộ tài liệu gốc định hướng cho AI, bao gồm 4 thành phần:
1. **PRD (Product Requirements Document):** Xác định rõ Problem (Vấn đề), Context (Bối cảnh), Ft (Tính năng) và AC (Tiêu chí nghiệm thu).
2. **Solution Architecture:** Thiết kế giải pháp (How) và quyết định Tech stack (Tech!).
3. **Database Schema (ERD):** Sơ đồ quan hệ thực thể và cấu trúc DB.
4. **API Docs:** Đặc tả các cổng giao tiếp dữ liệu.

## STEP 3: IMPLEMENTATION (Triển khai bằng AI Coding Agent)
### 1. Phân bổ Ngữ cảnh (Context)
*   **Làm Frontend:** Cấp cho AI bộ tài liệu `Prototype (1) + PRD (2) + Solution Architecture (3) + API Docs (5)`.
*   **Làm Backend:** Cấp cho AI bộ tài liệu `PRD (2) + Solution Architecture (3) + Database Schema (4) + API Docs (5)`.

### 2. Thiết lập Cấu hình (ECC - Rule + Skill + Constraints)
*   **Khởi tạo Skill:** Không tự viết từ đầu. Lên GitHub tìm kiếm và nạp các repo "Skill" chuyên biệt (hàng nghìn repo có sẵn) tương ứng với task đang làm:
    *   *Skill UI/UX, Frontend* (React/Vue/Tailwind...).
    *   *Skill Backend, Architecture* (Nodejs/Java/Microservices...).
    *   *Skill Database, Testing*.
*   **Thiết lập Ràng buộc:** Đặt ra các Rule và Constraints chặt chẽ để AI không viết code đi lệch kiến trúc.

### 3. Luồng Thực thi của Agent (Dùng Claude Opus / Sonnet)
Quy trình Agent tự động chạy theo sơ đồ:
**Planning -> Review Plan -> Code -> Tests**

*   **Plan & Guide:** Chia nhỏ lộ trình thành các Phase (Phase 0: Init, Phase 1, Phase 2...). Mỗi Phase tách thành các task nhỏ (chia nhỏ mốc 100) kèm Guide rõ ràng để tránh quá tải ngữ cảnh.
*   **Đọc và Viết:** Agent sẽ "Read" bản kế hoạch và tiến hành "Code" tuần tự.
*   **Kiểm thử (Tests):** Code sinh ra phải đi qua các lớp kiểm thử bao gồm: `Unit Tests`, `Integration Test`, và `e2e Test`.