# Phase 7 (After MVP) — Split Unfinished User Story SRS

## 0. Document control

| Attribute | Value |
|---|---|
| Status | Approved by BA for DEV breakdown |
| Version | 1.1 |
| Updated | 2026-09-13 |
| Phase | Phase 7 — After MVP |
| Feature | Split Unfinished User Story |
| Product | Rova / Mini Rally |
| Functional source of truth | Approved clickable mockup in `03_Mockup Design` and the rules in this SRS |
| Production status | Mockup only; not production-verified |

This document specifies only **Split Unfinished**. Automatic Carryover and the Start Date/End Date feature are separate scope and are not defined here.

## 1. Purpose and outcome

Split Unfinished allows an unfinished User Story to retain a historical record in its current Iteration while the remaining work continues in a later Iteration.

After a successful Split:

- a new `[Unfinished]` Story remains in the source Iteration as the historical placeholder;
- the original Story becomes `[Continued]`, keeps its ID/history and moves to the target Iteration;
- Tasks, related Defects and Test Cases are assigned to one of the two resulting Stories;
- Task effort values and Test Result history are preserved;
- reports show Split/Carryover explicitly without counting the historical placeholder as delivered Velocity.

## 2. Terms

| Term | Meaning |
|---|---|
| Original Story | The User Story before Split |
| `[Unfinished]` Story | The new historical Story created in the source Iteration |
| `[Continued]` Story | The original Story after it moves to the target Iteration |
| Source Iteration | The Iteration assigned to the Original Story before Split |
| Target Iteration | A later open Iteration in the same Project and Team |
| Split Event | The auditable record connecting the original, `[Unfinished]` and `[Continued]` values |
| Delivery credit | Points included in Velocity trend and average calculations |

## 3. Eligibility and permission

Split is available only when all rules below are satisfied:

1. The selected Work Item is a User Story.
2. The Story is not in `Completed`, `Accepted` or `Release` state.
3. The Story is assigned to an Iteration.
4. At least one later Iteration exists in the same Project and Team and that Iteration is not `Accepted`.
5. The current user already has permission to edit the Story. Split introduces no separate permission.

If any rule fails, the relevant Split entry action is disabled. The UI does not add a reason, banner or toast.

## 4. Entry points

The same Split modal opens from either approved entry point:

```text
Iteration Status → select one User Story → Split
```

```text
User Story Detail → More work item actions → Split unfinished story
```

## 5. Split modal

The modal has two side-by-side Story panels. Each panel contains Story fields plus Tasks, Defects and Test Cases. A row can be moved between panels by drag-and-drop or its direction arrow.

### 5.1 `[Unfinished]` — new historical Story

| Field | Default | Editable |
|---|---|---|
| ID | New system-generated User Story ID | No |
| Name | `[Unfinished] {Original Story name}` | Yes |
| Release | `Unscheduled` | No |
| Iteration | Source Iteration | No |
| Schedule State | `Accepted` | No |
| Plan Estimate | Original Story Plan Estimate | Yes |

Additional relationship rules:

- Project and Team remain the same as the Original Story.
- Feature, Release and parent Portfolio scope are cleared.
- `acceptedDate` is the Split timestamp.
- The Story is classified as `Split / Carryover` for reporting even though its Schedule State is `Accepted`.

### 5.2 `[Continued]` — original Story moved forward

| Field | Default | Editable |
|---|---|---|
| ID | Original Story ID | No |
| Name | `[Continued] {Original Story name}` | Yes |
| Release | Original Story Release | Yes |
| Iteration | Earliest valid later Iteration | Yes, from valid target Iterations |
| Schedule State | Original Story state | Yes |
| Plan Estimate | Original Story Plan Estimate | Yes |

The `[Continued]` Story keeps the original Project, Team, Feature, Release, content, attachments, comments, audit history and other relationships unless a field is explicitly changed in the modal.

### 5.3 Plan Estimate comparison

The two Plan Estimate values are independent and do not need to add back to the original value.

The footer displays:

```text
Original points → combined points after Split (difference)
```

A difference is shown only as the numeric comparison in the footer. It does not block Split and does not produce a warning message.

## 6. Related-item distribution

### 6.1 Default distribution

| Collection | `[Unfinished]` default | `[Continued]` default |
|---|---|---|
| Tasks | Tasks in `Completed` state | Tasks not in `Completed` state |
| Related Defects | None | All related Defects |
| Test Cases | None | All linked Test Cases |

The user may move any displayed Task, Defect or Test Case to the other panel before saving.

### 6.2 Displayed columns

| Collection | Columns |
|---|---|
| Tasks | ID, Name, State, To Do, move action |
| Defects | ID, Name, State, Priority, move action |
| Test Cases | ID, Name, Type, Last Verdict, move action |

If a Defect has an explicitly assigned Iteration, its row also identifies that Iteration.

## 7. Split processing

When `Split story` is selected:

1. Create the new `[Unfinished]` Story in the Source Iteration.
2. Update the original Story with the `[Continued]` values and move it to the Target Iteration.
3. Change each Task parent to the Story panel selected in the modal.
4. Change each related Defect parent to the Story panel selected in the modal.
5. Change each Test Case Work Product to the Story panel selected in the modal.
6. Recalculate Story child counts and Task rollups.
7. Save one Split Event connecting both resulting Stories and the before/after values.
8. Close the modal and open the `[Continued]` Story Detail.
9. Show a compact Split bar with Source → Target and links to both Stories.

`Cancel`, `×` or `Escape` closes the modal without applying the Split.

## 8. Child-item and history rules

### 8.1 Tasks

- Split changes only the Task parent.
- Task ID, Name, State, Estimate, To Do, Actual, Owner and Task history remain unchanged.
- Estimate, To Do and Actual are persisted and aggregated independently.
- A Task moved to `[Continued]` is not recreated and its accumulated Actual is not reset on Task Detail.
- Each resulting Story recalculates Task count, Completed Task count, Task Estimate and Task To Do from its assigned Tasks.

### 8.2 Defects

- Split changes the related Defect's Parent Story according to the selected panel.
- An explicitly assigned Defect Iteration is not overwritten.
- A Defect without an explicit Iteration follows its Parent Story's Iteration context.
- Show an explicit Defect Iteration inline in the Defect row; a mismatch does not block Split and does not produce a warning message.

### 8.3 Test Cases and Results

- Split changes the Test Case Work Product according to the selected panel.
- Test Case ID, content and history remain unchanged.
- Existing Results retain the read-only Work Product captured when each Result was created.
- A new Result created after Split captures the Test Case's current Work Product.
- Last Verdict and Last Run continue to use the newest Result of that Test Case.

## 9. Effort attribution

### 9.1 Plan Estimate

- `[Unfinished]` initially retains the Original Story Plan Estimate to show the source Iteration's historical commitment.
- `[Continued]` initially retains the same Plan Estimate and may be re-estimated for the remaining scope.
- The two resulting Story estimates are independent.
- `[Unfinished]` points never earn delivery credit.
- `[Continued]` points earn delivery credit only when that Story satisfies the normal acceptance rule in its Target Iteration.

### 9.2 Task Estimate and To Do

- Task Estimate and To Do stay with the Task selected for each panel.
- Source and Target Story rollups are recalculated from their assigned Tasks.
- No effort value is derived from another effort value.

### 9.3 Task Actual

- Task Detail continues to show the Task's full accumulated Actual.
- For Iteration report attribution, Actual recorded up to the Split timestamp belongs to the Source Iteration.
- For a Task moved to `[Continued]`, the Target Iteration counts only Actual added after the Split timestamp.
- A Task left with `[Unfinished]` remains fully attributed to the Source Iteration.

## 10. Report behavior

The rules in this section are approved Split-specific exceptions to the general Phase 6 report classification.

### 10.1 Required Split Event data

The report layer must be able to identify at least:

```text
Split Event
- split timestamp
- Project and Team
- source and target Iteration IDs
- original, Unfinished and Continued Story IDs
- original, Unfinished and Continued Plan Estimate
- Task IDs and selected Story side
- per-Task Estimate, To Do and Actual captured at Split
- related Defect IDs and selected Story side
- Test Case IDs and selected Story side
```

Stable IDs, not display names, are used for report attribution.

### 10.2 Source Iteration Burndown

- Existing finalized daily snapshots before Split remain unchanged.
- On and after the Split date, To Do moved to `[Continued]` is removed from the Source Iteration's remaining To Do.
- Show compact amber `SPLIT OUT` context with the `[Unfinished]` ID, points, moved To Do and Actual retained by the source.
- The `[Unfinished]` Story is displayed as `Split / Carryover`; its auto-Accepted state does **not** add to the green `Accepted Points` series.
- The Source Iteration Ideal line remains frozen from its Iteration-start Task Estimate baseline.

### 10.3 Target Iteration Burndown

- Show compact amber `CARRY IN` context with the `[Continued]` ID, points, incoming To Do and `0h` opening Actual.
- To Do of Tasks moved to `[Continued]` is added to the Target Iteration on the Split date, or to its opening value when Split occurs before the Target Iteration starts.
- If Split occurs before the Target Iteration baseline is captured, moved Task Estimate is included in that baseline.
- If the Target Iteration baseline was already captured, its Ideal line remains unchanged.
- Target Iteration Actual starts at `0h` for the moved work and increases only from Actual added after Split.
- Accepted Points increase only when the `[Continued]` Story later satisfies the normal Accepted/Release rule.

### 10.4 Velocity

For the Source Iteration, `[Unfinished]` Plan Estimate appears as a separate amber `Split / Carryover (excluded)` segment.

It is excluded from:

- Accepted During Iteration;
- Accepted After Iteration;
- Not Accepted;
- Trend;
- Last 3, Best 3 and Worst 3 averages.

Only the `[Continued]` Story can earn delivery credit. It is classified in the Target Iteration using the normal accepted-date rule.

The Split-aware bar invariant is:

```text
acceptedDuring + acceptedAfter + notAccepted + splitCarryover
= points of all displayed Story/Defect items in the Iteration
```

### 10.5 Team Capacity

- Capacity hours do not change because of Split.
- Task Estimate and To Do follow the Task's selected Story and therefore its resulting Iteration scope.
- Source Actual includes Actual captured before Split, including the pre-Split Actual of Tasks moved to `[Continued]`.
- Target Actual includes only the post-Split Actual delta of moved Tasks.
- All member and `Unassigned` grouping rules from the Team Capacity SRS remain unchanged.

## 11. Split banner and audit

After Split, both Story Detail pages show a compact bar containing Source Iteration → Target Iteration and links to `[Unfinished]` and `[Continued]`.

The Split Event and each affected item's revision history must make the relationship change traceable. Historical Results must not be rewritten.

## 12. Validation and interaction states

| Condition | Result |
|---|---|
| Name is blank | Mark the field invalid and disable `Split story`; show no validation text |
| Plan Estimate is negative or invalid | Mark the field invalid and disable `Split story`; show no validation text |
| No valid Target Iteration is available | Disable the Split entry action |
| Target Iteration selector | List only later, same-Project, same-Team and non-Accepted Iterations |
| Combined points differ from original | Update the numeric footer comparison; do not block Split or show a warning message |
| Defect has an explicit Iteration | Show it inline as `Explicit: {Iteration}`; preserve it and do not show a warning message |

## 13. Acceptance Criteria

1. **Given** an editable unfinished User Story assigned to an Iteration, **when** Split is selected, **then** the two-panel Split modal opens.
2. **Given** a non-Story, unscheduled Story, Story in Completed/Accepted/Release, no valid target or no edit permission, **when** Split eligibility is evaluated, **then** the Split action is disabled without an explanatory message.
3. **Given** the modal opens, **then** `[Unfinished]` is a new ID in the Source Iteration with `Unscheduled` Release, no Feature/parent scope, `Accepted` state and the original Plan Estimate.
4. **Given** the modal opens, **then** `[Continued]` keeps the original ID/history and defaults to the earliest valid later Iteration with the original state, Release and Plan Estimate.
5. **Given** both Plan Estimate fields, **when** either value is changed, **then** the combined-point difference is recalculated and does not block Split.
6. **Given** the initial distribution, **then** Completed Tasks are under `[Unfinished]`, while non-Completed Tasks, all related Defects and all Test Cases are under `[Continued]`.
7. **Given** a Task, Defect or Test Case, **when** it is dragged or its direction arrow is selected, **then** it moves to the opposite Story panel.
8. **Given** a valid Split, **when** `Split story` is selected, **then** the new `[Unfinished]` Story is created and the original `[Continued]` Story moves to the Target Iteration.
9. **Given** distributed Tasks, **when** Split completes, **then** their IDs and independent Estimate, To Do and Actual values remain unchanged and their parents match the selected panels.
10. **Given** a Defect with an explicit Iteration, **when** its Story side changes, **then** its Parent Story changes but its explicit Iteration remains unchanged.
11. **Given** a Test Case with historical Results, **when** its Work Product changes during Split, **then** historical Result Work Products remain unchanged and read-only.
12. **Given** a completed Split, **then** both resulting Story Details show links to each other in the Split banner.
13. **Given** the Source Burndown, **when** Split occurs, **then** moved To Do is removed from the Split date forward and an amber `SPLIT OUT` marker is shown without awarding Accepted Points for `[Unfinished]`.
14. **Given** the Target Burndown, **when** work is carried in, **then** an amber `CARRY IN` marker and moved To Do are shown, while post-Split Actual starts from zero.
15. **Given** the Velocity report, **then** `[Unfinished]` points appear only in `Split / Carryover (excluded)` and do not affect delivery credit, trend or averages.
16. **Given** `[Continued]` is later accepted, **then** its points are classified in the Target Iteration by the normal accepted-date rule.
17. **Given** Team Capacity after Split, **then** Estimate and To Do follow the Tasks, Source Actual retains pre-Split work, and Target Actual contains only post-Split work.
18. **Given** the modal is open, **when** Cancel, `×` or `Escape` is used, **then** no Split changes are applied.

## 14. Mockup mapping

| Mockup area | Source |
|---|---|
| Split eligibility, processing and Split Event | `03_Mockup Design/src/app/splitStory.ts` |
| Split modal and field defaults | `03_Mockup Design/src/app/components/SplitStoryDialog.tsx` |
| Story Detail Split entry point and banner | `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx` |
| Iteration Status Split entry point | `03_Mockup Design/src/app/pages/IterationStatusPage.tsx` |
| Burndown and Velocity Split indicators | `03_Mockup Design/src/app/pages/ReportsPage.tsx` |
| Shared Work Item, Task, Test Case and Result state | `03_Mockup Design/src/app/App.tsx`, `model.ts` |

The clickable mockup uses local in-memory data. It demonstrates the approved interaction and reporting presentation but does not prove API persistence, database migration or production authorization.

## 15. Related specifications

- `04_Developement_tracking/Phase 1/04_Task_Management/SRS.md`
- `04_Developement_tracking/Phase 1/05_Time_Tracking/SRS.md`
- `04_Developement_tracking/Phase 2/03_Iteration_Status/SRS.md`
- `04_Developement_tracking/Phase 6/02_Iteration_Burndown/SRS.md`
- `04_Developement_tracking/Phase 6/03_Velocity_Chart/SRS.md`
- `04_Developement_tracking/Phase 6/04_Team_Capacity/SRS.md`
- `04_Developement_tracking/Phase 7 (After MVP)/Test Case/SRS.md`
- Broadcom Rally: [Splitting a User Story creates a new Story in the current Iteration and moves the original User Story to the next iteration](https://knowledge.broadcom.com/external/article/232813/)
- Broadcom Rally: [How to edit the test results for the correct work product](https://knowledge.broadcom.com/external/article/278314/)

## 16. Out of scope

- Automatic Carryover without a user-initiated Split.
- Start Date and End Date fields for User Story or Task.
- Automatic detection based on End Date exceeding the Iteration boundary.
- Bulk Split of multiple Stories.
- Splitting Defects, Tasks or Test Cases as the primary Work Item.
