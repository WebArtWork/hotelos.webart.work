import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { clearStoredRole, getStoredRole, isPageAllowed, ROLE_LABEL } from '../../shared/role';

interface NavItem {
	key: string;
	href: string;
	icon: string;
	label: string;
	badge?: number;
}

const NAV_ITEMS: NavItem[] = [
	{ key: 'overview', href: '/dashboard', icon: 'overview', label: 'Огляд' },
	{ key: 'calendar', href: '/calendar', icon: 'calendar', label: 'Календар' },
	{ key: 'guests', href: '/guests', icon: 'guests', label: 'Гості' },
	{ key: 'rooms', href: '/rooms', icon: 'hotel', label: 'Номери' },
	{ key: 'payments', href: '/payments', icon: 'wallet', label: 'Оплати' },
	{ key: 'housekeeping', href: '/housekeeping', icon: 'clean', label: 'Прибирання' },
	{ key: 'messages', href: '/messages', icon: 'message', label: 'Повідомлення' },
	{ key: 'automations', href: '/automations', icon: 'automation', label: 'Автоматизації' },
	{ key: 'sales', href: '/sales', icon: 'chart', label: 'Продажі' },
	{ key: 'ai', href: '/ai', icon: 'spark', label: 'AI-помічник' },
];

const THEME_KEY = 'hotelos_theme';

@Component({
	selector: 'app-shell',
	imports: [IconComponent, RouterLink],
	templateUrl: './app-shell.component.html',
	styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
	private readonly _document = inject(DOCUMENT);
	private readonly _router = inject(Router);

	readonly activeNav = input<string>('');
	readonly housekeepingBadge = input<number | null>(null);
	readonly greetingTitle = input('Добрий день, Олександре');
	readonly greetingSubtitle = input('Grand Hotel · Кам’янець-Подільський');

	protected readonly role = signal(getStoredRole());
	protected readonly roleLabel = computed(() => {
		const role = this.role();
		return role ? ROLE_LABEL[role] : '';
	});

	protected readonly navItems = computed(() => {
		const role = this.role();
		if (!role) return NAV_ITEMS;
		return NAV_ITEMS.filter((item) => isPageAllowed(role, item.href.slice(1)));
	});

	protected readonly mobileNavItems = computed(() => this.navItems().slice(0, 3));

	protected readonly showTeam = computed(() => {
		const role = this.role();
		return !role || isPageAllowed(role, 'team');
	});
	protected readonly showSettings = computed(() => {
		const role = this.role();
		return !role || isPageAllowed(role, 'settings');
	});

	protected readonly sidebarOpen = signal(false);
	protected readonly isDark = signal(this._readInitialTheme() === 'dark');

	protected toggleSidebar(): void {
		this.sidebarOpen.update((open) => !open);
	}

	protected closeSidebar(): void {
		this.sidebarOpen.set(false);
	}

	protected logout(): void {
		clearStoredRole();
		this._router.navigateByUrl('/login');
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
