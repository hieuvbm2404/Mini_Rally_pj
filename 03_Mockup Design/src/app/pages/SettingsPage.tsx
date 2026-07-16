import { useState } from "react";
import {
  Search, ChevronDown, ChevronRight, LayoutList, LayoutGrid,
  Plus, Filter, Bell, HelpCircle, Settings, RefreshCw, Download,
  MoreHorizontal, X, Layers, Paperclip, Link2, Edit3,
  Home, Shield, Users, LogOut, AlertTriangle, MessageSquare,
  CheckCircle, Lock, Check, Archive, Eye, BarChart2,
  Bookmark, Save, RotateCcw, SlidersHorizontal, Activity,
  TrendingUp, TrendingDown, Package, Clock, Star, UserCheck,
  FileText, Hash, ChevronUp, Share2, ChevronLeft,
  GripVertical, Copy, Scissors, UserPlus, GitMerge,
  ExternalLink, AlignJustify, Minus, Zap,
  Tag, Calendar, RotateCw, ListChecks, Globe, Send, ArrowUpRight,
  CheckSquare, Square, Columns,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { type Role, type Page, type WorkItemType, type StatusType, type PriorityType, type Owner, type WorkItem, type Notification, type Feature, type Project, type ScopeProject, type Initiative, type ReleaseItem, type WorkspaceUser, type WorkflowStatusItem, type LabelItem, can, OWNERS, PROJECTS, SCOPE_PROJECTS, WORK_ITEMS, FEATURES, NOTIFICATIONS, VELOCITY_DATA, BURNDOWN_DATA, STATUS_PIE, INITIATIVES, RELEASES_DATA, WORKSPACE_USERS, WORKFLOW_STATUSES, LABELS_DATA, WORKLOAD_DATA, PLANNED_VS_COMPLETED, PERMISSIONS_MATRIX, DEFECT_ENVIRONMENTS, RELATED_STORIES } from "../model";
import { releaseStatusCfg, cx, Avatar, TYPE_CFG, TypeBadge, STATUS_CFG, StatusBadge, PRI_CFG, PriorityBadge, MiniProgress, RoleBadge, DetailPanel, NewItemModal, EmptyState, SectionCard } from "../components/shared";

export function Toggle({ on = true }: { on?: boolean }) {
  const [v, setV] = useState(on);
  return (
    <button onClick={() => setV(!v)} className="w-9 h-5 rounded-full relative transition-colors shrink-0" style={{ backgroundColor: v ? "#1d3f73" : "#cbd5e1" }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: v ? 18 : 2 }} />
    </button>
  );
}

export const AUDIT_LOG_DATA = [
  { time: "Oct 22 09:14", actor: "Marcus Webb", action: "Sprint Closed", entity: "Sprint 24.2", details: "49 points accepted" },
  { time: "Oct 21 16:32", actor: "Sarah Chen", action: "Defect Updated", entity: "DE-1142", details: "Severity: High → Critical" },
  { time: "Oct 20 11:05", actor: "Priya Nair", action: "Feature Created", entity: "FE-318", details: "Advanced Reporting Module" },
  { time: "Oct 19 14:30", actor: "Marcus Webb", action: "Role Changed", entity: "James Okafor", details: "Developer → Tester" },
  { time: "Oct 18 10:15", actor: "Tom Brennan", action: "Sprint Started", entity: "Sprint 24.3", details: "9 items committed, 47 pts" },
  { time: "Oct 15 09:00", actor: "Marcus Webb", action: "User Invited", entity: "Elena Kowalski", details: "Invited as Developer" },
  { time: "Oct 14 16:00", actor: "Priya Nair", action: "Release Updated", entity: "Q4 2024", details: "Target date: Nov 1, 2024" },
  { time: "Oct 13 11:30", actor: "Tom Brennan", action: "Workflow Changed", entity: "Code Review", details: "Status added between In-Progress and Testing" },
];

export const ALL_ROLES: Role[] = ["Workspace Admin", "Project Manager", "Product Owner", "Developer", "Tester", "Viewer"];
export const ROLE_ABBR: Record<Role, string> = { "Workspace Admin": "Admin", "Project Manager": "PM", "Product Owner": "PO", Developer: "Dev", Tester: "QA", Viewer: "View" };

type ProdRoleCode = "WA" | "PA" | "PM" | "PV" | "G";
type PermissionState = "E" | "R" | "D" | "H";
type RoleActionRow = { screen: string; action: string; permission: string; states: Record<ProdRoleCode, PermissionState> };

const PROD_ROLES: { code: ProdRoleCode; name: string; slug: string; summary: string }[] = [
  { code: "WA", name: "Workspace Admin", slug: "workspace_admin", summary: "Full workspace ownership" },
  { code: "PA", name: "Project Admin", slug: "project_admin", summary: "Manage assigned projects" },
  { code: "PM", name: "Project Member", slug: "project_member", summary: "Create and update delivery work" },
  { code: "PV", name: "Project Viewer", slug: "project_viewer", summary: "Read-only project access" },
  { code: "G", name: "Guest", slug: "guest", summary: "No internal access by default" },
];

const STATE_STYLE: Record<PermissionState, { label: string; bg: string; text: string; border: string }> = {
  E: { label: "Enabled", bg: "#eef6f0", text: "#1e6930", border: "#bad7c1" },
  R: { label: "Read-only", bg: "#edf2fb", text: "#1d3f73", border: "#bdd0ea" },
  D: { label: "Disabled", bg: "#f7f8fa", text: "#697285", border: "#dde2ea" },
  H: { label: "Hidden", bg: "#fef2f2", text: "#b91c1c", border: "#f0c7c1" },
};
const PERMISSION_STATE_OPTIONS: PermissionState[] = ["E", "R", "D", "H"];

const roleStates = (WA: PermissionState, PA: PermissionState, PM: PermissionState, PV: PermissionState, G: PermissionState): Record<ProdRoleCode, PermissionState> => ({ WA, PA, PM, PV, G });

const PROD_ROLE_ACTION_MATRIX: RoleActionRow[] = [
  { screen: "Auth", action: "Create session (sign in)", permission: "auth:session", states: roleStates("E", "E", "E", "E", "H") },
  { screen: "Auth", action: "View restored session", permission: "auth:session", states: roleStates("E", "E", "E", "E", "H") },
  { screen: "Auth", action: "Delete session (sign out)", permission: "auth:session", states: roleStates("E", "E", "E", "E", "H") },
  { screen: "App Shell", action: "View navigation, breadcrumbs and workspace context", permission: "workspace:view", states: roleStates("E", "R", "R", "R", "H") },
  { screen: "App Shell", action: "Edit selected project/team context", permission: "project:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "App Shell", action: "View global work item search results", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Home", action: "View workspace dashboard and project health", permission: "project:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Home", action: "View My Work assigned items", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Manage Projects > Projects", action: "View project list, search and filters", permission: "project:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Manage Projects > Projects", action: "Create project", permission: "project:create", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Manage Projects > Projects", action: "Edit project settings", permission: "project:edit", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Manage Projects > Projects", action: "Edit project status (archive/restore)", permission: "project:archive / project:restore", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Manage Projects > Projects", action: "Delete project", permission: "project:delete", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Manage Projects > Teams", action: "View team list, search and filters", permission: "project:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Manage Projects > Teams", action: "Create team", permission: "workspace:manage_teams", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Manage Projects > Teams", action: "Edit team info, status and lead", permission: "workspace:manage_teams", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Manage Projects > Teams", action: "Edit team members", permission: "workspace:manage_teams", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Manage Projects > Teams", action: "Delete team (deactivate)", permission: "workspace:manage_teams", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Manage Projects > Users", action: "View workspace users", permission: "workspace:manage_members", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Manage Projects > Users", action: "Create user invitation", permission: "workspace:manage_members", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Manage Projects > Users", action: "Edit user prod role, status and team membership", permission: "workspace:manage_members", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Manage Projects > Users", action: "Delete user access (remove/deactivate)", permission: "workspace:manage_members", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Backlog", action: "View US/DE rows", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Backlog", action: "View search, filter, sort, pagination and resized columns", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Backlog", action: "Create US/DE work item", permission: "work_item:create", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Backlog", action: "Edit work item fields inline", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Backlog", action: "Edit release or iteration assignment", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Backlog", action: "Edit backlog rank order", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Backlog", action: "Delete selected work item", permission: "work_item:delete", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Work Item Detail", action: "View details, fields and revision history", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Work Item Detail", action: "Edit fields, notes, release notes and relations", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Work Item Detail", action: "Create attachment", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Work Item Detail", action: "Delete attachment", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Work Item Detail", action: "Create note mention", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Work Item Detail", action: "Edit watcher subscription", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Work Item Detail", action: "Delete work item", permission: "work_item:delete", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Task Dashboard", action: "View child tasks", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Task Dashboard", action: "Create task under US/DE", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Task Dashboard", action: "Edit task name, state, owner and effort inline", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Task Dashboard", action: "Delete task", permission: "work_item:edit", states: roleStates("E", "E", "E", "H", "H") },
  { screen: "Task Detail", action: "View task details, attachments and work product", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Task Detail", action: "Edit task details, attachments and work product", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Timeboxes > Iterations", action: "View iteration list and detail", permission: "iteration:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Timeboxes > Iterations", action: "Create iteration", permission: "iteration:manage", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Timeboxes > Iterations", action: "Edit iteration fields", permission: "iteration:manage", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Timeboxes > Iterations", action: "Delete iteration", permission: "iteration:manage", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Timeboxes > Iterations", action: "Edit work item iteration assignment", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Track > Iteration Status", action: "View selector, metrics and assigned work items", permission: "iteration:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Track > Iteration Status", action: "Create US/DE directly into selected iteration", permission: "work_item:create", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Track > Iteration Status", action: "Edit work item fields inline", permission: "work_item:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Track > Iteration Status", action: "Delete work item from iteration view", permission: "work_item:delete", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Track > Team Status", action: "View grouped member/task status", permission: "team_status:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Track > Team Status", action: "Edit capacity and task status fields", permission: "team_status:edit", states: roleStates("E", "E", "D", "D", "H") },
  { screen: "Track > Team Status", action: "View related work item or task detail", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Timeboxes > Releases", action: "View release dashboard and detail", permission: "release:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Timeboxes > Releases", action: "Create release", permission: "release:manage", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Timeboxes > Releases", action: "Edit release fields and artifact assignment", permission: "release:manage", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Timeboxes > Releases", action: "Delete release", permission: "release:manage", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Timeboxes > Milestones", action: "View milestone dashboard, detail and artifacts", permission: "milestone:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Timeboxes > Milestones", action: "Create milestone", permission: "milestone:manage", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Timeboxes > Milestones", action: "Edit milestone fields and relations", permission: "milestone:manage", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Timeboxes > Milestones", action: "Delete milestone", permission: "milestone:manage", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Quality > Defect", action: "View defect dashboard", permission: "quality:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Quality > Defect", action: "Create defect", permission: "work_item:create", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Quality > Defect", action: "Edit severity, priority, state, flow state, owner and fixed build", permission: "quality:edit", states: roleStates("E", "E", "E", "D", "H") },
  { screen: "Quality > Defect", action: "Delete defect", permission: "work_item:delete", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Notifications", action: "View assignment and note mention alerts", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Notifications", action: "Edit notification read state", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Notifications", action: "View related US/DE target", permission: "work_item:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Settings > Personal", action: "View own profile preferences", permission: "workspace:view", states: roleStates("E", "E", "E", "E", "H") },
  { screen: "Settings > Personal", action: "Edit own profile preferences", permission: "workspace:view", states: roleStates("E", "E", "E", "E", "H") },
  { screen: "Settings > Project", action: "View project settings, workflow and labels", permission: "project:view", states: roleStates("E", "E", "E", "R", "H") },
  { screen: "Settings > Project", action: "Edit project settings, workflow and labels", permission: "project:edit", states: roleStates("E", "E", "H", "H", "H") },
  { screen: "Settings > Workspace", action: "View workspace settings and role matrix", permission: "workspace:view", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Settings > Workspace", action: "Edit workspace settings", permission: "workspace:*", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Settings > Workspace", action: "Edit role matrix and permissions", permission: "workspace:manage_members", states: roleStates("E", "H", "H", "H", "H") },
  { screen: "Audit Log", action: "View workspace audit trail", permission: "workspace:*", states: roleStates("E", "H", "H", "H", "H") },
];

export function userStatusCfg(s: WorkspaceUser["status"]) {
  if (s === "Active") return { bg: "#eef6f0", text: "#1e6930" };
  if (s === "Invited") return { bg: "#fef5e4", text: "#8a5808" };
  return { bg: "#fef2f2", text: "#b91c1c" };
}

export function wfCategoryCfg(c: WorkflowStatusItem["category"]) {
  if (c === "To Do") return { bg: "#eef3fb", text: "#475569" };
  if (c === "In Progress") return { bg: "#fef5e4", text: "#8a5808" };
  return { bg: "#eef6f0", text: "#1e6930" };
}

export function SettingsPage({ role }: { role: Role }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedProdRole, setSelectedProdRole] = useState<ProdRoleCode>("PA");
  const [permissionRows, setPermissionRows] = useState<RoleActionRow[]>(PROD_ROLE_ACTION_MATRIX);
  const [savedPermissionRows, setSavedPermissionRows] = useState<RoleActionRow[]>(PROD_ROLE_ACTION_MATRIX);
  const [isPermissionEditMode, setIsPermissionEditMode] = useState(false);
  const [permissionSaved, setPermissionSaved] = useState(false);
  const [userFilter, setUserFilter] = useState("All");
  const sections = [
    { group: "Personal", items: [{ key: "profile", label: "Profile & Account", icon: <UserCheck size={13} /> }, { key: "notifications", label: "Notification Preferences", icon: <Bell size={13} /> }] },
    { group: "Project", items: [{ key: "project", label: "Project Settings", icon: <SlidersHorizontal size={13} />, gate: can.manageSettings(role) }, { key: "workflow", label: "Workflow Status", icon: <Activity size={13} />, gate: can.manageSettings(role) }, { key: "labels", label: "Labels", icon: <Tag size={13} />, gate: can.manageSettings(role) }] },
    { group: "Workspace", items: [{ key: "workspace", label: "Workspace Settings", icon: <Globe size={13} />, gate: can.viewAdmin(role) }, { key: "members", label: "User Management", icon: <Users size={13} />, gate: can.manageUsers(role) }, { key: "roles", label: "Roles & Permissions", icon: <Shield size={13} />, gate: can.manageRoles(role) }, { key: "audit", label: "Audit Log", icon: <FileText size={13} />, gate: can.viewAdmin(role) }] },
  ];

  const fieldRow = (label: string, value: string, w = "w-36") => (
    <div key={label} className="flex items-center gap-4">
      <label className={cx(w, "text-[11px] font-semibold shrink-0")} style={{ color: "#5c6478" }}>{label}</label>
      <input defaultValue={value} className="flex-1 max-w-72 text-[12px] px-3 py-1.5 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }} />
    </div>
  );
  const toggleRow = (label: string, on = true) => (
    <div key={label} className="flex items-center gap-4">
      <label className="w-36 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>{label}</label>
      <Toggle on={on} />
    </div>
  );

  const usersFiltered = WORKSPACE_USERS.filter(u => userFilter === "All" || u.role === userFilter);
  const canEditPermissionMatrix = role === "Workspace Admin";
  const hasPermissionChanges = JSON.stringify(permissionRows) !== JSON.stringify(savedPermissionRows);
  function editPermissionState(rowIndex: number, roleCode: ProdRoleCode, state: PermissionState) {
    if (!canEditPermissionMatrix || !isPermissionEditMode || roleCode === "WA") return;
    setPermissionRows(previous => previous.map((row, index) => index === rowIndex ? { ...row, states: { ...row.states, [roleCode]: state } } : row));
    setPermissionSaved(false);
  }
  function startPermissionEdit() {
    if (!canEditPermissionMatrix) return;
    setPermissionRows(savedPermissionRows);
    setIsPermissionEditMode(true);
    setPermissionSaved(false);
  }
  function savePermissionMatrix() {
    if (!canEditPermissionMatrix) return;
    setSavedPermissionRows(permissionRows);
    setIsPermissionEditMode(false);
    setPermissionSaved(true);
  }

  const content: Record<string, React.ReactNode> = {
    profile: (
      <div className="space-y-5">
        <div className="flex items-center gap-4 pb-4" style={{ borderBottom: "1px solid #e2e6eb" }}>
          <Avatar owner={OWNERS[0]} size="lg" />
          <div><p className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Marcus Webb</p><p className="text-[12px]" style={{ color: "#5c6478" }}>marcus.webb@acme.com</p><div className="mt-1"><RoleBadge role={role} /></div></div>
          <button className="ml-auto px-3 py-1.5 text-[11px] font-medium rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}>Edit Profile</button>
        </div>
        {[["Full Name", "Marcus Webb"], ["Email", "marcus.webb@acme.com"], ["Time Zone", "UTC-5 (Eastern Time)"], ["Language", "English (US)"]].map(([l, v]) => fieldRow(l, v))}
      </div>
    ),
    notifications: (
      <div className="space-y-4 max-w-xl">
        <p className="text-[12px] mb-2" style={{ color: "#5c6478" }}>Choose how and when you receive notifications.</p>
        {["Email notifications", "In-app notifications", "Assigned to me", "Comments & mentions", "Status changes", "Sprint updates", "Due date reminders", "Daily digest"].map((l, i) => toggleRow(l, i < 5))}
      </div>
    ),
    project: (
      <div className="space-y-5 max-w-xl">
        {fieldRow("Project Name", "Nexus Platform 2025")}
        {fieldRow("Project Key", "NXP")}
        <div className="flex items-center gap-4"><label className="w-36 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>Default Workflow</label><select className="text-[12px] px-2.5 py-1.5 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}><option>Standard</option><option>Kanban</option><option>Custom</option></select></div>
        <div className="flex items-center gap-4"><label className="w-36 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>Default Assignee</label><select className="text-[12px] px-2.5 py-1.5 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select></div>
        {toggleRow("Enable Sprint", true)}
        {toggleRow("Enable Release", true)}
        {toggleRow("Enable Story Points", true)}
        {fieldRow("Work Item Key Prefix", "NXP")}
        <div className="pt-3" style={{ borderTop: "1px solid #e2e6eb" }}><button className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}>Save Changes</button></div>
      </div>
    ),
    workflow: (
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px]" style={{ color: "#5c6478" }}>Define the statuses work items move through.</p>
          {can.manageSettings(role) && <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded" style={{ border: "1px solid #1d3f73", color: "#1d3f73" }}><Plus size={12} /> Add Status</button>}
        </div>
        <div className="rounded overflow-hidden" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center h-8 px-3 gap-2" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["flex-1", "Status Name"], ["w-32", "Category"], ["w-16 text-center", "Order"], ["w-16 text-center", "Final?"], ["w-24 text-right", "Actions"]].map(([c, l], i) => <div key={i} className={cx(c, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{l}</div>)}
          </div>
          {WORKFLOW_STATUSES.map(ws => { const c = wfCategoryCfg(ws.category); return (
            <div key={ws.id} className="flex items-center h-9 px-3 gap-2" style={{ borderBottom: "1px solid #f0f2f5" }}>
              <div className="flex-1 text-[12px] font-medium" style={{ color: "#1a2234" }}>{ws.name}</div>
              <div className="w-32"><span className="px-2 py-px text-[10px] font-semibold rounded-sm" style={{ backgroundColor: c.bg, color: c.text }}>{ws.category}</span></div>
              <div className="w-16 text-center text-[11px] tabular-nums" style={{ color: "#5c6478" }}>{ws.order}</div>
              <div className="w-16 text-center">{ws.isFinal ? <Check size={13} className="inline" style={{ color: "#2a8c3f" }} /> : <Minus size={13} className="inline" style={{ color: "#c4cad4" }} />}</div>
              <div className="w-24 flex items-center justify-end gap-1">{can.manageSettings(role) && <><button className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.color = "#1a2234")} onMouseLeave={e => (e.currentTarget.style.color = "#8c94a6")}><Edit3 size={12} /></button><button className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.color = "#b91c1c")} onMouseLeave={e => (e.currentTarget.style.color = "#8c94a6")}><X size={12} /></button></>}</div>
            </div>
          ); })}
        </div>
      </div>
    ),
    labels: (
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px]" style={{ color: "#5c6478" }}>Manage labels used to categorize work items.</p>
          {can.manageSettings(role) && <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded" style={{ border: "1px solid #1d3f73", color: "#1d3f73" }}><Plus size={12} /> Add Label</button>}
        </div>
        <div className="rounded overflow-hidden" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center h-8 px-3 gap-2" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["flex-1", "Label"], ["w-28 text-center", "Usage"], ["w-24 text-right", "Actions"]].map(([c, l], i) => <div key={i} className={cx(c, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{l}</div>)}
          </div>
          {LABELS_DATA.map(lab => (
            <div key={lab.id} className="flex items-center h-9 px-3 gap-2" style={{ borderBottom: "1px solid #f0f2f5" }}>
              <div className="flex-1 flex items-center gap-2"><span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lab.color }} /><span className="text-[12px] font-medium" style={{ color: "#1a2234" }}>{lab.name}</span></div>
              <div className="w-28 text-center"><span className="text-[10px] font-semibold px-1.5 py-px rounded-sm" style={{ backgroundColor: "#f0f2f5", color: "#5c6478" }}>{lab.usage} items</span></div>
              <div className="w-24 flex items-center justify-end gap-1">{can.manageSettings(role) && <><button className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.color = "#1a2234")} onMouseLeave={e => (e.currentTarget.style.color = "#8c94a6")}><Edit3 size={12} /></button><button className="p-1 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => (e.currentTarget.style.color = "#b91c1c")} onMouseLeave={e => (e.currentTarget.style.color = "#8c94a6")}><X size={12} /></button></>}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    workspace: (
      <div className="space-y-5 max-w-xl">
        {fieldRow("Workspace Name", "ACME Space Inc.", "w-40")}
        {fieldRow("Workspace Slug", "acme-space", "w-40")}
        <div className="flex items-center gap-4"><label className="w-40 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>Owner</label><select className="text-[12px] px-2.5 py-1.5 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{OWNERS.map(o => <option key={o.name}>{o.name}</option>)}</select></div>
        <div className="flex items-center gap-4"><label className="w-40 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>Status</label><span className="px-2 py-px text-[10px] font-semibold rounded-sm" style={{ backgroundColor: "#eef6f0", color: "#1e6930" }}>Active</span></div>
        <div className="pt-3" style={{ borderTop: "1px solid #e2e6eb" }}><button className="px-4 py-1.5 text-[12px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}>Save Changes</button></div>
      </div>
    ),
    members: (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold" style={{ color: "#5c6478" }}>Filter by role:</span>
            <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="text-[11px] px-2 py-1 rounded bg-white focus:outline-none" style={{ border: "1px solid #dde2ea", color: "#1a2234" }}>{["All", ...ALL_ROLES].map(r => <option key={r}>{r}</option>)}</select>
          </div>
          {can.manageUsers(role) && <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white rounded" style={{ backgroundColor: "#1d3f73" }}><UserPlus size={12} /> Invite User</button>}
        </div>
        <div className="rounded overflow-hidden" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center h-8 px-3 gap-2" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["w-48", "Name"], ["flex-1", "Email"], ["w-32", "Role"], ["w-20", "Status"], ["w-40", "Last Login"], ["w-32 text-right", "Actions"]].map(([c, l], i) => <div key={i} className={cx(c, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{l}</div>)}
          </div>
          {usersFiltered.map(u => { const sc = userStatusCfg(u.status); return (
            <div key={u.email} className="flex items-center h-10 px-3 gap-2" style={{ borderBottom: "1px solid #f0f2f5" }}>
              <div className="w-48 flex items-center gap-2"><Avatar owner={u.owner} size="sm" /><span className="text-[12px] font-medium truncate" style={{ color: "#1a2234" }}>{u.name}</span></div>
              <div className="flex-1 text-[11px] truncate" style={{ color: "#5c6478" }}>{u.email}</div>
              <div className="w-32"><RoleBadge role={u.role} /></div>
              <div className="w-20"><span className="px-2 py-px text-[10px] font-semibold rounded-sm" style={{ backgroundColor: sc.bg, color: sc.text }}>{u.status}</span></div>
              <div className="w-40 text-[10px]" style={{ color: "#8c94a6" }}>{u.lastLogin}</div>
              <div className="w-32 flex items-center justify-end gap-1">{can.manageUsers(role) && <><button className="text-[10px] px-2 py-0.5 rounded" style={{ border: "1px solid #dde2ea", color: "#5c6478" }}>Change Role</button><button className="text-[10px] px-2 py-0.5 rounded" style={{ border: "1px solid #f0c7c1", color: "#b91c1c" }}>Remove</button></>}</div>
            </div>
          ); })}
        </div>
      </div>
    ),
    roles: (
      <div className="flex gap-4 h-full min-h-0">
        <div className="w-64 shrink-0">
          <p className="text-[9px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#8c94a6" }}>Production roles</p>
          <div className="space-y-1">
            {PROD_ROLES.map(r => (
              <button
                key={r.code}
                onClick={() => setSelectedProdRole(r.code)}
                className="w-full text-left px-2.5 py-2 rounded"
                style={{ backgroundColor: selectedProdRole === r.code ? "#edf2fb" : "transparent", border: selectedProdRole === r.code ? "1px solid #bdd0ea" : "1px solid transparent" }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 text-center text-[10px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: selectedProdRole === r.code ? "#1d3f73" : "#f0f2f5", color: selectedProdRole === r.code ? "#ffffff" : "#5c6478" }}>{r.code}</span>
                  <span className="text-[12px] font-semibold" style={{ color: selectedProdRole === r.code ? "#1d3f73" : "#1a2234" }}>{r.name}</span>
                </div>
                <p className="mt-1 text-[10px] font-mono" style={{ color: "#5c6478" }}>{r.slug}</p>
                <p className="mt-0.5 text-[10px]" style={{ color: "#8c94a6" }}>{r.summary}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Shield size={14} style={{ color: "#1d3f73" }} />
                <span className="text-[13px] font-semibold" style={{ color: "#1a2234" }}>Role Action Matrix</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex flex-wrap justify-end gap-1.5">
                {Object.entries(STATE_STYLE).map(([key, cfg]) => (
                  <span key={key} className="text-[10px] font-semibold px-2 py-1 rounded-sm" style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{key} {cfg.label}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {permissionSaved && <span className="text-[10px] font-semibold" style={{ color: "#1e6930" }}>Saved</span>}
                {canEditPermissionMatrix && !isPermissionEditMode && (
                  <button onClick={startPermissionEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold" style={{ color: "#1d3f73", border: "1px solid #bdd0ea", backgroundColor: "#edf2fb" }}>
                    <Edit3 size={12} /> Edit
                  </button>
                )}
                {canEditPermissionMatrix && isPermissionEditMode && (
                  <button onClick={savePermissionMatrix} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold text-white" style={{ backgroundColor: hasPermissionChanges ? "#1d3f73" : "#8c94a6" }}>
                    <Save size={12} /> Save
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="rounded overflow-auto flex-1" style={{ border: "1px solid #e2e6eb" }}>
            <div className="grid items-center min-w-[916px] sticky top-0 z-10" style={{ gridTemplateColumns: "140px minmax(240px,1fr) 190px repeat(5,64px)", backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
              {["Screen", "Action", "Permission", ...PROD_ROLES.map(r => r.code)].map((h, idx) => (
                <div key={h} className="px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-center" style={{ color: idx >= 3 && h === selectedProdRole ? "#1d3f73" : "#8c94a6", borderRight: idx < 7 ? "1px solid #eef1f5" : undefined }}>{h}</div>
              ))}
            </div>
            {permissionRows.map((row, idx) => (
              <div key={`${row.screen}-${row.action}`} className="grid items-center min-w-[916px]" style={{ gridTemplateColumns: "140px minmax(240px,1fr) 190px repeat(5,64px)", borderBottom: "1px solid #f0f2f5", backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fbfcfe" }}>
                <div className="px-3 py-2 text-[11px] font-semibold" style={{ color: "#3a4254", borderRight: "1px solid #eef1f5" }}>{row.screen}</div>
                <div className="px-3 py-2 text-[11px]" style={{ color: "#1a2234", borderRight: "1px solid #eef1f5" }}>{row.action}</div>
                <div className="px-3 py-2 text-[10px] font-mono truncate" style={{ color: "#697285", borderRight: "1px solid #eef1f5" }}>{row.permission}</div>
                {PROD_ROLES.map(r => {
                  const state = row.states[r.code];
                  const cfg = STATE_STYLE[state];
                  const selected = selectedProdRole === r.code;
                  const editable = canEditPermissionMatrix && isPermissionEditMode && r.code !== "WA";
                  return (
                    <div key={r.code} className="h-full flex items-center justify-center px-2 py-1.5" style={{ backgroundColor: selected ? "#f3f6fb" : undefined, borderRight: r.code !== "G" ? "1px solid #eef1f5" : undefined }}>
                      {editable ? (
                        <select
                          aria-label={`${row.screen} ${row.action} ${r.code} permission state`}
                          value={state}
                          onChange={event => editPermissionState(idx, r.code, event.target.value as PermissionState)}
                          className="w-12 h-6 rounded-sm text-center text-[10px] font-bold focus:outline-none"
                          style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
                        >
                          {PERMISSION_STATE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <span className="w-10 inline-flex items-center justify-center gap-0.5 text-center text-[10px] font-bold rounded-sm py-0.5" style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
                          {r.code === "WA" && <Lock size={8} />}
                          {state}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    audit: (
      <div>
        <p className="text-[12px] mb-3" style={{ color: "#5c6478" }}>Complete workspace activity log.</p>
        <div className="rounded overflow-hidden" style={{ border: "1px solid #e2e6eb" }}>
          <div className="flex items-center h-8 px-3 gap-2" style={{ backgroundColor: "#f7f8fa", borderBottom: "1px solid #e2e6eb" }}>
            {[["w-28", "Time"], ["w-32", "Actor"], ["w-40", "Action"], ["w-40", "Entity"], ["flex-1", "Details"]].map(([c, l], i) => <div key={i} className={cx(c, "text-[9px] font-semibold uppercase tracking-wider")} style={{ color: "#8c94a6" }}>{l}</div>)}
          </div>
          {AUDIT_LOG_DATA.map((a, i) => (
            <div key={i} className="flex items-center h-9 px-3 gap-2" style={{ borderBottom: "1px solid #f0f2f5" }}>
              <div className="w-28 text-[10px]" style={{ color: "#8c94a6" }}>{a.time}</div>
              <div className="w-32 text-[11px] font-medium truncate" style={{ color: "#1a2234" }}>{a.actor}</div>
              <div className="w-40 text-[11px]" style={{ color: "#2558a6" }}>{a.action}</div>
              <div className="w-40 text-[11px] font-mono truncate" style={{ color: "#5c6478" }}>{a.entity}</div>
              <div className="flex-1 text-[11px] truncate" style={{ color: "#3a4254" }}>{a.details}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-52 shrink-0 bg-white overflow-y-auto" style={{ borderRight: "1px solid #e2e6eb" }}>
        <div className="px-3 py-3">
          {sections.map(sec => (
            <div key={sec.group} className="mb-4">
              <p className="text-[9px] uppercase tracking-widest font-semibold px-2 mb-1" style={{ color: "#8c94a6" }}>{sec.group}</p>
              {sec.items.map(item => {
                const locked = item.gate === false;
                return (
                  <button key={item.key} onClick={() => !locked && setActiveTab(item.key)} className={cx("w-full flex items-center gap-2 px-2 py-1.5 text-[12px] rounded text-left mb-0.5", locked && "opacity-40 cursor-not-allowed")} style={{ backgroundColor: activeTab === item.key ? "#edf2fb" : "transparent", color: activeTab === item.key ? "#1d3f73" : "#3a4254", fontWeight: activeTab === item.key ? 600 : 400 }} disabled={locked}>
                    <span style={{ color: activeTab === item.key ? "#1d3f73" : "#8c94a6" }}>{item.icon}</span>
                    {item.label}
                    {locked && <Lock size={10} className="ml-auto" style={{ color: "#b0b8c8" }} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6 bg-white">
        <h2 className="text-[14px] font-semibold mb-4" style={{ color: "#1a2234" }}>{sections.flatMap(s => s.items).find(i => i.key === activeTab)?.label || "Settings"}</h2>
        {content[activeTab] || <p className="text-[12px]" style={{ color: "#5c6478" }}>Select a section from the left menu.</p>}
      </div>
    </div>
  );
}

