import type { IterationItem, Owner, StatusType, TaskItem, TestCaseItem, TestCaseResultItem, WorkItem } from "./model";

export interface SplitSideDraft {
  title: string;
  release: string;
  releaseId?: string;
  status: StatusType;
  planEstimate: number;
}

export interface StorySplitPlan {
  targetIterationId: string;
  unfinished: SplitSideDraft;
  continued: SplitSideDraft;
  unfinishedTaskIds: string[];
  unfinishedDefectIds: string[];
  unfinishedTestCaseIds: string[];
}

export type StorySplitSide = "unfinished" | "continued";

export interface SplitTaskSnapshot extends TaskItem {
  splitSide: StorySplitSide;
}

export interface StorySplit {
  id: string;
  at: string;
  actor: Owner;
  projectKey: string;
  team: string;
  continuedId: string;
  unfinishedId: string;
  sourceIterationId: string;
  targetIterationId: string;
  sourceIteration: string;
  targetIteration: string;
  sourceMarkerDate: string;
  targetMarkerDate: string;
  originalPlanEstimate: number;
  unfinishedPlanEstimate: number;
  continuedPlanEstimate: number;
  movedTodoHours: number;
  actualHoursAtSplit: number;
  taskSnapshots: SplitTaskSnapshot[];
  defectAssignments: Array<{ id: string; splitSide: StorySplitSide; iteration: string }>;
  testCaseAssignments: Array<{ id: string; splitSide: StorySplitSide }>;
}

export function splitTargets(item: WorkItem, iterations: IterationItem[]) {
  const source = iterations.find(iteration => iteration.name === item.iteration && iteration.projectKey === item.project);
  if (!source) return [];
  return iterations.filter(iteration => iteration.projectKey === item.project &&
    (iteration.team || "") === (item.team || "") && iteration.state !== "Accepted" &&
    iteration.startDate.slice(0, 10) > source.endDate.slice(0, 10))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function splitUnavailableReason(item: WorkItem) {
  if (item.type !== "Story") return "Only User Stories can be split.";
  if (["Completed", "Accepted", "Release"].includes(item.status)) return "Choose an unfinished User Story.";
  if (item.iteration === "Unscheduled") return "Assign this story to an iteration before splitting.";
  return "";
}

export function splitActionReason(item: WorkItem, iterations: IterationItem[], editable: boolean) {
  if (!editable) return "The user cannot split this Story because they cannot edit it.";
  const itemReason = splitUnavailableReason(item);
  if (itemReason) return itemReason;
  if (splitTargets(item, iterations).length === 0) return "No later open Iteration matches the Story's Project and Team.";
  return "";
}

function clampDateToIteration(value: string, iteration: IterationItem) {
  const date = value.slice(0, 10);
  const start = iteration.startDate.slice(0, 10);
  const end = iteration.endDate.slice(0, 10);
  if (date < start) return start;
  if (date > end) return end;
  return date;
}

export function buildStorySplit(item: WorkItem, allItems: WorkItem[], allTasks: TaskItem[], allTestCases: TestCaseItem[], allResults: TestCaseResultItem[], source: IterationItem, target: IterationItem, plan: StorySplitPlan, at: string, actor: Owner) {
  const reason = splitUnavailableReason(item);
  if (reason) throw new Error(reason);
  const unfinishedId = `US-${Math.max(0, ...allItems.filter(row => row.id.startsWith("US-")).map(row => Number(row.id.slice(3)) || 0)) + 1}`;
  const originalTasks = allTasks.filter(task => task.parentWorkItemId === item.id);
  const unfinishedTasks = new Set(plan.unfinishedTaskIds);
  const unfinishedDefects = new Set(plan.unfinishedDefectIds);
  const unfinishedTestCases = new Set(plan.unfinishedTestCaseIds);

  const nextTasks = allTasks.map(task => task.parentWorkItemId !== item.id ? task : {
    ...task,
    parentWorkItemId: unfinishedTasks.has(task.id) ? unfinishedId : item.id,
  });
  const nextTestCases = allTestCases.map(testCase => testCase.parentWorkItemId !== item.id ? testCase : {
    ...testCase,
    parentWorkItemId: unfinishedTestCases.has(testCase.id) ? unfinishedId : item.id,
  });
  // A saved Result keeps the Work Product captured when that execution occurred.
  // Moving its Test Case must not rewrite historical execution evidence.
  const nextResults = allResults;

  const continuedBase: WorkItem = {
    ...item,
    title: plan.continued.title,
    iteration: target.name,
    release: plan.continued.release,
    releaseId: plan.continued.releaseId,
    status: plan.continued.status,
    planEstimate: plan.continued.planEstimate,
    lastUpdated: at,
  };
  const unfinishedBase: WorkItem = {
    ...item,
    id: unfinishedId,
    title: plan.unfinished.title,
    iteration: item.iteration,
    release: "Unscheduled",
    releaseId: undefined,
    featureId: undefined,
    parentWorkItemId: undefined,
    status: "Accepted",
    planEstimate: plan.unfinished.planEstimate,
    acceptedDate: at,
    lastUpdated: at,
    attachmentCount: 0,
    commentCount: 0,
  };

  const nextItemsWithoutStories = allItems.map(row => {
    if (row.id === item.id) return continuedBase;
    if (row.type !== "Defect" || row.parentWorkItemId !== item.id) return row;
    const historical = unfinishedDefects.has(row.id);
    // Split changes the Defect's parent only. An explicitly assigned Iteration
    // remains untouched and may differ from the selected Story side.
    return { ...row, parentWorkItemId: historical ? unfinishedId : item.id };
  });
  const nextItemsWithStories = [...nextItemsWithoutStories, unfinishedBase];
  function withRollups(story: WorkItem) {
    const children = nextTasks.filter(task => task.parentWorkItemId === story.id);
    return {
      ...story,
      taskCount: children.length,
      completedTasks: children.filter(task => task.state === "Completed").length,
      taskEstimate: children.reduce((sum, task) => sum + task.estimate, 0),
      todoEstimate: children.reduce((sum, task) => sum + task.todo, 0),
      defectCount: nextItemsWithStories.filter(row => row.type === "Defect" && row.parentWorkItemId === story.id).length,
    };
  }
  const items = nextItemsWithStories.map(row => row.id === item.id || row.id === unfinishedId ? withRollups(row) : row);
  const record: StorySplit = {
    id: `SPLIT-${unfinishedId}`,
    at,
    actor,
    projectKey: item.project || "",
    team: item.team || "",
    continuedId: item.id,
    unfinishedId,
    sourceIterationId: source.id,
    targetIterationId: target.id,
    sourceIteration: item.iteration,
    targetIteration: target.name,
    sourceMarkerDate: clampDateToIteration(at, source),
    targetMarkerDate: clampDateToIteration(at, target),
    originalPlanEstimate: item.planEstimate,
    unfinishedPlanEstimate: plan.unfinished.planEstimate,
    continuedPlanEstimate: plan.continued.planEstimate,
    movedTodoHours: originalTasks.filter(task => !unfinishedTasks.has(task.id)).reduce((sum, task) => sum + task.todo, 0),
    actualHoursAtSplit: originalTasks.reduce((sum, task) => sum + task.actuals, 0),
    taskSnapshots: originalTasks.map(task => ({ ...task, splitSide: unfinishedTasks.has(task.id) ? "unfinished" : "continued" })),
    defectAssignments: allItems.filter(row => row.type === "Defect" && row.parentWorkItemId === item.id).map(row => ({ id: row.id, splitSide: unfinishedDefects.has(row.id) ? "unfinished" : "continued", iteration: row.iteration })),
    testCaseAssignments: allTestCases.filter(row => row.parentWorkItemId === item.id).map(row => ({ id: row.id, splitSide: unfinishedTestCases.has(row.id) ? "unfinished" : "continued" })),
  };
  return { items, tasks: nextTasks, testCases: nextTestCases, results: nextResults, record };
}
