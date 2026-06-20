import { useState } from "react";
import {
  Search, ChevronDown, ChevronRight, LayoutList, LayoutGrid,
  Plus, Filter, Bell, HelpCircle, Settings, RefreshCw, Download,
  MoreHorizontal, X, Layers, Paperclip, Link2, Edit3,
  Home, Shield, Users, LogOut, AlertTriangle, MessageSquare,
  CheckCircle, Flag, Lock, Check, Archive, Eye, BarChart2,
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

export const AC_ITEMS = [
  { text: "User can upload IdP SAML metadata XML via project settings panel", done: true },
  { text: "Attribute mapping UI correctly displays all required SAML attributes", done: true },
  { text: "SSO login successfully redirects to correct workspace dashboard post-auth", done: false },
  { text: "Session automatically expires after configured timeout period (default 8h)", done: false },
  { text: "Invalid SAML responses display clear error message to end user", done: false },
];

export const DETAIL_RELATED = [
  { rel: "Parent", id: "FE-311", title: "Enterprise Authentication Suite", type: "Feature" as WorkItemType, status: "Completed" as StatusType },
  { rel: "Blocks", id: "DE-1099", title: "Login session not persisting on reload", type: "Defect" as WorkItemType, status: "Defined" as StatusType },
  { rel: "Depends On", id: "TA-2293", title: "Upgrade PostgreSQL client library to v15", type: "Task" as WorkItemType, status: "Accepted" as StatusType },
];

export const DETAIL_COMMENTS = [
  { who: "Sarah Chen", owner: OWNERS[1], when: "Oct 21 at 10:42 AM", text: "IdP metadata upload flow is working. Moving on to attribute mapping UI — the spec requires all standard SAML attributes to be discoverable automatically." },
  { who: "Marcus Webb", owner: OWNERS[0], when: "Oct 21 at 2:15 PM", text: "@Sarah can you also verify session timeout behavior? The spec says 8h by default, but we should make this configurable per tenant." },
  { who: "Sarah Chen", owner: OWNERS[1], when: "Oct 21 at 3:30 PM", text: "Good point. I'll add a config field to the tenant settings schema and wire it to the session manager." },
];

export const DETAIL_ATTACHMENTS = [
  { name: "saml-metadata-template.xml", size: "4.2 KB", by: "Marcus Webb", date: "Oct 18" },
  { name: "architecture-diagram-v2.png", size: "128 KB", by: "Priya Nair", date: "Oct 15" },
];

export const DETAIL_ACTIVITY = [
  { icon: Activity, text: "Status changed from Defined → In-Progress", by: "Marcus Webb", time: "Oct 21 at 9:14 AM" },
  { icon: Users, text: "Owner changed from Priya Nair → Marcus Webb", by: "Priya Nair", time: "Oct 19 at 2:30 PM" },
  { icon: Zap, text: "Moved to Sprint 24.3 from Backlog", by: "Tom Brennan", time: "Oct 14 at 10:00 AM" },
  { icon: Edit3, text: "Plan Estimate changed from 5 → 8 story points", by: "Marcus Webb", time: "Oct 13 at 4:45 PM" },
  { icon: Plus, text: "Work item created", by: "Priya Nair", time: "Oct 10 at 11:20 AM" },
];

export function MetaField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5" style={{ borderBottom: "1px solid #f0f2f5" }}>
      <p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#8c94a6" }}>{label}</p>
      <div className="text-[12px]" style={{ color: "#1a2234" }}>{children}</div>
    </div>
  );
}

export function WorkItemDetailPage({ item, role, onBack }: { item: WorkItem; role: Role; onBack: () => void }) {
  const editable = can.edit(role);
  const [checked, setChecked] = useState<boolean[]>(AC_ITEMS.map(a => a.done));
  const [watching, setWatching] = useState(false);
  const [blocked, setBlocked] = useState(!!item.blocked);
  const [comment, setComment] = useState("");
  const acDone = checked.filter(Boolean).length;

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      {/* Sticky header */}
      <div className="shrink-0 px-5 py-3" style={{ borderBottom: "1px solid #e2e6eb", backgroundColor: "#fff" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 text-[12px] font-medium" style={{ color: "#2558a6" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
            <ChevronLeft size={14} /> Back
          </button>
          <span style={{ color: "#b0b8c8" }}>/</span>
          <TypeBadge type={item.type} />
          <span className="font-mono text-[12px]" style={{ color: "#5c6478" }}>{item.id}</span>
          <StatusBadge status={item.status} />
          <div className="flex-1" />
          <button onClick={() => setWatching(w => !w)} className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded" style={{ border: "1px solid #dde2ea", color: watching ? "#1d3f73" : "#5c6478", backgroundColor: watching ? "#edf2fb" : "transparent" }}>
            <Eye size={12} /> {watching ? "Watching" : "Watch"}
          </button>
          <button className="p-1.5 rounded" style={{ color: "#8c94a6" }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f4f6f9"; e.currentTarget.style.color = "#1a2234"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#8c94a6"; }}><MoreHorizontal size={16} /></button>
        </div>
        <input defaultValue={item.title} readOnly={!editable} className="mt-2.5 w-full text-[18px] font-semibold focus:outline-none bg-transparent" style={{ color: "#1a2234" }} />
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left */}
        <div className="overflow-y-auto p-5 space-y-4" style={{ width: "65%", backgroundColor: "#f0f2f5" }}>
          <SectionCard title="Description">
            {editable ? (
              <textarea defaultValue={item.description} rows={4} className="w-full text-[12px] leading-relaxed px-3 py-2 rounded focus:outline-none resize-none" style={{ border: "1px solid #dde2ea", color: "#3a4254" }} />
            ) : <p className="text-[12px] leading-relaxed" style={{ color: "#3a4254" }}>{item.description}</p>}
          </SectionCard>

          <SectionCard title="Acceptance Criteria" action={<span className="text-[10px] font-semibold" style={{ color: "#5c6478" }}>{acDone}/{AC_ITEMS.length}</span>}>
            <div className="space-y-2">
              {AC_ITEMS.map((a, i) => (
                <button key={i} onClick={() => editable && setChecked(c => c.map((v, j) => j === i ? !v : v))} className="flex items-start gap-2 w-full text-left">
                  {checked[i] ? <CheckSquare size={15} style={{ color: "#2a8c3f", marginTop: 1 }} className="shrink-0" /> : <Square size={15} style={{ color: "#b0b8c8", marginTop: 1 }} className="shrink-0" />}
                  <span className="text-[12px]" style={{ color: checked[i] ? "#8c94a6" : "#1a2234", textDecoration: checked[i] ? "line-through" : "none" }}>{a.text}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          {item.type === "Defect" && (
            <SectionCard title="Defect Details">
              <div className="space-y-3">
                {[["Severity", "Critical"], ["Environment", "Firefox 118+, Windows 11"]].map(([l, v]) => (
                  <div key={l} className="flex gap-3"><span className="w-32 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>{l}</span><span className="text-[12px]" style={{ color: l === "Severity" ? "#b91c1c" : "#1a2234", fontWeight: l === "Severity" ? 600 : 400 }}>{v}</span></div>
                ))}
                <div><p className="text-[11px] font-semibold mb-1" style={{ color: "#5c6478" }}>Steps to Reproduce</p><textarea rows={3} defaultValue={"1. Open dashboard with 4+ chart widgets\n2. Enable auto-refresh\n3. Leave tab open for 45 minutes\n4. Observe heap growth in dev tools"} readOnly={!editable} className="w-full text-[12px] px-3 py-2 rounded focus:outline-none resize-none" style={{ border: "1px solid #dde2ea", color: "#3a4254" }} /></div>
                {[["Expected Result", "Memory usage remains stable"], ["Actual Result", "Memory grows ~15MB per minute, never released"], ["Root Cause", "Under investigation — suspected detached DOM event listeners"], ["Resolution", "—"]].map(([l, v]) => (
                  <div key={l} className="flex gap-3"><span className="w-32 text-[11px] font-semibold shrink-0" style={{ color: "#5c6478" }}>{l}</span><span className="text-[12px]" style={{ color: "#3a4254" }}>{v}</span></div>
                ))}
              </div>
            </SectionCard>
          )}

          <SectionCard title="Related Work Items" action={<button className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "#2558a6" }}><Link2 size={11} /> Link Existing</button>}>
            <div className="space-y-1">
              {DETAIL_RELATED.map(r => (
                <div key={r.id} className="flex items-center gap-2 py-1.5" style={{ borderBottom: "1px solid #f0f2f5" }}>
                  <span className="w-20 text-[10px] font-semibold uppercase tracking-wider shrink-0" style={{ color: "#8c94a6" }}>{r.rel}</span>
                  <TypeBadge type={r.type} />
                  <span className="font-mono text-[11px] shrink-0" style={{ color: "#5c6478" }}>{r.id}</span>
                  <span className="flex-1 text-[12px] truncate" style={{ color: "#1a2234" }}>{r.title}</span>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Comments">
            {editable && (
              <div className="flex gap-2 mb-3">
                <Avatar owner={OWNERS[0]} size="sm" />
                <div className="flex-1 flex gap-2">
                  <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." className="flex-1 text-[12px] px-2.5 py-1.5 rounded focus:outline-none" style={{ border: "1px solid #dde2ea", backgroundColor: "#f7f8fa", color: "#1a2234" }} />
                  <button className="flex items-center gap-1 px-2.5 text-[11px] font-semibold text-white rounded shrink-0" style={{ backgroundColor: "#1d3f73" }}><Send size={11} /> Post</button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {DETAIL_COMMENTS.map((c, i) => (
                <div key={i} className="flex gap-2.5">
                  <Avatar owner={c.owner} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-[12px] font-semibold" style={{ color: "#1a2234" }}>{c.who}</span><span className="text-[10px]" style={{ color: "#8c94a6" }}>{c.when}</span></div>
                    <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: "#3a4254" }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Attachments" action={<button className="flex items-center gap-1 text-[11px] font-medium" style={{ color: "#2558a6" }}><Paperclip size={11} /> Upload</button>}>
            <div className="space-y-1">
              {DETAIL_ATTACHMENTS.map(a => (
                <div key={a.name} className="flex items-center gap-2 py-1.5" style={{ borderBottom: "1px solid #f0f2f5" }}>
                  <FileText size={14} style={{ color: "#5c6478" }} className="shrink-0" />
                  <span className="flex-1 text-[12px] truncate" style={{ color: "#1a2234" }}>{a.name}</span>
                  <span className="text-[10px]" style={{ color: "#8c94a6" }}>{a.size}</span>
                  <span className="text-[10px]" style={{ color: "#8c94a6" }}>{a.by} · {a.date}</span>
                  <button className="p-0.5 rounded" style={{ color: "#8c94a6" }}><Download size={12} /></button>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Activity Log">
            <div className="space-y-3">
              {DETAIL_ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0f2f5" }}><Icon size={12} style={{ color: "#5c6478" }} /></div>
                    <div className="flex-1 min-w-0"><p className="text-[12px]" style={{ color: "#1a2234" }}>{a.text}</p><p className="text-[10px] mt-0.5" style={{ color: "#8c94a6" }}>{a.by} · {a.time}</p></div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Right metadata */}
        <div className="w-64 shrink-0 overflow-y-auto bg-white" style={{ borderLeft: "1px solid #e2e6eb" }}>
          <MetaField label="Project">{item.project || "NXP"} · Nexus Platform 2025</MetaField>
          <MetaField label="Owner"><div className="flex items-center gap-2"><Avatar owner={item.owner} size="xs" />{item.owner.name}</div></MetaField>
          <MetaField label="Reporter"><div className="flex items-center gap-2"><Avatar owner={OWNERS[3]} size="xs" />Priya Nair</div></MetaField>
          <MetaField label="Status"><StatusBadge status={item.status} /></MetaField>
          <MetaField label="Priority"><PriorityBadge priority={item.priority} /></MetaField>
          <MetaField label="Estimate">{item.planEstimate} pts</MetaField>
          <MetaField label="Sprint">{item.iteration}</MetaField>
          <MetaField label="Release">{item.release}</MetaField>
          <MetaField label="Parent">FE-311 · Enterprise Authentication Suite</MetaField>
          <MetaField label="Labels"><div className="flex flex-wrap gap-1">{item.tags.map(t => <span key={t} className="px-2 py-px text-[10px] font-medium rounded-sm" style={{ backgroundColor: "#f0f2f5", color: "#5c6478", border: "1px solid #dde2ea" }}>{t}</span>)}</div></MetaField>
          <MetaField label="Due Date">{item.dueDate || "—"}</MetaField>
          <MetaField label="Blocked">
            <button onClick={() => setBlocked(b => !b)} className="flex items-center gap-2">
              <span className="w-9 h-5 rounded-full relative transition-colors" style={{ backgroundColor: blocked ? "#dc2626" : "#cbd5e1" }}><span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: blocked ? 18 : 2 }} /></span>
              <span className="text-[11px]" style={{ color: blocked ? "#b91c1c" : "#8c94a6", fontWeight: blocked ? 600 : 400 }}>{blocked ? "Blocked" : "Not blocked"}</span>
            </button>
          </MetaField>
          <MetaField label="Watchers"><div className="flex items-center gap-1">{OWNERS.slice(0, 3).map(o => <Avatar key={o.name} owner={o} size="xs" />)}<span className="text-[10px] ml-1" style={{ color: "#8c94a6" }}>+2</span></div></MetaField>
        </div>
      </div>
    </div>
  );
}

