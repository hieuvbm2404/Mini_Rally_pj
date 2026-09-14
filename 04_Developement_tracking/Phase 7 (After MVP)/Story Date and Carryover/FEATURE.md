# Feature Description — Story Date Tracking and Carryover

## 0. Document control

| Attribute | Value |
|---|---|
| Feature code | `CO` |
| Feature name | Story Date Tracking and Carryover |
| Product | Rova / Mini Rally |
| Phase | Phase 7 — After MVP |
| Status | BA approved for Phase 7; aligned with the approved clickable mockup and decisions on 2026-09-14 |
| Updated | 2026-09-14 |
| Detailed rules | `SRS.md` in this folder |
| Delivery backlog | `USER_STORIES.md` in this folder |

## 1. Feature summary

Story Date Tracking and Carryover records when a User Story or Task actually starts and ends, while allowing the Story owner to set a Target End Date for delivery forecasting.

When a Story Target End Date falls after its current Iteration, the system asks the user to review and confirm Carryover. An accepted Carryover keeps the same Story identity, moves the Story and all child Tasks to an eligible target Iteration, preserves history and effort, and exposes the transition in Revision History, Iteration reports and a dedicated Carryover report.

## 2. Business problem

A User Story can remain active across several Iterations. The current Iteration field shows only its latest location and does not explain when work started, when it completed, how often it crossed an Iteration boundary or how Actual hours should be attributed between Iterations.

Manually changing Iteration without an explicit transition record can make source history disappear from operational reports and can double-count cumulative Task Actual in later Iterations.

The Feature must:

- record system-managed start and actual-completion dates for Stories and Tasks;
- let users forecast a Story completion date without rewriting the actual dates;
- turn a forecast beyond the current Iteration into a reviewed Carryover action;
- preserve one Story identity and all child Task history across repeated Carryovers;
- attribute Task effort to the correct Iteration interval;
- present Carryover separately from Split Unfinished.

## 3. Business outcomes

The Feature is successful when:

1. A reviewer can see the first start date and first actual completion date of each supported item.
2. A user cannot select an invalid Target End Date.
3. Every accepted Carryover identifies the source Iteration, target Iteration, Target End Date and effort snapshot.
4. The same Story and its Tasks continue without identity or history loss.
5. Repeated Carryovers remain traceable as separate events without double-counting Actual hours.
6. Burndown and Team Capacity remain readable while a dedicated report explains Carry In and Carry Out.

No numerical KPI, SLA, Story Point or delivery-hour target is defined for this Feature.

## 4. Personas and access

### 4.1 Story editor

A user who already has permission to edit the selected User Story.

The user can:

- view system-managed lifecycle dates;
- set or clear the Story Target End Date;
- review, cancel or accept a Carryover proposal;
- change Iteration manually through existing authorized surfaces.

This Feature introduces no new role or edit permission. A user who cannot edit the Story sees the fields and history as read-only and cannot initiate Carryover.

### 4.2 Task editor

A user who already has permission to change a Task state through an authorized Work Item surface.

The user can trigger system-managed Task Start Date and Actual End Date through normal Task state changes. The user cannot directly edit those dates.

### 4.3 Report reader

A Workspace Admin or assigned-Project Admin who already has permission to open Reports under the Phase 6 permission model.

The reader can open Carryover report, change its Iteration and Direction filters, inspect Carryover metrics and export it when the existing report-export permission allows. Reports remain read-only.

### 4.4 Delivery reviewer

A Product Owner, Business Analyst, Team Lead or QA reviewer who uses lifecycle dates, Revision History and reports to understand work crossing Iterations. This usage persona grants no additional system permission.

## 5. Scope

### 5.1 In scope

- Story Start Date, Target End Date and Actual End Date on Story Detail.
- Story Start Date and Target End Date columns on Iteration Status.
- Task Start Date and Actual End Date on Task list and Task Detail.
- System-managed first-start and first-completion dates.
- Target End Date picker validation against Story Start Date and valid Iterations.
- Carryover review when Target End Date is beyond the current Iteration.
- Explicit target selection when more than one eligible Iteration contains the date.
- Same-ID Story movement with all child Tasks.
- Repeated Carryover events across multiple Iterations.
- Manual Iteration return and independent Target End Date clearing.
- Carryover Revision History.
- Compact Carryover badges in Iteration Burndown and Team Capacity.
- Dedicated Carryover report with KPI, trend chart, filters and event details.
- Per-Iteration Task Actual attribution using Carryover snapshots.

### 5.2 Out of scope

- Split Unfinished behavior, `[Unfinished]` or `[Continued]` Stories.
- Split events inside Carryover report.
- Automatic Carryover without explicit user confirmation.
- Carryover of a Defect, Task or Test Case as the primary Work Item.
- Partial selection of Tasks during Carryover.
- Bulk Carryover of multiple Stories.
- Editing system-managed Start Date or Actual End Date.
- Deadline reminders, email, browser notifications or escalation.
- New Velocity classifications or changes to Velocity formulas.
- Changing whether overlapping Iterations may be created.
- API, physical database schema, migration and production deployment design.

## 6. Business identity model

| Object | Identity before | Identity after | Business purpose |
|---|---|---|---|
| User Story | Existing Story ID in Source Iteration | Same Story ID in Target Iteration | Continue one delivery item without duplication |
| Child Task | Existing Task ID under the Story | Same Task ID under the same Story | Preserve Task content, dates, effort and history |
| Carryover Event | None for the new transition | New auditable event ID | Record one accepted source-to-target movement and effort snapshot |
| Manual Move Event | Current Iteration assignment | Same Story ID with another Iteration assignment | Record an authorized manual correction without deleting Carryover history |

Carryover never creates a replacement Story. Each accepted Carryover adds one event to the same Story. Repeated Carryovers produce an ordered event chain that can be reported per Iteration.

## 7. End-to-end user journey

### Stage 1 — Start work

The team changes a Story or Task to its active working state.

Expected experience:

- the system records Start Date only the first time the Story enters `In-Progress` or the Task enters `In-Progress`;
- the recorded date is visible and read-only.

### Stage 2 — Forecast Story completion

An authorized user opens Story Detail and selects Target End Date.

Expected experience:

- dates earlier than Story Start Date are disabled when Start Date exists;
- only dates belonging to the current or a future same-Project, same-Team Iteration in `Planning` or `Committed` are enabled;
- selecting a date inside the current Iteration saves the forecast without Carryover.

### Stage 3 — Review Carryover

The user selects a Target End Date after the current Iteration end.

Expected experience:

- the system opens a confirmation modal instead of moving the Story immediately;
- the modal shows current Iteration, eligible target Iteration, Target End Date, Story ID and Task counts;
- when multiple eligible Iterations contain the date, the user must choose the target.

### Stage 4 — Confirm or cancel

The user accepts or cancels the proposal.

Expected experience:

- Cancel closes the modal with no data changes;
- Accept moves the same Story and all Tasks, saves Target End Date and records one Carryover Event.

### Stage 5 — Continue or complete work

The same Story continues in the target Iteration and may cross another Iteration later.

Expected experience:

- Story and Task dates, values and history remain available;
- another accepted forecast beyond the new current Iteration creates another Carryover Event;
- entering the completion state records Actual End Date only once.

### Stage 6 — Review history and reports

The reviewer opens Revision History, Burndown, Team Capacity or Carryover report.

Expected experience:

- every transition is traceable;
- Burndown and Capacity show only a compact Carryover summary badge;
- the dedicated report shows event details, Carry In/Out and effort boundaries.

## 8. User flows

### 8.1 Target date inside current Iteration

```text
Story Detail
→ Open Target End Date picker
→ Select an enabled date inside the current Iteration
→ Save Target End Date
→ Story remains in the current Iteration
```

### 8.2 Carryover primary flow

```text
Story Detail
→ Select an enabled Target End Date after the current Iteration
→ Review source, target, Story and Task summary
→ Select target when multiple eligible Iterations contain the date
→ Accept & Carry Over
→ Same Story and all Tasks move to target
→ Carryover Event appears in history and reports
```

### 8.3 Ineligible or permission flow

```text
Story Detail
→ System evaluates item type, edit permission and valid target dates
→ Target End Date is read-only or no invalid date can be selected
→ No Carryover Event is created
→ Existing data remains unchanged
```

### 8.4 Validation flow

```text
Open Target End Date picker
→ Date is earlier than Start Date or outside every valid Iteration
→ Date remains disabled
→ No confirmation opens
→ Existing Target End Date and Iteration remain unchanged
```

### 8.5 Ambiguous target flow

```text
Select a date contained by multiple eligible Iterations
→ Confirmation lists those Iterations
→ User selects one target
→ Accept becomes actionable
→ Carryover uses the selected target
```

### 8.6 Cancel or recovery flow

```text
Carryover confirmation
→ Cancel, close or Escape
→ Modal closes
→ Target End Date, Iteration, Tasks and history remain unchanged
```

### 8.7 Manual return flow

```text
Authorized Story edit surface
→ User changes Iteration to an earlier valid Iteration
→ Same Story moves and a Manual Move Event is recorded
→ User may clear Target End Date separately
→ Existing Carryover Events remain unchanged
```

## 9. Business rules

### 9.1 Eligibility and permission rules

| ID | Rule |
|---|---|
| CO-BR-01 | Only a User Story supports Target End Date and Carryover as the primary item. |
| CO-BR-02 | The user must already have permission to edit the Story to set or clear Target End Date or accept Carryover. |
| CO-BR-03 | The Feature introduces no new role, Project, Team, Iteration or report permission. |
| CO-BR-04 | A Carryover target must belong to the same Project and Team as the Story. |
| CO-BR-05 | A Carryover target must be later than the current Iteration and have state `Planning` or `Committed`. |

### 9.2 Lifecycle date rules

| ID | Rule |
|---|---|
| CO-BR-06 | Story Start Date is set to the current date the first time the Story enters `In-Progress`. |
| CO-BR-07 | Story Actual End Date is set to the current date the first time the Story enters `Accepted`. |
| CO-BR-08 | Task Start Date is set to the current date the first time the Task enters `In-Progress`. |
| CO-BR-09 | Task Actual End Date is set to the current date the first time the Task enters `Completed`. |
| CO-BR-10 | Start Date and Actual End Date are read-only and are not recalculated or cleared by later state or Iteration changes. |
| CO-BR-11 | Carryover preserves the Story and Task lifecycle dates. |

### 9.3 Target End Date and Carryover rules

| ID | Rule |
|---|---|
| CO-BR-12 | Target End Date is a user-managed Story forecast and may be cleared independently. |
| CO-BR-13 | When Story Start Date exists, Target End Date cannot be earlier than Start Date. |
| CO-BR-14 | When Story Start Date is blank, the first enabled Target End Date is the start of the current valid Iteration. |
| CO-BR-15 | The picker enables only dates inside the current or a future same-Project, same-Team Iteration whose state is `Planning` or `Committed`. |
| CO-BR-16 | A date outside every eligible Iteration remains disabled and cannot initiate Carryover. |
| CO-BR-17 | Selecting a date inside the current Iteration saves Target End Date without changing Iteration. |
| CO-BR-18 | Selecting a date after the current Iteration opens Carryover confirmation and does not save or move anything before acceptance. |
| CO-BR-19 | If exactly one eligible Iteration contains the date, it is shown as the proposed target. |
| CO-BR-20 | If multiple eligible Iterations contain the date, the user must select one target before accepting. |
| CO-BR-21 | Confirmation shows source and target date ranges, Story ID, total Task count and unfinished Task count. |
| CO-BR-22 | Accepting Carryover moves the same Story ID to the selected target Iteration and saves the selected Target End Date. |
| CO-BR-23 | Every child Task remains under the same Story and therefore follows the Story into the target Iteration scope. |
| CO-BR-24 | Story content, relationships, owner, Plan Estimate, Task IDs, Task state, Estimate, To Do, Actual, dates and history remain unchanged unless the accepted action explicitly changes them. |
| CO-BR-25 | Cancel, close, Escape or validation failure changes no Story, Task, date or history data. |

### 9.4 Manual correction rules

| ID | Rule |
|---|---|
| CO-BR-26 | Existing authorized Iteration editing remains available after Carryover, including moving the Story to an earlier Iteration. |
| CO-BR-27 | A manual Iteration change records a Manual Move Event and does not create or delete a Carryover Event. |
| CO-BR-28 | Clearing Target End Date does not automatically change Iteration or delete transition history. |

### 9.5 Effort and report rules

| ID | Rule |
|---|---|
| CO-BR-29 | Estimate, To Do and Actual remain independent persisted Task measures. Carryover does not derive one from another. |
| CO-BR-30 | Each accepted Carryover captures source and target Iteration IDs, timestamp, Target End Date and per-Task State, Estimate, To Do and cumulative Actual. |
| CO-BR-31 | Source Iteration Actual includes only Actual attributed up to its outbound Carryover boundary. |
| CO-BR-32 | Target Iteration Actual starts at zero for carried work and includes only Actual added after inbound Carryover and before the next outbound Carryover, or current Actual when no later Carryover exists. |
| CO-BR-33 | Repeated Carryovers use consecutive event snapshots so the same Actual hours are not attributed to more than one Iteration. |
| CO-BR-34 | Iteration Burndown and Team Capacity show a compact badge with Carry In/Out count and transferred To Do; selecting it opens Carryover report for that Iteration. |
| CO-BR-35 | Carryover report contains only Carryover Events; Split and Manual Move events are excluded. |
| CO-BR-36 | Carry In is the count of Carryover Events whose target is the selected Iteration; Carry Out is the count whose source is the selected Iteration. |
| CO-BR-37 | Transferred To Do is the sum of To Do captured by all Carryover Events involving the selected Iteration. The Direction filter changes detail rows only, not this KPI. |
| CO-BR-38 | Carryover Rate is unique affected Story IDs divided by unique scheduled Story IDs in the selected Iteration scope, including Story IDs later carried out. |
| CO-BR-39 | The trend chart shows Carry In and Carry Out event counts for each available Iteration in the current Project and Team scope. |
| CO-BR-40 | Each report row shows Direction, Story, source, target, move date, Start Date, Target End Date, Estimate, To Do, cumulative Actual at move and post-move Actual interval. |
| CO-BR-41 | Direction filter supports All, Carry In and Carry Out and applies to report detail rows without changing saved data. |
| CO-BR-42 | Existing report export permission applies to Carryover report; the export uses the active scope and filters. |

### 9.6 Traceability rules

| ID | Rule |
|---|---|
| CO-BR-43 | One accepted Carryover creates exactly one Carryover Event on the same Story. |
| CO-BR-44 | Story Revision History shows the actor, event time, source Iteration, target Iteration and Target End Date. |
| CO-BR-45 | Carryover attribution uses stable Story, Task and Iteration IDs; display names are presentation only. |
| CO-BR-46 | Carryover Events remain immutable evidence when Target End Date is cleared or Iteration is changed manually. |

## 10. Data behavior summary

| Data | Before | User action or event | After | Must remain unchanged |
|---|---|---|---|---|
| Story Start Date | Blank | First entry to `In-Progress` | Current date saved | Story ID and existing history |
| Story Actual End Date | Blank | First entry to `Accepted` | Current date saved | Start Date and Target End Date |
| Task Start Date | Blank | First entry to `In-Progress` | Current date saved | Task ID and effort values |
| Task Actual End Date | Blank | First entry to `Completed` | Current date saved | Task ID, Start Date and Actual |
| Target End Date | Blank or existing forecast | User selects an enabled current-Iteration date | Forecast saved | Story Iteration |
| Target End Date | Blank or existing forecast | User selects a later-Iteration date | Pending until confirmation | All persisted data before acceptance |
| Story Iteration | Source | User accepts Carryover | Selected eligible target | Story identity and relationships |
| Child Tasks | Children of the Story | Carryover accepted | Same children in target Story scope | IDs, values, dates and history |
| Carryover Event | No event for the pending proposal | Carryover accepted | One immutable event appended | Earlier events |
| Manual Move Event | Current Iteration | Authorized manual change | One manual event appended | Existing Carryover Events |
| Target End Date | Existing forecast | User clears it | Blank | Iteration and transition history |
| Task Actual attribution | Cumulative Task Actual | Report evaluates consecutive Carryover boundaries | Non-overlapping Actual interval per Iteration | Task Detail cumulative Actual |

## 11. Interaction feedback contract

| Condition | Approved UI behavior |
|---|---|
| Read-only Story | Lifecycle dates remain visible; Target End Date editing is disabled |
| Date earlier than Start Date | Date is disabled in the picker |
| Date outside valid current/future Iterations | Date is disabled in the picker |
| Target Iteration is `Accepted` | Its dates are not valid Carryover targets |
| Target date is inside current Iteration | Save forecast without a modal |
| Target date is beyond current Iteration | Open Carryover confirmation |
| One eligible target contains date | Show it as the proposed target |
| Multiple eligible targets contain date | Show a target selector and require selection |
| No eligible target contains date | Accept remains unavailable and no data changes |
| User cancels or closes | Close modal and preserve existing data |
| Iteration has Carryover activity | Show compact summary badge in Burndown and Team Capacity |
| Carryover report has no matching event | Show an empty state for the selected filters |

The Feature adds no toast, email, browser notification or external message. It uses the confirmation modal, disabled picker dates, compact report badges and report empty state.

## 12. Dependencies and delivery boundary

### Functional dependencies

- Existing Story and Task state transitions and edit permissions.
- Phase 1 Task Management and Time Tracking independent effort rules.
- Phase 2 Iteration identity, date ranges, state and Project/Team assignment validation.
- Phase 2 Iteration Status Story and Task columns.
- Phase 6 Iteration Burndown, Team Capacity and report export permission.
- Split Unfinished remains a separate Feature and event type.

### Delivery boundary

The Feature is not complete when only fields and a confirmation modal exist in the frontend. Completion requires persisted lifecycle dates, atomic Carryover movement, immutable transition events, repeated-Carryover effort attribution, Revision History, Burndown/Capacity badges and the dedicated Carryover report to reconcile end to end.

The clickable mockup uses local in-memory state. It demonstrates approved interaction and reporting behavior but does not prove API persistence, authorization, database migration or production readiness.

## 13. References

- `USER_STORIES.md` — delivery slices and Acceptance Criteria.
- `03_Mockup Design/src/app/App.tsx` — Story/Task lifecycle-date behavior and shared state.
- `03_Mockup Design/src/app/model.ts` — Story, Task and transition-event mockup model.
- `03_Mockup Design/src/app/pages/IterationStatusPage.tsx` — Story date columns.
- `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx` — date picker, confirmation, manual move and Revision History.
- `03_Mockup Design/src/app/pages/ReportsPage.tsx` — Carryover badges, effort attribution and dedicated report.
- `04_Developement_tracking/Phase 1/04_Task_Management/SRS.md` — Task lifecycle and editing baseline.
- `04_Developement_tracking/Phase 1/05_Time_Tracking/SRS.md` — independent Estimate, To Do and Actual rules.
- `04_Developement_tracking/Phase 2/02_Iterations/SRS.md` — Iteration state, dates and assignment rules.
- `04_Developement_tracking/Phase 2/03_Iteration_Status/SRS.md` — Iteration Status baseline.
- `04_Developement_tracking/Phase 6/02_Iteration_Burndown/SRS.md` — Burndown baseline.
- `04_Developement_tracking/Phase 6/04_Team_Capacity/SRS.md` — Team Capacity baseline.
- `04_Developement_tracking/Phase 7 (After MVP)/Split Unfinished/FEATURE.md` — separate Split identity and reporting boundary.
