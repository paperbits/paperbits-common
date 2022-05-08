import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";
import { Geolocation, GeocodingService } from "./";

export class GoogleGeocodingService implements GeocodingService {
    private initPromise: Promise<any>;
    private geocoder: google.maps.Geocoder;

    constructor(private readonly googleMapsApiKey: string) {
        this.geocode = this.geocode.bind(this);
        this.initialize();
    }

    public initialize(): Promise<void> {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this.loadGoogleApi();
    }

    private async loadGoogleApi(): Promise<void> {
        const options: Partial<LoaderOptions> = {/* todo */ };
        const loader = new Loader({ apiKey: this.googleMapsApiKey, ...options });
        const google = await loader.load();
        this.geocoder = new google.maps.Geocoder();
    }

    private geocode(request: google.maps.GeocoderRequest): Promise<google.maps.LatLng> {
        return new Promise<google.maps.LatLng>((resolve, reject) => {
            this.geocoder.geocode(request, (results: google.maps.GeocoderResult[], status) => {
                switch (status) {
                    case google.maps.GeocoderStatus.OK:
                        const position = results[0].geometry.location;
                        resolve(position);
                        break;
                    case google.maps.GeocoderStatus.REQUEST_DENIED:
                        reject(`Could not geocode specified location. This wesbite or API key is not allowed to use geocoder.`);
                        break;
                    case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
                        reject(`Could not geocode specified location. Request limit exceeded.`);
                        break;
                    default:
                        reject(`Could not geocode specified location.`);
                }
            });
        });
    }

    public async addressToGeolocation(address: string): Promise<Geolocation> {
        if (!this.googleMapsApiKey) {
            throw new Error(`Google Maps API key not specified.`);
        }

        await this.initialize();

        const request: google.maps.GeocoderRequest = { address: address };
        const response = await this.geocode(request);
        const result = { address: address, lat: response.lat(), lng: response.lng() };

        return result;
    }
}