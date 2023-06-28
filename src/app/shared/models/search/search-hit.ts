import { DocumentMap } from "./document-map";

export class SearchHit {
  id: string;
  score: number;
  source: DocumentMap;
  highlight: StringArrayMap;
}

export interface StringArrayMap {
  [key: string]: string[];
}
