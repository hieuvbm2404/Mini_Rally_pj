# User Stories — Story Date Tracking and Carryover

## 0. Document control

| Attribute | Value |
|---|---|
| Feature code | `CO` |
| Feature name | Story Date Tracking and Carryover |
| Product | Rova / Mini Rally |
| Phase | Phase 7 — After MVP |
| Status | BA approved; created under `FE-37` on Rova |
| Updated | 2026-09-14 |
| Parent specification | `FEATURE.md` and `SRS.md` in this folder |
| ID note | `CO-01` to `CO-10` are local delivery slices mapped in order to Rova `US-109` to `US-118` |

## 1. Delivery map

| Order | Story | Outcome | Main dependency |
|---:|---|---|---|
| 1 | CO-01 | Record Story lifecycle dates | Existing Story state transition |
| 2 | CO-02 | Record Task lifecycle dates | Existing Task state transition |
| 3 | CO-03 | Select and validate Story Target End Date | CO-01; Iteration dates and states |
| 4 | CO-04 | Review Carryover and resolve its target Iteration | CO-03 |
| 5 | CO-05 | Commit same-ID Carryover atomically | CO-02, CO-04 |
| 6 | CO-06 | Recover through manual Iteration move and Target End clearing | CO-05 |
| 7 | CO-07 | Trace Carryover in Revision History | CO-05 |
| 8 | CO-08 | Show compact Carryover context in Iteration Burndown | CO-05; Phase 6 Burndown |
| 9 | CO-09 | Attribute Carryover effort in Team Capacity | CO-05; Phase 6 Capacity |
| 10 | CO-10 | Review the dedicated Carryover report | CO-05, CO-08, CO-09 |

CO-01 and CO-02 may be delivered in parallel. CO-06 and CO-07 may be delivered in parallel after CO-05. CO-08 and CO-09 may also be delivered in parallel after the Carryover Event contract is stable.

---

## CO-01 — Record Story lifecycle dates

### User Story

As a delivery reviewer, I want the Story's actual start and completion dates to be recorded automatically so that I can see when work really began and ended.

### Scope

- Add read-only Start Date and Actual End Date to Story Detail.
- Show Start Date in the Story row on Iteration Status.
- Derive each date once from the existing Story state transition.
- Preserve both dates through later state and Iteration changes.

### Dependencies

- Existing Story Detail and Iteration Status.
- Existing Story state model, including `In-Progress` and `Accepted`.

### Acceptance Criteria

#### AC1 — Record first Story start

```gherkin
Given a Story has no Start Date
When the Story enters In-Progress for the first time
Then the system saves the current date as Start Date
And the saved Start Date is read-only
```

#### AC2 — Do not rewrite Story start

```gherkin
Given a Story already has a Start Date
When the Story later changes state or Iteration
Then the original Start Date remains unchanged
```

#### AC3 — Record first Story completion

```gherkin
Given a Story has no Actual End Date
When the Story enters Accepted for the first time
Then the system saves the current date as Actual End Date
And the saved Actual End Date is read-only
```

#### AC4 — Do not rewrite Story completion

```gherkin
Given a Story already has an Actual End Date
When the Story is reopened or changes Iteration
Then the original Actual End Date remains unchanged
```

#### AC5 — Show blank lifecycle dates before their events

```gherkin
Given a Story has never entered In-Progress or Accepted
When a user opens its supported list or Detail view
Then Start Date and Actual End Date are blank
```

### References

- `FEATURE.md`: CO-BR-06, CO-BR-07, CO-BR-10.
- `03_Mockup Design/src/app/pages/IterationStatusPage.tsx`.
- `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx`.

---

## CO-02 — Record Task lifecycle dates

### User Story

As a delivery reviewer, I want each Task's actual start and completion dates recorded automatically so that I can understand when its work occurred.

### Scope

- Add read-only Start Date and Actual End Date to the Task list and Task Detail.
- Derive each date once from the existing Task state transition.
- Preserve both dates through later state and Iteration changes.

### Dependencies

- Existing Task list and Task Detail.
- Existing Task states, including `In-Progress` and `Completed`.

### Acceptance Criteria

#### AC1 — Record first Task start

```gherkin
Given a Task has no Start Date
When the Task enters In-Progress for the first time
Then the system saves the current date as Start Date
And the saved Start Date is read-only
```

#### AC2 — Do not rewrite Task start

```gherkin
Given a Task already has a Start Date
When the Task later changes state or follows its Story to another Iteration
Then the original Start Date remains unchanged
```

#### AC3 — Record first Task completion

```gherkin
Given a Task has no Actual End Date
When the Task enters Completed for the first time
Then the system saves the current date as Actual End Date
And the saved Actual End Date is read-only
```

#### AC4 — Do not rewrite Task completion

```gherkin
Given a Task already has an Actual End Date
When the Task is reopened or follows its Story to another Iteration
Then the original Actual End Date remains unchanged
```

#### AC5 — Display the persisted dates consistently

```gherkin
Given a Task has persisted lifecycle dates
When a user opens the Task list and then Task Detail
Then both surfaces show the same Start Date and Actual End Date
```

### References

- `FEATURE.md`: CO-BR-08, CO-BR-09, CO-BR-10, CO-BR-11.
- `04_Developement_tracking/Phase 1/04_Task_Management/SRS.md`.
- `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx`.

---

## CO-03 — Select and validate Story Target End Date

### User Story

As a Story editor, I want to select a valid Target End Date so that I can forecast completion without changing actual lifecycle dates.

### Scope

- Add editable Target End Date to Story Detail for authorized users.
- Restrict selectable dates by Start Date and eligible Iterations.
- Save a date in the current Iteration without initiating Carryover.
- Allow Target End Date to be cleared independently.

### Dependencies

- CO-01.
- Existing Story edit permission.
- Existing Iteration dates, Project, Team and state.

### Acceptance Criteria

#### AC1 — Restrict editing by existing Story permission

```gherkin
Given a user cannot edit the Story
When the user opens Story Detail
Then Target End Date is read-only
And the user cannot initiate Carryover
```

#### AC2 — Prevent a target before Story start

```gherkin
Given the Story has a Start Date
When the user opens the Target End Date picker
Then every date earlier than Start Date is disabled
```

#### AC3 — Apply the current Iteration lower boundary before work starts

```gherkin
Given the Story has no Start Date
And the current Iteration is eligible
When the user opens the Target End Date picker
Then dates before the current Iteration start are disabled
```

#### AC4 — Enable only dates in valid Iterations

```gherkin
Given the user opens the Target End Date picker
When the system evaluates available Iterations
Then it enables only dates in the current or a future same-Project same-Team Iteration
And each enabled Iteration is in Planning or Committed state
```

#### AC5 — Save a forecast inside the current Iteration

```gherkin
Given the user selects an enabled date inside the current Iteration
When the selection is saved
Then Target End Date is updated
And the Story remains in the current Iteration
And no Carryover confirmation or event is created
```

#### AC6 — Clear the forecast independently

```gherkin
Given the Story has a Target End Date
When an authorized user clears it
Then Target End Date becomes blank
And the Story Iteration and transition history remain unchanged
```

### References

- `FEATURE.md`: CO-BR-01 to CO-BR-05, CO-BR-12 to CO-BR-17, CO-BR-28.
- `04_Developement_tracking/Phase 2/02_Iterations/SRS.md`.
- `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx`.

---

## CO-04 — Review Carryover and resolve its target Iteration

### User Story

As a Story editor, I want to review the Carryover impact and select an unambiguous target Iteration so that the Story is not moved accidentally.

### Scope

- Open Carryover confirmation for a valid Target End Date after the current Iteration.
- Show the source, target, Story and Task summary.
- Propose a single eligible target or require selection among overlapping eligible targets.
- Preserve all data when the action is cancelled or cannot be validated.

### Dependencies

- CO-03.
- Eligible future Iterations in the same Project and Team.

### Acceptance Criteria

#### AC1 — Open review before persisting Carryover

```gherkin
Given the user selects an enabled Target End Date after the current Iteration end
When the date is selected
Then the Carryover confirmation opens
And the date and Iteration change are not yet persisted
```

#### AC2 — Show the proposed movement

```gherkin
Given the Carryover confirmation is open
When the proposal is displayed
Then it shows the Story ID and Target End Date
And it shows the source and target Iteration date ranges
And it shows total Task count and unfinished Task count
```

#### AC3 — Resolve one eligible target automatically

```gherkin
Given exactly one eligible Iteration contains the selected date
When the confirmation opens
Then that Iteration is shown as the proposed target
And the user can review it before accepting
```

#### AC4 — Require selection among overlapping targets

```gherkin
Given multiple eligible Iterations contain the selected date
When the confirmation opens
Then all matching Iterations are available for selection
And Accept remains unavailable until the user selects one target
```

#### AC5 — Block a proposal with no eligible target

```gherkin
Given no eligible Planning or Committed Iteration contains the selected date
When the system evaluates Carryover
Then Accept is unavailable
And no Story Task date or history data changes
```

#### AC6 — Cancel without side effects

```gherkin
Given the Carryover confirmation is open
When the user cancels closes the modal or presses Escape
Then the confirmation closes
And the existing Target End Date Iteration Tasks and history remain unchanged
```

### References

- `FEATURE.md`: CO-BR-18 to CO-BR-21, CO-BR-25.
- `04_Developement_tracking/Phase 2/02_Iterations/SRS.md`.
- `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx`.

---

## CO-05 — Commit same-ID Carryover atomically

### User Story

As a Story editor, I want an accepted Carryover to move the same Story and all its Tasks as one transaction so that no identity, work or history is lost.

### Scope

- Move the existing Story to the selected target Iteration.
- Keep every child Task under the same Story.
- Preserve Story and Task fields, effort, dates, relationships and history.
- Append one immutable Carryover Event with per-Task effort snapshots.
- Support repeated Carryovers as separate events.

### Dependencies

- CO-02 and CO-04.
- Persisted Story, Task and Iteration identities.

### Acceptance Criteria

#### AC1 — Move the same Story identity

```gherkin
Given a valid Carryover proposal is ready
When the user accepts it
Then the existing Story ID is assigned to the selected target Iteration
And no replacement Story is created
And the selected Target End Date is saved
```

#### AC2 — Move all child Tasks with the Story

```gherkin
Given the Story has child Tasks in any state
When Carryover is accepted
Then every existing Task remains under the same Story
And every Task is visible in the Story's target Iteration scope
And no Task is duplicated or omitted
```

#### AC3 — Preserve business data

```gherkin
Given the Story and Tasks contain content relationships owners dates states and effort values
When Carryover is accepted
Then those values remain unchanged except for Story Iteration and selected Target End Date
And Estimate To Do and Actual remain independent persisted values
```

#### AC4 — Append one complete Carryover Event

```gherkin
Given Carryover is accepted successfully
When the transaction completes
Then exactly one Carryover Event is appended to the Story
And it records source and target Iteration IDs event time and Target End Date
And it records each Task's State Estimate To Do and cumulative Actual at the movement boundary
```

#### AC5 — Avoid partial movement

```gherkin
Given any required Story Task or Carryover Event update fails
When the system attempts to accept Carryover
Then the complete action fails
And no partial Story Task date or event change is persisted
```

#### AC6 — Record repeated Carryover separately

```gherkin
Given the same Story already has a Carryover Event
When a later valid Carryover is accepted
Then the same Story and Task identities are retained
And one new ordered Carryover Event is appended
And the earlier event remains unchanged
```

### References

- `FEATURE.md`: CO-BR-22 to CO-BR-25, CO-BR-29, CO-BR-30, CO-BR-43, CO-BR-45, CO-BR-46.
- `04_Developement_tracking/Phase 1/05_Time_Tracking/SRS.md`.
- `04_Developement_tracking/Phase 7 (After MVP)/Split Unfinished/FEATURE.md` — identity comparison only; Split remains separate.
- `03_Mockup Design/src/app/model.ts`.

---

## CO-06 — Recover through manual Iteration move and Target End clearing

### User Story

As a Story editor, I want to move a carried Story back through the existing Iteration field and clear its forecast independently so that I can correct planning without erasing history.

### Scope

- Retain existing authorized manual Iteration editing after Carryover.
- Record a Manual Move Event for each manual change.
- Keep manual movement separate from Carryover reporting.
- Make clearing Target End Date independent from manual movement.

### Dependencies

- CO-05.
- Existing authorized Story Iteration editing.

### Acceptance Criteria

#### AC1 — Move a carried Story manually

```gherkin
Given an authorized user edits a previously carried Story
When the user selects an earlier valid Iteration through the existing Iteration field
Then the same Story is assigned to that Iteration
And its Tasks remain under the same Story
```

#### AC2 — Distinguish manual movement

```gherkin
Given a Story Iteration is changed manually
When the change is saved
Then one Manual Move Event is appended
And no Carryover Event is created or deleted
```

#### AC3 — Clear Target End Date without moving the Story

```gherkin
Given a carried Story has a Target End Date
When an authorized user clears Target End Date
Then the field becomes blank
And the current Iteration remains unchanged
```

#### AC4 — Preserve earlier transition evidence

```gherkin
Given the Story has earlier Carryover Events
When its Iteration is changed manually or Target End Date is cleared
Then every earlier Carryover Event remains unchanged
```

### References

- `FEATURE.md`: CO-BR-26 to CO-BR-28, CO-BR-46.
- `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx`.

---

## CO-07 — Trace Carryover in Revision History

### User Story

As a delivery reviewer, I want every Carryover and manual move shown in Revision History so that I can reconstruct how the Story crossed Iterations.

### Scope

- Show accepted Carryover Events on Story Revision History.
- Show manual Iteration changes as a distinct event type.
- Preserve and order repeated transition evidence.

### Dependencies

- CO-05 and CO-06.
- Existing Story Revision History.

### Acceptance Criteria

#### AC1 — Show Carryover event details

```gherkin
Given a Carryover has been accepted
When a user opens Story Revision History
Then the event shows the actor and event time
And it shows source Iteration target Iteration and Target End Date
```

#### AC2 — Distinguish manual movement

```gherkin
Given the Story has both Carryover and manual Iteration changes
When a user opens Revision History
Then Carryover Events and Manual Move Events have distinct labels
```

#### AC3 — Preserve repeated event order

```gherkin
Given the Story has crossed multiple Iterations
When Revision History is displayed
Then all transition events are ordered by their persisted event time
And each event retains its original source and target Iteration identity
```

#### AC4 — Retain history after forecast clearing

```gherkin
Given the Story has Carryover history
When Target End Date is later cleared
Then the existing Carryover Events remain visible and unchanged
```

### References

- `FEATURE.md`: CO-BR-27, CO-BR-43 to CO-BR-46.
- `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx`.

---

## CO-08 — Show compact Carryover context in Iteration Burndown

### User Story

As a report reader, I want a compact Carryover summary in Iteration Burndown so that I notice scope movement without obscuring the burndown chart.

### Scope

- Show Carry In/Out count and transferred To Do as a compact badge.
- Open Carryover report in the selected Iteration scope from the badge.
- Leave existing Burndown calculation and Split presentation unchanged.

### Dependencies

- CO-05.
- Phase 6 Iteration Burndown and report permission.

### Acceptance Criteria

#### AC1 — Show Carry Out on the source Iteration

```gherkin
Given one or more Carryover Events use the selected Iteration as source
When the user opens its Iteration Burndown
Then a compact badge shows Carry Out count and transferred To Do
```

#### AC2 — Show Carry In on the target Iteration

```gherkin
Given one or more Carryover Events use the selected Iteration as target
When the user opens its Iteration Burndown
Then a compact badge shows Carry In count and transferred To Do
```

#### AC3 — Drill into the dedicated report

```gherkin
Given the Carryover badge is visible
When the user selects it
Then Carryover report opens with that Iteration selected
```

#### AC4 — Keep the chart focused on burndown

```gherkin
Given the selected Iteration has Carryover activity
When Iteration Burndown is displayed
Then the existing burndown visualization remains available
And no Carryover event series is added to the chart
```

### References

- `FEATURE.md`: CO-BR-34 to CO-BR-36.
- `04_Developement_tracking/Phase 6/02_Iteration_Burndown/SRS.md`.
- `03_Mockup Design/src/app/pages/ReportsPage.tsx`.

---

## CO-09 — Attribute Carryover effort in Team Capacity

### User Story

As a report reader, I want carried Task effort attributed between Iterations by event snapshots so that repeated Carryovers do not double-count Actual hours.

### Scope

- Retain independent Task Estimate, To Do and Actual values.
- Attribute Actual to consecutive Carryover intervals.
- Show a compact Carry In/Out summary in Team Capacity.
- Leave the existing Team Capacity layout and formulas otherwise unchanged.

### Dependencies

- CO-05.
- Phase 1 independent Task effort rules.
- Phase 6 Team Capacity.

### Acceptance Criteria

#### AC1 — Preserve independent Task effort values

```gherkin
Given a Task has Estimate To Do and Actual values
When its Story is carried over
Then each value remains persisted independently
And no value is derived or reset from another value
```

#### AC2 — Bound Actual in the source Iteration

```gherkin
Given a Task is included in an outbound Carryover Event
When source Iteration Actual is calculated
Then it includes cumulative Actual only up to that Carryover boundary
```

#### AC3 — Attribute only new Actual to the target Iteration

```gherkin
Given a Task enters an Iteration through Carryover
When Actual is later added to the Task
Then target Iteration Actual includes only the increase after the inbound snapshot
And it stops at the next outbound snapshot when another Carryover occurs
```

#### AC4 — Avoid double-counting across repeated Carryovers

```gherkin
Given the same Task crosses three or more Iterations
When Actual is reported for each Iteration
Then consecutive Carryover snapshots create non-overlapping Actual intervals
And the same Actual hours are not attributed to more than one Iteration
```

#### AC5 — Show compact Capacity context

```gherkin
Given the selected Iteration has Carryover activity
When the user opens Team Capacity
Then a compact badge shows Carry In and Carry Out count and transferred To Do
And selecting the badge opens Carryover report for that Iteration
```

### References

- `FEATURE.md`: CO-BR-29 to CO-BR-34.
- `04_Developement_tracking/Phase 1/05_Time_Tracking/SRS.md`.
- `04_Developement_tracking/Phase 6/04_Team_Capacity/SRS.md`.
- `03_Mockup Design/src/app/pages/ReportsPage.tsx`.

---

## CO-10 — Review the dedicated Carryover report

### User Story

As a report reader, I want a dedicated Carryover report so that I can review affected Stories, movement direction and transferred effort without mixing Carryover with Split.

### Scope

- Add `Carryover` to the existing report types.
- Filter detail rows by Iteration and Direction.
- Show Carry In, Carry Out, Transferred To Do and Carryover Rate KPIs.
- Show an Iteration Carry In/Out trend and event-detail table.
- Reuse existing report read and export permissions.

### Dependencies

- CO-05, CO-08 and CO-09.
- Existing Phase 6 Reports shell, permissions and export behavior.

### Acceptance Criteria

#### AC1 — Open Carryover report under existing permission

```gherkin
Given a Workspace Admin or assigned-Project Admin can access Reports
When the user selects report type Carryover
Then the dedicated Carryover report opens in the current Project and Team scope
And no new report permission is required
```

#### AC2 — Filter event detail rows

```gherkin
Given the Carryover report is open
When the user selects an Iteration and Direction All Carry In or Carry Out
Then the detail table shows only Carryover Events matching that row filter
And saved event data is not changed
```

#### AC3 — Calculate the selected-Iteration KPIs

```gherkin
Given a selected Iteration has Carryover Events
When report KPIs are calculated
Then Carry In counts events targeting the Iteration
And Carry Out counts events sourced from the Iteration
And Transferred To Do sums snapshots from all events involving the Iteration
And the Direction row filter does not change those KPIs
```

#### AC4 — Calculate Carryover Rate

```gherkin
Given the selected Iteration has scheduled Stories
When Carryover Rate is calculated
Then the numerator is unique Story IDs carried into or out of the Iteration
And the denominator is unique Story IDs scheduled in that Iteration scope including Stories later carried out
```

#### AC5 — Show the cross-Iteration trend

```gherkin
Given available Iterations exist in the current Project and Team scope
When the Carryover report is displayed
Then the trend shows Carry In and Carry Out event counts for each available Iteration
```

#### AC6 — Show auditable event details

```gherkin
Given a Carryover Event matches the active row filters
When its detail row is displayed
Then the row shows Direction Story From To Moved On Start Date and Target End Date
And it shows Estimate To Do cumulative Actual at move and post-move Actual interval
```

#### AC7 — Exclude unrelated transitions

```gherkin
Given Split Events Manual Move Events and Carryover Events exist
When the Carryover report is calculated or exported
Then only Carryover Events are included
```

#### AC8 — Export the active report scope

```gherkin
Given the user has existing report-export permission
And the Carryover report has active Project Team Iteration and Direction scope
When the user exports the report
Then the export contains the matching Carryover report data
```

#### AC9 — Show an empty state

```gherkin
Given no Carryover Event matches the selected Iteration and Direction
When the report is displayed
Then the detail area shows an empty state
And no unrelated transition is substituted
```

### References

- `FEATURE.md`: CO-BR-35 to CO-BR-42.
- `04_Developement_tracking/Phase 6/02_Iteration_Burndown/SRS.md`.
- `04_Developement_tracking/Phase 6/04_Team_Capacity/SRS.md`.
- `03_Mockup Design/src/app/pages/ReportsPage.tsx`.

---

## 2. Feature-level Definition of Done

The Feature is done only when:

- CO-01 to CO-10 satisfy their Acceptance Criteria in an integrated environment.
- Story and Task lifecycle dates are persisted and remain read-only.
- Target End Date validation uses persisted Iteration dates, Project, Team and state.
- Carryover acceptance moves the same Story and all child Tasks atomically.
- Repeated Carryovers create immutable ordered events and non-overlapping Actual intervals.
- Manual Iteration movement and Target End Date clearing preserve Carryover evidence.
- Revision History, Burndown, Team Capacity and Carryover report reconcile to the same events.
- Split and Manual Move remain excluded from Carryover report.
- Existing authorization and report-export rules are enforced server-side.
- Error handling proves there is no partial movement or duplicate event on retry.
- Automated tests cover current-date lifecycle stamping, picker boundaries, overlapping targets, cancel, atomic failure, repeated Carryover and report formulas.
- The integrated behavior has been verified beyond the local in-memory mockup.

## 3. INVEST review

| Story | Independent | Valuable | Estimable | Small | Testable | Note |
|---|---|---|---|---|---|---|
| CO-01 | Yes | Yes | Yes | Yes | Yes | Story lifecycle dates only |
| CO-02 | Yes | Yes | Yes | Yes | Yes | Task lifecycle dates only |
| CO-03 | Mostly | Yes | Yes | Yes | Yes | Depends on Iteration validation |
| CO-04 | Mostly | Yes | Yes | Yes | Yes | Review and target resolution only |
| CO-05 | No | Yes | Yes | Yes | Yes | Core transaction depends on prior UI and dates |
| CO-06 | Mostly | Yes | Yes | Yes | Yes | Recovery path after Carryover |
| CO-07 | Mostly | Yes | Yes | Yes | Yes | History projection of persisted events |
| CO-08 | Mostly | Yes | Yes | Yes | Yes | Burndown integration only |
| CO-09 | Mostly | Yes | Yes | Yes | Yes | Capacity and effort attribution only |
| CO-10 | No | Yes | Yes | Yes | Yes | Integration report built on stable event contract |

## 4. Confirmed decisions and open items

Confirmed for this package:

- Carryover keeps one Story ID and all child Task IDs.
- Only same-Project, same-Team target Iterations in `Planning` or `Committed` are eligible.
- If overlapping eligible Iterations contain the selected date, the user must choose the target.
- Clearing Target End Date and changing Iteration manually are separate actions.
- Split is not Carryover and is not included in Carryover report.
- Estimate, To Do and Actual remain independent.
- Repeated Carryovers use consecutive snapshots for Actual attribution.

There is no unresolved business decision required to start estimation. API contract, database schema, migration and deployment design remain Development responsibilities and must satisfy the business identity, atomicity and reporting rules in `FEATURE.md`.
