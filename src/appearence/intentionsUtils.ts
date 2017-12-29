import { Intention } from "./intention";

export class IntentionsUtils
{
    public static flatten(intentions: any): Array<Intention>
    {
        let result: Array<Intention> = [];
        
        this.addIntentions(intentions, result);
        
        return result;
    }

    private static addIntentions(intentions: any, result: Array<Intention>){
        Object.getOwnPropertyNames(intentions).forEach(key => {
            if (intentions[key].fullId){
                result[intentions[key].fullId] = intentions[key];
            } else {
                this.addIntentions(intentions[key], result);
            }
        });
    }
}