import { RenderMode, ServerRoute } from '@angular/ssr';

const PROTECTED_PATHS = [
	'dashboard',
	'calendar',
	'guests',
	'rooms',
	'payments',
	'housekeeping',
	'messages',
	'automations',
	'sales',
	'ai',
	'team',
	'settings',
];

export const serverRoutes: ServerRoute[] = [
	...PROTECTED_PATHS.map(
		(path): ServerRoute => ({
			path,
			renderMode: RenderMode.Client,
		}),
	),
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
