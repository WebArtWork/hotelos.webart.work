export type Role = 'reception' | 'manager' | 'housekeeping' | 'owner' | 'sales' | 'accountant' | 'maintenance';

export const ROLE_LABEL: Record<Role, string> = {
	owner: 'Власник',
	manager: 'Менеджер',
	reception: 'Рецепція',
	housekeeping: 'Прибирання',
	sales: 'Продажі / Маркетинг',
	accountant: 'Бухгалтер',
	maintenance: 'Технічне обслуговування',
};

/** Route paths (as declared in app.routes.ts, without the leading slash) each role may open. `ai` is available to everyone. */
export const ROLE_PAGES: Record<Role, string[]> = {
	owner: ['dashboard', 'calendar', 'guests', 'rooms', 'payments', 'housekeeping', 'messages', 'automations', 'sales', 'ai', 'team', 'settings'],
	manager: ['dashboard', 'calendar', 'guests', 'rooms', 'payments', 'housekeeping', 'messages', 'automations', 'sales', 'ai', 'team', 'settings'],
	reception: ['dashboard', 'calendar', 'guests', 'rooms', 'payments', 'messages', 'ai'],
	housekeeping: ['housekeeping', 'ai'],
	sales: ['calendar', 'sales', 'ai'],
	accountant: ['payments', 'ai'],
	maintenance: ['rooms', 'housekeeping', 'ai'],
};

/** Explicit home screen per role (CRM.md → People, roles and home screens). Used by login and denied-route fallback. */
export const ROLE_HOME: Record<Role, string> = {
	owner: 'dashboard',
	manager: 'dashboard',
	reception: 'dashboard',
	housekeeping: 'housekeeping',
	sales: 'sales',
	accountant: 'payments',
	maintenance: 'rooms',
};

export const PAGE_LABEL: Record<string, string> = {
	dashboard: 'Огляд',
	calendar: 'Календар',
	guests: 'Гості',
	rooms: 'Номери',
	payments: 'Оплати',
	housekeeping: 'Прибирання',
	messages: 'Повідомлення',
	automations: 'Автоматизації',
	sales: 'Продажі',
	ai: 'AI-помічник',
	team: 'Команда',
	settings: 'Налаштування',
};

export function isPageAllowed(role: Role, path: string): boolean {
	return ROLE_PAGES[role].includes(path);
}

export function defaultPageFor(role: Role): string {
	return ROLE_HOME[role];
}

/** Action authority, separate from page visibility (CRM.md → Data visibility is separate from action authority). */
export type Capability =
	| 'guestBill'
	| 'financeReports'
	| 'salesAnalytics'
	| 'collectPayment'
	| 'refundPayment'
	| 'changeBooking'
	| 'editInventory'
	| 'blockRoom'
	| 'assignCleaning'
	| 'guestBulk'
	| 'manageTeam';

const CAPABILITIES: Record<Capability, Role[]> = {
	guestBill: ['owner', 'manager', 'reception', 'accountant'],
	financeReports: ['owner', 'manager', 'accountant'],
	salesAnalytics: ['owner', 'manager', 'sales'],
	collectPayment: ['owner', 'manager', 'reception', 'accountant'],
	refundPayment: ['owner', 'manager', 'accountant'],
	changeBooking: ['owner', 'manager', 'reception'],
	editInventory: ['owner', 'manager'],
	blockRoom: ['owner', 'manager'],
	assignCleaning: ['owner', 'manager'],
	guestBulk: ['owner', 'manager'],
	manageTeam: ['owner', 'manager'],
};

export function can(role: Role | null, capability: Capability): boolean {
	return !!role && CAPABILITIES[capability].includes(role);
}

/** Capability check for the current session role. */
export function canCurrent(capability: Capability): boolean {
	return can(getStoredRole(), capability);
}

const ROLE_KEY = 'hotelos_role';

export function getStoredRole(): Role | null {
	try {
		const stored = localStorage.getItem(ROLE_KEY);
		return stored && stored in ROLE_LABEL ? (stored as Role) : null;
	} catch {
		return null;
	}
}

export function setStoredRole(role: Role): void {
	try {
		localStorage.setItem(ROLE_KEY, role);
	} catch {
		/* ignore storage errors (private mode, etc.) */
	}
}

export function clearStoredRole(): void {
	try {
		localStorage.removeItem(ROLE_KEY);
	} catch {
		/* ignore storage errors (private mode, etc.) */
	}
}
