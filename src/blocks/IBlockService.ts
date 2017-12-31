import { IBlock } from './IBlock';
import { Contract } from '../editing/contentNode';

export interface IBlockService {
    getBlockByKey(key: string): Promise<IBlock>;
    
    search(pattern?: string): Promise<Array<IBlock>>;

    deleteBlock(block: IBlock): Promise<void>;

    createBlock(title: string, description: string, content: Contract): Promise<void>;

    updateBlock(block: IBlock): Promise<void>;
}