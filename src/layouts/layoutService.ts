import * as _ from "lodash";
import * as Utils from "../utils";
import * as Constants from "../constants";
import { LayoutContract } from "../layouts/layoutContract";
import { IObjectStorage, Query, Operator, Page } from "../persistence";
import { ILayoutService, LayoutMetadata, LayoutLocalizedContract } from "./";
import { Contract } from "..";
import { layoutTemplate } from "./layoutTemplate";
import { ILocaleService } from "../localization";

const documentsPath = "files";

export class LayoutService implements ILayoutService {
    protected layoutsPath: string = "layouts";

    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly localeService: ILocaleService
    ) { }

    /**
     * Copies limited number of metadata properties.
     */
    private copyMetadata(sourceMetadata: LayoutMetadata, targetMetadata: LayoutMetadata): LayoutMetadata {
        if (!sourceMetadata) {
            throw new Error(`Parameter "sourceMetadata" not specified.`);
        }

        if (!targetMetadata) {
            throw new Error(`Parameter "targetMetadata" not specified.`);
        }

        targetMetadata.title = sourceMetadata.title;
        targetMetadata.description = sourceMetadata.description;
        targetMetadata.permalinkTemplate = sourceMetadata.permalinkTemplate;

        return targetMetadata;
    }

    private localizedContractToContract(defaultLocale: string, currentLocale: string, requestedLocale: string, localizedPageContract: LayoutLocalizedContract): LayoutContract {
        const locales = localizedPageContract[Constants.localePrefix];

        const metadata = (requestedLocale
            ? locales[requestedLocale]
            : locales[currentLocale])
            || this.copyMetadata(locales[defaultLocale], {});

        if (!metadata) {
            return null;
        }

        const contract: any = {
            key: localizedPageContract.key,
            ...metadata
        };

        return contract;
    }

    public async getLayoutByKey(key: string, requestedLocale?: string): Promise<LayoutContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        const layoutContract = await this.objectStorage.getObject<LayoutLocalizedContract>(key);

        if (!layoutContract) {
            return null;
        }

        const defaultLocale = await this.localeService.getDefaultLocale();
        const currentLocale = await this.localeService.getCurrentLocale();

        return this.localizedContractToContract(defaultLocale, currentLocale, requestedLocale, layoutContract);
    }

    private convertPage(localizedPage: Page<LayoutLocalizedContract>, defaultLocale: string, searchLocale: string, requestedLocale: string): Page<LayoutContract> {
        const resultPage: Page<LayoutContract> = {
            value: localizedPage.value.map(x => this.localizedContractToContract(defaultLocale, searchLocale, requestedLocale, x)),
            takeNext: async (): Promise<Page<LayoutContract>> => {
                const nextLocalizedPage = await localizedPage.takeNext();
                return this.convertPage(nextLocalizedPage, defaultLocale, searchLocale, requestedLocale);
            }
        };

        if (!localizedPage.takeNext) {
            resultPage.takeNext = null;
        }

        return resultPage;
    }

    public async search(query: Query<LayoutContract>, requestedLocale?: string): Promise<Page<LayoutContract>> {
        if (!query) {
            throw new Error(`Parameter "query" not specified.`);
        }

        const defaultLocale = await this.localeService.getDefaultLocale();
        const currentLocale = await this.localeService.getCurrentLocale();
        const searchLocale = requestedLocale || currentLocale;

        const localizedQuery = Utils.localizeQuery(query, searchLocale);

        try {
            const pageOfResults = await this.objectStorage.searchObjects<LayoutLocalizedContract>(this.layoutsPath, localizedQuery);
            return this.convertPage(pageOfResults, defaultLocale, searchLocale, requestedLocale);

        }
        catch (error) {
            throw new Error(`Unable to search pages: ${error.stack || error.message}`);
        }
    }

    public async deleteLayout(layout: LayoutContract): Promise<void> {
        if (!layout) {
            throw new Error(`Parameter "layout" not specified.`);
        }

        const localizedLayoutContract = await this.objectStorage.getObject<LayoutLocalizedContract>(layout.key);

        if (localizedLayoutContract.locales) {
            const contentKeys = Object.values(localizedLayoutContract.locales).map(x => x.contentKey);

            for (const contentKey of contentKeys) {
                await this.objectStorage.deleteObject(contentKey);
            }
        }

        await this.objectStorage.deleteObject(layout.key);
    }

    public async createLayout(title: string, description: string, permalinkTemplate: string): Promise<LayoutContract> {
        const locale = await this.localeService.getDefaultLocale();
        const identifier = Utils.guid();
        const layoutKey = `${this.layoutsPath}/${identifier}`;
        const contentKey = `${documentsPath}/${identifier}`;

        const localizedLayout: LayoutLocalizedContract = {
            key: layoutKey,
            locales: {
                [locale]: {
                    title: title,
                    description: description,
                    permalinkTemplate: permalinkTemplate,
                    contentKey: contentKey
                }
            }
        };

        await this.objectStorage.addObject<LayoutLocalizedContract>(layoutKey, localizedLayout);
        await this.objectStorage.addObject<Contract>(contentKey, layoutTemplate);

        const layoutContent: LayoutContract = {
            key: layoutKey,
            title: title,
            description: description,
            permalinkTemplate: permalinkTemplate,
            contentKey: contentKey
        };

        return layoutContent;
    }

    public async updateLayout(layout: LayoutContract, requestedLocale?: string): Promise<void> {
        if (!layout) {
            throw new Error(`Parameter "layout" not specified.`);
        }

        if (!requestedLocale) {
            requestedLocale = await this.localeService.getCurrentLocale();
        }

        const layoutContract = await this.objectStorage.getObject<LayoutLocalizedContract>(layout.key);

        if (!layoutContract) {
            throw new Error(`Could not update layout. Layout with key "${layout.key}" doesn't exist.`);
        }

        const existingLocaleMetadata = layoutContract.locales[requestedLocale] || <LayoutMetadata>{};

        layoutContract.locales[requestedLocale] = this.copyMetadata(layout, existingLocaleMetadata);

        await this.objectStorage.updateObject<LayoutLocalizedContract>(layout.key, layoutContract);
    }

    public async getLayoutByPermalinkTemplate(permalinkTemplate: string): Promise<LayoutContract> {
        if (!permalinkTemplate) {
            throw new Error(`Parameter "permalinkTemplate" not specified.`);
        }

        const defaultLocale = await this.localeService.getDefaultLocale();
        const query = Query
            .from<LayoutContract>()
            .where(`locales/${defaultLocale}/permalinkTemplate`, Operator.equals, permalinkTemplate);

        const pageOfObjects = await this.objectStorage.searchObjects<LayoutContract>(this.layoutsPath, query);
        const result = pageOfObjects.value;
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

    private matchPermalink(permalink: string, template: string, locale?: string): any {
        if (locale) {
            const localePrefix = `/${locale}/`;

            if (permalink.startsWith(localePrefix)) {
                permalink = permalink.replace(localePrefix, "/");
            }
        }

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

    public async getLayoutByPermalink(permalink: string, requestedLocale?: string): Promise<LayoutContract> {
        if (!permalink) {
            return null;
        }

        const defaultLocale = await this.localeService.getDefaultLocale();
        const currentLocale = await this.localeService.getCurrentLocale();

        const query = Query
            .from<LayoutContract>();

        const pageOfObjects = await this.objectStorage.searchObjects<LayoutLocalizedContract>(this.layoutsPath, query);
        const result = pageOfObjects.value;
        const layouts = Object.keys(result).map(key => result[key]);

        if (layouts && layouts.length) {
            let permalinkTemplates = layouts
                .map(x => x.locales[defaultLocale]?.permalinkTemplate); // We use permalinkTemplate from default locale only (for now).

            permalinkTemplates = this.sort(permalinkTemplates);

            const matchingTemplate = permalinkTemplates.find(template => {
                return this.matchPermalink(permalink, template, requestedLocale || currentLocale).match;
            });

            const matchingLayout = layouts.find(x => x.locales[defaultLocale].permalinkTemplate === (matchingTemplate || "/"));

            if (!matchingLayout) {
                return null;
            }

            return this.localizedContractToContract(defaultLocale, currentLocale, requestedLocale, matchingLayout);
        }
        else {
            return null;
        }
    }

    public async getLayoutContent(layoutKey: string, requestedLocale?: string): Promise<Contract> {
        if (!layoutKey) {
            throw new Error(`Parameter "layoutKey" not specified.`);
        }

        if (!requestedLocale) {
            requestedLocale = await this.localeService.getCurrentLocale();
        }

        const defaultLocale = await this.localeService.getDefaultLocale();
        const localizedLayoutContract = await this.objectStorage.getObject<LayoutLocalizedContract>(layoutKey);

        let layoutMetadata = localizedLayoutContract.locales[requestedLocale];

        if (!layoutMetadata) {
            layoutMetadata = localizedLayoutContract.locales[defaultLocale];
        }

        let layoutContent;

        if (layoutMetadata.contentKey) {
            layoutContent = await this.objectStorage.getObject<Contract>(layoutMetadata.contentKey);
        }
        else {
            const layoutDefaultLocaleMetadata = localizedLayoutContract.locales[defaultLocale];
            layoutContent = await this.objectStorage.getObject<Contract>(layoutDefaultLocaleMetadata.contentKey);
        }

        layoutContent.type = "layout";

        return layoutContent;
    }

    public async updateLayoutContent(layoutKey: string, content: Contract, requestedLocale?: string): Promise<void> {
        if (!layoutKey) {
            throw new Error(`Parameter "layoutKey" not specified.`);
        }

        if (!content) {
            throw new Error(`Parameter "content" not specified.`);
        }

        const localizedLayoutContract = await this.objectStorage.getObject<LayoutLocalizedContract>(layoutKey);

        if (!localizedLayoutContract) {
            throw new Error(`Layout with key "${layoutKey}" not found.`);
        }

        if (!requestedLocale) {
            requestedLocale = await this.localeService.getCurrentLocale();
        }

        let layoutMetadata = localizedLayoutContract.locales[requestedLocale];

        if (!layoutMetadata) {
            const defaultLocale = await this.localeService.getDefaultLocale();
            const defaultLayoutMetadata = localizedLayoutContract.locales[defaultLocale];
            const identifier = Utils.guid();

            layoutMetadata = this.copyMetadata(defaultLayoutMetadata, {
                contentKey: `${documentsPath}/${identifier}`
            });

            localizedLayoutContract.locales[requestedLocale] = layoutMetadata;

            await this.objectStorage.updateObject(layoutKey, localizedLayoutContract);
        }
        else if (!layoutMetadata.contentKey) {
            const identifier = Utils.guid();
            layoutMetadata.contentKey = `${documentsPath}/${identifier}`;
            await this.objectStorage.updateObject(layoutKey, layoutMetadata);
        }

        await this.objectStorage.updateObject(layoutMetadata.contentKey, content);
    }
}
