import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { WelcomeMessageApiService } from 'src/app/core/http/welcome.message.api.service';
import { WelcomeMessage } from 'src/app/shared/models/welcome-message/welcome-message';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';

@Component({
  selector: 'app-welcome-message-data-marketplace',
  templateUrl: './welcome-message-data-marketplace.component.html',
  styleUrls: ['./welcome-message-data-marketplace.component.css']
})
export class WelcomeMessageDataMarketplaceComponent implements OnInit {
  welcomeMessageDataMarketplace: WelcomeMessage;

  msg_header_datamarketplace = 'Welcome Message Data Marketplace'
  error_general = 'An error occured during welcome message processing'
  success_msg_update = 'Message has been updated successfully'

  constructor(
    private store: Store,
    private welcomeMessageApiService: WelcomeMessageApiService,
    private snackBar: ColidMatSnackBarService) { }

  ngOnInit() {
    this.welcomeMessageApiService.getWelcomeMessageDataMarketplace().subscribe(
      (res: WelcomeMessage) => {
          this.welcomeMessageDataMarketplace = res;
      },
      error => {
          this.snackBar.error(this.msg_header_datamarketplace, this.error_general);
      }
  )
  }

  
  updateWelcomeMessageDataMarketplace(message: string) {
    this.welcomeMessageApiService.updateWelcomeMessageDataMarketplace(message).subscribe(
        (res: WelcomeMessage) => {
            this.welcomeMessageDataMarketplace = res;
            this.snackBar.success(this.msg_header_datamarketplace, this.success_msg_update);
        },
        error => {
            this.snackBar.error(this.msg_header_datamarketplace, this.error_general);
        }
    )
}

}
