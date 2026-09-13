# Feature Description — Split Unfinished User Story

## 0. Document control

| Attribute | Value |
|---|---|
| Feature code | `SU` |
| Feature name | Split Unfinished User Story |
| Product | Rova / Mini Rally |
| Phase | Phase 7 — After MVP |
| Status | Approved by BA; aligned with the approved clickable mockup |
| Updated | 2026-09-13 |
| Detailed rules | `SRS.md` in this folder |
| Delivery backlog | `USER_STORIES.md` in this folder |

## 1. Feature summary

Split Unfinished helps a team close the historical portion of an unfinished User Story in its current Iteration and continue the remaining work in a later Iteration without losing traceability.

The system creates a new `[Unfinished]` historical Story in the source Iteration and moves the original Story forward as `[Continued]`. The user decides how Tasks, related Defects and Test Cases are distributed. Reports show the change as Split/Carryover and do not treat the historical placeholder as delivered Velocity.

## 2. Business problem

At an Iteration boundary, a User Story may have completed and unfinished child work at the same time. Moving the whole Story forward loses the source Iteration's visible commitment. Copying it manually can duplicate Tasks, Test Cases, points, history or Actual hours.

The Feature must provide one controlled action that:

- preserves the source Iteration's historical commitment;
- keeps the original Story identity for continued delivery;
- moves unfinished work without recreating it;
- preserves Defect, Test Case and Result traceability;
- shows Split effects in Burndown, Velocity and Team Capacity;
- prevents double delivery credit.

## 3. Business outcomes

The Feature is successful when:

1. Users can split one eligible User Story through one guided flow.
2. The original Story ID and history continue in the target Iteration.
3. The source Iteration keeps a clearly labelled historical placeholder.
4. Child items move without losing their IDs, values or history.
5. Source and target reports show what moved without double-counting points or Actual hours.
6. A reviewer can trace both resulting Stories back to one Split Event.

No numerical KPI or SLA is defined for this Feature.

## 4. Personas and access

### 4.1 Split user

A user who already has permission to edit the selected User Story.

The user can:

- open the Split flow for an eligible Story;
- edit the allowed Story fields;
- distribute displayed child items;
- cancel or confirm the Split.

Split does not introduce a new role or a new permission. A user who cannot edit the Story cannot perform Split.

### 4.2 Report reader

A Workspace Admin or assigned-Project Admin who already has permission to open Reports under the Phase 6 permission model.

The reader can see Split/Carryover effects in Burndown, Velocity and Team Capacity. The reports remain read-only.

### 4.3 Delivery reviewer

A Product Owner, Business Analyst, Team Lead or QA reviewer who uses the Story links, revision history and report markers to understand why work crossed an Iteration boundary. This is a usage persona and does not grant additional system permission.

## 5. Scope

### 5.1 In scope

- Split entry points from User Story Detail and Iteration Status.
- Eligibility and target-Iteration validation.
- Two-panel Split modal.
- New `[Unfinished]` Story and moved `[Continued]` Story.
- Independent Plan Estimate editing for both resulting Stories.
- Task, related Defect and Test Case distribution.
- Preservation of Task effort and historical Test Results.
- Split Event, Story links and revision traceability.
- Split/Carryover representation in Iteration Burndown.
- Split/Carryover exclusion and representation in Velocity.
- Estimate, To Do and Actual attribution in Team Capacity.

### 5.2 Out of scope

- Automatic Carryover without a user-initiated Split.
- Start Date and End Date fields for User Story or Task.
- Automatic movement when an End Date exceeds an Iteration boundary.
- Bulk Split of multiple Stories.
- Splitting a Defect, Task or Test Case as the primary Work Item.
- Changing the general Project, Team, Iteration or Report permission models.
- Production migration, API and physical database design.

## 6. Business identity model

| Object | Identity after Split | Iteration | Business purpose |
|---|---|---|---|
| Original Story before Split | Existing User Story ID | Source | Input to the action |
| `[Unfinished]` | New User Story ID | Source | Historical placeholder for unfinished commitment |
| `[Continued]` | Original User Story ID | Target | Remaining delivery scope |
| Split Event | New auditable event ID | Source + Target reference | Connects all before/after values |

The original identity follows `[Continued]`. `[Unfinished]` is not the new delivery item and must never receive Velocity delivery credit.

## 7. End-to-end user journey

### Stage 1 — Recognize unfinished work

The user reviews an active User Story in Iteration Status or User Story Detail and decides that part of its scope must continue in a later Iteration.

Expected experience:

- Split is available only for a Story the user can edit.
- If the Story is not eligible, the Split action is disabled without an additional message.

### Stage 2 — Open and understand the Split

The user opens the Split modal and sees two panels:

- left: the new historical `[Unfinished]` Story staying in the source;
- right: the original `[Continued]` Story moving forward.

Expected experience:

- the panel headings identify `[Unfinished]` as the new historical Story and `[Continued]` as the original Story;
- the default field values are already populated;
- the source and target Iterations are visible before confirmation.

### Stage 3 — Review Story values

The user reviews the two names, target Iteration, states and Plan Estimates.

Expected experience:

- `[Unfinished]` Release is `Unscheduled` and State is `Accepted`; both are read-only;
- both Plan Estimate fields initially equal the original Plan Estimate and are independently editable;
- a point difference is visible but does not block the action.

### Stage 4 — Distribute related work

The user reviews Tasks, Defects and Test Cases and moves rows between panels when the defaults are not correct.

Expected experience:

- Completed Tasks default left;
- non-Completed Tasks, Defects and Test Cases default right;
- Task effort values remain visible and unchanged;
- a Defect's explicit Iteration is shown inline in its row and is not changed by Split;
- historical Test Result Work Products are not rewritten.

### Stage 5 — Confirm or cancel

The user either confirms `Split story` or exits with Cancel, `×` or Escape.

Expected experience:

- cancel leaves all data unchanged;
- invalid required values put the affected field in an invalid state and disable `Split story`;
- a valid confirmation applies the complete Split once.

### Stage 6 — Continue delivery

After success, the original Story opens as `[Continued]` in the target Iteration. A banner links both resulting Stories.

Expected experience:

- the user can move between both Story Details;
- each Story shows the correct child items and rollups;
- revision history shows the relationship changes.

### Stage 7 — Review Iteration impact

Report readers inspect the source and target Iterations.

Expected experience:

- Burndown shows `SPLIT OUT` in the source and `CARRY IN` in the target;
- Velocity shows `[Unfinished]` points separately and excludes them from trend/averages;
- Team Capacity retains pre-Split Actual in the source and counts only post-Split Actual in the target.

## 8. User flows

### 8.1 Primary flow

```text
Open eligible Story
→ Select Split
→ Review [Unfinished] and [Continued] fields
→ Distribute Tasks, Defects and Test Cases
→ Review child rows and point comparison
→ Select Split story
→ Open [Continued] Story
→ Navigate between linked Stories
→ Review source/target reports
```

### 8.2 Ineligible Story flow

```text
View a Split entry point
→ System evaluates type, state, Iteration, target availability and edit permission
→ Split action is disabled
→ No data changes
```

### 8.3 Validation flow

```text
Edit an allowed field
→ Field value becomes invalid
→ Field shows its invalid state
→ Split story is disabled
→ Modal stays open
→ Existing data remains unchanged
```

### 8.4 Non-blocking context flow

```text
Combined points differ from original
OR Defect Iteration differs from its selected Story side
→ Footer shows the point comparison
OR Defect row shows its explicit Iteration
→ Split story remains available when all required fields are valid
```

### 8.5 Cancel flow

```text
Open Split modal
→ Edit fields or move rows
→ Select Cancel, × or Escape
→ Modal closes
→ No Split Event or data change is created
```

## 9. Business rules

### 9.1 Eligibility and target rules

| ID | Rule |
|---|---|
| SU-BR-01 | Only a User Story can be the primary item of a Split. |
| SU-BR-02 | The Story must not be in Completed, Accepted or Release. |
| SU-BR-03 | The Story must be assigned to a Source Iteration. |
| SU-BR-04 | The user must already have permission to edit the Story. |
| SU-BR-05 | A Target Iteration must be later than the Source Iteration, in the same Project and Team, and not Accepted. |
| SU-BR-06 | The earliest valid Target Iteration is selected by default. |

### 9.2 Resulting Story rules

| ID | Rule |
|---|---|
| SU-BR-07 | `[Unfinished]` receives a new system-generated User Story ID. |
| SU-BR-08 | `[Continued]` retains the original User Story ID and history. |
| SU-BR-09 | `[Unfinished]` stays in the Source Iteration, becomes Accepted and uses the Split timestamp as acceptedDate. |
| SU-BR-10 | `[Unfinished]` has Unscheduled Release and no Feature or parent Portfolio scope. |
| SU-BR-11 | `[Continued]` moves to the selected Target Iteration and retains the original Project, Team, Feature and Release unless an editable field is changed. |
| SU-BR-12 | Both Plan Estimates default to the original Plan Estimate and remain independently editable. |
| SU-BR-13 | The footer shows original points, combined points and the difference; a difference never blocks Split. |

### 9.3 Related-item rules

| ID | Rule |
|---|---|
| SU-BR-14 | Completed Tasks default to `[Unfinished]`; all other Tasks default to `[Continued]`. |
| SU-BR-15 | Related Defects and linked Test Cases default to `[Continued]`. |
| SU-BR-16 | A user may move any displayed related item to either Story before saving. |
| SU-BR-17 | Task ID, State, Estimate, To Do, Actual, Owner and history remain unchanged; only the parent changes. |
| SU-BR-18 | A Defect's explicit Iteration is shown inline and remains unchanged when its Parent Story changes. |
| SU-BR-19 | A Test Case keeps its ID/content/history; its current Work Product changes to the selected Story. |
| SU-BR-20 | Historical Results retain their captured read-only Work Product. |

### 9.4 Report rules

| ID | Rule |
|---|---|
| SU-BR-21 | `[Unfinished]` is reported as Split/Carryover and never earns Velocity delivery credit. |
| SU-BR-22 | `[Continued]` earns delivery credit only when it later satisfies the normal acceptance rule in the Target Iteration. |
| SU-BR-23 | Source Burndown removes moved To Do from the Split date forward and shows `SPLIT OUT`. |
| SU-BR-24 | Target Burndown adds moved To Do on the Split date or at Iteration opening and shows `CARRY IN`. |
| SU-BR-25 | A finalized Burndown snapshot and an already captured Ideal baseline are not rewritten. |
| SU-BR-26 | Velocity displays `[Unfinished]` points in a separate excluded segment and excludes them from trend and averages. |
| SU-BR-27 | Capacity is unchanged by Split; Task Estimate and To Do follow each Task's resulting Iteration scope. |
| SU-BR-28 | Source Actual retains work recorded before Split; Target Actual counts only work added after Split. |

### 9.5 Traceability rules

| ID | Rule |
|---|---|
| SU-BR-29 | One Split Event connects the before/after Story values, Iterations, child distribution and effort snapshot. |
| SU-BR-30 | Both resulting Story Details show links to each other. |
| SU-BR-31 | Revision history makes every relationship change traceable. |
| SU-BR-32 | Cancel or validation failure creates no Split Event and changes no saved item. |

## 10. Data behavior summary

| Data | `[Unfinished]` / Source | `[Continued]` / Target |
|---|---|---|
| Story ID | New | Original |
| Story history | New history plus Split link | Original history retained |
| Plan Estimate default | Original points | Original points |
| Velocity credit | Never | Normal acceptance rule |
| Task Estimate | Sum of Tasks assigned left | Sum of Tasks assigned right |
| Task To Do | Sum of Tasks assigned left | Sum of Tasks assigned right |
| Task Detail Actual | Full Task accumulated value | Full Task accumulated value |
| Report Actual | Pre-Split Actual retained | Post-Split Actual delta only |
| Feature/Release | Cleared / Unscheduled | Retained unless edited |
| Test Result history | Preserved | Preserved |

Estimate, To Do and Actual are independent persisted measures. Split does not calculate one from another.

## 11. Interaction feedback contract

The approved experience uses control state and compact data context instead of explanatory messages.

| Condition | Approved UI behavior |
|---|---|
| Selected item is not an eligible editable User Story | Disable the Split action; do not show a reason, banner or toast. |
| Name or Plan Estimate is invalid | Mark only the affected field invalid and disable `Split story`; do not add validation text. |
| Combined points differ from the original | Show `Original → Combined (Difference)` in the modal footer; do not show a warning message. |
| Defect has an explicit Iteration | Show `Explicit: {Iteration}` inline in the Defect row; do not show a warning message. |
| Split succeeds | Show a compact `Split · Source → Target` bar with links to `[Unfinished]` and `[Continued]`. |
| Reports contain Split data | Use compact `SPLIT OUT`, `CARRY IN` and `Split / Carryover (excluded)` markers or legend labels with the related values. |

This Feature adds no toast, explanatory alert, email, browser notification or external message.

## 12. Dependencies and delivery boundary

### Functional dependencies

- User Story Detail and Iteration Status.
- User Story edit permission.
- Project/Team Iteration catalogue and state.
- Task parent and effort fields.
- Defect Parent Story and explicit Iteration behavior.
- Phase 7 Test Case and Result model.
- Phase 6 Burndown, Velocity and Team Capacity rules.
- Audit/revision history.

### Delivery boundary

The Feature is not complete when only the modal is delivered. Completion requires the saved Split relationship, child-item behavior, audit/navigation and all three approved report effects.

## 13. References

- `SRS.md` — detailed functional and reporting rules.
- `USER_STORIES.md` — delivery slices and Acceptance Criteria.
- `03_Mockup Design/src/app/components/SplitStoryDialog.tsx` — Split modal.
- `03_Mockup Design/src/app/splitStory.ts` — Split behavior and prototype event.
- `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx` — entry point and Story links.
- `03_Mockup Design/src/app/pages/IterationStatusPage.tsx` — Iteration Status entry point.
- `03_Mockup Design/src/app/pages/ReportsPage.tsx` — Burndown and Velocity presentation.

--
