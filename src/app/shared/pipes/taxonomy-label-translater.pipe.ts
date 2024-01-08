import { Pipe, PipeTransform } from "@angular/core";
import { Store } from "@ngxs/store";
import { EntityLabelMappingState } from "src/app/state/entity-label-mapping.state";

@Pipe({
  name: "taxonomyLabelTranslater",
})
export class TaxonomyLabelTranslater implements PipeTransform {
  labelMapping: Map<string, string> = new Map();

  constructor(private store: Store) {
    this.labelMapping = this.store.selectSnapshot(
      EntityLabelMappingState.getConsumerGroups
    );
  }
  transform(taxonomyId: string): string {
    if (this.labelMapping.has(taxonomyId)) {
      return this.labelMapping.get(taxonomyId);
    }
    return taxonomyId;
  }
}
