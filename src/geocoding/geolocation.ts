/**
 * Geo coordinates.
 */
export interface Geolocation {
    /**
     * Address, e.g. `400 Broad St, Seattle, WA 98109`.
     */
    address: string;

    /**
     * Latitude, e.g. `47.6205`.
     */
    lat?: number;

    /**
     * Longitude. e.g. `22.3493`.
     */
    lng?: number;
}
