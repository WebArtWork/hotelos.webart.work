# Hotel OS — CRM Business Logic (Source of Truth)

This file is the **single source of truth for CRM business logic**: which pages exist, what
each page contains, and which roles can see what. It exists so that business-logic decisions
are made and reviewed in one readable place instead of being reverse-engineered from
component templates.

Last business-model review: 23 September 2026. First implementation pass against this revision
completed the same day (see "Implementation gaps" for what was verified and what remains).

## How to read this document

- **Intended rules** below define the product decisions to implement.
- **Page inventory** records the implementation described when this file was written. It is
  a reference, not permission to override the intended rules.
- **Implementation gaps** are reported discrepancies awaiting verification. Do not treat
  an old observation as proof that a defect still exists.
- Review CRM business logic in this file by default. Read application code only when asked
  to implement or verify a specific rule. Avoid generating a separate review document.

## Rules for humans and AI agents

1. **Read this file before reading page component code** when the task involves access rules,
   roles, permissions, or "who can see/do X".
2. **When business logic changes** (a new role, a page moves between roles, a section becomes
   restricted, etc.), **edit this file first**, then update the code (routes, `role.ts`,
   component gating) to match it. This file describes the intended behavior; the code should
   follow it, not the other way around.
3. Any code change that affects who can see or do something — routes, `ROLE_PAGES`,
   `ROLE_HOME`, capabilities, section gates, action guards, AI scope — must update this file in
   the same change: the page inventory row, and the gaps list (move items to resolved only after
   verification). Pure visual, copy or refactor changes don't need an update.
4. Record implementation gaps separately from product decisions. A specification edit does
   not mean the implementation is fixed. Mark a gap resolved only after verification.

## Roles

Defined in `src/app/shared/role.ts` (`Role` type, `ROLE_LABEL`). This is the one authoritative
role model for the logged-in user's own permissions.

| Role key       | Label (UI)                | Notes                                   |
| -------------- | -------------------------- | ---------------------------------------- |
| `owner`         | Власник                    | Business oversight and final authority; audit and last-owner safeguards still apply. |
| `manager`       | Менеджер                   | Daily operations across departments; no ownership/security administration. |
| `reception`     | Рецепція                   | Front-desk operations; no financial reporting/analytics. |
| `housekeeping`  | Прибирання                 | Assigned cleaning tasks; supervision is a separate capability. |
| `sales`         | Продажі / Маркетинг        | Availability, offers, assigned enquiries and aggregate marketing analytics; no guest payment ledger. |
| `accountant`    | Бухгалтер                  | Payments, reconciliation and read-only supporting booking/payer documents. |
| `maintenance`   | Технічне обслуговування    | Rooms/housekeeping only, no guest identity or pricing. |

In the static demo, role is stored client-side in `localStorage` (`hotelos_role`) and read via `getStoredRole()`.
`isPageAllowed(role, path)` and `defaultPageFor(role)` drive routing (`role.guard.ts`).
`defaultPageFor` reads the explicit `ROLE_HOME` map; login and denied-route fallback both use it.
Action authority is a separate `Capability` table in `role.ts`, checked with `can(role, cap)` /
`canCurrent(cap)`, never inferred from page access.

**Everyone with any role can open `/ai`.**

## Intended rules — take precedence over the page inventory

### People, roles and home screens

A role describes responsibility; a named employee owns work. “My tasks” must refer to a
specific demo employee, not everyone in that department. One person may hold multiple
capabilities in a small hotel. Keep the seven role presets; do not require separate accounts
for each responsibility.

| Role | Default home | First question it should answer |
| --- | --- | --- |
| Owner | Dashboard, business summary | Is the hotel healthy, and what needs my decision? |
| Manager | Dashboard, operational exceptions | What may disrupt today's service, and who is handling it? |
| Reception | Dashboard, current shift | Who arrives/leaves next, is the room ready, and what does the guest need? |
| Housekeeping | Housekeeping, My tasks | What should I clean next, and may I enter? |
| Sales | Sales, enquiries and performance | Who needs a follow-up, and where is demand coming from? |
| Accountant | Payments, reconciliation | Which amounts are unmatched, overdue or unexplained? |
| Maintenance | Repair queue within the existing Rooms/Housekeeping workspace | What is broken, how urgent is it, and when can I access it? |

Login and denied-route fallback must use the same explicit home mapping. A denied link
should explain the limitation and offer an allowed next step. Do not silently send staff to
the public landing page. Internal links must resolve to a usable page or contextual panel.

### Data visibility is separate from action authority

Opening a page does not grant every action on it. Apply the same rules to desktop/mobile,
dialogs, exports, notifications, search, AI answers, AI history and suggested prompts.

| Data or action | Default business rule |
| --- | --- |
| Guest bill, deposit and balance | Owner, Manager, Reception and Accountant; Reception needs these to serve a guest. |
| Hotel-wide financial reports and exports | Owner, Manager and Accountant. Reception sees individual bills and its shift totals, not hotel-wide revenue. |
| Sales analytics | Owner, Manager and Sales: aggregate booking value, channel performance and campaign results. Guest debts and payment/refund reconciliation remain excluded. |
| Sales contact and booking context | Assigned enquiries, relevant contact details, availability and approved quoted prices. No unrelated guest notes or payment ledger. |
| Cleaning/repair context | Room, occupancy/access window, DND, setup requirements, priority and relevant issue notes. No guest identity, contacts or finances by default. |
| Collect a payment | Owner, Manager, Reception and Accountant, against an identified booking/payer. |
| Refund or reassign a payment | Owner, Manager and Accountant with the explicit capability; Reception requests approval by default. Record reason and actor. |
| Change a booking | Owner, Manager and Reception within approved rates/policies. Sales may create offers/holds and convert assigned enquiries; changing unrelated bookings requires a separate grant. |
| Change prices or room inventory | Owner and authorized Manager. Maintenance can update technical condition, not pricing, room types or inventory structure. |
| Assign/inspect cleaning | Owner, Manager or an employee with housekeeping-supervisor capability. Cleaner starts/completes assigned tasks and reports blockers. |
| Complete a repair | Assigned technician; completion does not automatically release a room for sale. |
| Block/release a room | Owner or authorized Manager. Any worker can report an urgent issue and request a block; urgent requests need visible acknowledgement. |
| Guest export, merge or deletion | Separate capabilities, Owner/authorized Manager by default. Preserve linked booking/payment history; routine front-desk edits do not grant bulk export or deletion. |
| Manage staff | Owner; Manager may manage operational staff within granted authority and cannot grant privileges they do not possess. |
| Ownership, security and hotel deactivation | Owner only. Never remove the last active Owner, including through a role change. |

An unavailable action should offer “Request approval” when a worker legitimately needs it.
Show pending/approved/rejected, decision-maker and reason. Never require borrowing another
person's login. All consequential changes retain actor, time, reason and affected record.

### Daily workflows the prototype must demonstrate

These are intended acceptance criteria, not a claim that all flows already exist.

- **Owner:** understand today's position and next seven days, inspect an exception, see its
  responsible person and approve or delegate the next action. Keep this usable in 30 seconds
  on a phone; detailed reports remain one step away.
- **Manager:** identify an at-risk arrival, assign a cleaning/repair response, set a deadline,
  notify Reception and verify resolution. Carry unresolved work into an acknowledged shift
  handover rather than losing it in separate modules.
- **Reception:** open a booking, check readiness, collect the remaining balance, check in/out
  and record a guest promise. Handle early arrival, late checkout, room move and no-show with
  visible consequences. Access readiness/request context without needing the supervisor's
  full housekeeping board. Close the shift with collection totals and unresolved issues.
- **Housekeeping:** open My tasks, see access/DND and arrival deadline, start work, complete a
  checklist or report a blocker with notes/photo. Distinguish departure cleaning from an
  occupied-room service. Supervisor assigns and inspects; do not make every cleaner a supervisor.
- **Maintenance:** receive an issue with location, impact, assignee and access window; move it
  through reported → assigned → in progress → waiting for access/part → fixed → verified.
  Waiting needs a reason and ETA. Completion hands back to cleaning/inspection when necessary.
- **Sales:** record an enquiry/contact, dates and room requirements; prepare an approved
  quote or time-limited hold; record next follow-up; convert to booking or record lost reason.
  Assigned contact/conversation context may live in a scoped panel without opening all Guests
  or Messages. Keep campaign reporting alongside this work, not as a substitute for it.
- **Accountant:** open a transaction and read-only booking folio, see payer and document
  references, match a bank/acquirer receipt or flag a discrepancy, explain the balance and
  export the selected period. Distinguish future amounts due from overdue debt. Corrections
  retain history; closed periods require an explicit correction workflow.

### Shared operational definitions

- **Room state has separate dimensions:** occupancy, cleaning readiness and technical
  availability. “Vacant” does not mean clean; “cleaned” does not mean repaired. Sellable/ready
  requires every applicable condition. Occupancy comes from the stay, not a manual cleaning toggle.
- **Inspection is configurable:** a small hotel can allow cleaner completion to mark a room
  ready; a hotel requiring inspection uses cleaned → awaiting inspection → ready. An unresolved
  technical block prevents release in either mode.
- **A task has** an assignee, status, priority, deadline/access window, blocker and history.
  Guest-facing promises and cross-department requests need acknowledgement and closure.
- **A booking folio explains** charges, adjustments, payments, refunds and remaining balance.
  Payment reallocation corrects attribution; it is not a refund. Recording a transaction is
  distinct from matching its settlement.
- **Reports name their date basis and population.** Booking value, gross receipts, refunds,
  net receipts and outstanding balances are different measures. Do not label receipts profit.
  Channel and discovery source are separate dimensions; never add their shares together.
- **Reminders share history:** Reception, Accountant and automations can see the last contact
  and next planned reminder, avoiding duplicate requests to the same guest.
- **AI inherits the user's scope:** it may summarize allowed records and suggest allowed
  actions, but cannot reveal excluded data through chat history or broad questions. Sales may
  ask about room availability; that is different from private cleaning/repair details. Any
  consequential AI action follows the same confirmation/approval workflow as the normal UI.
- **One consistent demo hotel:** pages use the same demo date, bookings, room states, identities
  and balances. Dates and durations must remain plausible when switching roles.

### Scope discipline

Add housekeeping supervision as a capability first. Reservations agent, revenue manager,
night auditor and external contractor presets are later options when customer workflows
justify them. Do not add restaurant/spa operations or a full accounting ERP by default.
The static prototype should demonstrate the core journeys above without requiring integrations.

## Page access matrix — recorded implementation baseline

Source: `ROLE_PAGES` in `src/app/shared/role.ts`. ✅ = page is reachable for that role.
`—` = route is blocked by `roleGuard`; navigating there redirects to that role's home
(`ROLE_HOME`) with `?denied=<page>`, and the shell shows a notice explaining the limitation with
a link to the home page. Unknown routes (`**`) send a signed-in user to their home with
`?missing=<path>` instead of the public landing; signed-out visitors still go to the landing.

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

## Page inventory — recorded implementation baseline

For each page: purpose, its sections, and per-section access beyond the page-level gate above.
"Same as page" records the original page-level behavior, not blanket action authority.
Where this inventory conflicts with Intended rules, implementation must follow Intended rules.

### `dashboard` — Daily operations command center

One-sentence purpose: today's arrivals, occupancy, revenue, cleaning status, and quick actions
in one view.

| Section                                     | Extra access rule                          |
| -------------------------------------------- | -------------------------------------------- |
| KPI cards (arrivals, departures, occupancy, cleaning, outstanding payments) | Same as page |
| **Receipts KPI** | `financeReports` roles see hotel-wide "Надходження сьогодні"; `reception` sees "Зібрано за зміну" instead |
| Upcoming arrivals table                      | Same as page |
| "Needs attention" list                       | Same as page |
| Rooms summary + mini room list                | Same as page |
| New bookings list                             | Same as page |
| 7-day occupancy chart                         | Same as page |
| **Booking sources card**                      | **`salesAnalytics` only** — hidden for `reception` |
| AI insight panel                              | Same as page |
| Quick actions grid                            | Same as page |
| New-hotel empty-state / setup checklist        | Same as page (demo-only path) |

### `calendar` — Booking calendar / availability grid

Purpose: see room availability by date, manage bookings, move/extend stays, quick check-ins.

| Section                                      | Extra access rule |
| ---------------------------------------------- | -------------------- |
| Toolbar (date range, view length, search, filters) | Same as page |
| Legend + main grid (rooms × dates)              | Same as page |
| Hover preview card on booking blocks            | Same as page, **except** price/payment status only with `guestBill` |
| Mobile day/3-day cards                          | Same as page |
| Booking side panel: guest & stay info, source, notes, actions | Same as page |
| **Booking side panel: payment block ("Оплата") + "Додати оплату", unpaid badges** | **`guestBill` only** — hidden for `sales` |
| Quick-booking / conflict / move / message / payment / extend dialogs | Same as page |

### `guests` — Guest CRM

Purpose: list/search/segment all guests, view profiles, message/tag/manage individually or in bulk.

| Section                                | Extra access rule |
| ----------------------------------------- | -------------------- |
| KPI strip (total, new, repeat, returned) | Same as page |
| "Ask AI about guests" strip              | Same as page |
| Segment tabs (All/Staying/Upcoming/Regular/New/Away) | Same as page |
| Search/sort/filter toolbar                | Same as page |
| Bulk action bar (tag/message)             | Same as page |
| **Header export, bulk export, row "merge duplicates" and "delete"** | **`guestBulk` only** (owner, manager) — hidden and handler-guarded for `reception` |
| Guest table/cards + row menu (profile, booking, message, note) | Same as page |
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
| **Header "Типи номерів" / "+ Додати номер", panel "Редагувати"** | **`editInventory` only** (owner, manager) |
| **"Заблокувати номер" / "Редагувати блокування"** | **`blockRoom` only**; other roles get "Повідомити про проблему та запросити блокування" with a visible pending state |
| Change status dialog | Same as page |

### `payments` — Payments & financial tracking

Purpose: track payments received, outstanding balances, refunds, and reminders.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| KPI strip: received today, outstanding        | Same as page |
| **KPI strip: deposits, refunds; AI prompts about deposits/refunds** | **`financeReports` only** — hidden for `reception` |
| "Ask AI about payments" strip (other prompts) | Same as page |
| Outstanding balances cards (add payment, send reminder) | Same as page |
| **Monthly chart + daily-method breakdown**    | **`financeReports` only** — hidden for `reception` |
| **Export button**                             | **`financeReports` only** — hidden for `reception` |
| Status tabs + search/filter toolbar           | Same as page |
| Payments table/cards                          | Same as page |
| "Upcoming" (today/tomorrow/7-day) card         | Same as page |
| Payment side panel: amount/guest/booking/method/note | Same as page |
| **Payment side panel: refund / reassign** (status `success`) | **`refundPayment` only** (owner, manager, accountant). `reception` gets "Запросити погодження" buttons that show a pending state instead |
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
| Add task / report issue / complete dialogs     | Same as page |
| **Assign / distribute buttons and dialogs**    | **`assignCleaning` only** (owner, manager). Supervisor capability exists in Team but is not yet wired to the session |
| **"Позначити недоступним" (block room) follow-up dialog** | **`blockRoom` only**; other roles see "Запросити блокування" |
| **"Команда" link in header**                   | Shown only if current role can also open `/team` (`isPageAllowed(role, 'team')`) |

### `messages` — Guest messaging inbox

Purpose: unified inbox for guest conversations across channels, templates, AI-assisted replies.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| Conversation list (search/filter/sort)        | Same as page |
| Active conversation thread                    | Same as page |
| Composer (channel, templates, attach, AI suggestions) | Same as page |
| Context side panel (guest info, booking info, incl. payment balance) | Same as page — intended: every role that opens Messages holds `guestBill` |
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

Currently reachable only by `owner`/`manager`. Editing rules, enabling message sending and
reviewing history may have different action permissions without changing page access.

### `sales` — Marketing / channel analytics

Purpose: where bookings/revenue come from, direct vs. OTA, campaigns, repeat-guest sourcing.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| Header controls, discovery-source banner       | Same as page |
| **KPI "Отримано оплат" (gross receipts)**      | **`financeReports` only**; `sales` sees "Вартість бронювань" (booking value) instead |
| KPI strip (bookings, avg ticket, direct share)  | Same as page |
| Top sources, AI quick-questions card           | Same as page |
| Channel/discovery bar charts, revenue-by-channel | Same as page |
| Full sources table + manage/add source          | Same as page |
| Direct vs OTA breakdown, trend charts           | Same as page |
| "Cost of bookings" card: gross/adjusted booking value | Same as page |
| **"Cost of bookings" card: received, outstanding, refunds explanation** | **`financeReports` only** — `sales` sees an aggregate-value note instead |
| New vs repeat guests, campaigns cards           | Same as page |
| Source detail side panel, manage/add source dialogs | Same as page |

### `ai` — AI assistant

Purpose: conversational assistant answering questions about live operational/guest/financial
data, with links to relevant pages. This is the only page every role can open.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| Chat history sidebar (seeded conversations)   | Filtered by the role's scope — a conversation is hidden if its text touches an excluded topic |
| Morning-brief card                            | Only roles holding both `guestBill` and operational detail (owner, manager, reception) |
| Welcome suggestions + insights row             | Filtered by scope; an insight also needs its linked page to be allowed |
| Composer                                       | Same as page |
| **Chat answers**                               | Refused per topic (see below); generated answers are re-checked against scope before display |

AI scope topics (`TOPIC_PATTERNS` / `topicAllowed` in `ai.component.ts`):

| Topic | Allowed roles |
| --- | --- |
| Guest bills, balances, deposits, refunds, reminders | `guestBill` holders (owner, manager, reception, accountant) |
| Hotel-wide revenue/receipts | `financeReports` or `salesAnalytics` holders (owner, manager, accountant, sales) |
| Cleaning/repair/complaint detail | everyone except `sales` and `accountant`; room availability is a separate question and stays open to `sales` |
| Prices | everyone except `housekeeping` and `maintenance` |

Detection is keyword-based over Ukrainian text; it is a demo approximation, not a data-level filter.

### `team` — Staff directory & access management

Purpose: staff directory; invite/manage employees, assign roles, control per-employee
permissions/notifications. **Manages other employees' roles — distinct from the viewer's own
role above.** Uses the shared 7-role model; demo staff include one named person per role.

| Section                                   | Extra access rule |
| --------------------------------------------- | -------------------- |
| KPI strip, search/filters (incl. sales/accountant/maintenance segments), staff table/cards | Same as page |
| Employee profile side panel (contacts, stats, notifications, activity log, security) | Same as page |
| **Edit / change role / deactivate / reactivate / permission toggles** | Owner: any employee. Manager: operational staff only — not Owners or other Managers ("Керувати цим працівником може лише Власник") |
| **Deactivate and change role**                 | Disabled when target employee `isLastOwner`; also enforced in the handlers |
| Add employee / change role options             | Owner: every role except Owner. Manager: reception, housekeeping, sales, accountant, maintenance (cannot grant Manager) |
| Per-role permission toggles                    | manager: refund/team/settings; reception: cancel bookings; housekeeping: supervisor; sales: change bookings outside own enquiries; accountant: refund/reassign |
| Role-access matrix dialog                      | Read-only, generated from `ROLE_PAGES` for all 7 roles |

Team permission toggles are recorded per employee but are **not yet connected to the logged-in
session** (the session only knows a role preset). See Implementation gaps.

### `settings` — Hotel configuration

Purpose: property info, booking/payment/cancellation rules, direct-booking page, messaging/
automation defaults, notifications, AI configuration, account/security/danger-zone.

13 tabs: General, Contacts & location, Check-in/out, Booking rules, Payments, Policies, Booking
Page, Messages, Automations (link out), Notifications, Booking sources, AI (+ knowledge-base
upload), Security (numbering, legal/company data, data export, change history, danger zone).

| Access rule                                     | Applies to |
| -------------------------------------------------- | ------------ |
| Session role                                    | `getStoredRole()`; the in-page demo role selector was removed |
| **Owner-only sections** (locked/read-only banner for everyone else) | Payments, Policies (`rules`), AI, Security — `OWNER_ONLY = ['payments','rules','ai','security']` |
| **Editors**                                      | `owner`, `manager` (`EDITOR_ROLES`); any other role would see every section read-only |
| Danger zone (deactivate Booking Page / deactivate hotel) | Nested inside Security tab → owner-only by inheritance |

## Implementation gaps — verify before marking resolved

### Resolved and verified on 23 September 2026

Verified with a clean `ng build` and in the running app by switching roles:

- `settings` locking now uses the session role; demo selector removed.
- `team` and `settings` use the shared 7-role model; Team matrix is generated from `ROLE_PAGES`.
- Housekeeping block-room follow-up is enforced (`blockRoom`); others can request a block.
- `sales` no longer sees gross receipts, outstanding balances or refund reconciliation.
- `guests` export, merge and delete require `guestBulk` (owner, manager).
- Login and denied-route fallback share `ROLE_HOME` (Sales now lands on Sales, not Calendar);
  denied routes show a notice with an allowed next step; unknown routes no longer drop staff
  on the public landing.
- Reception sees shift receipts, not hotel-wide receipts, deposits or refunds; refund/reassign
  becomes "Request approval" with a visible pending state.
- Rooms pricing/inventory edits and room blocks require `editInventory` / `blockRoom`.
- AI history, suggestions, insights, morning brief and answers follow the role's scope.

### Still open

1. **Section-level gates are computed once at component construction**, not reactively. Harmless
   today because role changes always go through login navigation, but would break if a role
   could change in place.
2. **Approval requests are local UI state only**: no decision-maker, reason, approve/reject
   step or shared queue yet. Same for room-block requests and their acknowledgement.
3. **Team permission toggles are not connected to the session.** The session knows a role
   preset, not a named employee; the housekeeping-supervisor capability therefore cannot yet
   let a supervisor assign cleaning.
4. **Named-person "My tasks"** is not implemented: housekeeping and maintenance still see the
   whole board rather than tasks assigned to a specific demo employee.
5. **Workflows from "Daily workflows the prototype must demonstrate" are not built**: repair
   queue statuses, sales enquiry → quote/hold → follow-up → conversion, accounting
   reconciliation/matching, shift handover, owner approve/delegate.
6. **Room state is not yet split** into occupancy / cleaning readiness / technical availability,
   and inspection mode is not configurable.
7. **Maintenance home** is Rooms; a dedicated repair queue inside Rooms/Housekeeping is still
   to be designed.
8. **Unrouted detail links** (`/booking/`, `/guest/`, `/new-booking/`, `/book/`, `/search/`,
   `/notifications/`, `/profile/`) are plain `href`s; they now land on the role's home with a
   "not available in demo" notice rather than a contextual panel.
9. **Shared demo data consistency** (same bookings, balances and room states on every page)
   has not been verified.
10. **AI scope detection is keyword-based**; it can over- or under-block unusual phrasing.

Found while rewriting the Gemini Gem knowledge on 23 September 2026 (code read, not yet fixed):

11. **Calendar: `sales` can move and cancel any booking.** Intended: Sales changes only its
    own offers/holds unless granted. "Скасувати бронювання" also has no confirmation step.
12. **Rooms: "Призначити прибирання" is not gated** (any role that opens Rooms can use it,
    and it always assigns the same demo person). Intended: `assignCleaning` only.
13. **Housekeeping: "+ Додати задачу" lets any role pick an assignee.** Intended: assigning is
    `assignCleaning` only; others create an unassigned task.
14. **Housekeeping: occupied room cards show guest names** to `housekeeping` and
    `maintenance`. Intended: no guest identity for cleaning/repair roles.
15. **Sales: "Експорт" is shown to the `sales` role**, and "Середній чек" is computed from
    received payments. Decide whether a sales-scoped export and a booking-value average are
    intended; hotel-wide financial exports are finance-roles only.
16. **Payments: method names are inconsistent** between the add-payment form ("Карта",
    "Онлайн") and filters ("Картка на місці", "Оплата онлайн").
17. **Calendar mobile cards show payment status to `sales`** — the `showFinance` gate is
    applied on desktop blocks, hover card and side panel, but not on the mobile day cards.

## Where implementation lives (for implementers)

- Roles, labels, page allowlist: `src/app/shared/role.ts`
- Route guard: `src/app/shared/role.guard.ts`
- Route declarations: `src/app/app.routes.ts`
- Server-rendering mode per route (protected pages are client-only, not prerendered):
  `src/app/app.routes.server.ts`
- Each page's own gating flags/checks live inside that page's component
  (`src/app/pages/<name>/<name>.component.ts`), typically as a boolean computed once from
  `getStoredRole()`.
