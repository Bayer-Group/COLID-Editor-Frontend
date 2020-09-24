import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { FetchWelcomeMessage } from 'src/app/state/welcome-message.state';

@Component({
    selector: 'app-welcome-message',
    templateUrl: './welcome-message.component.html',
    styleUrls: ['./welcome-message.component.css']
})
export class WelcomeMessageComponent implements OnInit {

    constructor(private store: Store) { }

    ngOnInit() { 
        this.store.dispatch(new FetchWelcomeMessage()).subscribe();
    }
}

