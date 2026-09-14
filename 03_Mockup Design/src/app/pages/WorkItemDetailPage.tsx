import { useState, type ReactNode } from "react";
import { AlertTriangle, AlignLeft, ArrowRight, AtSign, Bold, CalendarDays, CalendarClock, ChevronLeft, ChevronRight, ClipboardCheck, Code2, FileText, FlaskConical, History, ImagePlus, Italic, Link2, List, ListChecks, ListOrdered, Maximize2, Minimize2, MoreHorizontal, Plus, Redo2, Strikethrough, Table2, Underline, Undo2, X } from "lucide-react";
import { type Feature, type IterationItem, type MilestoneItem, type NewTaskInput, type NewTestCaseInput, type NewTestCaseResultInput, type Owner, type ReleaseItem, type Role, type ScopeProject, type StatusType, type TaskItem, type TaskState, type TestCaseItem, type TestCaseMethod, type TestCasePriority, type TestCaseResultItem, type TestCaseType, type TestCaseVerdict, type WorkItem, DEMO_ACCESS_PROFILES, OWNERS, PROJECT_MEMBER_OWNERS, SCOPE_PROJECTS } from "../model";
import { Avatar, TypeBadge, ScheduleStateBar } from "../components/shared";
import { splitActionReason, type StorySplit } from "../splitStory";

type DetailTab = "details" | "tasks" | "testCases" | "history";
type TaskDetailTab = "details" | "history";
type TestCaseDetailTab = "details" | "results" | "history";
type TestCaseResultDetailTab = "details" | "history";

const WORK_ITEM_STATE_OPTIONS = ["Idea", "Defined", "In-Progress", "Completed", "Accepted", "Release"];
const DEFECT_PRIORITY_OPTIONS = ["Low", "Normal", "High", "Urgent", "None"];
const DEFECT_PRIORITY_DEFAULTS: Record<string, string> = { Low: "Low", Medium: "Normal", High: "High", Critical: "Urgent" };

function iterationDateValue(value: string) {
  return value.slice(0, 10);
}

function formatCompactDate(value?: string | null) {
  return value || "Not set";
}

function calculateTaskTotals(tasks: TaskItem[]) {
  return tasks.reduce(
  (totals, task) => ({
    todo: totals.todo + task.todo,
    actuals: totals.actuals + task.actuals,
    estimate: totals.estimate + task.estimate,
  }),
  { todo: 0, actuals: 0, estimate: 0 },
  );
}

const TASK_GRID_COLUMNS = "44px 72px 110px minmax(300px,1fr) 140px 170px 160px 150px 112px 112px 90px 100px 100px";

const ACTIVITY_ROWS = [
  { id: "ACT-1007", at: "Today, 10:24", actor: OWNERS[0], action: "changed State", target: "US-4821", detail: "Defined → In-Progress" },
  { id: "ACT-1006", at: "Today, 10:18", actor: OWNERS[1], action: "updated Estimate", target: "TA-2292", detail: "3h → 5h" },
  { id: "ACT-1005", at: "Today, 09:42", actor: OWNERS[3], action: "created Task", target: "TA-2293", detail: "Add automated verification" },
  { id: "ACT-1004", at: "Yesterday, 16:40", actor: OWNERS[0], action: "added Attachment", target: "TA-2291", detail: "implementation-outline.md" },
  { id: "ACT-1003", at: "Yesterday, 15:12", actor: OWNERS[1], action: "updated Notes", target: "US-4821", detail: "Added Security review follow-up" },
  { id: "ACT-1002", at: "Oct 21, 2024", actor: OWNERS[0], action: "created Work Item", target: "US-4821", detail: "Implement SSO authentication via SAML 2.0" },
];

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#64748b" }}>{label}</label>{children}</div>;
}

function EditorButton({ label, command, disabled, children }: { label: string; command?: string; disabled?: boolean; children: ReactNode }) {
  return <button type="button" aria-label={label} title={label} disabled={disabled} onMouseDown={event => { event.preventDefault(); if (command && !disabled) document.execCommand(command); }} className="w-7 h-7 flex items-center justify-center rounded-sm disabled:opacity-35" style={{ color: "#475569" }} onMouseEnter={event => (event.currentTarget.style.backgroundColor = "#edf2f7")} onMouseLeave={event => (event.currentTarget.style.backgroundColor = "transparent")}>{children}</button>;
}

export function RichTextEditor({ title, initialValue = "", minHeight, readOnly, onChange }: { title: string; initialValue?: string; minHeight: number; readOnly: boolean; onChange?: (value: string) => void }) {
  return (
    <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
      <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>{title}</div>
      <div className="flex items-center gap-0.5 px-2 py-1.5 overflow-x-auto" style={{ borderBottom: "1px solid #dde2ea", backgroundColor: "white" }}>
        <EditorButton label={`${title}: Undo`} command="undo" disabled={readOnly}><Undo2 size={14} /></EditorButton>
        <EditorButton label={`${title}: Redo`} command="redo" disabled={readOnly}><Redo2 size={14} /></EditorButton>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <select aria-label={`${title}: Text style`} disabled={readOnly} onChange={event => document.execCommand("formatBlock", false, event.target.value)} className="h-7 w-28 px-2 text-[11px] rounded-sm bg-white focus:outline-none" style={{ color: "#334155", border: "1px solid #d7dde7" }}><option value="p">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option></select>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <EditorButton label={`${title}: Bold`} command="bold" disabled={readOnly}><Bold size={15} /></EditorButton>
        <EditorButton label={`${title}: Italic`} command="italic" disabled={readOnly}><Italic size={15} /></EditorButton>
        <EditorButton label={`${title}: Underline`} command="underline" disabled={readOnly}><Underline size={15} /></EditorButton>
        <EditorButton label={`${title}: Strikethrough`} command="strikeThrough" disabled={readOnly}><Strikethrough size={15} /></EditorButton>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <EditorButton label={`${title}: Bulleted list`} command="insertUnorderedList" disabled={readOnly}><List size={15} /></EditorButton>
        <EditorButton label={`${title}: Numbered list`} command="insertOrderedList" disabled={readOnly}><ListOrdered size={15} /></EditorButton>
        <EditorButton label={`${title}: Align left`} command="justifyLeft" disabled={readOnly}><AlignLeft size={15} /></EditorButton>
        <span className="w-px h-5 mx-1 shrink-0" style={{ backgroundColor: "#d7dde7" }} />
        <EditorButton label={`${title}: Insert link`} disabled={readOnly}><Link2 size={15} /></EditorButton>
        <EditorButton label={`${title}: Inline code`} disabled={readOnly}><Code2 size={15} /></EditorButton>
        <EditorButton label={`${title}: Insert table`} disabled={readOnly}><Table2 size={15} /></EditorButton>
        <EditorButton label={`${title}: Insert image`} disabled={readOnly}><ImagePlus size={15} /></EditorButton>
        <EditorButton label={`${title}: Mention user`} disabled={readOnly}><AtSign size={15} /></EditorButton>
        <div className="flex-1 min-w-1" />
        <EditorButton label={`${title}: Expand editor`}><Maximize2 size={15} /></EditorButton>
      </div>
      <div contentEditable={!readOnly} suppressContentEditableWarning onInput={event => onChange?.(event.currentTarget.textContent || "")} className="px-4 py-3 text-[13px] leading-6 focus:outline-none" style={{ minHeight, color: "#334155", backgroundColor: readOnly ? "#f8fafc" : "white" }}>{initialValue}</div>
    </section>
  );
}

function TaskHeaderCell({ label, activeSort }: { label: string; activeSort?: boolean }) {
  return (
    <span className="flex items-center justify-between h-full px-3 text-[12px] font-semibold" style={{ color: "#1f2937", borderRight: "1px dashed #8c99ad" }}>
      <span>{label}</span>
      <span className="text-[17px] leading-none" style={{ color: activeSort ? "#2563eb" : "#1f2937" }}>↕</span>
    </span>
  );
}

export function TaskStateBadge({ state }: { state: TaskState }) {
  const colors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    Defined: { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
    "In-Progress": { bg: "#fef5e4", text: "#8a5808", border: "#f5d899", dot: "#e59f0c" },
    Completed: { bg: "#eef6f0", text: "#1e6930", border: "#a8d5b3", dot: "#2a8c3f" },
  };
  const c = colors[state] || colors.Defined;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-px text-[11px] font-medium rounded-sm whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />
      {state}
    </span>
  );
}

function splitActivityDetail(record: StorySplit) {
  return `${record.sourceIteration} → ${record.targetIteration}; ${record.taskSnapshots.length} Tasks, ${record.defectAssignments.length} Defects and ${record.testCaseAssignments.length} Test Cases redistributed.`;
}

function ActivityLogView({ item, storySplits }: { item: WorkItem; storySplits: StorySplit[] }) {
  const splitRows = storySplits
    .filter(record => record.unfinishedId === item.id || record.continuedId === item.id || record.defectAssignments.some(defect => defect.id === item.id))
    .map(record => ({ id: `${record.id}-${item.id}`, at: new Date(record.at).toLocaleString(), actor: record.actor, action: "split Story", target: record.id, detail: splitActivityDetail(record) }));
  const transitionRows = [...(item.iterationTransitions || [])].reverse().map((transition, index) => ({
    id: transition.id || `TRANSITION-${index}`,
    at: transition.at,
    actor: item.owner,
    action: transition.type === "Carryover" ? "accepted Carryover" : "moved Iteration",
    target: item.id,
    detail: `${transition.fromIteration} → ${transition.toIteration}${transition.targetEndDate ? ` · Target End ${transition.targetEndDate}` : ""}`,
  }));
  const rows = [...transitionRows, ...splitRows, ...ACTIVITY_ROWS.filter(activity => activity.target === item.id)];
  return (
    <div className="w-full space-y-5">
      <div>
        <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Revision History</h2>
        <p className="text-[12px] mt-1" style={{ color: "#64748b" }}>Basic activity log for field changes, task updates, attachments, and work item creation.</p>
      </div>

      <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
        <div className="grid grid-cols-[150px_180px_150px_1fr] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#64748b", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
          <span>Time</span>
          <span>Actor</span>
          <span>Action</span>
          <span>Details</span>
        </div>
        {rows.map(activity => (
          <div key={activity.id} className="grid grid-cols-[150px_180px_150px_1fr] items-start px-4 py-3 text-[12px]" style={{ borderBottom: "1px solid #edf0f4", color: "#334155" }}>
            <span className="font-mono text-[11px]" style={{ color: "#64748b" }}>{activity.at}</span>
            <span className="flex items-center gap-2 min-w-0"><Avatar owner={activity.actor} size="xs" /><span className="truncate">{activity.actor.name}</span></span>
            <span className="font-semibold" style={{ color: "#273449" }}>{activity.action}</span>
            <span><span className="font-mono text-[11px]" style={{ color: "#2558a6" }}>{activity.target}</span><span className="mx-2" style={{ color: "#94a3b8" }}>·</span>{activity.detail}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

function TaskActivityLogView({ task, storySplits }: { task: TaskItem; storySplits: StorySplit[] }) {
  const splitRows = storySplits.filter(record => record.taskSnapshots.some(snapshot => snapshot.id === task.id)).map(record => {
    const snapshot = record.taskSnapshots.find(row => row.id === task.id)!;
    return { id: `${record.id}-${task.id}`, at: new Date(record.at).toLocaleString(), actor: record.actor, action: "changed Work Product", target: task.id, detail: `${snapshot.splitSide === "unfinished" ? record.unfinishedId : record.continuedId} selected during ${record.id}` };
  });
  const rows = [...splitRows,
    { id: "TACT-3004", at: "Today, 10:18", actor: task.owner, action: "updated Actual", target: task.id, detail: `Actual time is now ${task.actuals}h` },
    { id: "TACT-3003", at: "Today, 09:55", actor: OWNERS[1], action: "changed State", target: task.id, detail: "In-Progress → Completed" },
    { id: "TACT-3002", at: "Yesterday, 16:40", actor: OWNERS[0], action: "added Attachment", target: task.id, detail: task.attachments[0] || "No attachment" },
    { id: "TACT-3001", at: "Yesterday, 14:12", actor: OWNERS[0], action: "created Task", target: task.id, detail: task.name },
  ];

  return (
    <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
      <div className="w-full space-y-5">
        <div>
          <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Revision History</h2>
          <p className="text-[12px] mt-1" style={{ color: "#64748b" }}>Basic activity log for task {task.id}.</p>
        </div>
        <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
          <div className="grid grid-cols-[150px_180px_150px_1fr] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#64748b", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
            <span>Time</span>
            <span>Actor</span>
            <span>Action</span>
            <span>Details</span>
          </div>
          {rows.map(activity => (
            <div key={activity.id} className="grid grid-cols-[150px_180px_150px_1fr] items-start px-4 py-3 text-[12px]" style={{ borderBottom: "1px solid #edf0f4", color: "#334155" }}>
              <span className="font-mono text-[11px]" style={{ color: "#64748b" }}>{activity.at}</span>
              <span className="flex items-center gap-2 min-w-0"><Avatar owner={activity.actor} size="xs" /><span className="truncate">{activity.actor.name}</span></span>
              <span className="font-semibold" style={{ color: "#273449" }}>{activity.action}</span>
              <span><span className="font-mono text-[11px]" style={{ color: "#2558a6" }}>{activity.target}</span><span className="mx-2" style={{ color: "#94a3b8" }}>·</span>{activity.detail}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

export const fieldClass = "w-full text-[12px] px-3 py-2 rounded bg-white focus:outline-none";
export const fieldStyle = { border: "1px solid #d7dde7", color: "#1a2234" };

function parseInputDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateToInputValue(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function TargetEndDatePicker({ value, storyStartDate, allowedIterations, disabled, invalid, onChange }: { value?: string | null; storyStartDate?: string | null; allowedIterations: IterationItem[]; disabled: boolean; invalid: boolean; onChange: (value: string) => void }) {
  const firstAllowedDate = allowedIterations[0] ? iterationDateValue(allowedIterations[0].startDate) : "";
  const initialMonthValue = value || storyStartDate || firstAllowedDate || dateToInputValue(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = parseInputDate(initialMonthValue);
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(1 - monthStart.getDay());
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });
  const minimumDate = storyStartDate || firstAllowedDate;

  function isAllowed(targetDate: string) {
    if (minimumDate && targetDate < minimumDate) return false;
    return allowedIterations.some(iteration => targetDate >= iterationDateValue(iteration.startDate) && targetDate <= iterationDateValue(iteration.endDate));
  }

  function moveMonth(direction: -1 | 1) {
    setVisibleMonth(previous => new Date(previous.getFullYear(), previous.getMonth() + direction, 1));
  }

  return (
    <div className="relative min-w-0 flex-1">
      <button type="button" aria-label="Open Story target end date picker" disabled={disabled || allowedIterations.length === 0} onClick={() => setIsOpen(open => !open)} className={`${fieldClass} flex items-center justify-between text-left disabled:cursor-not-allowed disabled:bg-[#f8fafc]`} style={{ ...fieldStyle, borderColor: invalid ? "#e59f0c" : "#d7dde7", color: value ? "#1a2234" : "#8c94a6" }}>
        <span>{value || "Select a date"}</span><CalendarDays size={14} style={{ color: "#64748b" }} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full right-0 z-50 mb-2 w-[300px] rounded-md bg-white p-3 shadow-xl" style={{ border: "1px solid #cfd8e6" }}>
          <div className="mb-3 flex items-center justify-between">
            <button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)} className="rounded p-1.5 hover:bg-[#f1f5f9]" style={{ color: "#475569" }}><ChevronLeft size={15} /></button>
            <span className="text-[12px] font-semibold" style={{ color: "#273449" }}>{visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            <button type="button" aria-label="Next month" onClick={() => moveMonth(1)} className="rounded p-1.5 hover:bg-[#f1f5f9]" style={{ color: "#475569" }}><ChevronRight size={15} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-semibold uppercase" style={{ color: "#8c94a6" }}>{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => <span key={day} className="py-1">{day}</span>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(date => {
              const dateValue = dateToInputValue(date);
              const outsideMonth = date.getMonth() !== visibleMonth.getMonth();
              const allowed = isAllowed(dateValue);
              const selected = value === dateValue;
              return <button key={dateValue} type="button" aria-label={dateValue} disabled={!allowed} onClick={() => { onChange(dateValue); setIsOpen(false); }} className="flex h-8 items-center justify-center rounded text-[11px] disabled:cursor-not-allowed disabled:line-through" style={{ backgroundColor: selected ? "#2558a6" : allowed ? "white" : "#f4f6f8", color: selected ? "white" : allowed ? outsideMonth ? "#94a3b8" : "#334155" : "#b8bec8", border: selected ? "1px solid #2558a6" : "1px solid transparent" }}>{date.getDate()}</button>;
            })}
          </div>
          <div className="mt-3 space-y-1 border-t pt-2 text-[10px] leading-4" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
            <p>Available only from Start Date onward.</p>
            <p>Enabled dates belong to the current or a future iteration.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AddTaskModal({ defaultOwner, onClose, onCreate }: { defaultOwner: string; onClose: () => void; onCreate: (input: NewTaskInput, openDetails: boolean) => void }) {
  const [name, setName] = useState("");
  const [estimate, setEstimate] = useState("");
  const [todo, setTodo] = useState("");
  const [actuals, setActuals] = useState("");
  const [todoTouched, setTodoTouched] = useState(false);
  const [owner, setOwner] = useState(defaultOwner);
  const canCreate = name.trim().length > 0;
  const estimateValue = Math.max(0, Number(estimate) || 0);

  function changeEstimate(nextValue: string) {
    const normalized = Math.max(0, Number(nextValue) || 0);
    setEstimate(nextValue);
    if (!todoTouched && Math.max(0, Number(actuals) || 0) === 0) setTodo(String(normalized));
  }

  function changeTodo(nextValue: string) {
    setTodoTouched(true);
    setTodo(nextValue);
  }

  function submit(openDetails: boolean) {
    if (!canCreate) return;
    const selectedOwner = OWNERS.find(candidate => candidate.name === owner) || OWNERS[0];
    onCreate({ name: name.trim(), owner: selectedOwner, todo: Math.max(0, Number(todo) || 0), actuals: Math.max(0, Number(actuals) || 0), estimate: estimateValue }, openDetails);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(15, 23, 42, .42)" }}>
      <section className="w-full max-w-[520px] rounded bg-white shadow-2xl overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="add-task-title" style={{ border: "1px solid #cbd5e1" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
          <div>
            <h2 id="add-task-title" className="text-[16px] font-semibold" style={{ color: "#1f2937" }}>Create Task</h2>
            <p className="text-[11px] mt-1" style={{ color: "#64748b" }}>Create a child task under this work item.</p>
          </div>
          <button aria-label="Close create task modal" onClick={onClose} className="w-8 h-8 rounded text-[20px] leading-none" style={{ color: "#64748b" }}>×</button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Name *">
            <input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="Enter task name" className={fieldClass} style={fieldStyle} />
            {!canCreate && <p className="mt-1.5 text-[10px]" style={{ color: "#b45309" }}>Name is required.</p>}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Estimate">
              <input value={estimate} onChange={event => changeEstimate(event.target.value)} type="number" min={0} placeholder="0" className={fieldClass} style={fieldStyle} />
              <p className="mt-1 text-[10px]" style={{ color: "#64748b" }}>Entering Estimate first copies the same hours to To Do once.</p>
            </Field>
            <Field label="To Do">
              <input value={todo} onChange={event => changeTodo(event.target.value)} type="number" min={0} placeholder="0" className={fieldClass} style={fieldStyle} />
            </Field>
            <Field label="Owner">
              <select value={owner} onChange={event => setOwner(event.target.value)} className={fieldClass} style={fieldStyle}>
                {OWNERS.map(candidate => <option key={candidate.name}>{candidate.name}</option>)}
              </select>
            </Field>
            <Field label="Actual">
              <input value={actuals} onChange={event => setActuals(event.target.value)} type="number" min={0} placeholder="0" className={fieldClass} style={fieldStyle} />
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4" style={{ backgroundColor: "#f8fafc", borderTop: "1px solid #dde2ea" }}>
          <button onClick={onClose} className="px-4 py-2 rounded text-[12px] font-semibold" style={{ color: "#334155", border: "1px solid #cbd5e1", backgroundColor: "white" }}>Cancel</button>
          <button onClick={() => submit(false)} disabled={!canCreate} className="px-4 py-2 rounded text-[12px] font-semibold disabled:opacity-45" style={{ color: "#1d3f73", border: "1px solid #9fb4d1", backgroundColor: "#eef3fb" }}>Create</button>
          <button onClick={() => submit(true)} disabled={!canCreate} className="px-4 py-2 rounded text-[12px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }}>Create with details</button>
        </div>
      </section>
    </div>
  );
}

function AddTestCaseModal({ defaultOwner, ownerOptions, testCaseTypes, onClose, onCreate }: { defaultOwner: string; ownerOptions: Owner[]; testCaseTypes: string[]; onClose: () => void; onCreate: (input: NewTestCaseInput) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<TestCaseType>(testCaseTypes[0] || "Acceptance");
  const [method, setMethod] = useState<TestCaseMethod>("Manual");
  const [priority, setPriority] = useState<TestCasePriority>("Normal");
  const [owner, setOwner] = useState(ownerOptions.some(candidate => candidate.name === defaultOwner) ? defaultOwner : ownerOptions[0]?.name || "");
  const canCreate = name.trim().length > 0;

  function submit() {
    if (!canCreate) return;
    onCreate({
      name: name.trim(),
      type,
      method,
      priority,
      owner: ownerOptions.find(candidate => candidate.name === owner) || ownerOptions[0] || OWNERS[0],
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(15, 23, 42, .42)" }}>
      <section className="w-full max-w-[560px] rounded bg-white shadow-2xl overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="add-test-case-title" style={{ border: "1px solid #cbd5e1" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
          <div>
            <h2 id="add-test-case-title" className="text-[16px] font-semibold" style={{ color: "#1f2937" }}>Create Test Case</h2>
            <p className="text-[11px] mt-1" style={{ color: "#64748b" }}>The new Test Case is linked to this Work Item and starts with a blank template.</p>
          </div>
          <button aria-label="Close create test case modal" onClick={onClose} className="w-8 h-8 rounded text-[20px] leading-none" style={{ color: "#64748b" }}>×</button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Name *">
            <input autoFocus value={name} onChange={event => setName(event.target.value)} placeholder="Enter test case name" className={fieldClass} style={fieldStyle} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type"><select value={type} onChange={event => setType(event.target.value as TestCaseType)} className={fieldClass} style={fieldStyle}>{testCaseTypes.map(value => <option key={value}>{value}</option>)}</select></Field>
            <Field label="Method"><select value={method} onChange={event => setMethod(event.target.value as TestCaseMethod)} className={fieldClass} style={fieldStyle}>{["Manual", "Automated"].map(value => <option key={value}>{value}</option>)}</select></Field>
            <Field label="Priority"><select value={priority} onChange={event => setPriority(event.target.value as TestCasePriority)} className={fieldClass} style={fieldStyle}>{["Low", "Normal", "High", "Urgent"].map(value => <option key={value}>{value}</option>)}</select></Field>
            <Field label="Owner"><select value={owner} onChange={event => setOwner(event.target.value)} className={fieldClass} style={fieldStyle}>{ownerOptions.map(candidate => <option key={candidate.name}>{candidate.name}</option>)}</select></Field>
          </div>
          <p className="text-[10px]" style={{ color: "#64748b" }}>Test steps are maintained on the Test Case detail as Input and Expected Result pairs.</p>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4" style={{ backgroundColor: "#f8fafc", borderTop: "1px solid #dde2ea" }}>
          <button onClick={onClose} className="px-4 py-2 rounded text-[12px] font-semibold" style={{ color: "#334155", border: "1px solid #cbd5e1", backgroundColor: "white" }}>Cancel</button>
          <button onClick={submit} disabled={!canCreate} className="px-4 py-2 rounded text-[12px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }}>Create</button>
        </div>
      </section>
    </div>
  );
}

const TEST_CASE_GRID_COLUMNS = "44px 72px 112px minmax(300px,1fr) 130px 120px 120px 180px 120px 140px";

function VerdictBadge({ verdict }: { verdict: TestCaseVerdict }) {
  const palette: Record<TestCaseVerdict, { backgroundColor: string; color: string; border: string }> = {
    Pass: { backgroundColor: "#eef6f0", color: "#1e6930", border: "1px solid #a8d5b3" },
    Fail: { backgroundColor: "#fff1f0", color: "#b91c1c", border: "1px solid #fcc5c0" },
    Blocked: { backgroundColor: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa" },
    Error: { backgroundColor: "#fff1f0", color: "#b91c1c", border: "1px solid #fcc5c0" },
    Inconclusive: { backgroundColor: "#fffbeb", color: "#8a5808", border: "1px solid #fde68a" },
    "Not Run": { backgroundColor: "#f8fafc", color: "#64748b", border: "1px solid #d7dde7" },
  };
  return <span className="inline-flex rounded-sm px-2 py-px text-[11px] font-semibold" style={palette[verdict]}>{verdict}</span>;
}

function TestCasesView({ rows, readOnly, onAdd, onOpen }: { rows: TestCaseItem[]; readOnly: boolean; onAdd: () => void; onOpen: (testCase: TestCaseItem) => void }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Test Cases</h2>
          <p className="text-[11px] mt-1" style={{ color: "#64748b" }}>Acceptance and functional checks linked directly to this Story or Defect.</p>
        </div>
        {!readOnly && <button onClick={onAdd} className="flex items-center gap-1.5 px-3 py-2 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}><Plus size={13} />Add New</button>}
      </div>

      <div className="bg-white rounded overflow-x-auto" style={{ border: "1px solid #dde2ea" }}>
        <div className="min-w-[1430px]">
          <div className="grid h-10 items-center" style={{ gridTemplateColumns: TEST_CASE_GRID_COLUMNS, borderBottom: "2px solid #9fb4d1" }}>
            <div className="flex h-full items-center justify-center" style={{ borderRight: "1px dashed #8c99ad" }}><input type="checkbox" aria-label="Select all test cases" className="h-4 w-4 rounded" /></div>
            {["Rank", "ID", "Name", "Type", "Method", "Priority", "Owner", "Last Verdict", "Last Run"].map(label => <TaskHeaderCell key={label} label={label} />)}
          </div>
          {rows.length === 0 ? (
            <div className="flex min-h-44 flex-col items-center justify-center gap-2 px-6 text-center">
              <ClipboardCheck size={28} style={{ color: "#94a3b8" }} />
              <p className="text-[13px] font-semibold" style={{ color: "#475569" }}>No Test Cases yet</p>
              <p className="text-[11px]" style={{ color: "#8c94a6" }}>Add a Test Case to verify this Work Item.</p>
            </div>
          ) : rows.map(testCase => (
            <div key={testCase.id} className="grid min-h-11 items-center text-[12px]" style={{ gridTemplateColumns: TEST_CASE_GRID_COLUMNS, borderBottom: "1px solid #edf0f4", color: "#334155" }}>
              <div className="flex items-center justify-center"><input type="checkbox" aria-label={`Select test case ${testCase.id}`} className="h-4 w-4 rounded" /></div>
              <span className="px-3 text-right font-mono text-[11px]" style={{ color: "#64748b" }}>{testCase.rank}</span>
              <button onClick={() => onOpen(testCase)} className="px-3 text-left font-mono text-[11px] underline-offset-2 hover:underline" style={{ color: "#2558a6" }}>{testCase.id}</button>
              <span className="truncate px-3 font-medium" style={{ color: "#273449" }}>{testCase.name}</span>
              <span className="px-3">{testCase.type}</span>
              <span className="px-3">{testCase.method}</span>
              <span className="px-3">{testCase.priority}</span>
              <span className="flex min-w-0 items-center gap-2 px-3"><Avatar owner={testCase.owner} size="xs" /><span className="truncate">{testCase.owner.name}</span></span>
              <span className="px-3"><VerdictBadge verdict={testCase.lastVerdict} /></span>
              <span className="px-3 text-[11px]" style={{ color: "#64748b" }}>{testCase.lastRun || "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestCaseActivityLogView({ testCase, storySplits }: { testCase: TestCaseItem; storySplits: StorySplit[] }) {
  const splitRows = storySplits.filter(record => record.testCaseAssignments.some(assignment => assignment.id === testCase.id)).map(record => {
    const assignment = record.testCaseAssignments.find(row => row.id === testCase.id)!;
    return { id: `${record.id}-${testCase.id}`, at: new Date(record.at).toLocaleString(), actor: record.actor, action: "changed Work Product", detail: `${assignment.splitSide === "unfinished" ? record.unfinishedId : record.continuedId} selected during ${record.id}` };
  });
  const rows = [...splitRows,
    { id: "TCACT-2002", at: testCase.lastRun || "Not run yet", actor: testCase.owner, action: "recorded Last Verdict", detail: testCase.lastVerdict },
    { id: "TCACT-2001", at: "Created", actor: testCase.owner, action: "created Test Case", detail: testCase.name },
  ];

  return (
    <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
      <div className="w-full space-y-5">
        <div>
          <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Revision History</h2>
          <p className="mt-1 text-[12px]" style={{ color: "#64748b" }}>Activity recorded for this Test Case.</p>
        </div>
        <section className="overflow-hidden rounded bg-white" style={{ border: "1px solid #dde2ea" }}>
          <div className="grid grid-cols-[150px_180px_180px_1fr] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#64748b", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
            <span>Time</span><span>Actor</span><span>Action</span><span>Details</span>
          </div>
          {rows.map(row => (
            <div key={row.id} className="grid grid-cols-[150px_180px_180px_1fr] items-start px-4 py-3 text-[12px]" style={{ borderBottom: "1px solid #edf0f4", color: "#334155" }}>
              <span className="font-mono text-[11px]" style={{ color: "#64748b" }}>{row.at}</span>
              <span className="flex min-w-0 items-center gap-2"><Avatar owner={row.actor} size="xs" /><span className="truncate">{row.actor.name}</span></span>
              <span className="font-semibold" style={{ color: "#273449" }}>{row.action}</span>
              <span><span className="mr-2 font-mono text-[11px]" style={{ color: "#2558a6" }}>{testCase.id}</span>{row.detail}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

function AddTestCaseResultModal({ testCase, parentItem, testerOptions, defaultTester, onClose, onCreate }: { testCase: TestCaseItem; parentItem: WorkItem; testerOptions: Owner[]; defaultTester: Owner; onClose: () => void; onCreate: (input: NewTestCaseResultInput) => void }) {
  const [build, setBuild] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [verdict, setVerdict] = useState<Exclude<TestCaseVerdict, "Not Run">>("Pass");
  const [duration, setDuration] = useState(0);
  const [tester, setTester] = useState(testerOptions.some(owner => owner.name === defaultTester.name) ? defaultTester.name : testerOptions[0]?.name || "");
  const [notes, setNotes] = useState("");
  const canCreate = build.trim().length > 0 && date.length > 0 && tester.length > 0;

  function submit() {
    if (!canCreate) return;
    onCreate({ build: build.trim(), date, verdict, duration: Math.max(0, duration), tester: testerOptions.find(owner => owner.name === tester) || testerOptions[0] || OWNERS[0], notes: notes.trim() });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(15, 23, 42, .42)" }}>
      <section className="w-full max-w-[620px] overflow-hidden rounded bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="add-test-result-title" style={{ border: "1px solid #cbd5e1" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>
          <div><h2 id="add-test-result-title" className="text-[16px] font-semibold" style={{ color: "#1f2937" }}>Add Test Result</h2><p className="mt-1 text-[11px]" style={{ color: "#64748b" }}>Record one execution result for {testCase.id}.</p></div>
          <button aria-label="Close add test result modal" onClick={onClose} className="h-8 w-8 rounded text-[20px] leading-none" style={{ color: "#64748b" }}>×</button>
        </div>
        <div className="grid grid-cols-2 gap-4 p-5">
          <Field label="Build *"><input autoFocus value={build} onChange={event => setBuild(event.target.value)} placeholder="e.g. 2026.08.24.1" className={fieldClass} style={fieldStyle} /></Field>
          <Field label="Date *"><input type="date" value={date} onChange={event => setDate(event.target.value)} className={fieldClass} style={fieldStyle} /></Field>
          <Field label="Verdict"><select value={verdict} onChange={event => setVerdict(event.target.value as Exclude<TestCaseVerdict, "Not Run">)} className={fieldClass} style={fieldStyle}>{["Pass", "Fail", "Blocked", "Error", "Inconclusive"].map(value => <option key={value}>{value}</option>)}</select></Field>
          <Field label="Duration (minutes)"><input type="number" min={0} value={duration} onChange={event => setDuration(Number(event.target.value) || 0)} className={fieldClass} style={fieldStyle} /></Field>
          <Field label="Tester"><select value={tester} onChange={event => setTester(event.target.value)} className={fieldClass} style={fieldStyle}>{testerOptions.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>
          <Field label="Test Case"><input disabled value={`${testCase.id} · ${testCase.name}`} className={fieldClass} style={fieldStyle} /></Field>
          <div className="col-span-2"><Field label="Work Product"><input disabled value={`${parentItem.id} · ${parentItem.title}`} className={fieldClass} style={fieldStyle} /></Field></div>
          <div className="col-span-2"><Field label="Notes"><textarea value={notes} onChange={event => setNotes(event.target.value)} rows={4} className={`${fieldClass} resize-y`} style={fieldStyle} /></Field></div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4" style={{ backgroundColor: "#f8fafc", borderTop: "1px solid #dde2ea" }}>
          <button onClick={onClose} className="rounded px-4 py-2 text-[12px] font-semibold" style={{ color: "#334155", border: "1px solid #cbd5e1", backgroundColor: "white" }}>Cancel</button>
          <button onClick={submit} disabled={!canCreate} className="rounded px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }}>Save Result</button>
        </div>
      </section>
    </div>
  );
}

const TEST_RESULT_GRID_COLUMNS = "minmax(180px,1fr) 130px minmax(300px,1.5fr) 120px 120px 190px";

function TestCaseResultsView({ rows, parentItem, readOnly, onAdd, onOpen }: { rows: TestCaseResultItem[]; parentItem: WorkItem; readOnly: boolean; onAdd: () => void; onOpen: (result: TestCaseResultItem) => void }) {
  const sortedRows = [...rows].sort((a, b) => `${b.date}|${b.createdAt}`.localeCompare(`${a.date}|${a.createdAt}`));
  return (
    <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Results</h2><p className="mt-1 text-[11px]" style={{ color: "#64748b" }}>Each row is the saved output of one Test Case execution.</p></div>{!readOnly && <button onClick={onAdd} className="flex items-center gap-1.5 rounded px-3 py-2 text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}><Plus size={13} />Add Result</button>}</div>
        <div className="overflow-x-auto rounded bg-white" style={{ border: "1px solid #dde2ea" }}>
          <div className="min-w-[1080px]">
            <div className="grid h-10 items-center" style={{ gridTemplateColumns: TEST_RESULT_GRID_COLUMNS, borderBottom: "2px solid #9fb4d1" }}>{["Build", "Date", "Work Product", "Verdict", "Duration", "Tester"].map(label => <TaskHeaderCell key={label} label={label} />)}</div>
            {sortedRows.length === 0 ? <div className="flex min-h-44 flex-col items-center justify-center gap-2 px-6 text-center"><ClipboardCheck size={28} style={{ color: "#94a3b8" }} /><p className="text-[13px] font-semibold" style={{ color: "#475569" }}>No Results yet</p><p className="text-[11px]" style={{ color: "#8c94a6" }}>Add the first execution result for this Test Case.</p></div> : sortedRows.map(result => (
              <div key={result.id} className="grid min-h-11 items-center text-[12px]" style={{ gridTemplateColumns: TEST_RESULT_GRID_COLUMNS, borderBottom: "1px solid #edf0f4", color: "#334155" }}>
                <button onClick={() => onOpen(result)} className="truncate px-3 text-left font-medium underline-offset-2 hover:underline" style={{ color: "#2558a6" }}>{result.build}</button>
                <span className="px-3 font-mono text-[11px]">{result.date}</span>
                <span className="truncate px-3">{result.workProductId === parentItem.id ? `${parentItem.id} · ${parentItem.title}` : `${result.workProductId} · historical Work Product`}</span>
                <span className="px-3"><VerdictBadge verdict={result.verdict} /></span>
                <span className="px-3 text-right font-mono">{result.duration} min</span>
                <span className="flex min-w-0 items-center gap-2 px-3"><Avatar owner={result.tester} size="xs" /><span className="truncate">{result.tester.name}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function TestCaseResultDetailView({ result, testCase, parentItem, testerOptions, readOnly, onBack, onUpdate }: { result: TestCaseResultItem; testCase: TestCaseItem; parentItem: WorkItem; testerOptions: Owner[]; readOnly: boolean; onBack: () => void; onUpdate: (id: string, patch: Partial<TestCaseResultItem>) => void }) {
  const [activeTab, setActiveTab] = useState<TestCaseResultDetailTab>("details");
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <div className="shrink-0 text-white" style={{ backgroundColor: "#173f78" }}>
        <div className="flex h-12 items-center gap-3 px-4" style={{ borderBottom: "1px solid rgba(255,255,255,.18)" }}><button aria-label="Back to results list" onClick={onBack} className="rounded p-1.5 hover:bg-white/10"><ChevronLeft size={18} /></button><span className="whitespace-nowrap rounded-sm px-1.5 py-px text-[10px] font-semibold" style={{ backgroundColor: "#eef3fb", color: "#2558a6", border: "1px solid #bdd0ef" }}>Test Result</span><span className="font-mono text-[13px] font-semibold">{result.id}</span><span className="h-5 w-px bg-white/25" /><h1 className="truncate text-[15px] font-semibold">{result.build}</h1><div className="flex-1" /><button aria-label="More test result actions" className="rounded p-1.5 hover:bg-white/10"><MoreHorizontal size={17} /></button></div>
        <div className="flex h-16 items-stretch gap-2 px-5"><button onClick={() => setActiveTab("details")} className="flex w-28 flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "details" ? "#2f6fc5" : "transparent", color: activeTab === "details" ? "white" : "#d7e4f7" }}><FileText size={18} /><span>Details</span></button><button onClick={() => setActiveTab("history")} className="flex w-32 flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "history" ? "#2f6fc5" : "transparent", color: activeTab === "history" ? "white" : "#d7e4f7" }}><History size={19} /><span>Revision History</span></button></div>
      </div>
      {activeTab === "history" ? <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8" }}><div className="space-y-5"><h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Revision History</h2><section className="rounded bg-white p-4 text-[12px]" style={{ border: "1px solid #dde2ea", color: "#334155" }}><span className="font-semibold">{result.tester.name}</span> recorded <span className="font-mono">{result.verdict}</span> for build <span className="font-mono">{result.build}</span> on {result.date}.</section></div></main> : (
        <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
          <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}><div className="space-y-5"><div><h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Result Details</h2><p className="mt-1 text-[11px]" style={{ color: "#64748b" }}>{result.id} · execution output for {testCase.id}</p></div><section className="overflow-hidden rounded bg-white" style={{ border: "1px solid #dde2ea" }}><div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Build</div><div className="p-3"><input aria-label="Test result build" disabled={readOnly} value={result.build} onChange={event => onUpdate(result.id, { build: event.target.value })} className={fieldClass} style={fieldStyle} /></div></section><section className="overflow-hidden rounded bg-white" style={{ border: "1px solid #dde2ea" }}><div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Attachments</div><div className="space-y-2 p-3">{result.attachments.length ? result.attachments.map(fileName => <div key={fileName} className="rounded px-3 py-2 text-[12px]" style={{ border: "1px solid #e2e8f0", color: "#334155" }}>{fileName}</div>) : <p className="text-[12px]" style={{ color: "#64748b" }}>No attachments yet.</p>}{!readOnly && <button className="flex w-full items-center gap-1.5 rounded px-3 py-2 text-left text-[12px]" style={{ color: "#2563c5", border: "1px solid #b9c9df", backgroundColor: "#fbfdff" }}><Plus size={15} />Drag or click to add attachments</button>}</div></section><section className="overflow-hidden rounded bg-white" style={{ border: "1px solid #dde2ea" }}><div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Verdict</div><div className="p-3"><select aria-label="Test result verdict" disabled={readOnly} value={result.verdict} onChange={event => onUpdate(result.id, { verdict: event.target.value as Exclude<TestCaseVerdict, "Not Run"> })} className={fieldClass} style={fieldStyle}>{["Pass", "Fail", "Blocked", "Error", "Inconclusive"].map(value => <option key={value}>{value}</option>)}</select></div></section><RichTextEditor title="Notes" initialValue={result.notes} minHeight={220} readOnly={readOnly} onChange={notes => onUpdate(result.id, { notes })} /></div></main>
          <aside className="w-[340px] shrink-0 space-y-4 overflow-y-scroll bg-white p-5" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}><Field label="Date"><input aria-label="Test result date" disabled={readOnly} type="date" value={result.date} onChange={event => onUpdate(result.id, { date: event.target.value })} className={fieldClass} style={fieldStyle} /></Field><Field label="Tester"><select aria-label="Test result tester" disabled={readOnly} value={result.tester.name} onChange={event => onUpdate(result.id, { tester: testerOptions.find(owner => owner.name === event.target.value) || result.tester })} className={fieldClass} style={fieldStyle}>{testerOptions.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field><Field label="Test Case"><input aria-label="Result test case" disabled value={`${testCase.id} · ${testCase.name}`} className={fieldClass} style={fieldStyle} /></Field><Field label="Work Product"><input aria-label="Result work product" disabled value={result.workProductId === parentItem.id ? `${parentItem.id} · ${parentItem.title}` : `${result.workProductId} · historical Work Product`} className={fieldClass} style={fieldStyle} /></Field><Field label="Duration (minutes)"><input aria-label="Test result duration" disabled={readOnly} type="number" min={0} value={result.duration} onChange={event => onUpdate(result.id, { duration: Math.max(0, Number(event.target.value) || 0) })} className={fieldClass} style={fieldStyle} /></Field></aside>
        </div>
      )}
    </div>
  );
}

function TestCaseDetailView({ testCase, parentItem, testCaseTypes, results, defaultTester, readOnly, storySplits, onBack, onUpdateTestCase, onCreateResult, onUpdateResult }: { testCase: TestCaseItem; parentItem: WorkItem; testCaseTypes: string[]; results: TestCaseResultItem[]; defaultTester: Owner; readOnly: boolean; storySplits: StorySplit[]; onBack: () => void; onUpdateTestCase: (id: string, patch: Partial<TestCaseItem>) => void; onCreateResult: (testCase: TestCaseItem, input: NewTestCaseResultInput) => TestCaseResultItem; onUpdateResult: (id: string, patch: Partial<TestCaseResultItem>) => void }) {
  const [activeTestCaseTab, setActiveTestCaseTab] = useState<TestCaseDetailTab>("details");
  const [isAddResultOpen, setIsAddResultOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<TestCaseResultItem | null>(null);
  const typeOptions = Array.from(new Set([testCase.type, ...testCaseTypes]));
  const projectKey = testCase.project || parentItem.project || "";
  const team = testCase.team || parentItem.team || "Project backlog";
  const assignedTo = testCase.assignedTo || testCase.owner;
  const attachmentRows = testCase.attachments || [];
  const projectMembers = PROJECT_MEMBER_OWNERS[projectKey] || OWNERS.filter(owner => owner.name !== "Unassigned");
  const assignmentOptions = [OWNERS[5], ...projectMembers];
  const projectLabel = SCOPE_PROJECTS.find(project => project.key === projectKey);
  const latestResult = [...results].sort((a, b) => `${b.date}|${b.createdAt}`.localeCompare(`${a.date}|${a.createdAt}`))[0];

  function createResult(input: NewTestCaseResultInput) {
    setSelectedResult(onCreateResult(testCase, input));
  }

  function updateResult(id: string, patch: Partial<TestCaseResultItem>) {
    onUpdateResult(id, patch);
    setSelectedResult(previous => previous?.id === id ? { ...previous, ...patch } : previous);
  }

  if (selectedResult) return <TestCaseResultDetailView result={selectedResult} testCase={testCase} parentItem={parentItem} testerOptions={projectMembers} readOnly={readOnly} onBack={() => { setSelectedResult(null); setActiveTestCaseTab("results"); }} onUpdate={updateResult} />;

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <div className="shrink-0 text-white" style={{ backgroundColor: "#173f78" }}>
        <div className="flex h-12 items-center gap-3 px-4" style={{ borderBottom: "1px solid rgba(255,255,255,.18)" }}>
          <button aria-label="Back to test case list" onClick={onBack} className="rounded p-1.5 hover:bg-white/10"><ChevronLeft size={18} /></button>
          <span className="whitespace-nowrap rounded-sm px-1.5 py-px text-[10px] font-semibold" style={{ backgroundColor: "#eef6f0", color: "#1e6930", border: "1px solid #a8d5b3" }}>Test Case</span>
          <span className="font-mono text-[13px] font-semibold text-white">{testCase.id}</span>
          <span className="h-5 w-px bg-white/25" />
          <h1 className="truncate text-[15px] font-semibold">{testCase.name}</h1>
          <div className="flex-1" />
          <button aria-label="More test case actions" className="rounded p-1.5 hover:bg-white/10"><MoreHorizontal size={17} /></button>
        </div>
        <div className="flex h-16 items-stretch gap-2 px-5">
          <button onClick={() => setActiveTestCaseTab("details")} className="flex w-28 flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTestCaseTab === "details" ? "#2f6fc5" : "transparent", color: activeTestCaseTab === "details" ? "white" : "#d7e4f7" }}><span className="flex h-5 items-center justify-center"><FileText size={18} /></span><span>Details</span></button>
          <button onClick={() => setActiveTestCaseTab("results")} className="flex w-28 flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTestCaseTab === "results" ? "#2f6fc5" : "transparent", color: activeTestCaseTab === "results" ? "white" : "#d7e4f7" }}><span className="flex h-5 items-center justify-center gap-1.5"><FlaskConical size={18} /><span className="text-[10px] font-semibold tabular-nums">{results.length}</span></span><span>Results</span></button>
          <button onClick={() => setActiveTestCaseTab("history")} className="flex w-32 flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTestCaseTab === "history" ? "#2f6fc5" : "transparent", color: activeTestCaseTab === "history" ? "white" : "#d7e4f7" }}><span className="flex h-5 items-center justify-center"><History size={19} /></span><span>Revision History</span></button>
        </div>
      </div>

      {activeTestCaseTab === "history" ? (
        <TestCaseActivityLogView testCase={testCase} storySplits={storySplits} />
      ) : activeTestCaseTab === "results" ? (
        <TestCaseResultsView rows={results} parentItem={parentItem} readOnly={readOnly} onAdd={() => setIsAddResultOpen(true)} onOpen={setSelectedResult} />
      ) : (
        <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
          <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
            <div className="w-full space-y-5">
              <div className="flex items-center gap-3">
                <span className="rounded-sm px-2 py-0.5 text-[10px] font-semibold" style={{ color: "#1e6930", backgroundColor: "#eef6f0", border: "1px solid #a8d5b3" }}>Test Case</span>
                <span className="font-mono text-[13px] font-semibold" style={{ color: "#2558a6" }}>{testCase.id}</span>
                <h2 className="truncate text-[20px] font-semibold" style={{ color: "#273449" }}>{testCase.name}</h2>
              </div>
              <RichTextEditor title="Description" initialValue={testCase.description} minHeight={360} readOnly={readOnly} onChange={description => onUpdateTestCase(testCase.id, { description })} />
              <RichTextEditor title="Objective" initialValue={testCase.objective} minHeight={150} readOnly={readOnly} onChange={objective => onUpdateTestCase(testCase.id, { objective })} />
              <RichTextEditor title="Pre-conditions" initialValue={testCase.preconditions} minHeight={150} readOnly={readOnly} onChange={preconditions => onUpdateTestCase(testCase.id, { preconditions })} />
              <RichTextEditor title="Validation Input" initialValue={testCase.validationInput} minHeight={170} readOnly={readOnly} onChange={validationInput => onUpdateTestCase(testCase.id, { validationInput })} />
              <RichTextEditor title="Validation Expected Result" initialValue={testCase.validationExpectedResult} minHeight={170} readOnly={readOnly} onChange={validationExpectedResult => onUpdateTestCase(testCase.id, { validationExpectedResult })} />
              <RichTextEditor title="Post-conditions" initialValue={testCase.postconditions} minHeight={150} readOnly={readOnly} onChange={postconditions => onUpdateTestCase(testCase.id, { postconditions })} />
              <RichTextEditor title="Notes" initialValue={testCase.notes} minHeight={170} readOnly={readOnly} onChange={notes => onUpdateTestCase(testCase.id, { notes })} />
              <section className="overflow-hidden rounded bg-white" style={{ border: "1px solid #dde2ea" }}>
                <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Attachments</div>
                <div className="space-y-2 p-3">
                  {attachmentRows.length > 0 ? attachmentRows.map(fileName => <div key={fileName} className="flex items-center justify-between rounded px-3 py-2 text-[12px]" style={{ border: "1px solid #e2e8f0", color: "#334155", backgroundColor: "#fbfdff" }}><span>{fileName}</span><span className="text-[10px]" style={{ color: "#64748b" }}>Attached to Test Case</span></div>) : <p className="text-[12px]" style={{ color: "#64748b" }}>No attachments yet.</p>}
                  {!readOnly && <button className="flex w-full items-center gap-1.5 rounded px-3 py-2 text-left text-[12px]" style={{ color: "#2563c5", border: "1px solid #b9c9df", backgroundColor: "#fbfdff" }}><Plus size={15} />Drag or click to add attachments</button>}
                </div>
              </section>
            </div>
          </main>

          <aside className="w-[340px] shrink-0 space-y-4 overflow-y-scroll bg-white p-5" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}>
            <Field label="Owner"><select aria-label="Test case owner" disabled={readOnly} className={fieldClass} style={fieldStyle} value={testCase.owner.name} onChange={event => onUpdateTestCase(testCase.id, { owner: projectMembers.find(owner => owner.name === event.target.value) ?? testCase.owner })}>{projectMembers.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>
            <Field label="Project"><input aria-label="Test case project" disabled className={fieldClass} style={fieldStyle} value={`${projectKey} · ${projectLabel?.name || projectKey}`} /></Field>
            <Field label="Team"><input aria-label="Test case team" disabled className={fieldClass} style={fieldStyle} value={team} /></Field>
            <Field label="Assigned To"><select aria-label="Test case assigned to" disabled={readOnly} className={fieldClass} style={fieldStyle} value={assignedTo.name} onChange={event => onUpdateTestCase(testCase.id, { assignedTo: assignmentOptions.find(owner => owner.name === event.target.value) ?? assignedTo })}>{assignmentOptions.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>
            <Field label="Type"><select aria-label="Test case type" disabled={readOnly} className={fieldClass} style={fieldStyle} value={testCase.type} onChange={event => onUpdateTestCase(testCase.id, { type: event.target.value })}>{typeOptions.map(value => <option key={value}>{value}</option>)}</select></Field>
            <Field label="Method"><select aria-label="Test case method" disabled={readOnly} className={fieldClass} style={fieldStyle} value={testCase.method} onChange={event => onUpdateTestCase(testCase.id, { method: event.target.value as TestCaseMethod })}>{["Manual", "Automated"].map(value => <option key={value}>{value}</option>)}</select></Field>
            <Field label="Priority"><select aria-label="Test case priority" disabled={readOnly} className={fieldClass} style={fieldStyle} value={testCase.priority} onChange={event => onUpdateTestCase(testCase.id, { priority: event.target.value as TestCasePriority })}>{["Low", "Normal", "High", "Urgent"].map(value => <option key={value}>{value}</option>)}</select></Field>
            <Field label="Last Verdict"><input aria-label="Test case last verdict" disabled className={fieldClass} style={fieldStyle} value={latestResult?.verdict || "Not Run"} /></Field>
            <Field label="Last Run"><input aria-label="Test case last run" disabled className={fieldClass} style={fieldStyle} value={latestResult?.date || "Not run yet"} /></Field>
            <Field label="Work Product"><input aria-label="Test case work product" disabled className={fieldClass} style={fieldStyle} value={`${parentItem.id} · ${parentItem.title}`} /></Field>
          </aside>
        </div>
      )}
      {!readOnly && isAddResultOpen && <AddTestCaseResultModal testCase={testCase} parentItem={parentItem} testerOptions={projectMembers} defaultTester={defaultTester} onClose={() => setIsAddResultOpen(false)} onCreate={createResult} />}
    </div>
  );
}

function TaskDetailView({ task, parentItem, readOnly, storySplits, onBack, onUpdateTask }: { task: TaskItem; parentItem: WorkItem; readOnly: boolean; storySplits: StorySplit[]; onBack: () => void; onUpdateTask: (id: string, patch: Partial<TaskItem>) => void }) {
  const [activeTaskTab, setActiveTaskTab] = useState<TaskDetailTab>("details");
  const [taskProject, setTaskProject] = useState(task.project);
  const selectedTaskProject = SCOPE_PROJECTS.find(candidate => candidate.key === taskProject) || SCOPE_PROJECTS[0];
  const [taskTeam, setTaskTeam] = useState(task.team && selectedTaskProject.teams.includes(task.team) ? task.team : "");
  const [taskEstimate, setTaskEstimate] = useState(task.estimate);
  const [taskTodo, setTaskTodo] = useState(task.todo);
  const [taskActuals, setTaskActuals] = useState(task.actuals);

  function changeTaskProject(projectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(candidate => candidate.key === projectKey) || SCOPE_PROJECTS[0];
    setTaskProject(nextProject.key);
    setTaskTeam("");
  }

  function updateTaskEstimate(nextEstimate: number) {
    const estimate = Math.max(0, nextEstimate);
    const shouldCopyToDo = taskTodo === 0 && taskActuals === 0;
    setTaskEstimate(estimate);
    if (shouldCopyToDo) setTaskTodo(estimate);
    onUpdateTask(task.id, { estimate, ...(shouldCopyToDo ? { todo: estimate } : {}) });
  }

  function updateTaskTime(nextTodo: number, nextActuals: number) {
    const todo = Math.max(0, nextTodo);
    const actuals = Math.max(0, nextActuals);
    setTaskTodo(todo);
    setTaskActuals(actuals);
    onUpdateTask(task.id, { todo, actuals });
  }

  function changeTaskState(nextState: TaskState) {
    if (nextState === "Completed") {
      setTaskTodo(0);
      onUpdateTask(task.id, { state: nextState, todo: 0 });
      return;
    }
    onUpdateTask(task.id, { state: nextState });
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="shrink-0 text-white" style={{ backgroundColor: "#173f78" }}>
        <div className="h-12 px-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,.18)" }}>
          <button aria-label="Back to task list" onClick={onBack} className="p-1.5 rounded hover:bg-white/10"><ChevronLeft size={18} /></button>
          <span className="px-1.5 py-px text-[10px] font-semibold rounded-sm whitespace-nowrap" style={{ backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" }}>Task</span>
          <span className="font-mono text-[13px] font-semibold text-white">{task.id}</span>
          <span className="h-5 w-px bg-white/25" />
          <h1 className="text-[15px] font-semibold truncate">{task.name}</h1>
          <div className="flex-1" />
          <button aria-label="More task actions" className="p-1.5 rounded hover:bg-white/10"><MoreHorizontal size={17} /></button>
        </div>
        <div className="h-16 px-5 flex items-stretch gap-2">
          <button onClick={() => setActiveTaskTab("details")} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTaskTab === "details" ? "#2f6fc5" : "transparent", color: activeTaskTab === "details" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><FileText size={18} /></span><span>Details</span></button>
          <button onClick={() => setActiveTaskTab("history")} className="w-32 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTaskTab === "history" ? "#2f6fc5" : "transparent", color: activeTaskTab === "history" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><History size={19} /></span><span>Revision History</span></button>
        </div>
      </div>

      {activeTaskTab === "history" ? (
        <TaskActivityLogView task={task} storySplits={storySplits} />
      ) : (
    <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
      <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
        <div className="w-full space-y-5">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-sm text-[10px] font-semibold" style={{ color: "#475569", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1" }}>Task</span>
            <span className="font-mono text-[13px] font-semibold" style={{ color: "#2558a6" }}>{task.id}</span>
            <h2 className="text-[20px] font-semibold truncate" style={{ color: "#273449" }}>{task.name}</h2>
          </div>

          <RichTextEditor title="Description" initialValue={task.description} minHeight={250} readOnly={readOnly} />
          <RichTextEditor title="Notes" initialValue={task.notes} minHeight={220} readOnly={readOnly} />
          <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
            <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Attachments</div>
            <div className="p-3 space-y-2">
              {task.attachments.length > 0 ? task.attachments.map(fileName => <div key={fileName} className="flex items-center justify-between px-3 py-2 rounded text-[12px]" style={{ border: "1px solid #e2e8f0", color: "#334155", backgroundColor: "#fbfdff" }}><span>{fileName}</span><span className="text-[10px]" style={{ color: "#64748b" }}>Attached to task</span></div>) : <p className="text-[12px]" style={{ color: "#64748b" }}>No attachments yet.</p>}
              {!readOnly && <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] rounded text-left" style={{ width: "100%", color: "#2563c5", border: "1px solid #b9c9df", backgroundColor: "#fbfdff" }}><Plus size={15} />Drag or click to add attachments</button>}
            </div>
          </section>
        </div>
      </main>

      <aside className="w-[340px] shrink-0 overflow-y-scroll p-5 space-y-4 bg-white" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}>
        <Field label="State"><select disabled={readOnly} className={fieldClass} style={fieldStyle} value={task.state} onChange={event => changeTaskState(event.target.value as TaskState)}>{["Defined", "In-Progress", "Completed"].map(state => <option key={state}>{state}</option>)}</select></Field>
        <Field label="Owner"><select disabled={readOnly} className={fieldClass} style={fieldStyle} defaultValue={task.owner.name}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>
        <Field label="Project"><select disabled={readOnly} aria-label="Task project" value={taskProject} onChange={event => changeTaskProject(event.target.value)} className={fieldClass} style={fieldStyle}>{SCOPE_PROJECTS.map(scopeProject => <option key={scopeProject.key} value={scopeProject.key}>{scopeProject.key} · {scopeProject.name}</option>)}</select></Field>
        <Field label="Team"><select disabled={readOnly} aria-label="Task team" value={taskTeam} onChange={event => setTaskTeam(event.target.value)} className={fieldClass} style={fieldStyle}><option value="">Project backlog</option>{selectedTaskProject.teams.map(scopeTeam => <option key={scopeTeam}>{scopeTeam}</option>)}</select></Field>
        <Field label="Start Date"><input aria-label="Task start date" disabled className={fieldClass} style={{ ...fieldStyle, backgroundColor: "#f8fafc", color: task.startDate ? "#1a2234" : "#8c94a6" }} value={formatCompactDate(task.startDate)} /></Field>
        <Field label="Actual End Date"><input aria-label="Task actual end date" disabled className={fieldClass} style={{ ...fieldStyle, backgroundColor: "#f8fafc", color: task.actualEndDate ? "#1a2234" : "#8c94a6" }} value={formatCompactDate(task.actualEndDate)} /></Field>
        <Field label="Work Product"><select disabled={readOnly} className={fieldClass} style={fieldStyle} defaultValue={parentItem.id}><option value={parentItem.id}>{parentItem.id} · {parentItem.title}</option><option value="unscheduled">Unassigned</option></select></Field>
        <Field label="Estimate"><input disabled={readOnly} className={fieldClass} style={fieldStyle} type="number" min={0} value={taskEstimate} onChange={event => updateTaskEstimate(Number(event.target.value) || 0)} /></Field>
        <Field label="To Do"><input disabled={readOnly} className={fieldClass} style={fieldStyle} type="number" min={0} value={taskTodo} onChange={event => updateTaskTime(Number(event.target.value) || 0, taskActuals)} /></Field>
        <Field label="Actual"><input disabled={readOnly} className={fieldClass} style={fieldStyle} type="number" min={0} value={taskActuals} onChange={event => updateTaskTime(taskTodo, Number(event.target.value) || 0)} /></Field>
      </aside>
    </div>
      )}
    </div>
  );
}

function CarryoverConfirmModal({ item, tasks, source, target, targetDate, onCancel, onConfirm }: { item: WorkItem; tasks: TaskItem[]; source: IterationItem; target?: IterationItem; targetDate: string; onCancel: () => void; onConfirm: () => void }) {
  const unfinishedTasks = tasks.filter(task => task.state !== "Completed");
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
      <button aria-label="Close carryover confirmation" onClick={onCancel} className="absolute inset-0 h-full w-full" style={{ backgroundColor: "rgba(15,23,42,.42)" }} />
      <section role="dialog" aria-modal="true" aria-labelledby="carryover-title" className="relative w-full max-w-[620px] overflow-hidden rounded-md bg-white shadow-2xl" style={{ border: "1px solid #cfd8e6" }}>
        <div className="flex items-start gap-3 px-5 py-4" style={{ backgroundColor: "#fff8e8", borderBottom: "1px solid #f1d89b" }}>
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#f8e3ad", color: "#9a6509" }}><CalendarClock size={19} /></span>
          <div className="min-w-0 flex-1">
            <h2 id="carryover-title" className="text-[16px] font-semibold" style={{ color: "#273449" }}>This User Story will carry over</h2>
            <p className="mt-1 text-[12px] leading-5" style={{ color: "#5c6478" }}>Target End Date <span className="font-semibold" style={{ color: "#9a6509" }}>{targetDate}</span> is outside {source.name}, which ends on {iterationDateValue(source.endDate)}.</p>
          </div>
          <button aria-label="Close" onClick={onCancel} className="rounded p-1" style={{ color: "#64748b" }}><X size={16} /></button>
        </div>

        <div className="space-y-4 p-5">
          {target ? (
            <>
              <div className="flex items-center gap-3 rounded-md px-4 py-3" style={{ backgroundColor: "#f8fafc", border: "1px solid #dde2ea" }}>
                <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Current iteration</p><p className="mt-1 text-[13px] font-semibold" style={{ color: "#273449" }}>{source.name}</p><p className="text-[10px]" style={{ color: "#64748b" }}>{iterationDateValue(source.startDate)} — {iterationDateValue(source.endDate)}</p></div>
                <ArrowRight size={18} style={{ color: "#2558a6" }} />
                <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#8c94a6" }}>Bring to iteration</p><p className="mt-1 text-[13px] font-semibold" style={{ color: "#2558a6" }}>{target.name}</p><p className="text-[10px]" style={{ color: "#64748b" }}>{iterationDateValue(target.startDate)} — {iterationDateValue(target.endDate)}</p></div>
              </div>
              <div className="rounded-md px-4 py-3 text-[11px] leading-5" style={{ backgroundColor: "#eef3fb", border: "1px solid #bdd0ef", color: "#334155" }}>
                <p><span className="font-semibold">{item.id}</span> and all {tasks.length} Tasks move immediately to {target.name}.</p>
                <p>{unfinishedTasks.length} unfinished Task{unfinishedTasks.length === 1 ? "" : "s"} keep their Start Date, effort and history. The original Carryover event remains in Revision History.</p>
              </div>
            </>
          ) : (
            <div className="flex gap-3 rounded-md px-4 py-3" style={{ backgroundColor: "#fff4f2", border: "1px solid #f0b7ad", color: "#9b2c20" }}><AlertTriangle size={17} className="mt-0.5 shrink-0" /><div><p className="text-[12px] font-semibold">No destination iteration contains {targetDate}</p><p className="mt-1 text-[11px] leading-5">Create or select an iteration covering this date before carrying over the Story.</p></div></div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3" style={{ backgroundColor: "#f8fafc", borderTop: "1px solid #dde2ea" }}>
          <button onClick={onCancel} className="rounded px-4 py-2 text-[12px] font-medium" style={{ backgroundColor: "white", border: "1px solid #d7dde7", color: "#475569" }}>Cancel</button>
          <button disabled={!target} onClick={onConfirm} className="rounded px-4 py-2 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }}>Accept &amp; Carry Over</button>
        </div>
      </section>
    </div>
  );
}

export function WorkItemDetailPage({ item, role, readOnly = false, project, team: initialTeam, iterations, releases, milestones, features, tasks, testCases, testCaseResults, testCaseTypes, storySplits, onCreateTask, onCreateTestCase, onCreateTestCaseResult, onUpdateTask, onUpdateTestCase, onUpdateTestCaseResult, onUpdateItem, onBack, onMinimize, onSplit }: { item: WorkItem; role: Role; readOnly?: boolean; project: ScopeProject; team: string; iterations: IterationItem[]; releases: ReleaseItem[]; milestones: MilestoneItem[]; features: Feature[]; tasks: TaskItem[]; testCases: TestCaseItem[]; testCaseResults: TestCaseResultItem[]; testCaseTypes: string[]; storySplits: StorySplit[]; onCreateTask: (parent: WorkItem, input: NewTaskInput) => TaskItem; onCreateTestCase: (parent: WorkItem, input: NewTestCaseInput) => TestCaseItem; onCreateTestCaseResult: (testCase: TestCaseItem, input: NewTestCaseResultInput) => TestCaseResultItem; onUpdateTask: (id: string, patch: Partial<TaskItem>) => void; onUpdateTestCase: (id: string, patch: Partial<TestCaseItem>) => void; onUpdateTestCaseResult: (id: string, patch: Partial<TestCaseResultItem>) => void; onUpdateItem: (id: string, patch: Partial<WorkItem>) => void; onSplit?: (item: WorkItem) => void; onBack: () => void; onMinimize?: (item: WorkItem) => void }) {
  const [activeTab, setActiveTab] = useState<DetailTab>("details");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddTestCaseOpen, setIsAddTestCaseOpen] = useState(false);
  const [showItemActions, setShowItemActions] = useState(false);
  const [pendingCarryover, setPendingCarryover] = useState<{ targetDate: string; source: IterationItem; target?: IterationItem } | null>(null);
  const taskRows = tasks;
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCaseItem | null>(null);
  const [selectedProjectKey, setSelectedProjectKey] = useState(item.project || project.key);
  const selectedProject = SCOPE_PROJECTS.find(candidate => candidate.key === selectedProjectKey) || project;
  const [team, setTeam] = useState(item.team && selectedProject.teams.includes(item.team) ? item.team : "");
  const taskTotals = calculateTaskTotals(taskRows);
  const taskDashboardEditable = !readOnly;
  const workItemIterationOptions = Array.from(new Set([item.iteration, ...iterations.map(iteration => iteration.name), "Unscheduled"]));
  const workItemReleaseOptions = Array.from(new Set([item.release, "Unscheduled", ...releases.filter(release => release.projectKey === selectedProjectKey).map(release => release.name)]));
  const featureOptions = features.filter(feature => feature.project === selectedProjectKey && !feature.archivedAt);
  const selectedMilestoneIds = item.milestoneIds || [];
  const selectedRelease = releases.find(release => release.id === item.releaseId) || releases.find(release => release.name === item.release);
  const currentIteration = iterations.find(iteration => iteration.name === item.iteration && iteration.projectKey === selectedProjectKey);
  const eligibleTargetIterations = currentIteration
    ? iterations
      .filter(iteration => iteration.projectKey === currentIteration.projectKey && iteration.team === currentIteration.team && iterationDateValue(iteration.startDate) >= iterationDateValue(currentIteration.startDate))
      .sort((left, right) => left.startDate.localeCompare(right.startDate))
    : [];
  const targetDateOutsideCurrentIteration = Boolean(item.targetEndDate && currentIteration && item.targetEndDate > iterationDateValue(currentIteration.endDate));
  const milestoneOptions = milestones.filter(milestone =>
    selectedMilestoneIds.includes(milestone.id) ||
    (selectedRelease ? milestone.releaseIds.includes(selectedRelease.id) : milestone.projectKeys.includes(selectedProjectKey))
  );
  const splitReason = splitActionReason(item, iterations, !readOnly);

  function changeProject(projectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(candidate => candidate.key === projectKey) || project;
    const keepFeatureId = features.some(feature => feature.id === item.featureId && feature.project === nextProject.key && !feature.archivedAt);
    setSelectedProjectKey(nextProject.key);
    setTeam("");
    onUpdateItem(item.id, { project: nextProject.key, team: undefined, featureId: keepFeatureId ? item.featureId : undefined });
  }

  function changeTeam(nextTeam: string) {
    setTeam(nextTeam);
    onUpdateItem(item.id, { team: nextTeam || undefined });
  }

  function changeWorkItemState(nextState: StatusType) {
    onUpdateItem(item.id, { status: nextState, ...(["Accepted", "Release"].includes(nextState) ? { acceptedDate: new Date().toISOString() } : {}) });
  }

  function changeIteration(nextIteration: string) {
    if (nextIteration === item.iteration) return;
    onUpdateItem(item.id, {
      iteration: nextIteration,
      iterationTransitions: [
        ...(item.iterationTransitions || []),
        {
          id: `MOVE-${Date.now()}`,
          type: "Manual Move",
          at: new Date().toLocaleString(),
          fromIteration: item.iteration,
          toIteration: nextIteration,
          taskSnapshots: taskRows.map(task => ({ taskId: task.id, state: task.state, estimate: task.estimate, todo: task.todo, actuals: task.actuals })),
        },
      ],
    });
  }

  function changeTargetEndDate(targetDate: string) {
    if (!targetDate) {
      onUpdateItem(item.id, { targetEndDate: null });
      return;
    }
    if (item.startDate && targetDate < item.startDate) return;
    const source = iterations.find(iteration => iteration.name === item.iteration && iteration.projectKey === selectedProjectKey);
    if (!source || targetDate <= iterationDateValue(source.endDate)) {
      onUpdateItem(item.id, { targetEndDate: targetDate });
      return;
    }
    const target = iterations
      .filter(iteration => iteration.projectKey === selectedProjectKey && iteration.team === source.team)
      .find(iteration => targetDate >= iterationDateValue(iteration.startDate) && targetDate <= iterationDateValue(iteration.endDate));
    setPendingCarryover({ targetDate, source, target });
  }

  function acceptCarryover() {
    if (!pendingCarryover?.target) return;
    onUpdateItem(item.id, {
      targetEndDate: pendingCarryover.targetDate,
      iteration: pendingCarryover.target.name,
      iterationTransitions: [
        ...(item.iterationTransitions || []),
        {
          id: `CARRY-${Date.now()}`,
          type: "Carryover",
          at: new Date().toLocaleString(),
          fromIteration: pendingCarryover.source.name,
          toIteration: pendingCarryover.target.name,
          targetEndDate: pendingCarryover.targetDate,
          taskSnapshots: taskRows.map(task => ({ taskId: task.id, state: task.state, estimate: task.estimate, todo: task.todo, actuals: task.actuals })),
        },
      ],
    });
    setPendingCarryover(null);
  }

  function toggleMilestone(milestoneId: string) {
    const next = selectedMilestoneIds.includes(milestoneId)
      ? selectedMilestoneIds.filter(id => id !== milestoneId)
      : [...selectedMilestoneIds, milestoneId];
    onUpdateItem(item.id, { milestoneIds: next });
  }

  function updateTaskRow(id: string, patch: Partial<TaskItem>) {
    const currentTask = taskRows.find(task => task.id === id) || selectedTask;
    const nextTodo = Math.max(0, Number(patch.todo ?? currentTask?.todo ?? 0));
    const nextActuals = Math.max(0, Number(patch.actuals ?? currentTask?.actuals ?? 0));
    const shouldComplete = patch.state === "Completed";
    const shouldCopyEstimateToTodo = patch.estimate !== undefined && nextTodo === 0 && nextActuals === 0;
    const lifecycleDate = new Date().toISOString().slice(0, 10);
    const derivedPatch = {
      ...patch,
      ...(shouldComplete ? { todo: 0 } : {}),
      ...(shouldCopyEstimateToTodo ? { todo: Math.max(0, Number(patch.estimate) || 0) } : {}),
      ...(patch.state === "In-Progress" && !currentTask?.startDate ? { startDate: lifecycleDate } : {}),
      ...(patch.state === "Completed" && !currentTask?.actualEndDate ? { actualEndDate: lifecycleDate } : {}),
    };
    onUpdateTask(id, derivedPatch);
    setSelectedTask(previous => previous?.id === id ? { ...previous, ...derivedPatch } : previous);
  }
  function createTask(input: NewTaskInput, openDetails: boolean) {
    const task = onCreateTask(item, input);
    if (openDetails) setSelectedTask(task);
  }
  function createTestCase(input: NewTestCaseInput) {
    onCreateTestCase(item, input);
  }
  function updateTestCaseRow(id: string, patch: Partial<TestCaseItem>) {
    onUpdateTestCase(id, patch);
    setSelectedTestCase(previous => previous?.id === id ? { ...previous, ...patch } : previous);
  }

  if (selectedTask) {
    return <TaskDetailView task={selectedTask} parentItem={item} readOnly={readOnly} storySplits={storySplits} onBack={() => setSelectedTask(null)} onUpdateTask={updateTaskRow} />;
  }
  if (selectedTestCase) {
    return <TestCaseDetailView testCase={selectedTestCase} parentItem={item} testCaseTypes={testCaseTypes} results={testCaseResults.filter(result => result.testCaseId === selectedTestCase.id)} defaultTester={DEMO_ACCESS_PROFILES[role].owner} readOnly={readOnly} storySplits={storySplits} onBack={() => { setSelectedTestCase(null); setActiveTab("testCases"); }} onUpdateTestCase={updateTestCaseRow} onCreateResult={onCreateTestCaseResult} onUpdateResult={onUpdateTestCaseResult} />;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="shrink-0 text-white" style={{ backgroundColor: "#173f78" }}>
        <div className="h-12 px-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,.18)" }}>
          <button aria-label="Back to backlog" onClick={onBack} className="p-1.5 rounded hover:bg-white/10"><ChevronLeft size={18} /></button>
          <TypeBadge type={item.type} />
          <span className="font-mono text-[13px] font-semibold text-white">{item.id}</span>
          <span className="h-5 w-px bg-white/25" />
          <h1 className="text-[15px] font-semibold truncate">{item.title}</h1>
          <div className="flex-1" />
          <button aria-label="Collapse work item to summary panel" title="Collapse to summary" onClick={() => onMinimize ? onMinimize(item) : onBack()} className="p-1.5 rounded hover:bg-white/10"><Minimize2 size={17} /></button>
          <div className="relative">
            <button aria-label="More work item actions" aria-expanded={showItemActions} onClick={() => setShowItemActions(!showItemActions)} className="p-1.5 rounded hover:bg-white/10"><MoreHorizontal size={17} /></button>
            {showItemActions && <div className="absolute right-0 top-full z-30 w-64 rounded border border-slate-200 bg-white p-1 text-xs text-slate-700 shadow-lg">
              <button disabled={!!splitReason} onClick={() => { setShowItemActions(false); onSplit?.(item); }} className="w-full rounded px-3 py-2.5 text-left hover:bg-blue-50 disabled:opacity-40">Split unfinished story</button>
              <button onClick={() => setShowItemActions(false)} className="w-full rounded px-3 py-2 text-left text-slate-500 hover:bg-slate-50">Close menu</button>
            </div>}
          </div>
        </div>
        <div className="h-16 px-5 flex items-stretch gap-2">
          <button onClick={() => { setSelectedTask(null); setActiveTab("details"); }} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "details" ? "#2f6fc5" : "transparent", color: activeTab === "details" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><FileText size={18} /></span><span>Details</span></button>
          <button onClick={() => { setSelectedTask(null); setActiveTab("tasks"); }} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "tasks" ? "#2f6fc5" : "transparent", color: activeTab === "tasks" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center gap-1.5"><ListChecks size={19} /><span className="text-[10px] font-semibold tabular-nums">{item.taskCount}</span></span><span>Tasks</span></button>
          <button onClick={() => { setSelectedTask(null); setActiveTab("testCases"); }} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "testCases" ? "#2f6fc5" : "transparent", color: activeTab === "testCases" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center gap-1.5"><ClipboardCheck size={19} /><span className="text-[10px] font-semibold tabular-nums">{testCases.length}</span></span><span>Test Cases</span></button>
          <button onClick={() => { setSelectedTask(null); setActiveTab("history"); }} className="w-32 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "history" ? "#2f6fc5" : "transparent", color: activeTab === "history" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><History size={19} /></span><span>Revision History</span></button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
        <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
          {activeTab === "details" ? (
            <div className="w-full space-y-5">
              <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Details</h2>
              <RichTextEditor title="Description" initialValue={item.description} minHeight={250} readOnly={readOnly} />
              <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
                <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Attachments</div>
                {!readOnly && <button className="m-3 flex items-center gap-1.5 px-3 py-2 text-[12px] rounded text-left" style={{ width: "calc(100% - 24px)", color: "#2563c5", border: "1px solid #b9c9df", backgroundColor: "#fbfdff" }}><Plus size={15} />Drag or click to add attachments</button>}
              </section>
              <RichTextEditor title="Notes" minHeight={220} readOnly={readOnly} />
              <RichTextEditor title="Release Notes (Technical Writer Content)" minHeight={160} readOnly={readOnly || role === "Editor"} />
            </div>
          ) : activeTab === "history" ? (
            <ActivityLogView item={item} storySplits={storySplits} />
          ) : activeTab === "tasks" ? (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4"><div><h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Tasks</h2><p className="text-[11px] mt-1" style={{ color: "#64748b" }}>Break this work item into trackable delivery tasks.</p></div>{!readOnly && <button onClick={() => setIsAddTaskOpen(true)} className="flex items-center gap-1.5 px-3 py-2 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: "#1d3f73" }}><Plus size={13} />Add Task</button>}</div>
              <div className="bg-white rounded overflow-x-auto" style={{ border: "1px solid #dde2ea" }}>
                <div className="min-w-[1450px]">
                  <div className="grid h-10 items-center" style={{ gridTemplateColumns: TASK_GRID_COLUMNS, backgroundColor: "white", borderBottom: "2px solid #9fb4d1" }}>
                    <div className="flex items-center justify-center h-full" style={{ borderRight: "1px dashed #8c99ad" }}><input type="checkbox" aria-label="Select all tasks" className="w-4 h-4 rounded" /></div>
                    <TaskHeaderCell label="Rank" />
                    <TaskHeaderCell label="ID" />
                    <TaskHeaderCell label="Name" />
                    <TaskHeaderCell label="State" />
                    <TaskHeaderCell label="Owner" activeSort />
                    <TaskHeaderCell label="Project" />
                    <TaskHeaderCell label="Teams" />
                    <TaskHeaderCell label="Start Date" />
                    <TaskHeaderCell label="Actual End" />
                    <TaskHeaderCell label="To Do" />
                    <TaskHeaderCell label="Actuals" />
                    <span className="flex items-center h-full px-3 text-[12px] font-semibold" style={{ color: "#1f2937" }}>Estimate</span>
                  </div>

                  <div className="grid h-8 items-center text-[12px] font-semibold" style={{ gridTemplateColumns: TASK_GRID_COLUMNS, backgroundColor: "#f3f6fa", borderBottom: "1px solid #d7dde7", color: "#1f2937" }}>
                    <span />
                    <span className="px-3">Totals</span>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span className="px-3 text-right font-mono">{taskTotals.todo} Hours</span>
                    <span className="px-3 text-right font-mono">{taskTotals.actuals} Hours</span>
                    <span className="px-3 text-right font-mono">{taskTotals.estimate} Hours</span>
                  </div>

                  {taskRows.map(task => (
                    <div key={task.id} className="grid min-h-11 items-center text-[12px]" style={{ gridTemplateColumns: TASK_GRID_COLUMNS, borderBottom: "1px solid #edf0f4", color: "#334155" }}>
                      <div className="flex items-center justify-center"><input type="checkbox" aria-label={`Select task ${task.id}`} className="w-4 h-4 rounded" /></div>
                      <span className="px-3 font-mono text-[11px]" style={{ color: "#64748b" }}>{task.rank}</span>
                      <button onClick={() => setSelectedTask(task)} className="px-3 text-left font-mono text-[11px] underline-offset-2 hover:underline" style={{ color: "#2558a6" }}>{task.id}</button>
                      <span className="px-3 min-w-0">
                        <input aria-label={`${task.id} task dashboard name`} readOnly={!taskDashboardEditable} value={task.name} onChange={event => updateTaskRow(task.id, { name: event.target.value })} className="w-full truncate rounded-sm bg-transparent px-1 py-1 font-medium focus:outline-none focus:bg-white" style={{ color: "#273449", border: taskDashboardEditable ? "1px solid transparent" : "0" }} />
                      </span>
                      <span className="px-3">
                        {taskDashboardEditable ? (
                          <select aria-label={`${task.id} task dashboard state`} value={task.state} onChange={event => updateTaskRow(task.id, { state: event.target.value as TaskState })} className="w-[120px] text-[11px] rounded-sm bg-white px-2 py-1 focus:outline-none" style={{ border: "1px solid #bdd0ef", color: "#2558a6" }}>
                            {["Defined", "In-Progress", "Completed"].map(state => <option key={state}>{state}</option>)}
                          </select>
                        ) : (
                          <TaskStateBadge state={task.state} />
                        )}
                      </span>
                      <span className="px-3 flex items-center gap-2 min-w-0">
                        <Avatar owner={task.owner} size="xs" />
                        {taskDashboardEditable ? (
                          <select aria-label={`${task.id} task dashboard owner`} value={task.owner.name} onChange={event => updateTaskRow(task.id, { owner: OWNERS.find(owner => owner.name === event.target.value) ?? task.owner })} className="min-w-0 flex-1 text-[11px] rounded-sm bg-white px-2 py-1 focus:outline-none" style={{ border: "1px solid #d7dde7", color: "#334155" }}>
                            {OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}
                          </select>
                        ) : (
                          <span className="truncate">{task.owner.name}</span>
                        )}
                      </span>
                      <span className="px-3 truncate">{task.project}</span>
                      <span className="px-3 truncate">{task.team || "Project backlog"}</span>
                      <span className="px-3 font-mono text-[11px]" style={{ color: task.startDate ? "#334155" : "#94a3b8" }}>{formatCompactDate(task.startDate)}</span>
                      <span className="px-3 font-mono text-[11px]" style={{ color: task.actualEndDate ? "#334155" : "#94a3b8" }}>{formatCompactDate(task.actualEndDate)}</span>
                      <span className="px-3"><input aria-label={`${task.id} task dashboard todo`} readOnly={!taskDashboardEditable} type="number" min={0} value={task.todo} onChange={event => updateTaskRow(task.id, { todo: Number(event.target.value) })} className="w-full rounded-sm bg-transparent px-1 py-1 text-right font-mono focus:outline-none focus:bg-white" style={{ border: taskDashboardEditable ? "1px solid transparent" : "0", color: "#334155" }} /></span>
                      <span className="px-3"><input aria-label={`${task.id} task dashboard actuals`} readOnly={!taskDashboardEditable} type="number" min={0} value={task.actuals} onChange={event => updateTaskRow(task.id, { actuals: Number(event.target.value) })} className="w-full rounded-sm bg-transparent px-1 py-1 text-right font-mono focus:outline-none focus:bg-white" style={{ border: taskDashboardEditable ? "1px solid transparent" : "0", color: "#334155" }} /></span>
                      <span className="px-3"><input aria-label={`${task.id} task dashboard estimate`} readOnly={!taskDashboardEditable} type="number" min={0} value={task.estimate} onChange={event => updateTaskRow(task.id, { estimate: Number(event.target.value) })} className="w-full rounded-sm bg-transparent px-1 py-1 text-right font-mono focus:outline-none focus:bg-white" style={{ border: taskDashboardEditable ? "1px solid transparent" : "0", color: "#334155" }} /></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <TestCasesView rows={testCases} readOnly={readOnly} onAdd={() => setIsAddTestCaseOpen(true)} onOpen={setSelectedTestCase} />
          )}
        </main>

        {activeTab === "details" && (
        <aside className="w-[340px] shrink-0 overflow-y-scroll p-5 space-y-4 bg-white" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}>
          <Field label="Owner"><select disabled={readOnly} aria-label="Detail owner" className={fieldClass} style={fieldStyle} value={item.owner.name} onChange={event => onUpdateItem(item.id, { owner: OWNERS.find(owner => owner.name === event.target.value) ?? item.owner })}>{OWNERS.map(owner => <option key={owner.name}>{owner.name}</option>)}</select></Field>
          <Field label="Project"><select disabled={readOnly} aria-label="Detail project" value={selectedProjectKey} onChange={event => changeProject(event.target.value)} className={fieldClass} style={fieldStyle}>{SCOPE_PROJECTS.map(scopeProject => <option key={scopeProject.key} value={scopeProject.key}>{scopeProject.key} · {scopeProject.name}</option>)}</select></Field>
          <Field label="Team"><select disabled={readOnly} aria-label="Detail team" value={team} onChange={event => changeTeam(event.target.value)} className={fieldClass} style={fieldStyle}><option value="">Project backlog</option>{selectedProject.teams.map(scopeTeam => <option key={scopeTeam}>{scopeTeam}</option>)}</select></Field>
          <Field label="Feature"><select disabled={readOnly} aria-label="Detail feature" className={fieldClass} style={fieldStyle} value={item.featureId || ""} onChange={event => onUpdateItem(item.id, { featureId: event.target.value || undefined })}><option value="">Unassigned</option>{featureOptions.map(feature => <option key={feature.id} value={feature.id}>{feature.id} · {feature.name}</option>)}</select></Field>
          <Field label="Schedule State"><ScheduleStateBar aria-label="Schedule State" value={item.status} onChange={readOnly ? undefined : next => changeWorkItemState(next)} /></Field>
          <Field label="Flow State"><select aria-label="Flow State" disabled={readOnly} className={fieldClass} style={fieldStyle} value={item.status} onChange={event => changeWorkItemState(event.target.value as StatusType)}>{WORK_ITEM_STATE_OPTIONS.map(status => <option key={status}>{status}</option>)}</select></Field>
          {item.type === "Defect" && <Field label="Priority"><select disabled={readOnly} className={fieldClass} style={fieldStyle} defaultValue={DEFECT_PRIORITY_DEFAULTS[item.priority] ?? "None"}>{DEFECT_PRIORITY_OPTIONS.map(priority => <option key={priority}>{priority}</option>)}</select></Field>}
          <Field label="Plan Estimate"><input aria-label="Detail plan estimate" disabled={readOnly} className={fieldClass} style={fieldStyle} type="number" min={0} value={item.planEstimate} onChange={event => onUpdateItem(item.id, { planEstimate: Number(event.target.value) })} /></Field>
          <Field label="Release"><select aria-label="Detail release" disabled={readOnly || role === "Editor"} className={fieldClass} style={fieldStyle} value={item.release} onChange={event => onUpdateItem(item.id, { release: event.target.value, releaseId: releases.find(release => release.name === event.target.value)?.id })}>{workItemReleaseOptions.map(release => <option key={release}>{release}</option>)}</select></Field>
          <Field label="Milestones">
            <details className="rounded bg-white" style={fieldStyle}>
              <summary className="cursor-pointer list-none px-3 py-2 text-[12px]" style={{ color: "#1a2234" }}>{selectedMilestoneIds.length} milestone{selectedMilestoneIds.length === 1 ? "" : "s"} selected</summary>
              <div className="max-h-44 overflow-y-auto px-2 pb-2" style={{ borderTop: "1px solid #edf0f4" }}>
                {milestoneOptions.length === 0 ? <p className="px-1 py-2 text-[11px]" style={{ color: "#8c94a6" }}>No related milestone available</p> : milestoneOptions.map(milestone => (
                  <label key={milestone.id} className="flex items-start gap-2 rounded px-1 py-1.5 text-[11px] hover:bg-[#f8fafc]" style={{ color: "#334155" }}>
                    <input type="checkbox" disabled={readOnly || role === "Editor"} checked={selectedMilestoneIds.includes(milestone.id)} onChange={() => toggleMilestone(milestone.id)} className="mt-0.5 h-3.5 w-3.5" />
                    <span><span className="block font-medium">{milestone.name}</span><span className="block text-[10px]" style={{ color: "#8c94a6" }}>{milestone.id}</span></span>
                  </label>
                ))}
              </div>
            </details>
          </Field>
          <Field label="Iteration"><select aria-label="Detail iteration" disabled={readOnly} className={fieldClass} style={fieldStyle} value={item.iteration} onChange={event => changeIteration(event.target.value)}>{workItemIterationOptions.map(iteration => <option key={iteration}>{iteration}</option>)}</select></Field>
          {item.type === "Story" && <Field label="Start Date"><input aria-label="Story start date" disabled className={fieldClass} style={{ ...fieldStyle, backgroundColor: "#f8fafc", color: item.startDate ? "#1a2234" : "#8c94a6" }} value={formatCompactDate(item.startDate)} /></Field>}
          {item.type === "Story" && <Field label="Target End Date">
            <div className="flex gap-2">
              <TargetEndDatePicker value={item.targetEndDate} storyStartDate={item.startDate} allowedIterations={eligibleTargetIterations} disabled={readOnly} invalid={targetDateOutsideCurrentIteration} onChange={changeTargetEndDate} />
              {!readOnly && item.targetEndDate && <button type="button" aria-label="Clear target end date" title="Clear Target End Date" onClick={() => changeTargetEndDate("")} className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded bg-white" style={{ border: "1px solid #d7dde7", color: "#64748b" }}><X size={14} /></button>}
            </div>
            {targetDateOutsideCurrentIteration && <p className="mt-1.5 flex items-start gap-1 text-[10px] leading-4" style={{ color: "#9a6509" }}><AlertTriangle size={12} className="mt-0.5 shrink-0" />Target End Date is outside {item.iteration}. Clear it or choose another date.</p>}
          </Field>}
          {item.type === "Story" && <Field label="Actual End Date"><input aria-label="Story actual end date" disabled className={fieldClass} style={{ ...fieldStyle, backgroundColor: "#f8fafc", color: item.acceptedDate ? "#1a2234" : "#8c94a6" }} value={formatCompactDate(item.acceptedDate)} /></Field>}
        </aside>
        )}
      </div>
      {!readOnly && isAddTaskOpen && <AddTaskModal defaultOwner={item.owner.name} onClose={() => setIsAddTaskOpen(false)} onCreate={createTask} />}
      {!readOnly && isAddTestCaseOpen && <AddTestCaseModal defaultOwner={DEMO_ACCESS_PROFILES[role].owner.name} ownerOptions={PROJECT_MEMBER_OWNERS[selectedProjectKey] || OWNERS.filter(owner => owner.name !== "Unassigned")} testCaseTypes={testCaseTypes} onClose={() => setIsAddTestCaseOpen(false)} onCreate={createTestCase} />}
      {pendingCarryover && <CarryoverConfirmModal item={item} tasks={taskRows} source={pendingCarryover.source} target={pendingCarryover.target} targetDate={pendingCarryover.targetDate} onCancel={() => setPendingCarryover(null)} onConfirm={acceptCarryover} />}
    </div>
  );
}
