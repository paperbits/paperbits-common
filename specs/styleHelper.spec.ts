import { StyleHelper } from "./../src/styles/styleHelper";
import { LocalStyles } from "./../src/styles/styleContract";
import { expect } from "chai";


describe("Style helper", async () => {
    it("Can extracts local sstyles properly depending on requested viewport.", async () => {
        const sizeConfigXs = 100;

        const localStyles: LocalStyles = {
            instance: {
                size: {
                    xs: sizeConfigXs
                }
            }
        };

        const stylePluginConfigXs = StyleHelper.getPluginConfig(localStyles, "size", "xs");
        expect(stylePluginConfigXs).to.equal(sizeConfigXs);

        const stylePluginConfigMd = StyleHelper.getPluginConfig(localStyles, "size", "md");
        expect(stylePluginConfigMd).to.equal(sizeConfigXs);
    });

    it("Returns null when local styles are empty.", async () => {
        const emptyLocalStyles: LocalStyles = {};
        const stylePluginConfigMd = StyleHelper.getPluginConfig(emptyLocalStyles, "size", "md");
        expect(stylePluginConfigMd).to.equal(null);
    });

    it("Sets local styles properly", async () => {
        const sizeConfigXs = 100;
        const sizeConfigNew = 200;
        const backgroundConfigXs = 300;
        const appearanceVariationKey = "components/picture/default";

        const localStyles: LocalStyles = {
            instance: {
                size: {
                    xs: sizeConfigXs
                },
                background: {
                    xs: backgroundConfigXs
                }
            },
            appearance: appearanceVariationKey
        };

        StyleHelper.setPluginConfig(localStyles, "size", sizeConfigNew, "md"); // applying to specific viewport
        expect(localStyles.instance.size.md).to.equal(sizeConfigNew);
        expect(localStyles.instance.size.xs).to.equal(sizeConfigXs);
        expect(localStyles.instance.background.xs).to.equal(backgroundConfigXs);
        expect(localStyles.appearance).to.equal(appearanceVariationKey);

        StyleHelper.setPluginConfig(localStyles, "size", sizeConfigNew); // applying to all viewports
        expect(localStyles.instance.size).to.equal(sizeConfigNew);
        expect(localStyles.instance.size.md).to.equal(undefined);
        expect(localStyles.instance.size.xs).to.equal(undefined);
        expect(localStyles.instance.background.xs).to.equal(backgroundConfigXs);
        expect(localStyles.appearance).to.equal(appearanceVariationKey);
    });
});