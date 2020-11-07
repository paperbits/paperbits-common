import { minify } from "html-minifier-terser";

export class HtmlPageOptimizer {
    public async optimize(htmlContent: string): Promise<string> {
        const result = minify(htmlContent, { // TODO: Minification causes memory leaks.
            caseSensitive: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: false,
            collapseWhitespace: true,
            html5: true,
            minifyCSS: true,
            preserveLineBreaks: false,
            removeComments: true,
            removeEmptyAttributes: true,
            removeOptionalTags: false,
            removeRedundantAttributes: false,
            removeScriptTypeAttributes: false,
            removeStyleLinkTypeAttributes: false,
            removeTagWhitespace: false,
            removeAttributeQuotes: false
        });

        return result;
    }
}