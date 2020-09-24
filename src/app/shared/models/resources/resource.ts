import {Entity} from '../Entities/entity';
import { VersionProperty } from './version-property';

export class Resource extends Entity {
  pidUri: string;
  baseUri: string;
  previousVersion: VersionProperty;
  laterVersion: VersionProperty;
  publishedVersion: string;
  versions: VersionProperty[];
  isMarkedDeleted: boolean;

  constructor() {
    super();
  }
}
