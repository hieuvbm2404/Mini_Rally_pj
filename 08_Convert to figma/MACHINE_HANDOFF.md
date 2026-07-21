# Machine Handoff — Mini Rally Convert to Figma

## Resume source of truth

1. Read `AI_EXECUTION_WORKFLOW.md`.
2. Read `CONVERSION_PROGRESS.md`.
3. Read `P2_Core_Component_Library/PLAN.md`, `P2_PROGRESS.md` and `P2_FIGMA_STATE_LEDGER.json`.
4. Continue the active plan without asking for a plan confirmation. Ask only when Plan 2 is review-ready.

## Target Figma file

- File: [Mini Rally Figma](https://www.figma.com/design/ttpggMpbPwggOZl6umowzC/Mini_Rally_Figma?node-id=0-1&m=dev)
- File key: `ttpggMpbPwggOZl6umowzC`
- Required skills for every Figma write: `figma-use`, `figma-generate-library`.
- Figma mutations must run sequentially. Return every mutated/created node ID. Use `setSharedPluginData('dsb', ...)` and the ledger.

## Current status: P2 in progress

Completed and QA-passed native component sets:

| Family | Figma node | API |
|---|---:|---|
| Button | `15:20` | 18 variants; Label, Show Icon, Icon swap |
| Icon Button | `20:101` | 27 variants; Icon swap; preferred ChevronRight + MoreHorizontal |
| Link Action | `21:76` | 6 variants; Label, Show Icon, Icon swap |
| Text Input | `24:79` | 10 variants; Value property |

Reusable local icons: ChevronRight `11:6`, Plus `11:9`, X `11:12`, MoreHorizontal `23:6`.

## Exact resume point

Form Field is **partially built only**:

- Page `Form Field`: `24:2`
- Documentation frame: `27:2`
- Native base component: `28:2`
- Semantic base children: header `28:3`, label `28:4`, required `28:5`, Text Input instance `control` `28:6`, supporting text `28:8`.

Next sequence:

1. Clone base `28:2` for `State=Default`, `State=Error`, `State=Disabled`; set nested Text Input main component to Default/Error/Disabled variants respectively (`24:8`, `24:75`, `24:77`).
2. Combine to `Form Field` component set; lay out state columns; add documentation labels.
3. Add `Label` TEXT, `Supporting Text` TEXT, `Required` BOOLEAN properties and link child nodes.
4. Structural audit + screenshot. Do not build the next component unless Form Field QA passes.
5. Then continue P2.b3: Textarea, Select/Combobox, Checkbox, Radio, Toggle.

## Known correction already resolved

Text Input initially showed an ellipsis because text width was zero under `TRUNCATE + FILL`. It was fixed by sizing the text regions explicitly: 284px for Small, 276px for Medium. Preserve this pattern when cloning or extending Text Input.

## Copy-paste prompt for the new machine

```text
Continue Mini Rally Figma conversion from D:\Mini_Rally_pj. Read 08_Convert to figma\MACHINE_HANDOFF.md first, then AI_EXECUTION_WORKFLOW.md, CONVERSION_PROGRESS.md, and P2_Core_Component_Library\P2_FIGMA_STATE_LEDGER.json. Connect to file key ttpggMpbPwggOZl6umowzC and resume P2.b2 Form Field at base node 28:2. Use figma-use + figma-generate-library; work sequentially, validate each component, and stop only at the Plan 2 confirmation gate.
```
