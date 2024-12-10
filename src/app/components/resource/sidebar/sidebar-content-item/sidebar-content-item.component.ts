import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { StringExtension } from 'src/app/shared/extensions/string.extension';
import { SearchHit } from 'src/app/shared/models/search/search-hit';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar-content-item',
  templateUrl: './sidebar-content-item.component.html',
  styleUrls: ['./sidebar-content-item.component.scss']
})
export class SidebarContentItemComponent {
  constants = Constants;

  @Input() hit: SearchHit;
  @Input() selectedResourcePidUri = '';
  @Input() currentPageStatus: string;
  @Input() index: number;

  @Output() selectHandler: EventEmitter<string> = new EventEmitter<string>();

  get resourceType(): string {
    if (environment.enableIndexSearch) {
      return this.hit.source[Constants.Metadata.EntityType].outbound[0].uri;
    } else {
      return this.hit.source[Constants.Metadata.EntityType].toString();
    }
  }

  get label(): string {
    let text = '';
    if (environment.enableIndexSearch) {
      text = this.hit.source[Constants.Metadata.HasLabel].outbound[0].value;
    } else {
      text = this.hit.source[Constants.Metadata.HasLabel].toString();
    }

    return StringExtension.ReplaceHtmlToText(text);
  }

  get definition(): string {
    const definition =
      this.hit.source[Constants.Metadata.HasResourceDefinition];

    if (definition == null) {
      return '';
    }

    if (environment.enableIndexSearch) {
      return definition.outbound[0].value;
    } else {
      return definition.toString();
    }
  }

  get strippedDefinition(): string {
    return StringExtension.ReplaceHtmlToText(this.definition);
  }

  get lifeCycleStatus(): string {
    if (environment.enableIndexSearch) {
      return this.hit.source[Constants.Metadata.LifeCycleStatus].outbound[0]
        .uri;
    } else {
      return this.hit.source[Constants.Metadata.LifeCycleStatus].toString();
    }
  }

  get pidUri(): string {
    if (environment.enableIndexSearch) {
      return this.hit.source[Constants.Metadata.HasPidUri].outbound[0].uri;
    } else {
      return this.hit.source[Constants.Metadata.HasPidUri].toString();
    }
  }

  get isActive(): boolean {
    return this.selectedResourcePidUri === this.pidUri;
  }

  get hasDraftVersion(): boolean {
    return this.lifeCycleStatus === Constants.Resource.LifeCycleStatus.Draft;
  }

  get hasMarkedDeletionVersion(): boolean {
    return (
      this.lifeCycleStatus === Constants.Resource.LifeCycleStatus.MarkedDeletion
    );
  }

  get hasPublishedVersion(): boolean {
    return (
      this.lifeCycleStatus === Constants.Resource.LifeCycleStatus.Published ||
      this.hasLinkedPublishedVersion
    );
  }

  get hasLinkedPublishedVersion(): boolean {
    const resourceLinkedLifecycleStatus =
      this.hit.source['resourceLinkedLifecycleStatus'];
    if (resourceLinkedLifecycleStatus == null) {
      return false;
    }

    let lifeCycleStatus = '';
    if (environment.enableIndexSearch) {
      lifeCycleStatus = resourceLinkedLifecycleStatus.outbound[0].uri;
    } else {
      lifeCycleStatus = resourceLinkedLifecycleStatus.toString();
    }

    return (
      lifeCycleStatus === Constants.Resource.LifeCycleStatus.MarkedDeletion ||
      lifeCycleStatus === Constants.Resource.LifeCycleStatus.Published
    );
  }

  getTooltipContent(tooltipContent: string) {
    const dom = new DOMParser().parseFromString(tooltipContent, 'text/html');
    const decodedString = dom.body.textContent;
    return decodedString;
  }

  selectResource() {
    this.selectHandler.emit(this.pidUri);
  }
}
