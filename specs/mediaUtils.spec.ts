import { expect } from "chai";
import { MediaVariantContract } from "../src/media";
import * as MediaUtils from "../src/media/mediaUtils";

describe("Media utils", async () => {
    it("Can correctly form media variant permalinks", () => {
        const variantWithMimeType: MediaVariantContract = {
            width: 200,
            height: 150,
            mimeType: "image/png"
        };

        const variantWithoutMimeType: MediaVariantContract = {
            width: 200,
            height: 150
        };

        const variantPermalink1 = MediaUtils.getPermalinkForMediaVariant("/media/picture.jpeg", variantWithMimeType);
        expect(variantPermalink1).equals("/media/picture@200x150.png");

        const variantPermalink2 = MediaUtils.getPermalinkForMediaVariant("/media/picture.jpeg", variantWithoutMimeType);
        expect(variantPermalink2).equals("/media/picture@200x150.jpeg");

        const variantPermalink3 = MediaUtils.getPermalinkForMediaVariant("/media/picture", variantWithMimeType);
        expect(variantPermalink3).equals("/media/picture@200x150.png");

        const variantPermalink4 = MediaUtils.getPermalinkForMediaVariant("/media/picture", variantWithoutMimeType);
        expect(variantPermalink4).equals("/media/picture@200x150");
    });
});