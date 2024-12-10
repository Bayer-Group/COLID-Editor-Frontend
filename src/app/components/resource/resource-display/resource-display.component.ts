import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { MetaDataState } from '../../../state/meta-data.state';
import { ResourceState } from '../../../state/resource.state';
import { Constants } from 'src/app/shared/constants';
import { Resource } from '../../../shared/models/resources/resource';
import { VersionProperty } from 'src/app/shared/models/resources/version-property';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';

@Component({
  selector: 'app-resource-display',
  templateUrl: './resource-display.component.html',
  styleUrls: ['./resource-display.component.scss']
})
export class ResourceDisplayComponent implements OnInit, OnDestroy {
  @Select(ResourceState.activeResource) activeResource$: Observable<Resource>;
  @Select(MetaDataState.metadata) metadata$: Observable<
    Map<string, MetaDataProperty[]>
  >;
  constants = Constants;

  headerGroup = Constants.Metadata.PreferredLabel;
  subHeaderGroup = Constants.Metadata.PreferredLabel;
  invisibleProperties = [Constants.Metadata.HasLabel];

  activeResource: Resource;
  metadata: MetaDataProperty[];
  metadataMap: Map<string, MetaDataProperty[]>;

  activeResourceSubscription: Subscription;
  metadataSubscription: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.activeResourceSubscription = this.activeResource$.subscribe((res) => {
      this.activeResource = res;
      this.tryGetMetadata();
    });
    this.metadataSubscription = this.metadata$.subscribe((res) => {
      this.metadataMap = res;
      this.tryGetMetadata();
    });
  }

  ngOnDestroy() {
    this.unsubscribe(this.activeResourceSubscription);
    this.unsubscribe(this.metadataSubscription);
  }

  private unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

  versionClicked(event: VersionProperty) {
    this.router.navigate(['/resource'], {
      queryParams: { pidUri: event.pidUri }
    });
  }

  tryGetMetadata() {
    if (this.activeResource && this.metadataMap) {
      const release =
        this.activeResource.properties[
          Constants.Metadata.MetadataReleaseConfig
        ][0];
      this.metadata = this.metadataMap.has(release)
        ? this.metadataMap.get(release)
        : [];
    }
  }
}
