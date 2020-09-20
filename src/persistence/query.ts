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
    public skipping: number = 0;
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

    public copy<T>(): Query<T> {
        const query = new Query<T>();
        query.filters = this.filters;
        query.selecting = this.selecting;
        query.orderingBy = this.orderingBy;
        query.orderDirection = this.orderDirection;

        return query;
    }
}

export interface Page<T> {
    value: T[];
    takePrev?(): Promise<Page<T>>;
    takeNext?(): Promise<Page<T>>;
}