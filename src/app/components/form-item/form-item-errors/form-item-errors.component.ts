import { Component, OnInit, Input } from '@angular/core';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-form-item-errors',
  templateUrl: './form-item-errors.component.html',
  styleUrls: ['./form-item-errors.component.css']
})
export class FormItemErrorsComponent implements OnInit {

  hasPidUri = Constants.Metadata.HasPidUri;

  @Input() name: string;
  @Input() errors: any;

  constructor() { }

  ngOnInit() {}

  get isViolation() {
    return this.errors.result.resultSeverity === Constants.Shacl.Severity.Violation;
  }

  get isWarning() {
    return this.errors.result.resultSeverity === Constants.Shacl.Severity.Warning;
  }

  get isInfo() {
    return this.errors.result.resultSeverity === Constants.Shacl.Severity.Info;
  }
}
