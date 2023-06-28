export class ColidEntrySubscriptionDto {
  colidPidUri: string;
  subscriptions: number;

  public constructor(colidPidUri: string, subscriptions?: number) {
    this.colidPidUri = colidPidUri;
    this.subscriptions = subscriptions;
  }
}
