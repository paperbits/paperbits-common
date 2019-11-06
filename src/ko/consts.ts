import * as ko from "knockout";

export const ChangeRateLimit: ko.ObservableExtenderOptions<any> = { rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } };