import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClearConsumerGroup } from 'src/app/state/consumer-group.state';

@Component({
  selector: 'app-consumer-group-edit',
  templateUrl: './consumer-group-edit.component.html',
  styleUrls: ['./consumer-group-edit.component.css']
})
export class ConsumerGroupEditComponent implements OnInit, OnDestroy {

  isNew = false;
  constructor(private store: Store) { }

  ngOnInit() {}

  ngOnDestroy() {
    this.store.dispatch(new ClearConsumerGroup).subscribe();
  }

}
