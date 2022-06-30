import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastMessageComponent } from './broadcast-message.component';

describe('BroadcastMessageComponent', () => {
  let component: BroadcastMessageComponent;
  let fixture: ComponentFixture<BroadcastMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
