import { HostListener, Directive } from '@angular/core';
import { Store } from '@ngxs/store';

@Directive()
export abstract class ComponentCanDeactivate {
  protected constructor(private _store: Store) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    const touched = this._store.selectSnapshot<boolean>(
      (state) => state.ResourceForm.touched
    );
    $event.returnValue = !touched;
  }
}
