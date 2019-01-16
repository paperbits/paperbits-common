import * as _ from "lodash";
import * as Utils from "../utils";
import { Bag } from "./../bag";
import { LayoutContract } from "../layouts/layoutContract";
import { IObjectStorage } from "../persistence";
import { ILayoutService } from "./";
import { Contract } from "..";

const layoutsPath = "layouts";
const documentsPath = "files";

export class LayoutService implements ILayoutService {
    constructor(private readonly objectStorage: IObjectStorage) { }

    private async searchByProperties(properties: string[], value: string): Promise<LayoutContract[]> {
        const result = await this.objectStorage.searchObjects<Bag<LayoutContract>>(layoutsPath, properties, value);
        return Object.keys(result).map(key => result[key]);
    }

    public async getLayoutByKey(key: string): Promise<LayoutContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        return await this.objectStorage.getObject<LayoutContract>(key);
    }

    public search(pattern: string): Promise<LayoutContract[]> {
        return this.searchByProperties(["title"], pattern);
    }

    public async deleteLayout(layout: LayoutContract): Promise<void> {
        if (!layout) {
            throw new Error(`Parameter "layout" not specified.`);
        }

        const deleteContentPromise = this.objectStorage.deleteObject(layout.contentKey);
        const deleteLayoutPromise = this.objectStorage.deleteObject(layout.key);

        await Promise.all([deleteContentPromise, deleteLayoutPromise]);
    }

    public async createLayout(title: string, description: string, permalinkTemplate: string): Promise<LayoutContract> {
        const identifier = Utils.guid();
        const layoutKey = `${layoutsPath}/${identifier}`;
        const documentKey = `${documentsPath}/${identifier}`;

        const layout: LayoutContract = {
            key: layoutKey,
            title: title,
            description: description,
            permalinkTemplate: permalinkTemplate,
            contentKey: documentKey
        };

        const template = {
            object: "block",
            nodes: [{
                object: "block",
                type: "page"
            }],
            type: "layout"
        };

        await this.objectStorage.addObject(layoutKey, layout);
        await this.objectStorage.addObject(documentKey, template);

        return layout;
    }

    public async updateLayout(layout: LayoutContract): Promise<void> {
        if (!layout) {
            throw new Error(`Parameter "layout" not specified.`);
        }

        await this.objectStorage.updateObject<LayoutContract>(layout.key, layout);
    }

    public async getLayoutByUriTemplate(permalinkTemplate: string): Promise<LayoutContract> {
        if (!permalinkTemplate) {
            throw new Error(`Parameter "permalinkTemplate" not specified.`);
        }

        const result = await this.objectStorage.searchObjects<Bag<LayoutContract>>(layoutsPath, ["permalinkTemplate"], permalinkTemplate);
        const layouts = Object.keys(result).map(key => result[key]);
        return layouts.length > 0 ? layouts[0] : null;
    }

    private sort(patterns: string[]): string[] {
        const result = [];

        function compare(a, b) {
            if (a.score < b.score) {
                return 1;
            }

            if (a.score > b.score) {
                return -1;
            }

            return 0;
        }

        for (const pattern of patterns) {
            const segments = pattern.split("/").filter(x => !!x);

            let score = 0;

            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                let weight;

                if (segment.startsWith("{")) { // variable
                    weight = 2;
                }
                else if (segment === "*") { // wildcard
                    weight = 1;
                }
                else { // constant
                    weight = 3;
                }

                score += weight / (i + 1);
            }

            result.push({ score: score, pattern: pattern });
        }

        return result.sort(compare).map(x => x.pattern);
    }

    private matchPermalink(permalink: string, template: string): any {
        const tokens: { index: number, name: string, value?: string }[] = [];

        const permalinkSegments: string[] = permalink.split("/");
        const templateSegments: string[] = template.split("/");

        if (permalinkSegments.length !== templateSegments.length && template.indexOf("*") === -1) {
            return {
                match: false,
                tokens: tokens
            };
        }

        for (let i = 0; i < templateSegments.length; i++) {
            const permalinkSegment: string = permalinkSegments[i];
            const templateSegment: string = templateSegments[i];

            if (templateSegment === "*") { // wildcard
                if (permalinkSegment !== "" && permalinkSegment !== undefined) {
                    return {
                        match: true,
                        tokens: tokens
                    };
                }
                else {
                    return {
                        match: false,
                        tokens: []
                    };
                }
            }
            else if (templateSegment.startsWith("{")) { // variable
                tokens.push({ index: i, name: templateSegment.replace(/{|}/g, "") });
            }
            else if (permalinkSegment !== templateSegment) { // constant
                return {
                    match: false,
                    tokens: []
                };
            }
        }

        return {
            match: true,
            tokens: tokens
        };
    }

    public async getLayoutByRoute(route: string): Promise<LayoutContract> {
        if (!route) {
            return null;
        }

        const result = await this.objectStorage.searchObjects<Bag<LayoutContract>>(layoutsPath);
        const layouts = Object.keys(result).map(key => result[key]);

        if (layouts && layouts.length) {
            let templates = layouts.map(x => x.permalinkTemplate);
            templates = this.sort(templates);

            const matchingTemplate = templates.find(template => {
                return this.matchPermalink(route, template).match;
            });

            return layouts.find(x => x.permalinkTemplate === (matchingTemplate || "/"));
        }
        else {
            return null;
        }
    }

    public async getLayoutContent(layoutKey: string): Promise<Contract> {
        if (!layoutKey) {
            throw new Error(`Parameter "layoutKey" not specified.`);
        }

        const layout = await this.getLayoutByKey(layoutKey);
        return await this.objectStorage.getObject(layout.contentKey);
    }

    public async updateLayoutContent(layoutKey: string, content: Contract): Promise<void> {
        if (!layoutKey) {
            throw new Error(`Parameter "layoutKey" not specified.`);
        }

        if (!content) {
            throw new Error(`Parameter "content" not specified.`);
        }

        const layout = await this.getLayoutByKey(layoutKey);
        this.objectStorage.updateObject(layout.contentKey, content);
    }
}
