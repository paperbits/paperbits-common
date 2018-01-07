import { Intention, IIntentionsBuilder, IntentionsMap } from "./intention";
import { Array } from "es6-shim";
import { IntentionsUtils } from "./intentionsUtils";

export class Interface {
    public Name: string;
    public Scopes: Array<Interface>;
    public Intentions: Array<Intention>;

    constructor(name: string){
        this.Name = name;
        this.Scopes = new Array<Interface>();
        this.Intentions = new Array<Intention>();
    }
}

/// TODO: Consider immutable; consider to split code generator and intentions builder
export class IntentionsBuilder implements IIntentionsBuilder {
        constructor(private theme: any,
            private interfaceDefinition?: Interface,
            private interfaceDefinitions?: Interface[])
        {
            if (!interfaceDefinition){
                this.interfaceDefinition = new Interface("Root");
            }
            if (!interfaceDefinitions){
                this.interfaceDefinitions = new Array<Interface>();
            }
        }
    
        private intentions : IntentionsMap = <IntentionsMap>{};
        private prefix: string;
    
        public addIntention(
            path: string, 
            category: string,
            name: string,
            scope: string,
            viewport?: string): IIntentionsBuilder{
            
            path = this.combinePath(path);
            const lastSegment: string = path.substring(path.lastIndexOf(".") + 1);
            const parent = this.buildHierarchy(path);
            const cssClass = this.findClass(path, viewport);
            const intention : Intention= {
                category: category,
                name: () => name,
                scope: scope,
                styles: () => cssClass,
                id: lastSegment,
                fullId: path
            };

            parent[lastSegment] = intention;
            this.interfaceDefinition.Intentions.push(intention);

            return this;
        }
        
        public addIntentionPerViewPort(path: string, 
            category: string,
            name: string,
            scope: string): IIntentionsBuilder {
            this.addIntention(path, category, name, scope);
            this.scope("viewports", viewportsBuilder=> {
                const viewPorts = ["xs", "sm", "md", "lg", "xl"];
                viewPorts.forEach(viewPort => {
                    viewportsBuilder.scope(viewPort, viewportBuilder => {
                        return viewportBuilder.addIntention(path, category, name, scope, viewPort);
                    })
                });
                return viewportsBuilder;
            }); 
            return this;
        }
        
        public scope(
            prefix: string, 
            buildAction: (IntentionsBuilder) => IIntentionsBuilder): IIntentionsBuilder {
            //save
            const currentPrefix = this.prefix;
            const currentInterfaceDefinition = this.interfaceDefinition;
            this.prefix = this.combinePath(prefix);

            this.interfaceDefinition = currentInterfaceDefinition.Scopes.find(scope => scope.Name === this.prefix);
            if (!this.interfaceDefinition)
            {
                this.interfaceDefinition = new Interface(this.prefix);
                currentInterfaceDefinition.Scopes.push(this.interfaceDefinition);
            }
            
            //build internal
            const result = buildAction(this);
            
            //restore
            this.interfaceDefinition = currentInterfaceDefinition;
            this.prefix = currentPrefix;
            return result;
        }
    
        public build(): any {
            if (!this.intentions.flattenMap){
                this.intentions.flattenMap = IntentionsUtils.flatten(this.intentions);
            }
            return this.intentions;
        }

        public generateContracts(): string{
            let contracts : string = "";
            contracts += "/********************************************************************\n"; 
            contracts += "THIS IS AUTO-GENERATED CODE.\n";
            contracts += "DO NOT MODIFY THIS FILE DIRECTLY OTHERWISE ALL CHANGES WILL BE LOST.\n";
            contracts += "********************************************************************/\n"; 
            contracts +="\nimport { Intention, IntentionsMap } from '@paperbits/common/appearence/intention'\n";
            
            contracts = this.appendInterface(contracts, this.interfaceDefinition);

            return contracts;
        }
        

        private buildHierarchy(path: string) : any {
            const segments: Array<string> = path.split(".");
            let node: Object = this.intentions;
            for(var i = 0; i < segments.length; i++){
                if (i === segments.length - 1) {
                    return node;       
                }
                else if (node[segments[i]]){
                    node = node[segments[i]];
                }
                else {
                    node = node[segments[i]] = {};
                }
            }
            return this.intentions;
        }

        private findClass(path: string, viewport?: string) : string {
            const segments: Array<string> = path.split(".");
            let node: Object = this.theme;
            for(var i = 0; i < segments.length; i++){
                if (viewport){
                    if (i === segments.length - 3) {
                        if (!node["viewports"] || segments.length < i + 3){
                            return "";
                        }
                        return (<string>node["viewports"][segments[i + 2]]).replace("%viewport%", viewport);
                    }
                }
                if (node[segments[i]]){
                    node = node[segments[i]];
                }
                else {
                    return "";
                }
            }
            return <string>node || "";
        }
    
        private combinePath(prefix:string): string
        {
            if (this.prefix){
                return this.prefix + "." + prefix;
            }
            return prefix;
        }

        private appendInterface(stringBuilder: string, definition: Interface): string{
            let interfaceName = definition.Name === 'Root' ? "Intentions" : "Intentions_" + definition.Name;
            interfaceName = this.replaceAll(interfaceName,".", "_");
            stringBuilder += "\nexport interface " + interfaceName + " extends IntentionsMap{\n";
            definition.Scopes.forEach(scope => {
                let fieldName = scope.Name.substring(scope.Name.lastIndexOf(".") + 1);
                stringBuilder += 
                    "\t" + 
                    this.replaceAll(this.replaceAll(fieldName, ".", "_"), "-", "_") + 
                    ": Intentions_" + 
                    this.replaceAll(this.replaceAll(scope.Name, ".", "_"), "-", "_") + 
                    ";\n";
            });
            definition.Intentions.forEach(intention => {
                stringBuilder += 
                    "\t" + 
                    this.replaceAll(this.replaceAll(intention.id, ".", "_"), "-", "_") + 
                    ": Intention;\n";
            });
            stringBuilder += "}\n";
            
            definition.Scopes.forEach(scope => {
                stringBuilder = this.appendInterface(stringBuilder, scope);
            });

            return stringBuilder;
        }

        //TODO: reuse extensions
        private replaceAll(target: string, search: string, replacement: string): string {
            return target.split(search).join(replacement);
        };
    }
