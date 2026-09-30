import { Service, inject } from '@angular/core';
import {
	addDoc,
	arrayUnion,
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	Timestamp,
	updateDoc,
	where,
} from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { companyProfile } from '../company/company.data';
import { FirebaseService } from './firebase.service';

export type SubmissionStatus = 'new' | 'inProgress' | 'booked' | 'closed' | 'spam';

export interface LeadSubmission {
	name: string;
	message: string;
	phone?: string;
	email?: string;
	form: string;
}

export interface SubmissionHistoryEntry {
	time: string;
	text: string;
}

export interface SubmissionRecord {
	id: string;
	name: string;
	phone: string;
	email: string;
	site: string;
	form: string;
	message: string;
	status: SubmissionStatus;
	history: SubmissionHistoryEntry[];
	receivedAt: Date | null;
}

/**
 * Writes visitor-facing form leads to the shared `submissions` Firestore collection
 * (create-only, see firestore.rules) and, for the CRM, lists/updates a single hotel's
 * leads. Every landing-page project that copies this service into `feature/firebase/`
 * writes into the same collection, tagged with its own `hotelId` (= environment.companyId)
 * so each hotel's CRM only ever sees its own submissions.
 */
@Service()
export class SubmissionsService {
	private readonly _firebase = inject(FirebaseService);

	async submit(lead: LeadSubmission): Promise<void> {
		const firestore = this._firebase.firestore;
		if (!firestore) return;

		await addDoc(collection(firestore, 'submissions'), {
			...lead,
			hotelId: environment.companyId,
			site: companyProfile.siteUrl,
			status: 'new' satisfies SubmissionStatus,
			history: [],
			createdAt: serverTimestamp(),
		});
	}

	/** Live list of a hotel's submissions, newest first. Returns an unsubscribe function. */
	listen(hotelId: string, onChange: (submissions: SubmissionRecord[]) => void): () => void {
		const firestore = this._firebase.firestore;
		if (!firestore) return () => {};

		const submissionsQuery = query(
			collection(firestore, 'submissions'),
			where('hotelId', '==', hotelId),
			orderBy('createdAt', 'desc'),
		);

		return onSnapshot(submissionsQuery, (snapshot) => {
			onChange(
				snapshot.docs.map((docSnapshot) => {
					const data = docSnapshot.data();
					const createdAt = data['createdAt'] as Timestamp | undefined;
					return {
						id: docSnapshot.id,
						name: data['name'] ?? '',
						phone: data['phone'] ?? '',
						email: data['email'] ?? '',
						site: data['site'] ?? '',
						form: data['form'] ?? '',
						message: data['message'] ?? '',
						status: (data['status'] as SubmissionStatus) ?? 'new',
						history: (data['history'] as SubmissionHistoryEntry[]) ?? [],
						receivedAt: createdAt?.toDate() ?? null,
					};
				}),
			);
		});
	}

	async updateStatus(id: string, status: SubmissionStatus, note: string): Promise<void> {
		const firestore = this._firebase.firestore;
		if (!firestore) return;

		await updateDoc(doc(firestore, 'submissions', id), {
			status,
			history: arrayUnion({ time: new Date().toISOString(), text: note } satisfies SubmissionHistoryEntry),
		});
	}
}
