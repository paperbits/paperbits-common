import { MediaContract } from "./../media/mediaContract";
import { IDataTransfer } from '../editing/IDataTransfer';
import { IContentDropHandler } from  '../editing/IContentDropHandler';
import { IContentDescriptor } from  '../editing/IContentDescriptor';

export interface IContentDropHandler {
    getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor;
    getContentDescriptorFromMedia?(media: MediaContract): IContentDescriptor
}