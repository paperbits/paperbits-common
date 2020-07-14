/**
 * @license
 * Copyright Paperbits. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file and at https://paperbits.io/license/mit.
 */

import { Bag } from "../bag";


export interface Logger {
    /**
     * Traces information related to beginning of session.
     */
    trackSession(properties?: object): Promise<void>;

    /**
     * Tracks an arbitrary error.
     * @param error {Error} Error object.
     * @param properties {Bag<string>} An object of additional properties.
     */
    trackError(error: Error, properties?: Bag<string>): Promise<void>;

    /**
     * Tracks activation of a specified view.
     * @param viewName {string} Name of the view, e.g. "saveChangesDialog".
     * @param arguments
     */
    trackView(viewName: string, properties?: Bag<string>): Promise<void>;

    /**
     * Tracks an arbitrary event.
     * @param eventName {string} Name of the event, e.g. "mousedown"
     * @param properties {Bag<string>}  An object of additional properties, e.g. { clientX: 100, clientY: 100 }.
     */
    trackEvent(eventName: string, properties?: Bag<string>): Promise<void>;

    /**
     * Tracks an arbitrary metric.
     * @param metricName {string} Name of the metric, e.g. "serverResponse".
     * @param properties {Bag<string>} An object of additional properties, e.g. { latency: 1000 }.
     */
    trackMetric(metricName: string, properties?: Bag<string>): Promise<void>;

    /**
     * Tracks dependency component invocation.
     * @param name {string} Name of the dependency, e.g. "blobStorage".
     * @param properties {Bag<string>} An object of additional properties, e.g. { bucket: "media" }.
     */
    trackDependency(name: string, properties?: Bag<string>): Promise<void>;
}
