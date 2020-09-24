import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support-feedback-bar',
  templateUrl: './support-feedback-bar.component.html',
  styleUrls: ['./support-feedback-bar.component.scss']
})
export class SupportFeedbackBarComponent {

  constructor() { }

  sendFeedbackMail() {
    window.open(environment.appSupportFeedBack.mailToLink);
  }

  createSupportTicket() {
    window.open(environment.appSupportFeedBack.supportTicketLink);
  }
}
