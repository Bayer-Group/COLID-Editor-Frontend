import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { WelcomeMessage } from 'src/app/shared/models/welcome-message/welcome-message';
import { QuillConfig } from 'ngx-quill';

@Component({
  selector: 'welcome-message-form',
  templateUrl: './welcome-message-form.component.html',
  styleUrls: ['./welcome-message-form.component.css']
})
export class WelcomeMessageFormComponent implements OnInit {
  error_msg_empty = 'Message is empty'
  error_msg_not_changed = 'Message has not been changed'
  error_msg_reset = 'Message has been reset'

  editForm: FormGroup;

  _defaultMessage: WelcomeMessage;

  @Input() headerMessage: string;

  @Input() set defaultMessage(value: WelcomeMessage) {
    this._defaultMessage = value;
    this.fillFormControl();
  }
  @Output() submitForm: EventEmitter<string> = new EventEmitter<string>();

  // quill config for welcome messages
  editorQuillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link']                                           // link 
    ]
  };

  constructor(private snackBar: ColidMatSnackBarService) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      editControl: new FormControl('', Validators.required)
    });
    this.fillFormControl();
  }

  fillFormControl() {
    if (this.editForm == null) return;

    const editControl = this.editForm.controls['editControl'];

    if (this._defaultMessage != null && editControl != null) {
      editControl.setValue(this._defaultMessage.content);
    }
  }

  onSubmit() {
    if (!this.editForm.valid || this.isEmptyOrSpaces(this.editForm.controls["editControl"].value)) {
      this.snackBar.warning(this.headerMessage, this.error_msg_empty);
    } else if (this.editForm.controls["editControl"].value == this._defaultMessage.content) {
      this.snackBar.warning(this.headerMessage, this.error_msg_not_changed);
    } else {
      let updatedEditorMessage = this.editForm.controls["editControl"].value;
      this.submitForm.emit(updatedEditorMessage);
    }
  }

  onResetWelcomeMessage() {
    if (this.editForm.controls["editControl"].value !== this._defaultMessage.content) {
      this.editForm.controls["editControl"].setValue(this._defaultMessage.content);
      this.snackBar.info(this.headerMessage, this.error_msg_reset);
    }
  }

  private isEmptyOrSpaces(str) {
    return str == null || str.match(/^ *$/) !== null;
  }
}
