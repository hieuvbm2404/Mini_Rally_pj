# P5.2 Capacity Planning - SRS

## 1. Document Control

| Attribute | Value |
|---|---|
| Phase | Phase 5 - Portfolio Module |
| Feature | P5.2 Capacity Planning |
| Status | BA confirmed; record-detail v2 implemented; pending browser smoke/BA acceptance |
| Effective date | 2026-07-26 |
| Reference model | Broadcom Rally Capacity Planning, simplified for Mini Rally |
| Scope boundary | BA/mockup behavior using session-level frontend state only |

## 2. Business Goal

Capacity Planning lets Planners create a single-Release plan, add Teams from the Project Breakdown, add Portfolio Features to the plan, allocate fixed demand to one or more Teams, and compare committed demand against manual Team capacity while tracking execution progress from live Story/Defect children.

Mini Rally hierarchy is:

```text
Workspace -> Project -> Team
```

Rally's Capacity Planning groups rows by child Project/Scrum Team. In Mini Rally, those rows are represented by Teams under the selected Project.

## 3. Confirmed Direction

1. Release Planning is deferred. Capacity Planning becomes P5.2.
2. A Capacity Plan has lifecycle `Draft -> Published`.
3. There is one Capacity Plan per `Project + Release`.
4. Project scope stores the plan only; it does not decide which Teams are included.
5. Teams are added through Project Breakdown. In Mini Rally, selectable leaf Projects are shown as Teams.
6. Features are added to the plan from the eligible Portfolio Feature list after plan creation.
7. Draft allocations are plan-specific. One Feature may have one or many allocation rows.
8. Allocation value is fixed at planning time and changes only through replan/split/edit allocation.
9. Feature does not have a Plan Estimate field; allocation must be entered as a plan-specific value and must not derive from Preliminary Estimate mapping.
10. Publishing has two actions: `Publish Without Updating Fields` and `Publish`.
11. Published plans are read-only. Revert to Draft allows further planning, but previously written Feature fields are not rolled back.

## 4. Capacity Plan List

Navigation: `Portfolio > Capacity Planning`.

The list shows Capacity Plan records for the selected Project context.

Columns:

| Column | Rule |
|---|---|
| ID | Plan identifier such as `CP-001`; clicking opens detail |
| Name | Required plan name |
| Release | Selected Project Release |
| Status | `Draft` or `Published` |
| Last Updated | Human-readable session timestamp |
| Teams in Plan | Count of included Teams |

Available controls:

- Search plans by ID, Name or Release.
- Filter by Release.
- Add New.
- Open a plan by clicking ID or row.

## 5. New Capacity Plan Modal

Fields:

| Field | Rule |
|---|---|
| Project | Current Project context, read-only |
| Name | Required |
| Plan Type | Fixed `Single Release` |
| Release | Required; options are Releases for the current Project |
| Portfolio Item Type | Fixed `Feature` |
| View Work Items By | Required `Points` or `Count`; fixed after create |

Create is disabled until Name and Release are populated. On create, no Team or Feature is auto-added because Project scope only controls where the plan is stored.

## 6. Plan Detail

The detail page uses Rally's `Projects by Total` concept but labels it `Teams by Total`.

Header content:

- Plan ID.
- Name.
- Status.
- Release badge.
- Plan-level totals for Complete %, Demand, Rollup, Estimated and Capacity.
- `Publish Without Updating Fields` and `Publish` actions for authorized users while Draft.
- `Revert to Draft` for authorized users after Published.

Tabs included in P5.2:

- `Teams by Total`
- `Features` (record-detail v2 amendment, 2026-07-27)

Tabs deferred:

- `Alignment`
- `Progress`
- `Revision History`
- `Breakdown`

## 7. Teams by Total

Each Team row shows:

| Field | Rule |
|---|---|
| Team Name | Team under the selected Project |
| Features | Count of allocated Features |
| Unnamed progress | Composite progress bar using the Team Capacity baseline; hover shows Complete, Rollup, Estimated and Capacity breakdown |
| Complete | Accepted execution value from Story/Defect children, shown with percent of Team Capacity |
| Rollup | Demand rollup: sum of fixed allocation values for the Team, shown with percent of Team Capacity |
| Estimated | Live execution estimate from current Story/Defect children, shown with percent of Team Capacity |
| Capacity | Manually editable in Draft; read-only in Published |

If Demand exceeds Capacity, the Team row shows an advisory warning badge near the Team name. This does not block planning actions.

The Team columns `Complete`, `Rollup` and `Estimated` are right-aligned to the expanded Feature rows underneath that Team. The Team progress bar sits immediately to the left of `Complete`, and `Capacity` remains the final Team-only column.

The page includes `Add Team` from Project Breakdown at the plan-detail action level. `Add Features` inside an expanded Team remains the targeted path: it attaches the selected Feature directly to that Team. Removing a Team moves its allocation rows back to Unallocated.

While Draft, the action bar also provides `Calculate Capacity Forecast`. It is a planner aid that proposes capacities from a supplied historic velocity; the planner may edit every proposed value before Publish. Capacity stays disabled after Publish.

## 8. Features Tab (Record-detail v2)

`Features` is the Feature-centric view of the same Plan allocation records. It keeps its selected sort independently from `Teams by Total`.

The right rail is `Team Capacity`, listing every Team in the Plan and its fixed demand / Team Capacity with an advisory overload icon. It uses the plan unit mode label (`Points / Capacity` or `Count / Capacity`).

| Column / element | Rule |
|---|---|
| Change marker | Reserved for added/removed-after-publish display; neutral before Publish. |
| Rank | Sortable plan priority. The Capacity Cutline appears only while Rank sort is selected. |
| ID / Name / State | Read-only Feature identity and lifecycle state. |
| Estimated | Top-down refined estimate for the plan unit. Mini Rally does not hard-code a mapping from Preliminary Estimate; if the Project has not supplied a refined number, the UI shows `Not refined` (zero for cutline math). |
| Rollup / Complete | Live rollup from linked accepted Story/Defect children; percent uses `floor(Complete / Estimated * 100)`. |
| Planned Team | `Not assigned` warning when no Team allocation exists, one Team name when singular, or `N teams` with subrows when split. |
| Allocate to Teams | Draft-only Feature menu. Opens the allocation dialog without modifying `Feature.projectId`. |

The tab also has a Draft-only `Add Feature` action above the list. It lists eligible Portfolio Features not already in this Plan and creates an Unallocated plan allocation row with value `0`. The planner then uses `Allocate to Teams` or the Team-level Add Features path to place that Feature.

Allocation dialog rules:

The dialog is reachable from two places: the `Allocate to Teams` action on a Feature in the `Features` tab, and the `Allocate` item in a Feature row's settings menu inside an expanded Team (§9). Both open the same dialog.

Layout, mirroring Rally's `Allocate to Projects` with Project replaced by **Team** per the Mini Rally hierarchy:

- A read-only header row identifying the Portfolio Item: `ID`, `Name`, `Prelim Estimate`, `Refined Estimate`.
- A `Team` / `Estimate` table, one row per contributing Team, each row removable.
- An `Add Team` action, and a live `Total allocated` readout showing what the Feature's Estimated will become once applied.

Rules:

- Planner may add one or more Plan Teams.
- Blank Estimate copies the Feature's top-down estimate into a fixed allocation row and labels its source `Feature Estimate`. That top-down value is Refined Estimate, or the Preliminary Estimate size mapping when no Refined Estimate exists - it deliberately excludes Total Allocated, see §11.
- A supplied Estimate becomes a fixed `Manual` allocation row.
- Re-applying allocation replaces the Feature's Team allocation rows only; it never edits its Project or execution children.

Capacity Cutline is calculated only for ascending Rank: it is rendered after the first Feature where cumulative planning Estimated (§11) reaches or exceeds Plan total Capacity. The line disappears for all other sorting choices.

## 9. Expanded Team Feature List

Expanding a Team shows allocated Features and the Team-level `Add Features` action.

Columns:

| Column | Rule |
|---|---|
| Settings | Draft-only gear icon at the start of the row, and the only place this row's allocation is changed. Opens a small menu with four actions: `Move up` and `Move down`, which swap this row's Rank with the adjacent row **inside the same Team only** (reordering one Team never changes another Team's order) and are disabled at the corresponding end of the list; `Allocate`, which opens the Allocate dialog described in §8 so the Feature's split across Teams can be edited without leaving `Teams by Total`; and `Remove from Team`, which drops this allocation row from the plan. `Remove from Team` exists because the Allocate dialog only replaces Team rows and cannot drop a Feature out of the plan entirely. |
| Rank | Plan-level display order inside the Team |
| ID | Feature ID |
| Name | Feature Name |
| State | Feature lifecycle state |
| Allocation | States where this allocation row came from. A Feature carries its own Team from Portfolio Items; that Team is its origin. When the row's Team **is** the Feature's own Team there is nothing to attribute and the cell shows `—`. When the Feature has been split into a **different** Team, that row reads `From {Feature's own Team}`. Example: Feature A owned by `Core Platform` is added to `Core Platform`, then Allocate splits points into `Data & Reporting`; the `Data & Reporting` row shows `From Core Platform` while the `Core Platform` row shows `—`. Read-only - allocation itself is changed in the Allocate dialog. |
| Dependencies | Column present but **not implemented in this slice**; every row shows `—`. Mini Rally has no dependency data contract yet, so no dependency is modelled or displayed. |
| Unnamed progress | Composite progress bar using the parent Team Capacity baseline; hover shows Complete, Rollup and Estimated breakdown |
| Complete | Accepted Story/Defect points or count for this Team/Feature, shown with percent of parent Team Capacity |
| Rollup | Fixed allocation value for this Team/Feature allocation row, shown with percent of parent Team Capacity. **Read-only** (revised 2026-07-27): the value is set in the Allocate dialog, so allocation has exactly one editing surface. |
| Estimated | Live Story/Defect points or count for this Team/Feature, shown with percent of parent Team Capacity |

The expanded Feature table ends before the Team `Capacity` column so that Team-level capacity remains visually distinct from Feature-level progress and estimates.

Layout note (revised 2026-07-27): with `Allocation` and `Dependencies` added the table carries nine columns and no longer fits inside the width the Team row occupies, so it scrolls horizontally within its own container at a fixed minimum width. The column-for-column alignment with the Team row described above therefore holds only until the table is scrolled. This was accepted in preference to squeezing `Name`, which was already at its minimum width before these columns were added.

`Dependencies` is displayed as a column but is not implemented: Mini Rally still has no dependency data contract in this slice, so every row shows `—`.

## 10. Add Features, Unallocated Features and Split Allocation

`Add Features` is available from the expanded Team record and `Add Feature` is available in the Features-tab list. The Team action creates or moves allocation rows directly under that Team. The Features-tab action lists only Features not yet in this Plan and creates an Unallocated row.

The two pickers deliberately use different scopes:

| Picker | Scope | Columns |
|---|---|---|
| Team-level `Add Features` (expanded Team, `Teams by Total`) | Every Feature across the Project's Teams - **no Release filter** | ID, Name, Project, Team, Allocation |
| Plan-level `Add Feature` (Features tab) | Features matching Feature eligibility below that are not yet in this Plan | ID, Name, Project, Allocation |

Team picker scope (revised 2026-07-27):

- Same Project as the plan.
- Not Archived.
- State is not `Cancelled`.
- Release is **not** filtered: a Feature on any Release, or none, may be pulled into a Team, because a planner needs to see the Project's whole Feature inventory when staffing a Team. The `Team` column exists so the planner can see which Team currently owns each Feature.

Feature eligibility (plan-level picker and the `Eligible` counter):

- Same Project as the plan.
- Not Archived.
- State is not `Cancelled`.
- Release is `Unscheduled` or matches the Plan Release.

Adding a Feature from a Team follows these rules:

- If the Feature is not yet in the plan, create one allocation row for the selected Team with default allocation value `0`.
- If the Feature already has an Unallocated row, move that existing row to the selected Team and keep its current allocation value.
- If the Feature is already allocated to another Team, create an additional split allocation row for the selected Team with default allocation value `0`.
- If the Feature is already allocated to the selected Team, keep it visible in the list marked as added, with selection disabled. It is deliberately **not** removed from the list, so the planner can see what is already in the Team instead of the row disappearing.

Because the Team picker ignores Release, a Feature outside the Plan Release can hold an allocation. Every Feature display in the plan must therefore resolve against the full Feature list, never against the eligibility-filtered list, or such an allocation would count toward Team totals while rendering no row.

The planner enters or adjusts the committed value during allocation/replanning.

Assigning and splitting are both done in the Allocate dialog (§8) while Draft; there is no separate assign or split control (revised 2026-07-27). Adding a Team row in the dialog is the split action, and the row's committed value is typed there. A Feature that is in the plan but has no Team yet has no dedicated `Unallocated Features` block on `Teams by Total` - the plan header still counts it under `Unassigned`, and it appears in the `Features` tab carrying a `Not assigned` badge, from where it can be allocated. Dropping an allocation row out of the plan is `Remove from Team` in the row settings menu (§9), because the Allocate dialog only replaces Team rows.

## 11. Calculations

Feature Allocation:

```text
fixed allocation.value set during planning/replanning
```

Feature Estimated - execution view, used inside an expanded Team row:

```text
Points: SUM(story.planEstimate for current Feature/Team)
Count: COUNT(story for current Feature/Team)
```

Feature Estimated - planning view, used in the `Features` tab and the Capacity Cutline (revised 2026-07-27):

```text
1. Total Allocated  = SUM(allocation.value for this Feature in this plan)   -> if > 0
2. Refined Estimate = Feature.refinedEstimate | refinedWorkItemCountEstimate -> if > 0
3. Preliminary      = Preliminary Estimate size mapping
otherwise 0 ("No estimate")
```

Once a planner has committed demand, that allocated total is the truth and outranks any top-down forecast; the forecasts only stand in until an allocation exists. The UI labels which tier produced the number (`ALLOCATED` / `REFINED` / `PRELIMINARY`) so the planner can see whether they are looking at a commitment or a forecast.

Two rules keep this from becoming circular or inconsistent:

- The **default offered when allocating** (blank Estimate in the Allocate dialog) uses only tiers 2 and 3. Folding tier 1 back in would mean a blank field commits the sum of the very allocations it is meant to create.
- `Total Allocated` counts **every** allocation row for that Feature in the plan, including a row still sitting in Unallocated. A planner who typed a number has estimated the Feature even if no Team is chosen yet. Note this differs from Team `Demand`, which by design counts only Team-assigned rows.

Preliminary Estimate size mapping (shared with Portfolio Items so both surfaces agree):

| Size | Points | Count |
|---|---:|---:|
| No Entry | 0 | 0 |
| XS | 1 | 1 |
| S | 3 | 2 |
| M | 5 | 3 |
| L | 8 | 5 |
| XL | 13 | 8 |

These are the documented defaults. A user-configurable mapping remains deferred to `Settings > Workspace > Project Management`.

Feature Rollup:

```text
Points: SUM(story.planEstimate WHERE Accepted or Release)
Count: COUNT(story WHERE Accepted or Release)
```

Feature Complete:

```text
Rollup / Estimated * 100
```

Team Demand Rollup:

```text
SUM(allocation.value)
```

Team Estimated:

```text
SUM(Feature Estimated for Features allocated to Team)
```

Team Rollup:

```text
SUM(Feature Rollup for Features allocated to Team)
```

Team Complete:

```text
Team Rollup / Team Estimated * 100
```

Capacity/Demand and Execution/Completion are intentionally separate. Allocation uses fixed planning values so execution estimate drift does not change committed demand.

## 12. RBAC

Revised 2026-07-27 (BA confirmed). Capacity Planning access is decided by **two
independent gates**, and both must pass before a role may change a plan:

1. **Capacity Planner permission**, held per role in the Phase 4 role matrix at
   `Settings > Workspace > Roles & Permissions`. It is graded, not boolean:
   `Enabled` = planner **Full**, `Read-only` = planner **View**.
2. **Project scope**, unchanged: a Project Admin manages only its assigned
   Projects and is read-only elsewhere.

Passing one gate but not the other means read-only.

| Role | Behavior |
|---|---|
| Workspace Admin | Always planner Full. Its matrix column is intentionally locked, so a Workspace Admin cannot be reduced to View and cannot lock itself out of planning. |
| Project Admin | Planner Full or View, set per role in the matrix. With Full, manages plans in assigned Projects only. With View, may open both Draft and Published plans across the Project but change nothing. |
| Project Member | Read-only, and only ever sees a **Published** plan; a Draft plan is hidden from the list and unreachable. Inside a Published plan it sees only its assigned Team. |

The matrix rows that gate this feature:

| Permission | Gates |
|---|---|
| `capacity_planning:view` | Documentation of view intent. Screen-level visibility still comes from navigation rules, consistent with every other `*:view` row in the Phase 4 matrix. |
| `capacity_planning:create` | `Add New` plan |
| `capacity_planning:edit_plan` | Add/Remove Teams, edit Capacity, Capacity Forecast, allocate/move/split/unassign Features |
| `capacity_planning:publish` | `Publish`, `Publish Without Updating Fields`, `Revert to Draft` |

Manage actions include Create Plan, Add/Remove Teams, edit Capacity, allocate/move/unassign Features and Publish.

## 13. Acceptance Criteria

| ID | Criteria |
|---|---|
| P5-CAP-AC-001 | `Portfolio > Capacity Planning` opens the Capacity Plan list for the selected Project. |
| P5-CAP-AC-002 | New Capacity Plan modal matches the confirmed fields and creates one Draft plan per Project+Release. |
| P5-CAP-AC-003 | Creating a plan stores Project scope, Release and View By, but does not auto-add Teams or Features. |
| P5-CAP-AC-004 | Plan detail shows `Teams by Total` with Feature count, Demand, progress bar, Complete %, Rollup, Estimated, Capacity and advisory over-capacity badge when Demand exceeds Capacity. |
| P5-CAP-AC-005 | Add Team uses Project Breakdown and removed Teams move their allocation rows back to Unallocated. |
| P5-CAP-AC-006 | Add Features from an expanded Team lists eligible Features and creates/moves a Team allocation row without changing Feature Project. |
| P5-CAP-AC-007 | Split allocation lets one Feature have multiple Team allocation rows while Draft. |
| P5-CAP-AC-008 | Allocation values are plan-specific manual inputs; split allocation creates another editable row for the same Feature and Team Demand uses `allocation.value`. |
| P5-CAP-AC-009 | `Publish Without Updating Fields` changes visibility/status only; `Publish` also writes Release and planned dates to allocated Features without overwriting Feature Project or child Story/Defect fields. |
| P5-CAP-AC-010 | Workspace Admin and authorized Project Admin can manage; Project Member is read-only and scoped to assigned Team. |
| P5-CAP-AC-012 | Capacity Planner permission is graded per role in the Phase 4 matrix and actually gates the screen: a Project Admin set to `Read-only` on `capacity_planning:edit_plan` loses Add Team, Capacity edit, Capacity Forecast, allocation and Publish/Revert while still opening Draft and Published plans; saving the matrix in Settings takes effect without reload. Workspace Admin remains locked at `Enabled`. |
| P5-CAP-AC-013 | A Project Member sees a plan only after it is Published; Draft plans do not appear in the Capacity Plan list and cannot be opened. |
| P5-CAP-AC-011 | Record detail has independently retained Teams by Total and Features tab view state; the Features tab supports Rank-only capacity cutline and Draft-only multi-Team allocation. |

## 14. Out of Scope

- Release Planning screen.
- Multi Release and Plan of Plans.
- Multiple what-if plans for the same Project+Release.
- Automatic rebalance.
- Velocity-driven automatic capacity.
- Dependency data and behavior. The `Dependencies` column exists on the expanded Team Feature table as a placeholder showing `—`; nothing is modelled behind it.
- Breakdown chart.
- Alignment, Progress and Revision History tabs.
- Production API, database persistence or server-side authorization.

## 15. Open Questions

Project Management is the future location for user-defined Preliminary Estimate configuration. This slice deliberately does not hard-code a size-to-number map. Any change to lifecycle, allocation, publish, formulas, tabs or RBAC requires BA confirmation before implementation.
