import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSenderComponent } from './config-sender.component';

describe('ConfigSenderComponent', () => {
  let component: ConfigSenderComponent;
  let fixture: ComponentFixture<ConfigSenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigSenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
