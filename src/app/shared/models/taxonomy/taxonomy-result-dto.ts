import { BaseEntityResultDTO } from "../Entities/base-entity-result-dto";

export class TaxonomyResultDTO extends BaseEntityResultDTO {
  hasParent: boolean;
  hasChild: boolean;
  children: TaxonomyResultDTO[];
  level: number = 0;
  foundInSearch: boolean = false;
  expanded: boolean = false;

  public constructor() {
    super();
  }
}
