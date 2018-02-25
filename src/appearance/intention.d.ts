export interface Intention{
    params: () => any;
    fullId: string;
    name: () => string;
    scope: string;
    properties: any;
}

export interface IntentionWithViewport extends Intention{
	for: (viewport: string) => Intention;
}

export interface IntentionsMap{
    [key]: Intention;
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