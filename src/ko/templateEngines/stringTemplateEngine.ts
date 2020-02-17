import * as ko from "knockout";

function registerStringTemplateEngine(): void {
    const templates = {};
    const data = {};
    const engine = new ko.nativeTemplateEngine();

    ko.templateSources["stringTemplate"] = function (template: any): void {
        this.templateName = template;
    };

    ko.utils.extend(ko.templateSources["stringTemplate"].prototype, {
        data: function (key: string, value: Object): any {
            data[this.templateName] = data[this.templateName] || {};

            if (arguments.length === 1) {
                return data[this.templateName][key];
            }

            data[this.templateName][key] = value;
        },
        text: function (value: Object): string {
            if (arguments.length === 0) {
                return templates[this.templateName];
            }

            templates[this.templateName] = value;
        }
    });

    engine.makeTemplateSource = function (template: string | Element, doc: Document): any {
        let elem;

        if (typeof template === "string") {
            elem = (doc || document).getElementById(template);

            if (elem) {
                return new ko.templateSources.domElement(elem);
            }

            return new ko.templateSources["stringTemplate"](template);
        } else if (template && (template.nodeType === 1) || (template.nodeType === 8)) {
            return new ko.templateSources.anonymousTemplate(template);
        }
    };

    ko["templates"] = templates;

    ko.setTemplateEngine(engine);
}

registerStringTemplateEngine();