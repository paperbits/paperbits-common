import * as moment from "moment";
import { SitePublisher } from "./../publishing/publisher";
import { IEventManager } from "./../events/IEventManager";
import { IViewManager } from "./../ui/IViewManager";
import { IGithubTreeItem } from "./IGithubTreeItem";
import { IGithubClient } from "./IGithubClient";

export class GithubPublisher {
    private readonly githubClient: IGithubClient;
    private readonly eventManager: IEventManager;
    private readonly sitePublisher: SitePublisher;
    private readonly viewManager: IViewManager;

    constructor(githubClient: IGithubClient, eventManager: IEventManager, sitePublisher: SitePublisher, viewManager: IViewManager) {
        this.githubClient = githubClient;
        this.eventManager = eventManager;
        this.sitePublisher = sitePublisher;
        this.viewManager = viewManager;

        // this.eventManager.addEventListener("onPublish", this.pushChanges.bind(this));
    }

    public async pushChanges(): Promise<void> {
        let indicator = this.viewManager.addProgressIndicator("Publishing", "Publishing to Github pages...");

        await this.sitePublisher.publish();
        await this.githubClient.push(`Published: ${moment().format("MM/DD/YYYY, hh:mm:ss")}`);

        // TODO: How do we show failure?
        this.viewManager.scheduleIndicatorRemoval(indicator);

        console.info("Pushed to Github!");
    }

    public async publish(): Promise<void> {
        console.log("Publishing to Github...");

        await this.pushChanges();
    }
}