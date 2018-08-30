import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingMailComponent } from './mailing-mail.component';

describe('MailingMailComponent', () => {
  let component: MailingMailComponent;
  let fixture: ComponentFixture<MailingMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailingMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
