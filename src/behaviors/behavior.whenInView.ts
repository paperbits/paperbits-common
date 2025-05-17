// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BehaviorHandle } from "./behavior"; // Changed import path

export class WhenInViewBehavior {
    public static attach(element: HTMLElement, callback: () => void): BehaviorHandle {
        const onIntersect = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && callback) {
                    callback();
                }
            });
        };

        const observer = new IntersectionObserver(onIntersect);
        observer.observe(element);

        return {
            detach: () => { // Renamed dispose to detach
                observer.disconnect();
            }
        };
    }
}