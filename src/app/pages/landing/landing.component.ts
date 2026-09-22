import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';

type ModalKind = 'calendar' | 'guest' | 'contacts' | 'terms' | null;

type PromptKey = 'today' | 'guests' | 'rooms';

const PROMPT_RESPONSES: Record<PromptKey, { question: string; paragraphs: string[] }> = {
	today: {
		question: 'Що сьогодні важливого?',
		paragraphs: [
			'Сьогодні у вас <b>7 заїздів і 4 виїзди.</b>',
			'Номер <b>204</b> ще потрібно прибрати.',
			'Два бронювання мають неоплачений залишок на загальну суму <b>4 800 ₴.</b>',
			'Перший гість очікується приблизно о <b>13:30.</b>',
		],
	},
	guests: {
		question: 'Хто наші найкращі постійні гості?',
		paragraphs: [
			'<b>18 гостей</b> проживали у вас щонайменше три рази за останні 12 місяців.',
			'Разом вони витратили <b>184 000 ₴.</b>',
		],
	},
	rooms: {
		question: 'Які номери вільні на ці вихідні?',
		paragraphs: [
			'З п’ятниці до неділі доступні номери <b>103, 204 та 205.</b>',
			'Перегляньте календар, щоб обрати номер і перевірити дати.',
		],
	},
};

const THEME_KEY = 'hotelos_theme';

@Component({
	selector: 'app-landing',
	imports: [NgTemplateOutlet],
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.scss',
})
export class LandingComponent {
	private readonly _document = inject(DOCUMENT);

	protected readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogEl');
	protected readonly modalKind = signal<ModalKind>(null);
	protected readonly guestName = signal('');

	constructor() {
		effect(() => {
			const dialog = this.dialogRef()?.nativeElement;
			if (!dialog) return;
			if (this.modalKind() !== null) {
				if (!dialog.open) dialog.showModal();
			} else if (dialog.open) {
				dialog.close();
			}
		});
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
		if (!inside) this.closeModal();
	}

	protected readonly selectedPrompt = signal<PromptKey>('today');
	protected readonly promptResponse = computed(() => PROMPT_RESPONSES[this.selectedPrompt()]);

	protected readonly cleanReady = signal(false);

	protected readonly isDark = signal(this._readInitialTheme() === 'dark');

	protected goToApp(): void {
		window.location.href = '/dashboard/';
	}

	protected openCalendarModal(): void {
		this.modalKind.set('calendar');
	}

	protected openGuestModal(name: string): void {
		this.guestName.set(name);
		this.modalKind.set('guest');
	}

	protected openContactsModal(): void {
		this.modalKind.set('contacts');
	}

	protected openTermsModal(): void {
		this.modalKind.set('terms');
	}

	protected closeModal(): void {
		this.modalKind.set(null);
	}

	protected selectPrompt(key: PromptKey): void {
		this.selectedPrompt.set(key);
	}

	protected markCleanReady(): void {
		this.cleanReady.set(true);
	}

	protected toggleTheme(): void {
		const next = this.isDark() ? 'light' : 'dark';
		this.isDark.set(next === 'dark');
		try {
			localStorage.setItem(THEME_KEY, next);
		} catch {
			/* ignore storage errors (private mode, etc.) */
		}
		this._document.documentElement.setAttribute('data-theme', next);
	}

	private _readInitialTheme(): 'dark' | 'light' {
		try {
			const stored = localStorage.getItem(THEME_KEY);
			if (stored === 'dark' || stored === 'light') return stored;
		} catch {
			/* ignore storage errors (private mode, etc.) */
		}
		return 'light';
	}
}
