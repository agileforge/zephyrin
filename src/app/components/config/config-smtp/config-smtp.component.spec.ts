import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSmtpComponent } from './config-smtp.component';

describe('ConfigSmtpComponent', () => {
  let component: ConfigSmtpComponent;
  let fixture: ComponentFixture<ConfigSmtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigSmtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigSmtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
