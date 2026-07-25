# SRS - Phase 5.1 Portfolio Items

## 0. Document Control

| Attribute | Value |
|---|---|
| Module ID | `P5-PORTFOLIO-ITEMS` |
| Status | BA/Mockup Ready |
| Updated date | 2026-07-25 |
| Scope | `Portfolio > Portfolio Items` list, Feature create, Feature Detail (Details tab + Children tab) |
| Priority | P5.1 - required before P5.2 Release Planning, P5.3 Capacity Planning and P5.4 Release Tracking can start (they all read Feature data this module produces) |
| Depends on | Phase 1 Backlog Work Item base (Story/Defect/Task), Phase 2 Backlog inline-edit and resizable-column conventions, Phase 3 Release Management (Target Release field), Phase 4 RBAC (`manageFeatures` permission gate) |
| Mockup source | `03_Mockup Design/src/app/pages/PortfolioPage.tsx` |
| Not included | Initiative/Theme level (evaluated and rejected, see §2), P5.2 Release Planning / P5.3 Capacity Planning / P5.4 Release Tracking (separate modules), Reports, API payloads and persistence design, "link/unlink existing Story-Defect" (removed, superseded by Add Item), bulk actions, drag-and-drop Rank reordering |

## 1. Goal

Portfolio Items gives leadership a Feature-level view of work that sits one layer above Story/Defect, so a large capability can be tracked, staffed and rolled up without reading every individual Story. It is the foundation the rest of the Portfolio module (Release Planning, Capacity Planning, Release Tracking) is built on.

## 2. Confirmed Direction

- Mini Rally uses a **single Portfolio Item level: Feature**. Rally's own model allows `Theme -> Initiative -> Feature`; BA evaluated adding an `Initiative` level above Feature and decided against it - ACME Space Inc. is one small company with no current need for a "group of Features into one cross-quarter goal" view, and the extra level would add fields, permissions and a rollup layer nobody would use yet. It can be added later without breaking the Feature<->Story link.
- A Feature is the **only** Portfolio Item type that attaches directly to the Story/Defect hierarchy, matching Rally's rule that only the lowest Portfolio Item type links to User Stories. Story, Defect and Task below Feature are unchanged from Phase 1/2.
- A Feature's Plan Estimate and Progress are never typed in manually - both are always a rollup computed from the Story/Defect linked to that Feature (see §6). This replaced an earlier mockup state where child counts were static cosmetic numbers.
- `Portfolio Items` is the first entry in the top-nav `Portfolio` dropdown, ahead of `Release Planning`.
- The Portfolio Items list has no page-level summary metrics strip (Features / Total Stories / Accepted Stories / Total Points was built, then explicitly removed per BA - "no need"). The page goes straight from the breadcrumb to the list toolbar.

## 3. Portfolio Items List

### 3.1 Columns

| Column | Editable inline | Notes |
|---|---|---|
| Rank | Yes (up/down reorder buttons only, no drag-and-drop) | Manual stack-rank order, same convention as Backlog's Rank column |
| Type | No | Always shows `Feature` - this collection currently holds only Features |
| ID | No | Feature identifier, e.g. `FE-318` |
| Name | Yes | Feature name |
| Release | Yes | Target Release, `Unscheduled` or a confirmed Release |
| State | Yes | 11-value Portfolio Item State, see §7 |
| Progress | No | Computed rollup, see §6 - never editable |
| Project | Yes | Changing Project resets Team to that Project's first Team |
| Team | Yes | Options scoped to the Feature's current Project |
| Owner | Yes | |

### 3.2 List Behavior

- Every column is resizable (drag the column border) and sortable (click the column header).
- Inline edit is available on every editable column above, gated by the `manageFeatures` permission - a user without that permission sees read-only values instead of inputs/selects.
- Clicking anywhere on a Feature row other than an inline-edit control, the Rank reorder buttons, or the expand chevron opens that Feature's Detail page (§5).
- Each Feature row has an expand chevron (only shown when the Feature has at least one linked Story/Defect) that reveals up to 5 linked items as an inline, read-only preview: Type, ID, Name, Release, Project, Team, Owner are shown; **State and Progress are intentionally left blank in this preview** - the full State (as the app-wide Schedule State bar) and per-item progress are available on the Children tab (§5.2) or that item's own full detail, and were judged unnecessary clutter for a quick preview. If more than 5 items are linked, a static "+N more - see Children tab" line is shown; it is not clickable. Expanding/collapsing a Feature's preview does not open its Detail page, and the preview rows themselves are not inline-editable and do not navigate anywhere on click.

## 4. Create Feature

- `New Feature` button is visible only to roles with the `manageFeatures` permission (not `Project Member`).
- Create modal fields: Project (select, cascades Team), Team (select, scoped to Project), Name (required), State (11-value Portfolio Item State, defaults to `No Entry`), Preliminary Estimate (T-shirt size, defaults to `No Entry`), Owner, Target Release (`Unscheduled` or a confirmed Release).
- Two submit actions:
  - `Create Feature` - creates the Feature and returns to the Portfolio Items list.
  - `Create with details` - creates the Feature and immediately opens its Detail page.
- Plan Estimate and Progress are never set here; they only exist once Story/Defect items are linked (§6).

## 5. Feature Detail

Feature Detail is a full page (replaces the list, same chrome pattern as Work Item Detail: dark header bar, back button, Feature badge + ID + Name), not a docked side panel. It has two tabs: **Details** and **Children** (the Children tab label shows a live count of linked items).

### 5.1 Details Tab

Main column (rich text, all read-only when the viewer lacks `manageFeatures`):

- Description
- Attachments
- Notes
- What Success Looks Like

Right rail, in order:

| Field | Behavior |
|---|---|
| Owner | Select |
| Project | Select; changing it resets Team to that Project's first Team |
| Progress | Read-only computed bar, see §6 |
| State | Select, 11-value Portfolio Item State |
| Release | Select, `Unscheduled` or a confirmed Release |
| Milestone | Multi-select checklist, scoped to the Feature's Project plus any already-selected Milestones |
| Creation Date | Read-only, full weekday/month/day/year/hour/minute/second format matching the Audit Log |
| Planned Start Date | Plain free-text field (intentionally not a date picker) |
| Planned End Date | Native date picker |
| Market Release Date | Native date picker |

### 5.2 Children Tab

Full Backlog-style table of every Story/Defect linked to this Feature: search box, Show/Hide filter with a Manage Filters panel and active-filter chips, resizable and sortable columns, pagination footer, and a Totals row summing Plan Estimate.

Columns: Type, ID, Name (inline edit), Priority (Defect only, inline edit), Est (inline edit), Owner (inline edit), Schedule State (the app-wide segmented I/D/P/C/A/R bar, inline edit), Iteration (read-only text - deliberately not sortable/resizable, a scope trim rather than an oversight), Release (inline edit).

Each row can expand to reveal its linked Tasks, read-only: ID, Name, state badge, Owner, Estimate, To Do/Actual hours.

`Add Item` opens the same creation flow Backlog uses, restricted to Story/Defect, pre-filled with this Feature's Project/Team, and automatically linked to this Feature.

Clicking anywhere on a Children row other than an inline-edit control opens the **same full-page Work Item Detail used everywhere else in the app** (Backlog, Iteration Status, Team Board, Quality) - identical tabs and fields, nothing reduced or Portfolio-specific. "Back" from that page returns to the flat Portfolio Items list (the same behavior every other entry point into that page already has).

There is no "link existing Story/Defect" or "unlink" control anywhere in Feature Detail. A Story/Defect's Feature membership is set only at creation (`Add Item`) or by editing that Story/Defect's own record elsewhere.

## 6. Progress & Plan Estimate Rollup

A Feature never stores Plan Estimate or Progress directly - both are always computed from its linked Story/Defect (`featureId`):

- **Plan Estimate** = sum of Plan Estimate across every Story/Defect linked to the Feature.
- **Progress %** = (sum of Plan Estimate for linked items whose Schedule State is `Accepted` or `Release`) / (sum of Plan Estimate of all linked items), rounded to the nearest whole percent. A Feature with zero linked items shows 0%.

This value is read-only everywhere it is shown: the Portfolio Items list Progress column, and the Details tab Progress field.

## 7. Confirmed Field Options

| Field | Options |
|---|---|
| Feature State (Portfolio Item State) | No Entry, Intake, Idea Prioritization, Problem Discovery, Solution Discovery, Feature Prioritization, Developing, Accepted, Measuring, Done, Cancelled |
| Preliminary Estimate | No Entry, XS, S, M, L, XL |
| Schedule State (on linked Story/Defect - existing Phase 1/2 enum, unchanged, shown as the app-wide segmented bar) | Idea, Defined, In-Progress, Completed, Accepted, Release |

## 8. Functional Requirements

| ID | Requirement |
|---|---|
| P5-PI-FR-001 | User can open `Portfolio > Portfolio Items`. |
| P5-PI-FR-002 | Portfolio Items list shows Rank, Type, ID, Name, Release, State, Progress, Project, Team, Owner. |
| P5-PI-FR-003 | Every list column is sortable and resizable. |
| P5-PI-FR-004 | User with `manageFeatures` can inline-edit Name, Release, State, Project, Team and Owner directly from the list. |
| P5-PI-FR-005 | User can reorder Features via Rank up/down controls. |
| P5-PI-FR-006 | User can expand a Feature row to preview up to 5 linked Story/Defect without leaving the list. |
| P5-PI-FR-007 | Clicking a Feature row (outside inline-edit/reorder/expand controls) opens Feature Detail. |
| P5-PI-FR-008 | User with `manageFeatures` can create a Feature via `New Feature`, with either immediate return to the list or immediate entry into the new Feature's Detail page. |
| P5-PI-FR-009 | Feature Detail Details tab shows Description/Attachments/Notes/What Success Looks Like plus the 9 right-rail fields listed in §5.1. |
| P5-PI-FR-010 | Feature Detail Children tab lists every Story/Defect linked to the Feature with Backlog-equivalent search/filter/sort/resize/pagination. |
| P5-PI-FR-011 | User with `manageFeatures` can inline-edit Name, Priority (Defect), Est, Owner, Schedule State and Release directly from the Children tab. |
| P5-PI-FR-012 | User can expand a Children-tab row to see its linked Tasks read-only. |
| P5-PI-FR-013 | User can add a new Story/Defect to a Feature via `Add Item`, pre-assigned to the Feature. |
| P5-PI-FR-014 | Clicking a Children-tab row (outside inline-edit controls) opens the same full Work Item Detail page used by Backlog/Iteration Status/Team Board/Quality. |
| P5-PI-FR-015 | Feature Plan Estimate and Progress are always computed from linked Story/Defect and are never directly editable. |
| P5-PI-FR-016 | `Portfolio Items` is the first entry in the `Portfolio` nav dropdown. |

## 9. BA Confirmations

| ID | Question | Confirmed answer |
|---|---|---|
| P5-PI-Q01 | Does Mini Rally need an Initiative/Theme level above Feature? | No - single-level Feature only; revisit if a future need for cross-quarter grouping appears. |
| P5-PI-Q02 | What columns belong on the Portfolio Items list? | Rank, Type, ID, Name, Release, State, Progress, Project, Team, Owner - replacing the earlier ID/Type/Name/Owner/Status/Progress/Target Release/Related/Blocked/Updated set. |
| P5-PI-Q03 | Should the list still preview a Feature's children inline? | Yes - kept as an expand-to-preview interaction, but simplified: State and Progress are blank in the preview since the Children tab and full item detail already cover them in depth. |
| P5-PI-Q04 | Should clicking a Children-tab row do anything? | Yes - it must open the real, complete Work Item Detail page (same one Backlog uses), not a partial or Portfolio-specific view. |
| P5-PI-Q05 | Is the Features/Total Stories/Accepted Stories/Total Points summary bar needed? | No - removed from the page entirely. |
| P5-PI-Q06 | Should Story/Defect be linkable to a Feature after creation via a separate link/unlink picker? | No - membership is set only at creation (`Add Item`) or by editing the Story/Defect's own record; the picker was built, then explicitly removed. |
| P5-PI-Q07 | What is the Feature State field's option set? | The 11-value Portfolio Item State list in §7, matching the real Rally Portfolio Item State field the BA referenced. |

## 10. Acceptance Criteria

1. User can open `Portfolio > Portfolio Items` and see the confirmed column set.
2. All list columns are sortable and resizable.
3. User with `manageFeatures` can inline-edit Name, Release, State, Project, Team and Owner from the list.
4. Rank can be changed via up/down controls and the new order persists across a Rank-column sort.
5. Expanding a Feature row previews up to 5 linked Story/Defect with State and Progress blank.
6. Clicking a Feature row opens Feature Detail; inline-edit controls, Rank buttons and the expand chevron do not trigger navigation.
7. `New Feature` creates a Feature via both `Create Feature` and `Create with details` paths.
8. Feature Detail Details tab shows all fields listed in §5.1.
9. Feature Detail Children tab shows Backlog-equivalent search/filter/sort/resize/pagination over linked Story/Defect.
10. Children-tab rows are inline-editable on the confirmed fields and expandable to show linked Tasks read-only.
11. `Add Item` creates a new Story/Defect already linked to the current Feature.
12. Clicking a Children-tab row opens the full Work Item Detail page, identical to opening the same item from Backlog.
13. Feature Plan Estimate and Progress are never directly editable and always reflect the linked Story/Defect rollup.
14. No summary metrics strip appears above the Portfolio Items list.
15. No link/unlink-existing control exists anywhere in Feature Detail.
16. `Portfolio Items` is the first entry in the `Portfolio` nav dropdown.

## 11. Open Questions

No open business question remains for the Phase 5.1 BA/mockup baseline. Phase 5.1 is closed for BA/mockup scope; production implementation (API payloads, persistence, permission enforcement beyond the mockup's `manageFeatures` gate) remains development-owned.
