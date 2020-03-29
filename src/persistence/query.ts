export enum Operator {
    equals,
    contains
}

export enum OrderDirection {
    accending,
    descending
}

export interface Filter<TLeftOperand, TRightOperand> {
    left: TLeftOperand;
    operator: Operator;
    right: TRightOperand;
}

export class Query<T> {
    public filters: Filter<any, any>[] = [];
    public skipping: number;
    public taking: number;
    public selecting: string;
    public orderingBy: string;
    public orderDirection: OrderDirection;

    constructor() {
        this.orderDirection = OrderDirection.accending;
    }

    public where<TLeftOperand, TRightOperand>(left: TLeftOperand, operator: Operator, right: TRightOperand): Query<T> {
        this.filters.push({ left, operator, right });
        return this;
    }

    public select(path: string): Query<T> {
        this.selecting = path;
        return this;
    }

    public skip(itemsToSkip: number): Query<T> {
        this.skipping = itemsToSkip;
        return this;
    }

    public take(itemsToTake: number): Query<T> {
        this.taking = itemsToTake;
        return this;
    }

    public orderBy(property: string): Query<T> {
        this.orderingBy = property;
        this.orderDirection = OrderDirection.accending;
        return this;
    }

    public orderByDesc(property: string): Query<T> {
        this.orderingBy = property;
        this.orderDirection = OrderDirection.descending;
        return this;
    }

    public static from<T>(): Query<T> {
        return new Query<T>();
    }
}