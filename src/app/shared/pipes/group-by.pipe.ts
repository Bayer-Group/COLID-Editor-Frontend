import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { Entity } from '../models/Entities/entity';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(collect: Array<any>, args?: any): Array<any> {
    const collection = collect;

    if (collection == null || !collection) {
        return null;
    }

    const groupedCollection = collection.reduce((previous: Entity, current: Entity) => {

      let currentProperty: any;

      currentProperty = current.properties[Constants.Metadata.EntityType][0];



      if (!previous[currentProperty]) {
        previous[currentProperty] = [current];
      } else {
        previous[currentProperty].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }

}
