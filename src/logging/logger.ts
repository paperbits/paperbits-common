/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { Bag } from "../";


export interface Logger {
    /**
     * Traces information related to beginning of session.
     */
    traceSession(): Promise<void>;

    /**
     * Traces error.
     * @param error {Error} Error object.
     * @param handledAt 
     */
    traceError(error: Error, handledAt?: string): Promise<void>;

    /**
     * Traces opening of a particular view.
     * @param name {string} Name of the view.
     */
    traceView(name: string): Promise<void>;

    /**
     * Traces an arbitrary event.
     * @param eventName {string} Name of the event.
     * @param properties {Bag<string>} A bag of event properties, e.g. { event: "click" }.
     * @param measurments {Bag<number>} A bag of measurement, e.g. { numberOfClicks: 5 }.
     */
    traceEvent(eventName: string, properties?: Bag<string>, measurments?: Bag<number>): Promise<void>;
}
