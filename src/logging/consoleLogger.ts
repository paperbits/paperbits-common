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
    public async trackSession(properties?: Bag<string>): Promise<void> {
        this.trackEvent(`Session started.`, properties);
    }

    public async trackEvent(eventName: string, properties?: Bag<string>): Promise<void> {
        console.info(`${eventName}`, !!properties ? JSON.stringify(properties) : undefined);
    }

    public async trackError(message: string, error?: Error): Promise<void> {
        console.error(message, error);
    }

    public async trackView(name: string, properties?: Bag<string>): Promise<void> {
        console.info(`View: ${name}`, !!properties ? JSON.stringify(properties) : undefined);
    }

    public async trackMetric(metricName: string, properties?: Bag<string>): Promise<void> {
        console.info(`Metric: ${metricName}`, !!properties ? JSON.stringify(properties) : undefined);
    }

    public async trackDependency(dependencyName: string, properties?: Bag<string>): Promise<void> {
        console.info(`Invoking dependency: ${dependencyName}`, !!properties ? JSON.stringify(properties) : undefined);
    }
}