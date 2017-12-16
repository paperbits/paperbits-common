import { Intention } from "./intention";

export class IntentionsBuilder {
    
        constructor(protected theme: any){
    
        }
    
        protected intentions : Object = {};
    
        public addIntention(
            path: string, 
            intention: Intention): IntentionsBuilder{
            
            const nodes: Array<string> = path.split(".");
            
            let node: Object = this.intentions;
            let themeNode: any = this.theme;
            for(var i = 0; i < nodes.length; i++){
                if (i == nodes.length - 1) {
                    node[nodes[i]] = intention;
                    const classes = themeNode.classes;
                    intention.styles = () => classes;         
                }
                node = node[nodes[i]] = {};
                themeNode = themeNode[nodes[i]] = {};
            }
            
            return this;
        }
    
        public addIntentionPerViewPort(pathFunc: (string) => string, 
            intentionsFunc: (string) => Intention): IntentionsBuilder {
                this.scope("view-ports", ()=>{
                    const viewPorts = ["xs", "sm", "md", "lg", "xl"];
                    viewPorts.forEach(viewPort => {
                        this.scope(viewPort, () => {
                            this.addIntention(pathFunc(viewPort), intentionsFunc(viewPort));
                        })
                    });
                })
            return this;        
        }
        
        scope(prefix: string, buildAction: (IntentionsBuilder) => void): any {
            buildAction(new IntentionsScopeBuilder(this.theme, prefix, this.intentions));
        }
    
        public build(): any {
            return this.intentions;
        }
    }

    class IntentionsScopeBuilder extends IntentionsBuilder{
        
        constructor(theme: any, private prefix: string, intentions: Object){
            super(theme);
            this.intentions = intentions;
            
        }
        
        scope(prefix: string, buildAction: (IntentionsScopeBuilder) => void): any {
            buildAction(new IntentionsScopeBuilder(this.theme, prefix, this.intentions));
        }
    
        public addIntention(
            path: string, 
            intention: Intention): IntentionsBuilder{
                return super.addIntention(this.prefix + "." + path, intention);
            }
    }