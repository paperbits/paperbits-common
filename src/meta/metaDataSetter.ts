export class MetaDataSetter {
    public static iconContentType: string = "image/x-icon";

    public static setFavIcon(iconUrl: string): void {
        if (!iconUrl) {
            return;
        }
        
        const link = <HTMLLinkElement>document.querySelector("link[rel*='icon']");

        if (link) {
            link.type = MetaDataSetter.iconContentType;
            link.rel = "icon";
            link.href = iconUrl;
        }
    }

    public static setKeywords(keywords: string): void {
        MetaDataSetter.setMetaElement(keywords, "keywords");
    }

    public static setDescription(description: string): void {
        MetaDataSetter.setMetaElement(description, "description");
    }

    public static setAuthor(author: string): void {
        MetaDataSetter.setMetaElement(author, "author");
    }

    public static setScriptElement(content: object, type: string): void {
        const existScript = <HTMLScriptElement>MetaDataSetter.getMetaElement("type", type);
        const script = existScript || document.createElement("script");
        script.setAttribute("type", type);
        script.text = JSON.stringify(content);
        document.head.appendChild(script);
    }

    public static setMetaObject(data: object, attributeName: string): void {
        Object.keys(data).forEach(attrValue => {
            MetaDataSetter.setMetaElement(data[attrValue], undefined, attributeName, attrValue);
        });
    }

    public static setMetaElement(content: string, name?: string, attributeName?: string, attributeValue?: string): void {
        const existMeta = name ? <HTMLMetaElement>MetaDataSetter.getMetaElement("name", name) : <HTMLMetaElement>MetaDataSetter.getMetaElement(attributeName, attributeValue);
        const meta = existMeta || document.createElement("meta");
        if (name) {
            meta.name = name;
        }
        if (attributeName && attributeValue) {
            meta.setAttribute(attributeName, attributeValue);
        }
        meta.content = content;
        if (!existMeta) {
            document.head.appendChild(meta);
        }
    }

    private static getMetaElement(attributeName: string, attributeValue: string): Element {
        return attributeName && attributeValue && document.head.querySelector(`[${attributeName}=${attributeValue}]`);
    }
}