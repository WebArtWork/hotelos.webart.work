import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanonicalService } from '@wawjs/ngx-default';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	template: `<router-outlet />`,
})
export class App {
	private readonly _canonicalService = inject(CanonicalService);

	constructor() {
		this._canonicalService.initialize();
	}
}
