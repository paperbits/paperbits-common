import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { BehaviorHandle } from "./behavior";


export class MarkdownBehavior {
    public attach(element: HTMLElement, markdown: string): BehaviorHandle {
        const updateContent = async (markdown) => {
            const html: any = await remark()
                .use(remarkParse)
                .use(remarkGfm)
                .use(remarkRehype, { allowDangerousHtml: true })
                .use(rehypeRaw)
                .use(rehypeStringify)
                .process(markdown);

            element.innerHTML = html;
        }

        updateContent(markdown);

        const handle: BehaviorHandle = {
            detach: () => { }
        }

        return handle;
    }
}