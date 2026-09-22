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

export function isPageAllowed(role: Role, path: string): boolean {
	return ROLE_PAGES[role].includes(path);
}

export function defaultPageFor(role: Role): string {
	return ROLE_PAGES[role][0];
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
