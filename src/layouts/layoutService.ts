import * as _ from "lodash";
import * as Utils from "../utils";
import { LayoutContract } from "../layouts/layoutContract";
import { IObjectStorage, Query, Operator } from "../persistence";
import { ILayoutService } from "./";
import { Contract } from "..";
import { layoutTemplate } from "./layoutTemplate";

const layoutsPath = "layouts";
const documentsPath = "files";

export class LayoutService implements ILayoutService {
    constructor(private readonly objectStorage: IObjectStorage) { }

    public async getLayoutByKey(key: string): Promise<LayoutContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        return await this.objectStorage.getObject<LayoutContract>(key);
    }

    public async search(pattern: string): Promise<LayoutContract[]> {
        const query = Query
            .from<LayoutContract>()
            .where("title", Operator.contains, pattern);

        const result = await this.objectStorage.searchObjects<LayoutContract>(layoutsPath, query);

        return Object.keys(result).map(key => result[key]);
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

        await this.objectStorage.addObject(layoutKey, layout);
        await this.objectStorage.addObject(documentKey, layoutTemplate);

        return layout;
    }

    public async updateLayout(layout: LayoutContract): Promise<void> {
        if (!layout) {
            throw new Error(`Parameter "layout" not specified.`);
        }

        await this.objectStorage.updateObject<LayoutContract>(layout.key, layout);
    }

    public async getLayoutByPermalinkTemplate(permalinkTemplate: string): Promise<LayoutContract> {
        if (!permalinkTemplate) {
            throw new Error(`Parameter "permalinkTemplate" not specified.`);
        }

        const query = Query
            .from<LayoutContract>()
            .where("permalinkTemplate", Operator.equals, permalinkTemplate);

        const result = await this.objectStorage.searchObjects<LayoutContract>(layoutsPath, query);
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

    public async getLayoutByPermalink(permalink: string): Promise<LayoutContract> {
        if (!permalink) {
            return null;
        }

        const result = await this.objectStorage.searchObjects<LayoutContract>(layoutsPath);
        const layouts = Object.keys(result).map(key => result[key]);

        if (layouts && layouts.length) {
            let templates = layouts.map(x => x.permalinkTemplate);
            templates = this.sort(templates);

            const matchingTemplate = templates.find(template => {
                return this.matchPermalink(permalink, template).match;
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
