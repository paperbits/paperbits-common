import { IBlobStorage } from "./../persistence/IBlobStorage";
import { IPublisher } from './IPublisher';

export class AssetPublisher implements IPublisher {
    private readonly inputBlobStorage: IBlobStorage;
    private readonly outputBlobStorage: IBlobStorage;
    private readonly assetsBasePath: string;

    constructor(inputBlobStorage: IBlobStorage, outputBlobStorage: IBlobStorage, assetsBasePath: string) {
        this.inputBlobStorage = inputBlobStorage;
        this.outputBlobStorage = outputBlobStorage;
        this.assetsBasePath = assetsBasePath;
    }

    private async copyAsset(assetPath: string): Promise<void> {
        let copyFrom = assetPath;
        let cutOut = `/${this.assetsBasePath}/`;
        let copyTo = copyFrom.replace(cutOut, "");
        let byteArray = await this.inputBlobStorage.downloadBlob(copyFrom);

        console.log(`Publishing "${copyFrom}" to "${copyTo}"...`);

        await this.outputBlobStorage.uploadBlob(copyTo, byteArray);
    }

    private async copyAssets(): Promise<void> {
        let copyPromises = new Array<Promise<void>>();
        let assetPaths = await this.inputBlobStorage.listBlobs();

        assetPaths.forEach((assetPath) => {
            if (assetPath.startsWith(`/${this.assetsBasePath}/`)) {
                copyPromises.push(this.copyAsset(assetPath));
            }
        });

        await Promise.all(copyPromises);
    }

    public async publish(): Promise<void> {
        await this.copyAssets();
    }
}