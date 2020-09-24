import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR} from '@angular/forms';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';

@Component({
  selector: 'app-form-item-input-html',
  templateUrl: './form-item-input-html.component.html',
  styleUrls: ['./form-item-input-html.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputHtmlComponent),
      multi: true
    }
  ]
})
export class FormItemInputHtmlComponent extends FormItemInputBaseComponent {

  constructor() {
    super();
   }
}
