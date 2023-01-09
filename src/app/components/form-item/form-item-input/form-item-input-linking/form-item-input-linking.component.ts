import { Component, EventEmitter, forwardRef, Input, OnChanges, Output } from '@angular/core';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';
import { MatDialog } from '@angular/material/dialog';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ResourceOverviewDTO } from 'src/app/shared/models/resources/resource-overview-dto';
import { DeleteItemDialogComponent } from 'src/app/shared/components/delete-item-dialog/delete-item-dialog.component';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { ResourceSearchDTO } from 'src/app/shared/models/search/resource-search-dto';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';
import { Store } from '@ngxs/store';
import { RemoveLink } from 'src/app/state/resource.state';
import { LinkingMapping, LinkType } from 'src/app/shared/models/resources/linking-mapping';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { map } from 'rxjs/internal/operators/map';
import { HttpErrorResponse } from '@angular/common/http';
import { ResourceLockedDialogComponent } from 'src/app/components/resource/resource-dialogs/resource-locked-dialog/resource-locked-dialog.component';

 @Component({
  selector: 'app-form-item-input-linking',
  templateUrl: './form-item-input-linking.component.html',
  styleUrls: ['./form-item-input-linking.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputLinkingComponent),
      multi: true
    }
  ]
})
export class FormItemInputLinkingComponent implements OnChanges  {

  @Input() metaData: MetaDataProperty;
  @Input() label: string;
  @Input() value: LinkingMapping[];
  
  displayForm = true;
  fetching = false;

  _linkedEntities: ResourceOverviewDTO[];

  ngOnInit() {
    this.createResourceOverviewDTOs(this.value);
  }
  constructor(public dialog: MatDialog, private resourceApiService: ResourceApiService,private store: Store,private authService : AuthService) {
    
  }

  ngOnChanges() {
    //Write your code here
     this.ngOnInit();
  }   
  
  get publicValue() {
    return Array.isArray(this.value) ? this.value : [this.value];
  }

  /*writeValue(value: string | string[]): void {
    if (value != null) {
      this.internalValue = Array.isArray(value) ? value : [value];
      this.createResourceOverviewDTOs(value);
    }
  }*/

  confirmAndRemoveLinking(linkEntity, index) {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: 'Deleting linking',
        body: `Attention! This link will be deleted immediately. Are you sure you want to delete this linking: <br><br> <strong>PID URI:</strong> ${linkEntity.pidUri}`
      },
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => { 
      if (result) {
        var isInbound = linkEntity.linkType == 0
        this.authService.currentEmail$.pipe(map(currentEmail$ =>
        this.store.dispatch(new RemoveLink(this.metaData.key , linkEntity.pidUri, isInbound,currentEmail$))
        )).subscribe(() => {
        }, error => {
          this.handleHttpErrorResponse(error);
        });
      }
    });
  }
  handleHttpErrorResponse(error: HttpErrorResponse) {
     
    if (error.status === 423) {
      this.handleItemLocked(error);
    }
  }
  handleItemLocked(error: HttpErrorResponse) {
    const dialogRef = this.dialog.open(ResourceLockedDialogComponent, {
      width: 'auto', disableClose: true
    });
  }
  linkEntityExist(pidUri:string){
    let linkElement  = this._linkedEntities.find(x=>x.pidUri == pidUri)
    return linkElement != null || linkElement!=undefined
  }
  getLinkedEntityLabel(pidUri:string){
    let linkElement  = this._linkedEntities.find(x=>x.pidUri == pidUri)
    return linkElement.name
  }
  getLinkedEntityResourceType(pidUri:string){
    let linkElement  = this._linkedEntities.find(x=>x.pidUri == pidUri)
    return linkElement.resourceType
  }
  getLinkedEntityDefinition(pidUri:string){
    let linkElement  = this._linkedEntities.find(x=>x.pidUri == pidUri)
    return linkElement.definition
  }
  getLinktype(link){
    var linktype  = LinkType[link.linkType];  
     
    return linktype;
  }

  createResourceOverviewDTOs(links: LinkingMapping[]): ResourceOverviewDTO[] {
    if (links == null) {
      return [];
    }
    var pidUris =  links.map(x=> x.pidUri) 
    pidUris = Array.isArray(pidUris) ? pidUris : [pidUris];


    const resourceSearch = new ResourceSearchDTO();
    resourceSearch.pidUris = pidUris;
    resourceSearch.limit = pidUris.length;
    resourceSearch.published = true;
 
    this.fetching = true; 
    this.resourceApiService.getFilteredResources(resourceSearch).subscribe(
      res => {
        this._linkedEntities = res.items;
        this.fetching = false;
      },
      error => {
        this._linkedEntities = pidUris.map(pidUri => {
          const resourceOverviewDTO = new ResourceOverviewDTO();
          resourceOverviewDTO.pidUri = pidUri;
          return resourceOverviewDTO;
        });
        this.fetching = false;
      });
  }
}
