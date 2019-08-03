/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { Bag } from "../";
import { Logger } from "./logger";


export class ConsoleLogger implements Logger {
    constructor() {
        this.traceSession();
    }

    public async traceSession(): Promise<void> {
        this.traceEvent(`Session started.`);
    }

    public async traceEvent(eventName: string, properties?: Bag<string>, measurments?: Bag<number>): Promise<void> {
        console.info(`${eventName}`);
    }

    public async traceError(error: Error, handledAt?: string): Promise<void> {
        console.error(error);
    }

    public async traceView(name: string): Promise<void> {
        console.info(`View: ${name}`);
    }
}