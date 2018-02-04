import { Intention, IIntentionsBuilder, IntentionsMap, IntentionWithViewport } from "./intention";
import { Array, Object } from "es6-shim";
import { IntentionsUtils } from "./intentionsUtils";

export class Interface {
    public Name: string;
    public Scopes: Array<Interface>;
    public Intentions: Array<Intention>;
    public IsViewportContainer: boolean;

    constructor(name: string, isViewportContainer: boolean = false){
        this.Name = name;
        this.IsViewportContainer = isViewportContainer;
        this.Scopes = new Array<Interface>();
        this.Intentions = new Array<Intention>();
    }
}

/// TODO: Consider immutable; consider to split code generator and intentions builder
export class IntentionsBuilder implements IIntentionsBuilder {
    
    private static viewPorts = ["xs", "sm", "md", "lg", "xl"];
        
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
    private viewportContainer: boolean;
    
    public addIntention(
            path: string, 
            category: string,
            name: string,
            scope: string): IIntentionsBuilder{
            
        if (this.viewportContainer === true){
            this.addIntentionPerViewPort(path, category, name, scope);
        } else {
            this.addIntentionInternal(path, category, name, scope);
        }

        return this;
    }
        
    public addIntentionPerViewPort(
        path: string, 
        category: string,
        name: string,
        scope: string): IIntentionsBuilder {

        const parent = this.buildHierarchy(this.prefix);
        const intentionSupplier = (vp) => parent[vp][path];
        
        this.addIntentionInternal(path, category, name, scope);
        
        const current = parent[path];
        current["for"] = intentionSupplier;
        
        IntentionsBuilder.viewPorts.forEach(viewPort => {
            this.scope(viewPort, viewportBuilder => {
                return viewportBuilder.addIntentionInternal(path, category, name, scope, viewPort);
            })
        });
        return this;
    }

    private addIntentionInternal(
        path: string, 
        category: string,
        name: string,
        scope: string,
        viewport?: string): IIntentionsBuilder {
        
        const lastSegment: string = path;
        path = this.combinePath(path);
        const intention : Intention= this.buildHierarchy(path);
        const cssClass = this.findClass(path, viewport);
        intention.category = category;
        intention.name= () => name;
        intention.scope= scope;
        intention.params= () => cssClass;
        intention.id= lastSegment;
        intention.fullId= path;

        this.interfaceDefinition.Intentions.push(intention);

        return this;
    }
        
        public scope(
            prefix: string, 
            buildAction: (IntentionsBuilder) => IIntentionsBuilder,
            viewportContainer: boolean = false): IIntentionsBuilder {

            if (this.viewportContainer && viewportContainer){
                throw new Error("Nested viewport container scopes are not allowed.")
            }

            //save
            const currentPrefix = this.prefix;
            const currentInterfaceDefinition = this.interfaceDefinition;
            const currentViewportContainer = this.viewportContainer;
            this.prefix = this.combinePath(prefix);
            this.viewportContainer = viewportContainer;

            this.interfaceDefinition = currentInterfaceDefinition.Scopes.find(scope => scope.Name === this.prefix);
            if (!this.interfaceDefinition)
            {
                const newInterfaceDefinition = new Interface(this.prefix, viewportContainer);
                currentInterfaceDefinition.Scopes.push(newInterfaceDefinition);
                this.interfaceDefinition = newInterfaceDefinition;
                
            }
            
            //build internal
            const result = buildAction(this);
            
            //restore
            this.interfaceDefinition = currentInterfaceDefinition;
            this.prefix = currentPrefix;
            this.viewportContainer = currentViewportContainer;
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
            contracts += "DO NOT MODIFY THIS FILE MANUALLY, OTHERWISE ALL CHANGES WILL BE LOST.\n";
            contracts += "********************************************************************/\n"; 
            contracts +="\nimport { Intention, IntentionsMap, IntentionWithViewport } from '@paperbits/common/appearence/intention'\n";
            
            contracts = this.appendInterface(contracts, this.interfaceDefinition);

            return contracts;
        }        

        private buildHierarchy(path: string) : any {
            const segments: Array<string> = path.split(".");
            let node: Object = this.intentions;
            for(var i = 0; i < segments.length; i++){
                if (node[segments[i]]){
                    node = node[segments[i]];
                }
                else {
                    node[segments[i]] = {};
                    node = node[segments[i]];
                }
            }
            return node;
        }

        private findClass(path: string, viewport?: string) : any {
            const segments: Array<string> = path.split(".");
            let node: Object = this.theme;
            for(var i = 0; i < segments.length; i++){
                const segment = segments[i];
                if (IntentionsBuilder.viewPorts.find(vp => vp === segment)){
                    const cssClass = (<string>node["viewports"][segments[i + 1]]).replace("%viewport%", segment);
                    return cssClass;
                }
                if (node[segment]){
                    node = node[segment];
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
            const intentionClassName = definition.IsViewportContainer ? "IntentionWithViewport" : "Intention";

            definition.Intentions.forEach(intention => {
                stringBuilder += 
                    "\t" + 
                    this.replaceAll(this.replaceAll(intention.id, ".", "_"), "-", "_") + 
                    ": " + intentionClassName + ";\n";
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
