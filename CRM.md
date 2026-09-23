# Hotel OS — CRM Business Logic (Source of Truth)

This file is the **single source of truth for CRM business logic**: which pages exist, what
each page contains, and which roles can see what. It exists so that business-logic decisions
are made and reviewed in one readable place instead of being reverse-engineered from
component templates.

## Rules for humans and AI agents

1. **Read this file before reading page component code** when the task involves access rules,
   roles, permissions, or "who can see/do X".
2. **When business logic changes** (a new role, a page moves between roles, a section becomes
   restricted, etc.), **edit this file first**, then update the code (routes, `role.ts`,
   component gating) to match it. This file describes the intended behavior; the code should
   follow it, not the other way around.
3. Keep this file in sync with the code. If you change access rules in code without a clear
   spec reason, update this file in the same change.
4. Everything in the "Known inconsistencies" section at the bottom is current real behavior
   that does **not** yet match the intended model above it. Do not silently "fix" those by
   copying code into this spec — resolve them deliberately (decide correct behavior, update
   both this file and the code, then remove the entry).

## Roles

Defined in `src/app/shared/role.ts` (`Role` type, `ROLE_LABEL`). This is the one authoritative
role model for the logged-in user's own permissions.

| Role key       | Label (UI)                | Notes                                   |
| -------------- | -------------------------- | ---------------------------------------- |
| `owner`         | Власник                    | Full access to every page and section.   |
| `manager`       | Менеджер                   | Same page access as owner.               |
| `reception`     | Рецепція                   | Front-desk operations; no financial reporting/analytics. |
| `housekeeping`  | Прибирання                 | Cleaning operations only.                |
| `sales`         | Продажі / Маркетинг        | Bookings/marketing analytics; no guest financials or cleaning ops. |
| `accountant`    | Бухгалтер                  | Payments only.                           |
| `maintenance`   | Технічне обслуговування    | Rooms/housekeeping only, no guest identity or pricing. |

Role is stored client-side in `localStorage` (`hotelos_role`) and read via `getStoredRole()`.
`isPageAllowed(role, path)` and `defaultPageFor(role)` drive routing (`role.guard.ts`).

**Everyone with any role can open `/ai`.**

## Page access matrix

Source: `ROLE_PAGES` in `src/app/shared/role.ts`. ✅ = page is reachable for that role.
`—` = route is blocked by `roleGuard`; navigating there redirects to that role's default page
(`defaultPageFor`, the first page in its list).

| Page (route)     | owner | manager | reception | housekeeping | sales | accountant | maintenance |
| ----------------- | :---: | :-----: | :-------: | :----------: | :---: | :--------: | :---------: |
| `dashboard`        |  ✅   |   ✅    |    ✅     |      —       |   —   |     —      |      —      |
| `calendar`         |  ✅   |   ✅    |    ✅     |      —       |  ✅   |     —      |      —      |
| `guests`           |  ✅   |   ✅    |    ✅     |      —       |   —   |     —      |      —      |
| `rooms`            |  ✅   |   ✅    |    ✅     |      —       |   —   |     —      |     ✅      |
| `payments`         |  ✅   |   ✅    |    ✅     |      —       |   —   |    ✅      |      —      |
| `housekeeping`     |  ✅   |   ✅    |    —      |     ✅       |   —   |     —      |     ✅      |
| `messages`         |  ✅   |   ✅    |    ✅     |      —       |   —   |     —      |      —      |
| `automations`      |  ✅   |   ✅    |    —      |      —       |   —   |     —      |      —      |
| `sales`            |  ✅   |   ✅    |    —      |      —       |  ✅   |     —      |      —      |
| `ai`               |  ✅   |   ✅    |    ✅     |     ✅       |  ✅   |    ✅      |     ✅      |
| `team`             |  ✅   |   ✅    |    —      |      —       |   —   |     —      |      —      |
| `settings`         |  ✅   |   ✅    |    —      |      —       |   —   |     —      |      —      |

## Pages and their sections

For each page: purpose, its sections, and per-section access beyond the page-level gate above.
"Same as page" means: no extra restriction — any role that can open the page sees this section.

### `dashboard` — Daily operations command center

One-sentence purpose: today's arrivals, occupancy, revenue, cleaning status, and quick actions
in one view.

| Section                                     | Extra access rule                          |
| -------------------------------------------- | -------------------------------------------- |
| KPI cards (arrivals, departures, occupancy, cleaning, payments, revenue) | Same as page |
| Upcoming arrivals table                      | Same as page |
| "Needs attention" list                       | Same as page |
| Rooms summary + mini room list                | Same as page |
| New bookings list                             | Same as page |
| 7-day occupancy chart                         | Same as page |
| **Booking sources card**                      | **Hidden for `reception`** (`showSalesCard = role !== 'reception'`) |
| AI insight panel                              | Same as page |
| Quick actions grid                            | Same as page |
| New-hotel empty-state / setup checklist        | Same as page (demo-only path) |

### `calendar` — Booking calendar / availability grid

Purpose: see room availability by date, manage bookings, move/extend stays, quick check-ins.

| Section                                      | Extra access rule |
| ---------------------------------------------- | -------------------- |
| Toolbar (date range, view length, search, filters) | Same as page |
| Legend + main grid (rooms × dates)              | Same as page |
| Hover preview card on booking blocks            | Same as page, **except** price/payment status shown only when finance is visible |
| Mobile day/3-day cards                          | Same as page |
| Booking side panel: guest & stay info, source, notes, actions | Same as page |
| **Booking side panel: payment block ("Оплата") + "Додати оплату"** | **Hidden for `sales`** (`showFinance = role !== 'sales'`) |
| Quick-booking / conflict / move / message / payment / extend dialogs | Same as page |

### `guests` — Guest CRM

Purpose: list/search/segment all guests, view profiles, message/tag/manage individually or in bulk.

| Section                                | Extra access rule |
| ----------------------------------------- | -------------------- |
| KPI strip (total, new, repeat, returned) | Same as page |
| "Ask AI about guests" strip              | Same as page |
| Segment tabs (All/Staying/Upcoming/Regular/New/Away) | Same as page |
| Search/sort/filter toolbar                | Same as page |
| Bulk action bar (tag/message/export)      | Same as page |
| Guest table/cards + row menu (profile, booking, message, note, merge, delete) | Same as page — no role gating on the destructive **delete** action; flagged for review |
| Guest preview/add/edit/message/note/delete/bulk dialogs | Same as page |

### `rooms` — Room inventory & pricing

Purpose: manage room types, pricing, live status, and per-room configuration.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| KPI strip (total/occupied/free/needs cleaning/unavailable) | Same as page |
| "Ask AI about rooms" strip                  | Same as page |
| Segment chips, view toggle, search/filters   | Same as page |
| Room cards/list: type, floor, capacity, amenities, cleaning/maintenance status | Same as page |
| **Room cards/list: price line, current guest name, quick-book/open-booking actions** | **Hidden for `maintenance`** (`showGuestAndFinance = role !== 'maintenance'`) |
| **Room detail panel: pricing, current stay/next booking, "+ New booking"** | **Hidden for `maintenance`** |
| Add room / room types / block room / change status / edit dialogs | Same as page |

### `payments` — Payments & financial tracking

Purpose: track payments received, outstanding balances, refunds, and reminders.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| KPI strip (received, outstanding, deposits, refunds) | Same as page |
| "Ask AI about payments" strip                | Same as page |
| Outstanding balances cards (add payment, send reminder) | Same as page |
| **Monthly chart + daily-method breakdown**    | **Hidden for `reception`** (`showReports = role !== 'reception'`) |
| **Export button**                             | **Hidden for `reception`** |
| Status tabs + search/filter toolbar           | Same as page |
| Payments table/cards                          | Same as page |
| "Upcoming" (today/tomorrow/7-day) card         | Same as page |
| Payment side panel: amount/guest/booking/method/note/reassign/refund | Same as page (reassign/refund only shown when payment status is `success`, not role-gated) |
| Add payment / refund / reassign / note / reminder dialogs | Same as page |

### `housekeeping` — Cleaning operations

Purpose: coordinate which rooms need cleaning, assignment, priority, and task completion.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| KPI strip (needs cleaning/cleaning/ready/occupied) | Same as page |
| "Ask AI about housekeeping" strip             | Same as page |
| Alerts strip (not-ready-soon, unassigned urgent, long-running, distribute) | Same as page |
| Toolbar (today/tomorrow/all tabs, board/list, sort, filters) | Same as page |
| Board / list of rooms-as-tasks                | Same as page |
| "Team today" stats cards                      | Same as page |
| Room detail side panel (notes, start/complete/report issue/checklist/history) | Same as page |
| Assign / add task / report issue / complete / distribute dialogs | Same as page |
| **"Позначити недоступним" (block room) follow-up dialog** | **Intended for Manager/Owner only per UI copy, but not enforced in code today** — see Known inconsistencies |
| **"Команда" link in header**                   | Shown only if current role can also open `/team` (`isPageAllowed(role, 'team')`) |

### `messages` — Guest messaging inbox

Purpose: unified inbox for guest conversations across channels, templates, AI-assisted replies.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| Conversation list (search/filter/sort)        | Same as page |
| Active conversation thread                    | Same as page |
| Composer (channel, templates, attach, AI suggestions) | Same as page |
| Context side panel (guest info, booking info, incl. payment balance) | Same as page — **no role restriction on financial balance shown here today**; see Known inconsistencies |
| Templates library + creation dialog            | Same as page |
| New message / conversation menu / edit-scheduled dialogs | Same as page |

### `automations` — Automated guest communication rules

Purpose: configure/monitor rules that auto-message guests on booking events.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| KPI strip (active/executed/scheduled/failures) | Same as page |
| Tabs: Active / Disabled / Templates / History  | Same as page |
| Automation cards, templates gallery, history log, upcoming runs | Same as page |
| Automation detail side panel                   | Same as page |
| "Create via AI" + step-by-step wizard dialogs  | Same as page |

Currently reachable only by `owner`/`manager`, so no internal role gating exists — do not add
finer-grained restriction here unless the page access matrix above changes first.

### `sales` — Marketing / channel analytics

Purpose: where bookings/revenue come from, direct vs. OTA, campaigns, repeat-guest sourcing.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| Header controls, KPI strip, discovery-source banner | Same as page |
| Top sources, AI quick-questions card           | Same as page |
| Channel/discovery bar charts, revenue-by-channel | Same as page |
| Full sources table + manage/add source          | Same as page |
| Direct vs OTA breakdown, trend charts           | Same as page |
| **"Cost of bookings" financial reconciliation card, avg ticket, refunds/adjustments figures** | Same as page today — **`sales` role currently sees full financial reconciliation data**; see Known inconsistencies for whether that's intended |
| New vs repeat guests, campaigns cards           | Same as page |
| Source detail side panel, manage/add source dialogs | Same as page |

### `ai` — AI assistant

Purpose: conversational assistant answering questions about live operational/guest/financial
data, with links to relevant pages. This is the only page every role can open.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| Chat history sidebar                          | Same as page |
| Morning-brief card                            | Same as page |
| Welcome/suggestions + insights row             | Same as page |
| Composer                                       | Same as page |
| **Chat answers — financial questions**         | **Refused for `housekeeping` and `maintenance`** ("your role doesn't have access to financial data") |
| **Chat answers — housekeeping/room/maintenance questions** | **Refused for `sales`** ("your role doesn't have access to housekeeping data") |

This is the only page where restriction happens at the **answer-content level** (inside the
answer engine, keyed on role), not by hiding a UI section. All other Q&A content (guest data,
sales stats, etc.) is otherwise unrestricted for any role that can reach this page.

### `team` — Staff directory & access management

Purpose: staff directory; invite/manage employees, assign roles, control per-employee
permissions/notifications. **Manages other employees' roles — distinct from the viewer's own
role above.**

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| KPI strip, search/filters, staff table/cards    | Same as page |
| Employee profile side panel (contacts, stats, permission toggles, notifications, activity log, security) | Same as page |
| **Deactivate access action**                    | Disabled when target employee `isLastOwner` (cannot deactivate the sole remaining owner) |
| Add employee dialog                            | Role limited to `manager` / `reception` / `housekeeping` — **Owner cannot be assigned through this form** |
| Change role dialog                             | `ASSIGNABLE_ROLES = ['manager', 'reception', 'housekeeping']` only |
| Role-access matrix dialog                      | Read-only reference table of page access by role |

**Known model gap:** this page's own employee-role model is `owner | manager | reception |
housekeeping` (4 roles) — narrower than the 7-role app-wide model in `shared/role.ts` (missing
`sales`, `accountant`, `maintenance`). See Known inconsistencies.

### `settings` — Hotel configuration

Purpose: property info, booking/payment/cancellation rules, direct-booking page, messaging/
automation defaults, notifications, AI configuration, account/security/danger-zone.

13 tabs: General, Contacts & location, Check-in/out, Booking rules, Payments, Policies, Booking
Page, Messages, Automations (link out), Notifications, Booking sources, AI (+ knowledge-base
upload), Security (numbering, legal/company data, data export, change history, danger zone).

| Access rule                                     | Applies to |
| -------------------------------------------------- | ------------ |
| **Owner-only sections** (locked/read-only banner for everyone else) | Payments, Policies (`rules`), AI, Security — `OWNER_ONLY = ['payments','rules','ai','security']` |
| **Fully read-only role** (every section locked, no edits at all) | `reception`, `housekeeping` — `READONLY_ROLES` |
| Danger zone (deactivate Booking Page / deactivate hotel) | Nested inside Security tab → owner-only by inheritance |

**Known model gap:** this page reads its own **local demo role selector**
(`role = signal<Role>('owner')`, switchable via an in-page dropdown), not the real session
role from `getStoredRole()`. Its local `Role` type is also the narrower 4-role set. See Known
inconsistencies — this needs to be wired to the real session role before the locking is
actually enforced for real users.

## Known inconsistencies (current code vs. this spec)

These are real gaps between actual behavior and a clean role model. Do not "fix" them by just
editing this file to match the code — decide the intended behavior, update the code, then
update this file to describe the corrected state and remove the entry.

1. **`settings` locking is not tied to the real session role.** It uses a local demo dropdown
   (`role = signal<Role>('owner')`), not `getStoredRole()`. As shipped, any real user sees the
   page as if they were `owner` unless they manually flip the in-page demo selector.
2. **`team` and `settings` use a 4-role model** (`owner | manager | reception | housekeeping`)
   for internal business logic (assignable roles, access matrix, section locks) that doesn't
   include `sales`, `accountant`, or `maintenance` from the real 7-role model in
   `shared/role.ts`.
3. **`housekeeping`'s "block room unavailable" follow-up dialog** claims in UI copy that it is
   "available only to Manager/Owner" but has no actual role check gating it.
4. **`guests`, `messages`, `automations`, `sales` pages have no internal section gating** —
   every role that can open them sees 100% identical content. In particular:
   - `messages`' context panel shows guest payment balance to every role that can open
     Messages (owner, manager, reception) — no restriction today.
   - `sales` shows full financial reconciliation ("cost of bookings", avg ticket, refunds) to
     the `sales` role, not just channel/marketing analytics.
5. **Section-level gates are computed once at component construction**, not reactively — if a
   role changes without a full page reload, gated sections won't update until navigation.
6. **`guests`' row-level "Delete" action** has no destructive-action role gate beyond the
   page-level guard.

## Where the real logic lives (for implementers)

- Roles, labels, page allowlist: `src/app/shared/role.ts`
- Route guard: `src/app/shared/role.guard.ts`
- Route declarations: `src/app/app.routes.ts`
- Server-rendering mode per route (protected pages are client-only, not prerendered):
  `src/app/app.routes.server.ts`
- Each page's own gating flags/checks live inside that page's component
  (`src/app/pages/<name>/<name>.component.ts`), typically as a boolean computed once from
  `getStoredRole()`.
