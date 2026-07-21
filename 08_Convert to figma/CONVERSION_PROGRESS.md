# Conversion Progress — Mini Rally Mockup to Figma

> Cập nhật file này ở cuối mỗi plan trước khi gửi review. Không bắt đầu plan tiếp theo nếu plan hiện tại chưa được bạn xác nhận.

## Current status

- Current plan: `PLAN 2 — Core component library`
- Active plan folder: `P2_Core_Component_Library`
- Status: `IN PROGRESS`
- Figma file: `Mini Rally Figma` (`ttpggMpbPwggOZl6umowzC`) — read-only preflight passed
- Scope version: `NOT LOCKED`
- Figma write status: Foundations plus native Button component set verified; live state ledger is `P2_Core_Component_Library/P2_FIGMA_STATE_LEDGER.json`.
- P2 checkpoint: `Button` validated; continue autonomously with `P2.a2 Icon Button`.
- Last updated: `2026-07-20`

## Gate log

| Plan | Status | Review package | User decision | Notes |
|---|---|---|---|---|
| Plan 0 | Approved | `P0_Discovery_and_Scope/UI_SCREEN_INVENTORY.md`, `COMPONENT_AND_TOKEN_AUDIT.md`, `UI_STATE_AND_BA_GAP.md`, `SCOPE_AND_DECISION_LOG.md`, `FIGMA_PREFLIGHT.md` | Confirmed 2026-07-21 | Inventory, scope lock and Figma preflight |
| Plan 1 | Approved | `P1_Design_Rules_and_Foundations/PLAN.md`, `P1_DESIGN_RULES.md`, `P1_TOKEN_MAPPING.md`, `P1_VALIDATION.md` | Confirmed 2026-07-21 | Rules and foundations |
| Plan 2 | In progress | `P2_Core_Component_Library/PLAN.md`, `P2_PROGRESS.md`, `P2_FIGMA_STATE_LEDGER.json` | Pending | Core component library; Button family validated, actions continue |
| Plan 3 | Blocked by Plan 2 | — | — | Data/navigation/BE patterns |
| Plan 4 | Blocked by Plan 3 | — | — | Foundation, Phase 0–1 screens |
| Plan 5 | Blocked by Plan 4 | — | — | Phase 2–3 screens |
| Plan 6 | Blocked by Plan 5 | — | — | Phase 4 governance screens |
| Plan 7 | Blocked by Plan 6 | — | — | QA, Dev Mode and handoff |

## Coverage status legend

- `Not inventoried`: chưa đọc/ghi nhận từ mockup.
- `In scope`: đã khóa cho conversion v1.
- `Converted`: đã có Figma screen/component đã QA.
- `Out of scope`: không chuyển trong v1, có lý do.
- `Needs decision`: mâu thuẫn BA/mockup/Figma hoặc thiếu business rule.

## Screen coverage matrix

| Source mockup page | Phase / domain | Status | Figma page/link | Notes |
|---|---|---|---|---|
| LoginPage | Phase 0 | In scope | — | — |
| AccessStatePage | Phase 4/RBAC | In scope | — | — |
| HomePage | Phase 0 | In scope | — | — |
| ProjectsPage | Phase 0 + Phase 1 | In scope | — | — |
| WorkItemDetailPage | Phase 1 | In scope | — | Pilot companion |
| BacklogPage | Phase 1 + Phase 2 | In scope | — | Pilot candidate |
| IterationsPage | Phase 2 | In scope | — | — |
| IterationStatusPage | Phase 2 | In scope | — | — |
| TeamBoardPage | Future backlog | Needs decision | — | Existing coded future UI |
| TeamStatusPage | Phase 3 | In scope | — | — |
| QualityPage | Phase 3 | In scope | — | — |
| PortfolioPage | Future backlog / Phase 5 | Needs decision | — | Existing coded future UI |
| ReleasesPage | Phase 3 | In scope | — | — |
| ReportsPage | Future backlog / Phase 5 | Needs decision | — | Existing coded future UI |
| NotificationsPage | Phase 4 | In scope | — | — |
| SettingsPage | Phase 4 | In scope | — | RBAC and audit |

## Decision log

| ID | Plan | Decision / question | Status | Owner | Resolution |
|---|---|---|---|---|---|
| D-001 | P0 | Chọn Figma file đích hoặc tạo Figma file mới | Resolved | User | Mini Rally Figma; read-only preflight passed |
| D-002 | P0 | Convert future-coded screens as reference only | Open | User | Recommended: include Tier B with label |
| D-003 | P0 | Pilot integration flow | Open | User | Recommended: Backlog + Work Item Detail |
| D-004 | P0 | Use Inter as source font for v1 | Open | User | Recommended: accept current mockup font |
| D-005 | P0 | Keep domain-specific status mappings over shared badge primitive | Open | User | Recommended: accept |
| D-006 | P0 | Responsive scope | Open | User | Recommended: desktop-first rules |

## Artifact index

| Artifact | Created in plan | Status |
|---|---|---|
| `README.md` | Setup | Complete |
| `CONVERSION_PROGRESS.md` | Setup | Complete |
| `P0_Discovery_and_Scope/UI_SCREEN_INVENTORY.md` | P0 | Review ready |
| `P0_Discovery_and_Scope/COMPONENT_AND_TOKEN_AUDIT.md` | P0 | Review ready |
| `P0_Discovery_and_Scope/UI_STATE_AND_BA_GAP.md` | P0 | Review ready |
| `P0_Discovery_and_Scope/SCOPE_AND_DECISION_LOG.md` | P0 | Review ready |
| `P0_Discovery_and_Scope/FIGMA_PREFLIGHT.md` | P0 | Review ready |
