import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { switchMap, take } from "rxjs/operators";
import { Store, Select } from "@ngxs/store";
import {
  ResourceFormState,
  SetResourceFormTouched,
} from "../../../state/resource-form.state";

export interface DirtyComponent {
  isDirty$: Observable<boolean>;
}

@Injectable({ providedIn: "root" })
export class CanDeactivateGuard implements CanDeactivate<any> {
  @Select(ResourceFormState.getResourceFormTouched)
  touched$: Observable<boolean>;

  constructor(private store: Store) {}

  canDeactivate() {
    return this.touched$.pipe(
      switchMap((dirty) => {
        if (dirty) {
          if (
            confirm(
              "You have unsaved changes! If you leave, your changes will be lost."
            )
          ) {
            this.store.dispatch(new SetResourceFormTouched(false));
            return of(true);
          }
          return of(false);
        }

        return of(true);
      }),
      take(1)
    );
  }
}
