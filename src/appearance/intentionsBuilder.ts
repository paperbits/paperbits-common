import { Intention, IIntentionsBuilder, IntentionsMap, IntentionWithViewport } from "./intention";
import { Array, Object } from "es6-shim";
import { Record, Map } from "immutable";
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

export class IntentionRecord extends Record({ 
    params: () => {},
    fullId: "",
    name: () => "",
    scope: "",
    for: (viewport: string) => <Intention>{} }) {

    params: () => any;
    fullId: string;
    name: () => string;
    scope: string;
    for: (viewport: string) => Intention;

    constructor(params?: Intention) {
        params ? super(params) : super();
    }

    with(values: Intention) {
        return this.merge(values) as this;
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

    private intentions : Map<string, any> = Map();
    private prefix: string;
    private viewportContainer: boolean;
    
    public addIntention(
            id: string,
            name: string,
            scope: string): IIntentionsBuilder{
            
        if (this.viewportContainer === true){
            this.addIntentionPerViewPort(id, name, scope);
        } else {
            this.addIntentionInternal(id, name, scope);
        }

        return this;
    }
        
    public addIntentionPerViewPort(
        id: string, 
        name: string,
        scope: string): IIntentionsBuilder {

        const path = this.combinePath(id).split(".");
        let parent = this.intentions.getIn(path);
        const intentionSupplier = (vp) => vp ? parent.get(vp).get(id) : parent.get(id);
        
        this.addIntentionInternal(id, name, scope, null);
        
        this.intentions = this.intentions.updateIn(path, (val: IntentionRecord) => val.set("for", intentionSupplier));
        
        IntentionsBuilder.viewPorts.forEach(viewPort => {
            this.scope(viewPort, viewportBuilder => {
                return viewportBuilder.addIntentionInternal(id, name, scope, viewPort);
            })
        });
        return this;
    }

    private addIntentionInternal(
        id: string, 
        name: string,
        scope: string,
        viewport?: string): IIntentionsBuilder {
        
        const path = this.combinePath(id);
        const cssClass = this.findClass(path, viewport);
        const intention : IntentionRecord = new IntentionRecord({
            name: () => name,
            scope: scope,
            params: () => cssClass,
            fullId: path
        });
        this.intentions = this.intentions.setIn(path.split("."), intention);
        this.interfaceDefinition.Intentions.push(intention);
        return this;
    }

    public scopePerViewport(
        prefix: string, 
        buildAction: (IntentionsBuilder) => IIntentionsBuilder): IIntentionsBuilder{
        return this.scope(prefix, buildAction, true);
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
        return this.intentions;
    }

    public generateContracts(): string {
        let contracts : string = "";
        contracts += "/********************************************************************\n"; 
        contracts += "THIS IS AUTO-GENERATED CODE.\n";
        contracts += "DO NOT MODIFY THIS FILE MANUALLY, OTHERWISE ALL CHANGES WILL BE LOST.\n";
        contracts += "********************************************************************/\n"; 
        contracts +="\nimport { Intention, IntentionsMap, IntentionWithViewport } from '@paperbits/common/appearance/intention'\n";

        contracts = this.appendInterface(contracts, this.interfaceDefinition);

        return contracts;
    }

    private findClass(path: string, viewport?: string) : any {
        const segments: Array<string> = path.split(".");
        let node: any = this.theme;
        for(var i = 0; i < segments.length; i++){
            const segment = segments[i];
            if (IntentionsBuilder.viewPorts.find(vp => vp === segment)){
                node = node[segments[i + 1]];
                const cssClass = typeof node === 'function' ? node(segment) : node;
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
            const name = intention.fullId.substring(intention.fullId.lastIndexOf(".") + 1)
            stringBuilder += 
                "\t" + 
                this.replaceAll(name, "-", "_") + 
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
