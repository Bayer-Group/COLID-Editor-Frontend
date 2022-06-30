import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-colid-spinner',
  templateUrl: './colid-spinner.component.html',
  styleUrls: ['./colid-spinner.component.css']
})
export class ColidSpinnerComponent implements OnInit {
  @Input() diameter: number = 100;
  @Input() strokeWidth: number = 5;

  matDiameter: number;
  matStrokeWidth: number;

  constructor() { 
  }

  ngOnInit() {
    this.matDiameter = this.diameter;
    this.matStrokeWidth = this.strokeWidth;
  }
}
