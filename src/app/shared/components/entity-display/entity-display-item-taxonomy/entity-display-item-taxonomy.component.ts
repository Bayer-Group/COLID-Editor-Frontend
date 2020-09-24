import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Select } from '@ngxs/store';
import { TaxonomyState } from 'src/app/state/taxonomy.state';
import { Observable } from 'rxjs';
import { TaxonomyResultDTO } from 'src/app/shared/models/taxonomy/taxonomy-result-dto';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-entity-display-item-taxonomy',
  templateUrl: './entity-display-item-taxonomy.component.html',
  styleUrls: ['./entity-display-item-taxonomy.component.scss']
})
export class EntityDisplayItemTaxonomyComponent implements OnInit {
  @Select(TaxonomyState.getTaxonomyList) taxonomyList$: Observable<Map<string, TaxonomyResultDTO[]>>;

  taxonomyList: TaxonomyResultDTO[];

  @Input() values: string[] = [];
  @Input() metadataProperty: MetaDataProperty;

  @Input() key: string;
  @Input() range: string;

  badgeTaxonomies = [Constants.Metadata.Keywords, Constants.ConsumerGroup.HasPidUriTemplate];

  // TODO: Inject list of taxonomies to be shwon as badges
  get isBadgeTaxonomy(): boolean {
    const key = this.metadataProperty == null ? this.key : this.metadataProperty.key;
    return this.badgeTaxonomies.includes(key);
  }

  constructor() { }

  ngOnInit() {
    const range = this.range != null ? this.range : this.metadataProperty.properties[Constants.Metadata.Range];
    this.taxonomyList$.subscribe(taxonomies => {
      if (taxonomies.has(range) && this.values != null) {
        this.taxonomyList = this.filterTaxonomyList(taxonomies.get(range));
      }
    })
  }

  filterTaxonomyList(taxonomyList: TaxonomyResultDTO[]): TaxonomyResultDTO[] {
    let newList = [];
    taxonomyList.forEach(t => {
      if (this.values.includes(t.id)) {
        newList.push(t);
      } else {
        const nestedList = this.filterTaxonomyList(t.children);
        newList = newList.concat(nestedList);
      }
    });
    return newList;
  }
}
