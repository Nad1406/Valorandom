# 01 — PRD (Product Requirements Document)

**Sản phẩm:** VALORANDOM
**Phiên bản tài liệu:** 1.0
**Trạng thái:** Approved (Phase 0)

---

## 1. Problem (Vấn đề)

Khi chơi Valorant theo nhóm, đội 5 người thường mất 1–3 phút tranh luận "ai chơi con gì, role gì"
trước mỗi trận, đặc biệt khi chơi custom, scrim, hoặc chơi cùng người mới. Vấn đề cụ thể:

- **P1 — Chọn đặc vụ thủ công gây tranh cãi và chậm.** Không có ai "chốt", mọi người chọn theo sở
  thích dẫn tới đội thiếu role (4 duelist, 0 controller).
- **P2 — Trùng đặc vụ.** Random thủ công (bốc tay, random số) rất dễ ra 2 người cùng đặc vụ →
  luật chơi không cho phép.
- **P3 — Thiếu "công cụ chơi vui".** Các tool random hiện có thường chỉ random 1 thứ (map hoặc
  agent), UI khô, không có chế độ đội.
- **P4 — Thiếu tính tái lập/chia sẻ.** Khi đội đã random xong, người vào muộn không biết kết quả;
  không có link để gửi lại.

## 2. Context (Bối cảnh)

- **Người dùng:** nhóm 1–5 người chơi Valorant, phổ thông (không cần đăng nhập, không cần cài đặt),
  dùng cả desktop lẫn mobile trong lúc chờ vào trận.
- **Bối cảnh sử dụng:** trong lobby Discord/Zalo, thời gian vàng là ~10–20 giây. Mọi thao tác phải
  xong trong 3 click từ lúc mở trang.
- **Ràng buộc sản phẩm:** không tài khoản, không backend, không lưu dữ liệu người dùng lên server.
  Chạy như static SPA.
- **Ràng buộc dữ liệu game:** pool đặc vụ thay đổi theo mùa (agent mới, map rotation). Cần cơ chế
  cập nhật dữ liệu nhưng không làm app phụ thuộc mạng lúc chạy.
- **Out of scope v1:** đăng nhập, lưu lịch sử đội trên server, Riot API/Sign-in, xếp hạng người chơi,
  gợi ý counter-pick theo đối thủ, tạo ảnh kết quả để share (chỉ share link text).

## 3. Personas

- **P-A "Captain" (người tổ chức):** mở tool, nhập 5 slot, chốt role, bấm random, gửi link vào chat đội.
- **P-B "Thành viên":** mở link share, xem mình được agent gì, thấy role của cả đội.
- **P-C "Người chơi đơn":** chỉ muốn random 1 map hoặc 1 weapon cho vui/thử thách.

## 4. Features

### Nhóm A — Nền tảng

| ID | Feature | Mô tả | Ưu tiên |
|---|---|---|---|
| Ft-01 | App shell & điều hướng | 2 route: `/` (Single Random), `/squad` (Squad Random). Header có logo, language toggle (VI/EN). Theme tối mặc định kiểu esports. | Must |
| Ft-02 | Data layer tĩnh | Agents/Maps/Weapons đọc từ JSON local qua module typed accessor. Không fetch mạng lúc runtime. | Must |
| Ft-03 | i18n VI/EN | Dictionary cho toàn bộ label UI + tên/đặc tả agent/map/weapon theo ngôn ngữ. Toggle lưu localStorage, mặc định `vi`. | Must |
| Ft-04 | Error/empty states | Pool rỗng sau filter, slot chưa đủ tên, share link hỏng → thông báo rõ, không crash. | Must |

### Nhóm B — Single Random

| ID | Feature | Mô tả | Ưu tiên |
|---|---|---|---|
| Ft-10 | Random Agent | Random 1 đặc vụ. Filter theo role (Duelist/Initiator/Controller/Sentinel). | Must |
| Ft-11 | Random Map | Random 1 bản đồ. Filter: "chỉ map đang trong rotation" (cờ `active`). | Must |
| Ft-12 | Random Weapon | Random 1 vũ khí. Filter theo category và khoảng giá. | Must |
| Ft-13 | Re-roll & animation | Nút "Random lại", animation lật/rung thẻ, highlight kết quả mới. | Should |
| Ft-14 | Random Combo | 1 nút random đồng thời Agent + Map + Weapon ("Thử thách trận đấu"). | Could |

### Nhóm C — Squad Random (trọng tâm)

| ID | Feature | Mô tả | Ưu tiên |
|---|---|---|---|
| Ft-20 | Quản lý slot | Thêm/xóa slot, 1..5 slot. Mỗi slot có tên và role ∈ {Duelist, Initiator, Controller, Sentinel, Flex}. | Must |
| Ft-21 | Random đội không trùng đặc vụ | Random gán agent cho từng slot, agentId trong đội là duy nhất, agent đúng role của slot. | Must |
| Ft-22 | Flex lấp role thiếu | Slot Flex được ưu tiên gán vào role đội còn thiếu trước khi random tự do. | Must |
| Ft-23 | Lock kết quả | Nút Lock giữ nguyên agent khi random lại. Lock mất khi user mở hoặc đổi role của slot. | Must |
| Ft-24 | Share link | Mã hóa state đội vào URL; mở link khôi phục đúng đội và kết quả. | Must |
| Ft-25 | Cảnh báo bất khả thi | Cấu hình role không thể thỏa → báo lỗi rõ, không trả kết quả trùng. | Must |
| Ft-26 | Hiển thị tổng quan đội | Bảng kết quả hiện tên, role slot, agent được gán, role thực tế, cảnh báo thiếu role. | Should |

## 5. Acceptance Criteria

Format: **AC-<Ft>.<n>**. Mỗi AC phải map tới ít nhất 1 test tự động, trừ khi ghi `[manual]`.

### Ft-01 – Ft-04

- **AC-01.1** Truy cập `/` render trang Single Random với 3 tab: Agent, Map, Weapon. Không có network
  request nào tới `*.valorant-api.com` khi chạy (e2e chặn domain → app vẫn hoạt động đầy đủ).
- **AC-01.2** Toggle VI/EN đổi toàn bộ label UI và tên agent/map/weapon; reload trang giữ nguyên
  ngôn ngữ đã chọn.
- **AC-01.3** Route `/squad` mở trực tiếp được trên static hosting (hash router), reload không 404.
- **AC-02.1** Module `@/data` export typed `agents`, `maps`, `weapons`; test data-integrity pass:
  mọi `id` duy nhất, mọi `role` ∈ enum, mọi `category` ∈ enum, mọi phần tử có `displayName.vi`
  và `displayName.en` không rỗng, `isPlayable === true` cho agents.
- **AC-04.1** Filter tạo pool rỗng → empty state có text hướng dẫn, nút Random disabled;
  không throw, không render `undefined`.
- **AC-04.2** Share link hỏng (base64 lỗi, JSON lỗi, sai schema, role lạ, >5 slot) → app load state
  mặc định + banner "Link không hợp lệ"; không crash trắng trang.

### Ft-10 – Ft-13

- **AC-10.1** Với pool agent đã filter, bấm Random trả về đúng 1 agent nằm trong pool.
- **AC-10.2** Filter role = `duelist` → 100% kết quả có `agent.role === 'duelist'` (lặp 200 lần).
- **AC-10.3** Cùng seed RNG → chuỗi kết quả deterministic; pool > 1 phần tử thì 2 lần random liên
  tiếp với seed khác nhau tạo ra ít nhất 2 kết quả khác nhau trong 20 lần thử.
- **AC-11.1** Filter "active only" → chỉ trả map có `active === true`.
- **AC-11.2** Map hiển thị tên + ảnh splash (lazy load) + site badges (A/B/C nếu có).
- **AC-12.1** Filter category + `costMin/costMax` → kết quả thỏa mọi điều kiện filter; test với ít
  nhất 3 tổ hợp filter.
- **AC-13.1** [manual] Animation ≤ 600ms, không layout shift, không block nút Random lần tiếp theo.
- **AC-13.2** Re-roll với RNG seed cố định tạo chuỗi kết quả deterministic (test thuần logic).

### Ft-20 – Ft-26 (Squad)

- **AC-20.1** Slot nằm trong khoảng 1..5. Đã có 5 thì nút thêm disabled; chỉ còn 1 thì nút xóa
  disabled.
- **AC-20.2** Bỏ trống tên → hiển thị nhãn mặc định `Player <n>`; xóa slot giữa không reset tên
  của các slot còn lại, nhãn mặc định được tính lại theo vị trí.
- **AC-20.3** State slot: `{ id, name, role, lockedAgentId | null }`. Đổi role của slot đang lock →
  lock bị xóa và UI phản ánh ngay.
- **AC-21.1 (trọng tâm)** Sau khi random, **tập agentId của toàn đội có kích thước bằng số slot**
  (không trùng). Property test: 5.000 lần lặp trên mọi tổ hợp role hợp lệ (gồm toàn Flex và 5 slot
  cùng 1 role) → uniqueness 100%.
- **AC-21.2 (trọng tâm)** Với slot role cố định (≠ Flex), agent được gán có `agent.role === slot.role`
  trong 100% số lần, kể cả khi 5 slot cùng 1 role (nếu pool không đủ → AC-25.1).
- **AC-21.3** Agent đang bị lock ở slot khác không bao giờ được gán cho slot không lock.
- **AC-22.1 (trọng tâm)** Team có `k` slot Flex và `m` role còn thiếu (còn agent khả dụng): số slot
  Flex được gán vào role thuộc tập thiếu bằng `min(k, m)`. Test trên ≥ 20 tổ hợp (k, m).
- **AC-22.2** Slots `[Duelist, Flex, Flex, Flex, Flex]` → 3 slot Flex kế tiếp thuộc 3 role khác nhau
  trong {Initiator, Controller, Sentinel}; slot Flex thứ 4 random tự do.
- **AC-23.1** Lock slot 2 (agent X) → Random lại → slot 2 vẫn là X, slot khác không nhận X.
- **AC-23.2** Lock 5/5 slot → bấm Random trả về state cũ, UI báo "Tất cả slot đã lock".
- **AC-23.3** Hai slot không thể lock cùng một agent: khi slot 1 đã lock X thì X bị loại khỏi danh
  sách chọn agent của slot khác.
- **AC-24.1** Bấm Share → clipboard có URL chứa state; mở URL ở tab mới → khôi phục đúng số slot,
  tên, role, lock và kết quả agent.
- **AC-24.2** `decode(encode(state))` deep-equal `state` với 50 state sinh tự động, bao gồm tên có
  dấu tiếng Việt và emoji.
- **AC-24.3** URL < 2.000 ký tự với 5 slot đầy đủ tên + lock.
- **AC-25.1** Cấu hình bất khả thi (ví dụ 5 slot Duelist nhưng pool Duelist khả dụng < 5) → bấm
  Random hiện lỗi cụ thể "Cần N Duelist nhưng chỉ có M khả dụng", **không** trả kết quả trùng agent.

## 6. Non-functional requirements

- **NFR-1 Hiệu năng:** bundle JS chính < 200 KB gzip; LCP < 1.5s trên 4G giả lập; random 5 slot
  < 10ms.
- **NFR-2 Mượt:** animation 60fps, chỉ `transform`/`opacity`, tôn trọng `prefers-reduced-motion`.
- **NFR-3 Accessibility:** điều hướng bàn phím toàn luồng Squad; `aria-label` cho icon button;
  contrast AA; kết quả announce qua `aria-live="polite"`.
- **NFR-4 Responsive:** 360px → 1920px; bảng 5 slot stack dọc ở mobile.
- **NFR-5 Không backend:** không server, không cookie, không tracking; chỉ `localStorage` cho ngôn ngữ.
- **NFR-6 Data freshness:** JSON có `generatedAt` + `dataVersion`; footer hiển thị ngày dữ liệu.
