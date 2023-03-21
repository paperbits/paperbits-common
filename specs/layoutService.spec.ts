import { assert, expect } from "chai";
import { LayoutService, LayoutContract } from "../src/layouts";
import { MockObjectStorage } from "./mocks/mockObjectStorage";
import { MockLocaleService } from "./mocks/mockLocaleService";
import { Contract } from "../src";
import { Operator, Query } from "../src/persistence";
import { ConsoleLogger } from "../src/logging";

describe("Layout service", async () => {
    it("Can create layout metadata in specified locale when metadata doesn't exists.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "en-us": {
                            title: "Blog",
                            permalinkTemplate: "/blog/*"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());

        const layoutContract: LayoutContract = {
            key: "layouts/layout1",
            title: "Блог",
            permalinkTemplate: "/ru-ru/blog/*"
        };

        await localizedService.updateLayout(layoutContract);

        const resultStorageState = objectStorage.getData();

        assert.isTrue(resultStorageState["layouts"]["layout1"]["locales"]["en-us"]["title"] === "Blog");
        assert.isTrue(resultStorageState["layouts"]["layout1"]["locales"]["ru-ru"]["title"] === "Блог");
    });

    it("Can create layout content when metadata doesn't exist", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "en-us": {
                            title: "Blog",
                            permalinkTemplate: "/blog/*"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());
        const content: Contract = { type: "ru-ru-content" };

        await localizedService.updateLayoutContent("layouts/layout1", content);

        const resultStorageState = objectStorage.getData();
        assert.isTrue(Object.values(resultStorageState["files"])[0]["type"] === "ru-ru-content");
    });

    it("Can create layout content when metadata exists.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "ru-ru": {
                            title: "Блог",
                            permalinkTemplate: "/ru-ru/blog/*",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());
        const content: Contract = { type: "ru-ru-content" };

        await localizedService.updateLayoutContent("layouts/layout1", content);

        const resultStorageState = objectStorage.getData();
        assert.isTrue(resultStorageState["files"]["ru-ru-content"]["type"] === "ru-ru-content");
    });

    it("Can create layout content when metadata exists, but no contentKey defined yet.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "en-us": {
                            title: "Blog",
                            permalinkTemplate: "/blog/*"
                        },
                        "ru-ru": {
                            title: "Блог",
                            permalinkTemplate: "/ru-ru/blog/*"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());
        const content: Contract = { type: "ru-ru-content" };

        await localizedService.updateLayoutContent("layouts/layout1", content);

        const resultStorageState = objectStorage.getData();
        assert.isTrue(Object.values(resultStorageState["files"])[0]["type"] === "ru-ru-content");
    });

    it("Can update layout metadata in specified locale.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "ru-ru": {
                            title: "Блог",
                            permalinkTemplate: "/ru-ru/blog/*",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());

        const layoutContract: LayoutContract = {
            key: "layouts/layout1",
            title: "Блог (изменения)",
            permalinkTemplate: "/ru-ru/blog/*",
            contentKey: "files/ru-ru-content"
        };

        await localizedService.updateLayout(layoutContract);

        const resultStorageState = objectStorage.getData();
        assert.isTrue(resultStorageState["layouts"]["layout1"]["locales"]["ru-ru"]["title"] === "Блог (изменения)");
    });

    it("Can update layout content in specfied locale.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "ru-ru": {
                            title: "Блог",
                            permalinkTemplate: "/ru-ru/blog/*",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                }
            },
            files: {
                "ru-ru-content": {
                    type: "localized-node"
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());
        const content: Contract = { type: "updated-ru-ru-content" };

        await localizedService.updateLayoutContent("layouts/layout1", content);

        const resultStorageState = objectStorage.getData();
        assert.isTrue(resultStorageState["files"]["ru-ru-content"]["type"] === "updated-ru-ru-content");
    });

    it("Returns layout metadata in default locale when specified locale doesn't exist.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "en-us": {
                            title: "Blog",
                            permalinkTemplate: "/blog/*",
                            contentKey: "files/en-us-content"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const layoutService = new LayoutService(objectStorage, localeService, new ConsoleLogger());

        const layoutContract1 = await layoutService.getLayoutByKey("layouts/layout1");
        assert.isTrue(layoutContract1.title === "Blog", "Layout metadata is in invalid locale.");

        const layoutContract2 = await layoutService.getLayoutByPermalink("/blog/post1");
        assert.isTrue(layoutContract2.title === "Blog", "Layout metadata is in invalid locale.");
    });

    it("Returns layout metadata in specified locale.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "en-us": {
                            title: "Home",
                            permalinkTemplate: "/",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "Главная",
                            permalinkTemplate: "/ru-ru/",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                },
                layout2: {
                    key: "layouts/layout2",
                    locales: {
                        "en-us": {
                            title: "Blog",
                            permalinkTemplate: "/blog/*",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "Блог",
                            permalinkTemplate: "/ru-ru/blog/*",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const layoutService = new LayoutService(objectStorage, localeService, new ConsoleLogger());

        const layoutContract = await layoutService.getLayoutByKey("layouts/layout2");
        assert.isTrue(layoutContract.title === "Блог", "Layout metadata is in invalid locale.");

        const layoutContract2 = await layoutService.getLayoutByPermalink("/blog/post1");
        assert.isTrue(layoutContract2.title === "Блог", "Layout metadata is in invalid locale.");

        const layoutContract3 = await layoutService.getLayoutByPermalink("/ru-ru/blog/post1");
        assert.isTrue(layoutContract3.title === "Блог", "Layout metadata is in invalid locale.");

        const layoutContract4 = await layoutService.getLayoutByPermalink("/ru-ru/");
        assert.isTrue(layoutContract4.title === "Главная", "Layout metadata is in invalid locale.");
    });

    it("Returns layout content in specified locale.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "en-us": {
                            title: "Blog",
                            permalinkTemplate: "/blog/*",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "Блог",
                            permalinkTemplate: "/ru-ru/blog/*",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                }
            },
            files: {
                "ru-ru-content": {
                    type: "layout",
                    nodes: [{ type: "ru-ru-content" }]
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());

        const layoutContent = await localizedService.getLayoutContent("layouts/layout1");
        assert.isTrue(layoutContent.nodes[0].type === "ru-ru-content", "Layout content is in invalid locale.");
    });

    it("Returns layout content in default locale when specified locale doesn't exists.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "en-us": {
                            title: "Blog",
                            permalinkTemplate: "/blog/*",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "Блог",
                            permalinkTemplate: "/ru-ru/blog/*"
                        }
                    }
                }
            },
            files: {
                "en-us-content": {
                    type: "layout",
                    nodes: [{ type: "en-us-content" }],
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());

        const layoutContent = await localizedService.getLayoutContent("layouts/layout1");
        assert.isTrue(layoutContent.nodes[0].type === "en-us-content", "Layout content is in invalid locale.");
    });

    it("Can create layout.", async () => {
        const initialData = {};
        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());

        await localizedService.createLayout("Blog", "Default layout for blog posts.", "/blog/*");

        const resultStorageState = objectStorage.getData();
        assert.isTrue(Object.values(resultStorageState["layouts"])[0]["locales"]["en-us"]["title"] === "Blog");
    });

    it("Can delete layout.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "en-us": {
                            title: "Blog",
                            permalinkTemplate: "/blog/*",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "Блог",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                }
            },
            files: {
                "en-us-content": {},
                "ru-ru-content": {}
            }
        };
        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());

        await localizedService.deleteLayout({ key: "layouts/layout1", title: "Blog" });

        const resultStorageState = objectStorage.getData();
        assert.isTrue(Object.keys(resultStorageState["layouts"]).length === 0);
        assert.isTrue(Object.keys(resultStorageState["files"]).length === 0);
    });

    it("Search layouts in specific locale.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "en-us": {
                            title: "Blog",
                            permalinkTemplate: "/blog/*",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "Блог",
                            permalinkTemplate: "/ru-ru/blog/*",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                },
                layout2: {
                    key: "layouts/layout2",
                    locales: {
                        "en-us": {
                            title: "Home",
                            permalink: "/",
                            contentKey: "files/en-us-content"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();

        const localizedService = new LayoutService(objectStorage, localeService, new ConsoleLogger());
        const query = Query.from<LayoutContract>().where("title", Operator.contains, "");

        const layoutContracts = await localizedService.search(query, "ru-ru");
        assert.isTrue(layoutContracts.value.length === 1, "Must return only 1 layout.");
        assert.isTrue(layoutContracts.value[0].title === "Блог", "Layout metadata is in invalid locale.");
    });

    it("Correctly duplicates layout with locales.", async () => {
        const initialData = {
            layouts: {
                layout1: {
                    key: "layouts/layout1",
                    locales: {
                        "en-us": {
                            title: "Blog",
                            permalinkTemplate: "/blog",
                            contentKey: "files/en-us-content",
                        },
                        "ru-ru": {
                            title: "Блог",
                            permalinkTemplate: "/ru-ru/blog",
                            contentKey: "files/ru-ru-content",
                        }
                    }
                }
            },
            files: {
                "en-us-content": {
                    key: "files/en-us-content",
                    type: "en-us-content"
                },
                "ru-ru-content": {
                    key: "files/ru-ru-content",
                    type: "ru-ru-content"
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("en-us");

        const layoutService = new LayoutService(objectStorage, localeService, new ConsoleLogger());
        await layoutService.copyLayout("layouts/layout1");

        const copiedLayoutsEnUs = await layoutService.search(Query.from<LayoutContract>().where("title", Operator.contains, "copy"), "en-us");
        const copiedLayoutEnUs = copiedLayoutsEnUs.value[0];

        expect(copiedLayoutEnUs.key).not.equals("layouts/layout1", "Key of the copied layout should not match the key of original layout.");
        expect(copiedLayoutEnUs.contentKey).not.equals("en-us-content");
        expect(copiedLayoutEnUs.title).equals("Blog (copy)");

        const copiedLayoutsRuRu = await layoutService.search(Query.from<LayoutContract>().where("title", Operator.contains, "copy"), "ru-ru");
        const copiedLayoutRuRu = copiedLayoutsRuRu.value[0];

        expect(copiedLayoutRuRu.contentKey).not.equals("ru-ru-content");
        expect(copiedLayoutRuRu.title).equals("Блог (copy)");
    });
});