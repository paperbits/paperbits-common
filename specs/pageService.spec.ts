import { assert, expect } from "chai";
import { PageService, PageContract } from "../src/pages";
import { MockObjectStorage } from "./mocks/mockObjectStorage";
import { MockBlockService } from "./mocks/mockBlockService";
import { MockLocaleService } from "./mocks/mockLocaleService";
import { Contract } from "../src";
import { Operator, Query } from "../src/persistence";

describe("Page service", async () => {
    it("Can create page metadata in specified locale when metadata doesn't exists.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "en-us": {
                            title: "About",
                            permalink: "/about"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new PageService(objectStorage, blockService, localeService);

        const pageContract: PageContract = {
            key: "pages/page1",
            title: "О нас",
            permalink: "/ru-ru/about"
        };

        await localizedService.updatePage(pageContract);

        const resultStorageState = objectStorage.getData();

        assert.isTrue(resultStorageState["pages"]["page1"]["locales"]["en-us"]["title"] === "About");
        assert.isTrue(resultStorageState["pages"]["page1"]["locales"]["ru-ru"]["title"] === "О нас");
    });

    it("Can create page content when metadata doesn't exist", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "en-us": {
                            title: "About",
                            permalink: "/about"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new PageService(objectStorage, blockService, localeService);
        const content: Contract = { type: "ru-ru-content" };

        await localizedService.updatePageContent("pages/page1", content);

        const resultStorageState = objectStorage.getData();
        assert.isTrue(Object.values(resultStorageState["files"])[0]["type"] === "ru-ru-content");
    });

    it("Can create page content when metadata exists.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "ru-ru": {
                            title: "О нас",
                            permalink: "/ru-ru/about",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new PageService(objectStorage, blockService, localeService);
        const content: Contract = { type: "ru-ru-content" };

        await localizedService.updatePageContent("pages/page1", content);

        const resultStorageState = objectStorage.getData();
        assert.isTrue(resultStorageState["files"]["ru-ru-content"]["type"] === "ru-ru-content");
    });

    it("Can create page content when metadata exists, but no contentKey defined yet.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "en-us": {
                            title: "About",
                            permalink: "/about"
                        },
                        "ru-ru": {
                            title: "О нас",
                            permalink: "/ru-ru/about"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new PageService(objectStorage, blockService, localeService);
        const content: Contract = { type: "ru-ru-content" };

        await localizedService.updatePageContent("pages/page1", content);

        const resultStorageState = objectStorage.getData();
        assert.isTrue(Object.values(resultStorageState["files"])[0]["type"] === "ru-ru-content");
    });

    it("Can update page metadata in specified locale.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "ru-ru": {
                            title: "О нас",
                            permalink: "/ru-ru/about",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new PageService(objectStorage, blockService, localeService);

        const pageContract: PageContract = {
            key: "pages/page1",
            title: "О нас (изменения)",
            permalink: "/ru-ru/about",
            contentKey: "files/ru-ru-content"
        };

        await localizedService.updatePage(pageContract);

        const resultStorageState = objectStorage.getData();
        assert.isTrue(resultStorageState["pages"]["page1"]["locales"]["ru-ru"]["title"] === "О нас (изменения)");
    });

    it("Can update page content in specfied locale.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "ru-ru": {
                            title: "О нас",
                            permalink: "/ru-ru/about",
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
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new PageService(objectStorage, blockService, localeService);
        const content: Contract = { type: "updated-ru-ru-content" };

        await localizedService.updatePageContent("pages/page1", content);

        const resultStorageState = objectStorage.getData();
        assert.isTrue(resultStorageState["files"]["ru-ru-content"]["type"] === "updated-ru-ru-content");
    });

    it("Returns page metadata in default locale when specified locale doesn't exist.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "en-us": {
                            title: "About",
                            permalink: "/about",
                            contentKey: "files/en-us-content"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new PageService(objectStorage, blockService, localeService);

        const pageContract1 = await localizedService.getPageByKey("pages/page1");
        assert.isTrue(pageContract1.title === "About", "Page metadata is in invalid locale.");

        const pageContract2 = await localizedService.getPageByPermalink("/about");
        assert.isTrue(pageContract2.title === "About", "Page metadata is in invalid locale.");
    });

    it("Returns page metadata in specified locale.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "en-us": {
                            title: "About",
                            permalink: "/about",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "О нас",
                            permalink: "/ru-ru/about",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new PageService(objectStorage, blockService, localeService);

        const pageContract = await localizedService.getPageByKey("pages/page1");
        assert.isTrue(pageContract.title === "О нас", "Page metadata is in invalid locale.");

        const pageContract2 = await localizedService.getPageByPermalink("/about");
        assert.isTrue(pageContract2.title === "О нас", "Page metadata is in invalid locale.");
    });

    it("Returns page content in specified locale.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "en-us": {
                            title: "About",
                            permalink: "/about",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "О нас",
                            permalink: "/ru-ru/about",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                }
            },
            files: {
                "ru-ru-content": {
                    type: "ru-ru-content"
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new PageService(objectStorage, blockService, localeService);

        const pageContent = await localizedService.getPageContent("pages/page1");
        assert.isTrue(pageContent.type === "ru-ru-content", "Page content is in invalid locale.");
    });

    it("Returns page content in default locale when specified locale doesn't exists.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "en-us": {
                            title: "About",
                            permalink: "/about",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "О нас",
                            permalink: "/ru-ru/about"
                        }
                    }
                }
            },
            files: {
                "en-us-content": {
                    type: "en-us-content"
                }
            }
        };

        const objectStorage = new MockObjectStorage(initialData);
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        localeService.setCurrentLocale("ru-ru");

        const localizedService = new PageService(objectStorage, blockService, localeService);

        const pageContent = await localizedService.getPageContent("pages/page1");
        assert.isTrue(pageContent.type === "en-us-content", "Page content is in invalid locale.");
    });

    it("Can create page.", async () => {
        const initialData = {};
        const objectStorage = new MockObjectStorage(initialData);
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        const localizedService = new PageService(objectStorage, blockService, localeService);

        await localizedService.createPage("/about", "About", "", "");

        const resultStorageState = objectStorage.getData();
        assert.isTrue(Object.values(resultStorageState["pages"])[0]["locales"]["en-us"]["title"] === "About");
    });

    it("Can delete page.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "en-us": {
                            title: "About",
                            permalink: "/about",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "О нас",
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
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();
        const localizedService = new PageService(objectStorage, blockService, localeService);

        await localizedService.deletePage({ key: "pages/page1", title: "About" });

        const resultStorageState = objectStorage.getData();
        assert.isTrue(Object.keys(resultStorageState["pages"]).length === 0);
        assert.isTrue(Object.keys(resultStorageState["files"]).length === 0);
    });

    it("Search pages in specific locale.", async () => {
        const initialData = {
            pages: {
                page1: {
                    key: "pages/page1",
                    locales: {
                        "en-us": {
                            title: "About",
                            permalink: "/about",
                            contentKey: "files/en-us-content"
                        },
                        "ru-ru": {
                            title: "О нас",
                            permalink: "/ru-ru/about",
                            contentKey: "files/ru-ru-content"
                        }
                    }
                },
                page2: {
                    key: "pages/page2",
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
        const blockService = new MockBlockService();
        const localeService = new MockLocaleService();

        const localizedService = new PageService(objectStorage, blockService, localeService);
        const query = Query.from<PageContract>().where("title", Operator.contains, "");

        const pageOfSearchResults = await localizedService.search(query, "ru-ru");
        assert.isTrue(pageOfSearchResults.value.length === 1, "Must return only 1 page.");
        assert.isTrue(pageOfSearchResults.value[0].title === "О нас", "Page metadata is in invalid locale.");
    });
});