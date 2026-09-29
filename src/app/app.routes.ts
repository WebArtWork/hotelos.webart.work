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
				title: 'Hotel Upwork: Увесь готель в одній простій системі',
				titleSuffix: '',
				description:
					'Hotel Upwork: бронювання, гості, оплати, прибирання та комунікація в одній простій системі для незалежних готелів.',
			},
		},
		loadComponent: () =>
			import('./pages/landing/landing.component').then((m) => m.LandingComponent),
	},
	{
		path: 'pricing',
		data: {
			meta: {
				title: 'Тарифи · Hotel Upwork',
				titleSuffix: '',
				description:
					'Тарифи Hotel Upwork: безкоштовний Start з календарем і заявками з сайтів, Pro для щоденної роботи готелю та Enterprise з автоматизаціями, аналітикою і AI.',
			},
		},
		loadComponent: () => import('./pages/pricing/pricing.component').then((m) => m.PricingComponent),
	},
	{
		path: 'login',
		data: {
			meta: {
				title: 'Вхід · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: вхід до системи.',
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
				title: 'Огляд готелю · Hotel Upwork',
				titleSuffix: '',
				description:
					'Hotel Upwork: щоденний центр управління готелем. Заїзди, номери, оплати та завдання в одному огляді.',
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
				title: 'Календар · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: календар. Усі номери, бронювання та вільні дати в одному місці.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () =>
			import('./pages/calendar/calendar.component').then((m) => m.CalendarComponent),
	},
	{
		path: 'submissions',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Заявки · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: заявки з форм ваших сайтів в одному місці.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () =>
			import('./pages/submissions/submissions.component').then((m) => m.SubmissionsComponent),
	},
	{
		path: 'guests',
		canActivate: [roleGuard],
		data: {
			meta: {
				title: 'Гості · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: база гостей готелю, історія проживань та контакти.',
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
				title: 'Номери · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: номерний фонд, типи номерів та їх статуси.',
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
				title: 'Оплати · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: оплати, заборгованості та фінансова аналітика.',
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
				title: 'Прибирання · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: керування прибиранням номерів та завданнями персоналу.',
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
				title: 'Повідомлення · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: спілкування з гостями в одному вхідному ящику.',
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
				title: 'Автоматизації · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: автоматичні сценарії та правила для щоденних завдань.',
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
				title: 'Продажі · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: аналітика продажів, канали бронювань та кампанії.',
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
				title: 'AI-помічник · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: AI-помічник для швидких відповідей та дій по готелю.',
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
				title: 'Команда · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: керування командою, ролями та доступами співробітників.',
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
				title: 'Налаштування · Hotel Upwork',
				titleSuffix: '',
				description: 'Hotel Upwork: налаштування готелю, бронювань та інтеграцій.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
	},
	{
		path: '**',
		redirectTo: ({ url }) => {
			const role = isPlatformBrowser(inject(PLATFORM_ID)) ? getStoredRole() : null;
			const home = role ? defaultPageFor(role) : null;
			if (!home) return '';
			const missing = url.map((s) => s.path).join('/');
			return inject(Router).createUrlTree(['/' + home], { queryParams: { missing } });
		},
	},
];
