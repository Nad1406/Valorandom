# 03 — Data Schema & API Docs

**Sản phẩm:** VALORANDOM
**Phiên bản:** 1.0

> Dự án không có backend/DB. Tài liệu số 4 của quy trình (ERD) được thay bằng mục 2
> (TypeScript schema) và mục 3 (JSON shape) dưới đây.

---

## 1. Quyết định: static JSON, không gọi API runtime

Tool random cần phản hồi tức thì trong lobby; dữ liệu game thay đổi vài lần mỗi mùa;
phụ thuộc API bên thứ 3 tạo single point of failure + rủi ro CORS/rate-limit.

Script sync chạy khi cần, output được commit → git diff cho thấy chính xác agent/map/weapon mới.

## 2. Domain types — `src/types/valorant.ts`

```ts
export const ROLES = ['duelist', 'initiator', 'controller', 'sentinel'] as const;
export type Role = (typeof ROLES)[number];
export type SlotRole = Role | 'flex';

export const WEAPON_CATEGORIES = [
  'sidearm', 'smg', 'shotgun', 'rifle', 'sniper', 'lmg', 'melee',
] as const;
export type WeaponCategory = (typeof WEAPON_CATEGORIES)[number];

export interface LocalizedText { en: string; vi: string; }

export interface Agent {
  id: string;
  slug: string;
  displayName: LocalizedText;
  role: Role;
  roleName: LocalizedText;
  description: LocalizedText;
  fullPortrait: string;
  displayIcon: string;
  background: string;
  isPlayable: boolean;
  abilities: Array<{
    slot: 'ability1' | 'ability2' | 'grenade' | 'ultimate' | 'passive';
    displayName: LocalizedText;
    displayIcon: string;
  }>;
}

export interface GameMap {
  id: string;
  slug: string;
  displayName: LocalizedText;
  coordinates: string | null;
  sites: string[];
  splash: string;
  listViewIcon: string;
  active: boolean;
}

export interface Weapon {
  id: string;
  slug: string;
  displayName: LocalizedText;
  category: WeaponCategory;
  cost: number;
  displayIcon: string;
  killStreamIcon: string | null;
  stats: {
    fireRate: number | null;
    magazineSize: number | null;
    reloadTimeSeconds: number | null;
    damageHead: number | null;
    damageBody: number | null;
  };
}

export interface DataMeta {
  generatedAt: string;
  dataVersion: string;
  source: 'valorant-api.com';
  counts: { agents: number; maps: number; weapons: number };
}
```

## 3. JSON shape — `src/data/*.json`

Mọi file data dùng envelope `{ meta, items }`:

```jsonc
{
  "meta": { "generatedAt": "2026-11-12", "dataVersion": "valorant-api-2026-11-12" },
  "items": [ /* Agent[] | GameMap[] | Weapon[] */ ]
}
```

Ví dụ một Agent:

```json
{
  "id": "add6443a-41bd-e414-f6ad-e58d267f4e95",
  "slug": "jett",
  "displayName": { "en": "Jett", "vi": "Jett" },
  "role": "duelist",
  "roleName": { "en": "Duelist", "vi": "Duelist" },
  "description": { "en": "…", "vi": "…" },
  "fullPortrait": "https://media.valorant-api.com/agents/<id>/fullportrait.png",
  "displayIcon": "https://media.valorant-api.com/agents/<id>/displayicon.png",
  "background": "https://media.valorant-api.com/agents/<id>/background.png",
  "isPlayable": true,
  "abilities": [
    {
      "slot": "grenade",
      "displayName": { "en": "Cloudburst", "vi": "Cloudburst" },
      "displayIcon": "https://media.valorant-api.com/agents/<id>/abilities/grenade/displayicon.png"
    }
  ]
}
```

**Kích thước dự kiến:** agents ≈ 27 × 1.5KB, maps ≈ 12 × 0.5KB, weapons ≈ 20 × 0.6KB
→ < 70KB raw, ~15KB gzip. Import trực tiếp vào bundle.

**Cờ `active` của Map:** giá trị do maintainer duy trì trong `scripts/map-rotation.json`.
Nếu slug của map nằm trong danh sách đó thì `active = true`. Script sync không ghi đè file rotation.

## 4. Sync script contract — `scripts/sync-valorant-data.ts`

Đây là giao tiếp bên ngoài **duy nhất** (dev-only), không phải runtime API.

| Endpoint | Query | Dùng để |
|---|---|---|
| `GET /v1/agents?isPlayableCharacter=true&language=en-US` | | id, role, abilities, ảnh (EN) |
| `GET /v1/agents?isPlayableCharacter=true&language=vi-VN` | | displayName/description (VI) |
| `GET /v1/maps?language=en-US` / `vi-VN` | | maps + splash |
| `GET /v1/weapons?language=en-US` / `vi-VN` | | weapons + shopData (category, cost) |

Behavior:

1. Fetch song song 6 request (3 resource × 2 language), timeout 20s, retry 2 lần.
2. Validate response bằng zod (fail-fast nếu API đổi schema).
3. Merge theo `uuid`: EN là base, VI bổ sung trường `.vi`.
4. Normalize: `role.displayName` → `duelist|initiator|controller|sentinel`; category
   `EEquippableCategory::Rifle` → `rifle`; ưu tiên `shopData` cho cost/category (fallback theo tên).
5. Map `active` theo `scripts/map-rotation.json`.
6. Sort `items` theo `slug` để git diff ổn định; ghi JSON 2 spaces + newline.
7. Ghi `meta.generatedAt` dạng `YYYY-MM-DD` (tránh diff nhiễu theo giờ).
8. Exit 1 nếu validate fail; in báo cáo added/removed so với file cũ.

**Lệnh:** `npm run data:sync`, `npm run data:validate`.

> Lưu ý: script cần mạng. Nếu môi trường không có mạng, dùng dữ liệu seed đã commit trong
> `src/data/*.json` — app hoàn toàn không phụ thuộc việc chạy lại script.

## 5. Data accessor API — `src/data/index.ts`

```ts
export const dataMeta: DataMeta;
export const agents: readonly Agent[];
export const maps: readonly GameMap[];
export const weapons: readonly Weapon[];
export const agentById: ReadonlyMap<string, Agent>;
export const agentsByRole: Readonly<Record<Role, readonly Agent[]>>;
export const weaponsByCategory: Readonly<Record<WeaponCategory, readonly Weapon[]>>;
export function localize(t: LocalizedText, lang: Lang): string;
```

Đây là hợp đồng cho toàn bộ UI: component không đọc JSON trực tiếp.

## 6. Share link — "API" giữa các client

**URL:** `<origin>/#/squad?s=<payload>`

**Payload:** base64url (RFC 4648 §5, không padding) của JSON UTF-8:

```jsonc
{
  "v": 1,
  "s": [
    { "n": "Minh", "r": "duelist", "l": "add6443a-41bd-e414-f6ad-e58d267f4e95" },
    { "n": "Linh", "r": "flex", "l": null }
  ]
}
```

| Field | Ý nghĩa | Ràng buộc |
|---|---|---|
| `v` | Schema version | phải = 1, khác → reject |
| `s` | mảng slot | 1..5 phần tử |
| `n` | tên hiển thị | ≤ 16 ký tự, trim; rỗng → "Player N" |
| `r` | role | `duelist\|initiator\|controller\|sentinel\|flex` |
| `l` | locked agentId | nullable, phải tồn tại trong data hiện tại |

**Decode behavior:**

- Base64 lỗi / JSON lỗi / zod fail → `{ ok: false }` + banner "Link không hợp lệ" + state mặc định.
- `r` hợp lệ nhưng `l` trỏ agent không tồn tại hoặc sai role → bỏ `l`, thêm warning `LOCK_DROPPED`.

**Encode:** `TextEncoder` + base64url. Bắt buộc base64url (không dùng base64 chuẩn) vì `+`/`/`
gây lỗi khi copy qua chat.

## 7. i18n contract

```ts
type Lang = 'vi' | 'en';
// src/lib/i18n/vi.ts | en.ts
export const vi = {
  'nav.single': 'Random đơn',
  'nav.squad': 'Random đội',
  'squad.role.flex': 'Flex / Bất kỳ',
  'squad.error.insufficientRole': 'Cần {needed} {role} nhưng chỉ có {count} khả dụng',
} as const;
```

- Key phẳng, namespace theo feature; ~150 key; không dùng thư viện i18n.
- Interpolation `t('key', { needed, role })` có type-check key.
- Test bắt buộc: `Object.keys(vi)` === `Object.keys(en)`.
