import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingExecuteComponent } from './mailing-execute.component';

describe('MailingExecuteComponent', () => {
  let component: MailingExecuteComponent;
  let fixture: ComponentFixture<MailingExecuteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailingExecuteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingExecuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
