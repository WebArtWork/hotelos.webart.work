import { Component, computed, ElementRef, effect, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppShellComponent } from '../../layouts/app-shell/app-shell.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { getStoredRole } from '../../shared/role';

interface Room {
	number: string;
	type: string;
	cap: string;
}

type Status = 'confirmed' | 'checkedin' | 'pending' | 'cancelled';

interface Booking {
	id: number;
	room: string;
	name: string;
	phone: string;
	email: string;
	start: string;
	end: string;
	guests: number;
	total: number;
	paid: number;
	status: Status;
	source: string;
	notes: string;
	lateCheckoutHour?: number;
}

interface Blocked {
	room: string;
	start: string;
	end: string;
	reason: string;
}

type DialogView =
	| { kind: 'quick-booking'; room: string; start: string; end: string }
	| { kind: 'conflict'; room: string; start: string; end: string; type: string }
	| { kind: 'confirm-move' }
	| { kind: 'message'; bookingId: number }
	| { kind: 'payment'; bookingId: number }
	| { kind: 'extend-stay'; bookingId: number }
	| null;

const TODAY = '2026-09-17';
const CHECKIN_HOUR = 14;
const CHECKOUT_HOUR = 11;
const LATE_CHECKOUT_OPTIONS = [12, 14, 16, 18];
const MS = 86400000;

const ROOMS: Room[] = [
	{ number: '101', type: 'Стандарт', cap: '2 гості' },
	{ number: '102', type: 'Стандарт', cap: '2 гості' },
	{ number: '103', type: 'Стандарт', cap: '2 гості' },
	{ number: '104', type: 'Стандарт', cap: '2 гості' },
	{ number: '105', type: 'Стандарт', cap: '2 гості' },
	{ number: '106', type: 'Покращений', cap: '2–3 гості' },
	{ number: '107', type: 'Покращений', cap: '2–3 гості' },
	{ number: '108', type: 'Покращений', cap: '2–3 гості' },
	{ number: '201', type: 'Люкс', cap: '2–3 гості' },
	{ number: '202', type: 'Люкс', cap: '2–3 гості' },
	{ number: '203', type: 'Люкс', cap: '2–3 гості' },
	{ number: '204', type: 'Люкс', cap: '2–3 гості' },
	{ number: '205', type: 'Люкс', cap: '2–3 гості' },
	{ number: '301', type: 'Апартаменти', cap: '4 гості' },
	{ number: '302', type: 'Апартаменти', cap: '4 гості' },
];
const BASE_PRICE: Record<string, number> = { Стандарт: 1600, Покращений: 2000, Люкс: 2400, Апартаменти: 3200 };
const GROUP_ORDER = ['Стандарт', 'Покращений', 'Люкс', 'Апартаменти'];
const SOURCES = ['Пряме бронювання', 'Instagram', 'Google', 'Телефон', 'Booking.com', 'Walk-in', 'Інше'];

const SEED_BOOKINGS: Booking[] = [
	{ id: 2001, room: '204', name: 'Анна Коваленко', phone: '+380 67 123 45 67', email: 'anna@example.com', start: '2026-09-17', end: '2026-09-20', guests: 2, total: 4800, paid: 4800, status: 'confirmed', source: 'Instagram', notes: 'Потрібен тихий номер. Очікуваний час прибуття: 13:30.' },
	{ id: 2002, room: '103', name: 'Олег Бондар', phone: '+380 50 222 11 33', email: '', start: '2026-09-17', end: '2026-09-18', guests: 1, total: 2400, paid: 1200, status: 'checkedin', source: 'Телефон', notes: '' },
	{ id: 2003, room: '202', name: 'Марія Петренко', phone: '+380 63 456 78 90', email: '', start: '2026-09-17', end: '2026-09-21', guests: 2, total: 9600, paid: 9600, status: 'confirmed', source: 'Booking.com', notes: '' },
	{ id: 2004, room: '205', name: 'Ірина Шевченко', phone: '+380 97 654 32 10', email: '', start: '2026-09-18', end: '2026-09-20', guests: 2, total: 4800, paid: 0, status: 'pending', source: 'Пряме бронювання', notes: 'Заїзд орієнтовно ввечері.' },
	{ id: 2005, room: '106', name: 'Дмитро Левченко', phone: '+380 66 111 22 33', email: '', start: '2026-09-19', end: '2026-09-23', guests: 2, total: 8000, paid: 4000, status: 'confirmed', source: 'Google', notes: '' },
	{ id: 2006, room: '101', name: 'Олена Романюк', phone: '+380 68 222 33 44', email: '', start: '2026-09-20', end: '2026-09-22', guests: 1, total: 3200, paid: 3200, status: 'confirmed', source: 'Сайт', notes: '' },
	{ id: 2007, room: '302', name: 'Максим Ткаченко', phone: '+380 63 333 44 55', email: '', start: '2026-09-21', end: '2026-09-24', guests: 4, total: 9600, paid: 4800, status: 'pending', source: 'Booking.com', notes: '' },
	{ id: 2008, room: '107', name: 'Андрій Мельник', phone: '+380 50 444 55 66', email: '', start: '2026-09-22', end: '2026-09-24', guests: 2, total: 4000, paid: 4000, status: 'confirmed', source: 'Пряме бронювання', notes: '' },
	{ id: 2009, room: '203', name: 'Наталія Коваль', phone: '+380 97 555 66 77', email: '', start: '2026-09-23', end: '2026-09-27', guests: 3, total: 9600, paid: 9600, status: 'confirmed', source: 'Google', notes: '' },
	{ id: 2010, room: '104', name: 'Тарас Гончар', phone: '+380 66 777 88 99', email: '', start: '2026-09-18', end: '2026-09-19', guests: 2, total: 1600, paid: 0, status: 'cancelled', source: 'Instagram', notes: 'Скасовано гостем.' },
	{ id: 2011, room: '201', name: 'Юлія Савчук', phone: '+380 68 888 99 00', email: '', start: '2026-09-24', end: '2026-09-27', guests: 2, total: 7200, paid: 7200, status: 'confirmed', source: 'Walk-in', notes: '' },
	{ id: 2012, room: '102', name: 'Віктор Коваль', phone: '+380 63 999 00 11', email: '', start: '2026-09-25', end: '2026-09-28', guests: 2, total: 4800, paid: 2400, status: 'pending', source: 'Телефон', notes: '' },
];
const BLOCKED: Blocked[] = [{ room: '301', start: '2026-09-25', end: '2026-09-28', reason: 'Ремонт' }];

const toDate = (s: string) => new Date(s + 'T00:00:00Z');
const addDays = (s: string, n: number) => {
	const d = toDate(s);
	d.setUTCDate(d.getUTCDate() + n);
	return d.toISOString().slice(0, 10);
};
const dayDiff = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / MS);
const shortDate = (s: string) =>
	new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(toDate(s));
const weekdayShort = (s: string) => ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][toDate(s).getUTCDay()];
const monthLabel = (s: string) =>
	new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(toDate(s));
const isWeekend = (s: string) => [0, 6].includes(toDate(s).getUTCDay());
const dayNum = (s: string) => Number(s.slice(-2));
const initials = (n: string) =>
	n
		.split(' ')
		.slice(0, 2)
		.map((p) => p[0])
		.join('');
const money = (n: number) => new Intl.NumberFormat('uk-UA').format(n) + ' ₴';
const statusLabel = (s: Status) =>
	({ confirmed: 'Підтверджено', pending: 'Очікує підтвердження', checkedin: 'Заїхав', cancelled: 'Скасовано' })[s];
const paymentLabel = (b: Booking) => (b.paid <= 0 ? 'Не оплачено' : b.paid < b.total ? 'Частково оплачено' : 'Оплачено');

@Component({
	selector: 'app-calendar',
	imports: [AppShellComponent, IconComponent, FormsModule],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
	protected readonly showFinance = getStoredRole() !== 'sales';

	protected readonly TODAY = TODAY;
	protected readonly GROUP_ORDER = GROUP_ORDER;
	protected readonly ROOMS = ROOMS;
	protected readonly SOURCES = SOURCES;
	protected readonly money = money;
	protected readonly shortDate = shortDate;
	protected readonly weekdayShort = weekdayShort;
	protected readonly isWeekend = isWeekend;
	protected readonly dayNum = dayNum;
	protected readonly dayDiff = dayDiff;
	protected readonly initials = initials;
	protected readonly statusLabel = statusLabel;
	protected readonly paymentLabel = paymentLabel;

	protected readonly bookings = signal<Booking[]>(SEED_BOOKINGS.map((b) => ({ ...b })));
	protected readonly viewStart = signal(TODAY);
	protected readonly viewDays = signal(14);
	protected readonly search = signal('');
	protected readonly statusFilter = signal(new Set<Status>(['confirmed', 'pending', 'checkedin', 'cancelled']));
	protected readonly typeFilter = signal(new Set(GROUP_ORDER));
	protected readonly filtersOpen = signal(false);
	protected readonly mobileDate = signal(TODAY);
	protected readonly mobileDays = signal(1);
	protected readonly selectedId = signal<number | null>(null);
	protected readonly pendingMove = signal<{ id: number; room: string; start: string; end: string } | null>(null);
	protected readonly dialogView = signal<DialogView>(null);
	protected readonly formError = signal('');
	protected readonly toastMessage = signal('');
	protected readonly hover = signal<{ booking: Booking; x: number; y: number } | null>(null);

	private _toastTimer?: ReturnType<typeof setTimeout>;
	private _dragId: number | null = null;

	protected readonly rangeLabel = computed(() => monthLabel(this.viewStart()));
	protected readonly dateRange = computed(() =>
		Array.from({ length: this.viewDays() }, (_, i) => addDays(this.viewStart(), i)),
	);
	protected readonly visibleRooms = computed(() => ROOMS.filter((r) => this.typeFilter().has(r.type)));
	protected readonly visibleBookings = computed(() => this.bookings().filter((b) => this.statusFilter().has(b.status)));

	protected readonly gridRows = computed(() => {
		const rows: ({ kind: 'group'; label: string; row: number } | { kind: 'room'; room: Room; row: number })[] = [];
		let row = 2;
		for (const type of GROUP_ORDER) {
			const list = this.visibleRooms().filter((r) => r.type === type);
			if (!list.length) continue;
			rows.push({ kind: 'group', label: type, row });
			row++;
			for (const r of list) {
				rows.push({ kind: 'room', room: r, row });
				row++;
			}
		}
		return rows;
	});

	protected readonly bookingBlocks = computed(() => {
		const dates = this.dateRange();
		const rowsByRoom = new Map(
			this.gridRows()
				.filter((r): r is { kind: 'room'; room: Room; row: number } => r.kind === 'room')
				.map((r) => [r.room.number, r.row]),
		);
		const q = this.search().trim().toLocaleLowerCase('uk-UA');
		const blocks: {
			booking: Booking;
			row: number;
			colStart: number;
			colEnd: number;
			match: boolean;
			insetLeft: number;
			insetRight: number;
		}[] = [];
		for (const b of this.visibleBookings()) {
			const row = rowsByRoom.get(b.room);
			if (row === undefined) continue;
			const rawStart = dayDiff(this.viewStart(), b.start);
			const rawEnd = dayDiff(this.viewStart(), b.end);
			const s = Math.max(0, rawStart);
			const e = Math.min(dates.length, rawEnd);
			if (e <= 0 || s >= dates.length) continue;
			const match = !!q && (b.name + ' ' + b.room + ' #' + b.id).toLocaleLowerCase('uk-UA').includes(q);
			const showCheckinEdge = rawStart >= 0 && rawStart < dates.length;
			const showCheckoutEdge = rawEnd >= 0 && rawEnd < dates.length;
			const colStart = s + 2;
			const colEnd = showCheckoutEdge ? e + 3 : e + 2;
			const totalCols = colEnd - colStart;
			const checkoutHour = b.lateCheckoutHour ?? CHECKOUT_HOUR;
			const insetLeft = showCheckinEdge ? (CHECKIN_HOUR / 24 / totalCols) * 100 : 0;
			const insetRight = showCheckoutEdge ? ((24 - checkoutHour) / 24 / totalCols) * 100 : 0;
			blocks.push({ booking: b, row, colStart, colEnd, match, insetLeft, insetRight });
		}
		return blocks;
	});

	protected readonly blockedOverlays = computed(() => {
		const dates = this.dateRange();
		const rowsByRoom = new Map(
			this.gridRows()
				.filter((r): r is { kind: 'room'; room: Room; row: number } => r.kind === 'room')
				.map((r) => [r.room.number, r.row]),
		);
		return BLOCKED.map((bl) => {
			const row = rowsByRoom.get(bl.room);
			if (row === undefined) return null;
			const s = Math.max(0, dayDiff(this.viewStart(), bl.start));
			const e = Math.min(dates.length, dayDiff(this.viewStart(), bl.end));
			if (e <= 0 || s >= dates.length) return null;
			return { ...bl, row, colStart: s + 2, colEnd: e + 2 };
		}).filter((x): x is NonNullable<typeof x> => x !== null);
	});

	protected readonly mobileRoomCards = computed(() => {
		const dates = Array.from({ length: this.mobileDays() }, (_, i) => addDays(this.mobileDate(), i));
		return ROOMS.map((r) => {
			const booking = this.bookings().find(
				(x) => x.room === r.number && x.status !== 'cancelled' && dates.some((d) => d >= x.start && d < x.end),
			);
			const blocked = BLOCKED.find((x) => x.room === r.number && dates.some((d) => d >= x.start && d < x.end));
			return { room: r, booking, blocked };
		});
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

	protected booking(id: number): Booking | undefined {
		return this.bookings().find((b) => b.id === id);
	}

	protected roomOf(number: string): Room | undefined {
		return ROOMS.find((r) => r.number === number);
	}

	protected occupied(room: string, date: string): boolean {
		const nextDay = addDays(date, 1);
		if (BLOCKED.some((bl) => bl.room === room && date < bl.end && nextDay > bl.start)) return true;
		return this.bookings().some(
			(b) => b.room === room && b.status !== 'cancelled' && date < b.end && nextDay > b.start,
		);
	}

	private bookingsOverlap(room: string, start: string, end: string, excludeId: number | null): boolean {
		if (BLOCKED.some((bl) => bl.room === room && start < bl.end && end > bl.start)) return true;
		return this.bookings().some(
			(b) => b.room === room && b.id !== excludeId && b.status !== 'cancelled' && start < b.end && end > b.start,
		);
	}

	protected alternativesFor(type: string, start: string, end: string, excludeRoom: string): Room[] {
		return ROOMS.filter((r) => r.type === type && r.number !== excludeRoom && !this.bookingsOverlap(r.number, start, end, null));
	}

	protected prevRange(): void {
		this.viewStart.set(addDays(this.viewStart(), -this.viewDays()));
	}

	protected nextRange(): void {
		this.viewStart.set(addDays(this.viewStart(), this.viewDays()));
	}

	protected goToday(): void {
		this.viewStart.set(TODAY);
		this.mobileDate.set(TODAY);
	}

	protected setViewDays(days: number): void {
		this.viewDays.set(days);
	}

	protected mobilePrev(): void {
		this.mobileDate.set(addDays(this.mobileDate(), -this.mobileDays()));
	}

	protected mobileNext(): void {
		this.mobileDate.set(addDays(this.mobileDate(), this.mobileDays()));
	}

	protected setMobileDays(days: number): void {
		this.mobileDays.set(days);
	}

	protected toggleFilters(): void {
		this.filtersOpen.update((v) => !v);
	}

	protected toggleStatusFilter(status: Status, checked: boolean): void {
		this.statusFilter.update((set) => {
			const next = new Set(set);
			checked ? next.add(status) : next.delete(status);
			return next;
		});
	}

	protected toggleTypeFilter(type: string, checked: boolean): void {
		this.typeFilter.update((set) => {
			const next = new Set(set);
			checked ? next.add(type) : next.delete(type);
			return next;
		});
	}

	protected resetFilters(): void {
		this.statusFilter.set(new Set<Status>(['confirmed', 'pending', 'checkedin', 'cancelled']));
		this.typeFilter.set(new Set(GROUP_ORDER));
	}

	protected basePriceOf(room: string): number {
		return BASE_PRICE[this.roomOf(room)?.type ?? 'Стандарт'];
	}

	protected onDayCellClick(room: string, date: string): void {
		if (this.occupied(room, date)) return;
		this.openQuickBooking(room, date);
	}

	protected openQuickBooking(room: string, date: string): void {
		this.formError.set('');
		this.dialogView.set({ kind: 'quick-booking', room, start: date, end: addDays(date, 1) });
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

	protected openSidePanel(id: number): void {
		this.selectedId.set(id);
	}

	protected closeSidePanel(): void {
		this.selectedId.set(null);
	}

	private toast(text: string): void {
		this.toastMessage.set(text);
		clearTimeout(this._toastTimer);
		this._toastTimer = setTimeout(() => this.toastMessage.set(''), 4200);
	}

	protected showHover(event: MouseEvent, booking: Booking): void {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		this.hover.set({ booking, x: Math.min(window.innerWidth - 236, rect.left), y: rect.bottom + 8 + window.scrollY });
	}

	protected hideHover(): void {
		this.hover.set(null);
	}

	protected onDragStart(event: DragEvent, id: number): void {
		this._dragId = id;
		event.dataTransfer?.setData('text/plain', String(id));
	}

	protected onDragOver(event: DragEvent): void {
		event.preventDefault();
	}

	protected onDrop(event: DragEvent, room: string, date: string): void {
		event.preventDefault();
		const id = this._dragId;
		this._dragId = null;
		if (id == null) return;
		const b = this.booking(id);
		if (!b) return;
		const nights = dayDiff(b.start, b.end);
		const newStart = date;
		const newEnd = addDays(newStart, nights);
		if (room === b.room && newStart === b.start) return;
		if (this.bookingsOverlap(room, newStart, newEnd, b.id)) {
			this.dialogView.set({ kind: 'conflict', room, start: newStart, end: newEnd, type: this.roomOf(room)!.type });
			return;
		}
		this.pendingMove.set({ id: b.id, room, start: newStart, end: newEnd });
		this.dialogView.set({ kind: 'confirm-move' });
	}

	protected applyPendingMove(): void {
		const m = this.pendingMove();
		if (!m) return;
		this.bookings.update((bs) => bs.map((b) => (b.id === m.id ? { ...b, room: m.room, start: m.start, end: m.end } : b)));
		this.pendingMove.set(null);
		this.closeDialog();
		this.toast('Бронювання переміщено · Демо');
	}

	protected pickAlternative(room: string, start: string): void {
		this.openQuickBooking(room, start);
	}

	protected submitQuickBooking(view: { room: string; start: string; end: string }, form: { name: string; room: string; guests: number; start: string; end: string; total: number; source: string; payment: string }): void {
		const name = form.name.trim();
		if (!name) {
			this.formError.set('Вкажіть ім’я гостя.');
			return;
		}
		if (form.end <= form.start) {
			this.formError.set('Виїзд має бути після заїзду.');
			return;
		}
		if (this.bookingsOverlap(form.room, form.start, form.end, null)) {
			this.closeDialog();
			this.dialogView.set({ kind: 'conflict', room: form.room, start: form.start, end: form.end, type: this.roomOf(form.room)!.type });
			return;
		}
		const id = Math.max(...this.bookings().map((b) => b.id)) + 1;
		const paid = form.payment === 'full' ? form.total : form.payment === 'half' ? Math.round(form.total / 2) : 0;
		const booking: Booking = {
			id,
			room: form.room,
			name,
			phone: '',
			email: '',
			start: form.start,
			end: form.end,
			guests: form.guests,
			total: form.total,
			paid,
			status: 'confirmed',
			source: form.source,
			notes: '',
		};
		this.bookings.update((bs) => [...bs, booking]);
		this.closeDialog();
		this.toast('Бронювання створено · #' + id);
	}

	protected submitPayment(id: number, amount: number): void {
		const b = this.booking(id);
		if (!b || amount <= 0 || amount > b.total - b.paid) return;
		this.bookings.update((bs) => bs.map((x) => (x.id === id ? { ...x, paid: x.paid + amount } : x)));
		this.closeDialog();
		this.openSidePanel(id);
		this.toast('Оплату додано · ' + money(amount));
	}

	protected submitMessage(): void {
		this.closeDialog();
		this.toast('Чернетку повідомлення підготовлено · Демо');
	}

	protected cancelBooking(id: number): void {
		this.bookings.update((bs) => bs.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
		this.closeSidePanel();
		this.toast('Бронювання скасовано · Демо');
	}

	protected requestRoomChange(): void {
		this.toast('Оберіть новий номер перетягнувши бронювання в календарі · Демо');
	}

	protected readonly LATE_CHECKOUT_OPTIONS = LATE_CHECKOUT_OPTIONS;

	protected checkoutHourOf(b: Booking): number {
		return b.lateCheckoutHour ?? CHECKOUT_HOUR;
	}

	protected checkoutLabel(b: Booking): string {
		const hour = this.checkoutHourOf(b);
		return `${String(hour).padStart(2, '0')}:00`;
	}

	protected canExtendStay(b: Booking): boolean {
		if (b.status === 'cancelled') return false;
		const roomTakenAfter = this.bookings().some(
			(x) => x.id !== b.id && x.room === b.room && x.status !== 'cancelled' && x.start === b.end,
		);
		const blockedAfter = BLOCKED.some((bl) => bl.room === b.room && bl.start === b.end);
		return !roomTakenAfter && !blockedAfter;
	}

	protected openExtendStay(id: number): void {
		this.dialogView.set({ kind: 'extend-stay', bookingId: id });
	}

	protected submitExtendStay(id: number, hour: number): void {
		this.bookings.update((bs) => bs.map((b) => (b.id === id ? { ...b, lateCheckoutHour: hour } : b)));
		this.closeDialog();
		this.openSidePanel(id);
		this.toast(`Пізній виїзд до ${String(hour).padStart(2, '0')}:00 підтверджено · Демо`);
	}
}
