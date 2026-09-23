import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { defaultPageFor, ROLE_LABEL, setStoredRole, type Role } from '../../shared/role';

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
	| 'genericError'
	| 'testLogin';

interface RoleCapabilities {
	can: string[];
	cannot: string[];
	cta: string;
}

const INVITE = {
	hotel: 'Grand Hotel',
	inviter: 'Олександр Гончар',
	role: 'reception' as Role,
	email: 'iryna@example.com',
	first: 'Ірина',
	last: 'Петренко',
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
	},
	manager: {
		can: ['Dashboard', 'Calendar', 'Бронювання', 'Гості', 'Оплати', 'Прибирання', 'Повідомлення', 'Продажі'],
		cannot: ['критичні налаштування безпеки', 'деактивація готелю'],
		cta: 'Відкрити Dashboard',
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
	},
	owner: {
		can: ['повний доступ до Hotel OS', 'управління готелем та командою', 'фінансові та критичні налаштування'],
		cannot: [],
		cta: 'Відкрити Dashboard',
	},
	sales: {
		can: ['аналітику продажів та джерел бронювань', 'кампанії та канали', 'бачити календар та бронювання'],
		cannot: ['фінансові налаштування', 'управління командою', 'прибирання'],
		cta: 'Відкрити продажі',
	},
	accountant: {
		can: ['оплати, рахунки та депозити', 'повернення коштів', 'фінансову аналітику'],
		cannot: ['календар та бронювання', 'управління командою', 'прибирання'],
		cta: 'Відкрити оплати',
	},
	maintenance: {
		can: ['бачити номери з несправностями', 'відмічати ремонт виконаним', 'повідомляти про проблеми'],
		cannot: ['гостьові дані та оплати', 'фінансову інформацію', 'налаштування готелю'],
		cta: 'Відкрити прибирання',
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
	imports: [FormsModule, RouterLink],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	private readonly _router = inject(Router);

	protected readonly invite = INVITE;
	protected readonly roleLabel = ROLE_LABEL;

	/** Demo state/role switcher bar — hidden for client-facing demos, kept for internal use. */
	protected readonly showDemoBar = false;

	protected readonly screen = signal<Screen>('testLogin');
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

	protected readonly testLoginRoles: Role[] = ['owner', 'manager', 'reception', 'housekeeping', 'sales', 'accountant', 'maintenance'];

	protected goto(screen: Screen): void {
		this.screen.set(screen);
	}

	protected testLoginAs(role: Role): void {
		setStoredRole(role);
		this._navigate('/' + defaultPageFor(role));
	}

	private _navigate(url: string): void {
		this._router.navigateByUrl(url.replace(/\/$/, '') || '/');
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
			setStoredRole(this.demoRole());
			this._navigate('/' + defaultPageFor(this.demoRole()));
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
		setStoredRole(this.demoRole());
		this._navigate(href);
	}

	protected addHotel(): void {
		this.showToast('Створення нового готелю ще у розробці в демо');
	}

	protected openWelcomeCta(): void {
		setStoredRole(this.demoRole());
		this._navigate('/' + defaultPageFor(this.demoRole()));
	}

	private showToast(text: string): void {
		this.toastMessage.set(text);
		clearTimeout(this._toastTimer);
		this._toastTimer = setTimeout(() => this.toastMessage.set(''), 4200);
	}
}
