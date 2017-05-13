export class ProgressPromise<T> implements Promise<T> {
    private inner: Promise<any>;
    private progressCallbacks: ((percent: number) => void)[];

    constructor(callback: (resolve: (value?: T | PromiseLike<T>) => void, reject: (error?: any) => void, progress: (percent: number) => void) => void) {
        this.progressCallbacks = [];
        this.inner = new Promise((resolve, reject) => callback(resolve, reject, this._progress.bind(this)));
    }

    public progress(callback: (percent: number) => void): ProgressPromise<T> {
        this.progressCallbacks.push(callback);
        return this;
    }

    private _progress(percent: number): void {
        this.progressCallbacks.forEach(callback => callback(percent));
    }

    public then<U>(onFulfilled?: (value: T) => U | PromiseLike<U>, onRejected?: (error: any) => U | PromiseLike<U> | void, progress?: (percent: number) => void): Promise<U> {
        if (progress) {
            this.progress(progress);
        }
        return this.inner.then(onFulfilled, onRejected);
    }

    public catch<U>(onRejected?: (error: any) => U | PromiseLike<U>): Promise<U> {
        return this.inner.catch(onRejected);
    }

    /// "then" would've been nice, but we need to make sure in advance that second promise is also a progress,
    /// since we need do divide percent values properly.
    public sequence<U>(next: (a: T) => ProgressPromise<U>): ProgressPromise<U> {
        return new ProgressPromise<U>((resolve, reject, progress) => {
            this.then(
                value => next(value).then(resolve, reject, percent => progress(50 + percent / 2)),
                reject,
                percent => progress(percent / 2)
            );
        });
    }
}