import { Intention } from "./intention";
import { Record } from "immutable";

export class IntentionsUtils
{
    public static flatten(intentions: any): any
    {
        let result: any = {};
        
        this.addIntentions(intentions, result);
        
        return result;
    }

    private static addIntentions(intentions: any, result: Array<Intention>){
        Object.getOwnPropertyNames(intentions).filter(n => n !== "for").forEach(key => {
            if (intentions[key].fullId){
                result[intentions[key].fullId] = intentions[key];
            } else {
                this.addIntentions(intentions[key], result);
            }
        });
    }

    public static toArray(intentions: any,): Array<Intention>
    {
        let result: Array<Intention> = [];
        
        this.addIntentionsToArray(intentions, result);
        
        return result;
    }

    private static addIntentionsToArray(intentions: Record<string, any>, result: Array<Intention>){
        intentions.toSeq().forEach((value, key) => {
            if (key === "name"){
                return;
            }
            if (value.fullId){
                result.push(value);
            } else {
                this.addIntentionsToArray(value, result);
            }
        });
    }
}