import { Entity } from './entity';


export class EntityTypeDto extends Entity {
    label: string;
    description: string;
    instantiable: boolean;
    subClasses: Array<EntityTypeDto>;

    constructor(){
        super()
    }
}