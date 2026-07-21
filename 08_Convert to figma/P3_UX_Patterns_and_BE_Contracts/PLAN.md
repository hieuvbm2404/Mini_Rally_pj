# Plan 3 — UX Patterns and BE Contracts

## Goal

Normalize data-heavy/RBAC UX patterns and attach a usable UI/API contract before screen conversion.

## Checklist

- [ ] P3.a Build App Shell, TopNav, breadcrumbs and project/team context pattern from approved components.
- [ ] P3.b Build DataTable, sortable/resizable header, row action, selection and bulk-action patterns.
- [ ] P3.c Build search/filter/saved-view/pagination query-control pattern.
- [ ] P3.d Build work-item drawer/detail, activity, relation and progress patterns.
- [ ] P3.e Build system states: skeleton, empty, API error/retry, forbidden, not-found and destructive confirmation.
- [ ] P3.f Define RBAC pattern: hidden, disabled, read-only and denied outcomes.
- [ ] P3.g Write one UI/API contract per pattern: context, read model, enums, actions, query/mutation states, authorization and navigation.
- [ ] P3.h Prototype Backlog → Work Item Detail → create/edit/error/permission pilot.
- [ ] P3.i Validate screen/pattern reuse, prototype and contract completeness.

## Deliverables

- Figma pages for data/navigation/feedback patterns and App Shell.
- `P3_UI_API_CONTRACTS.md`, `P3_RBAC_AND_SYSTEM_STATES.md`, `P3_PILOT_VALIDATION.md`.

## Exit criteria

- Developers can see what data a component consumes and how it behaves for every server state.
- Table/filter/modal/status are reusable patterns, not copied screen fragments.
- Pilot flow has visual, state and contract evidence.

## Gate

Set tracker to `AWAITING PLAN 3 CONFIRMATION`; stop until `CONFIRM PLAN 3`.

