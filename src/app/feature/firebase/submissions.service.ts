import { Service, inject } from '@angular/core';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { companyProfile } from '../company/company.data';
import { FirebaseService } from './firebase.service';

export interface LeadSubmission {
	name: string;
	message: string;
	phone?: string;
	email?: string;
	form: string;
}

/**
 * Writes visitor-facing form leads to the shared `submissions` Firestore collection
 * (create-only, see firestore.rules). Every landing-page project that copies this
 * service into `feature/firebase/` writes into the same collection, tagged with its
 * own `site` domain, so the CRM can list leads across all connected sites.
 */
@Service()
export class SubmissionsService {
	private readonly _firebase = inject(FirebaseService);

	async submit(lead: LeadSubmission): Promise<void> {
		const firestore = this._firebase.firestore;
		if (!firestore) return;

		await addDoc(collection(firestore, 'submissions'), {
			...lead,
			site: companyProfile.siteUrl,
			createdAt: serverTimestamp(),
		});
	}
}
