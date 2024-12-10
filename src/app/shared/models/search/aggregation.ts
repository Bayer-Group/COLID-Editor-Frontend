import { AggregationBucket } from './aggregation-bucket';
import { AggregationType } from './aggregation-type';

export class Aggregation {
  key: string;
  aggregationType: AggregationType;
  label: string;
  order: number;
  taxonomy: boolean;
  buckets: AggregationBucket[];
}
