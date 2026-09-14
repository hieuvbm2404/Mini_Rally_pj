# Phase 7 (After MVP) — Story Date Tracking and Carryover SRS

## 0. Document control

| Attribute | Value |
|---|---|
| Feature code | `CO` |
| Feature | Story Date Tracking and Carryover |
| Product | Rova / Mini Rally |
| Phase | Phase 7 — After MVP |
| Status | Business scope and clickable mockup approved by BA |
| Updated | 2026-09-14 |
| Feature backlog | `FE-37` |
| Delivery stories | `US-109` to `US-118` |
| Primary sources | `FEATURE.md`, `USER_STORIES.md`, current clickable mockup in `03_Mockup Design` |
| Production status | Mockup only; persistence and production integration are not proven |

This SRS defines the approved business behavior shown by the current mockup and its Feature/User Story package. It does not define an API, physical database schema, migration, deployment topology or new authorization model.

## 1. Purpose

The Feature lets a team identify when a Story or Task actually starts and ends, forecast a Story completion date, and explicitly carry the same Story across Iterations when the forecast exceeds its current Iteration.

The system must preserve Story and Task identity, history and independent effort values while making each accepted Carryover traceable in Revision History and reports.

Carryover is not Split Unfinished. Split creates two Story outcomes according to the separate Split SRS; Carryover keeps one Story ID and moves it with all child Tasks.

## 2. Scope

### 2.1 In scope

- Story Start Date, Target End Date and Actual End Date on Story Detail.
- Story Start Date and Target End Date columns on Iteration Status.
- Task Start Date and Actual End Date on the Task list and Task Detail.
- Automatic first-start and first-completion date recording from existing state changes.
- A Story Target End Date picker constrained by Start Date and eligible Iterations.
- Carryover confirmation when Target End Date exceeds the current Iteration.
- Target Iteration resolution for one or multiple eligible Iterations.
- Atomic movement of the same Story and all child Tasks.
- Repeated Carryovers with separate immutable events.
- Manual Iteration movement and independent Target End Date clearing.
- Carryover and Manual Move evidence in Story Revision History.
- Compact Carry In/Carry Out context in Iteration Burndown and Team Capacity.
- A dedicated Carryover report with Iteration and Direction filters, KPI cards, trend chart, event details and existing export behavior.
- Per-Iteration Actual attribution using consecutive Carryover snapshots.

### 2.2 Out of scope

- Automatic Carryover without user confirmation.
- Split Unfinished behavior or creation of `[Unfinished]` and `[Continued]` Stories.
- Split or Manual Move events in the Carryover report.
- Carryover of a Defect, Task or Test Case as the primary Work Item.
- Moving only selected Tasks during Carryover.
- Bulk Carryover of multiple Stories.
- Direct editing of Start Date or Actual End Date.
- New reminders, email, browser notifications or escalation.
- Changes to Velocity classification or formulas.
- New roles or permissions.
- API, physical database, migration or deployment design.

## 3. Users and authorization

| User type | Approved behavior |
|---|---|
| Story editor | View lifecycle dates; set or clear Target End Date; review, cancel or accept Carryover; change Iteration through the existing authorized field |
| Task editor | Change Task state through existing behavior and thereby trigger system-managed lifecycle dates |
| Read-only user | View dates, history and permitted reports; cannot edit Target End Date or initiate Carryover |
| Report reader | Open the existing Reports area, review Carryover information and export only when the existing report-export permission allows |

This Feature grants no permission by itself. Every action continues to use the existing Story, Task, Iteration and Reports permissions.

## 4. Terms and field definitions

| Term or field | Definition | Edit mode |
|---|---|---|
| Story Start Date | Date the Story first enters `In-Progress` | System managed, read-only |
| Story Target End Date | User forecast for when the Story is expected to finish | Editable by an authorized Story editor; may be cleared |
| Story Actual End Date | Date the Story first enters `Accepted` | System managed, read-only |
| Task Start Date | Date the Task first enters `In-Progress` | System managed, read-only |
| Task Actual End Date | Date the Task first enters `Completed` | System managed, read-only |
| Carryover | Confirmed movement of the same Story and all child Tasks from a source Iteration to an eligible target Iteration |
| Carryover Event | Immutable evidence of one accepted Carryover, including movement and effort snapshots |
| Manual Move Event | Evidence created when an authorized user changes Story Iteration directly rather than through Carryover |
| Carry In | A Carryover Event whose target is the selected Iteration |
| Carry Out | A Carryover Event whose source is the selected Iteration |

## 5. Lifecycle date behavior

### 5.1 Story dates

- When a Story first enters `In-Progress`, set Start Date to the current date.
- When a Story first enters `Accepted`, set Actual End Date to the current date.
- Do not overwrite an existing Start Date or Actual End Date when the Story later changes state.
- Reopening the Story, manually changing Iteration or accepting Carryover must not clear or recalculate either lifecycle date.
- Before its triggering state transition, the corresponding date is blank and displayed as `Not set` in the mockup.

### 5.2 Task dates

- When a Task first enters `In-Progress`, set Start Date to the current date.
- When a Task first enters `Completed`, set Actual End Date to the current date.
- Do not overwrite an existing Start Date or Actual End Date when the Task is reopened or changes state later.
- A Task following its Story to another Iteration retains both dates.
- The Task list and Task Detail must show the same persisted values.

### 5.3 Date presentation

| Surface | Story fields | Task fields |
|---|---|---|
| Story Detail | Start Date, Target End Date, Actual End Date | Not applicable |
| Iteration Status | Start Date, Target End | Not shown as Task rows |
| Task list in Story Detail | Not applicable | Start Date, Actual End Date |
| Task Detail | Not applicable | Start Date, Actual End Date |

## 6. Target End Date behavior

### 6.1 General rules

- Target End Date exists only on a User Story.
- It is a forecast and is separate from Actual End Date.
- An authorized Story editor may select a value or clear the field.
- Clearing Target End Date must not move the Story or delete transition history.
- A read-only user can see the value but cannot change it.

### 6.2 Date picker boundaries

The picker enables only dates that satisfy all applicable conditions:

1. If Story Start Date exists, the date is not earlier than Start Date.
2. If Story Start Date is blank, the first enabled date is the start of the current eligible Iteration.
3. The date belongs to the current or a future Iteration.
4. The Iteration belongs to the same Project and Team as the Story.
5. The Iteration is in `Planning` or `Committed` state.

A date outside every eligible Iteration is disabled and cannot initiate Carryover.

### 6.3 Date inside the current Iteration

When the selected Target End Date is inside the current Iteration:

- save the forecast;
- keep the Story in the current Iteration;
- do not open the Carryover confirmation;
- do not create a Carryover Event.

### 6.4 Date after the current Iteration

When the selected Target End Date is later than the current Iteration end:

- open the Carryover confirmation;
- do not save the new date yet;
- do not move the Story or Tasks yet;
- do not create an event before the user accepts.

## 7. Carryover confirmation

### 7.1 Information shown

The confirmation shows:

- message `This User Story will carry over`;
- selected Target End Date;
- source Iteration name and date range;
- proposed target Iteration name and date range;
- Story ID;
- total child Task count;
- unfinished child Task count;
- actions `Cancel` and `Accept & Carry Over`.

### 7.2 Target resolution

- If exactly one eligible Iteration contains the date, show it as the proposed target.
- If multiple eligible Iterations contain the date, require the user to select one target before acceptance.
- If no eligible Iteration contains the date, show the no-destination state and keep acceptance disabled.

### 7.3 Cancel behavior

Canceling with `Cancel`, close or `Escape`:

- closes the confirmation;
- preserves the existing Target End Date;
- preserves Story Iteration and all Tasks;
- creates no Carryover Event.

## 8. Carryover acceptance

When the user selects `Accept & Carry Over`, the system performs one atomic business action:

1. Save the selected Target End Date.
2. Assign the same Story ID to the selected target Iteration.
3. Keep every child Task under the same Story.
4. Make those Tasks visible in the target Story scope without duplication or omission.
5. Preserve Story content, relationships, owner, Plan Estimate, lifecycle dates and earlier history.
6. Preserve Task IDs, owners, state, dates, description and independent Estimate, To Do and Actual values.
7. Append exactly one Carryover Event.

If any required part fails, no partial Story, Task, date or event change may remain persisted.

## 9. Carryover and manual-move history

### 9.1 Carryover Event content

Each accepted Carryover Event records at least:

- stable event ID;
- event type `Carryover`;
- actor and event time;
- Story ID;
- source Iteration ID;
- target Iteration ID;
- selected Target End Date;
- each child Task ID;
- each Task State, Estimate, To Do and cumulative Actual at the movement boundary.

Stable IDs are the attribution keys. Display names are presentation only.

### 9.2 Repeated Carryover

- The same Story may be carried over more than once.
- Each acceptance appends one new ordered Carryover Event.
- Earlier events remain unchanged.
- The Story and Task IDs remain the same across the complete chain.

### 9.3 Manual Iteration movement

- Existing authorized editing of the Story Iteration remains available after Carryover.
- A direct Iteration change moves the same Story and keeps its Tasks under it.
- Record the change as a `Manual Move` Event.
- Do not create, replace or delete a Carryover Event.
- Clearing Target End Date is a separate action and does not automatically change Iteration.

### 9.4 Revision History

Story Revision History shows both Carryover and Manual Move events with distinct labels. A Carryover entry shows actor, event time, source Iteration, target Iteration and Target End Date.

Clearing Target End Date or moving the Story manually must not remove earlier Carryover entries.

## 10. Effort behavior across Iterations

### 10.1 Independent Task values

Task Estimate, To Do and Actual remain independent persisted values. Carryover must not derive, reset or overwrite one value from another.

### 10.2 Actual attribution

- Task Detail continues to show the Task's full cumulative Actual.
- Source Iteration Actual includes cumulative Actual only up to the outbound Carryover snapshot.
- Target Iteration Actual includes only the increase after its inbound snapshot.
- When another Carryover occurs, the current target interval ends at the next outbound snapshot.
- Consecutive snapshots form non-overlapping intervals, so the same Actual hours are not attributed to more than one Iteration.

Conceptually, for one Task and one Iteration interval:

```text
Attributed Actual = later cumulative Actual boundary - earlier cumulative Actual boundary
```

The result cannot be below zero. This formula is report attribution only and does not replace the Task's persisted cumulative Actual.

## 11. Iteration Burndown and Team Capacity

### 11.1 Iteration Burndown

When the selected Iteration has Carryover activity, show a compact Carryover badge containing:

- Carry In count when greater than zero;
- Carry Out count when greater than zero;
- transferred To Do hours;
- `View report` action.

Selecting the badge opens Carryover report in the selected Iteration scope. Carryover is not added as a new series to the Burndown chart. Existing Split markers and Split calculations remain separate.

### 11.2 Team Capacity

- Capacity hours do not change because of Carryover.
- Task Estimate and To Do follow the Story's current Iteration scope.
- Actual uses the Carryover boundaries in section 10.
- Show the same compact Carry In/Carry Out badge and report link when activity exists.
- Existing member and `Unassigned` grouping behavior remains unchanged.

## 12. Dedicated Carryover report

### 12.1 Entry and permission

- Add `Carryover` to the existing Reports Type selector.
- Reuse existing Reports read and export permissions.
- Scope data by the current Project and Team context.
- Reports are read-only.

### 12.2 Filters

| Filter | Values | Effect |
|---|---|---|
| Iteration | Available Iterations in the current Project/Team scope | Selects the Iteration used by KPI, chart and rows |
| Direction | `All`, `Carry In`, `Carry Out` | Filters detail rows only |

The Direction filter does not change saved data, KPI cards or the cross-Iteration trend.

### 12.3 KPI cards

| KPI | Calculation |
|---|---|
| Carry In | Count of Carryover Events whose target is the selected Iteration |
| Carry Out | Count of Carryover Events whose source is the selected Iteration |
| Transferred To Do | Sum of Task To Do snapshots from Carryover Events involving the selected Iteration |
| Carryover Rate | Unique Story IDs carried into or out of the selected Iteration divided by unique Story IDs scheduled in that Iteration scope, including Stories later carried out |

When the Carryover Rate denominator is zero, display `0%`.

### 12.4 Trend chart

Show Carry In and Carry Out event counts for every available Iteration in the active Project and Team scope.

### 12.5 Event detail list

The list shows these columns in order:

1. Direction
2. Work Item
3. Name
4. From
5. To
6. Moved On
7. Start Date
8. Target End
9. Estimate
10. To Do
11. Actual Before
12. Actual After

Only Carryover Events are included. Split and Manual Move events are excluded.

When no event matches the selected scope and Direction, show `No Carryover events for this Iteration.`

### 12.6 Export

When the user has existing report-export permission, export the active Project, Team, Iteration and Direction scope. The export must use the same Carryover data and row filtering as the displayed report.

## 13. Validation and interaction states

| Condition | Required result |
|---|---|
| Story is read-only | Show lifecycle dates; disable Target End Date editing and Carryover |
| Target End Date is earlier than Story Start Date | Disable the date |
| Story Start Date is blank | Disable dates before the current eligible Iteration start |
| Date is outside eligible current/future Iterations | Disable the date |
| Candidate Iteration belongs to another Project or Team | Do not enable its dates |
| Candidate Iteration is not `Planning` or `Committed` | Do not enable its dates |
| Date is inside current Iteration | Save forecast without Carryover |
| Date is after current Iteration | Open confirmation without persisting movement |
| More than one eligible target contains the date | Require target selection |
| No eligible target contains the date | Show no-destination state; disable acceptance |
| User cancels or closes | Preserve all existing data |
| Carryover persistence fails | Persist no partial movement or event |
| Carryover report has no row | Show the approved empty state |

The Feature does not add a toast, email, browser notification or external message.

## 14. Acceptance criteria

1. **Given** a Story without Start Date, **when** it first enters `In-Progress`, **then** the current date is saved once and shown read-only.
2. **Given** a Story without Actual End Date, **when** it first enters `Accepted`, **then** the current date is saved once and shown read-only.
3. **Given** a Task without Start Date, **when** it first enters `In-Progress`, **then** the current date is saved once and shown read-only.
4. **Given** a Task without Actual End Date, **when** it first enters `Completed`, **then** the current date is saved once and shown read-only.
5. **Given** an existing lifecycle date, **when** the item is reopened, changes state or changes Iteration, **then** the original date remains unchanged.
6. **Given** a Story Start Date, **when** Target End Date picker opens, **then** all earlier dates are disabled.
7. **Given** no Story Start Date, **when** the picker opens, **then** dates before the current eligible Iteration start are disabled.
8. **Given** Project, Team and Iteration constraints, **when** the picker opens, **then** only dates inside eligible current/future Iterations are enabled.
9. **Given** an enabled date inside the current Iteration, **when** it is selected, **then** Target End Date is saved and no Carryover Event is created.
10. **Given** an enabled date after the current Iteration, **when** it is selected, **then** the confirmation opens before any movement or save occurs.
11. **Given** one eligible target, **when** confirmation opens, **then** that target and the approved Story/Task summary are shown.
12. **Given** multiple eligible targets, **when** confirmation opens, **then** acceptance remains unavailable until one target is selected.
13. **Given** no eligible target, **when** confirmation opens, **then** the no-destination state is shown and acceptance is disabled.
14. **Given** an open confirmation, **when** the user cancels, closes or presses `Escape`, **then** no Story, Task, date or event data changes.
15. **Given** a valid proposal, **when** `Accept & Carry Over` is selected, **then** the same Story and all child Tasks move atomically to the selected target Iteration.
16. **Given** accepted Carryover, **then** Story and Task identities, relationships, lifecycle dates, content and independent effort values are preserved.
17. **Given** accepted Carryover, **then** exactly one event records source, target, Target End Date, actor, time and per-Task effort snapshots.
18. **Given** a failed required update, **when** Carryover is attempted, **then** no partial movement, date or event remains persisted.
19. **Given** repeated Carryovers, **then** each movement creates a separate ordered event while earlier events remain immutable.
20. **Given** a manual Iteration edit, **when** it is saved, **then** a Manual Move Event is added and no Carryover Event is created or deleted.
21. **Given** an existing Target End Date, **when** it is cleared, **then** Iteration and transition history remain unchanged.
22. **Given** Carryover history, **when** Revision History opens, **then** Carryover and Manual Move entries are distinguishable and retain their original transition data.
23. **Given** a Task crosses Iterations, **when** Actual is reported, **then** consecutive snapshots produce non-overlapping Actual intervals without changing cumulative Task Actual.
24. **Given** Carryover activity in an Iteration, **when** Burndown or Team Capacity opens, **then** the compact Carry In/Out context and report link are shown.
25. **Given** Carryover report, **when** Iteration or Direction changes, **then** the approved rows and active scope update without changing saved event data.
26. **Given** Carryover report, **then** KPI cards and the trend use only Carryover Events and exclude Split and Manual Move.
27. **Given** export permission, **when** Carryover report is exported, **then** the export reflects the active report scope and filters.

## 15. User Story traceability

| Slice | Rova item | SRS coverage |
|---|---|---|
| CO-01 — Record Story lifecycle dates | `US-109` | Sections 5.1, 5.3, 14 AC1–AC2 and AC5 |
| CO-02 — Record Task lifecycle dates | `US-110` | Sections 5.2, 5.3, 14 AC3–AC5 |
| CO-03 — Select and validate Story Target End Date | `US-111` | Section 6, section 13, 14 AC6–AC10 |
| CO-04 — Review Carryover and resolve its target Iteration | `US-112` | Section 7, 14 AC10–AC14 |
| CO-05 — Commit same-ID Carryover atomically | `US-113` | Sections 8 and 9.1–9.2, 14 AC15–AC19 |
| CO-06 — Recover through manual Iteration move and Target End clearing | `US-114` | Sections 6.1 and 9.3, 14 AC20–AC21 |
| CO-07 — Trace Carryover in Revision History | `US-115` | Section 9.4, 14 AC22 |
| CO-08 — Show compact Carryover context in Iteration Burndown | `US-116` | Section 11.1, 14 AC24 |
| CO-09 — Attribute Carryover effort in Team Capacity | `US-117` | Sections 10 and 11.2, 14 AC23–AC24 |
| CO-10 — Review the dedicated Carryover report | `US-118` | Section 12, 14 AC25–AC27 |

## 16. Mockup mapping

| Mockup area | Source |
|---|---|
| Lifecycle-date stamping and shared state | `03_Mockup Design/src/app/App.tsx` |
| Story, Task and transition-event model | `03_Mockup Design/src/app/model.ts` |
| Iteration Status Start Date and Target End columns | `03_Mockup Design/src/app/pages/IterationStatusPage.tsx` |
| Story/Task dates, Target End picker, Carryover modal, manual move and Revision History | `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx` |
| Burndown and Capacity badges, effort attribution and Carryover report | `03_Mockup Design/src/app/pages/ReportsPage.tsx` |

The clickable mockup uses local in-memory state. It demonstrates the approved UI and business flow but does not prove API persistence, transaction handling, server-side authorization, database migration or production readiness.

## 17. Related specifications

- `04_Developement_tracking/Phase 1/04_Task_Management/SRS.md`
- `04_Developement_tracking/Phase 1/05_Time_Tracking/SRS.md`
- `04_Developement_tracking/Phase 2/02_Iterations/SRS.md`
- `04_Developement_tracking/Phase 2/03_Iteration_Status/SRS.md`
- `04_Developement_tracking/Phase 6/02_Iteration_Burndown/SRS.md`
- `04_Developement_tracking/Phase 6/04_Team_Capacity/SRS.md`
- `04_Developement_tracking/Phase 7 (After MVP)/Split Unfinished/SRS.md`
- `FEATURE.md` in this folder
- `USER_STORIES.md` in this folder
