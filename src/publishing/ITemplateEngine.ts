export interface ITemplateEngine {
    render(template: string, model: Object): Promise<string>;
}