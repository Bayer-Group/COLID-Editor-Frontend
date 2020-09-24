import { Constants } from 'src/app/shared/constants';;

export class HistoricResourceOverviewDTO {
  id: string;
  pidUri: string;
  lastChangeDateTime: string;
  lastChangeUser: string;
  lifeCycleStatus: string = Constants.Resource.LifeCycleStatus.Historic;
}
