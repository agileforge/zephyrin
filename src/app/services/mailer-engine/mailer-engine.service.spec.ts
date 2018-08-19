/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';

import { MailerEngineService } from './mailer-engine.service';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { MailingData } from './mailingData';
import { MailingDataSource } from './mailingDataSource';
import { BehaviorSubject } from 'rxjs';

describe('MailerEngineService', () => {
    let target: MailerEngineService;
    let mailSenderServiceStub: MailSenderService;


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MailerEngineService,
                MailSenderService
            ]
        });
        mailSenderServiceStub = TestBed.get(MailSenderService);
        target = TestBed.get(MailerEngineService);
    });

    it('should be created', inject([MailerEngineService], (service: MailerEngineService) => {
        expect(service).toBeTruthy();
    }));

    it('should send mail for each in list', async () => {
        // Arrange
        const data = <MailingData>{
            subject: 'SomeSubject',
            body: '<h1>Some HTML code</h1>',
            template: null,
            datasource: <MailingDataSource>{
                mailAddressField: 'email',
                data: [
                    { email: 'john.doe@somedomain.com' }
                ]
            }
        };

        spyOn(mailSenderServiceStub, 'send').and.returnValue(new BehaviorSubject<boolean>(true));

        // Act
        target.sendMails(data);

        // Assert
        expect(mailSenderServiceStub.send).toHaveBeenCalled();
    });

});
