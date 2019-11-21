
import "../src/extensions";

describe("Styles migration", async () => {
    it("Menu navigation link migration", () => {
        const migrate = (style: any): void => { // Temporary migration mechanism
            const menuVariations = Object.keys(style);

            menuVariations.forEach(variationKey => {
                const menuVariation = style[variationKey];

                const components = menuVariation["components"];

                if (!components) {
                    return;
                }


                const navItem = components["navItem"];

                if (!navItem) {
                    return;
                }

                components["navLink"] = navItem;
                delete components["navItem"];

                const navItemVariations = Object.keys(navItem);
                navItemVariations.forEach(variationKey => {
                    const navItemVariation = navItem[variationKey];

                    navItemVariation["key"] = navItemVariation["key"].replaceAll("/navItem/", "/navLink/");
                });
            });
        };

        const originalData = {
            default: {
                category: "appearance",
                components: {
                    dropdown: {
                        default: {
                            background: {
                                colorKey: "colors/defaultBg"
                            },
                            category: "appearance",
                            displayName: "Menu dropdown",
                            key: "components/menu/default/components/dropdown/default",
                            shadow: {
                                shadowKey: "shadows/none"
                            }
                        }
                    },
                    navItem: {
                        active: {
                            allowedStates: ["hover", "focus", "active", "disabled"],
                            displayName: "Navigation link",
                            key: "components/menu/default/components/navItem/active",
                            typography: {
                                fontWeight: "bold"
                            }
                        },
                        default: {
                            allowedStates: ["hover", "focus", "active", "disabled"],
                            displayName: "Navigation link",
                            key: "components/menu/default/components/navItem/default",
                            padding: {
                                bottom: 5,
                                left: 20,
                                right: 20,
                                top: 5
                            }
                        }
                    }
                },
                displayName: "Normal menu",
                key: "components/menu/default"
            }
        };

        migrate(originalData);
    });
});