import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from 'src/app/shared/constants';

@Pipe({
  name: 'taxonomyDetailsFilter'
})
export class TaxonomyDetailsFilterPipe implements PipeTransform {
  transform(properties: Object): any {
    const ignoredTaxonomyKeys = [
      Constants.Metadata.EntityType,
      Constants.Metadata.SkosBroader
    ];

    return Object.keys(properties)
      .filter((key) => ignoredTaxonomyKeys.indexOf(key) === -1)
      .reduce((obj, key) => {
        obj[key] = properties[key];
        return obj;
      }, {});
  }
}
