import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Version, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ResourceApiService } from 'src/app/core/http/resource.api.service';
import { MetaDataState } from 'src/app/state/meta-data.state';
import { Constants } from '../../constants';
import { Entity } from '../../models/Entities/entity';
import { MetaDataProperty } from '../../models/metadata/meta-data-property';
import { HistoryEntity } from '../../models/resources/history-entity';
import { VersionProperty } from '../../models/resources/version-property';

@Component({
  selector: 'app-resource-historic',
  templateUrl: './resource-historic.component.html',
  styleUrls: ['./resource-historic.component.css']
})
export class ResourceHistoricComponent implements OnInit, OnChanges {

  @Input() entities: Array<Entity>;
  @Input() header: string;
  @Input() subHeader: string;
  @Input() historicEntities: Map<string, Entity>;
  @Input() metadata: Map<string, Array<MetaDataProperty>> | Array<MetaDataProperty>
  @Input() isMetadataMapped: boolean = false;
  @Output() selectionChange: EventEmitter<Entity> = new EventEmitter<Entity>()
  @Output() versionClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedEntity: Observable<string>;
  @ViewChild(MatExpansionPanel, {static: true}) matExpansionPanelElement: MatExpansionPanel;
  historyEntity: HistoryEntity[] = null;
  breakpoint: number;
  addtional:any;
  removal:any
  versions:Array<VersionProperty>=[];
  panelOpenState=false
  constructor(private router: Router) { }

  ngOnInit(): void {
    //this.historyEntity = null;
  }

  versionClicked(event: VersionProperty){
    //do nothing
  }

  ngOnChanges(changes: SimpleChanges){
    //check for entity changes
    for(const propName in changes){
      if(propName == "entities"){
        //do the processing
        this.historyEntity=[];
         
        this.entities.forEach(ent => {
          let tmpEntry: HistoryEntity = new HistoryEntity();
          tmpEntry.additions.metadata = this.metadataAdditional(ent);
          tmpEntry.removals.metadata = this.metadataRemoval(ent);
          tmpEntry.additions.entity = this.getProperyAdditional(ent);
          tmpEntry.removals.entity = this.getProperyRemoval(ent);
          tmpEntry.removals.entityVersion = this.getRemovalsVersion(ent);
          tmpEntry.additions.entityVersion = this.getAdditionalsVersion(ent);
          tmpEntry.lastchangedByDateTime= this.getLastChangeDateTime(ent);

          /*if(!this.lastChangedByUser){
            var add=ent["additionals"];
            this.lastChangedByUser=add[Constants.Metadata.HasLastChangeUser][0]
          }*/
         this.historyEntity.push(tmpEntry);
        });
        this.sortHistory(this.historyEntity);
       }
    }
  }

  getPreLastchangeUser(startIndex:number) {
    
    for (let index = startIndex; index >= 0; index--) {

      if(this.entities[index]["additionals"][Constants.Metadata.HasLastChangeUser]){
        this.entities[index]["additionals"][Constants.Metadata.HasLastChangeUser]
        return this.entities[index]["additionals"][Constants.Metadata.HasLastChangeUser]
      }
    }
  }

  metadataAdditional(entity): Array<MetaDataProperty> {

    if (this.isMetadataMapped) {
      const metadata = this.metadata as Map<string, Array<MetaDataProperty>>;
      if(entity.additionals){
        var prop=Object.keys(entity.additionals);
        var meta=metadata.values();
        var metadatalistvalue = meta.next().value;
        var metadatalist = metadatalistvalue.filter(x=>prop.indexOf(x.key)>-1)
        return metadatalist;
      }
      return this.metadata as Array<MetaDataProperty>;
    }
    return this.metadata as Array<MetaDataProperty>;
  }

  metadataRemoval(entity): Array<MetaDataProperty> {

    if (this.isMetadataMapped) {
      const metadata = this.metadata as Map<string, Array<MetaDataProperty>>;
     if(entity.removals && Object.keys(entity.removals).length>0){
        var prop=Object.keys(entity.removals);
        var meta=metadata.values();
        var metadatalistvalue = meta.next().value;
        var metadatalist = metadatalistvalue.filter(x=>prop.indexOf(x.key)>-1)
        return metadatalist;

      }
      return [];
    }
    return this.metadata as Array<MetaDataProperty>;
  }

  getProperyAdditional(entity){
    var tmpEnt = JSON.parse(JSON.stringify(entity))
    tmpEnt.properties=entity.additionals;
    return tmpEnt;
  }

  getProperyRemoval(entity){
    var tmpEnt = JSON.parse(JSON.stringify(entity))
    tmpEnt.properties=entity.removals;
    return tmpEnt;
  }

  getAdditionalsVersion(entity){
    if(entity && Object.keys(entity.additionals).length>0)
    {
      var versionValue=entity.additionals[Constants.Metadata.HasVersion]
      if(versionValue)
      {
        let newVersion: VersionProperty = new VersionProperty();
        newVersion.version = versionValue[0];
        newVersion.id = entity.name;
        const uri = entity.additionals[Constants.Metadata.HasPidUri]
        newVersion.pidUri = uri ? uri[0].id : null;
        newVersion.baseUri = null;
        return [newVersion];
      }
    }
    return []
  }

  getRemovalsVersion(entity){
    if(entity && Object.keys(entity.removals).length>0)
    {
      var versionValue=entity.removals[Constants.Metadata.HasVersion]
      if(versionValue)
      {
        let newVersion: VersionProperty = new VersionProperty();
        newVersion.version = versionValue[0];
        newVersion.id = entity.name;
        const uri = entity.removals[Constants.Metadata.HasPidUri]
        newVersion.pidUri = uri ? uri[0].id : null;
        newVersion.baseUri = null;
        return [newVersion];
      }
    }
    return []
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  handleVersionClick($event) {
    this.versionClick.emit($event);
  }

  getLastChangeDateTime(entity){
    if (entity.additionals[Constants.Metadata.LastChangeDateTime]){
      return entity.additionals[Constants.Metadata.LastChangeDateTime][0]
    }
    else{
      return entity.additionals[Constants.Metadata.LastReviewDateTime][0]
    }
  }
  
  sortHistory(unSortedHistory:HistoryEntity[]){
    var sortedActivities = unSortedHistory.slice().sort(function(a, b) {
      var dateA:any= new Date(a.lastchangedByDateTime)
      var dateB:any = new Date(b.lastchangedByDateTime);
      return dateB-dateA;
  });
  this.historyEntity=sortedActivities;
  }
  openPanel(enitiy:HistoryEntity){
    enitiy.isExpanded=true;
    
  }
  getLastChangeUser(enitiy:HistoryEntity,index):string{
    if(enitiy.additions.entity.additionals[Constants.Metadata.HasLastChangeUser]){
      return enitiy.additions.entity.additionals[Constants.Metadata.HasLastChangeUser]
    }else if(enitiy.additions.entity.additionals[Constants.Metadata.HasLastReviewer]){
      return enitiy.additions.entity.additionals[Constants.Metadata.HasLastReviewer]
    }
    else{
      var i = this.entities.length-1-index
 
      return this.getPreLastchangeUser(i)
    }
  }
  closedPanel(entity:HistoryEntity){
    entity.isExpanded=false;
  }
  
  showLatest(index:number){
    //history entity is take latest revsion in 0 index
    return index==0?true:false;
  }
}


