/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { MailerEngineService } from './mailer-engine.service';
import { ConfigService } from '../config/config.service';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { MailingData } from './mailingData';
import { MailingDataSource } from './mailingDataSource';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { MailModel } from '../mail-sender/mailModel';
import { ConfigModel, SmtpConfigModel, SenderConfigModel, MailingLogConfigModel } from '../config/configModel';
import { MailingLoggerService } from '../mailing-logger/mailing-logger.service';

describe('MailerEngineService', () => {
    let target: MailerEngineService;
    let configServiceStub: ConfigService;
    let mailSenderServiceStub: MailSenderService;
    let mailingLoggerServiceStub: MailingLoggerService;

    let mails: MailModel[];
    let sendSpy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MailerEngineService,
                ConfigService,
                MailSenderService
            ]
        });
        configServiceStub = TestBed.get(ConfigService);
        mailSenderServiceStub = TestBed.get(MailSenderService);
        mailingLoggerServiceStub = TestBed.get(MailingLoggerService);
        target = TestBed.get(MailerEngineService);

        const config = new BehaviorSubject(<ConfigModel>{
            smtp: <SmtpConfigModel>{
                host: 'smtp.somedomain.com',
                port: 999,
            },
            sender: <SenderConfigModel>{
                emailAddress: 'sender@sender-domain.com',
                fullName: 'Sender Name'
            },
            mailingLog: <MailingLogConfigModel>{
                directoryPath: '/my/path/to/dir'
            }
        });

        configServiceStub.config = config;
        spyOn(mailingLoggerServiceStub, 'success').and.callThrough();
        spyOn(mailingLoggerServiceStub, 'fail').and.callThrough();

        mails = [];
        sendSpy = spyOn(mailSenderServiceStub, 'send').and.callFake(mail => {
            mails.push(mail);
            return new BehaviorSubject(true);
        });

    });

    it('should be created', inject([MailerEngineService], (service: MailerEngineService) => {
        expect(service).toBeTruthy();
    }));

    it('should send a mail', async () => {
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

        // Act
        target.sendMails(data);

        // Assert
        expect(mailSenderServiceStub.send).toHaveBeenCalled();
    });

    it('should log on mail successfully sent', async () => {
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

        // Act
        target.sendMails(data);

        // Assert
        expect(mailingLoggerServiceStub.success).toHaveBeenCalledWith(mails[0]);
    });

    it('should log fail when mail sending fail', async () => {
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

        sendSpy.and.callFake(mail => {
            mails.push(mail);
            return throwError(new Error('Test error'));
        });

        // Act
        target.sendMails(data);

        // Assert
        expect(mailingLoggerServiceStub.success).not.toHaveBeenCalled();
        expect(mailingLoggerServiceStub.fail).toHaveBeenCalledWith(mails[0]);
    });

    it('should send a mail to each address in source', async () => {
        // Arrange
        const data = <MailingData>{
            subject: 'SomeSubject',
            body: '<h1>Some HTML code</h1>',
            template: null,
            datasource: <MailingDataSource>{
                mailAddressField: 'email',
                data: [
                    { email: 'john.doe@somedomain.com' },
                    { email: 'john.doe2@somedomain.com' },
                ]
            }
        };

        // Act
        target.sendMails(data);

        // Assert
        expect(mailSenderServiceStub.send).toHaveBeenCalledTimes(2);
    });

    it('should send a mail to valid address only', async () => {
        // Arrange
        const data = <MailingData>{
            subject: 'SomeSubject',
            body: '<h1>Some HTML code</h1>',
            template: null,
            datasource: <MailingDataSource>{
                mailAddressField: 'email',
                data: [
                    { email: 'john.doe@somedomain.com' },
                    { email: 'john.doe2=>somedomain.com' },
                ]
            }
        };


        // Act
        target.sendMails(data);

        // Assert
        expect(mails.length).toEqual(1);
        expect(mails[0].to[0]).toEqual('john.doe@somedomain.com');
    });

    it('should not send a mail to null address', async () => {
        // Arrange
        const data = <MailingData>{
            subject: 'SomeSubject',
            body: '<h1>Some HTML code</h1>',
            template: null,
            datasource: <MailingDataSource>{
                mailAddressField: 'email',
                data: [
                    { email: 'john.doe@somedomain.com' },
                    { email: null },
                ]
            }
        };

        // Act
        target.sendMails(data);

        // Assert
        expect(mails.length).toEqual(1);
        expect(mails[0].to[0]).toEqual('john.doe@somedomain.com');
    });

    it('should not send a mail where email field not defined', async () => {
        // Arrange
        const data = <MailingData>{
            subject: 'SomeSubject',
            body: '<h1>Some HTML code</h1>',
            template: null,
            datasource: <MailingDataSource>{
                mailAddressField: 'email',
                data: [
                    { email: 'john.doe@somedomain.com' },
                    { someOtherValue: 'SomeValue' },
                ]
            }
        };

        // Act
        target.sendMails(data);

        // Assert
        expect(mails.length).toEqual(1);
        expect(mails[0].to[0]).toEqual('john.doe@somedomain.com');
    });

    it('should prepare email data correcly', async () => {
        // Arrange
        const data = <MailingData>{
            subject: 'SomeSubject',
            body: '<h1>Some HTML code</h1>',
            template: null,
            datasource: <MailingDataSource>{
                mailAddressField: 'email',
                lastNameField: 'lastName',
                firstNameField: 'firstName',
                data: [
                    {
                        email: 'john.doe@somedomain.com',
                        lastName: 'Doe',
                        firstName: 'John'
                    },
                    {
                        email: 'elvis.presley@somedomain.com',
                        lastName: 'Elvis Presley'
                    },
                    {
                        email: 'kik.start@somedomain.com'
                    }
                ]
            }
        };

        // Act
        target.sendMails(data);

        // Assert
        expect(mails.length).toEqual(3);
        expect(mails).toEqual([
            <MailModel>{
                from: 'Sender Name <sender@sender-domain.com>',
                to: ['John Doe <john.doe@somedomain.com>'],
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                attachments: []
            },
            <MailModel>{
                from: 'Sender Name <sender@sender-domain.com>',
                to: ['Elvis Presley <elvis.presley@somedomain.com>'],
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                attachments: []
            },
            <MailModel>{
                from: 'Sender Name <sender@sender-domain.com>',
                to: ['kik.start@somedomain.com'],
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                attachments: []
            },
        ]);
    });

    it('should prepare email data and replace place holders in subject and body', async () => {
        // Arrange
        const data = <MailingData>{
            subject: 'My subject is: {subject}',
            body: '<h1>{title}</h1><h2>{subtitle}</h2>',
            template: null,
            datasource: <MailingDataSource>{
                mailAddressField: 'email',
                data: [
                    {
                        email: 'john.doe@somedomain.com',
                        subject: 'some subject',
                        title: 'some title',
                        subtitle: 'some sub title'
                    }
                ]
            }
        };

        // Act
        target.sendMails(data);

        // Assert
        expect(mails.length).toEqual(1);
        expect(mails).toEqual([
            <MailModel>{
                from: 'Sender Name <sender@sender-domain.com>',
                to: ['john.doe@somedomain.com'],
                subject: 'My subject is: some subject',
                body: '<h1>some title</h1><h2>some sub title</h2>',
                attachments: []
            }
        ]);
    });

    it('should not replace place holders that doesn\'t exists', async () => {
        // Arrange
        const data = <MailingData>{
            subject: 'My subject is: {subject}',
            body: '<h1>{title}</h1><h2>{non_existing_field}</h2>',
            template: null,
            datasource: <MailingDataSource>{
                mailAddressField: 'email',
                data: [
                    {
                        email: 'john.doe@somedomain.com',
                        subject: 'some subject',
                        title: 'some title',
                    }
                ]
            }
        };

        // Act
        target.sendMails(data);

        // Assert
        expect(mails.length).toEqual(1);
        expect(mails).toEqual([
            <MailModel>{
                from: 'Sender Name <sender@sender-domain.com>',
                to: ['john.doe@somedomain.com'],
                subject: 'My subject is: some subject',
                body: '<h1>some title</h1><h2>{non_existing_field}</h2>',
                attachments: []
            }
        ]);
    });

    // it('should prepare email data and replace place holders in subject and body', async () => {
    //     // Arrange
    //     const data = <MailingData>{
    //         subject: 'My subject is: {subject}',
    //         body: '<h1>{title}</h1>',
    //         template: // Set a document that have mergeTo => a render that could be PDF...
    //             template.render(data, Renderer.PDF): byte[]; method, and null,
    //         datasource: <MailingDataSource>{
    //             mailAddressField: 'email',
    //             data: [
    //                 {
    //                     email: 'john.doe@somedomain.com',
    //                     subject: 'some subject',
    //                     title: 'some title',
    //                     someData: 'MiscData'
    //                 }
    //             ]
    //         }
    //     };

    //     // Act
    //     target.sendMails(data);

    //     // Assert
    //     expect(mails.length).toEqual(3);
    //     expect(mails).toEqual([
    //         <MailModel>{
    //             to: ['john.doe@somedomain.com'],
    //             subject: 'My subject is: some subject',
    //             body: '<h1>some title</h1>',
    //             attachments: [] // Check not null
    //         }
    //     ]);
    //     // Check renderer called. Maybe do a renderer service.
    // });
});
