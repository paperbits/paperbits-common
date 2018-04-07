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
        document.head.appendChild(link);
    }

    public static setKeywords(keywords: string) {
        metaDataSetter.setMetaElement(keywords, "keywords");
    }

    public static setDescription(description: string) {        
        metaDataSetter.setMetaElement(description, "description");
    }

    public static setAuthor(author: string) {
        metaDataSetter.setMetaElement(author, "author");
    }

    public static setScriptElement(content: object, type: string) {
        let existScript = <HTMLScriptElement>metaDataSetter.getMetaElement("type", type);
        let script = existScript || document.createElement("script");
        script.setAttribute("type", type);
        script.text = JSON.stringify(content);
        document.head.appendChild(script);
    }

    public static setMetaObject(data: object, attributeName: string) {
        Object.keys(data).forEach(attrValue => {
            metaDataSetter.setMetaElement(data[attrValue], undefined, attributeName, attrValue);
        });
    }

    public static setMetaElement(content: string, name?: string, attributeName?: string, attributeValue?: string) {
        let existMeta = name ? <HTMLMetaElement>metaDataSetter.getMetaElement("name", name) : <HTMLMetaElement>metaDataSetter.getMetaElement(attributeName, attributeValue);
        let meta = existMeta || document.createElement("meta");
        if(name) {
            meta.name = name;
        }        
        if(attributeName && attributeValue) {
            meta.setAttribute(attributeName, attributeValue);
        }
        meta.content = content;
        if (!existMeta) {
            document.head.appendChild(meta);
        }
    }

    private static getMetaElement(attributeName: string, attributeValue:string) {
        return attributeName && attributeValue &&  document.head.querySelector(`[${attributeName}=${attributeValue}]`)
    }
}