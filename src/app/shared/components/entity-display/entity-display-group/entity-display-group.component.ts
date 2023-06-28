import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { Entity } from "src/app/shared/models/Entities/entity";
import { Constants } from "src/app/shared/constants";
import { VersionProperty } from "src/app/shared/models/resources/version-property";
import { MetadataExtension } from "src/app/shared/extensions/metadata.extension";
import { MetaDataPropertyGroup } from "src/app/shared/models/metadata/meta-data-property-group";

@Component({
  selector: "app-entity-display-group",
  templateUrl: "./entity-display-group.component.html",
  styleUrls: ["./entity-display-group.component.scss"],
})
export class EntityDisplayGroupComponent implements OnInit {
  @Input() group: string;
  @Input() groupedMetadata: Array<MetaDataProperty>;
  @Input() entity: Entity;
  @Input() entityVersions: Array<any>;
  @Input() headerGroup: string;
  @Input() subHeaderGroup: string;
  @Input() invisbleProperties: Array<string>;
  @Output() versionClick = new EventEmitter<VersionProperty>();

  constants = Constants;

  constructor() {}

  ngOnInit() {
    if (this.invisbleProperties) {
      this.groupedMetadata = this.groupedMetadata.filter(
        (g) => !this.invisbleProperties.includes(g.key)
      );
    }
    this.addInboundLinkTypes();
  }

  addInboundLinkTypes() {
    if (
      this.group == Constants.Resource.Groups.LinkTypes &&
      this.groupedMetadata.length != 0
    ) {
      let linkMetadata = this.groupedMetadata.map((x) => x.key);
      let allResourceLinks = Object.keys(this.entity["links"]);
      let inboundLinkMetadata = allResourceLinks.filter(
        (x) => !linkMetadata.some((y) => y == x)
      );

      inboundLinkMetadata.forEach((x) => {
        let metadataproperty = new MetaDataProperty();
        metadataproperty.key = x;
        let propertylist = new Map<string, any>();
        propertylist[Constants.Metadata.Group.toString()] =
          new MetaDataPropertyGroup(
            Constants.Resource.Groups.LinkTypes.toString(),
            "Linked Resources",
            900,
            "A group for all link types between resources",
            "Grouping all link types"
          );
        propertylist[Constants.Metadata.HasPidUri] = x;
        propertylist[Constants.Metadata.Comment] =
          this.entity["links"][x][0]["inboundLinkComment"];
        propertylist[Constants.Metadata.Name] =
          this.entity["links"][x][0]["inboundLinkLabel"];
        metadataproperty.properties = propertylist;
        metadataproperty.nestedMetadata = [];
        var metadataproperty_object = JSON.parse(
          JSON.stringify(metadataproperty)
        );
        this.groupedMetadata.push(metadataproperty_object);
      });
    }
  }

  label(metadataProperty: MetaDataProperty): string {
    if (this.isLinking) {
      return "Linked Resources";
    }

    return metadataProperty.properties[Constants.Metadata.Name];
  }

  get groupLabel(): string {
    const metadataProperty = this.groupedMetadata[0];
    const group: MetaDataPropertyGroup =
      metadataProperty.properties[Constants.Metadata.Group];

    return group == null ? "" : group.label;
  }

  get isLinking(): boolean {
    return this.group === Constants.Resource.Groups.LinkTypes;
  }

  get isDistribution(): boolean {
    return this.group === Constants.Resource.Groups.DistributionEndpoints;
  }

  get isHeader(): boolean {
    return this.group === this.headerGroup;
  }

  get isSubHeader(): boolean {
    return this.group === this.subHeaderGroup;
  }

  get hasSomeGroupValue(): boolean {
    return this.groupedMetadata.some((g) => this.propertyIsFilled(g.key));
  }
  get hasSomeGroupLinkValue(): boolean {
    return this.groupedMetadata.some((g) => this.linkIsFilled(g.key));
  }
  get hasMoreThanOneGroupValue(): boolean {
    const filledProperties = this.groupedMetadata.filter((g) =>
      this.propertyIsFilled(g.key)
    );

    return (
      filledProperties.reduce((a, b) => {
        return a + this.entity.properties[b.key].length;
      }, 0) > 1
    );
  }
  get hasMoreThanOneLinkValue(): boolean {
    const filledProperties = this.groupedMetadata.filter((g) =>
      this.linkIsFilled(g.key)
    );

    return (
      filledProperties.reduce((a, b) => {
        return a + this.entity["links"][b.key].length;
      }, 0) > 1
    );
  }
  propertyIsFilled(key: string) {
    return (
      this.entity.properties[key] != null &&
      this.entity.properties[key].length !== 0
    );
  }

  linkIsFilled(key: string) {
    return (
      this.entity["links"][key] != null &&
      this.entity["links"][key].length !== 0
    );
  }
  nextGroupItemHasValue(index: number) {
    var nextProperty = this.groupedMetadata[index + 1];

    if (nextProperty == null) {
      return false;
    }

    const nextValues = this.entity.properties[nextProperty.key];
    return nextValues != null && nextValues.length != null;
  }

  showLabel(metaDataProperty: MetaDataProperty, index: number): boolean {
    if (this.isHeader || this.isSubHeader) {
      return false;
    }

    if (MetadataExtension.isIgnoredProperty(metaDataProperty)) {
      return false;
    } else if (this.isLinking && index !== 0) {
      return false;
    }

    return true;
  }

  versionClicked(event: VersionProperty) {
    this.versionClick.emit(event);
  }
}
