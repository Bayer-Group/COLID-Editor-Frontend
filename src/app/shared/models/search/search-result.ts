import { Aggregation } from "./aggregation";
import { RangeFilter } from "./range-filter";
import { SearchHits } from "./search-hits";
import { SuggestMap } from "./suggest-map";

export class SearchResult {
  hits: SearchHits;
  suggest: SuggestMap;
  originalSearchTerm: string;
  suggestedSearchTerm: string;
  aggregations: Aggregation[];
  rangeFilters: RangeFilter[];

  constructor() {
    this.hits = new SearchHits();
  }
}
