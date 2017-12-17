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
        metaDataSetter.setElementByTagName("keywords", keywords);
    }

    public static setDescription(description: string) {
        metaDataSetter.setElementByTagName("description", description);
    }

    public static setAuthor(author: string) {
        metaDataSetter.setElementByTagName("author", author);
    }

    private static setElementByTagName(tagName: string, content: string) {
        let tag = document.getElementsByTagName('meta')[tagName];
        if (tag) {
            tag.content = content;
        } else {
            let meta = document.createElement('meta');
            meta.setAttribute('content', content);
            document.getElementsByTagName('head')[0].appendChild(meta);
        }
    }
}