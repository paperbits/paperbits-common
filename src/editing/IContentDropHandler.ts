import { MediaContract } from "./../media/mediaContract";
import { IDataTransfer, IContentDescriptor } from "../editing";

export interface IContentDropHandler {
    getContentDescriptorFromDataTransfer(dataTransfer: IDataTransfer): IContentDescriptor;
    getContentDescriptorFromMedia?(media: MediaContract): IContentDescriptor;
}