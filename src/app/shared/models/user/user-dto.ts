import { DefaultConsumerGroupDto } from './default-consumer-group-dto';
import { ColidEntrySubscriptionDto } from './colid-entry-subscription-dto';
import { SearchFilterEditor } from './search-filter-editor';

export class UserDto {
  id: string;
  emailAddress: string;
  lastLoginEditor: Date;
  defaultConsumerGroup: DefaultConsumerGroupDto;
  searchFilterEditor: SearchFilterEditor;
  colidEntrySubscriptions: ColidEntrySubscriptionDto[];
  department: string;

  public constructor(id: string, emailAddress: string) {
    this.id = id;
    this.emailAddress = emailAddress;
  }
}
