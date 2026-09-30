import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getStoredPlan, planIncludes } from './plan';
import { defaultPageFor, getStoredRole, isPageAllowed } from './role';

export const roleGuard: CanActivateFn = (route) => {
	const platformId = inject(PLATFORM_ID);
	if (!isPlatformBrowser(platformId)) return true;

	const router = inject(Router);
	const role = getStoredRole();
	if (!role) return router.parseUrl('/demo');

	const plan = getStoredPlan();
	const home = defaultPageFor(role, plan);
	if (!home) return router.parseUrl('/login');

	const path = route.routeConfig?.path ?? '';
	if (!isPageAllowed(role, path)) {
		return router.createUrlTree(['/' + home], { queryParams: { denied: path } });
	}
	if (!planIncludes(plan, path)) {
		return router.createUrlTree(['/' + home], { queryParams: { locked: path } });
	}

	return true;
};
