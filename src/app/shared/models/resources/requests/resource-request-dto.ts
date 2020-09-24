import { EntityBase } from '../../Entities/entity-base';

export class ResourceRequestDTO extends EntityBase {
  hasPreviousVersion: string;

  constructor() {
    super();
  }
}
