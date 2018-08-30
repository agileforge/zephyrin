import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MailingMergeComponent } from './mailing-merge.component';

describe('MailingMergeComponent', () => {
    let component: MailingMergeComponent;
    let fixture: ComponentFixture<MailingMergeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MailingMergeComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
