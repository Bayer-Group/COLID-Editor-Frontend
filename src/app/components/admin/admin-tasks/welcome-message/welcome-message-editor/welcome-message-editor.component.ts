import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { WelcomeMessage } from 'src/app/shared/models/welcome-message/welcome-message';
import { WelcomeMessageApiService } from 'src/app/core/http/welcome.message.api.service';
import { Store, Select } from '@ngxs/store';
import { WelcomeMessageState, FetchWelcomeMessage, UpdateWelcomeMessage } from 'src/app/state/welcome-message.state';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome-message-editor',
  templateUrl: './welcome-message-editor.component.html',
  styleUrls: ['./welcome-message-editor.component.css']
})
export class WelcomeMessageEditorComponent implements OnInit, OnDestroy {
  @Select(WelcomeMessageState.getWelcomeMessage) welcomeMessageEditor$: Observable<WelcomeMessage>;

  welcomeMessageEditorSubscription: Subscription;
  welcomeMessageEditorDefault: WelcomeMessage;

  msg_header_editor = 'Welcome Message Editor'
  error_general = 'An error occured during welcome message processing'
  success_msg_update = 'Message has been updated successfully'

  constructor(
    private store: Store,
    private welcomeMessageApiService: WelcomeMessageApiService,
    private snackBar: ColidMatSnackBarService
  ) { }

  ngOnInit() {
    this.welcomeMessageEditorSubscription = this.welcomeMessageEditor$.subscribe(res => {
      if (res != null) {
        this.welcomeMessageEditorDefault = res;
      }
    });
  }

  ngOnDestroy() {
    this.welcomeMessageEditorSubscription.unsubscribe();
  }

  // Editor
  updateWelcomeMessageEditor(message: string) {
    this.store.dispatch(new UpdateWelcomeMessage(message)).subscribe(
      (res: WelcomeMessage) => {
        this.snackBar.success(this.msg_header_editor, this.success_msg_update);
      },
      error => {
        this.snackBar.error(this.msg_header_editor, this.error_general);
      }
    )
  }
}
