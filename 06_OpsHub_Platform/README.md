# OpsHub — Employee & Asset Operations Platform

> Working product name: **OpsHub** (placeholder — change anytime).
> An internal portal that unifies IT Security Ops, IT Asset/Service Ops, and HR/Workforce
> on one shared foundation. Consumes Intune / Entra / Defender — does **not** replace them.

---

## Documents

| File | Purpose |
|------|---------|
| [00_PRODUCT_OVERVIEW.md](00_PRODUCT_OVERVIEW.md) | Vision, problem, scope, what it manages |
| [01_CAPABILITY_MAP.md](01_CAPABILITY_MAP.md) | Full module + feature breakdown |
| [02_ARCHITECTURE_DECISION.md](02_ARCHITECTURE_DECISION.md) | Split vs all-in-one decision + tech stack |
| [03_ROADMAP.md](03_ROADMAP.md) | Phased delivery plan |
| [04_TECH_STACK_AND_PATTERNS.md](04_TECH_STACK_AND_PATTERNS.md) | Best 2026 tech stack, architecture, design patterns |
| [05_ENDPOINT_DATA_FLOW.md](05_ENDPOINT_DATA_FLOW.md) | How laptop agents track/audit and connect to OpsHub |
| **Build phase (grounded in the live `opshub-api` codebase)** | |
| [06_GAP_ANALYSIS.md](06_GAP_ANALYSIS.md) | What exists today vs what's missing; recommended build sequence |
| [07_AUTHORIZATION_DESIGN.md](07_AUTHORIZATION_DESIGN.md) | RBAC → permissions + scopes + SoD + delegation + access reviews |
| [08_PLATFORM_INTEGRATION.md](08_PLATFORM_INTEGRATION.md) | How modules compose; the universal Request engine (central reuse) |
| [09_UIUX_DESIGN.md](09_UIUX_DESIGN.md) | One portal, role-aware IA, reusable UI primitives, key screens |
| [10_ENGINEERING_PLAYBOOK.md](10_ENGINEERING_PLAYBOOK.md) | DRY, resilience, memory-leak, performance, scaling rules + PR checklist |

---

## One-line summary

A single pane of glass to manage **people, devices, software, access, and time** —
with a reusable approval-and-audit engine at its core, grounded in 2026 ITAM/ITSM
trends (ITAM+ITSM convergence, single source of truth, guard-railed AI, FinOps,
compliance-as-obligation).

## Core principle

> **Don't rebuild MDM/EDR/IdP. Build the orchestration, visibility, and workflow
> layer on top of the APIs they already expose.**
