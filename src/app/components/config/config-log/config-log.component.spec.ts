import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLogComponent } from './config-log.component';

describe('ConfigLogComponent', () => {
  let component: ConfigLogComponent;
  let fixture: ComponentFixture<ConfigLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
