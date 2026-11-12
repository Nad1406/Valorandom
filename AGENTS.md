# AGENTS.md — Ràng buộc cho AI coding agent (VALORANDOM)

Đọc file này TRƯỚC khi viết bất kỳ dòng code nào. Đây là hợp đồng kỹ thuật của repo.

## 1. Bối cảnh

VALORANDOM là static SPA (Vite + React + TypeScript + Tailwind) giúp người chơi Valorant random
Đặc vụ / Bản đồ / Vũ khí và random tổ đội 5 người không trùng đặc vụ. Không có backend.

Tài liệu nguồn (đọc khi cần, không đọc hết mỗi lần):

- `docs/01-prd.md` — Problem, Context, Features, Acceptance Criteria (nguồn sự thật cho test)
- `docs/02-solution-architecture.md` — kiến trúc, tech stack, thuật toán Squad, cấu trúc thư mục
- `docs/03-data-schema-and-api.md` — types, JSON schema, share link format, i18n
- `docs/04-implementation-plan.md` — Phase và task ID

## 2. Ràng buộc bắt buộc (vi phạm = code sai)

1. **Không fetch mạng lúc runtime.** Không `fetch`/`axios`/`XMLHttpRequest` tới
   `valorant-api.com` trong `src/`. Dữ liệu đến từ `src/data/*.json` đã commit.
   Ngoại lệ duy nhất: `scripts/sync-valorant-data.ts`.
2. **Không dùng `Math.random()` trong `src/features/random/**` và `src/features/squad/**`.**
   Mọi ngẫu nhiên đi qua `Rng` được inject (`type Rng = () => number`).
3. **Logic random và logic đội là pure function.** Không import React, không side effect,
   không đọc `Date`, `window`, `localStorage` trong `src/features/random/**`.
   Cùng input + cùng seed ⇒ cùng output.
4. **Mọi AC trong PRD phải có ít nhất 1 test tương ứng.** Test đặt cạnh source trong
   `__tests__/`, đặt tên bắt đầu bằng mã AC (ví dụ `it('AC-21.1 ...')`).
5. **Không thêm thư viện** ngoài danh sách ở `docs/02-solution-architecture.md` §2.2 khi chưa hỏi.
6. **Component không quyết định nghiệp vụ.** Component chỉ render; tính toán nằm ở
   `src/features/**` hoặc `src/lib/**`.
7. **Import tuyệt đối qua `@/`.** Cấm `../../../`.
8. **i18n bắt buộc.** Không hardcode chuỗi UI trong JSX; thêm key vào CẢ `vi.ts` và `en.ts`.
   Tên Agent/Map/Weapon lấy qua `localize()` từ JSON.
9. **Giới hạn kích thước:** file < 250 dòng, function < 50 dòng. Vượt thì tách.
10. **Không commit** `node_modules`, `dist`, `.env`, build output.
11. **Không bịa dữ liệu game.** Nếu thiếu field trong JSON thì thêm vào sync script và
    chạy lại, không hardcode agent/map/weapon trong component.
12. **Type strict.** `tsc --noEmit` phải sạch. Cấm `any` (dùng `unknown` + narrow).
    Cấm `@ts-ignore`; nếu bắt buộc thì `@ts-expect-error` + comment lý do.

## 3. Quy ước code

- File component: `PascalCase.tsx`. Module logic: `camelCase.ts`. Types: `camelCase.ts` trong `src/types/`.
- Mỗi feature export qua file `index.ts` khi có > 2 file public.
- Tailwind cho style; không viết CSS module mới trừ `src/styles/index.css`.
- Không dùng inline style trừ khi giá trị động (ví dụ `--role-color` từ role).
- Animation: chỉ `transform`/`opacity`, tôn trọng `prefers-reduced-motion` qua `useReducedMotion`.
- Accessibility: control tương tác phải dùng `<button>`/`<input>`/`<select>` thật, có label,
  focus-visible rõ ràng.

## 4. Lệnh

```bash
npm run dev          # dev server
npm run build        # typecheck + build (phải pass trước khi báo xong)
npm run typecheck
npm run lint
npm run test         # vitest unit + component
npm run test:e2e     # playwright (build + preview)
npm run data:sync    # đồng bộ JSON từ valorant-api.com (dev-only)
npm run data:validate
```

## 5. Định nghĩa "Xong" cho mỗi task

- Code + test tương ứng.
- `npm run typecheck`, `npm run lint`, `npm run test` đều pass.
- Không tạo file thừa, không để `console.log` trong `src/`.
- Nếu thay đổi hành vi đã có AC: cập nhật AC trong `docs/01-prd.md` cùng commit.
