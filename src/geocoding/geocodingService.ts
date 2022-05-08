import { Geolocation } from "./geolocation";

export interface GeocodingService {
    addressToGeolocation(address: string): Promise<Geolocation>;
}