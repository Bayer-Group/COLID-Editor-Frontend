import { Component, forwardRef, Input, DoCheck, ViewChild, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TaxonomyState, FetchTaxonomyList } from 'src/app/state/taxonomy.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { TaxonomyResultDTO } from 'src/app/shared/models/taxonomy/taxonomy-result-dto';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { Constants } from 'src/app/shared/constants';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TreeViewSelectionChangeEvent } from 'src/app/shared/models/tree-view-selection-change-event';

@Component({
  selector: 'app-form-item-input-taxonomy',
  templateUrl: './form-item-input-taxonomy.component.html',
  styleUrls: ['./form-item-input-taxonomy.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputTaxonomyComponent),
      multi: true
    }
  ]
})

export class FormItemInputTaxonomyComponent extends FormItemInputBaseComponent {
  @Select(TaxonomyState.getTaxonomyList) taxonomyList$: Observable<Map<string, TaxonomyResultDTO[]>>;

  getTaxonomyList: TaxonomyResultDTO[];
  getTaxonomyByType: TaxonomyResultDTO;

  taxonomyMenuOpened: boolean = false;

  @Input() metadata: MetaDataProperty;
  @Input() singleSelection: boolean = false;

  _internalValue: TaxonomyResultDTO[] = [];


  get taxonomyType(): string { return this.metadata.properties[Constants.Metadata.Range] };

  constructor(private store: Store) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new FetchTaxonomyList(this.taxonomyType));
    this.taxonomyList$.subscribe(res => {
      this.getTaxonomyList = res.get(this.taxonomyType);
    });
  }

  handleSelectionChanged(event: TreeViewSelectionChangeEvent) {
      this._internalValue = this.filterDuplicatesAndRemoveChildNodes(event.values);
      let nodesAsString = this._internalValue.map(x => x.id);

      /*
      If it is an initial change, the value is written from the upper component and
      already stored as value in the form.
      Therefore, the changes do not need to be passed further up.
      */
       if (!event.initialChange) {
        this.internalValue = nodesAsString;
        this.handleValueChanged(nodesAsString);
      }
  }

  // Filter our all double entries and return only the id of parents and selected ones
  filterDuplicatesAndRemoveChildNodes(event: TaxonomyResultDTO[]): TaxonomyResultDTO[] {
    var resultList: TaxonomyResultDTO[] = Object.assign(event);
    event.forEach(e => {
      if (e.children.every(n => event.some(r => r.id === n.id))) {
        resultList = resultList.filter(re => !e.children.some(n => n.id === re.id));
      }
    });
    return resultList;
  }

  removeTaxonomy(taxonomy: TaxonomyResultDTO) {
    this.handleSelectionChanged({ initialChange: false, values: this._internalValue.filter(t => t.id !== taxonomy.id) });
  }

  handleMenuOpened() {
    this.taxonomyMenuOpened = true;
  }

  handleMenuClosed() {
    this.taxonomyMenuOpened = false;
  }

  removeItems() {
    this.handleSelectionChanged({ initialChange: false, values: [] });
  }
}
