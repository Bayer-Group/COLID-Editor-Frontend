import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {

  @Input() type: 'mat-raised-button' | 'mat-icon-button' = 'mat-raised-button'
  @Input() fontSet: 'material-icons-outlined' | 'material-icons' = "material-icons-outlined";
  @Input() color: string = "primary";
  @Input() disabled: boolean = false;
  @Input() icon: string;
  @Input() loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
}
