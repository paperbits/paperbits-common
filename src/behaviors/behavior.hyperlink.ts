import { HyperlinkModel, HyperlinkTarget } from "../permalinks";
import { Attributes, DataAttributes, HyperlinkRels, NavigationTarget } from "../html";
import { BehaviorHandle } from "./behavior";

export class HyperlinkBehavior {
    public static attach(element: HTMLElement, hyperlink: HyperlinkModel): BehaviorHandle {
        let href = "#";
        let toggleType = null;
        let triggerEvent = null;
        let toggleTarget = null;
        let isDownloadLink = false;
        let targetWindow = null;
        let rels = null;

        if (hyperlink) {
            switch (hyperlink.target) {
                case HyperlinkTarget.popup:
                    href = "javascript:void(0)";
                    toggleType = "popup";
                    triggerEvent = hyperlink.triggerEvent;
                    toggleTarget = `#${hyperlink.targetKey.replace("popups/", "popups")}`;
                    break;

                case HyperlinkTarget.download:
                    href = hyperlink.href;
                    isDownloadLink = true;
                    break;

                default:
                    toggleType = element.getAttribute("data-toggle");
                    href = `${hyperlink.href}${hyperlink.anchor ? "#" + hyperlink.anchor : ""}`;
                    targetWindow = hyperlink.target || NavigationTarget.Self;

                    if (hyperlink.targetKey?.startsWith("urls/")) {
                        rels = [HyperlinkRels.NoOpener, HyperlinkRels.NoReferrer].join(" ");
                    }
            }
        }

        const hyperlinkObj = {
            [DataAttributes.Toggle]: toggleType,
            [DataAttributes.TriggerEvent]: triggerEvent,
            [DataAttributes.Target]: toggleTarget,
            [Attributes.Href]: href,
            [Attributes.Target]: targetWindow,
            [Attributes.Download]: isDownloadLink ? "" : null,
            [Attributes.Rel]: rels
        };

        for (const key in hyperlinkObj) {
            if (hyperlinkObj[key] !== null) {
                element.setAttribute(key, hyperlinkObj[key]);
            } else {
                element.removeAttribute(key);
            }
        }

        // Return a BehaviorHandle with a no-op dispose method as there's no specific cleanup needed for hyperlinks
        return {
            detach: () => { /* No operation */ }
        };
    }
}