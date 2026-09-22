import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { defaultPageFor, getStoredRole, isPageAllowed } from './role';

export const roleGuard: CanActivateFn = (route) => {
	const platformId = inject(PLATFORM_ID);
	if (!isPlatformBrowser(platformId)) return true;

	const router = inject(Router);
	const role = getStoredRole();
	if (!role) return router.parseUrl('/login');

	const path = route.routeConfig?.path ?? '';
	if (!isPageAllowed(role, path)) {
		return router.parseUrl('/' + defaultPageFor(role));
	}

	return true;
};
