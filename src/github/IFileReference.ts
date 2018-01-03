﻿import { IBag } from '../cIBag;

export interface IFileReference {
    path: string;
    metadata: IBag<any>;
}