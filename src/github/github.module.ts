import { GithubClient } from "./githubClient";
import { IHttpClient } from "./../http/IHttpClient";
import { inject } from "inversify";
import { GithubBlobStorage } from "./githubBlobStorage";
import { IViewManager } from "./../ui/IViewManager";
import { IEventManager } from '../events/IEventManager';
import { OfflineObjectStorage } from '../persistence/offlineObjectStorage';
import { IInjector, IInjectorModule } from '../injection';
import { IObjectStorage } from '../persistence/IObjectStorage';
import { ISettingsProvider } from "../configuration/ISettingsProvider";
//import { GithubPublisher } from "./githubPublisher";


export class GithubModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bindSingleton("outputBlobStorage", GithubBlobStorage);
        injector.bindSingleton("githubClient", GithubClient);
        //injector.bindSingleton("githubPublisher", GithubPublisher);
    }
}