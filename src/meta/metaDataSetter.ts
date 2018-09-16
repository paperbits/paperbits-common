export class MetaDataSetter {
    public static iconContentType = "image/x-icon";

    public static setFavIcon(iconHref: string) {
        if (!iconHref) {
            return;
        }
        const link = <HTMLLinkElement>document.querySelector("link[rel*='icon']");

        if (link) {
            link.type = MetaDataSetter.iconContentType;
            link.rel = "icon";
            link.href = iconHref;
        }
    }

    public static setKeywords(keywords: string) {
        MetaDataSetter.setMetaElement(keywords, "keywords");
    }

    public static setDescription(description: string) {
        MetaDataSetter.setMetaElement(description, "description");
    }

    public static setAuthor(author: string) {
        MetaDataSetter.setMetaElement(author, "author");
    }

    public static setScriptElement(content: object, type: string) {
        let existScript = <HTMLScriptElement>MetaDataSetter.getMetaElement("type", type);
        let script = existScript || document.createElement("script");
        script.setAttribute("type", type);
        script.text = JSON.stringify(content);
        document.head.appendChild(script);
    }

    public static setMetaObject(data: object, attributeName: string) {
        Object.keys(data).forEach(attrValue => {
            MetaDataSetter.setMetaElement(data[attrValue], undefined, attributeName, attrValue);
        });
    }

    public static setMetaElement(content: string, name?: string, attributeName?: string, attributeValue?: string) {
        let existMeta = name ? <HTMLMetaElement>MetaDataSetter.getMetaElement("name", name) : <HTMLMetaElement>MetaDataSetter.getMetaElement(attributeName, attributeValue);
        let meta = existMeta || document.createElement("meta");
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

    private static getMetaElement(attributeName: string, attributeValue: string) {
        return attributeName && attributeValue && document.head.querySelector(`[${attributeName}=${attributeValue}]`)
    }
}