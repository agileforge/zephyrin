/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';

import { MailerEngineService } from './mailer-engine.service';

describe('MailerEngineService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MailerEngineService]
        });
    });

    it('should be created', inject([MailerEngineService], (service: MailerEngineService) => {
        expect(service).toBeTruthy();
    }));

    it('should send mail for each in list', async () => {
    });

});
