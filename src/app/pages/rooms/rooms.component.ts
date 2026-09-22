import { Component, ElementRef, computed, effect, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppShellComponent } from '../../layouts/app-shell/app-shell.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { getStoredRole } from '../../shared/role';

type RoomStatus = 'occupied' | 'ready' | 'needs-cleaning' | 'cleaning' | 'unavailable';

interface MaintenanceNote {
	date: string;
	text: string;
	status: string;
}

interface Room {
	number: string;
	type: string;
	floor: number;
	capacity: number;
	beds: string;
	area: number;
	price: number;
	amenities: string[];
	status: RoomStatus;
	guest: string | null;
	maintenanceNotes: MaintenanceNote[];
	needsCleaning?: boolean;
	checkin?: string;
	checkout?: string;
	nights?: number;
	payment?: string;
	nextGuest?: string | null;
	nextStart?: string;
	nextEnd?: string;
	nextArrival?: string | null;
	lastCleaned?: string;
	cleanedBy?: string;
	checkoutTime?: string;
	assigned?: string | null;
	startedAt?: string;
	reason?: string;
	blockStart?: string;
	blockEnd?: string;
}

type Segment = 'all' | 'ready' | 'occupied' | 'cleaning' | 'unavailable';
type ViewMode = 'cards' | 'list';

type DialogView =
	| { kind: 'add-room' }
	| { kind: 'room-types' }
	| { kind: 'add-type' }
	| { kind: 'block-room'; number: string }
	| { kind: 'change-status'; number: string }
	| { kind: 'edit-room'; number: string }
	| null;

interface TypeInfo {
	price: number;
	capacity: number;
	beds: string;
	amenities: string[];
}

const TYPES: Record<string, TypeInfo> = {
	Стандарт: { price: 1200, capacity: 2, beds: '1 двоспальне ліжко', amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Душ'] },
	Покращений: { price: 1500, capacity: 3, beds: '1 двоспальне + диван', amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Душ', 'Балкон'] },
	Люкс: { price: 1600, capacity: 2, beds: '1 двоспальне ліжко', amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Фен', 'Мінібар', 'Сніданок'] },
	Апартаменти: { price: 2200, capacity: 4, beds: '2 спальні + диван', amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Кухня', 'Пральна машина'] },
};
const TYPE_ORDER = ['Стандарт', 'Покращений', 'Люкс', 'Апартаменти'];
const GUEST_NAMES = [
	'Олег Бондар',
	'Марія Петренко',
	'Ірина Шевченко',
	'Дмитро Левченко',
	'Наталія Коваль',
	'Максим Ткаченко',
	'Андрій Мельник',
	'Тарас Гончар',
	'Юлія Савчук',
	'Віктор Коваль',
];

function buildRooms(): Room[] {
	const list: Room[] = [];
	let gi = 0;
	const push = (number: string, type: string, floor: number) => {
		const base = TYPES[type];
		list.push({
			number,
			type,
			floor,
			capacity: base.capacity,
			beds: base.beds,
			area: 22 + Math.floor(Math.random() * 10),
			price: base.price,
			amenities: base.amenities,
			status: 'occupied',
			guest: GUEST_NAMES[gi++ % GUEST_NAMES.length],
			checkout: '20 вересня',
			maintenanceNotes: [],
		});
	};
	for (let i = 101; i <= 110; i++) push(String(i), 'Стандарт', 1);
	for (let i = 111; i <= 114; i++) push(String(i), 'Покращений', 1);
	for (let i = 201; i <= 208; i++) push(String(i), 'Люкс', 2);
	for (let i = 301; i <= 306; i++) push(String(i), 'Апартаменти', 3);

	const set = (num: string, overrides: Partial<Room>) => Object.assign(list.find((r) => r.number === num)!, overrides);
	set('204', {
		status: 'occupied',
		needsCleaning: true,
		guest: 'Анна Коваленко',
		checkin: '17 вересня',
		checkout: '20 вересня',
		nights: 3,
		payment: 'Оплачено',
		nextGuest: 'Олег Бондар',
		nextStart: '21 вересня',
		nextEnd: '23 вересня',
		nextArrival: '14:30',
		maintenanceNotes: [
			{ date: '12 вересня', text: 'Потрібно замінити лампу біля ліжка.', status: 'Виконано' },
			{ date: '2 серпня', text: 'Перевірити кондиціонер.', status: 'Виконано' },
		],
	});
	set('103', { status: 'ready', guest: null, nextGuest: null, nextArrival: '21 вересня', lastCleaned: '17 вересня · 11:40', cleanedBy: 'Марія' });
	set('205', { status: 'ready', guest: null, nextArrival: null, lastCleaned: '16 вересня · 10:20', cleanedBy: 'Оксана' });
	set('207', { status: 'needs-cleaning', guest: null, checkoutTime: '11:08', assigned: null });
	set('302', { status: 'needs-cleaning', guest: null, checkoutTime: '10:40', assigned: null });
	set('206', { status: 'cleaning', guest: null, assigned: 'Марія', startedAt: '12:20', nextArrival: '13:30' });
	set('301', { status: 'unavailable', guest: null, reason: 'Ремонт', blockStart: '17 вересня', blockEnd: '19 вересня' });
	return list;
}

const money = (n: number) => new Intl.NumberFormat('uk-UA').format(n) + ' ₴';
const capBucket = (cap: number) => (cap >= 4 ? '4' : cap >= 3 ? '3' : String(cap));
const needsCleaning = (r: Room) => Boolean(r.needsCleaning) || r.status === 'needs-cleaning' || r.status === 'cleaning';
const statusLabel = (s: RoomStatus | string) =>
	({ occupied: 'Зайнятий', ready: 'Готовий', 'needs-cleaning': 'Потребує прибирання', cleaning: 'Прибирається', unavailable: 'Недоступний' })[
		s as RoomStatus
	] ?? s;

@Component({
	selector: 'app-rooms',
	imports: [AppShellComponent, IconComponent, FormsModule, RouterLink],
	templateUrl: './rooms.component.html',
	styleUrl: './rooms.component.scss',
})
export class RoomsComponent {
	protected readonly showGuestAndFinance = getStoredRole() !== 'maintenance';

	protected readonly TYPE_ORDER = TYPE_ORDER;
	protected readonly money = money;
	protected readonly statusLabel = statusLabel;
	protected readonly Math = Math;

	protected readonly rooms = signal<Room[]>(buildRooms());
	protected readonly search = signal('');
	protected readonly segment = signal<Segment>('all');
	protected readonly viewMode = signal<ViewMode>('cards');

	protected readonly typeFilter = signal(new Set(TYPE_ORDER));
	protected readonly statusFilter = signal(new Set<RoomStatus>(['ready', 'occupied', 'needs-cleaning', 'cleaning', 'unavailable']));
	protected readonly cleaningOnlyFilter = signal(false);
	protected readonly capacityFilter = signal(new Set(['1', '2', '3', '4']));
	protected readonly filtersOpen = signal(false);

	protected readonly selectedRoomNumber = signal<string | null>(null);
	protected readonly dialogView = signal<DialogView>(null);
	protected readonly formError = signal('');
	protected readonly toastMessage = signal('');
	protected readonly aiAnswerKey = signal<string | null>(null);

	private _toastTimer?: ReturnType<typeof setTimeout>;

	protected readonly counts = computed(() => {
		const rooms = this.rooms();
		const total = rooms.length;
		const occupied = rooms.filter((r) => r.status === 'occupied').length;
		const ready = rooms.filter((r) => r.status === 'ready').length;
		const cleaningKpi = rooms.filter((r) => r.status === 'needs-cleaning' || r.status === 'cleaning').length;
		const unavailable = rooms.filter((r) => r.status === 'unavailable').length;
		return { total, occupied, ready, cleaningKpi, unavailable };
	});

	private passesFilters(r: Room): boolean {
		if (this.cleaningOnlyFilter() && !needsCleaning(r)) return false;
		if (!this.typeFilter().has(r.type)) return false;
		if (!this.statusFilter().has(r.status)) return false;
		if (!this.capacityFilter().has(capBucket(r.capacity))) return false;
		return true;
	}

	protected readonly filteredRooms = computed(() => {
		const q = this.search().trim().toLocaleLowerCase('uk-UA');
		let list = this.rooms().filter((r) => this.passesFilters(r));
		if (q) list = list.filter((r) => (r.number + ' ' + r.type).toLocaleLowerCase('uk-UA').includes(q));
		const seg = this.segment();
		if (seg === 'ready') list = list.filter((r) => r.status === 'ready');
		else if (seg === 'occupied') list = list.filter((r) => r.status === 'occupied');
		else if (seg === 'cleaning') list = list.filter((r) => r.status === 'needs-cleaning' || r.status === 'cleaning');
		else if (seg === 'unavailable') list = list.filter((r) => r.status === 'unavailable');
		return list;
	});

	protected readonly typeGroups = computed(() => {
		const list = this.filteredRooms();
		return TYPE_ORDER.map((type) => ({ type, rooms: list.filter((r) => r.type === type) })).filter((g) => g.rooms.length > 0);
	});

	protected readonly selectedRoom = computed(() => {
		const number = this.selectedRoomNumber();
		return number ? this.rooms().find((r) => r.number === number) : undefined;
	});

	protected readonly aiAnswerHtml = computed(() => {
		const key = this.aiAnswerKey();
		if (!key) return '';
		const rooms = this.rooms();
		const free = rooms.filter((r) => r.status === 'ready').map((r) => r.number);
		const toClean = rooms.filter((r) => r.status === 'needs-cleaning' || r.status === 'cleaning').map((r) => r.number);
		const blocked = rooms.filter((r) => r.status === 'unavailable');
		const map: Record<string, string> = {
			freeToday: free.length ? `Сьогодні вільні номери: <b>${free.join(', ')}</b>.` : 'Наразі всі номери зайняті.',
			toClean: toClean.length ? `Потрібно прибрати: <b>${toClean.join(', ')}</b>.` : 'Усі номери прибрані.',
			freeWeekend: `За поточним графіком на вихідні орієнтовно вільні: <b>${free.join(', ') || '-'}</b> (залежно від бронювань).`,
			popular: `Найчастіше бронюють номери категорії <b>Люкс</b>, за даними останніх місяців.`,
			blocked: blocked.length
				? blocked.map((r) => `Номер <b>${r.number}</b>: ${r.reason} (${r.blockStart}–${r.blockEnd})`).join('<br>')
				: 'Заблокованих номерів немає.',
		};
		return map[key] ?? 'AI відповідає лише на основі даних номерного фонду.';
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

	protected room(number: string): Room | undefined {
		return this.rooms().find((r) => r.number === number);
	}

	protected setSegment(seg: Segment): void {
		this.segment.set(seg);
	}

	protected setViewMode(mode: ViewMode): void {
		this.viewMode.set(mode);
	}

	protected toggleFilters(): void {
		this.filtersOpen.update((v) => !v);
	}

	protected toggleTypeFilter(type: string, checked: boolean): void {
		this.typeFilter.update((set) => {
			const next = new Set(set);
			checked ? next.add(type) : next.delete(type);
			return next;
		});
	}

	protected toggleStatusFilter(status: RoomStatus, checked: boolean): void {
		this.statusFilter.update((set) => {
			const next = new Set(set);
			checked ? next.add(status) : next.delete(status);
			return next;
		});
	}

	protected toggleCapacityFilter(cap: string, checked: boolean): void {
		this.capacityFilter.update((set) => {
			const next = new Set(set);
			checked ? next.add(cap) : next.delete(cap);
			return next;
		});
	}

	protected setCleaningOnlyFilter(checked: boolean): void {
		this.cleaningOnlyFilter.set(checked);
	}

	protected clearFilters(): void {
		this.typeFilter.set(new Set(TYPE_ORDER));
		this.statusFilter.set(new Set<RoomStatus>(['ready', 'occupied', 'needs-cleaning', 'cleaning', 'unavailable']));
		this.cleaningOnlyFilter.set(false);
		this.capacityFilter.set(new Set(['1', '2', '3', '4']));
	}

	protected askAi(key: string): void {
		this.aiAnswerKey.set(key);
	}

	protected openRoomPanel(number: string): void {
		this.selectedRoomNumber.set(number);
	}

	protected closeSidePanel(): void {
		this.selectedRoomNumber.set(null);
	}

	protected openDialog(view: DialogView): void {
		this.formError.set('');
		this.dialogView.set(view);
	}

	protected closeDialog(): void {
		this.dialogView.set(null);
	}

	protected onDialogClick(event: MouseEvent): void {
		const dialog = this.dialogRef()?.nativeElement;
		if (!dialog || event.target !== dialog) return;
		const rect = dialog.getBoundingClientRect();
		const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
		if (!inside) this.closeDialog();
	}

	private toast(text: string): void {
		this.toastMessage.set(text);
		clearTimeout(this._toastTimer);
		this._toastTimer = setTimeout(() => this.toastMessage.set(''), 4200);
	}

	protected quickBook(): void {
		this.toast('Перехід до створення бронювання · Демо');
	}

	protected assignClean(number: string): void {
		this.rooms.update((rooms) =>
			rooms.map((r) => (r.number === number ? { ...r, status: 'cleaning', assigned: 'Марія', startedAt: new Date().toTimeString().slice(0, 5) } : r)),
		);
		this.toast('Прибирання призначено · Демо');
	}

	protected openTask(): void {
		this.toast('Перехід до прибирання · Демо');
	}

	protected openBooking(): void {
		this.toast('Перехід до бронювання · Демо');
	}

	protected openCalendar(): void {
		this.toast('Перехід до календаря · Демо');
	}

	protected openHousekeeping(): void {
		this.toast('Перехід до прибирання · Демо');
	}

	protected submitAddRoom(number: string, type: string, floor: number, capacity: number, price: number): void {
		const n = number.trim();
		if (!n) return;
		const base = TYPES[type] ?? TYPES['Стандарт'];
		this.rooms.update((rooms) => [
			...rooms,
			{
				number: n,
				type,
				floor,
				capacity,
				beds: base.beds,
				area: 24,
				price,
				amenities: base.amenities,
				status: 'ready',
				guest: null,
				maintenanceNotes: [],
				lastCleaned: '-',
				cleanedBy: '-',
			},
		]);
		this.closeDialog();
		this.toast('Номер додано');
	}

	protected submitAddType(): void {
		this.closeDialog();
		this.toast('Тип номера створено · Демо');
	}

	protected submitBlockRoom(number: string, start: string, end: string, reason: string): void {
		this.rooms.update((rooms) => rooms.map((r) => (r.number === number ? { ...r, status: 'unavailable', reason, blockStart: start, blockEnd: end } : r)));
		this.closeDialog();
		this.toast('Номер заблоковано');
	}

	protected submitChangeStatus(number: string, status: RoomStatus): void {
		this.rooms.update((rooms) => rooms.map((r) => (r.number === number ? { ...r, status } : r)));
		this.closeDialog();
		this.toast('Статус оновлено');
	}

	protected submitEditRoom(number: string, type: string, price: number): void {
		this.rooms.update((rooms) => rooms.map((r) => (r.number === number ? { ...r, type, price } : r)));
		this.closeDialog();
		this.toast('Зміни збережено');
	}
}
