import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { defaultPageFor, getStoredRole } from './shared/role';
import { roleGuard } from './shared/role.guard';

export const routes: Routes = [
	{
		path: '',
		data: {
			meta: {
				title: 'Hotel OS: Увесь готель в одній простій системі',
				titleSuffix: '',
				description:
					'Hotel OS: бронювання, гості, оплати, прибирання та комунікація в одній простій системі для незалежних готелів.',
			},
		},
		loadComponent: () =>
			import('./pages/landing/landing.component').then((m) => m.LandingComponent),
	},
	{
		path: 'login',
		data: {
			meta: {
				title: 'Вхід · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: вхід до системи.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
	},
	{
		path: 'dashboard',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Огляд готелю · Hotel OS',
				titleSuffix: '',
				description:
					'Hotel OS: щоденний центр управління готелем. Заїзди, номери, оплати та завдання в одному огляді.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () =>
			import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
	},
	{
		path: 'calendar',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Календар · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: календар. Усі номери, бронювання та вільні дати в одному місці.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () =>
			import('./pages/calendar/calendar.component').then((m) => m.CalendarComponent),
	},
	{
		path: 'guests',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Гості · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: база гостей готелю, історія проживань та контакти.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/guests/guests.component').then((m) => m.GuestsComponent),
	},
	{
		path: 'rooms',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Номери · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: номерний фонд, типи номерів та їх статуси.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/rooms/rooms.component').then((m) => m.RoomsComponent),
	},
	{
		path: 'payments',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Оплати · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: оплати, заборгованості та фінансова аналітика.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/payments/payments.component').then((m) => m.PaymentsComponent),
	},
	{
		path: 'housekeeping',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Прибирання · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: керування прибиранням номерів та завданнями персоналу.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () =>
			import('./pages/housekeeping/housekeeping.component').then((m) => m.HousekeepingComponent),
	},
	{
		path: 'messages',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Повідомлення · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: спілкування з гостями в одному вхідному ящику.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/messages/messages.component').then((m) => m.MessagesComponent),
	},
	{
		path: 'automations',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Автоматизації · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: автоматичні сценарії та правила для щоденних завдань.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () =>
			import('./pages/automations/automations.component').then((m) => m.AutomationsComponent),
	},
	{
		path: 'sales',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Продажі · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: аналітика продажів, канали бронювань та кампанії.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/sales/sales.component').then((m) => m.SalesComponent),
	},
	{
		path: 'ai',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'AI-помічник · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: AI-помічник для швидких відповідей та дій по готелю.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/ai/ai.component').then((m) => m.AiComponent),
	},
	{
		path: 'team',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Команда · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: керування командою, ролями та доступами співробітників.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/team/team.component').then((m) => m.TeamComponent),
	},
	{
		path: 'settings',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Налаштування · Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS: налаштування готелю, бронювань та інтеграцій.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
	},
	{
		path: '**',
		redirectTo: ({ url }) => {
			const role = isPlatformBrowser(inject(PLATFORM_ID)) ? getStoredRole() : null;
			if (!role) return '';
			const missing = url.map((s) => s.path).join('/');
			return inject(Router).createUrlTree(['/' + defaultPageFor(role)], { queryParams: { missing } });
		},
	},
];
