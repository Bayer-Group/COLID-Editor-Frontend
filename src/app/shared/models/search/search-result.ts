import { Aggregation } from './aggregation';
import { RangeFilter } from './range-filter';
import { SearchHits } from './search-hits';

export class SearchResult {
  hits: SearchHits;
  originalSearchTerm: string;
  aggregations: Aggregation[];
  rangeFilters: RangeFilter[];

  constructor() {
    this.hits = new SearchHits();
  }
}
