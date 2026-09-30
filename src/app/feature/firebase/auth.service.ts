import { Service, inject, signal } from '@angular/core';
import {
	User,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service';

/** Real Firebase Authentication for CRM staff sign-in (owner/staff accounts, see firestore.rules). */
@Service()
export class AuthService {
	private readonly _firebase = inject(FirebaseService);

	readonly user = signal<User | null>(null);

	constructor() {
		const auth = this._firebase.auth;
		if (auth) onAuthStateChanged(auth, (user) => this.user.set(user));
	}

	async login(email: string, password: string): Promise<void> {
		const auth = this._firebase.auth;
		if (!auth) throw new Error('Firebase Auth is not available');
		await signInWithEmailAndPassword(auth, email, password);
	}

	async sendPasswordReset(email: string): Promise<void> {
		const auth = this._firebase.auth;
		if (!auth) throw new Error('Firebase Auth is not available');
		await sendPasswordResetEmail(auth, email);
	}

	async logout(): Promise<void> {
		const auth = this._firebase.auth;
		if (!auth) return;
		await signOut(auth);
	}
}
