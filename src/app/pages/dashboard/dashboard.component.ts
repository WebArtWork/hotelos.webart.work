import { Component, computed, ElementRef, signal, viewChild, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppShellComponent } from '../../layouts/app-shell/app-shell.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { canCurrent } from '../../shared/role';

interface Booking {
	id: number;
	name: string;
	room: string;
	guests: number;
	start: string;
	end: string;
	time: string;
	total: number;
	paid: number;
	status: string;
	source: string;
	created: string;
	setup?: boolean;
}

interface Room {
	number: string;
	status: string;
	staff: string;
	note: string;
}

interface Departure {
	name: string;
	room: string;
	time: string;
	done: boolean;
}

interface Guest {
	name: string;
	notes: string;
}

type DialogView =
	| { kind: 'booking'; id: number }
	| { kind: 'calendar' }
	| { kind: 'guests' }
	| { kind: 'payments' }
	| { kind: 'housekeeping'; number?: string }
	| { kind: 'rooms' }
	| { kind: 'departures' }
	| { kind: 'messages' }
	| { kind: 'automations' }
	| { kind: 'sales' }
	| { kind: 'revenue' }
	| { kind: 'team' }
	| { kind: 'settings' }
	| { kind: 'arrivals' }
	| { kind: 'bookings' }
	| { kind: 'new-booking' }
	| { kind: 'payment-form'; id: number }
	| { kind: 'add-guest' }
	| { kind: 'add-room' }
	| { kind: 'room-added'; number: string; price: number }
	| { kind: 'message-form' }
	| { kind: 'confirm-time' }
	| null;

const money = (n: number) => new Intl.NumberFormat('uk-UA').format(n) + ' ₴';
const initials = (n: string) =>
	n
		.split(' ')
		.slice(0, 2)
		.map((p) => p[0])
		.join('');
const shortDate = (s: string) =>
	new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
		new Date(s + 'T12:00:00Z'),
	);
const dates = (b: Booking) =>
	b.start.slice(0, 7) === b.end.slice(0, 7)
		? `${Number(b.start.slice(-2))}–${shortDate(b.end)}`
		: shortDate(b.start) + ' – ' + shortDate(b.end);

const SEED_BOOKINGS: Booking[] = [
	{ id: 1841, name: 'Анна Коваленко', room: '204', guests: 2, start: '2026-09-17', end: '2026-09-20', time: '13:30', total: 4800, paid: 4800, status: 'Очікується', source: 'Instagram', created: '10 хв тому' },
	{ id: 1842, name: 'Олег Бондар', room: '103', guests: 1, start: '2026-09-17', end: '2026-09-18', time: '14:00', total: 2400, paid: 1200, status: 'Очікується', source: 'Телефон', created: 'Сьогодні' },
	{ id: 1843, name: 'Марія Петренко', room: '202', guests: 2, start: '2026-09-17', end: '2026-09-21', time: '16:30', total: 8400, paid: 8400, status: 'Підтверджено', source: 'Booking.com', created: 'Сьогодні' },
	{ id: 1844, name: 'Ірина Шевченко', room: '205', guests: 2, start: '2026-09-17', end: '2026-09-19', time: 'Не уточнено', total: 4400, paid: 4400, status: 'Очікується', source: 'Пряме бронювання', created: 'Сьогодні' },
	{ id: 1845, name: 'Дмитро Левченко', room: '206', guests: 2, start: '2026-09-17', end: '2026-09-20', time: '17:00', total: 5600, paid: 5600, status: 'Підтверджено', source: 'Google', created: 'Сьогодні' },
	{ id: 1846, name: 'Олена Романюк', room: '208', guests: 1, start: '2026-09-17', end: '2026-09-19', time: '18:00', total: 5000, paid: 2200, status: 'Очікується', source: 'Сайт', created: 'Сьогодні' },
	{ id: 1847, name: 'Максим Ткаченко', room: '209', guests: 2, start: '2026-09-17', end: '2026-09-20', time: '19:30', total: 6600, paid: 4400, status: 'Очікується', source: 'Booking.com', created: 'Сьогодні' },
	{ id: 1848, name: 'Андрій Мельник', room: '107', guests: 2, start: '2026-09-21', end: '2026-09-23', time: '14:00', total: 3400, paid: 3400, status: 'Підтверджено', source: 'Пряме бронювання', created: '32 хв тому' },
	{ id: 1849, name: 'Наталія Коваль', room: '302', guests: 2, start: '2026-09-25', end: '2026-09-28', time: '15:00', total: 7200, paid: 7200, status: 'Підтверджено', source: 'Google', created: '1 год тому' },
];

const ROOM_NUMBERS = [
	...Array.from({ length: 10 }, (_, i) => String(101 + i)),
	...Array.from({ length: 10 }, (_, i) => String(201 + i)),
	...Array.from({ length: 8 }, (_, i) => String(301 + i)),
];

function seedRooms(): Room[] {
	return ROOM_NUMBERS.map((n, i) => ({
		number: n,
		status:
			n === '204'
				? 'Прибирається'
				: ['207', '208', '209'].includes(n)
					? 'Потребує прибирання'
					: i < 6 && n !== '101'
						? 'Зайнятий'
						: n === '301'
							? 'Зайнятий'
							: 'Готовий',
		staff: n === '204' ? 'Марія' : n === '101' ? 'Оксана' : '',
		note:
			n === '101'
				? 'Наступний заїзд · 18 вересня'
				: n === '204'
					? 'Марія · Заїзд о 13:30'
					: n === '207'
						? 'Гість виїхав о 11:08'
						: '',
	}));
}

const OCCUPANCY_BASE = [79, 86, 93, 93, 71, 64, 68];

@Component({
	selector: 'app-dashboard',
	imports: [AppShellComponent, IconComponent, FormsModule, RouterLink],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
	protected readonly showSalesCard = canCurrent('salesAnalytics');
	protected readonly showFinanceReports = canCurrent('financeReports');

	protected readonly money = money;
	protected readonly initials = initials;
	protected readonly dates = dates;

	protected readonly bookings = signal<Booking[]>(SEED_BOOKINGS.map((b) => ({ ...b })));
	protected readonly rooms = signal<Room[]>(seedRooms());
	protected readonly departures = signal<Departure[]>([
		{ name: 'Юлія Савчук', room: '207', time: '11:08', done: true },
		{ name: 'Тарас Гончар', room: '208', time: '10:40', done: true },
		{ name: 'Віктор Коваль', room: '301', time: '12:00', done: false },
		{ name: 'Оксана Мельник', room: '302', time: '12:00', done: false },
	]);
	protected readonly guests = signal<Guest[]>([]);
	protected readonly messageDrafted = signal(false);
	protected readonly empty = signal(false);
	protected readonly revenue = signal(38400);
	protected readonly setupRooms = signal<Room[]>([]);
	protected readonly setupBookingDone = signal(false);
	protected readonly newRoomCount = signal(0);

	protected readonly arrivals = computed(() =>
		this.bookings().filter((b) => !b.setup && b.start === '2026-09-17'),
	);
	protected readonly unpaid = computed(() => this.bookings().filter((b) => !b.setup && b.total > b.paid));
	protected readonly unpaidTotal = computed(() =>
		this.unpaid().reduce((s, b) => s + (b.total - b.paid), 0),
	);
	protected readonly currentClean = computed(
		() => this.rooms().find((r) => r.number === '204')?.status !== 'Готовий',
	);
	protected readonly cleanCount = computed(
		() => this.rooms().filter((r) => r.status === 'Потребує прибирання').length,
	);
	protected readonly occupancyToday = computed(() => Math.round((this.occupancyForDay(17) / 28) * 100));

	protected readonly kpis = computed(() => {
		const count = this.arrivals().length;
		const clean = this.cleanCount();
		return [
			{ icon: 'arrival', value: String(count), label: 'Заїздів сьогодні', sub: 'Перший о 13:30', view: 'arrivals' as const, warning: false, growth: false, progress: false },
			{
				icon: 'departure',
				value: '4',
				label: 'Виїздів сьогодні',
				sub: `${this.departures().filter((x) => x.done).length} вже виїхали`,
				view: 'departures' as const,
				warning: false,
				growth: false,
				progress: false,
			},
			{
				icon: 'hotel',
				value: `${this.occupancyForDay(17)} / 28`,
				label: 'Номерів зайнято',
				sub: `${this.occupancyToday()}% завантаження`,
				view: 'calendar' as const,
				warning: false,
				growth: false,
				progress: true,
			},
			{
				icon: 'clean',
				value: String(clean),
				label: 'Потребують прибирання',
				sub: `${this.rooms().filter((r) => r.status === 'Прибирається').length} зараз прибирається`,
				view: 'housekeeping' as const,
				warning: true,
				growth: false,
				progress: false,
			},
			{
				icon: 'wallet',
				value: money(this.unpaidTotal()),
				label: 'Очікується оплата',
				sub: `${this.unpaid().length} бронювання`,
				view: 'payments' as const,
				warning: false,
				growth: false,
				progress: false,
			},
			this.showFinanceReports
				? {
						icon: 'chart',
						value: money(this.revenue()),
						label: 'Надходження сьогодні',
						sub: '+12% до минулого четверга',
						view: 'revenue' as const,
						warning: false,
						growth: true,
						progress: false,
					}
				: {
						icon: 'wallet',
						value: money(this.revenue()),
						label: 'Зібрано за зміну',
						sub: 'Оплати, прийняті на рецепції',
						view: 'payments' as const,
						warning: false,
						growth: false,
						progress: false,
					},
		];
	});

	protected readonly attentionIssues = computed(() => {
		const issues: { icon: string; title: string; body: string; action: string; view?: DialogView; bookingId?: number; onAction?: () => void }[] = [];
		if (this.currentClean()) {
			issues.push({
				icon: 'clean',
				title: 'Номер 204 ще не готовий',
				body: `Заїзд о <b>13:30</b> · Відповідальна: Марія`,
				action: 'Відкрити прибирання',
				view: { kind: 'housekeeping' },
			});
		}
		const oleg = this.bookings().find((b) => b.id === 1842)!;
		if (oleg.total > oleg.paid) {
			issues.push({
				icon: 'wallet',
				title: 'Не отримано оплату',
				body: `Олег Бондар · #1842<br>Залишок: <b>${money(oleg.total - oleg.paid)}</b>`,
				action: 'Відкрити бронювання',
				bookingId: 1842,
			});
		}
		const irina = this.bookings().find((b) => b.id === 1844)!;
		if (irina.time === 'Не уточнено') {
			issues.push({
				icon: 'message',
				title: 'Гість не підтвердив час заїзду',
				body:
					'Ірина Шевченко · Заїзд сьогодні' +
					(this.messageDrafted() ? '<br>Чернетку підготовлено · Час ще не підтверджено' : ''),
				action: 'Надіслати повідомлення',
				onAction: () => this.openDialog({ kind: 'message-form' }),
			});
		}
		return issues;
	});

	protected readonly roomSummary = computed(() => {
		const rs: [string, string][] = [
			['Готовий', 'Готові'],
			['Потребує прибирання', 'Потребують прибирання'],
			['Прибирається', 'Прибирається'],
			['Зайнятий', 'Зайняті'],
		];
		return rs.map(([status, label]) => ({
			count: this.rooms().filter((r) => r.status === status).length,
			label,
		}));
	});

	protected readonly roomList = computed(() =>
		['101', '204', '207'].map((n) => this.rooms().find((r) => r.number === n)!),
	);

	protected readonly newBookings = computed(() => {
		const b = this.bookings();
		const latest = [
			...b.filter((x) => x.id > 1849 && !x.setup).reverse(),
			b[0],
			b.find((x) => x.id === 1848)!,
			b.find((x) => x.id === 1849)!,
		];
		return latest.slice(0, 3);
	});

	protected readonly occupancyChart = computed(() =>
		OCCUPANCY_BASE.map((_, i) => {
			const v = Math.round((this.occupancyForDay(17 + i) / 28) * 100);
			return { day: 17 + i, value: v, label: ['Чт', 'Пт', 'Сб', 'Нд', 'Пн', 'Вт', 'Ср'][i] };
		}),
	);

	protected readonly sources = [
		{ name: 'Прямі бронювання', value: 34 },
		{ name: 'Booking.com', value: 28 },
		{ name: 'Instagram', value: 18 },
		{ name: 'Google', value: 12 },
		{ name: 'Інше', value: 8 },
	];

	protected readonly insightText = computed(() => {
		const clean = this.currentClean();
		const u = this.unpaid();
		return {
			occupancy: this.occupancyToday(),
			room204: clean
				? 'Номер <b>204</b> потрібно підготувати до <b>13:30.</b>'
				: 'Номер <b>204</b> готовий до заїзду о <b>13:30.</b>',
			unpaid: u.length
				? `<b>${u.length} бронювання</b> мають неоплачений залишок на загальну суму <b>${money(this.unpaidTotal())}.</b>`
				: 'Усі показані бронювання оплачені.',
		};
	});

	protected readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogEl');
	protected readonly dialogView = signal<DialogView>(null);
	protected readonly toastMessage = signal('');
	private _toastTimer?: ReturnType<typeof setTimeout>;

	protected readonly formError = signal('');
	protected readonly searchQuery = signal('');
	protected readonly searchResults = computed(() => {
		const q = this.searchQuery().toLocaleLowerCase('uk-UA').trim();
		if (!q) return this.bookings();
		return this.bookings().filter((b) =>
			(b.name + ' ' + b.room + ' #' + b.id).toLocaleLowerCase('uk-UA').includes(q),
		);
	});

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

	private occupancyForDay(d: number): number {
		return Math.min(
			28,
			Math.round((OCCUPANCY_BASE[d - 17] * 28) / 100) +
				this.bookings().filter(
					(b) => b.id > 1849 && !b.setup && b.start <= `2026-09-${d}` && b.end > `2026-09-${d}`,
				).length,
		);
	}

	protected bookingOnDay(room: string, day: number): Booking | undefined {
		return this.bookings().find(
			(b) => b.room === room && Number(b.start.slice(-2)) <= day && Number(b.end.slice(-2)) > day,
		);
	}

	protected booking(id: number): Booking | undefined {
		return this.bookings().find((b) => b.id === id);
	}

	protected roomFor(b: Booking): Room | undefined {
		return (b.setup ? this.setupRooms() : this.rooms()).find((r) => r.number === b.room);
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
		const inside =
			event.clientX >= rect.left &&
			event.clientX <= rect.right &&
			event.clientY >= rect.top &&
			event.clientY <= rect.bottom;
		if (!inside) this.closeDialog();
	}

	private toast(text: string): void {
		this.toastMessage.set(text);
		clearTimeout(this._toastTimer);
		this._toastTimer = setTimeout(() => this.toastMessage.set(''), 4200);
	}

	protected markCleanReady(number: string): void {
		this.rooms.update((rooms) =>
			rooms.map((r) =>
				r.number === number
					? { ...r, status: 'Готовий', note: (r.staff || 'Марія') + ' · Номер підготовлений' }
					: r,
			),
		);
		this.toast('Номер ' + number + ' готовий · Демо');
	}

	protected startClean(number: string): void {
		this.rooms.update((rooms) =>
			rooms.map((r) =>
				r.number === number ? { ...r, status: 'Прибирається', staff: 'Марія', note: 'Марія · Прибирання розпочато' } : r,
			),
		);
		this.toast('Прибирання розпочато · Демо');
	}

	protected checkIn(id: number): void {
		const b = this.booking(id);
		if (!b) return;
		const room = this.roomFor(b);
		if (!room || room.status !== 'Готовий') {
			this.toast('Спочатку підготуйте номер ' + b.room);
			return;
		}
		this.bookings.update((bs) => bs.map((x) => (x.id === id ? { ...x, status: 'Заїхав' } : x)));
		this.rooms.update((rooms) =>
			rooms.map((r) => (r.number === b.room ? { ...r, status: 'Зайнятий', note: b.name + ' · ' + dates(b) } : r)),
		);
		this.toast('Заїзд відмічено · Демо');
	}

	protected checkOut(index: number): void {
		this.departures.update((deps) => deps.map((d, i) => (i === index ? { ...d, done: true } : d)));
		const d = this.departures()[index];
		this.rooms.update((rooms) =>
			rooms.map((r) =>
				r.number === d.room ? { ...r, status: 'Потребує прибирання', note: 'Гість виїхав · Потрібне прибирання' } : r,
			),
		);
		this.toast('Виїзд відмічено · Демо');
	}

	protected confirmArrivalTime(time: string): void {
		this.bookings.update((bs) => bs.map((b) => (b.id === 1844 ? { ...b, time } : b)));
		this.openDialog({ kind: 'booking', id: 1844 });
		this.toast('Час заїзду уточнено · Демо');
	}

	protected submitPayment(id: number, amount: number): void {
		const b = this.booking(id);
		if (!b || amount <= 0 || amount > b.total - b.paid || !Number.isFinite(amount)) return;
		this.bookings.update((bs) => bs.map((x) => (x.id === id ? { ...x, paid: x.paid + amount } : x)));
		if (!b.setup) this.revenue.update((r) => r + amount);
		this.openDialog({ kind: 'booking', id });
		this.toast('Оплату відмічено · ' + money(amount) + ' · Демо');
	}

	protected submitNewBooking(form: {
		name: string;
		start: string;
		end: string;
		room: string;
		guests: number;
		time: string;
		total: number;
		source: string;
	}): void {
		const name = form.name.trim();
		let error = '';
		if (!name) error = "Вкажіть ім'я гостя.";
		else if (form.end <= form.start) error = 'Виїзд має бути після заїзду.';
		else if (
			this.bookings().some(
				(b) => Boolean(b.setup) === this.empty() && b.room === form.room && form.start < b.end && form.end > b.start,
			)
		)
			error = 'Номер зайнятий у ці дати. Оберіть інший номер.';

		if (error) {
			this.formError.set(error);
			return;
		}

		const id = Math.max(...this.bookings().map((b) => b.id)) + 1;
		const booking: Booking = {
			setup: this.empty(),
			id,
			name,
			room: form.room,
			start: form.start,
			end: form.end,
			guests: form.guests,
			time: form.time,
			total: form.total,
			paid: 0,
			status: 'Підтверджено',
			source: form.source,
			created: 'Щойно',
		};
		this.bookings.update((bs) => [...bs, booking]);
		if (this.empty()) this.setupBookingDone.set(true);
		this.openDialog({ kind: 'booking', id });
		this.toast('Демонстраційне бронювання #' + id + ' створено');
	}

	protected submitAddGuest(name: string, notes: string): void {
		const trimmed = name.trim();
		if (!trimmed) return;
		this.guests.update((gs) => [...gs, { name: trimmed, notes: notes.trim() }]);
		this.openDialog({ kind: 'guests' });
		this.toast('Демонстраційного гостя додано');
	}

	protected submitAddRoom(number: string, price: number): void {
		const n = number.trim();
		if (!n) return;
		if (this.setupRooms().some((r) => r.number === n)) {
			this.toast('Цей номер уже додано');
			return;
		}
		this.setupRooms.update((rooms) => [...rooms, { number: n, staff: '', note: 'Новий номер', status: 'Готовий' }]);
		this.newRoomCount.update((c) => c + 1);
		this.openDialog({ kind: 'room-added', number: n, price });
	}

	protected submitMessage(text: string): void {
		this.messageDrafted.set(true);
		this.openDialog(null);
		this.toast('Чернетку підготовлено · Не надіслано');
	}

	protected goEmpty(): void {
		this.empty.set(true);
		this.closeDialog();
	}

	protected goPopulated(): void {
		this.empty.set(false);
	}

	protected guestBookings(name: string) {
		return this.bookings().filter((b) => b.name === name);
	}

	protected uniqueGuestNames = computed(() => [
		...new Set(this.bookings().map((b) => b.name)),
		...this.guests().map((g) => g.name),
	]);
}
