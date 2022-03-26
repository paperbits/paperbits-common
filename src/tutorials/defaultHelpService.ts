import { HelpService } from "./helpService";

const defaultHelpCenterUrl = `https://help.paperbits.io`;

export class DefaultHelpService implements HelpService {
    public async getHelpContent(articleKey: string): Promise<string> {
        return `<iframe class="host" src="${defaultHelpCenterUrl}/${articleKey}"></iframe>`;
    }
}
