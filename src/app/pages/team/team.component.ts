import { Component, computed, ElementRef, effect, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppShellComponent } from '../../layouts/app-shell/app-shell.component';
import { IconComponent } from '../../shared/icon/icon.component';

type Role = 'owner' | 'manager' | 'reception' | 'housekeeping';
type Status = 'active' | 'invited' | 'deactivated';
type Segment = 'all' | Role | 'inactive';

interface ActivityItem {
	time: string;
	text: string;
}

interface TaskStats {
	done: number;
	inProgress: number;
	remaining: number;
}

interface TodayStats {
	bookings: number;
	checkins: number;
	payments: number;
}

interface Employee {
	id: number;
	first: string;
	last: string;
	email: string;
	phone: string;
	role: Role;
	status: Status;
	joined?: string;
	invitedOn?: string;
	lastActivity: string;
	online: boolean;
	shift?: string;
	activity?: ActivityItem[];
	perms: Record<string, boolean>;
	notif?: Record<string, boolean>;
	todayStats?: TodayStats;
	tasks?: TaskStats;
}

interface RoleInfo {
	label: string;
	desc: string;
	access: string[];
	optional?: string[];
}

interface InviteData {
	first: string;
	last: string;
	email: string;
	phone: string;
	role: Role;
}

type DialogView =
	| { kind: 'add-employee' }
	| { kind: 'invite-preview'; data: InviteData }
	| { kind: 'invite-sent'; data: InviteData }
	| { kind: 'role-matrix' }
	| { kind: 'change-role'; id: number }
	| { kind: 'edit'; id: number }
	| { kind: 'deactivate'; id: number }
	| null;

const ROLES: Record<Role, RoleInfo> = {
	owner: {
		label: 'Власник',
		desc: 'Повний доступ до Hotel OS та управління готелем.',
		access: [
			'Dashboard',
			'Calendar',
			'Бронювання',
			'Гості',
			'Номери',
			'Оплати',
			'Прибирання',
			'Повідомлення',
			'Автоматизації',
			'Продажі',
			'AI',
			'Команда',
			'Налаштування',
			'Дані та експорт',
		],
	},
	manager: {
		label: 'Менеджер',
		desc: 'Керує щоденною роботою готелю та персоналом.',
		access: [
			'Dashboard',
			'Calendar',
			'Бронювання',
			'Гості',
			'Номери',
			'Оплати',
			'Прибирання',
			'Повідомлення',
			'Автоматизації',
			'Продажі',
			'AI',
		],
		optional: ['Команда', 'Налаштування'],
	},
	reception: {
		label: 'Рецепція',
		desc: 'Працює з гостями, бронюваннями, заселенням та оплатами.',
		access: ['Dashboard', 'Calendar', 'Бронювання', 'Гості', 'Номери', 'Оплати', 'Повідомлення', 'AI (операційне)'],
	},
	housekeeping: {
		label: 'Прибирання',
		desc: 'Бачить лише інформацію, необхідну для підготовки номерів.',
		access: ['Мої задачі', 'Прибирання', 'базова інформація про номери'],
	},
};

const MATRIX: [string, string][] = [
	['Dashboard', 'owner,manager,reception'],
	['Calendar', 'owner,manager,reception'],
	['Бронювання', 'owner,manager,reception'],
	['Гості', 'owner,manager,reception'],
	['Оплати', 'owner,manager,reception'],
	['Прибирання', 'owner,manager,reception,housekeeping'],
	['Повідомлення', 'owner,manager,reception'],
	['Автоматизації', 'owner,manager'],
	['Продажі', 'owner,manager'],
	['AI', 'owner,manager,reception,housekeeping:обмежено'],
	['Команда', 'owner,manager:optional'],
	['Налаштування', 'owner,manager:optional'],
];

const MATRIX_ROLES: Role[] = ['owner', 'manager', 'reception', 'housekeeping'];

const SEED_EMPLOYEES: Employee[] = [
	{
		id: 1,
		first: 'Олександр',
		last: 'Гончар',
		email: 'oleksandr@example.com',
		phone: '+380 67 111 22 33',
		role: 'owner',
		status: 'active',
		joined: '1 січня 2026',
		lastActivity: 'сьогодні · 15:24',
		online: true,
		activity: [
			{ time: '15:24', text: 'Змінив статус номера 204' },
			{ time: '11:02', text: 'Переглянув звіт продажів' },
		],
		perms: {},
	},
	{
		id: 2,
		first: 'Марія',
		last: 'Коваль',
		email: 'maria@example.com',
		phone: '+380 63 222 33 44',
		role: 'manager',
		status: 'active',
		joined: '4 серпня 2026',
		lastActivity: '12 хв тому',
		online: true,
		activity: [
			{ time: '15:18', text: 'Створила бронювання #1847' },
			{ time: '14:42', text: 'Додала оплату 1 500 ₴' },
			{ time: '13:16', text: 'Заселила Анну Коваленко' },
		],
		perms: { canRefund: true, canManageTeam: false, canEditSettings: false },
		todayStats: { bookings: 4, checkins: 3, payments: 6 },
	},
	{
		id: 3,
		first: 'Ірина',
		last: 'Петренко',
		email: 'iryna@example.com',
		phone: '+380 97 333 44 55',
		role: 'reception',
		status: 'active',
		joined: '12 серпня 2026',
		lastActivity: '34 хв тому',
		online: true,
		shift: '08:00–20:00',
		activity: [
			{ time: '12:58', text: 'Змінила номер у бронюванні #1841' },
			{ time: '11:20', text: 'Додала оплату 800 ₴' },
		],
		perms: { canSeeFinance: false, canCancelBooking: false },
	},
	{
		id: 4,
		first: 'Олена',
		last: 'Бондар',
		email: 'olena@example.com',
		phone: '+380 66 444 55 66',
		role: 'housekeeping',
		status: 'active',
		joined: '20 серпня 2026',
		lastActivity: '2 год тому',
		online: false,
		tasks: { done: 5, inProgress: 1, remaining: 2 },
		activity: [
			{ time: '12:20', text: 'Розпочала прибирання номера 207' },
			{ time: '11:41', text: 'Завершила прибирання номера 103' },
		],
		perms: {},
	},
	{
		id: 5,
		first: 'Оксана',
		last: 'Мельник',
		email: 'oksana@example.com',
		phone: '+380 50 555 66 77',
		role: 'housekeeping',
		status: 'active',
		joined: '2 вересня 2026',
		lastActivity: 'вчора · 18:10',
		online: false,
		tasks: { done: 4, inProgress: 0, remaining: 0 },
		activity: [{ time: '17:55', text: 'Завершила прибирання номера 101' }],
		perms: {},
	},
	{
		id: 6,
		first: 'Тарас',
		last: 'Швець',
		email: 'taras@example.com',
		phone: '+380 63 666 77 88',
		role: 'reception',
		status: 'active',
		joined: '5 вересня 2026',
		lastActivity: '3 дні тому',
		online: false,
		shift: '20:00–08:00',
		activity: [{ time: '20:40', text: 'Заселив Олега Бондаря' }],
		perms: { canSeeFinance: false, canCancelBooking: false },
	},
	{
		id: 7,
		first: 'Юлія',
		last: 'Савчук',
		email: 'yulia@example.com',
		phone: '',
		role: 'reception',
		status: 'invited',
		invitedOn: '17 вересня · 15:20',
		lastActivity: '-',
		online: false,
		perms: {},
	},
];

const fullName = (e: Employee) => e.first + ' ' + e.last;
const statusLabel = (s: Status) => ({ active: 'Активний', invited: 'Запрошено', deactivated: 'Деактивований' })[s];
const initials = (n: string) =>
	n
		.split(' ')
		.slice(0, 2)
		.map((p) => p[0])
		.join('');

const PERM_MAP: Record<Role, [string, string][]> = {
	owner: [],
	manager: [
		['canRefund', 'Може здійснювати повернення'],
		['canManageTeam', 'Може керувати командою'],
		['canEditSettings', 'Може змінювати налаштування'],
	],
	reception: [
		['canSeeFinance', 'Може бачити фінансові показники'],
		['canCancelBooking', 'Може скасовувати бронювання'],
	],
	housekeeping: [],
};

const NOTIF_OPTS: [string, string][] = [
	['notifyBooking', 'Нове бронювання'],
	['notifyMessage', 'Нове повідомлення'],
	['notifyPayment', 'Оплата'],
	['notifyHousekeeping', 'Housekeeping alerts'],
	['notifyAutomation', 'Automation errors'],
];

const defaultNotif = (role: Role): Record<string, boolean> => ({
	notifyBooking: true,
	notifyMessage: true,
	notifyPayment: role !== 'housekeeping',
	notifyHousekeeping: role === 'housekeeping' || role === 'owner' || role === 'manager',
	notifyAutomation: role === 'owner' || role === 'manager',
});

@Component({
	selector: 'app-team',
	imports: [AppShellComponent, IconComponent, FormsModule, RouterLink],
	templateUrl: './team.component.html',
	styleUrl: './team.component.scss',
})
export class TeamComponent {
	protected readonly ROLES = ROLES;
	protected readonly MATRIX = MATRIX;
	protected readonly MATRIX_ROLES = MATRIX_ROLES;
	protected readonly ASSIGNABLE_ROLES: Role[] = ['manager', 'reception', 'housekeeping'];
	protected readonly NOTIF_OPTS = NOTIF_OPTS;
	protected readonly fullName = fullName;
	protected readonly statusLabel = statusLabel;
	protected readonly initials = initials;

	protected readonly employees = signal<Employee[]>(SEED_EMPLOYEES.map((e) => ({ ...e, perms: { ...e.perms } })));
	protected readonly segment = signal<Segment>('all');
	protected readonly search = signal('');
	protected readonly selectedId = signal<number | null>(null);
	protected readonly dialogView = signal<DialogView>(null);
	protected readonly toastMessage = signal('');

	private _toastTimer?: ReturnType<typeof setTimeout>;

	protected readonly counts = computed(() => {
		const list = this.employees();
		return {
			total: list.length,
			active: list.filter((e) => e.status === 'active').length,
			invited: list.filter((e) => e.status === 'invited').length,
			online: list.filter((e) => e.online).length,
		};
	});

	protected readonly filtered = computed(() => {
		const q = this.search().trim().toLocaleLowerCase('uk-UA');
		const seg = this.segment();
		return this.employees().filter((e) => {
			if (q && !(fullName(e) + ' ' + e.email + ' ' + e.phone + ' ' + ROLES[e.role].label).toLocaleLowerCase('uk-UA').includes(q)) {
				return false;
			}
			if (seg === 'inactive') return e.status === 'deactivated';
			if (seg !== 'all') return e.role === seg;
			return true;
		});
	});

	protected readonly selectedEmployee = computed(() => {
		const id = this.selectedId();
		return id === null ? undefined : this.employee(id);
	});

	protected readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogEl');

	constructor() {
		effect(() => {
			const dialog = this.dialogRef()?.nativeElement;
			if (!dialog) return;
			if (this.dialogView() !== null) {
				if (!dialog.open) dialog.showModal();
			} else if (dialog.open) {
				dialog.close();
			}
		});
	}

	protected employee(id: number): Employee | undefined {
		return this.employees().find((e) => e.id === id);
	}

	protected isLastOwner(e: Employee): boolean {
		return e.role === 'owner' && this.employees().filter((x) => x.role === 'owner' && x.status === 'active').length <= 1;
	}

	protected permsFor(e: Employee): [string, string][] {
		return PERM_MAP[e.role];
	}

	protected notifFor(e: Employee): Record<string, boolean> {
		if (!e.notif) {
			e.notif = defaultNotif(e.role);
			this.employees.update((list) => list.map((x) => (x.id === e.id ? { ...x, notif: e.notif } : x)));
		}
		return e.notif;
	}

	protected matrixCell(spec: string, role: Role): string {
		if (spec.includes(role + ':optional')) return 'optional';
		if (spec.includes(role + ':обмежено')) return 'обмежено';
		return spec.split(',').some((v) => v.split(':')[0] === role) ? '✓' : '-';
	}

	protected setSegment(seg: Segment): void {
		this.segment.set(seg);
	}

	private toast(text: string): void {
		this.toastMessage.set(text);
		clearTimeout(this._toastTimer);
		this._toastTimer = setTimeout(() => this.toastMessage.set(''), 4200);
	}

	protected closeDialog(): void {
		this.dialogView.set(null);
	}

	protected onDialogClick(event: MouseEvent): void {
		const dialog = this.dialogRef()?.nativeElement;
		if (!dialog || event.target !== dialog) return;
		const rect = dialog.getBoundingClientRect();
		const inside =
			event.clientX >= rect.left &&
			event.clientX <= rect.right &&
			event.clientY >= rect.top &&
			event.clientY <= rect.bottom;
		if (!inside) this.closeDialog();
	}

	protected openProfile(id: number): void {
		this.selectedId.set(id);
	}

	protected closeSidePanel(): void {
		this.selectedId.set(null);
	}

	protected openAddEmployee(): void {
		this.dialogView.set({ kind: 'add-employee' });
	}

	protected openRoleMatrix(): void {
		this.dialogView.set({ kind: 'role-matrix' });
	}

	protected submitAddForm(first: string, last: string, email: string, phone: string, role: Role): void {
		const f = first.trim();
		const em = email.trim();
		if (!f || !em) {
			this.toast('Вкажіть ім’я та email');
			return;
		}
		this.dialogView.set({ kind: 'invite-preview', data: { first: f, last: last.trim(), email: em, phone: phone.trim(), role } });
	}

	protected sendInvite(data: InviteData): void {
		const id = Math.max(...this.employees().map((e) => e.id)) + 1;
		const employee: Employee = {
			id,
			first: data.first,
			last: data.last,
			email: data.email,
			phone: data.phone,
			role: data.role,
			status: 'invited',
			invitedOn: '17 вересня · зараз',
			lastActivity: '-',
			online: false,
			perms: {},
		};
		this.employees.update((list) => [...list, employee]);
		this.closeDialog();
		setTimeout(() => this.dialogView.set({ kind: 'invite-sent', data }), 150);
	}

	protected copyInviteLink(): void {
		navigator.clipboard?.writeText('https://hotelos.app/invite/DEMO-TOKEN').catch(() => {});
		this.toast('Посилання скопійовано');
	}

	protected resendInvite(): void {
		this.toast('Запрошення надіслано повторно');
	}

	protected cancelInvite(id: number): void {
		this.employees.update((list) => list.filter((e) => e.id !== id));
		this.closeSidePanel();
		this.closeDialog();
		this.toast('Запрошення скасовано');
	}

	protected openEdit(id: number): void {
		this.dialogView.set({ kind: 'edit', id });
	}

	protected submitEdit(id: number, first: string, last: string, email: string, phone: string): void {
		this.employees.update((list) => list.map((e) => (e.id === id ? { ...e, first, last, email, phone } : e)));
		this.closeDialog();
		this.openProfile(id);
		this.toast('Зміни збережено');
	}

	protected openChangeRole(id: number): void {
		this.dialogView.set({ kind: 'change-role', id });
	}

	protected submitChangeRole(id: number, role: Role): void {
		this.employees.update((list) => list.map((e) => (e.id === id ? { ...e, role } : e)));
		this.closeDialog();
		this.openProfile(id);
		this.toast('Роль змінено');
	}

	protected openDeactivate(id: number): void {
		this.dialogView.set({ kind: 'deactivate', id });
	}

	protected confirmDeactivate(id: number): void {
		this.employees.update((list) => list.map((e) => (e.id === id ? { ...e, status: 'deactivated', online: false } : e)));
		this.closeDialog();
		this.closeSidePanel();
		this.toast('Доступ деактивовано');
	}

	protected reactivate(id: number): void {
		this.employees.update((list) => list.map((e) => (e.id === id ? { ...e, status: 'active' } : e)));
		this.closeSidePanel();
		this.toast('Доступ відновлено');
	}

	protected togglePerm(id: number, key: string): void {
		this.employees.update((list) =>
			list.map((e) => (e.id === id ? { ...e, perms: { ...e.perms, [key]: !e.perms[key] } } : e)),
		);
		this.toast('Дозвіл оновлено');
	}

	protected toggleNotif(id: number, key: string): void {
		this.employees.update((list) =>
			list.map((e) => (e.id === id ? { ...e, notif: { ...(e.notif ?? defaultNotif(e.role)), [key]: !(e.notif?.[key] ?? defaultNotif(e.role)[key]) } } : e)),
		);
	}

	protected endSessions(): void {
		this.toast('Усі сесії завершено');
	}
}
