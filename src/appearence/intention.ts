export class Intention{
    
    public styles: () => string;

    constructor(
        public category: string, 
        public name: () => string,
        public scope: string){

        }
}