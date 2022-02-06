/**
 * Content type. Defines the shape of a content item.
 */
export interface ContentType {
    /**
     * Content type name, e.g. `page`.
     */
    name: string;

    /**
     * Content type display name (shown in the designer), e.g. `Website page`.
     */
    displayName: string;

    /**
     * Content type properties.
     */
    properties: ContentTypeProperty[];
}

/**
 * Content type property.
 */
export interface ContentTypeProperty {
    /**
     * Property name of the content type property, e.g. `title`.
     */
    name: string;

    /**
     * Property display name (shown up in the designer) of the content type property , e.g. `Page title`.
     */
    displayName: string;

    /***
     * Property description, e.g. `Title of the website page`.
     */
    description: string;

    /**
     * Property type.
     */
    type: ContentTypePropertyType;
}

/**
 * Property type. Defines what input control used property in the desinger for particular content type.
 */
export enum ContentTypePropertyType {
    /**
     * Text. Used for titles, names, etc.
     */
    text = "text",

    /**
     * Number, e.g. ID, order number, rating, etc.
     */
    number = "number",

    /**
     * Location, coordinats like latitude and longitude.
     */
    location = "location",

    /**
     * Date and time, e.g. event date.
     */
    dateTime = "dateTime",

    /**
     * Boolean.
     */
    boolean = "boolean",

    /**
     * JSON object.
     */
    object = "object",

    /**
     * Content, i.e. the content of page body.
     */
    content = "content"
}
