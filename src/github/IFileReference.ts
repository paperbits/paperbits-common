﻿import { IBag } from '../core/IBag';

export interface IFileReference {
    path: string;
    metadata: IBag<any>;
}