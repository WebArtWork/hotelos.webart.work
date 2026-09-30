/** One hotel the signed-in account has access to (`hotels/{hotelId}`, see HotelService). */
export interface HotelSummary {
	id: string;
	name: string;
	city: string;
}

const HOTEL_ID_KEY = 'hotelup_hotel_id';
const HOTELS_KEY = 'hotelup_hotels';

/**
 * The hotel the signed-in account is working in right now. An account may own several hotels;
 * the id is picked at login / in the sidebar switcher and cached so it survives reloads.
 */
export function getRealHotelId(): string | null {
	try {
		return localStorage.getItem(HOTEL_ID_KEY);
	} catch {
		return null;
	}
}

export function setRealHotelId(hotelId: string): void {
	try {
		localStorage.setItem(HOTEL_ID_KEY, hotelId);
	} catch {
		/* ignore storage errors (private mode, etc.) */
	}
}

/** Cached list of the account's hotels, so the sidebar renders before Firestore answers. */
export function getStoredHotels(): HotelSummary[] {
	try {
		const parsed: unknown = JSON.parse(localStorage.getItem(HOTELS_KEY) ?? '[]');
		return Array.isArray(parsed) ? (parsed as HotelSummary[]).filter((hotel) => typeof hotel?.id === 'string') : [];
	} catch {
		return [];
	}
}

export function setStoredHotels(hotels: HotelSummary[]): void {
	try {
		localStorage.setItem(HOTELS_KEY, JSON.stringify(hotels));
	} catch {
		/* ignore storage errors (private mode, etc.) */
	}
}

export function clearRealHotel(): void {
	try {
		localStorage.removeItem(HOTEL_ID_KEY);
		localStorage.removeItem(HOTELS_KEY);
	} catch {
		/* ignore storage errors (private mode, etc.) */
	}
}
