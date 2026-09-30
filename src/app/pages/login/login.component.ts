import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { AuthService } from '../../feature/firebase/auth.service';
import { defaultPageFor, setStoredRole } from '../../shared/role';

type Screen = 'login' | 'forgot' | 'checkEmail';

const AUTH_ERROR_MESSAGE: Record<string, string> = {
	'auth/invalid-email': 'Введіть правильну email-адресу.',
	'auth/invalid-credential': 'Email або пароль неправильні.',
	'auth/user-disabled': 'Цей доступ деактивовано.',
	'auth/too-many-requests': 'Забагато спроб входу. Спробуйте пізніше або відновіть пароль.',
};

function authErrorMessage(error: unknown): string {
	if (error instanceof FirebaseError) return AUTH_ERROR_MESSAGE[error.code] ?? 'Не вдалося увійти. Спробуйте ще раз.';
	return 'Не вдалося увійти. Спробуйте ще раз.';
}

@Component({
	selector: 'app-login',
	imports: [FormsModule, RouterLink],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	private readonly _router = inject(Router);
	private readonly _auth = inject(AuthService);

	protected readonly screen = signal<Screen>('login');

	protected readonly loginEmail = signal('');
	protected readonly loginPassword = signal('');
	protected readonly loginEmailInvalid = signal(false);
	protected readonly loginPasswordInvalid = signal(false);
	protected readonly loginError = signal('');
	protected readonly loginBusy = signal(false);
	protected readonly loginPasswordVisible = signal(false);
	protected readonly rememberMe = signal(false);

	protected readonly forgotEmail = signal('');
	protected readonly forgotBusy = signal(false);

	protected goto(screen: Screen): void {
		this.loginError.set('');
		this.screen.set(screen);
	}

	protected togglePasswordVisibility(): void {
		this.loginPasswordVisible.update((v) => !v);
	}

	protected async submitLogin(): Promise<void> {
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

		this.loginBusy.set(true);
		try {
			await this._auth.login(email, password);
			// Every Firebase-authenticated account is CRM staff; the Owner assigns the
			// real role on the Team page. Until that page writes a per-user role, treat
			// every signed-in account as Owner so all pages stay reachable.
			setStoredRole('owner');
			this._router.navigateByUrl('/' + (defaultPageFor('owner') ?? ''));
		} catch (error) {
			this.loginError.set(authErrorMessage(error));
		} finally {
			this.loginBusy.set(false);
		}
	}

	protected async submitForgot(): Promise<void> {
		const email = this.forgotEmail().trim();
		if (!/^\S+@\S+\.\S+$/.test(email)) return;

		this.forgotBusy.set(true);
		try {
			await this._auth.sendPasswordReset(email);
		} catch {
			// Firebase already reports "user not found" here; show the same neutral
			// confirmation either way so the flow can't be used to enumerate accounts.
		} finally {
			this.forgotBusy.set(false);
			this.goto('checkEmail');
		}
	}
}
