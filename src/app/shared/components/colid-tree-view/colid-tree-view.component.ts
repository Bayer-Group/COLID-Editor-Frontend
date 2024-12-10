import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';
import { TaxonomyResultDTO } from '../../models/taxonomy/taxonomy-result-dto';
import { TreeViewSelectionChangeEvent } from '../../models/tree-view-selection-change-event';
import { MatCheckboxChange } from '@angular/material/checkbox';

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'colid-tree-view',
  templateUrl: 'colid-tree-view.component.html',
  styleUrls: ['colid-tree-view.component.scss']
})
export class ColidTreeViewComponent implements OnInit, OnChanges {
  @Input() singleSelection: boolean = false;
  @Input() TREE_DATA: TaxonomyResultDTO[] = [];
  @Input() taxonomysToExpand: TaxonomyResultDTO[] = [];
  @Input() highlightSelectedNode: boolean = false;

  @Input() set selectedNodes(values: string[]) {
    if (values != null) {
      setTimeout(() => {
        this._selectedNodes = values;
        this.handleInputSelectionChanged(this._selectedNodes);
      });
    }
  }

  @Input() set highlightedTaxonomyDetail(value: TaxonomyResultDTO | null) {
    if (value != null) {
      this.selectedNodeIdentifier = value.id;
    }
  }

  @Output() selectionChanged: EventEmitter<TreeViewSelectionChangeEvent> =
    new EventEmitter<TreeViewSelectionChangeEvent>();

  @Output() showDetails: EventEmitter<TaxonomyResultDTO> =
    new EventEmitter<TaxonomyResultDTO>();

  _selectedNodes: string[] = [];

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TaxonomyResultDTO, TaxonomyResultDTO>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TaxonomyResultDTO, TaxonomyResultDTO>();

  treeControl: FlatTreeControl<TaxonomyResultDTO>;

  treeFlattener: MatTreeFlattener<TaxonomyResultDTO, TaxonomyResultDTO>;

  dataSource: MatTreeFlatDataSource<TaxonomyResultDTO, TaxonomyResultDTO>;

  /** The selection for checklist */
  checklistSelection: SelectionModel<TaxonomyResultDTO>;

  allSelected = false;

  selectedNodeIdentifier: string = '';

  get isTaxonomy(): boolean {
    return this.TREE_DATA.some((t) => t.hasChild);
  }

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TaxonomyResultDTO>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }

  ngOnInit() {
    this.checklistSelection = new SelectionModel<TaxonomyResultDTO>(
      !this.singleSelection /* multiple */
    );
    this.dataSource.data = this.TREE_DATA;

    this.checklistSelection.changed.subscribe((_) => {
      this.allSelected = this.TREE_DATA.every((t) =>
        this.checklistSelection.isSelected(t)
      );
    });

    /** Writing the value from the upper component takes place before the components are initialized,
     * so no data is available yet. The data must be written intially here. */
    this.handleInputSelectionChanged(this._selectedNodes);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['TREE_DATA'] && !changes['TREE_DATA'].firstChange) {
      this.dataSource.data = this.TREE_DATA;
      this.taxonomysToExpand.forEach((taxonomy) => {
        this.treeControl.expand(taxonomy);
      });
      this.handleInputSelectionChanged(this._selectedNodes);

      // added some delay so that the DOM can get updated
      setTimeout(() => {
        let nodeElements = document.getElementsByClassName('searchhit');
        if (nodeElements.length > 0) {
          nodeElements[0].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 500);
    }
  }

  getLevel = (node: TaxonomyResultDTO) => node.level;

  isExpandable = (node: TaxonomyResultDTO) => node.hasChild;

  getChildren = (node: TaxonomyResultDTO): TaxonomyResultDTO[] => node.children;

  hasChild = (_: number, _nodeData: TaxonomyResultDTO) => _nodeData.hasChild;

  /** Transformer to convert nested node to flat node. Record the nodes in maps for later use. */
  transformer = (node: TaxonomyResultDTO, level: number) => {
    node.level = level;
    return node;
  };

  selectAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.checklistSelection.select(
        ...this.treeControl.dataNodes.filter(
          (node) => !this.checklistSelection.isSelected(node)
        )
      );
    } else {
      this.checklistSelection.deselect(
        ...this.treeControl.dataNodes.filter((node) =>
          this.checklistSelection.isSelected(node)
        )
      );
    }
    this.selectionChanged.emit({
      initialChange: false,
      values: this.checklistSelection.selected
    });
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TaxonomyResultDTO): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TaxonomyResultDTO): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the item selection. Select/deselect all the descendants node */
  itemSelectionToggle(node: TaxonomyResultDTO, initial: boolean = false): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    const descendantIds = this.treeControl
      .getDescendants(node)
      .map((n) => n.id);
    // nodes can appear in multiple parents, so have to find all affected nodes of a selection
    const affectedNodes = this.treeControl.dataNodes.filter((n) =>
      descendantIds.includes(n.id)
    );
    // depending on selection or deselection all the nodes have to be added or removed
    let selectedNodes = this.checklistSelection.isSelected(node)
      ? this.checklistSelection.selected.concat(affectedNodes)
      : this.checklistSelection.selected.filter(
          (n) => !affectedNodes.includes(n)
        );

    // on deselection have to make sure that all parents of the deselected nodes are also deselected
    if (!this.checklistSelection.isSelected(node)) {
      affectedNodes.forEach((node) => {
        selectedNodes = this.removeTaxonomy(node, selectedNodes);
      });
    }

    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    this.checkAllParentsSelection(node);

    this.selectionChanged.emit({
      initialChange: initial,
      values: selectedNodes
    });
  }

  /** Toggle a leaf item selection. Check all the parents to see if they changed */
  leafItemSelectionToggle(
    node: TaxonomyResultDTO,
    initial: boolean = false
  ): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);

    // filter out the nodes, that got the same id like the one which got selected
    let valuesSelected = this.checklistSelection.selected;
    if (!this.checklistSelection.isSelected(node) && !initial) {
      valuesSelected = this.removeTaxonomy(
        node,
        this.checklistSelection.selected
      );
    }
    this.selectionChanged.emit({
      initialChange: initial,
      values: valuesSelected
    });
  }

  private removeTaxonomy(
    taxonomy: TaxonomyResultDTO,
    selectedItems: TaxonomyResultDTO[]
  ) {
    //remove the X'ed ID.
    var selectedValues: TaxonomyResultDTO[] = selectedItems.filter(
      (t) => t.id !== taxonomy.id
    );
    //remove all the children if any.
    taxonomy.children
      .map((t) => t.id)
      .forEach((idToDelete) => {
        const index = selectedValues.findIndex(({ id }) => id === idToDelete);
        selectedValues.splice(index, 1);
      });
    //remove all the parents and grandparents from selection if any.
    if (taxonomy.hasParent) {
      /* Bug Fix 
        this recursive function returns true for parents & grandparents of the X'd taxonomyID
        and thus those parent entities could be removed from selection because
        entire parent shouldn't be shown as selected if "at the least" a single child is removed (X'd) */
      selectedValues.forEach((item) => {
        this.removeParentsAndGrandparents(item, taxonomy.id)
          ? (selectedValues = selectedValues.filter((t) => t.id !== item.id))
          : selectedValues;
      });
    }
    return selectedValues;
  }

  removeParentsAndGrandparents(
    taxonomyList: TaxonomyResultDTO,
    taxonomyID: string
  ) {
    try {
      if (taxonomyList.children.some((x) => x.id == taxonomyID)) {
        return true;
      } else if (taxonomyList.children.length > 0) {
        for (var i = 0; i < taxonomyList.children.length; i++) {
          return this.removeParentsAndGrandparents(
            taxonomyList.children[i],
            taxonomyID
          );
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TaxonomyResultDTO): void {
    let parent: TaxonomyResultDTO | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TaxonomyResultDTO): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TaxonomyResultDTO): TaxonomyResultDTO | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  handleInputSelectionChanged(value: string[]) {
    if (this.checklistSelection == null) return;
    this.checklistSelection.clear();
    if (this.treeControl != null && this.treeControl.dataNodes != null) {
      this.handleNodeList(value, this.TREE_DATA);
    }
  }

  handleNodeList(identifiers: string[], results: TaxonomyResultDTO[]) {
    results.forEach((t) => {
      if (identifiers.includes(t.id)) {
        if (t.hasChild) {
          this.itemSelectionToggle(t, true);
        } else {
          this.leafItemSelectionToggle(t, true);
        }
      } else {
        this.handleNodeList(identifiers, t.children);
      }
    });
  }

  showDetailsForTaxonomy(node: TaxonomyResultDTO) {
    this.selectedNodeIdentifier = node.id;
    this.showDetails.emit(node);
  }
}
