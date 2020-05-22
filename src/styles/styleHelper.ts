import { StylePluginConfig } from "./stylePluginConfig";
import { BreakpointValues } from "./breakpoints";
import { LocalStyles } from "./styleContract";
import * as Objects from "../objects";
import * as Utils from "../utils";


export class StyleHelper {
    private static isResponsive(variation: Object): boolean {
        if (!variation) {
            throw new Error(`Parameter "variation" not specified.`);
        }

        return Object.keys(variation).some(props => Object.keys(BreakpointValues).includes(props));
    }

    public static getPluginConfig(localStyles: LocalStyles, pluginName: string, viewport: string = "xs"): StylePluginConfig {
        if (!localStyles) {
            throw new Error(`Parameter "localStyles" not specified.`);
        }

        if (!pluginName) {
            throw new Error(`Parameter "pluginName" not specified.`);
        }

        if (!localStyles.instance) {
            return null;
        }

        const pluginConfig = localStyles.instance[pluginName];

        if (!pluginConfig) {
            return null;
        }

        const isResponsive = this.isResponsive(pluginConfig);

        if (isResponsive) {
            /* 
                If viewport not specified for requested viewport take closest lower viewport.
                We can uncomment this when we'll be able to collapse breakpoints for child properties with same values.
                For example: { size: { md: { width: 100 }, xs: { width: 100 } } }

                const breakpoint = Utils.getClosestBreakpoint(pluginConfig, viewport);
            */

            const breakpoint = viewport;

            return <StylePluginConfig>pluginConfig[breakpoint];
        }
        else {
            return <StylePluginConfig>pluginConfig;
        }
    }

    /**
     * Updates local styles configuration depending on specified viewport. If viewport not specified, the style gets applied to all viewports.
     * @param localStyles Local styles object.
     * @param pluginName Name of the style plugin, e.g. "background".
     * @param pluginConfig Style plugin configuration object.
     * @param viewport Requested viewport. If viewport not specified, the style gets applied to all viewports.
     */
    public static setPluginConfig(localStyles: LocalStyles, pluginName: string, pluginConfig: StylePluginConfig, viewport?: string): void {
        if (!localStyles) {
            throw new Error(`Parameter "localStyles" not specified.`);
        }

        if (!pluginName) {
            throw new Error(`Parameter "pluginName" not specified.`);
        }

        const instance = localStyles.instance || {};
        let plugin = instance[pluginName] || {};

        if (viewport) {
            plugin[viewport] = pluginConfig;
        }
        else {
            plugin = pluginConfig;
        }

        instance[pluginName] = plugin;
        localStyles.instance = instance;

        if (!instance.key) {
            instance.key = Utils.randomClassName();
        }

        Objects.cleanupObject(localStyles, true, true);
    }
}