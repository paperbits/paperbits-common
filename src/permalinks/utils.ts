export function normalizePermalink(permalink: string): string {
    if (!permalink.startsWith("/")) {
        permalink = `/${permalink}`;
    }

    if (permalink.endsWith("/")) {
        permalink = permalink.substring(0, permalink.length - 1)
    }

    return permalink;
}