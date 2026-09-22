import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Screen =
	| 'login'
	| 'forgot'
	| 'checkEmail'
	| 'newPassword'
	| 'resetSuccess'
	| 'resetExpired'
	| 'invitation'
	| 'invitationExpired'
	| 'invitationUsed'
	| 'invitationCancelled'
	| 'createAccount'
	| 'accountCreated'
	| 'welcome'
	| 'joinConfirm'
	| 'hotelSwitcher'
	| 'sessionExpired'
	| 'accountDisabled'
	| 'noHotelAccess'
	| 'rateLimit'
	| 'genericError';

type Role = 'reception' | 'manager' | 'housekeeping' | 'owner';

interface RoleCapabilities {
	can: string[];
	cannot: string[];
	cta: string;
	href: string;
}

const INVITE = {
	hotel: 'Grand Hotel',
	inviter: 'Олександр Гончар',
	role: 'reception' as Role,
	email: 'iryna@example.com',
	first: 'Ірина',
	last: 'Петренко',
};

const ROLE_LABEL: Record<Role, string> = {
	owner: 'Власник',
	manager: 'Менеджер',
	reception: 'Рецепція',
	housekeeping: 'Прибирання',
};

const ROLE_CAPS: Record<Role, RoleCapabilities> = {
	reception: {
		can: [
			'працювати з календарем',
			'створювати бронювання',
			'заселяти та виселяти гостей',
			'працювати з CRM гостей',
			'додавати оплати',
			'відповідати на повідомлення',
		],
		cannot: ['налаштування готелю', 'управління командою', 'критичні фінансові налаштування'],
		cta: 'Почати роботу',
		href: '/dashboard/',
	},
	manager: {
		can: ['Dashboard', 'Calendar', 'Бронювання', 'Гості', 'Оплати', 'Прибирання', 'Повідомлення', 'Продажі'],
		cannot: ['критичні налаштування безпеки', 'деактивація готелю'],
		cta: 'Відкрити Dashboard',
		href: '/dashboard/',
	},
	housekeeping: {
		can: [
			'бачити призначені номери',
			'починати прибирання',
			'відмічати номер готовим',
			'повідомляти про проблеми',
		],
		cannot: ['гостьові дані та оплати', 'фінансову інформацію', 'налаштування готелю'],
		cta: 'Відкрити мої задачі',
		href: '/housekeeping/',
	},
	owner: {
		can: ['повний доступ до Hotel OS', 'управління готелем та командою', 'фінансові та критичні налаштування'],
		cannot: [],
		cta: 'Відкрити Dashboard',
		href: '/dashboard/',
	},
};

function passwordChecks(pw: string) {
	return { len: pw.length >= 8, letter: /[a-zA-Z]/.test(pw), digit: /[0-9]/.test(pw) };
}

function passwordStrength(pw: string): 'weak' | 'normal' | 'strong' {
	const c = passwordChecks(pw);
	const score = [c.len, c.letter, c.digit, pw.length >= 12].filter(Boolean).length;
	return score <= 2 ? 'weak' : score === 3 ? 'normal' : 'strong';
}

@Component({
	selector: 'app-login',
	imports: [FormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	protected readonly invite = INVITE;
	protected readonly roleLabel = ROLE_LABEL;

	protected readonly screen = signal<Screen>('login');
	protected readonly demoRole = signal<Role>('reception');

	protected readonly loginEmail = signal('');
	protected readonly loginPassword = signal('');
	protected readonly loginEmailInvalid = signal(false);
	protected readonly loginPasswordInvalid = signal(false);
	protected readonly loginError = signal('');
	protected readonly loginBusy = signal(false);
	protected readonly loginPasswordVisible = signal(false);
	protected readonly rememberMe = signal(false);

	protected readonly forgotEmail = signal('');

	protected readonly newPassword1 = signal('');
	protected readonly newPassword2 = signal('');
	protected readonly newPassword1Visible = signal(false);
	protected readonly newPasswordMatchError = signal(false);
	protected readonly newPasswordChecks = computed(() => passwordChecks(this.newPassword1()));
	protected readonly newPasswordStrength = computed(() => passwordStrength(this.newPassword1()));

	protected readonly caFirst = signal(INVITE.first);
	protected readonly caLast = signal(INVITE.last);
	protected readonly caPassword1 = signal('');
	protected readonly caPassword2 = signal('');
	protected readonly caPassword1Visible = signal(false);
	protected readonly caTerms = signal(false);
	protected readonly caPasswordChecks = computed(() => passwordChecks(this.caPassword1()));

	protected readonly welcomeCaps = computed<RoleCapabilities>(() => ROLE_CAPS[this.demoRole()]);
	protected readonly welcomeName = computed(() =>
		this.demoRole() === INVITE.role ? INVITE.first : 'Олександре',
	);

	protected readonly toastMessage = signal('');
	private _toastTimer?: ReturnType<typeof setTimeout>;

	protected goto(screen: Screen): void {
		this.screen.set(screen);
	}

	protected onDemoStateChange(value: string): void {
		this.goto(value as Screen);
	}

	protected togglePasswordVisibility(field: 'login' | 'newPassword' | 'createAccount'): void {
		if (field === 'login') this.loginPasswordVisible.update((v) => !v);
		if (field === 'newPassword') this.newPassword1Visible.update((v) => !v);
		if (field === 'createAccount') this.caPassword1Visible.update((v) => !v);
	}

	protected submitLogin(): void {
		const email = this.loginEmail().trim();
		const password = this.loginPassword();

		this.loginEmailInvalid.set(false);
		this.loginPasswordInvalid.set(false);
		this.loginError.set('');

		let bad = false;
		if (!/^\S+@\S+\.\S+$/.test(email)) {
			this.loginEmailInvalid.set(true);
			bad = true;
		}
		if (!password) {
			this.loginPasswordInvalid.set(true);
			bad = true;
		}
		if (bad) return;

		if (email === 'locked@example.com') {
			this.goto('rateLimit');
			return;
		}

		this.loginBusy.set(true);
		setTimeout(() => {
			this.loginBusy.set(false);
			if (email === 'fail@example.com') {
				this.loginError.set('Не вдалося увійти. Email або пароль неправильні.');
				return;
			}
			window.location.href = '/dashboard/';
		}, 700);
	}

	protected submitForgot(): void {
		this.goto('checkEmail');
	}

	protected submitNewPassword(): void {
		const p1 = this.newPassword1();
		const p2 = this.newPassword2();
		const c = passwordChecks(p1);

		this.newPasswordMatchError.set(false);

		if (!c.len || !c.letter || !c.digit) {
			this.showToast('Пароль не відповідає вимогам');
			return;
		}
		if (p1 !== p2) {
			this.newPasswordMatchError.set(true);
			return;
		}
		this.goto('resetSuccess');
	}

	protected submitCreateAccount(): void {
		const p1 = this.caPassword1();
		const p2 = this.caPassword2();
		const c = passwordChecks(p1);

		if (!this.caTerms()) {
			this.showToast('Підтвердьте погодження з умовами використання');
			return;
		}
		if (!c.len || !c.letter || !c.digit) {
			this.showToast('Пароль не відповідає вимогам');
			return;
		}
		if (p1 !== p2) {
			this.showToast('Паролі не збігаються');
			return;
		}
		this.goto('accountCreated');
	}

	protected selectHotel(href: string): void {
		window.location.href = href;
	}

	protected addHotel(): void {
		this.showToast('Створення нового готелю ще у розробці в демо');
	}

	protected openWelcomeCta(): void {
		window.location.href = this.welcomeCaps().href;
	}

	private showToast(text: string): void {
		this.toastMessage.set(text);
		clearTimeout(this._toastTimer);
		this._toastTimer = setTimeout(() => this.toastMessage.set(''), 4200);
	}
}
