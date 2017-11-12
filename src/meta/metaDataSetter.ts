export class metaDataSetter {
    public static iconContentType = 'image/x-icon';
    public static setFavIcon(iconHref: string) {
        if(!iconHref) {
            return;
        }
        let link = <HTMLLinkElement>document.querySelector("link[rel*='icon']") || new HTMLLinkElement();
        link.type = metaDataSetter.iconContentType;
        link.rel = 'icon';
        link.href = iconHref;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    public static setKeywords(keywords: string) {
        document.getElementsByTagName('meta')["keywords"].content = keywords;
    }

    public static setDescription(description: string) {
        document.getElementsByTagName('meta')["description"].content = description;
    }
}