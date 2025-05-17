import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { BehaviorHandle } from "./behavior";


export class MarkdownBehavior {
    public static attach(element: HTMLElement, markdown: string): BehaviorHandle {
        const updateContent = async (markdownText: string) => {
            const html: any = await remark()
                .use(remarkParse)
                .use(remarkGfm)
                .use(remarkRehype, { allowDangerousHtml: true })
                .use(rehypeRaw)
                .use(rehypeStringify)
                .process(markdownText);

            element.innerHTML = html;
        };

        updateContent(markdown);

        // Return a BehaviorHandle with a no-op dispose method as there's no specific cleanup needed for markdown rendering itself.
        // If the markdown content could change and require re-rendering, the calling code (binding handler) would manage that.
        return {
            detach: () => { /* No operation */ }
        };
    }
}