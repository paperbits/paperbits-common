export interface Intention{
    styles: () => string;
    id: string;
    fullId: string;
    category: string, 
    name: () => string,
    scope: string;
}

export interface IntentionsMap{
    flattenMap: Array<Intention>;
}

export interface IIntentionsBuilder
{
    generateContracts(): string;
    build(): any;
    addIntention(
        path: string, 
        category: string,
        name: string,
        scope: string,
        viewport?: string): IIntentionsBuilder;
    addIntentionPerViewPort(path: string, 
        category: string,
        name: string,
        scope: string): IIntentionsBuilder;
    scope(
        prefix: string, 
        buildAction: (IntentionsBuilder) => IIntentionsBuilder): IIntentionsBuilder;
}

export interface IIntentionsProvider{
    getIntentions();
    generateContracts(): string;
}