import { Service, inject } from '@angular/core';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

/**
 * Resolves which hotel a signed-in Firebase Auth user owns, via `hotels/{hotelId}.ownerUids`.
 * Hotel documents are created manually (console or an admin script) when an Owner account is
 * provisioned — see AGENTS.md-adjacent conversation history, no self-service hotel creation yet.
 */
@Service()
export class HotelService {
	private readonly _firebase = inject(FirebaseService);

	async resolveHotelId(uid: string): Promise<string | null> {
		const firestore = this._firebase.firestore;
		if (!firestore) return null;

		const snapshot = await getDocs(query(collection(firestore, 'hotels'), where('ownerUids', 'array-contains', uid)));
		return snapshot.empty ? null : snapshot.docs[0].id;
	}
}
