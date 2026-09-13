import { useEffect, useMemo, useRef, useState, type Dispatch, type DragEvent, type ReactNode, type SetStateAction } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, GitBranch, X } from "lucide-react";
import type { IterationItem, ReleaseItem, StatusType, TaskItem, TestCaseItem, WorkItem } from "../model";
import { splitTargets, splitUnavailableReason, type SplitSideDraft, type StorySplit, type StorySplitPlan } from "../splitStory";

type CollectionKind = "task" | "defect" | "testCase";
type Side = "unfinished" | "continued";
type Row = { id: string };
const states: StatusType[] = ["Idea", "Defined", "In-Progress", "Completed", "Accepted"];
const hours = (tasks: TaskItem[], field: "actuals" | "todo") => tasks.reduce((sum, task) => sum + task[field], 0);
const bareTitle = (title: string) => title.replace(/^\[(Continued|Unfinished)\]\s*/i, "");
const inputClass = "w-full rounded border border-[#c7d2e2] bg-white px-2 py-1.5 text-[11px]";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1 block text-[9px] font-semibold uppercase tracking-wide text-[#5d6b80]">{label}</span>{children}</label>;
}

function DropSection({ title, kind, side, rows, header, renderRow, onMove }: {
  title: string; kind: CollectionKind; side: Side; rows: Row[]; header: ReactNode;
  renderRow: (row: Row) => ReactNode; onMove: (kind: CollectionKind, id: string, side: Side) => void;
}) {
  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const [dragKind, id] = event.dataTransfer.getData("text/plain").split(":");
    if (dragKind === kind && id) onMove(kind, id, side);
  }
  const destination = side === "unfinished" ? "Continued" : "Unfinished";
  return <section onDragOver={event => event.preventDefault()} onDrop={drop} className="overflow-hidden rounded border border-[#d9e0ea] bg-white">
    <div className="flex items-center justify-between bg-[#f6f8fb] px-3 py-2"><h4 className="text-[11px] font-semibold text-[#334155]">{title}</h4><span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-semibold text-slate-600">{rows.length}</span></div>
    <div className="grid min-w-[470px] grid-cols-[90px_1fr_76px_64px_30px] border-y border-[#d9e0ea] bg-[#fbfcfe] px-2 py-1.5 text-[9px] font-semibold uppercase tracking-wide text-[#66758a]">{header}<span aria-hidden="true" /></div>
    {rows.length === 0 ? <div className="flex h-14 items-center justify-center text-[11px] font-semibold text-[#718096]">Drag {title} here</div> : rows.map(row => <div key={row.id} draggable onDragStart={event => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", `${kind}:${row.id}`); }} className="group grid min-w-[470px] cursor-grab grid-cols-[90px_1fr_76px_64px_30px] items-center border-b border-[#edf0f5] px-2 py-2 text-[10px] last:border-b-0 active:cursor-grabbing">{renderRow(row)}<button type="button" title={`Move to ${destination}`} aria-label={`Move ${row.id} to ${destination}`} onClick={() => onMove(kind, row.id, side === "unfinished" ? "continued" : "unfinished")} className="ml-auto rounded border border-[#cbd5e1] p-1 text-[#2558a6] opacity-70 hover:bg-blue-50 group-hover:opacity-100">{side === "unfinished" ? <ArrowRight size={12} /> : <ArrowLeft size={12} />}</button></div>)}
  </section>;
}

export function SplitStoryDialog({ item, tasks, relatedDefects, testCases, iterations, releases, onClose, onSplit }: {
  item: WorkItem; tasks: TaskItem[]; relatedDefects: WorkItem[]; testCases: TestCaseItem[]; iterations: IterationItem[]; releases: ReleaseItem[]; onClose: () => void;
  onSplit: (plan: StorySplitPlan) => void;
}) {
  const targets = splitTargets(item, iterations);
  const availableReleases = releases.filter(release => release.projectKey === item.project);
  const itemRelease = availableReleases.find(release => release.id === item.releaseId || release.name === item.release);
  const [targetId, setTargetId] = useState(targets[0]?.id || "");
  const [unfinished, setUnfinished] = useState<SplitSideDraft>({ title: `[Unfinished] ${bareTitle(item.title)}`, release: "Unscheduled", releaseId: undefined, status: "Accepted", planEstimate: item.planEstimate });
  const [continued, setContinued] = useState<SplitSideDraft>({ title: `[Continued] ${bareTitle(item.title)}`, release: itemRelease?.name || item.release, releaseId: itemRelease?.id, status: item.status, planEstimate: item.planEstimate });
  const [estimateText, setEstimateText] = useState<Record<Side, string>>({ unfinished: String(item.planEstimate), continued: String(item.planEstimate) });
  const [unfinishedTaskIds, setUnfinishedTaskIds] = useState(() => new Set(tasks.filter(task => task.state === "Completed").map(task => task.id)));
  const [unfinishedDefectIds, setUnfinishedDefectIds] = useState(() => new Set<string>());
  const [unfinishedTestCaseIds, setUnfinishedTestCaseIds] = useState(() => new Set<string>());
  const dialog = useRef<HTMLDivElement>(null);
  const target = targets.find(row => row.id === targetId);
  const reason = splitUnavailableReason(item) || (!target ? "No later open iteration matches this story's Project and Team." : "");
  const parsedEstimates = { unfinished: Number(estimateText.unfinished), continued: Number(estimateText.continued) };
  const estimateIsValid = (side: Side) => estimateText[side].trim() !== "" && Number.isFinite(parsedEstimates[side]) && parsedEstimates[side] >= 0;
  const nameIsValid = (side: Side) => (side === "unfinished" ? unfinished : continued).title.trim().length > 0;
  const hasFieldErrors = !nameIsValid("unfinished") || !nameIsValid("continued") || !estimateIsValid("unfinished") || !estimateIsValid("continued");
  const combinedPoints = (estimateIsValid("unfinished") ? parsedEstimates.unfinished : 0) + (estimateIsValid("continued") ? parsedEstimates.continued : 0);
  const pointDelta = combinedPoints - item.planEstimate;
  const collections = useMemo(() => ({ task: tasks, defect: relatedDefects, testCase: testCases }), [tasks, relatedDefects, testCases]);
  const selectedSets = { task: unfinishedTaskIds, defect: unfinishedDefectIds, testCase: unfinishedTestCaseIds };
  function move(kind: CollectionKind, id: string, to: Side) {
    const setters: Record<CollectionKind, Dispatch<SetStateAction<Set<string>>>> = { task: setUnfinishedTaskIds, defect: setUnfinishedDefectIds, testCase: setUnfinishedTestCaseIds };
    setters[kind](previous => { const next = new Set(previous); if (to === "unfinished") next.add(id); else next.delete(id); return next; });
  }
  function sideRows(kind: CollectionKind, side: Side) { return collections[kind].filter(row => selectedSets[kind].has(row.id) === (side === "unfinished")); }
  function changeRelease(side: Side, id: string) {
    const release = availableReleases.find(row => row.id === id);
    if (!release) return;
    const update = side === "unfinished" ? setUnfinished : setContinued;
    update(previous => ({ ...previous, release: release.name, releaseId: release.id }));
  }
  useEffect(() => { const previous = document.activeElement as HTMLElement | null; dialog.current?.focus(); return () => previous?.focus(); }, []);

  const renderSections = (side: Side) => <div className="space-y-3">
    <DropSection title="Tasks" kind="task" side={side} rows={sideRows("task", side)} onMove={move}
      header={<><span>ID</span><span>Name</span><span>State</span><span>To Do</span></>}
      renderRow={row => { const task = tasks.find(candidate => candidate.id === row.id)!; return <><span className="font-mono text-[#1f5dab]">{task.id}</span><span className="truncate pr-2">{task.name}</span><span>{task.state}</span><span className="font-mono">{task.todo}h</span></>; }} />
    <DropSection title="Defects" kind="defect" side={side} rows={sideRows("defect", side)} onMove={move}
      header={<><span>ID</span><span>Name</span><span>State</span><span>Priority</span></>}
      renderRow={row => { const defect = relatedDefects.find(candidate => candidate.id === row.id)!; return <><span className="font-mono text-[#b04438]">{defect.id}</span><span className="min-w-0 pr-2"><span className="block truncate">{defect.title}</span>{defect.iteration !== "Unscheduled" && <span className="block truncate text-[9px] text-amber-700">Explicit: {defect.iteration}</span>}</span><span>{defect.status}</span><span>{defect.priority}</span></>; }} />
    <DropSection title="Test Cases" kind="testCase" side={side} rows={sideRows("testCase", side)} onMove={move}
      header={<><span>ID</span><span>Name</span><span>Type</span><span>Verdict</span></>}
      renderRow={row => { const testCase = testCases.find(candidate => candidate.id === row.id)!; return <><span className="font-mono text-[#2b6c3f]">{testCase.id}</span><span className="truncate pr-2">{testCase.name}</span><span>{testCase.type}</span><span>{testCase.lastVerdict}</span></>; }} />
  </div>;

  function sideFields(side: Side) {
    const value = side === "unfinished" ? unfinished : continued;
    const update = side === "unfinished" ? setUnfinished : setContinued;
    return <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2"><Field label="Name"><input aria-label={`${side} name`} aria-invalid={!nameIsValid(side)} value={value.title} onChange={event => update(previous => ({ ...previous, title: event.target.value }))} className={`${inputClass} ${!nameIsValid(side) ? "border-red-500 ring-1 ring-red-200" : ""}`} /></Field></div>
      <Field label="Release">{side === "unfinished" ? <select aria-label="unfinished release" disabled className={`${inputClass} bg-[#f4f6f9]`}><option>Unscheduled</option></select> : <select aria-label={`${side} release`} value={value.releaseId || ""} onChange={event => changeRelease(side, event.target.value)} className={inputClass}>{availableReleases.map(release => <option key={release.id} value={release.id}>{release.name}</option>)}</select>}</Field>
      <Field label="Iteration">{side === "unfinished" ? <select aria-label="unfinished iteration" disabled className={`${inputClass} bg-[#f4f6f9]`}><option>{item.iteration}</option></select> : <select aria-label="continued iteration" value={targetId} onChange={event => setTargetId(event.target.value)} className={inputClass}>{targets.map(iteration => <option key={iteration.id} value={iteration.id}>{iteration.name}</option>)}</select>}</Field>
      <Field label="Schedule State">{side === "unfinished" ? <select aria-label="unfinished schedule state" disabled className={`${inputClass} bg-[#f4f6f9]`}><option>Accepted</option></select> : <select aria-label={`${side} schedule state`} value={value.status} onChange={event => update(previous => ({ ...previous, status: event.target.value as StatusType }))} className={inputClass}>{states.map(state => <option key={state}>{state}</option>)}</select>}</Field>
      <Field label="Plan Estimate"><input aria-label={`${side} plan estimate`} aria-invalid={!estimateIsValid(side)} type="number" min={0} value={estimateText[side]} onChange={event => { const next = event.target.value; setEstimateText(previous => ({ ...previous, [side]: next })); const parsed = Number(next); if (next.trim() !== "" && Number.isFinite(parsed) && parsed >= 0) update(previous => ({ ...previous, planEstimate: parsed })); }} className={`${inputClass} ${!estimateIsValid(side) ? "border-red-500 ring-1 ring-red-200" : ""}`} /></Field>
    </div>;
  }

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-3" onClick={onClose}>
    <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="split-title" className="flex max-h-[96vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-md bg-[#f3f6fa] text-[#273449] shadow-2xl outline-none" onClick={event => event.stopPropagation()} onKeyDown={event => { if (event.key === "Escape") onClose(); }}>
      <header className="flex items-center justify-between border-b border-[#d5dce7] bg-white px-5 py-3"><div className="flex items-center gap-3"><span className="rounded bg-[#eaf1fb] p-2 text-[#2558a6]"><GitBranch size={18} /></span><h2 id="split-title" className="text-[16px] font-semibold">Splitting {item.id}: {bareTitle(item.title)}</h2></div><button aria-label="Close split dialog" onClick={onClose} className="rounded p-1.5 hover:bg-slate-100"><X size={18} /></button></header>
      <div className="grid flex-1 grid-cols-1 divide-y divide-[#b9c4d2] overflow-y-auto xl:grid-cols-2 xl:divide-x xl:divide-y-0">
        <section className="min-w-0 space-y-4 p-5"><h3 className="text-[13px] font-semibold">[Unfinished] · New historical Story</h3>{sideFields("unfinished")}{renderSections("unfinished")}</section>
        <section className="min-w-0 space-y-4 p-5"><h3 className="text-[13px] font-semibold">[Continued] · Original Story</h3>{sideFields("continued")}{renderSections("continued")}</section>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d5dce7] bg-white px-5 py-3"><div className="text-[10px] text-[#5f6f84]"><span>{tasks.length} Tasks · {relatedDefects.length} Defects · {testCases.length} Test Cases</span><span className="mx-2">|</span><span>{hours(tasks, "actuals")}h Actual · {hours(tasks, "todo")}h To Do</span><span className="mx-2">|</span><span className={pointDelta === 0 ? "text-emerald-700" : "font-semibold text-amber-700"}>Points: {item.planEstimate} → {combinedPoints}{pointDelta === 0 ? "" : ` (${pointDelta > 0 ? "+" : ""}${pointDelta})`}</span></div><div className="flex items-center gap-2"><button onClick={onClose} className="rounded border border-slate-300 bg-white px-4 py-2 text-xs">Cancel</button><button disabled={!!reason || hasFieldErrors} onClick={() => onSplit({ targetIterationId: targetId, unfinished: { ...unfinished, planEstimate: parsedEstimates.unfinished }, continued: { ...continued, planEstimate: parsedEstimates.continued }, unfinishedTaskIds: [...unfinishedTaskIds], unfinishedDefectIds: [...unfinishedDefectIds], unfinishedTestCaseIds: [...unfinishedTestCaseIds] })} className="flex items-center gap-2 rounded bg-[#1d3f73] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">Split story <ArrowRight size={14} /></button></div></footer>
    </div>
  </div>;
}

export function SplitHistoryBanner({ record, items, onOpen }: { record: StorySplit; items: WorkItem[]; onOpen: (item: WorkItem) => void }) {
  return <div className="flex flex-wrap items-center gap-3 border-b border-blue-200 bg-blue-50 px-5 py-2 text-xs text-blue-900"><CheckCircle2 size={16} /><span><strong>Split</strong> · {record.sourceIteration} → {record.targetIteration}</span><div className="ml-auto flex gap-3">{[[record.unfinishedId, "Unfinished"], [record.continuedId, "Continued"]].map(([id, label]) => <button key={id} onClick={() => { const linked = items.find(row => row.id === id); if (linked) onOpen(linked); }} className="font-medium underline underline-offset-2">{id} · {label}</button>)}</div></div>;
}
