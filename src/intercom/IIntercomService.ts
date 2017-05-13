import { IIntercomLead } from '../intercom/IIntercomLead';

export interface IIntercomService {
    update(data: IIntercomLead): void;
}