import { MetaDataProperty } from "../metadata/meta-data-property";

export class HistoryEntityDirection {
  metadata: Array<MetaDataProperty>;
  entity: any;
  entityVersion: any;
}

export class HistoryEntity {
  additions: HistoryEntityDirection = new HistoryEntityDirection();
  removals: HistoryEntityDirection = new HistoryEntityDirection();
  lastchangedByDateTime: string;
  isExpanded: boolean;
}
