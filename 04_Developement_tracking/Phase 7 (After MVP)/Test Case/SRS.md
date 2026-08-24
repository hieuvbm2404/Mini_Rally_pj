# Phase 7 (After MVP) — Test Case and Test Results SRS

## 0. Document control

| Attribute | Value |
|---|---|
| Status | Test Case and Test Results mockups approved by BA |
| Updated | 2026-08-24 |
| Phase | Phase 7 — After MVP |
| Feature | Test Case and Test Results |
| Source of truth | Current clickable mockup in `03_Mockup Design` |
| Production status | Mockup only |

This SRS records only the behavior and fields defined in the approved mockup. Technical design that is not visible in the mockup is not specified here.

## 1. Scope

The approved mockup includes:

- Project Test Case Type configuration;
- Test Cases tab on Story/Defect Detail;
- Create Test Case modal;
- Test Case list and Test Case Detail;
- Results tab on Test Case Detail;
- Add Test Result modal;
- Results list and Test Result Detail;
- Revision History tabs shown on Test Case and Test Result Detail.

There is no separate Test Steps list. Validation is recorded through `Validation Input` and `Validation Expected Result` on Test Case Detail.

## 2. Main navigation

```text
Story/Defect Detail
→ Test Cases
→ Select Test Case ID
→ Test Case Detail
→ Results
→ Select Result Build
→ Test Result Detail
```

Creation flow:

```text
Story/Defect Detail
→ Test Cases
→ Add New
→ Create Test Case
→ Test Case Detail
→ Results
→ Add Result
→ Save Result
→ Test Result Detail
```

## 3. Project Test Case Type configuration

### 3.1 Location

The configuration is shown in:

```text
Settings → Workspaces & Projects → select a Project → Details
```

It is configured per Project. The Workspace summary does not contain this configuration.

### 3.2 Default values

Every new Project starts with five Types:

1. Acceptance
2. Functional
3. Regression
4. Performance
5. Usability

### 3.3 Add Type

- Workspace Admin sees the `Add New` button.
- Clicking `Add New` opens the `Add Test Case Type` modal.
- The modal contains `Name`, `Cancel` and `Save`.
- Name is required, trimmed, limited to 60 characters and cannot duplicate another Type in the same Project without regard to letter case.
- Saving adds the Type to the current Project list.
- Cancel or closing the modal makes no change.

### 3.4 Remove Type

- Workspace Admin sees an `×` action on each Type.
- Clicking `×` opens a confirmation dialog.
- Cancel keeps the Type.
- Confirm removes the Type from the selectable list of the current Project.
- Existing Test Cases continue to show their historical Type value.

## 4. Test Cases tab

### 4.1 Position and count

- The tab is shown immediately after `Tasks` on Story/Defect Detail.
- The tab displays the number of Test Cases linked to the current Work Item.

### 4.2 List columns

The list shows these columns in order:

1. Select checkbox
2. Rank
3. ID
4. Name
5. Type
6. Method
7. Priority
8. Owner
9. Last Verdict
10. Last Run

Clicking Test Case ID opens Test Case Detail.

When no Test Case exists, the page shows an empty state and the `Add New` action.

## 5. Create Test Case

Clicking `Add New` opens `Create Test Case`.

| Field | Mockup behavior |
|---|---|
| Name | Required; blank initially |
| Type | Select from the current Project Type list; defaults to the first available Type |
| Method | `Manual` or `Automated`; defaults to `Manual` |
| Priority | `Low`, `Normal`, `High` or `Urgent`; defaults to `Normal` |
| Owner | Select from Project members; defaults to the current role's mapped user when that user is available |

Actions:

- `Create` is disabled while Name is blank.
- `Cancel` or `×` closes the modal without creating a Test Case.
- `Create` creates a blank Test Case linked to the current Story/Defect.

After creation:

- Rank is placed after the existing Test Cases of the same Work Item.
- Project and Team are inherited from the current Story/Defect.
- A Work Item without Team is displayed as `Project backlog`.
- Assigned To starts as `Unassigned`.
- Last Verdict starts as `Not Run` and Last Run is blank.
- Description and the other Test Case content fields start blank.

## 6. Test Case Detail

### 6.1 Header and tabs

The header shows Test Case badge, ID and Name.

Tabs:

1. Details
2. Results, with a flask icon and Result count
3. Revision History

Back returns to the Test Cases list of the same Story/Defect.

### 6.2 Details — left side

The left side contains editable sections:

1. Description
2. Objective
3. Pre-conditions
4. Validation Input
5. Validation Expected Result
6. Post-conditions
7. Notes
8. Attachments

Attachments show the attached file names and a `Drag or click to add attachments` action.

### 6.3 Details — right side

| Field | Behavior |
|---|---|
| Owner | Editable; options are Project members |
| Project | Read-only; inherited from the Work Product |
| Team | Read-only; inherited from the Work Product |
| Assigned To | Editable; `Unassigned` or a Project member |
| Type | Editable; uses the current Project Types and keeps the Test Case's historical current value |
| Method | Editable; `Manual` or `Automated` |
| Priority | Editable; `Low`, `Normal`, `High` or `Urgent` |
| Last Verdict | Read-only; taken from the latest Result, otherwise `Not Run` |
| Last Run | Read-only; date of the latest Result, otherwise `Not run yet` |
| Work Product | Read-only; current Story/Defect |

Owner and Assigned To are separate fields.

### 6.4 Revision History

The tab displays Test Case activity using the Test Case ID, actor, action and current detail shown by the mockup.

## 7. Results tab

The Results tab represents saved execution results of the current Test Case.

Columns, in order:

1. Build
2. Date
3. Work Product
4. Verdict
5. Duration
6. Tester

Behavior:

- Results are ordered by Date newest first; creation time is used when dates are equal.
- Clicking Build opens Test Result Detail.
- `Add Result` opens the Add Test Result modal.
- When there is no Result, the page shows an empty state.

## 8. Add Test Result

| Field | Mockup behavior |
|---|---|
| Build | Required; blank initially |
| Date | Required; defaults to the current date |
| Verdict | `Pass`, `Fail`, `Blocked`, `Error` or `Inconclusive`; defaults to `Pass` |
| Duration (minutes) | Defaults to `0`; cannot be below `0` |
| Tester | Select from Project members; defaults to the current role's mapped user when available |
| Test Case | Read-only; auto-filled from the current Test Case |
| Work Product | Read-only; auto-filled from the linked Story/Defect |
| Notes | Optional; blank initially |

Actions:

- `Save Result` is disabled while Build, Date or Tester is missing.
- `Cancel` or `×` closes the modal without creating a Result.
- `Save Result` adds a new Result and opens its Test Result Detail.
- Adding a Result does not replace the previous Results.

## 9. Test Result Detail

### 9.1 Header and tabs

The header shows Test Result badge, Result ID and Build.

Tabs:

1. Details
2. Revision History

Back returns to the Results list of the same Test Case.

### 9.2 Details — left side

1. Build — editable
2. Attachments — shows files and the add attachment action
3. Verdict — editable with `Pass`, `Fail`, `Blocked`, `Error` and `Inconclusive`
4. Notes — editable

### 9.3 Details — right side

| Field | Behavior |
|---|---|
| Date | Editable |
| Tester | Editable; options are Project members |
| Test Case | Read-only |
| Work Product | Read-only |
| Duration (minutes) | Editable; cannot be below `0` |

### 9.4 Revision History

The tab displays the Result record shown by the mockup: Tester, Verdict, Build and Date.

## 10. Last Verdict and Last Run

- The latest Result is determined by Result Date, then creation time when dates are equal.
- Test Case `Last Verdict` displays the Verdict of that Result.
- Test Case `Last Run` displays the Date of that Result.
- When a Result is added or edited, these two read-only values are refreshed.
- A Test Case without Results displays `Not Run` and `Not run yet`.

## 11. Acceptance Criteria

1. Given a Story/Defect Detail, when the page opens, then `Test Cases` is shown immediately after `Tasks` with the linked count.
2. Given `Add New`, when Name is blank, then Create is disabled.
3. Given valid Test Case input, when Create is clicked, then a blank Test Case is linked to the current Story/Defect and inherits its Project and Team.
4. Given a Test Case ID, when it is clicked, then Test Case Detail opens with the approved left and right fields.
5. Given Owner or Assigned To is edited, then only Project members, plus `Unassigned` for Assigned To, are selectable.
6. Given Test Case Detail, then Project, Team, Last Verdict, Last Run and Work Product are read-only.
7. Given Test Case Detail, then no separate Test Steps list is shown.
8. Given the Results tab, then the approved six list columns are displayed newest first.
9. Given Add Result, when Build, Date or Tester is missing, then Save Result is disabled.
10. Given valid Result input, when Save Result is clicked, then a new Result is added without replacing earlier Results and its detail opens.
11. Given a Result Build, when it is clicked, then Test Result Detail opens with the approved left and right fields.
12. Given Test Result Detail, then Test Case and Work Product are read-only.
13. Given multiple Results, then Last Verdict and Last Run reflect the latest Result.
14. Given a new Project, then the five default Test Case Types are shown.
15. Given `Add New` in Project Test Case Type, when a valid unique Name is saved, then it is added to that Project.
16. Given a Type `×` action, when clicked, then confirmation is required before removal.
17. Given a removed Type is already used, then the existing Test Case continues to display that historical value.

## 12. Mockup mapping

| Mockup area | Source |
|---|---|
| Test Case and Result data/state | `03_Mockup Design/src/app/model.ts`, `App.tsx` |
| Test Case list/create/detail | `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx` |
| Results list/create/detail | `03_Mockup Design/src/app/pages/WorkItemDetailPage.tsx` |
| Project Test Case Type configuration | `03_Mockup Design/src/app/pages/WorkspaceProjectsPanel.tsx` |

The mockup uses local in-memory state. Persistence, API, database, production authorization and integration behavior are not defined by this SRS.
