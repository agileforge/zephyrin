import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MailingExecuteComponent } from './mailing-execute.component';

describe('MailingExecuteComponent', () => {
    let component: MailingExecuteComponent;
    let fixture: ComponentFixture<MailingExecuteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MailingExecuteComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
