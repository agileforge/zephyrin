/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MailingExecuteProgressComponent } from './mailing-execute-progress.component';


describe('MailingExecuteProgressComponent', () => {
    let component: MailingExecuteProgressComponent;
    let fixture: ComponentFixture<MailingExecuteProgressComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MailingExecuteProgressComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MailingExecuteProgressComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
