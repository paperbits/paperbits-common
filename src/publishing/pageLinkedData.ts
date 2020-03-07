export interface PageLinkedDataContactPoint {
    /**
     * e.g. +1-401-555-1212
     */
    telephone: string;

    /**
     * e.g. Customer service
     */
    contactType: string;
}

export interface PageLinkedDataAddress {
    /**
     * e.g. PostalAddress
     */
    type: string;

    /**
     * e.g. 2000 South Eads.
     */
    streetAddress: string;

    /**
     * e.g. Arlington
     */
    addressLocality: string;

    /**
     * e.g. VA
     */
    addressRegion: string;

    /**
     * e.g. 22202
     */
    postalCode: string;
}

/**
 * Linked data provides a way to standardize information about a page and classify the page content. 
 */
export interface PageLinkedData {
    /**
     * e.g. Organization.
     */
    type: string;

    /**
     * URL, e.g. http://www.example.com
     */
    url: string;

    /**
     * Name, e.g. Paperbits.
     */
    name: string;

    /**
     * Description, e.g. Drag 'n' drop content builder for web apps.
     */
    description: string;

    /**
     * Points of contact.
     */
    contactPoints?: PageLinkedDataContactPoint;

    /**
     * Address.
     */
    address?: PageLinkedDataAddress;
}