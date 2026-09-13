# Split Unfinished — User Stories and Acceptance Criteria

## 0. Document control

| Attribute | Value |
|---|---|
| Feature | Split Unfinished User Story (`SU`) |
| Product | Rova / Mini Rally |
| Phase | Phase 7 — After MVP |
| Status | Approved by BA; aligned with Feature, SRS and clickable mockup |
| Updated | 2026-09-13 |
| Feature description | `FEATURE.md` in this folder |
| Detailed specification | `SRS.md` in this folder |

The IDs in this document are local analysis IDs. They are not Rally/Rova backlog IDs until the items are created in the product backlog.

No Story Point or delivery-hour estimate is assigned. DEV estimates each story after technical refinement.

## 1. Delivery map

| Order | Local ID | User Story | Primary outcome | Dependencies |
|---:|---|---|---|---|
| 1 | SU-01 | Open Split for an eligible Story | Safe access to the flow | Existing Story edit permission and Iterations |
| 2 | SU-02 | Configure the two resulting Stories | Correct before/after Story values | SU-01 |
| 3 | SU-03 | Distribute Tasks | Correct Task parents and effort preservation | SU-02 |
| 4 | SU-04 | Distribute related Defects | Correct Defect parent without losing explicit Iteration | SU-02 |
| 5 | SU-05 | Distribute Test Cases | Correct Work Product without rewriting Results | SU-02, Phase 7 Test Case/Result |
| 6 | SU-06 | Commit the Split | One complete persisted Split | SU-02–SU-05 |
| 7 | SU-07 | Trace and navigate the Split | Linked Stories and auditable history | SU-06 |
| 8 | SU-08 | Show Split in Burndown | Show source/target To Do and points | SU-06, Phase 6 Burndown |
| 9 | SU-09 | Exclude Split placeholder from Velocity | Prevent double delivery credit | SU-06, Phase 6 Velocity |
| 10 | SU-10 | Attribute Split effort in Team Capacity | Prevent Actual-hour double count | SU-06, Phase 6 Team Capacity |

SU-03, SU-04 and SU-05 may be developed in parallel after SU-02. SU-08, SU-09 and SU-10 may be developed in parallel after the Split Event from SU-06 is available.

## US-SU-01: Open Split for an eligible User Story

**As a** user who can edit a User Story
**I want to** open Split only when the Story and a target Iteration are eligible
**So that** I can begin the carry-forward flow without creating an invalid Story relationship.

### Scope

- Split entry point in User Story Detail.
- Split entry point in Iteration Status for one selected Story.
- Eligibility, permission and target-availability control states.
- No saved data change.

### Dependencies

- Existing Work Item type/state/Iteration data.
- Existing Story edit permission.
- Iterations in the same Project and Team.

### Acceptance Criteria

#### AC1: Open from User Story Detail

- **Given** the user can edit an unfinished User Story assigned to an Iteration
- **And** a valid later Iteration exists in the same Project and Team
- **When** the user selects `More work item actions → Split unfinished story`
- **Then** the Split modal opens for that Story.

#### AC2: Open from Iteration Status

- **Given** exactly one eligible User Story is selected in Iteration Status
- **When** the user selects `Split`
- **Then** the same Split modal opens for the selected Story.

#### AC3: Reject unsupported Work Item type

- **Given** the selected Work Item is not a User Story
- **When** Split eligibility is evaluated
- **Then** the Split action is disabled
- **And** no explanatory message is added.

#### AC4: Reject finished Story state

- **Given** the Story is in `Completed`, `Accepted` or `Release`
- **When** Split eligibility is evaluated
- **Then** the Split action is disabled
- **And** no explanatory message is added.

#### AC5: Reject an unscheduled Story

- **Given** the Story has no assigned Iteration
- **When** Split eligibility is evaluated
- **Then** the Split action is disabled
- **And** no explanatory message is added.

#### AC6: No valid target Iteration

- **Given** the Story otherwise qualifies for Split
- **But** no later non-Accepted Iteration exists in the same Project and Team
- **When** Split eligibility is evaluated
- **Then** the Split action is disabled
- **And** no explanatory message is added.

#### AC7: User lacks edit permission

- **Given** the user cannot edit the selected Story
- **When** the user views an available Split surface
- **Then** the Split action is disabled
- **And** no data is changed and no explanatory message is added.

### References

- Feature rules: SU-BR-01 to SU-BR-06.
- SRS: sections 3 and 4.

## US-SU-02: Configure the resulting Stories

**As a** Split user
**I want to** review and edit the allowed values for `[Unfinished]` and `[Continued]`
**So that** the source history and remaining delivery scope are represented correctly before I confirm.

### Scope

- Two-panel Story summary.
- Default and read-only fields.
- Editable name, target, state and Plan Estimate fields.
- Field validation state and point comparison.

### Dependencies

- SU-01.
- Current Story relationships and valid Target Iterations.

### Acceptance Criteria

#### AC1: Default `[Unfinished]` values

- **Given** the Split modal opens for an eligible Story
- **When** the left panel is populated
- **Then** the panel identifies it as the new historical Story and shows the name `[Unfinished] {Original name}`
- **And** it shows Source Iteration, `Unscheduled` Release, `Accepted` state and the original Plan Estimate.

#### AC2: Lock `[Unfinished]` historical scope

- **Given** the Split modal is open
- **When** the user reviews `[Unfinished]`
- **Then** Source Iteration, `Unscheduled` Release and `Accepted` state are read-only
- **And** the Feature/parent Portfolio relationship is identified as removed by the Split.

#### AC3: Default `[Continued]` values

- **Given** the Split modal opens
- **When** the right panel is populated
- **Then** the panel identifies `[Continued]` as the original Story
- **And** it defaults the name to `[Continued] {Original name}`, the target to the earliest valid later Iteration, and state, Release and Plan Estimate to their original values.

#### AC4: Edit allowed fields

- **Given** the Split modal is open
- **When** the user edits either name or Plan Estimate, or edits the allowed `[Continued]` fields
- **Then** the new values remain visible in the modal
- **And** no saved Story is changed before confirmation.

#### AC5: Restrict Target Iteration options

- **Given** the user opens the Target Iteration selector
- **When** options are listed
- **Then** every option is later than the Source Iteration, belongs to the same Project and Team, and is not Accepted.

#### AC6: Validate required values

- **Given** a Story name is blank or a Plan Estimate is invalid or negative
- **When** the modal validates the current values
- **Then** the affected field is shown in an invalid state
- **And** `Split story` is disabled without validation text.

#### AC7: Show independent points

- **Given** either Plan Estimate is changed
- **When** the combined value differs from the original points
- **Then** the footer shows original points, combined points and the difference
- **And** no warning message is shown and confirmation remains available when all required fields are valid.

### References

- Feature rules: SU-BR-07 to SU-BR-13.
- SRS: section 5.

## US-SU-03: Distribute Tasks and preserve effort

**As a** Split user
**I want to** decide which Tasks stay with `[Unfinished]` and which continue with the original Story
**So that** completed and remaining work keep the correct parent without losing effort data.

### Scope

- Task default distribution.
- Move control and empty state.
- Task identity and effort preservation.
- Resulting Story Task rollups.

### Dependencies

- SU-02.
- Existing Task parent and effort fields.

### Acceptance Criteria

#### AC1: Default Task distribution

- **Given** the Original Story has Tasks
- **When** the Split modal opens
- **Then** Tasks in `Completed` default to `[Unfinished]`
- **And** every non-Completed Task defaults to `[Continued]`.

#### AC2: Move a Task between panels

- **Given** a Task is displayed on one panel
- **When** the user drags it or selects its direction arrow
- **Then** the same Task appears on the opposite panel
- **And** it no longer appears on the original panel.

#### AC3: Preserve Task data

- **Given** a Task is assigned to either resulting Story
- **When** Split is saved
- **Then** its ID, Name, State, Estimate, To Do, Actual, Owner and history remain unchanged
- **And** only its Parent Story reflects the selected panel.

#### AC4: Recalculate Story Task rollups

- **Given** Tasks have been distributed
- **When** Split completes
- **Then** each resulting Story recalculates Task count, Completed Task count, Task Estimate and Task To Do from its assigned Tasks.

#### AC5: Empty Task panel

- **Given** one resulting Story has no assigned Tasks
- **When** the modal shows that panel
- **Then** the Task collection shows its empty drop state
- **And** the empty collection does not block Split.

### References

- Feature rules: SU-BR-14, SU-BR-16 and SU-BR-17.
- SRS: sections 6, 8.1 and 9.

## US-SU-04: Distribute related Defects without overwriting Iteration

**As a** Split user
**I want to** assign each related Defect to the appropriate resulting Story
**So that** Defect traceability changes without silently changing an explicit Defect schedule.

### Scope

- Defect default distribution and move control.
- Parent Story update.
- Explicit Defect Iteration preservation and inline context.

### Dependencies

- SU-02.
- Existing Defect Parent Story and Iteration behavior.

### Acceptance Criteria

#### AC1: Default Defect distribution

- **Given** the Original Story has related Defects
- **When** the Split modal opens
- **Then** all related Defects default to `[Continued]`.

#### AC2: Move a Defect between panels

- **Given** a related Defect is displayed on one panel
- **When** the user drags it or selects its direction arrow
- **Then** the same Defect appears on the opposite panel.

#### AC3: Preserve explicit Defect Iteration

- **Given** a Defect has an explicitly assigned Iteration
- **When** Split changes its Parent Story
- **Then** the Defect keeps its explicit Iteration.

#### AC4: Show explicit Iteration inline

- **Given** a Defect's explicit Iteration differs from the Iteration of its selected Story panel
- **When** the modal evaluates the distribution
- **Then** the Defect row shows `Explicit: {Iteration}`
- **And** no warning message is shown and Split remains available when all required fields are valid.

#### AC5: Follow parent context without explicit Iteration

- **Given** a related Defect has no explicit Iteration
- **When** Split assigns it to a resulting Story
- **Then** its Iteration context follows that Parent Story.

### References

- Feature rules: SU-BR-15, SU-BR-16 and SU-BR-18.
- SRS: sections 6 and 8.2.

## US-SU-05: Distribute Test Cases and preserve Result history

**As a** Split user
**I want to** assign each Test Case to the appropriate resulting Story
**So that** future testing follows the current work while past execution evidence remains trustworthy.

### Scope

- Test Case default distribution and move control.
- Current Work Product update.
- Historical Result Work Product preservation.
- Last Verdict and Last Run continuity.

### Dependencies

- SU-02.
- Phase 7 Test Case and Test Result Feature.

### Acceptance Criteria

#### AC1: Default Test Case distribution

- **Given** the Original Story has linked Test Cases
- **When** the Split modal opens
- **Then** all Test Cases default to `[Continued]`.

#### AC2: Move a Test Case between panels

- **Given** a Test Case is displayed on one panel
- **When** the user drags it or selects its direction arrow
- **Then** the same Test Case appears on the opposite panel.

#### AC3: Update current Work Product

- **Given** a Test Case is assigned to one resulting Story
- **When** Split completes
- **Then** the Test Case keeps its ID, content and history
- **And** its current Work Product references the selected Story.

#### AC4: Preserve historical Results

- **Given** a moved Test Case has saved Results
- **When** its current Work Product changes during Split
- **Then** every historical Result retains its previously captured read-only Work Product.

#### AC5: Capture Work Product for a new Result

- **Given** Split has completed
- **When** a new Result is created for the Test Case
- **Then** the Result captures the Test Case's current Work Product.

#### AC6: Preserve latest-result rollup

- **Given** a Test Case has Results before or after Split
- **When** Last Verdict and Last Run are displayed
- **Then** both values continue to come from the newest Result for that Test Case.

### References

- Feature rules: SU-BR-15, SU-BR-16, SU-BR-19 and SU-BR-20.
- SRS: sections 6 and 8.3.
- Phase 7 Test Case SRS: sections 7–10.

## US-SU-06: Commit one complete Split

**As a** Split user
**I want to** confirm the reviewed Split as one complete business action
**So that** both Stories and all selected relationships represent one consistent outcome.

### Scope

- Create `[Unfinished]` and update `[Continued]`.
- Apply all selected child relationships.
- Save the Split Event.
- Cancel and validation-failure safety.

### Dependencies

- SU-02 through SU-05.

### Acceptance Criteria

#### AC1: Create `[Unfinished]`

- **Given** the modal contains valid values
- **When** the user selects `Split story`
- **Then** the system creates one new User Story in the Source Iteration
- **And** it applies the approved `[Unfinished]` name, Plan Estimate, Accepted state, Unscheduled Release and cleared Feature/parent scope.

#### AC2: Move the original as `[Continued]`

- **Given** the same valid confirmation
- **When** Split completes
- **Then** the original User Story ID moves to the selected Target Iteration
- **And** it retains its original history and applies the approved `[Continued]` values.

#### AC3: Apply the reviewed distribution

- **Given** Tasks, Defects and Test Cases were assigned to modal panels
- **When** Split completes
- **Then** every displayed item references the Story selected at confirmation.

#### AC4: Save one Split Event

- **Given** Split completes successfully
- **When** the outcome is persisted
- **Then** one Split Event connects the source and target Iterations, both Story IDs, point values, item distribution and effort snapshot.

#### AC5: Cancel without saving

- **Given** the modal contains unsaved edits
- **When** the user selects Cancel, `×` or Escape
- **Then** the modal closes
- **And** no Story, child item or Split Event is changed or created.

#### AC6: Validation failure has no partial result

- **Given** a blocking validation fails
- **When** the modal evaluates the current values
- **Then** the modal remains open, the affected field is invalid and `Split story` is disabled
- **And** neither resulting Story nor any relationship change is saved.

### References

- Feature rules: SU-BR-07 to SU-BR-20, SU-BR-29 and SU-BR-32.
- SRS: sections 7 and 12.

## US-SU-07: Trace and navigate a completed Split

**As a** delivery reviewer
**I want to** navigate between the resulting Stories and inspect the Split history
**So that** I can understand what stayed, what moved and why the Iteration record changed.

### Scope

- Post-Split destination.
- Split banner on both Stories.
- Compact Split bar, links and revision history.

### Dependencies

- SU-06.

### Acceptance Criteria

#### AC1: Open the continued Story after success

- **Given** Split completes successfully
- **When** the modal closes
- **Then** User Story Detail opens for the original `[Continued]` Story.

#### AC2: Show the Split banner

- **Given** either resulting Story Detail is open
- **When** its Split relationship is displayed
- **Then** a compact bar shows `Split · Source → Target`
- **And** it contains links to `[Unfinished]` and `[Continued]` without an explanatory message.

#### AC3: Navigate between resulting Stories

- **Given** the Split banner is visible
- **When** the user selects the `[Unfinished]` or `[Continued]` link
- **Then** the corresponding Story Detail opens.

#### AC4: Trace relationship changes

- **Given** a completed Split affected Stories and child items
- **When** a reviewer opens their revision histories
- **Then** the new Story, moved original Story and changed parent/Work Product relationships are traceable to the Split Event.

#### AC5: Preserve historical Result evidence

- **Given** the Split included Test Cases with historical Results
- **When** a reviewer opens those Results
- **Then** their captured Work Products remain unchanged.

### References

- Feature rules: SU-BR-29 to SU-BR-31.
- SRS: section 11.

## US-SU-08: Show Split and Carry-in in Iteration Burndown

**As a** report reader
**I want to** see when work was split out of one Iteration and carried into another
**So that** changes in To Do, points and Actual are understandable without rewriting historical progress.

### Scope

- Source `SPLIT OUT` event.
- Target `CARRY IN` event.
- To Do, Accepted Points, Ideal and Actual behavior.

### Dependencies

- SU-06 Split Event.
- Phase 6 Iteration Burndown snapshots and baseline.

### Acceptance Criteria

#### AC1: Preserve finalized source history

- **Given** the Source Iteration has finalized daily snapshots before Split
- **When** Split occurs
- **Then** those earlier snapshots remain unchanged.

#### AC2: Show source Split-out

- **Given** To Do moves to `[Continued]`
- **When** the Source Burndown reaches the Split date
- **Then** moved To Do is excluded from that date forward
- **And** compact `SPLIT OUT` context shows the `[Unfinished]` ID, historical points, moved To Do and retained Actual.

#### AC3: Exclude `[Unfinished]` from Accepted Points

- **Given** `[Unfinished]` is auto-Accepted
- **When** Source Burndown calculates Accepted Points
- **Then** its Plan Estimate is not added to the green Accepted Points series
- **And** it remains visible through compact Split/Carryover context.

#### AC4: Preserve source Ideal

- **Given** the Source Iteration already captured its Task Estimate baseline
- **When** Tasks move during Split
- **Then** the Source Ideal line remains unchanged.

#### AC5: Show target Carry-in

- **Given** Tasks move to `[Continued]`
- **When** the Target Burndown displays the Split effect
- **Then** compact `CARRY IN` context shows the `[Continued]` ID, points, incoming To Do and `0h` opening Actual
- **And** incoming To Do appears on the Split date or at opening when Split occurred before the Target Iteration started.

#### AC6: Apply target Ideal timing rule

- **Given** Split occurs before the Target Iteration baseline is captured
- **When** the baseline is created
- **Then** moved Task Estimate is included.

#### AC7: Do not rewrite an existing target Ideal

- **Given** the Target Iteration baseline was captured before Split
- **When** work is carried in
- **Then** the Target Ideal line remains unchanged.

#### AC8: Start target Actual after Split

- **Given** a Task moved to `[Continued]` already has Actual
- **When** Target Iteration Actual is reported
- **Then** its carried-in Actual starts at `0h`
- **And** only Actual added after the Split timestamp increases the target value.

### References

- Feature rules: SU-BR-21 to SU-BR-25 and SU-BR-28.
- SRS: sections 10.1–10.3.

## US-SU-09: Exclude the historical placeholder from Velocity

**As a** report reader
**I want to** see Split/Carryover points separately from delivered points
**So that** Velocity history remains explainable without rewarding the same Story twice.

### Scope

- Amber Split/Carryover segment.
- Exclusion from normal segments, trend and averages.
- Normal Target Iteration classification for `[Continued]`.

### Dependencies

- SU-06 Split Event.
- Phase 6 Velocity classification and acceptedDate behavior.

### Acceptance Criteria

#### AC1: Display source placeholder points separately

- **Given** `[Unfinished]` exists in an eligible Source Iteration
- **When** Velocity is displayed
- **Then** its Plan Estimate appears only in `Split / Carryover (excluded)`.

#### AC2: Exclude placeholder from delivery classifications

- **Given** `[Unfinished]` is Accepted
- **When** the Source Iteration bar is calculated
- **Then** its points are excluded from Accepted During, Accepted After and Not Accepted.

#### AC3: Exclude placeholder from Velocity calculations

- **Given** one or more Split/Carryover placeholders are visible
- **When** Trend, Last 3, Best 3 and Worst 3 are calculated
- **Then** placeholder points do not affect any result.

#### AC4: Classify `[Continued]` in the target

- **Given** `[Continued]` later reaches Accepted or Release
- **When** Velocity is calculated for the Target Iteration
- **Then** its current Plan Estimate is classified by the normal acceptedDate rule.

#### AC5: Label the excluded segment

- **Given** the chart contains Split/Carryover points
- **When** the report is viewed
- **Then** the legend labels the segment `Split / Carryover (excluded)`
- **And** no additional explanatory message is shown.

#### AC6: Reconcile displayed points

- **Given** an Iteration contains ordinary work and Split placeholders
- **When** all stacked segments are summed
- **Then** Accepted During + Accepted After + Not Accepted + Split/Carryover equals the points of all displayed Story/Defect items in that Iteration.

### References

- Feature rules: SU-BR-21, SU-BR-22 and SU-BR-26.
- SRS: section 10.4.

## US-SU-10: Attribute Split effort in Team Capacity

**As a** report reader
**I want to** see Task effort attributed to the correct source or target Iteration after Split
**So that** planning and worked hours remain useful without duplicating pre-Split Actual.

### Scope

- Capacity unchanged.
- Estimate and To Do follow Tasks.
- Actual separated at the Split timestamp.
- Existing member grouping retained.

### Dependencies

- SU-06 Split Event with per-Task effort snapshot.
- Phase 6 Team Capacity.

### Acceptance Criteria

#### AC1: Preserve Capacity

- **Given** a Story is split between Iterations
- **When** Team Capacity is recalculated
- **Then** member and Team Capacity hours are unchanged by the Split action.

#### AC2: Move Task Estimate with the Task

- **Given** a Task is assigned to one resulting Story
- **When** Estimate is aggregated for source and target Iterations
- **Then** its unchanged Estimate contributes only to the Iteration scope of that Story.

#### AC3: Move Task To Do with the Task

- **Given** a Task is assigned to one resulting Story
- **When** To Do is aggregated for source and target Iterations
- **Then** its unchanged To Do contributes only to the Iteration scope of that Story.

#### AC4: Retain pre-Split Actual in the source

- **Given** a Task moved to `[Continued]` has Actual at the Split timestamp
- **When** Source Actual is reported
- **Then** that pre-Split Actual remains attributed to the Source Iteration.

#### AC5: Count only post-Split Actual in the target

- **Given** a moved Task receives additional Actual after Split
- **When** Target Actual is reported
- **Then** only the post-Split delta is attributed to the Target Iteration.

#### AC6: Keep Task Detail Actual intact

- **Given** Actual is separated for report attribution
- **When** the Task Detail is opened
- **Then** it still shows the full accumulated Actual value.

#### AC7: Retain member grouping rules

- **Given** Tasks belong to named owners or `Unassigned`
- **When** Team Capacity displays source or target data
- **Then** the existing member, task-only owner and `Unassigned` grouping rules remain unchanged.

### References

- Feature rules: SU-BR-17, SU-BR-27 and SU-BR-28.
- SRS: sections 9.2, 9.3, 10.1 and 10.5.

## Feature-level Definition of Done

The Feature is complete only when:

1. SU-01 through SU-10 meet their Acceptance Criteria.
2. Both Split entry points use the same eligibility and modal behavior.
3. The saved Split produces one new `[Unfinished]` Story and moves the original as `[Continued]`.
4. Task, Defect, Test Case and Result history behavior matches the approved rules.
5. Split Event data supports the three report stories without reconstructing lost history.
6. Burndown, Velocity and Team Capacity results reconcile without duplicate points or Actual hours.
7. Automated tests cover main flow, disabled and invalid control states, permission, cancellation, history preservation and report attribution.
8. Mockup-only fixtures are not treated as proof of production persistence.

## INVEST review

- Each story has one primary user or report outcome and can be estimated separately.
- SU-03, SU-04 and SU-05 are parallel child-item slices.
- SU-08, SU-09 and SU-10 are parallel report slices after the Split Event exists.
- SU-06 is the integration point and must not be marked complete if it can leave a partial Split.
- The Feature should not be released with only UI stories complete because the report and audit behavior prevents business double counting.

## Open decisions

No unresolved business question was found during drafting. BA approval of this Feature/US package is still pending.

The following are DEV design responsibilities, not new business scope:

- API transaction and retry design;
- physical database schema and indexes;
- persistence strategy for per-Task effort at Split;
- automated test framework and deployment strategy.

Any proposed behavior that changes identity, permission, target eligibility, point classification, Actual attribution or historical Result Work Product must return to BA for confirmation.

--
