import { ResourceSearchDTO } from "../search/resource-search-dto";

export class SearchFilterEditor {
  filterJson: ResourceSearchDTO;

  constructor(searchFilters: ResourceSearchDTO) {
    this.filterJson = searchFilters;
  }
}
