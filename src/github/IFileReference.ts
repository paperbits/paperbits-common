﻿import { IBag } from "../IBag";

export interface IFileReference {
    path: string;
    metadata: IBag<any>;
}