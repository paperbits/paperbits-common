import { RegExps } from "../regexps";

export function validateAndNormalizePermalink(permalink: string): string {
    if (!permalink.startsWith("/")) {
        permalink = `/${permalink}`;
    }

    if (permalink.length > 1 && permalink.endsWith("/")) {
        permalink = permalink.substring(0, permalink.length - 1)
    }

    const isPermalinkValid = RegExps.permalink.test(permalink);

    if (!isPermalinkValid) {
        throw new Error(`The permalink is invalid: "${permalink}".`);
    }

    return permalink;
}