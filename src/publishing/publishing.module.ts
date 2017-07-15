import { inject } from "inversify";
import { IEventManager } from "./../events/IEventManager";
import { ISettingsProvider } from "./../configuration/ISettingsProvider";
import { GithubPublisher } from "./../github/githubPublisher";
import { AssetPublisher } from "./assetPublisher";
import { MediaPublisher } from "./mediaPublisher";
import { PagePublisher } from "./pagePublisher";
import { BlogPublisher } from "./blogPublisher";
import { NewsPublisher } from "./newsPublisher";
import { SitePublisher } from "./publisher";
import { GithubBlobStorage } from "./../github/githubBlobStorage";
import { GithubClient } from "./../github/githubClient";
import { IHttpClient } from "./../http/IHttpClient";
import { IBlobStorage } from "./../persistence/IBlobStorage";
import { IInjector, IInjectorModule } from "./../injection";


export class PublishingModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("sitePublisher", SitePublisher);
        injector.bindSingleton("pagePublisher", PagePublisher);
        injector.bindSingleton("blogPublisher", BlogPublisher);
        injector.bindSingleton("newsPublisher", NewsPublisher);
        injector.bindSingleton("mediaPublisher", MediaPublisher);

        let pagePublisher = injector.resolve("pagePublisher");
        let mediaPublisher = injector.resolve("mediaPublisher");
        let assetPublisher = injector.resolve("assetPublisher");
        let blogPublisher = injector.resolve("blogPublisher");
        let newsPublisher = injector.resolve("newsPublisher");

        injector.bindInstance("publishers", [
            assetPublisher,
            mediaPublisher
        ]);
        injector.bindInstance("publishersInSequence", [
            pagePublisher, blogPublisher
        ]);
    }
}