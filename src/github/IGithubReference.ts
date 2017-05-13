import { IGithubObject } from '../github/IGithubObject';

export interface IGithubReference {
    ref: string;
    url: string;
    object: IGithubObject;
}