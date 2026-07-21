# Plan 2 — Core Component Library

## Goal

Create a token-bound reusable component library that screens can consume as instances.

## Checklist

- [x] P2.a Create action components: Button, Icon Button, Link action, overflow action.
  - [x] P2.a1 Button: 18 native variants; Label, Show Icon and Icon instance-swap properties; visual/structural QA passed.
  - [x] P2.a2 Icon Button: 27 native variants; Icon instance-swap property; visual/structural QA passed.
  - [x] P2.a3 Link Action: 6 native variants; Label, Show Icon and Icon instance-swap properties; visual/structural QA passed.
  - [x] P2.a4 Overflow action: reuse `Icon Button` with `Icon/MoreHorizontal` instance swap; no duplicate component created.
- [ ] P2.b Create form components: FormField, input, textarea, select/combobox, checkbox, radio and toggle.
  - [x] P2.b1 Text Input: 10 native variants; editable Value property; visual/structural QA passed after text-geometry correction.
  - [ ] P2.b2 Form Field: documentation and token-bound base with a Text Input instance created; variants, properties and QA remain.
  - [ ] P2.b3 Textarea, select/combobox, checkbox, radio and toggle.
- [ ] P2.c Create feedback/identity components: Alert, toast, tooltip, avatar, role/type/status/priority badges, progress.
- [ ] P2.d Create overlay components: dialog, destructive confirmation, dropdown/popover, drawer base.
- [ ] P2.e Define variants, text/boolean/instance-swap properties and state coverage.
- [ ] P2.f Document usage, accessibility and code/mockup source for each component.
- [ ] P2.g Validate metadata, bindings, variant matrix, screenshots and typography per component.
- [ ] P2.h Write `P2_COMPONENT_CATALOG.md` and `P2_VALIDATION.md`.

## Rules

- Build one component family at a time; no batch creation.
- Use instance swap for icons; do not create an icon-per-variant matrix.
- Split a component when variant combinations exceed a maintainable API.

## Exit criteria

- Each component has token bindings, documented API and validated states.
- No screen-only duplicate component is introduced.
- Component catalog maps every component to source code and intended screens.

## Gate

Set tracker to `AWAITING PLAN 2 CONFIRMATION`; stop until `CONFIRM PLAN 2`.
