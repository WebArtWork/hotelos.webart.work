import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		data: {
			meta: {
				title: 'Hotel OS — Увесь готель в одній простій системі',
				titleSuffix: '',
				description:
					'Hotel OS — бронювання, гості, оплати, прибирання та комунікація в одній простій системі для незалежних готелів.',
			},
		},
		loadComponent: () =>
			import('./pages/landing/landing.component').then((m) => m.LandingComponent),
	},
	{
		path: 'login',
		data: {
			meta: {
				title: 'Вхід — Hotel OS',
				titleSuffix: '',
				description: 'Hotel OS — вхід до системи.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
	},
	{
		path: 'dashboard',
		data: {
			meta: {
				title: 'Огляд готелю — Hotel OS',
				titleSuffix: '',
				description:
					'Hotel OS — щоденний центр управління готелем. Заїзди, номери, оплати та завдання в одному огляді.',
				robots: 'noindex, nofollow',
			},
		},
		loadComponent: () =>
			import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
