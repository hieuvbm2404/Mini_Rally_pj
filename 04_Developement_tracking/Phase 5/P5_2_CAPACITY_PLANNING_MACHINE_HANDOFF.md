# P5.2 Capacity Planning — Cross-machine Handoff

## Resume status

- Date: 2026-07-27 (updated at the end of the Claude session described in §"Session log 2026-07-27 (Claude)")
- Phase state: `P5.2 IMPLEMENTED + TARGETED UAT COMPLETE -> BA SIGN-OFF PENDING ON 3 OPEN QUESTIONS`
- Do **not** close P5.2 or Phase 5. The user has explicitly said this slice remains open.
- Mockup scope only: session-level React state. This is not production API/persistence/RBAC evidence.
- All five targeted UAT items listed further down are now **done**. No known defect is open. What blocks closure is three business decisions, not more testing - see §"Open questions awaiting BA decision".
- Everything from that session is committed and pushed. Read §"Session log 2026-07-27 (Claude)" before touching `CapacityPlanningPage.tsx`, because several rules changed and two previously-documented statements in this file became wrong (they are corrected inline below).

## What is implemented

1. `Portfolio > Capacity Planning` list, single-Release plan creation, Draft/Published actions and session state.
2. Plan detail `Teams by Total`:
   - Add Team, Draft capacity editing, capacity forecast, Team progress/hover breakdown.
   - Expanded Team Feature rows and Team-level `Add Features`.
   - **Superseded 2026-07-27:** the expanded Feature row no longer has an inline allocation input, a `Split` control, or an `Unallocated Features in Plan` block. Each row has a settings-gear menu (`Move up` / `Move down` / `Allocate` / `Remove from Team`) and two extra columns (`Allocation`, `Dependencies`). See the session log.
3. Plan detail `Features`:
   - Rank/Name/Estimated/Rollup sort, Rank-only Capacity Cutline, unassigned warning, split Team subrows.
   - `Allocate to Teams` dialog supports one/many Teams; blank estimate snapshots refined Feature estimate, entered value is fixed manual allocation.
   - `Add Feature` adds an eligible Feature that is absent from the Plan as `Not assigned`; it must be allocated afterwards.
   - Right rail is `Team Capacity`, showing Team demand / capacity and overload warning.
4. ~~No Preliminary Estimate mapping is hard-coded.~~ **This statement is now wrong - corrected 2026-07-27.** A documented default size-to-number mapping **does** exist and Capacity Planning now uses it as the last tier of `Estimated`. It lives in `model.ts` as `PRELIMINARY_ESTIMATE_POINT_FALLBACK` / `PRELIMINARY_ESTIMATE_COUNT_FALLBACK` and is shared with Portfolio Items. It was not invented for Capacity Planning - it already existed inside `PortfolioPage.tsx` for the Estimated Progress bars, so this file's original claim was already stale when written. What remains deferred to `Settings gear > Workspace > Project Management` is only the **user-configurable** mapping; the defaults are hard-coded and documented in `02_Capacity_Planning/SRS.md` §11.

## Confirmed business decisions

- Mini Rally hierarchy: `Workspace -> Project -> Team`.
- Capacity Planning is Single Release only. Release Planning is deferred.
- Feature has no Plan Estimate; allocation is fixed and plan-specific.
- A Feature may split allocation across Teams. Allocation never writes back to `Feature.projectId`.
- Team-level Add Features attaches directly to a Team. Features-tab Add Feature is a second, user-approved entry point and creates an Unallocated row.
- Published plans are read-only until explicit Revert to Draft.

## Evidence and remaining UAT

- `npm.cmd run build` passed on 2026-07-27 (only Vite chunk-size warning).
- Browser visual smoke confirmed CP-001 > Features, `Add Feature`, and `Team Capacity` rail.
- A transient Vite HMR error appeared while JSX was being edited; the final build and reloaded DOM rendered correctly.
- Still test before proposing P5.2 close - **all five completed 2026-07-27, see the session log and `PHASE5_TEST_SCENARIOS.md` for evidence**:
  1. ~~Add Feature selection with a seed Feature not already in the Plan.~~ Done - `P5-CP-017` Pass.
  2. ~~Apply Capacity Forecast.~~ Done - `P5-CP-016` Pass.
  3. ~~Per-tab sort retention.~~ Done - `P5-CP-014` Pass.
  4. ~~Publish/Revert behavior.~~ Done - `P5-CP-010` Partial Pass; the defect it exposed (`P5-CP-DEF-001`) is fixed.
  5. ~~Workspace Admin / Project Admin / Project Member matrix.~~ Done - `P5-CP-011` Partial Pass; the branch that was not executable is now unblocked.

## Session log 2026-07-27 (Claude)

This session was picked up on a different machine after `git pull`, starting from HEAD `426731f`. It did two things: finished the five outstanding UAT items, then implemented six rounds of BA-directed business-rule changes on top. Tracker rows `P5-CAP-10` through `P5-CAP-16` carry the full detail; this section is the orientation a developer needs before editing.

### 1. Targeted UAT - all five closed

Two of the five were previously blocked, and both blockers were removed rather than skipped:

- "No eligible Feature outside the Plan" was solved by creating the precondition **through the product itself** (Portfolio Items > New Feature) instead of editing seed data. That way the real `Add Feature` path was exercised.
- Sort retention was initially **unfalsifiable**: the seeded capacities `13 / 10 / 8` make name-sort and capacity-sort produce identical row order. Core Platform capacity was lowered to `5` first so the two orders actually differ, then the assertion was made. If you re-run this test, do the same - otherwise a passing result proves nothing.

Read-only enforcement after Publish was verified against the accessibility tree, not screenshots, so "looks disabled" was never accepted as evidence.

### 2. Defects found and fixed in this session

| ID | What was wrong | Fix |
|---|---|---|
| `P5-CP-DEF-001` | Full `Publish` silently lost `plannedEndDate`. `publishCapacityPlan` wrote `release.releaseDate` (human-readable, e.g. `"Feb 1, 2025"`) into a field rendered as `<input type="date">`, which only accepts ISO `YYYY-MM-DD` and discarded it. Seeded Features already use ISO, so the writer was the wrong side. | Promoted the existing `toDateInputValue` helper from `IterationsPage.tsx` into `model.ts` and wrapped the write with it. `plannedStartDate` intentionally still carries the human-readable value because that field is free text per the P5.1 SRS. |
| `P5-CP-DEF-002` | The Teams-by-Total `Sort` control lived inside the `editable`-gated action bar, so every read-only viewer lost Team sorting while the Features tab kept its own sort. | The action bar always renders; only the two mutating buttons carry the `editable` gate. Sorting is a read action. |
| `P5-CP-DEF-003` | **Self-inflicted, caught during verification.** Widening the Team picker to all Project Features let a non-Release-matching Feature be added, but all five display lookups still resolved Features through `eligibleFeatures`, which excludes it - so the allocation counted toward the Team's `Features` total while its row silently vanished. Observed as `Features 3` with 2 rows. | All display lookups resolve against the full Feature list. `getPlanFeature` now carries a comment saying an eligibility-filtered list must never be passed to it. **If you add another Feature display, use the full list.** |

### 3. Business rules that changed - read before editing

1. **Graded Capacity Planner permission.** The Phase 4 role matrix in `Settings > Workspace > Roles & Permissions` now actually gates Capacity Planning. Previously it was display-only local state inside `SettingsPage`; it was lifted into `App.tsx` and is passed to both `SettingsPage` and `CapacityPlanningPage`. `Enabled` = planner Full, `Read-only` = planner View. Three separate permissions exist: `capacity_planning:create`, `:edit_plan`, `:publish`. `canManageCapacityPlan` requires **both** the matrix permission and Project scope. Workspace Admin's matrix column stays locked at `Enabled` by BA decision, which also preserves the safety property that an admin cannot lock itself out.
2. **Project Member only sees Published plans.** Enforced in both the list filter and the active-plan resolver, so a Draft plan is unreachable even through stale state.
3. **Team-level `Add Features` ignores Release.** It lists every Feature across the Project's Teams (`projectFeatures`), not the Release-filtered `eligibleFeatures`. It also keeps already-added Features visible, greyed, marked `Added`, instead of removing them. `eligibleFeatures` still drives the plan-level picker and the `Eligible` counter - the two are deliberately different and must not be merged.
4. **Allocation has exactly one editing surface.** The Allocate dialog. The inline Rollup input, the `Split` control and the whole `Unallocated Features in Plan` block were removed. `Remove from Team` was added to the row settings menu because the dialog cannot drop a Feature out of a plan - its apply is guarded by `valid.length > 0`, so clearing every row applies nothing. Without that menu item a planner who added a Feature by mistake would have been trapped.
5. **`Estimated` is now three-tier: Total Allocated > Refined > Preliminary.** Two guards matter:
   - The value offered as the **default when allocating** (`topDownEstimate`) uses only Refined > Preliminary. Folding Total Allocated back in would be circular - a blank Estimate field would commit the sum of the allocations that blank field exists to create. **Do not "simplify" these two functions into one.**
   - `featureEstimated` returns a `source` label (`ALLOCATED` / `REFINED` / `PRELIMINARY`) that the UI shows. The seeded numbers coincide across tiers (FE-318 is `8` under both Allocated and Refined; FE-315 is `5` under both Allocated and Preliminary), so **the label is the only thing that discriminates the tiers when testing**.
6. **`Allocation` and `Dependencies` columns** on the expanded Team Feature table. `Allocation` reads `From {Feature's own Team}` when the row's Team differs from `feature.team`, and `—` on the Feature's own Team row. `Dependencies` is a placeholder showing `—`; nothing is modelled behind it.

### 4. Layout debt introduced knowingly

Adding `Allocation` and `Dependencies` made the expanded Feature table nine columns wide. The identity block was already at its floor - measured `370px = 30 + 44 + 74 + 180 + 130`, with `Name` pinned at its `180px` minimum - so the columns could not fit beside the Team row. The table now scrolls horizontally inside `FEATURE_TABLE_MIN_WIDTH` (1180px). **Consequence:** the column-for-column alignment with the Team row that `P5-CAP-09` deliberately built now holds only until the table is scrolled. This was accepted in preference to crushing `Name`. If a future change needs that alignment back, the space has to come from somewhere else - the 240px progress-bar column and the empty 92px column are the two candidates.

### 5. Session-only test artifacts

State is in-memory, so nothing below survives a reload, but be aware if you inspect screenshots or re-run tests:

- `FE-323 "UAT Probe - Capacity Add Feature"` was created in NXP through the UI to unblock `P5-CP-017`.
- `REL-005 Mobile App MVP R1` was added to **seed data** (this one is permanent) so that a second Project has a Release. Without it the `MOB` Capacity Plan cannot be created and the Project-Admin-in-unmanaged-Project branch of `P5-CAP-AC-010` is untestable. It intentionally keeps the human-readable date convention so it also exercises the `P5-CP-DEF-001` fix.

## Open questions awaiting BA decision

These three block P5.2 sign-off. Each one is recorded because a reasonable implementation could go either way and the choice changes behavior a planner will notice - so it was not decided unilaterally. Defaults currently shipped are stated so a developer knows what happens if no decision arrives.

### Q1 - Is the Capacity Planner permission one switch or three?

**Currently shipped:** three independent matrix rows - `capacity_planning:create`, `:edit_plan`, `:publish`.

**Why the question exists.** The BA described the rule as a single planner level ("Full" vs "View"). The Phase 4 matrix is per-action, so it was implemented as three rows, which is finer-grained but means **"planner = View" is not a single toggle**. This was observed during verification: setting only `:edit_plan` and `:publish` to `Read-only` left the Project Admin still able to create new plans, because `:create` was untouched. A true view-only planner needs `create = Hidden`, `edit_plan = Read-only`, `publish = Read-only`.

**Decision needed.** Keep three rows (more expressive - allows "can create own plans but not edit others'"), or collapse to one `Capacity Planner` row with Full/View (matches how the BA phrased it, less room for misconfiguration).

### Q2 - Does `Total Allocated` include an Unallocated row?

**Currently shipped:** yes - every allocation row for the Feature counts, including one that has no Team yet.

**Why the question exists.** The reasoning for including it is that a planner who typed a number **has** estimated the Feature, even before choosing a Team; excluding it would drop `Estimated` back to a forecast despite a real number being present. But it makes `Total Allocated` **inconsistent with Team `Demand`**, which by design counts only Team-assigned rows. So the same plan can show an `Estimated` that no Team's `Demand` accounts for. Both behaviors are defensible; they cannot both be true.

**Decision needed.** Keep counting Unallocated rows (planner intent wins), or count only Team-assigned rows (internal consistency with `Demand` wins).

Note: the `Unallocated Features in Plan` block was removed in this session, so an unallocated row is now only visible in the `Features` tab via its `Not assigned` badge and in the plan header's `Unassigned` counter. That makes the inconsistency harder to spot in the UI, which is a reason to settle it rather than leave it.

### Q3 - Should the Team picker really exclude Archived and Cancelled Features?

**Currently shipped:** yes - excluded. `projectFeatures` filters `!feature.archivedAt && feature.status !== "Cancelled"`.

**Why the question exists.** The BA's instruction was "show **all** Features belonging to the teams of that project". Taken literally that includes Archived and Cancelled ones. They were excluded anyway because planning capacity against a dead record is not meaningful, and the existing SRS §10 already listed both as ineligible. That is an interpretation, not an instruction, so it is flagged rather than buried.

**Decision needed.** Confirm the exclusion, or widen the picker to literally every Project Feature.

## Important files

- `03_Mockup Design/src/app/pages/CapacityPlanningPage.tsx` - the whole feature. Key functions: `canManageCapacityPlan` (two-gate permission), `topDownEstimate` vs `featureEstimated` (do not merge - see session log §3.5), `getPlanFeature` (never pass a filtered list), `moveAllocationRank`, `applyFeatureAllocations`, `AddFeaturesModal`, `AllocateDialog`.
- `03_Mockup Design/src/app/App.tsx` - owns `permissionMatrix` state (lifted out of SettingsPage so the matrix gates other screens) and `publishCapacityPlan`.
- `03_Mockup Design/src/app/model.ts` - `toDateInputValue`, `PRELIMINARY_ESTIMATE_*_FALLBACK`, `CapacityPlan` types, `REL-005` seed.
- `03_Mockup Design/src/app/pages/SettingsPage.tsx` - `PROD_ROLE_ACTION_MATRIX` (the seven `portfolio_items:*` / `capacity_planning:*` rows), `permissionAllows`, and the intentionally locked `WA` column.
- `04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md` - business rules. §8 Allocate dialog, §9 expanded Team table incl. the new columns, §10 the two picker scopes, §11 the three-tier Estimated + Preliminary mapping table.
- `04_Developement_tracking/Phase 5/PHASE5_DEVELOPMENT_TRACKING.md` - `P5-CAP-10`..`P5-CAP-16` are this session; `P5-CAP-08` holds the closure gate.
- `07_Test Business/specs/PHASE5_TEST_SCENARIOS.md` - `P5-CP-014`, `-016`, `-017`, `-010`, `-011` evidence; `P5-CP-018`..`-025` new scenarios; `P5-CP-DEF-001`..`-003` defects.

## Local run

```powershell
Set-Location 'D:\Mini_Rally_pj\03_Mockup Design'
npm.cmd run dev -- --host 127.0.0.1 --port 4175
```

## Copy-paste continuation prompt for Claude

```text
Continue work in D:\Mini_Rally_pj. Read 04_Developement_tracking/Phase 5/P5_2_CAPACITY_PLANNING_MACHINE_HANDOFF.md in full - especially "Session log 2026-07-27 (Claude)" and "Open questions awaiting BA decision" - then 04_Developement_tracking/Phase 5/02_Capacity_Planning/SRS.md, 04_Developement_tracking/Phase 5/PHASE5_DEVELOPMENT_TRACKING.md (rows P5-CAP-10..P5-CAP-16), and 07_Test Business/specs/PHASE5_TEST_SCENARIOS.md before editing.

We are in Phase 5, P5.2 Capacity Planning. Do not close P5.2 or Phase 5. Ask the user for confirmation before any new business-rule/scope change. Do not stage/commit/push unless asked.

Targeted UAT is complete and no defect is open. Closure is blocked only by three BA decisions (Q1 planner permission granularity, Q2 whether Total Allocated counts Unallocated rows, Q3 whether the Team picker excludes Archived/Cancelled). If the user answers any of them, implement it, re-verify in the browser, and record it in the tracker and test pack.

Preserve these approved rules: Single Release only; Workspace -> Project -> Team; allocation is plan-specific and may split across Teams; allocation never changes Feature.projectId; Feature has no Plan Estimate; published plans are read-only until reverted; the role matrix in Settings > Workspace genuinely gates Capacity Planning and Workspace Admin's column stays locked at Enabled; Project Member sees Published plans only; allocation is edited only in the Allocate dialog; Estimated resolves Total Allocated > Refined > Preliminary while the allocate-time default stays Refined > Preliminary.

Two traps to avoid: never pass an eligibility-filtered Feature list to getPlanFeature (it silently hides allocations - that was P5-CP-DEF-003), and never merge topDownEstimate into featureEstimated (it makes a blank Estimate field circular).

When testing sort or estimate tiers, note the seed values coincide across tiers, so change a value first or read the source label - otherwise a pass proves nothing. Verify read-only states against the accessibility tree, not screenshots. Do not treat build or visual UI alone as phase acceptance.
```
