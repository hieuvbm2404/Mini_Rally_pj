# Future Backlog — Portfolio / Release Planning

## Status

**DEFERRED TO PHASE 5 — BA confirmation required when Phase 5 starts.**

> **2026-07-25 naming note:** Phase 5 is now scoped as the Portfolio module (Rally-aligned: Portfolio Items, Release Planning, Capacity Planning, Release Tracking — see `../Phase 5/PHASE5_DEVELOPMENT_TRACKING.md`). Everything on this page (progress %, zero-state, formulas) is actually **Release Tracking** in that model, not Release Planning — Release Planning is the separate act of assigning Features to a Release. This file's content maps to task **P5-RT-01..04**; kept here unmodified for history, do not edit further — continue in the Phase 5 tracker.

## Navigation direction

- Remove `Releases` from top-level navigation.
- `Portfolio` opens a dropdown menu.
- Dropdown contains `Release Planning`.
- Phase 3 Release management remains at `Plan > Timeboxes > Releases`.
- Release Planning must not become a second Release create/edit source without a new Phase 5 decision.

## Deferred scope

- Release tracking dashboard.
- Release progress percentage and progress bar.
- Empty Release / 0% presentation.
- Release progress formula and fallback behavior.
- Recalculation after Work Item state, Plan Estimate or Release assignment changes.
- Historical progress/trend views.
- Release-level filtering, saved views and reporting.

## Preliminary business inputs

These inputs were accepted during Phase 0-4 reconciliation but must be reviewed again with the complete Phase 5 scope:

- Release Tracking reads only US/DE assigned to the selected Release.
- US/DE in Schedule/Flow State `Accepted` or `Release` is considered completed for Release Tracking.
- Current mock percentages are not a source of truth. Example: Q1 mock shows 12% while its stored `5/38` values do not calculate to 12%.

## Explicit Phase 0-4 exclusion

- Do not add a Progress column to `Plan > Timeboxes > Releases`.
- Do not add a Release Progress widget to the Phase 3 Release Detail.
- Phase 3 keeps Release artifacts, Accepted total and task roll-up requirements already documented.

## Questions for Phase 5

1. Should progress use completed Plan Estimate or completed item count?
2. If some items have estimates and others have zero, how are unestimated items represented?
3. What exact zero-state is shown for an empty Release?
4. Does reaching 100% trigger any Release status suggestion or automation?
5. Which filters, charts and historical snapshots belong to Release Planning?
