/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */


import * as _ from "lodash";
import * as Objects from "../../src/objects";
import { IObjectStorage, Query, Operator, OrderDirection } from "../../src/persistence";
import { Bag } from "../../src";


export class MockObjectStorage implements IObjectStorage {
    protected storageDataObject: Object;
    private splitter: string = "/";

    constructor(initialData: Object = {}) {
        this.storageDataObject = initialData;
    }

    public getData(): Object {
        return this.storageDataObject;
    }

    public async addObject(path: string, dataObject: Object): Promise<void> {
        if (path) {
            const pathParts = path.split(this.splitter);
            const mainNode = pathParts[0];

            if (pathParts.length === 1 || (pathParts.length === 2 && !pathParts[1])) {
                this.storageDataObject[mainNode] = dataObject;
            }
            else {
                if (!_.has(this.storageDataObject, mainNode)) {
                    this.storageDataObject[mainNode] = {};
                }
                this.storageDataObject[mainNode][pathParts[1]] = dataObject;
            }
        }
        else {
            Object.keys(dataObject).forEach(prop => {
                const obj = dataObject[prop];
                const pathParts = prop.split(this.splitter);
                const mainNode = pathParts[0];

                if (pathParts.length === 1 || (pathParts.length === 2 && !pathParts[1])) {
                    this.storageDataObject[mainNode] = obj;
                }
                else {
                    if (!_.has(this.storageDataObject, mainNode)) {
                        this.storageDataObject[mainNode] = {};
                    }
                    this.storageDataObject[mainNode][pathParts[1]] = obj;
                }
            });
        }
    }

    public async getObject<T>(path: string): Promise<T> {
        const data = await this.getData();

        return Objects.getObjectAt(path, Objects.clone(data));
    }

    public async deleteObject(path: string): Promise<void> {
        if (!path) {
            return;
        }

        Objects.deleteNodeAt(path, this.storageDataObject);
    }

    public async updateObject<T>(path: string, dataObject: T): Promise<void> {
        if (!path) {
            throw new Error(`Parameter "path" not specified.`);
        }

        const clone: any = Objects.clone(dataObject);
        Objects.setValue(path, this.storageDataObject, clone);
        Objects.cleanupObject(clone); // Ensure all "undefined" are cleaned up
    }

    public async searchObjects<T>(path: string, query: Query<T>): Promise<Bag<T>> {
        const searchResultObject: Bag<T> = {};
        const data = await this.getData();

        if (!data) {
            return searchResultObject;
        }

        const searchObj = Objects.getObjectAt(path, data);
        let collection = Object.values(searchObj);

        if (query) {
            if (query.filters.length > 0) {
                collection = collection.filter(x => {
                    let meetsCriteria = true;

                    for (const filter of query.filters) {
                        let left = Objects.getObjectAt<any>(filter.left, x);
                        let right = filter.right;

                        if (left === undefined) {
                            meetsCriteria = false;
                            continue;
                        }

                        if (typeof left === "string") {
                            left = left.toUpperCase();
                        }

                        if (typeof right === "string") {
                            right = right.toUpperCase();
                        }

                        const operator = filter.operator;

                        switch (operator) {
                            case Operator.contains:
                                if (left && !left.contains(right)) {
                                    meetsCriteria = false;
                                }
                                break;

                            case Operator.equals:
                                if (left !== right) {
                                    meetsCriteria = false;
                                }
                                break;

                            default:
                                throw new Error("Cannot translate operator into Firebase Realtime Database query.");
                        }
                    }

                    return meetsCriteria;
                });
            }

            if (query.orderingBy) {
                const property = query.orderingBy;

                collection = collection.sort((x, y) => {
                    const a = Objects.getObjectAt<any>(property, x);
                    const b = Objects.getObjectAt<any>(property, y);
                    const modifier = query.orderDirection === OrderDirection.accending ? 1 : -1;

                    if (a > b) {
                        return modifier;
                    }

                    if (a < b) {
                        return -modifier;
                    }

                    return 0;
                });
            }
        }

        collection.forEach(item => {
            const segments = item.key.split("/");
            const key = segments[1];

            Objects.setValue(key, searchResultObject, item);
            Objects.cleanupObject(item); // Ensure all "undefined" are cleaned up
        });

        return searchResultObject;
    }

    public async saveChanges(delta: Object): Promise<void> {
        throw new Error("Not implemented");
    }

    public async loadData(): Promise<object> {
        throw new Error("Not implemented");
    }
}