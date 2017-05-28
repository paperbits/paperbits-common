import { IPublisher } from './IPublisher';

export class SitePublisher implements IPublisher {
    private readonly publishers: Array<IPublisher>;
    private readonly publishersInSequence: Array<IPublisher>;

    constructor(publishers: Array<IPublisher>, publishersInSequence: Array<IPublisher>) {
        this.publishers = publishers;
        this.publishersInSequence = publishersInSequence;
    }

    public async publish(): Promise<any> {
        console.info("Publishing...");

        let publishPromises = new Array<Promise<void>>();

        this.publishers.forEach(publisher => {
            let publishPromise = publisher.publish();

            publishPromises.push(publishPromise);
        });

        await Promise.all(publishPromises);

        for (let i = 0; i < this.publishersInSequence.length; i++) {
            await this.publishersInSequence[i].publish();
        }

        console.info("Published successfully.");
    }
}
