import { Component, ElementRef, computed, effect, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppShellComponent } from '../../layouts/app-shell/app-shell.component';
import { IconComponent } from '../../shared/icon/icon.component';

type Status = 'new' | 'confirmed' | 'checkedin' | 'checkedout' | 'cancelled';

interface Extra {
	name: string;
	price: number;
}

interface Payment {
	date: string;
	amount: number;
	method: string;
	note: string;
}

interface MessageItem {
	date: string;
	text: string;
	state: 'sent' | 'scheduled';
}

interface HistoryItem {
	date: string;
	text: string;
	meta?: string;
}

interface BookingState {
	id: number;
	name: string;
	phone: string;
	email: string;
	room: string;
	roomType: string;
	checkin: string;
	checkinTime: string;
	checkout: string;
	checkoutTime: string;
	nights: number;
	adults: number;
	expectedArrival: string;
	total: number;
	paid: number;
	status: Status;
	createdDate: string;
	channel: string;
	discovery: string;
	campaign: string;
	referrer: string;
	additionalGuests: string[];
	previousStays: number;
	roomReady: boolean;
	roomStaff: string;
	roomReadyTime: string;
	notes: string;
	preferences: string[];
	extras: Extra[];
	payments: Payment[];
	messages: MessageItem[];
	timeline: HistoryItem[];
}

type DialogView =
	| { kind: 'checkin' }
	| { kind: 'checkout' }
	| { kind: 'add-payment' }
	| { kind: 'add-extra' }
	| { kind: 'edit-notes' }
	| { kind: 'add-pref' }
	| { kind: 'add-guest' }
	| { kind: 'edit' }
	| { kind: 'cancel' }
	| { kind: 'delete' }
	| { kind: 'refund' }
	| { kind: 'open-room' }
	| { kind: 'message' }
	| { kind: 'all-messages' }
	| { kind: 'ai'; question: string; answer: string }
	| null;

const STATUS_META: Record<Status, { label: string; step: number }> = {
	new: { label: 'Нове', step: 0 },
	confirmed: { label: 'Підтверджено', step: 1 },
	checkedin: { label: 'Заїхав', step: 2 },
	checkedout: { label: 'Виїхав', step: 3 },
	cancelled: { label: 'Скасовано', step: -1 },
};

const STEPS = ['Нове', 'Підтверджено', 'Заїхав', 'Виїхав'];

const TEMPLATES: Record<string, string> = {
	confirm: 'Добрий день, Анно! Підтверджуємо ваше бронювання номера 204 з 17 по 20 вересня.',
	arrival: 'Добрий день! Чекаємо на вас 17 вересня після 14:00. Якщо приїдете раніше — дайте знати.',
	checkin: 'Доброго ранку! Ваш номер 204 готовий. Чекаємо на заїзд.',
	payment: 'Нагадуємо, що по бронюванню #1842 залишок до оплати 1 800 ₴.',
	custom: '',
};

const SEED_STATE: BookingState = {
	id: 1842,
	name: 'Анна Коваленко',
	phone: '+380 67 123 45 67',
	email: 'anna@example.com',
	room: '204',
	roomType: 'Люкс',
	checkin: '17 вересня',
	checkinTime: 'після 14:00',
	checkout: '20 вересня',
	checkoutTime: 'до 11:00',
	nights: 3,
	adults: 2,
	expectedArrival: '13:30',
	total: 4800,
	paid: 3000,
	status: 'confirmed',
	createdDate: '14 вересня 2026',
	channel: 'Пряме бронювання',
	discovery: 'Instagram',
	campaign: 'Summer stories',
	referrer: 'instagram.com',
	additionalGuests: ['Олексій Коваленко'],
	previousStays: 2,
	roomReady: true,
	roomStaff: 'Марія',
	roomReadyTime: '13:10',
	notes: 'Потрібен тихий номер.\nГість приїде раніше стандартного часу.\nПросив дитяче ліжечко.',
	preferences: ['Тихий номер', 'Високий поверх', 'Дитяче ліжечко'],
	extras: [
		{ name: 'Сніданок × 2', price: 600 },
		{ name: 'Паркінг × 3 дні', price: 450 },
		{ name: 'Late checkout', price: 500 },
	],
	payments: [
		{ date: '14 вересня', amount: 2000, method: 'Онлайн', note: 'Успішно' },
		{ date: '16 вересня', amount: 1000, method: 'Банківський переказ', note: 'Додано вручну' },
	],
	messages: [
		{ date: '14 вересня · 12:14', text: 'Підтвердження бронювання', state: 'sent' },
		{ date: '16 вересня · 14:00', text: 'Інструкція перед заїздом', state: 'sent' },
		{ date: '17 вересня · 10:00', text: 'Повідомлення про check-in', state: 'scheduled' },
	],
	timeline: [
		{ date: '14 вересня · 12:11', text: 'Бронювання створено', meta: 'Instagram' },
		{ date: '14 вересня · 12:14', text: 'Підтвердження надіслано' },
		{ date: '14 вересня · 12:20', text: 'Отримано оплату 2 000 ₴' },
		{ date: '16 вересня · 17:42', text: 'Додано оплату 1 000 ₴' },
		{ date: '17 вересня · 09:05', text: 'Час прибуття змінено на 13:30' },
	],
};

const money = (n: number) => new Intl.NumberFormat('uk-UA').format(n) + ' ₴';

@Component({
	selector: 'app-booking',
	imports: [AppShellComponent, IconComponent, FormsModule],
	templateUrl: './booking.component.html',
	styleUrl: './booking.component.scss',
})
export class BookingComponent {
	protected readonly money = money;
	protected readonly steps = STEPS;

	protected readonly state = signal<BookingState>({ ...SEED_STATE });

	protected readonly statusMeta = computed(() => STATUS_META[this.state().status]);
	protected readonly statusChipClass = computed(() => {
		const map: Record<Status, string> = {
			new: 'bg-[var(--gold-bg)] text-[var(--gold-ink)]',
			confirmed: 'bg-[var(--green-bg)] text-[var(--green)]',
			checkedin: 'bg-[#2b2c30] text-white',
			checkedout: 'bg-[var(--white)] text-[#5b5c62]',
			cancelled: 'bg-[var(--white)] text-[#9d9ea3] line-through',
		};
		return map[this.state().status];
	});
	protected readonly balance = computed(() => this.state().total - this.state().paid);
	protected readonly extrasTotal = computed(() => this.state().extras.reduce((s, e) => s + e.price, 0));
	protected readonly paymentStatusLabel = computed(() => {
		const s = this.state();
		return s.paid <= 0 ? 'Не оплачено' : s.paid < s.total ? 'Частково оплачено' : 'Оплачено';
	});
	protected readonly primaryLabel = computed(() => {
		const status = this.state().status;
		return status === 'checkedin'
			? 'Оформити виїзд'
			: status === 'checkedout'
				? 'Виїзд оформлено'
				: status === 'cancelled'
					? 'Скасовано'
					: 'Заселити гостя';
	});
	protected readonly primaryDisabled = computed(() => {
		const status = this.state().status;
		return status === 'checkedout' || status === 'cancelled';
	});
	protected readonly historyDesc = computed(() => this.state().timeline.slice().reverse());

	protected readonly moreMenuOpen = signal(false);
	protected readonly dialogView = signal<DialogView>(null);
	protected readonly toastMessage = signal('');
	private _toastTimer?: ReturnType<typeof setTimeout>;

	protected readonly activeTemplate = signal('custom');
	protected readonly messageText = signal('');

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

	private toast(text: string): void {
		this.toastMessage.set(text);
		clearTimeout(this._toastTimer);
		this._toastTimer = setTimeout(() => this.toastMessage.set(''), 4200);
	}

	private pushHistory(text: string, meta?: string): void {
		this.state.update((s) => ({
			...s,
			timeline: [...s.timeline, { date: '17 вересня · ' + new Date().toTimeString().slice(0, 5), text, meta }],
		}));
	}

	protected toggleMoreMenu(): void {
		this.moreMenuOpen.update((v) => !v);
	}

	protected closeMoreMenu(): void {
		this.moreMenuOpen.set(false);
	}

	protected openDialog(view: DialogView): void {
		this.moreMenuOpen.set(false);
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
			event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
		if (!inside) this.closeDialog();
	}

	protected primaryAction(): void {
		const status = this.state().status;
		if (status === 'checkedin') this.openDialog({ kind: 'checkout' });
		else if (status !== 'checkedout' && status !== 'cancelled') this.openDialog({ kind: 'checkin' });
	}

	protected confirmCheckin(): void {
		this.state.update((s) => ({ ...s, status: 'checkedin' }));
		this.pushHistory('Гостя заселено');
		this.closeDialog();
		this.toast('Гостя заселено · Демо');
	}

	protected confirmCheckout(): void {
		this.state.update((s) => ({ ...s, status: 'checkedout', roomReady: false }));
		this.pushHistory('Оформлено виїзд');
		this.closeDialog();
		this.toast('Виїзд оформлено · Номер потребує прибирання');
	}

	protected scrollToPayments(): void {
		document.getElementById('payment-history')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	protected openRefund(): void {
		this.openDialog({ kind: 'refund' });
	}

	protected sendReminder(): void {
		this.pushHistory('Надіслано нагадування про оплату');
		this.toast('Нагадування надіслано · Демо');
	}

	protected changeRoom(): void {
		this.toast('Оберіть новий номер у календарі · Демо');
	}

	protected duplicateBooking(): void {
		this.moreMenuOpen.set(false);
		this.toast('Бронювання дубльовано · Демо');
	}

	protected confirmDelete(): void {
		this.closeDialog();
		this.toast('Бронювання видалено · Демо');
	}

	protected selectTemplate(key: string): void {
		this.activeTemplate.set(key);
		this.messageText.set(TEMPLATES[key] ?? '');
	}

	protected openMessageDialog(): void {
		this.activeTemplate.set('custom');
		this.messageText.set(TEMPLATES['custom']);
		this.openDialog({ kind: 'message' });
	}

	protected aiGenerateMessage(): void {
		const first = this.state().name.split(' ')[0];
		this.messageText.set(`Добрий день, ${first}! Дякуємо за бронювання номера ${this.state().room}. Якщо виникнуть питання — пишіть нам.`);
	}

	protected aiAnswer(key: string): void {
		const s = this.state();
		const map: Record<string, { question: string; answer: string }> = {
			summary: {
				question: 'Підсумуй це бронювання',
				answer: `Бронювання #${s.id} · ${s.name} · Номер ${s.room}, ${s.checkin}–${s.checkout}. Сума ${money(s.total)}, оплачено ${money(s.paid)}, залишок ${money(this.balance())}.`,
			},
			todo: {
				question: 'Що ще потрібно зробити?',
				answer: `${this.balance() > 0 ? 'Потрібно отримати залишок ' + money(this.balance()) + '.' : 'Оплата закрита.'} ${s.roomReady ? 'Номер готовий до заїзду.' : 'Номер ще прибирається.'}`,
			},
			message: {
				question: 'Напиши повідомлення гостю',
				answer: `Приклад: «Добрий день, ${s.name.split(' ')[0]}! Чекаємо на вас ${s.checkin} ${s.checkinTime}.»`,
			},
			balance: {
				question: 'Чи є неоплачений залишок?',
				answer: this.balance() > 0 ? `Так, залишок до оплати — ${money(this.balance())}.` : 'Ні, бронювання оплачено повністю.',
			},
			returning: {
				question: 'Чи повертався цей гість раніше?',
				answer: s.previousStays > 0 ? `Так, гість проживав у вас ${s.previousStays} раз(и) раніше.` : 'Це перше проживання гостя.',
			},
		};
		const entry = map[key] ?? { question: '', answer: 'Відповідь доступна лише в межах цього бронювання.' };
		this.openDialog({ kind: 'ai', question: entry.question, answer: entry.answer });
	}

	protected submitPayment(amount: number, method: string, date: string, note: string): void {
		if (!amount || amount <= 0 || amount > this.balance()) return;
		this.state.update((s) => ({
			...s,
			paid: s.paid + amount,
			payments: [...s.payments, { date: '17 вересня', amount, method, note: note ? note : 'Додано вручну' }],
		}));
		this.pushHistory('Додано оплату ' + money(amount));
		this.closeDialog();
		this.toast('Оплату збережено · ' + money(amount));
	}

	protected submitExtra(name: string, price: number): void {
		if (!name.trim() || !price || price <= 0) return;
		this.state.update((s) => ({ ...s, extras: [...s.extras, { name: name.trim(), price }] }));
		this.closeDialog();
		this.toast('Послугу додано');
	}

	protected submitNotes(notes: string): void {
		this.state.update((s) => ({ ...s, notes: notes.trim() }));
		this.closeDialog();
		this.toast('Нотатки збережено');
	}

	protected submitPref(pref: string): void {
		if (!pref.trim()) return;
		this.state.update((s) => ({ ...s, preferences: [...s.preferences, pref.trim()] }));
		this.closeDialog();
		this.toast('Побажання додано');
	}

	protected submitGuest(name: string): void {
		if (!name.trim()) return;
		this.state.update((s) => ({ ...s, additionalGuests: [...s.additionalGuests, name.trim()] }));
		this.closeDialog();
		this.toast('Гостя додано');
	}

	protected submitEdit(form: {
		name: string;
		room: string;
		roomType: string;
		checkin: string;
		checkout: string;
		adults: number;
		total: number;
		expectedArrival: string;
		channel: string;
		discovery: string;
		status: Status;
	}): void {
		const s = this.state();
		const critical = form.room !== s.room || form.checkin !== s.checkin || form.checkout !== s.checkout || form.total !== s.total;
		this.state.update((prev) => ({ ...prev, ...form }));
		if (critical) this.pushHistory('Внесено критичні зміни (номер/дати/ціна)');
		this.closeDialog();
		this.toast('Зміни збережено' + (critical ? ' · Потребувало підтвердження' : ''));
	}

	protected submitCancel(reason: string): void {
		this.state.update((s) => ({ ...s, status: 'cancelled' }));
		this.pushHistory('Бронювання скасовано: ' + reason);
		this.closeDialog();
		this.toast('Бронювання скасовано · Демо');
	}

	protected submitMessage(text: string): void {
		if (!text.trim()) return;
		this.state.update((s) => ({
			...s,
			messages: [...s.messages, { date: '17 вересня · зараз', text: text.slice(0, 60), state: 'sent' }],
		}));
		this.pushHistory('Надіслано повідомлення гостю');
		this.closeDialog();
		this.toast('Повідомлення надіслано · Демо');
	}
}
