import { useState } from "react";
import {
  Search, ChevronDown, ChevronRight, LayoutList, LayoutGrid,
  Plus, Filter, Bell, HelpCircle, Settings, RefreshCw, Download,
  MoreHorizontal, X, Layers, Paperclip, Link2, Edit3,
  Home, Shield, Users, LogOut, MessageSquare,
  CheckCircle, Flag, Lock, Check, Archive, Eye, BarChart2,
  Bookmark, Save, RotateCcw, SlidersHorizontal, Activity,
  TrendingUp, TrendingDown, Package, Clock, Star, UserCheck,
  FileText, Hash, ChevronUp, Share2, ChevronLeft,
  GripVertical, Copy, Scissors, UserPlus, GitMerge,
  ExternalLink, AlignJustify, Minus, Zap,
  Tag, Calendar, RotateCw, ListChecks, Globe, Send, ArrowUpRight,
  CheckSquare, Square, Columns, ArrowUp, ArrowDown, ArrowUpDown,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { type Role, type Page, type WorkItemType, type StatusType, type PriorityType, type PortfolioState, type EstimateSize, type MilestoneItem, type TaskItem, type NewWorkItemInput, type Owner, type WorkItem, type Notification, type Feature, type NewFeatureInput, type Project, type ScopeProject, type Initiative, type ReleaseItem, type WorkspaceUser, type WorkflowStatusItem, type LabelItem, can, OWNERS, PROJECTS, SCOPE_PROJECTS, WORK_ITEMS, FEATURES, NOTIFICATIONS, VELOCITY_DATA, BURNDOWN_DATA, STATUS_PIE, INITIATIVES, RELEASES_DATA, WORKSPACE_USERS, WORKFLOW_STATUSES, LABELS_DATA, WORKLOAD_DATA, PLANNED_VS_COMPLETED, PERMISSIONS_MATRIX, DEFECT_ENVIRONMENTS, RELATED_STORIES } from "../model";
import { releaseStatusCfg, Avatar, TYPE_CFG, TypeBadge, STATUS_CFG, ScheduleStateBar, PRI_CFG, PriorityBadge, MiniProgress, RoleBadge, DetailPanel, NewItemModal, EmptyState, SectionCard } from "../components/shared";
import { SavedViewsDrop } from "../components/layout";
import { Field, RichTextEditor, TaskStateBadge, fieldClass, fieldStyle } from "./WorkItemDetailPage";
import { ResizableBacklogHeader, type BacklogColumnKey } from "./BacklogPage";

export type PortfolioColumnKey = "rank" | "type" | "id" | "name" | "release" | "state" | "progress" | "project" | "team" | "owner";
type PortfolioSort = { column: PortfolioColumnKey; direction: "asc" | "desc" };

function getPortfolioSortTooltip(column: PortfolioColumnKey, direction: "asc" | "desc") {
  if (column === "progress") return direction === "desc" ? "Highest to lowest" : "Lowest to highest";
  if (column === "id") return direction === "desc" ? "Newest to oldest" : "Oldest to newest";
  if (column === "rank") return direction === "asc" ? "Rank low to high" : "Rank high to low";
  return direction === "asc" ? "A to Z" : "Z to A";
}

function ResizablePortfolioHeader({ label, width, column, onResize, sort, onSort, align = "left" }: { label: string; width: number; column: PortfolioColumnKey; onResize: (column: PortfolioColumnKey, event: React.MouseEvent<HTMLDivElement>) => void; sort: PortfolioSort | null; onSort: (column: PortfolioColumnKey) => void; align?: "left" | "center" | "right" }) {
  const isSorted = sort?.column === column;
  const tooltip = isSorted ? getPortfolioSortTooltip(column, sort.direction) : "Sort";
  const SortIcon = isSorted ? (sort.direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <div className="relative shrink-0 h-full flex items-center text-[11px] font-semibold uppercase select-none" style={{ width, color: "#8c94a6", justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start" }}>
      <button
        type="button"
        title={tooltip}
        aria-label={`Sort ${label}: ${tooltip}`}
        onClick={() => onSort(column)}
        className="h-full min-w-0 flex items-center gap-1 text-[11px] rounded-sm focus:outline-none"
        style={{ color: isSorted ? "#2558a6" : "#8c94a6", justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start", width: "calc(100% - 8px)" }}
      >
        <span className="truncate text-[11px]">{label}</span>
        <SortIcon size={10} className="shrink-0" />
      </button>
      <div
        role="separator"
        aria-label={`Resize ${label} column`}
        aria-orientation="vertical"
        onMouseDown={event => onResize(column, event)}
        className="absolute right-0 top-0 h-full w-2 cursor-col-resize group z-10"
      >
        <div className="absolute right-[3px] top-1 bottom-1 w-px group-hover:bg-[#2558a6]" style={{ backgroundColor: "#d9dee7" }} />
      </div>
    </div>
  );
}

const PORTFOLIO_STATE_CFG: Record<PortfolioState, { bg: string; text: string; border: string; dot: string }> = {
  "No Entry": { bg: "#f1f5f9", text: "#64748b", border: "#cbd5e1", dot: "#94a3b8" },
  Intake: { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1", dot: "#94a3b8" },
  "Idea Prioritization": { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
  "Problem Discovery": { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
  "Solution Discovery": { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
  "Feature Prioritization": { bg: "#eef3fb", text: "#2558a6", border: "#bdd0ef", dot: "#2558a6" },
  Developing: { bg: "#fef5e4", text: "#8a5808", border: "#f5d899", dot: "#e59f0c" },
  Accepted: { bg: "#eaf0fb", text: "#1d3f73", border: "#99b8e0", dot: "#1d3f73" },
  Measuring: { bg: "#f5f3ff", text: "#6d28d9", border: "#d0c6f5", dot: "#7c3aed" },
  Done: { bg: "#eef6f0", text: "#1e6930", border: "#a8d5b3", dot: "#2a8c3f" },
  Cancelled: { bg: "#fef2f2", text: "#b91c1c", border: "#f3c6c6", dot: "#dc2626" },
};

function PortfolioStateBadge({ state }: { state: PortfolioState }) {
  const c = PORTFOLIO_STATE_CFG[state];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-px text-[11px] font-medium rounded-sm whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />
      {state}
    </span>
  );
}

const PORTFOLIO_STATES: PortfolioState[] = ["No Entry", "Intake", "Idea Prioritization", "Problem Discovery", "Solution Discovery", "Feature Prioritization", "Developing", "Accepted", "Measuring", "Done", "Cancelled"];
const ESTIMATE_SIZES: EstimateSize[] = ["No Entry", "XS", "S", "M", "L", "XL"];

function getPortfolioSortValue(feat: Feature, progressPct: number, column: PortfolioColumnKey): string | number {
  switch (column) {
    case "rank": return feat.rank ?? 999;
    case "type": return "Feature";
    case "id": return Number(feat.id.replace(/\D/g, "")) || 0;
    case "name": return feat.name.toLowerCase();
    case "release": return feat.release.toLowerCase();
    case "state": return PORTFOLIO_STATES.indexOf(feat.status);
    case "progress": return progressPct;
    case "project": return (feat.project || "").toLowerCase();
    case "team": return (feat.team || "").toLowerCase();
    case "owner": return feat.owner.name.toLowerCase();
  }
}
function comparePortfolioSortValues(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

function EstimateBadge({ size }: { size: EstimateSize }) {
  if (size === "No Entry") return <span className="text-[11px]" style={{ color: "#8c94a6" }}>No Entry</span>;
  return <span className="inline-flex items-center px-1.5 py-px text-[10px] font-semibold rounded-sm" style={{ backgroundColor: "#f0f2f5", color: "#3a4254", border: "1px solid #dde2ea" }}>{size}</span>;
}

type ChildSort = { column: BacklogColumnKey; direction: "asc" | "desc" };
const CHILD_DEFECT_PRIORITY_LABELS: Record<string, string> = { Critical: "Urgent", High: "High", Medium: "Normal", Low: "Low" };
const CHILD_DEFECT_PRIORITY_TO_LEGACY: Record<string, string> = { Urgent: "Critical", High: "High", Normal: "Medium", Low: "Low", None: "None" };
const CHILD_STATUS_OPTIONS: StatusType[] = ["Idea", "Defined", "In-Progress", "Completed", "Accepted", "Release"];
const CHILD_PRIORITY_OPTIONS = ["Low", "Normal", "High", "Urgent", "None"];
const CHILD_PRIORITY_ORDER: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
const CHILD_STATUS_ORDER: Record<StatusType, number> = { Idea: 1, Defined: 2, "In-Progress": 3, Completed: 4, Accepted: 5, Release: 6 };
const CHILD_FILTER_COLUMNS: Array<{ key: BacklogColumnKey; label: string; mode: "search" | "select" }> = [
  { key: "id", label: "ID", mode: "search" },
  { key: "name", label: "Name", mode: "search" },
  { key: "type", label: "Type", mode: "select" },
  { key: "priority", label: "Priority", mode: "select" },
  { key: "estimate", label: "Est", mode: "search" },
  { key: "owner", label: "Owner", mode: "select" },
  { key: "status", label: "Schedule State", mode: "select" },
  { key: "release", label: "Release", mode: "select" },
];
function getChildSortValue(item: WorkItem, column: BacklogColumnKey): string | number {
  switch (column) {
    case "type": return item.type;
    case "id": return Number(item.id.replace(/\D/g, "")) || 0;
    case "name": return item.title.toLowerCase();
    case "priority": return item.type === "Defect" ? CHILD_PRIORITY_ORDER[item.priority] ?? 0 : -1;
    case "estimate": return item.planEstimate;
    case "owner": return item.owner.name.toLowerCase();
    case "status": return CHILD_STATUS_ORDER[item.status] ?? 0;
    case "release": return item.release.toLowerCase();
    default: return 0;
  }
}
function compareChildSortValues(a: string | number, b: string | number) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

function NewFeatureModal({ onClose, onCreate, onCreateWithDetails }: { onClose: () => void; onCreate: (input: NewFeatureInput) => Feature; onCreateWithDetails: (input: NewFeatureInput) => void }) {
  const [name, setName] = useState("");
  const initialProject = SCOPE_PROJECTS[0];
  const [projectKey, setProjectKey] = useState(initialProject.key);
  const [team, setTeam] = useState(initialProject.teams[0]);
  const [ownerName, setOwnerName] = useState(OWNERS[0].name);
  const [release, setRelease] = useState("Unscheduled");
  const [state, setState] = useState<PortfolioState>("No Entry");
  const [preliminaryEstimate, setPreliminaryEstimate] = useState<EstimateSize>("No Entry");
  const selectedProject = SCOPE_PROJECTS.find(project => project.key === projectKey) || SCOPE_PROJECTS[0];
  const canCreate = name.trim().length > 0;
  function selectProject(nextProjectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(project => project.key === nextProjectKey) || SCOPE_PROJECTS[0];
    setProjectKey(nextProject.key);
    setTeam(nextProject.teams[0]);
  }
  function buildInput(): NewFeatureInput {
    const owner = OWNERS.find(candidate => candidate.name === ownerName) || OWNERS[0];
    return { name: name.trim(), project: projectKey, team, owner, release, state, preliminaryEstimate };
  }
  function submit() {
    if (!canCreate) return;
    onCreate(buildInput());
    onClose();
  }
  function submitWithDetails() {
    if (!canCreate) return;
    onCreateWithDetails(buildInput());
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} onClick={onClose} />
      <div className="relative bg-white rounded shadow-2xl flex flex-col overflow-hidden" style={{ width: 480, maxHeight: "85vh", border: "1px solid #d4d8de" }}>
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
          <div><p className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>New Feature</p><p className="text-[11px]" style={{ color: "#8c94a6" }}>Portfolio Items</p></div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#edf0f4"; e.currentTarget.style.color = "#1a2234"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8c94a6"; }}><X size={15} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Project</label><select aria-label="New Feature project" value={projectKey} onChange={event => selectProject(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{SCOPE_PROJECTS.map(project => <option key={project.key} value={project.key}>{project.key} · {project.name}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Team</label><select aria-label="New Feature team" value={team} onChange={event => setTeam(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{selectedProject.teams.map(projectTeam => <option key={projectTeam}>{projectTeam}</option>)}</select></div>
          </div>
          <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Name <span style={{ color: "#dc2626" }}>*</span></label>
            <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter a concise, descriptive name..." className="w-full text-[13px] px-3 py-2 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} onFocus={e => (e.currentTarget.style.borderColor = "rgba(29,63,115,0.4)")} onBlur={e => (e.currentTarget.style.borderColor = "#dde2ea")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>State</label><select aria-label="New Feature state" value={state} onChange={event => setState(event.target.value as PortfolioState)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{PORTFOLIO_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Preliminary Estimate</label><select aria-label="New Feature preliminary estimate" value={preliminaryEstimate} onChange={event => setPreliminaryEstimate(event.target.value as EstimateSize)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{ESTIMATE_SIZES.map(s => <option key={s}>{s}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Owner</label><select aria-label="New Feature owner" value={ownerName} onChange={event => setOwnerName(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select></div>
            <div><label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }}>Target Release</label><select aria-label="New Feature target release" value={release} onChange={event => setRelease(event.target.value)} className="w-full text-[12px] px-2.5 py-1.5 rounded focus:outline-none bg-white" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}><option>Unscheduled</option>{RELEASES_DATA.map(r => <option key={r.id}>{r.name}</option>)}</select></div>
          </div>
          <p className="text-[11px]" style={{ color: "#8c94a6" }}>Plan Estimate and Progress are not set here — they roll up automatically once Story/Defect items are linked.</p>
        </div>
        <div className="flex items-center justify-end px-5 py-3 shrink-0" style={{ borderTop: "1px solid #e2e6eb", backgroundColor: "#f7f8fa" }}>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 text-[12px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#edf0f4")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>Cancel</button>
            <button disabled={!canCreate} onClick={submitWithDetails} className="px-4 py-1.5 text-[12px] font-semibold rounded disabled:opacity-45" style={{ border: "1px solid #9fb5d5", color: "#1d3f73", backgroundColor: "#f5f8fc" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e8eff8")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f5f8fc")}>Create with details</button>
            <button disabled={!canCreate} onClick={submit} className="px-4 py-1.5 text-[12px] font-semibold text-white rounded disabled:opacity-45" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}>Create Feature</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureDetailView({ feature, childItems, totalEstimate, doneEstimate, role, milestones, tasks, onBack, onUpdateFeature, onUpdateItem, onCreateItem, onOpenFull }: {
  feature: Feature; childItems: WorkItem[]; totalEstimate: number; doneEstimate: number;
  role: Role; milestones: MilestoneItem[]; tasks: TaskItem[]; onBack: () => void;
  onUpdateFeature: (patch: Partial<Feature>) => void;
  onUpdateItem: (id: string, patch: Partial<WorkItem>) => void;
  onCreateItem: (input: NewWorkItemInput, openDetails: boolean) => void;
  onOpenFull: (item: WorkItem) => void;
}) {
  const editable = can.manageFeatures(role);
  const [activeTab, setActiveTab] = useState<"details" | "children">("details");
  const [expandedChildIds, setExpandedChildIds] = useState<Set<string>>(new Set());
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const selectedMilestoneIds = feature.milestoneIds || [];
  const milestoneOptions = milestones.filter(m => selectedMilestoneIds.includes(m.id) || m.projectKeys.includes(feature.project || ""));

  const [childSearch, setChildSearch] = useState("");
  const [childShowFilters, setChildShowFilters] = useState(false);
  const [childFilters, setChildFilters] = useState<Partial<Record<BacklogColumnKey, string>>>({});
  const [childShowManageFilters, setChildShowManageFilters] = useState(false);
  const [childFilterColumnSearch, setChildFilterColumnSearch] = useState("");
  const [childPendingFilterColumns, setChildPendingFilterColumns] = useState<Set<BacklogColumnKey>>(new Set());
  const [childSort, setChildSort] = useState<ChildSort | null>(null);
  const [childColumnWidths, setChildColumnWidths] = useState<Record<BacklogColumnKey, number>>({ rank: 0, type: 72, id: 82, name: 320, priority: 96, estimate: 56, owner: 124, status: 128, iteration: 96, release: 130 });
  const [childPageSize, setChildPageSize] = useState(25);
  const [childCurrentPage, setChildCurrentPage] = useState(1);

  const childActiveFilterColumns = CHILD_FILTER_COLUMNS.filter(column => childFilters[column.key] !== undefined);
  const childActiveFilterCount = childActiveFilterColumns.length;
  const childAvailableFilterColumns = CHILD_FILTER_COLUMNS.filter(column => column.label.toLowerCase().includes(childFilterColumnSearch.toLowerCase()));
  const childReleaseOptions = Array.from(new Set(["Unscheduled", ...RELEASES_DATA.map(r => r.name), ...childItems.map(item => item.release)])).sort();
  const filteredChildren = childItems.filter(item =>
    (item.title.toLowerCase().includes(childSearch.toLowerCase()) || item.id.toLowerCase().includes(childSearch.toLowerCase())) &&
    childActiveFilterColumns.every(filter => {
      const value = (childFilters[filter.key] || "").trim();
      if (!value || value === "All") return true;
      const searchValue = value.toLowerCase();
      switch (filter.key) {
        case "id": return item.id.toLowerCase().includes(searchValue);
        case "name": return item.title.toLowerCase().includes(searchValue);
        case "estimate": return String(item.planEstimate).includes(searchValue);
        case "type": return item.type === value;
        case "priority": return item.type === "Defect" && (CHILD_DEFECT_PRIORITY_LABELS[item.priority] ?? "None") === value;
        case "owner": return item.owner.name === value;
        case "status": return item.status === value;
        case "release": return item.release === value;
        default: return true;
      }
    })
  ).sort((a, b) => {
    if (!childSort) return 0;
    const result = compareChildSortValues(getChildSortValue(a, childSort.column), getChildSortValue(b, childSort.column));
    return childSort.direction === "asc" ? result : -result;
  });
  const childTotalPages = Math.max(1, Math.ceil(filteredChildren.length / childPageSize));
  const childActivePage = Math.min(childCurrentPage, childTotalPages);
  const childPageStart = (childActivePage - 1) * childPageSize;
  const paginatedChildren = filteredChildren.slice(childPageStart, childPageStart + childPageSize);

  function getChildFilterSelectOptions(column: BacklogColumnKey) {
    switch (column) {
      case "type": return ["All", "Story", "Defect"];
      case "priority": return ["All", ...CHILD_PRIORITY_OPTIONS];
      case "owner": return ["All", ...OWNERS.map(o => o.name)];
      case "status": return ["All", ...CHILD_STATUS_OPTIONS];
      case "release": return ["All", ...childReleaseOptions];
      default: return [];
    }
  }
  function openChildManageFilters() {
    setChildShowFilters(true);
    setChildPendingFilterColumns(new Set(childActiveFilterColumns.map(column => column.key)));
    setChildShowManageFilters(true);
  }
  function toggleChildPendingFilterColumn(column: BacklogColumnKey) {
    setChildPendingFilterColumns(previous => { const next = new Set(previous); next.has(column) ? next.delete(column) : next.add(column); return next; });
  }
  function applyChildManagedFilters() {
    setChildFilters(previous => {
      const next: Partial<Record<BacklogColumnKey, string>> = {};
      childPendingFilterColumns.forEach(column => { next[column] = previous[column] ?? ""; });
      return next;
    });
    setChildShowManageFilters(false);
    setChildCurrentPage(1);
  }
  function updateChildFilterValue(column: BacklogColumnKey, value: string) {
    setChildFilters(previous => ({ ...previous, [column]: value }));
    setChildCurrentPage(1);
  }
  function removeChildFilter(column: BacklogColumnKey) {
    setChildFilters(previous => { const next = { ...previous }; delete next[column]; return next; });
    setChildCurrentPage(1);
  }
  function toggleChildSort(column: BacklogColumnKey) {
    setChildSort(previous => {
      if (previous?.column === column) return { column, direction: previous.direction === "asc" ? "desc" : "asc" };
      const defaultDirection = column === "estimate" || column === "id" || column === "priority" ? "desc" : "asc";
      return { column, direction: defaultDirection };
    });
    setChildCurrentPage(1);
  }
  function startChildColumnResize(column: BacklogColumnKey, event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = childColumnWidths[column];
    const minimums: Partial<Record<BacklogColumnKey, number>> = { type: 60, id: 64, name: 180, priority: 80, estimate: 48, owner: 96, status: 96, release: 72 };
    function handleMouseMove(moveEvent: MouseEvent) {
      const nextWidth = Math.max(minimums[column] ?? 48, startWidth + moveEvent.clientX - startX);
      setChildColumnWidths(previous => ({ ...previous, [column]: nextWidth }));
    }
    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
  function updateChildItemPriority(id: string, priorityLabel: string) {
    const priority = CHILD_DEFECT_PRIORITY_TO_LEGACY[priorityLabel] as PriorityType | "None";
    if (priority !== "None") onUpdateItem(id, { priority });
  }
  const childTableWidth = 22 + Object.values(childColumnWidths).reduce((total, width) => total + width, 0);

  function toggleMilestone(milestoneId: string) {
    const next = selectedMilestoneIds.includes(milestoneId) ? selectedMilestoneIds.filter(id => id !== milestoneId) : [...selectedMilestoneIds, milestoneId];
    onUpdateFeature({ milestoneIds: next });
  }
  function changeProject(projectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(candidate => candidate.key === projectKey) || SCOPE_PROJECTS[0];
    onUpdateFeature({ project: nextProject.key, team: nextProject.teams[0] });
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="shrink-0 text-white" style={{ backgroundColor: "#173f78" }}>
        <div className="h-12 px-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,.18)" }}>
          <button aria-label="Back to Portfolio Items" onClick={onBack} className="p-1.5 rounded hover:bg-white/10"><ChevronLeft size={18} /></button>
          <TypeBadge type="Feature" />
          <span className="font-mono text-[13px] font-semibold text-white">{feature.id}</span>
          <span className="h-5 w-px bg-white/25" />
          <h1 className="text-[15px] font-semibold truncate">{feature.name}</h1>
          <div className="flex-1" />
          <button aria-label="More Feature actions" className="p-1.5 rounded hover:bg-white/10"><MoreHorizontal size={17} /></button>
        </div>
        <div className="h-16 px-5 flex items-stretch gap-2">
          <button onClick={() => setActiveTab("details")} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "details" ? "#2f6fc5" : "transparent", color: activeTab === "details" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center"><FileText size={18} /></span><span>Details</span></button>
          <button onClick={() => setActiveTab("children")} className="w-28 flex flex-col items-center justify-center gap-1 text-[11px] font-medium" style={{ backgroundColor: activeTab === "children" ? "#2f6fc5" : "transparent", color: activeTab === "children" ? "white" : "#d7e4f7" }}><span className="h-5 flex items-center justify-center gap-1.5"><ListChecks size={19} /><span className="text-[10px] font-semibold tabular-nums">{childItems.length}</span></span><span>Children</span></button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 gap-2" style={{ backgroundColor: "#e7ebf0" }}>
        <main className="flex-1 overflow-y-scroll p-6" style={{ backgroundColor: "#f3f5f8", scrollbarGutter: "stable" }}>
          {activeTab === "details" ? (
            <div className="w-full space-y-5">
              <h2 className="text-[20px] font-semibold" style={{ color: "#273449" }}>Details</h2>
              <RichTextEditor title="Description" minHeight={220} readOnly={!editable} />
              <section className="bg-white rounded overflow-hidden" style={{ border: "1px solid #dde2ea" }}>
                <div className="px-4 py-2 text-[11px] font-semibold" style={{ color: "#475569", backgroundColor: "#f8fafc", borderBottom: "1px solid #dde2ea" }}>Attachments</div>
                {editable && <button className="m-3 flex items-center gap-1.5 px-3 py-2 text-[12px] rounded text-left" style={{ width: "calc(100% - 24px)", color: "#2563c5", border: "1px solid #b9c9df", backgroundColor: "#fbfdff" }}><Plus size={15} />Drag or click to add attachments</button>}
              </section>
              <RichTextEditor title="Notes" minHeight={180} readOnly={!editable} />
              <RichTextEditor title="What Success Looks Like" minHeight={180} readOnly={!editable} />
            </div>
          ) : (
            <div className="w-full flex flex-col" style={{ height: "calc(100% - 0px)" }}>
              <div className="flex items-end gap-2 mb-3 flex-wrap">
                <div className="flex flex-col items-start gap-1.5 mr-2 min-w-[150px]">
                  <div>
                    <h2 className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Children</h2>
                    <p className="text-[10px]" style={{ color: "#8c94a6" }}>All Story/Defect linked to this Feature. Click the arrow to see its Tasks.</p>
                  </div>
                  {editable && <button onClick={() => setShowAddItemModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}><Plus size={12} />Add Item</button>}
                </div>
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
                  <input type="text" placeholder="Search children..." value={childSearch} onChange={e => { setChildSearch(e.target.value); setChildCurrentPage(1); }} className="pl-7 pr-3 py-1 text-[11px] rounded focus:outline-none" style={{ backgroundColor: "#f4f6f9", border: "1px solid #dde2ea", color: "#1a2234", width: 160 }} />
                </div>
                <button onClick={() => setChildShowFilters(previous => !previous)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded" style={{ border: "1px solid #bdd0ef", color: "#2558a6", backgroundColor: childShowFilters ? "#edf2fb" : "#fff" }}>
                  <Filter size={12} /> {childShowFilters ? "Hide filter" : "Show filter"}{childActiveFilterCount > 0 ? ` (${childActiveFilterCount})` : ""}
                </button>
              </div>

              {childShowFilters && (
                <div className="px-3 py-3 mb-3 rounded" style={{ backgroundColor: "#f5f8fc", border: "1px solid #cfdced" }}>
                  <div className="relative flex items-start gap-2">
                    <div className="relative shrink-0">
                      <button onClick={openChildManageFilters} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded" style={{ color: "#fff", backgroundColor: "#4b74d9", border: "1px solid #3d66c8" }}><Filter size={12} /> Manage filters</button>
                      {childShowManageFilters && (
                        <div className="absolute left-0 top-[34px] z-30 w-[300px] rounded bg-white shadow-xl" style={{ border: "1px solid #cfd6e3" }}>
                          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #edf0f4" }}>
                            <p className="text-[14px] font-semibold" style={{ color: "#3a4254" }}>Manage Filters</p>
                            <button aria-label="Close manage filters" onClick={() => setChildShowManageFilters(false)} className="p-1 rounded" style={{ color: "#2558a6" }}><X size={16} /></button>
                          </div>
                          <div className="px-4 pt-3">
                            <div className="relative">
                              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#5c6478" }} />
                              <input value={childFilterColumnSearch} onChange={e => setChildFilterColumnSearch(e.target.value)} placeholder="Search" className="w-full pl-8 pr-3 py-2 text-[12px] rounded focus:outline-none" style={{ border: "1px solid #6aa0ff", color: "#1a2234" }} />
                            </div>
                          </div>
                          <div className="px-4 py-3 max-h-[220px] overflow-y-auto">
                            <p className="text-[11px] font-semibold uppercase mb-2" style={{ color: "#1a2234" }}>Selected</p>
                            {CHILD_FILTER_COLUMNS.filter(column => childPendingFilterColumns.has(column.key)).length === 0 ? (
                              <p className="text-[11px] mb-3" style={{ color: "#8c94a6" }}>No columns selected</p>
                            ) : CHILD_FILTER_COLUMNS.filter(column => childPendingFilterColumns.has(column.key)).map(column => (
                              <label key={column.key} className="flex items-center gap-2 py-1.5 text-[12px]" style={{ color: "#1a2234" }}>
                                <input type="checkbox" checked onChange={() => toggleChildPendingFilterColumn(column.key)} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#4b74d9" }} />
                                {column.label}
                              </label>
                            ))}
                            <p className="text-[11px] font-semibold uppercase mt-2 mb-2" style={{ color: "#1a2234" }}>Available</p>
                            {childAvailableFilterColumns.filter(column => !childPendingFilterColumns.has(column.key)).map(column => (
                              <label key={column.key} className="flex items-center gap-2 py-1.5 text-[12px]" style={{ color: "#3a4254" }}>
                                <input type="checkbox" checked={false} onChange={() => toggleChildPendingFilterColumn(column.key)} className="w-3.5 h-3.5 rounded" style={{ accentColor: "#4b74d9" }} />
                                {column.label}
                              </label>
                            ))}
                          </div>
                          <div className="flex items-center justify-end gap-2 px-4 py-3" style={{ borderTop: "1px solid #edf0f4" }}>
                            <button onClick={() => setChildShowManageFilters(false)} className="px-3 py-1.5 text-[12px] rounded" style={{ color: "#2558a6" }}>Cancel</button>
                            <button onClick={applyChildManagedFilters} className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#4b74d9" }}>Apply</button>
                          </div>
                        </div>
                      )}
                    </div>
                    {childActiveFilterCount > 0 && <button onClick={() => setChildFilters({})} className="px-2.5 py-1 text-[11px] rounded" style={{ color: "#2558a6" }}>Clear filters</button>}
                  </div>
                  {childActiveFilterCount === 0 ? (
                    <div className="mt-2 px-3 py-2 text-[11px] rounded bg-white" style={{ color: "#8c94a6", border: "1px dashed #cfd6e3" }}>No filters selected. Use Manage filters to choose columns.</div>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {childActiveFilterColumns.map(columnMeta => {
                        const filterValue = childFilters[columnMeta.key] ?? "";
                        return (
                          <div key={columnMeta.key} className="flex items-center gap-1.5 px-2 py-1.5 bg-white rounded" style={{ border: "1px solid #dde2ea" }}>
                            <span className="text-[11px] font-semibold" style={{ color: "#3a4254" }}>{columnMeta.label}</span>
                            {columnMeta.mode === "search" ? (
                              <div className="relative">
                                <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8c94a6" }} />
                                <input aria-label={`${columnMeta.label} filter value`} type={columnMeta.key === "estimate" ? "number" : "text"} value={filterValue} onChange={e => updateChildFilterValue(columnMeta.key, e.target.value)} placeholder={`Filter ${columnMeta.label}`} className="pl-6 pr-2 py-1 text-[11px] rounded focus:outline-none" style={{ width: columnMeta.key === "name" ? 200 : 120, border: "1px solid #dde2ea", color: "#1a2234" }} />
                              </div>
                            ) : (
                              <select aria-label={`${columnMeta.label} filter value`} value={filterValue || "All"} onChange={e => updateChildFilterValue(columnMeta.key, e.target.value)} className="text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ minWidth: 120, border: "1px solid #dde2ea", color: "#1a2234" }}>
                                {getChildFilterSelectOptions(columnMeta.key).map(option => <option key={option}>{option}</option>)}
                              </select>
                            )}
                            <button aria-label={`Remove ${columnMeta.label} filter`} onClick={() => removeChildFilter(columnMeta.key)} className="p-1 rounded" style={{ color: "#8c94a6" }}><X size={12} /></button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 bg-white rounded overflow-hidden flex flex-col" style={{ border: "1px solid #dde2ea" }}>
                <div className="flex-1 overflow-auto">
                  <div style={{ width: childTableWidth, minWidth: "100%" }}>
                    <div className="sticky top-0 z-10 flex items-center h-8 px-3 gap-1.5 select-none" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
                      <div className="w-4 shrink-0" />
                      <ResizableBacklogHeader label="Type" column="type" width={childColumnWidths.type} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <ResizableBacklogHeader label="ID" column="id" width={childColumnWidths.id} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <ResizableBacklogHeader label="Name" column="name" width={childColumnWidths.name} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <ResizableBacklogHeader label="Priority" column="priority" width={childColumnWidths.priority} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <ResizableBacklogHeader label="Est" column="estimate" width={childColumnWidths.estimate} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} align="center" />
                      <ResizableBacklogHeader label="Owner" column="owner" width={childColumnWidths.owner} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <ResizableBacklogHeader label="Schedule State" column="status" width={childColumnWidths.status} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                      <div className="shrink-0 text-[11px] font-semibold uppercase" style={{ width: childColumnWidths.iteration, color: "#8c94a6" }}>Iteration</div>
                      <ResizableBacklogHeader label="Release" column="release" width={childColumnWidths.release} onResize={startChildColumnResize} sort={childSort} onSort={toggleChildSort} />
                    </div>

                    <div aria-label="Children totals" className="flex items-center h-8 px-3 gap-1.5 text-[11px] font-semibold" style={{ backgroundColor: "#eef3fb", borderBottom: "1px solid #cfdced", color: "#1d3f73" }}>
                      <div className="w-4 shrink-0" />
                      <div className="shrink-0" style={{ width: childColumnWidths.type }} />
                      <div className="shrink-0 px-1" style={{ width: childColumnWidths.id }}>Totals</div>
                      <div className="shrink-0" style={{ width: childColumnWidths.name }} />
                      <div className="shrink-0" style={{ width: childColumnWidths.priority }} />
                      <div className="shrink-0 text-right font-mono tabular-nums" style={{ width: childColumnWidths.estimate }}>{totalEstimate}</div>
                      <div className="shrink-0" style={{ width: childColumnWidths.owner }} />
                      <div className="shrink-0" style={{ width: childColumnWidths.status }} />
                      <div className="shrink-0" style={{ width: childColumnWidths.iteration }} />
                      <div className="shrink-0" style={{ width: childColumnWidths.release }} />
                    </div>

                    {filteredChildren.length === 0 ? <EmptyState message="No Story/Defect linked yet" /> : paginatedChildren.map(item => {
                      const itemExp = expandedChildIds.has(item.id);
                      const itemTasks = tasks.filter(task => task.parentWorkItemId === item.id);
                      return (
                        <div key={item.id}>
                          <div className="flex items-center h-9 px-3 gap-1.5 text-[12px] cursor-pointer hover:bg-[#f7f8fa]" style={{ width: childTableWidth, minWidth: "100%", borderBottom: "1px solid #edf0f4", color: "#334155" }} onClick={() => onOpenFull(item)}>
                            <button aria-label={`${itemExp ? "Collapse" : "Expand"} ${item.id} tasks`} onClick={event => { event.stopPropagation(); setExpandedChildIds(previous => { const next = new Set(previous); next.has(item.id) ? next.delete(item.id) : next.add(item.id); return next; }); }} className="w-4 shrink-0 flex items-center justify-center" style={{ color: "#8c94a6" }}>
                              {itemTasks.length > 0 ? (itemExp ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : null}
                            </button>
                            <div className="shrink-0 overflow-hidden" style={{ width: childColumnWidths.type }}><TypeBadge type={item.type} /></div>
                            <div className="shrink-0 overflow-hidden font-mono text-[11px]" style={{ width: childColumnWidths.id, color: "#2558a6" }}>{item.id}</div>
                            <div className="shrink-0 min-w-0 pr-2" style={{ width: childColumnWidths.name }} onClick={event => event.stopPropagation()}>
                              <input aria-label={`${item.id} name`} readOnly={!editable} value={item.title} onChange={e => onUpdateItem(item.id, { title: e.target.value })} className="block w-full truncate text-[12px] bg-transparent px-1 py-1 focus:outline-none focus:bg-white focus:rounded" style={{ color: "#1a2234", border: editable ? "1px solid transparent" : "0" }} />
                            </div>
                            <div className="shrink-0 overflow-hidden" style={{ width: childColumnWidths.priority }} onClick={event => event.stopPropagation()}>
                              {item.type === "Defect" && editable ? (
                                <select aria-label={`${item.id} priority`} value={CHILD_DEFECT_PRIORITY_LABELS[item.priority] ?? "None"} onChange={e => updateChildItemPriority(item.id, e.target.value)} className="w-[88px] text-[11px] font-semibold rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #f5d899", color: "#9a3412" }}>{CHILD_PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}</select>
                              ) : item.type === "Defect" ? <span className="inline-flex items-center gap-1 px-1.5 py-px text-[11px] font-semibold rounded-sm" style={{ backgroundColor: "#fff7ed", color: "#9a3412" }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#f97316" }} />{CHILD_DEFECT_PRIORITY_LABELS[item.priority] ?? "None"}</span> : <span className="text-[11px] font-mono" style={{ color: "#a0a7b5" }}>—</span>}
                            </div>
                            <div className="shrink-0 text-center" style={{ width: childColumnWidths.estimate }} onClick={event => event.stopPropagation()}>
                              <input aria-label={`${item.id} plan estimate`} readOnly={!editable} type="number" min={0} value={item.planEstimate} onChange={e => onUpdateItem(item.id, { planEstimate: Number(e.target.value) })} className="w-11 text-center font-mono text-[11px] font-semibold bg-transparent focus:outline-none focus:bg-white focus:rounded" style={{ color: "#5c6478", border: editable ? "1px solid transparent" : "0" }} />
                            </div>
                            <div className="shrink-0 flex items-center gap-1 overflow-hidden" style={{ width: childColumnWidths.owner }} onClick={event => event.stopPropagation()}>
                              <Avatar owner={item.owner} size="xs" />
                              {editable ? <select aria-label={`${item.id} owner`} value={item.owner.name} onChange={e => { const o = OWNERS.find(c => c.name === e.target.value); if (o) onUpdateItem(item.id, { owner: o }); }} className="min-w-0 flex-1 text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select> : <span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{item.owner.initials}</span>}
                            </div>
                            <div className="shrink-0 overflow-hidden" style={{ width: childColumnWidths.status }} onClick={event => event.stopPropagation()}>
                              <ScheduleStateBar aria-label={`${item.id} schedule state`} value={item.status} onChange={editable ? next => onUpdateItem(item.id, { status: next }) : undefined} />
                            </div>
                            <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: childColumnWidths.iteration, color: "#5c6478" }}>{item.iteration}</div>
                            <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: childColumnWidths.release }} onClick={event => event.stopPropagation()}>
                              {editable ? <select aria-label={`${item.id} release`} value={item.release} onChange={e => onUpdateItem(item.id, { release: e.target.value, releaseId: RELEASES_DATA.find(r => r.name === e.target.value)?.id })} className="w-[110px] text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{childReleaseOptions.map(r => <option key={r}>{r}</option>)}</select> : <span style={{ color: "#5c6478" }}>{item.release}</span>}
                            </div>
                          </div>
                          {itemExp && itemTasks.map(task => (
                            <div key={task.id} className="flex items-center h-9 px-3 gap-1.5 text-[11px]" style={{ width: childTableWidth, minWidth: "100%", paddingLeft: 44, backgroundColor: "#fcfdfe", borderBottom: "1px solid #f0f2f5", color: "#334155" }}>
                              <span className="shrink-0 truncate font-mono" style={{ width: childColumnWidths.type + childColumnWidths.id - 24, color: "#8c94a6" }}>{task.id}</span>
                              <span className="shrink-0 min-w-0 truncate" style={{ width: childColumnWidths.name }}>{task.name}</span>
                              <span className="shrink-0" style={{ width: childColumnWidths.priority }}><TaskStateBadge state={task.state} /></span>
                              <span className="shrink-0 text-right font-mono" style={{ width: childColumnWidths.estimate }}>{task.estimate}</span>
                              <span className="shrink-0 flex items-center gap-1.5 min-w-0" style={{ width: childColumnWidths.owner }}><Avatar owner={task.owner} size="xs" /><span className="truncate">{task.owner.name}</span></span>
                              <span className="shrink-0 text-[10px]" style={{ width: childColumnWidths.status + childColumnWidths.iteration + childColumnWidths.release, color: "#8c94a6" }}>To Do {task.todo}h · Actual {task.actuals}h</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="h-10 shrink-0 flex items-center justify-between px-3 bg-white" style={{ borderTop: "1px solid #e2e6eb" }}>
                  <div className="flex items-center gap-2 text-[11px]" style={{ color: "#5c6478" }}>
                    <span>Rows per page</span>
                    <select aria-label="Children rows per page" value={childPageSize} onChange={e => { setChildPageSize(Number(e.target.value)); setChildCurrentPage(1); }} className="px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>
                      {[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                    <span style={{ color: "#8c94a6" }}>{filteredChildren.length === 0 ? "0 records" : `${childPageStart + 1}-${Math.min(childPageStart + childPageSize, filteredChildren.length)} of ${filteredChildren.length}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] tabular-nums" style={{ color: "#5c6478" }}>Page {childActivePage} of {childTotalPages}</span>
                    <button aria-label="Previous page" disabled={childActivePage === 1} onClick={() => setChildCurrentPage(childActivePage - 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronLeft size={13} /></button>
                    <button aria-label="Next page" disabled={childActivePage === childTotalPages} onClick={() => setChildCurrentPage(childActivePage + 1)} className="p-1.5 rounded disabled:opacity-35" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><ChevronRight size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {activeTab === "details" && (
        <aside className="w-[340px] shrink-0 overflow-y-scroll p-5 space-y-4 bg-white" style={{ borderLeft: "1px solid #d7dde7", scrollbarGutter: "stable" }}>
          <Field label="Owner"><select disabled={!editable} aria-label="Feature owner" className={fieldClass} style={fieldStyle} value={feature.owner.name} onChange={e => { const o = OWNERS.find(c => c.name === e.target.value); if (o) onUpdateFeature({ owner: o }); }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select></Field>
          <Field label="Project"><select disabled={!editable} aria-label="Feature project" className={fieldClass} style={fieldStyle} value={feature.project || SCOPE_PROJECTS[0].key} onChange={e => changeProject(e.target.value)}>{SCOPE_PROJECTS.map(p => <option key={p.key} value={p.key}>{p.key} · {p.name}</option>)}</select></Field>
          <Field label="Progress"><MiniProgress value={doneEstimate} max={totalEstimate} /></Field>
          <Field label="State"><select disabled={!editable} aria-label="Feature state" className={fieldClass} style={fieldStyle} value={feature.status} onChange={e => onUpdateFeature({ status: e.target.value as PortfolioState })}>{PORTFOLIO_STATES.map(s => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Release"><select disabled={!editable} aria-label="Feature release" className={fieldClass} style={fieldStyle} value={feature.release} onChange={e => onUpdateFeature({ release: e.target.value })}><option>Unscheduled</option>{RELEASES_DATA.map(r => <option key={r.id}>{r.name}</option>)}</select></Field>
          <Field label="Milestone">
            <details className="rounded bg-white" style={fieldStyle}>
              <summary className="cursor-pointer list-none px-3 py-2 text-[12px]" style={{ color: "#1a2234" }}>{selectedMilestoneIds.length} milestone{selectedMilestoneIds.length === 1 ? "" : "s"} selected</summary>
              <div className="max-h-44 overflow-y-auto px-2 pb-2" style={{ borderTop: "1px solid #edf0f4" }}>
                {milestoneOptions.length === 0 ? <p className="px-1 py-2 text-[11px]" style={{ color: "#8c94a6" }}>No related milestone available</p> : milestoneOptions.map(milestone => (
                  <label key={milestone.id} className="flex items-start gap-2 rounded px-1 py-1.5 text-[11px] hover:bg-[#f8fafc]" style={{ color: "#334155" }}>
                    <input type="checkbox" disabled={!editable} checked={selectedMilestoneIds.includes(milestone.id)} onChange={() => toggleMilestone(milestone.id)} className="mt-0.5 h-3.5 w-3.5" />
                    <span><span className="block font-medium">{milestone.name}</span><span className="block text-[10px]" style={{ color: "#8c94a6" }}>{milestone.id}</span></span>
                  </label>
                ))}
              </div>
            </details>
          </Field>
          <Field label="Creation Date"><input readOnly disabled className={fieldClass} style={{ ...fieldStyle, backgroundColor: "#f8fafc" }} value={feature.createdAt} /></Field>
          <Field label="Planned Start Date"><input disabled={!editable} placeholder="e.g. Nov 1, 2024" className={fieldClass} style={fieldStyle} value={feature.plannedStartDate || ""} onChange={e => onUpdateFeature({ plannedStartDate: e.target.value })} /></Field>
          <Field label="Planned End Date"><input type="date" disabled={!editable} className={fieldClass} style={fieldStyle} value={feature.plannedEndDate || ""} onChange={e => onUpdateFeature({ plannedEndDate: e.target.value })} /></Field>
          <Field label="Market Release Date"><input type="date" disabled={!editable} className={fieldClass} style={fieldStyle} value={feature.marketReleaseDate || ""} onChange={e => onUpdateFeature({ marketReleaseDate: e.target.value })} /></Field>
        </aside>
        )}
      </div>
      {showAddItemModal && <NewItemModal onClose={() => setShowAddItemModal(false)} defaultProjectKey={feature.project} defaultTeam={feature.team} allowedTypes={["Story", "Defect"]} onCreate={(input, openDetails) => onCreateItem({ ...input, featureId: feature.id }, openDetails)} />}
    </div>
  );
}

export function PortfolioPage({ role, features, workItems, tasks, milestones, onCreateFeature, onUpdateFeature, onUpdateItem, onCreateItem, onOpenFull }: {
  role: Role; features: Feature[]; workItems: WorkItem[]; tasks: TaskItem[]; milestones: MilestoneItem[];
  onCreateFeature: (input: NewFeatureInput) => Feature;
  onUpdateFeature: (id: string, patch: Partial<Feature>) => void;
  onUpdateItem: (id: string, patch: Partial<WorkItem>) => void;
  onCreateItem: (input: NewWorkItemInput, openDetails: boolean) => void;
  onOpenFull: (item: WorkItem) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);
  const [expandedFeatureIds, setExpandedFeatureIds] = useState<Set<string>>(new Set());
  const backlogItems = workItems.filter(i => i.type === "Story" || i.type === "Defect");
  const editable = can.manageFeatures(role);
  const [columnWidths, setColumnWidths] = useState<Record<PortfolioColumnKey, number>>({ rank: 56, type: 76, id: 76, name: 280, release: 132, state: 172, progress: 150, project: 64, team: 150, owner: 132 });
  const [sort, setSort] = useState<PortfolioSort | null>(null);
  function toggleFeatureExpanded(id: string) {
    setExpandedFeatureIds(previous => { const next = new Set(previous); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  const featureRollups = features.map(feat => {
    const children = backlogItems.filter(i => i.featureId === feat.id);
    const totalEstimate = children.reduce((s, i) => s + i.planEstimate, 0);
    const doneEstimate = children.filter(i => i.status === "Accepted" || i.status === "Release").reduce((s, i) => s + i.planEstimate, 0);
    const progressPct = totalEstimate > 0 ? Math.round((doneEstimate / totalEstimate) * 100) : 0;
    return { feat, children, totalEstimate, doneEstimate, progressPct };
  });
  const activeRollup = activeFeatureId ? featureRollups.find(r => r.feat.id === activeFeatureId) : undefined;
  const releaseOptions = Array.from(new Set(["Unscheduled", ...RELEASES_DATA.map(r => r.name), ...features.map(f => f.release)])).sort();
  const portfolioTableWidth = Object.values(columnWidths).reduce((total, width) => total + width, 0) + 44;
  const sortedRollups = [...featureRollups].sort((a, b) => {
    if (!sort) return (a.feat.rank || 99) - (b.feat.rank || 99);
    const result = comparePortfolioSortValues(getPortfolioSortValue(a.feat, a.progressPct, sort.column), getPortfolioSortValue(b.feat, b.progressPct, sort.column));
    return sort.direction === "asc" ? result : -result;
  });

  function toggleSort(column: PortfolioColumnKey) {
    setSort(previous => {
      if (previous?.column === column) return { column, direction: previous.direction === "asc" ? "desc" : "asc" };
      const defaultDirection = column === "progress" || column === "id" ? "desc" : "asc";
      return { column, direction: defaultDirection };
    });
  }
  function startColumnResize(column: PortfolioColumnKey, event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = columnWidths[column];
    const minimums: Record<PortfolioColumnKey, number> = { rank: 48, type: 60, id: 64, name: 160, release: 90, state: 110, progress: 100, project: 56, team: 90, owner: 96 };
    function handleMouseMove(moveEvent: MouseEvent) {
      const nextWidth = Math.max(minimums[column], startWidth + moveEvent.clientX - startX);
      setColumnWidths(previous => ({ ...previous, [column]: nextWidth }));
    }
    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
  function moveFeature(id: string, direction: -1 | 1) {
    const ordered = [...features].sort((a, b) => (a.rank || 99) - (b.rank || 99));
    const index = ordered.findIndex(f => f.id === id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;
    [ordered[index], ordered[targetIndex]] = [ordered[targetIndex], ordered[index]];
    ordered.forEach((f, idx) => onUpdateFeature(f.id, { rank: idx + 1 }));
  }
  function changeFeatureProject(id: string, projectKey: string) {
    const nextProject = SCOPE_PROJECTS.find(p => p.key === projectKey) || SCOPE_PROJECTS[0];
    onUpdateFeature(id, { project: nextProject.key, team: nextProject.teams[0] });
  }

  if (activeRollup) {
    return (
      <FeatureDetailView
        feature={activeRollup.feat}
        childItems={activeRollup.children}
        totalEstimate={activeRollup.totalEstimate}
        doneEstimate={activeRollup.doneEstimate}
        role={role}
        milestones={milestones}
        tasks={tasks}
        onBack={() => setActiveFeatureId(null)}
        onUpdateFeature={patch => onUpdateFeature(activeRollup.feat.id, patch)}
        onUpdateItem={onUpdateItem}
        onCreateItem={onCreateItem}
        onOpenFull={onOpenFull}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-1.5 bg-white shrink-0" style={{ borderBottom: "1px solid #e2e6eb" }}>
        <h2 className="text-[13px] font-semibold mr-2" style={{ color: "#1a2234" }}>Portfolio Items</h2>
        <button className="flex items-center gap-1.5 px-2 py-1 text-[11px] rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}><Filter size={11} /> Filter</button>
        <div className="flex-1" />
        <SavedViewsDrop />
        {can.manageFeatures(role) && <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded ml-1" style={{ backgroundColor: "#1d3f73" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#163259")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1d3f73")}><Plus size={12} /> New Feature</button>}
      </div>
      <div className="flex-1 overflow-auto bg-white">
        <div style={{ width: portfolioTableWidth, minWidth: "100%" }}>
          <div className="flex items-center h-8 px-3 gap-2 shrink-0 sticky top-0 z-10" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            <div className="w-5 shrink-0" />
            <ResizablePortfolioHeader label="Rank" column="rank" width={columnWidths.rank} onResize={startColumnResize} sort={sort} onSort={toggleSort} align="right" />
            <ResizablePortfolioHeader label="Type" column="type" width={columnWidths.type} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
            <ResizablePortfolioHeader label="ID" column="id" width={columnWidths.id} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
            <ResizablePortfolioHeader label="Name" column="name" width={columnWidths.name} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
            <ResizablePortfolioHeader label="Release" column="release" width={columnWidths.release} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
            <ResizablePortfolioHeader label="State" column="state" width={columnWidths.state} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
            <ResizablePortfolioHeader label="Progress" column="progress" width={columnWidths.progress} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
            <ResizablePortfolioHeader label="Project" column="project" width={columnWidths.project} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
            <ResizablePortfolioHeader label="Team" column="team" width={columnWidths.team} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
            <ResizablePortfolioHeader label="Owner" column="owner" width={columnWidths.owner} onResize={startColumnResize} sort={sort} onSort={toggleSort} />
          </div>
          {sortedRollups.length === 0 ? <EmptyState message="No Portfolio Items found" /> : sortedRollups.map(({ feat, children, totalEstimate, doneEstimate, progressPct }, idx) => {
            const projectTeams = (SCOPE_PROJECTS.find(p => p.key === feat.project) || SCOPE_PROJECTS[0]).teams;
            const featExpanded = expandedFeatureIds.has(feat.id);
            const shownChildren = children.slice(0, 5);
            return (
              <div key={feat.id}>
              <div className="flex items-center h-9 px-3 gap-2 cursor-pointer hover:bg-[#f7f8fa]" style={{ width: portfolioTableWidth, minWidth: "100%", borderBottom: "1px solid #edf0f4" }} onClick={() => setActiveFeatureId(feat.id)}>
                <button aria-label={`${featExpanded ? "Collapse" : "Expand"} ${feat.id} children`} onClick={event => { event.stopPropagation(); if (children.length > 0) toggleFeatureExpanded(feat.id); }} className="w-5 shrink-0 flex items-center justify-center" style={{ color: "#8c94a6" }}>
                  {children.length > 0 ? (featExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : null}
                </button>
                <div className="shrink-0 flex items-center justify-end gap-1" style={{ width: columnWidths.rank }} onClick={event => event.stopPropagation()}>
                  {editable && (
                    <div className="flex flex-col">
                      <button aria-label={`Move ${feat.id} up`} disabled={idx === 0} onClick={() => moveFeature(feat.id, -1)} className="h-3 disabled:opacity-30" style={{ color: "#8c94a6" }}><ChevronUp size={10} /></button>
                      <button aria-label={`Move ${feat.id} down`} disabled={idx === sortedRollups.length - 1} onClick={() => moveFeature(feat.id, 1)} className="h-3 disabled:opacity-30" style={{ color: "#8c94a6" }}><ChevronDown size={10} /></button>
                    </div>
                  )}
                  <span className="text-[11px] font-mono tabular-nums" style={{ color: "#5c6478" }}>{feat.rank ?? idx + 1}</span>
                </div>
                <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.type }}><TypeBadge type="Feature" /></div>
                <div className="shrink-0 overflow-hidden font-mono text-[11px] font-semibold" style={{ width: columnWidths.id, color: "#2558a6" }}>{feat.id}</div>
                <div className="shrink-0 min-w-0 pr-2" style={{ width: columnWidths.name }} onClick={event => event.stopPropagation()}>
                  <input aria-label={`${feat.id} name`} readOnly={!editable} value={feat.name} onChange={e => onUpdateFeature(feat.id, { name: e.target.value })} className="block w-full truncate text-[12px] font-semibold bg-transparent px-1 py-1 focus:outline-none focus:bg-white focus:rounded" style={{ color: "#1a2234", border: editable ? "1px solid transparent" : "0" }} />
                </div>
                <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.release }} onClick={event => event.stopPropagation()}>
                  {editable ? <select aria-label={`${feat.id} release`} value={feat.release} onChange={e => onUpdateFeature(feat.id, { release: e.target.value })} className="w-full text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{releaseOptions.map(r => <option key={r}>{r}</option>)}</select> : <span style={{ color: "#5c6478" }}>{feat.release}</span>}
                </div>
                <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.state }} onClick={event => event.stopPropagation()}>
                  {editable ? <select aria-label={`${feat.id} state`} value={feat.status} onChange={e => onUpdateFeature(feat.id, { status: e.target.value as PortfolioState })} className="w-full text-[11px] rounded-sm bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234", padding: "3px 4px" }}>{PORTFOLIO_STATES.map(s => <option key={s}>{s}</option>)}</select> : <PortfolioStateBadge state={feat.status} />}
                </div>
                <div className="shrink-0 flex items-center gap-2" style={{ width: columnWidths.progress }}>
                  <div className="w-16 h-1.5 rounded-full overflow-hidden shrink-0" style={{ backgroundColor: "#e4e8ed" }}><div className="h-full rounded-full" style={{ width: `${progressPct}%`, backgroundColor: progressPct === 100 ? "#2a8c3f" : progressPct > 50 ? "#2558a6" : "#e59f0c" }} /></div>
                  <span className="text-[10px] tabular-nums truncate" style={{ color: "#5c6478" }}>{progressPct}% ({doneEstimate}/{totalEstimate})</span>
                </div>
                <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.project }} onClick={event => event.stopPropagation()}>
                  {editable ? <select aria-label={`${feat.id} project`} value={feat.project || SCOPE_PROJECTS[0].key} onChange={e => changeFeatureProject(feat.id, e.target.value)} className="w-full text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{SCOPE_PROJECTS.map(p => <option key={p.key} value={p.key}>{p.key}</option>)}</select> : <span style={{ color: "#5c6478" }}>{feat.project}</span>}
                </div>
                <div className="shrink-0 overflow-hidden text-[11px]" style={{ width: columnWidths.team }} onClick={event => event.stopPropagation()}>
                  {editable ? <select aria-label={`${feat.id} team`} value={feat.team || projectTeams[0]} onChange={e => onUpdateFeature(feat.id, { team: e.target.value })} className="w-full text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{projectTeams.map(t => <option key={t}>{t}</option>)}</select> : <span style={{ color: "#5c6478" }}>{feat.team}</span>}
                </div>
                <div className="shrink-0 flex items-center gap-1.5 overflow-hidden" style={{ width: columnWidths.owner }} onClick={event => event.stopPropagation()}>
                  <Avatar owner={feat.owner} size="xs" />
                  {editable ? <select aria-label={`${feat.id} owner`} value={feat.owner.name} onChange={e => { const o = OWNERS.find(c => c.name === e.target.value); if (o) onUpdateFeature(feat.id, { owner: o }); }} className="min-w-0 flex-1 text-[11px] bg-transparent focus:outline-none" style={{ color: "#5c6478" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select> : <span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{feat.owner.name}</span>}
                </div>
              </div>
              {featExpanded && shownChildren.map(item => {
                return (
                  <div key={item.id} className="flex items-center h-8 px-3 gap-2" style={{ width: portfolioTableWidth, minWidth: "100%", backgroundColor: "#fcfdfe", borderBottom: "1px solid #f0f2f5" }}>
                    <div className="w-5 shrink-0" />
                    <div className="shrink-0" style={{ width: columnWidths.rank }} />
                    <div className="shrink-0 overflow-hidden" style={{ width: columnWidths.type }}><TypeBadge type={item.type} /></div>
                    <div className="shrink-0 overflow-hidden font-mono text-[11px]" style={{ width: columnWidths.id, color: item.type === "Defect" ? "#b45309" : "#2558a6" }}>{item.id}</div>
                    <div className="shrink-0 min-w-0 pr-2 truncate text-[11px]" style={{ width: columnWidths.name, color: "#334155" }}>{item.title}</div>
                    <div className="shrink-0 overflow-hidden text-[11px] truncate" style={{ width: columnWidths.release, color: "#5c6478" }}>{item.release}</div>
                    <div className="shrink-0" style={{ width: columnWidths.state }} />
                    <div className="shrink-0" style={{ width: columnWidths.progress }} />
                    <div className="shrink-0 overflow-hidden text-[11px] truncate" style={{ width: columnWidths.project, color: "#5c6478" }}>{item.project}</div>
                    <div className="shrink-0 overflow-hidden text-[11px] truncate" style={{ width: columnWidths.team, color: "#5c6478" }}>{item.team}</div>
                    <div className="shrink-0 flex items-center gap-1.5 overflow-hidden" style={{ width: columnWidths.owner }}>
                      <Avatar owner={item.owner} size="xs" /><span className="text-[11px] truncate" style={{ color: "#5c6478" }}>{item.owner.name}</span>
                    </div>
                  </div>
                );
              })}
              {featExpanded && children.length > shownChildren.length && (
                <div className="flex items-center h-7 px-3" style={{ backgroundColor: "#fcfdfe", borderBottom: "1px solid #f0f2f5", paddingLeft: 20 + columnWidths.rank + 24 }}>
                  <button className="text-[11px]" style={{ color: "#2558a6" }}>+ {children.length - shownChildren.length} more - see Children tab</button>
                </div>
              )}
              </div>
            );
          })}
        </div>
      </div>
      {showModal && <NewFeatureModal onClose={() => setShowModal(false)} onCreate={onCreateFeature} onCreateWithDetails={input => setActiveFeatureId(onCreateFeature(input).id)} />}
    </div>
  );
}

