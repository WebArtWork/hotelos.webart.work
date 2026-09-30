const HOTEL_ID_KEY = 'hotelup_hotel_id';

/**
 * The signed-in owner's hotel, resolved once at login from `hotels/{hotelId}.ownerUids`
 * (see HotelService) and cached locally so pages don't re-resolve it on every navigation.
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

export function clearRealHotelId(): void {
	try {
		localStorage.removeItem(HOTEL_ID_KEY);
	} catch {
		/* ignore storage errors (private mode, etc.) */
	}
}
