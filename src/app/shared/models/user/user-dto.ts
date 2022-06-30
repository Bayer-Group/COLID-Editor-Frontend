import { DefaultConsumerGroupDto } from './default-consumer-group-dto';
import { ColidEntrySubscriptionDto } from './colid-entry-subscription-dto';
import { SearchFilterEditor } from './search-filter-editor';
import { MessageConfigDto } from './message-config-dto';

export class UserDto {
  id: string;
  emailAddress: string;
  lastLoginEditor: Date;
  defaultConsumerGroup: DefaultConsumerGroupDto;
  searchFilterEditor: SearchFilterEditor;
  colidEntrySubscriptions: ColidEntrySubscriptionDto[];
  messageConfig: MessageConfigDto;

  public constructor(id: string, emailAddress: string) {
      this.id = id;
      this.emailAddress = emailAddress;
  }
}
