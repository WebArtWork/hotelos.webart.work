import { Service, signal } from '@angular/core';
import { COMPANY_FALLBACK } from './company.const';
import { CompanyProfile } from './company.interface';

@Service()
export class CompanyService {
	readonly company = signal<CompanyProfile>(COMPANY_FALLBACK);
}
