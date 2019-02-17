
export enum Operator {
    equals,
    contains
}

export enum OrderDirection {
    accending,
    descending
}

export interface Filter<T> {
    left: T;
    operator: Operator;
    right: T;
}

export class Query<T> {
    public filters: Filter<any>[] = [];
    public skipping: number;
    public taking: number;
    public orderingBy: string;
    public orderDirection: OrderDirection;

    constructor() {
        this.orderDirection = OrderDirection.accending;
    }

    public where<TOperand>(left: TOperand, operator, right: TOperand): Query<T> {
        this.filters.push({ left, operator, right });
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



// export interface 
// citiesRef.where("state", "==", "CA")
// citiesRef.where("population", "<", 100000)
// citiesRef.where("name", ">=", "San Francisco")
// citiesRef.orderBy("name", "desc").limit(3)