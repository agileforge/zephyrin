import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingMergeComponent } from './mailing-merge.component';

describe('MailingMergeComponent', () => {
  let component: MailingMergeComponent;
  let fixture: ComponentFixture<MailingMergeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailingMergeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
