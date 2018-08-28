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
import { of, throwError, BehaviorSubject, empty } from 'rxjs';
import { MailModel } from '../mail-sender/mailModel';
import { ConfigModel, SmtpConfigModel, SenderConfigModel, MailingLogConfigModel } from '../config/configModel';
import { MailingLoggerService } from '../mailing-logger/mailing-logger.service';
import { InvalidEmailAddressError } from './invalidEmailAddressError';
import { MIMETYPE_PDF, MIMETYPE_TXT } from '../../misc/const';
import { DocumentMergerService } from '../render-engine/document-merger/document-merger.service';
import { DocumentModel } from '../../complexes/documents/documentModel';
import { TextEncoder } from 'text-encoding';
import { FileService } from '../file/file.service';
import { LogService } from '../log-service';
import { ElectronService } from '../electron.service';

describe('MailerEngineService', () => {
    let target: MailerEngineService;
    let configServiceStub: ConfigService;
    let mailSenderServiceStub: MailSenderService;
    let mailingLoggerServiceStub: MailingLoggerService;
    let documentMergerServiceStub: DocumentMergerService;

    let mails: MailModel[];
    let sendSpy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MailerEngineService,
                ConfigService,
                MailSenderService,
                FileService,
                LogService,
                ElectronService,
            ]
        });
        configServiceStub = TestBed.get(ConfigService);
        mailSenderServiceStub = TestBed.get(MailSenderService);
        mailingLoggerServiceStub = TestBed.get(MailingLoggerService);
        documentMergerServiceStub = TestBed.get(DocumentMergerService);
        target = TestBed.get(MailerEngineService);

        const config = <ConfigModel>{
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
        };

        configServiceStub.config = new BehaviorSubject(config);

        mails = [];
        sendSpy = spyOn(mailSenderServiceStub, 'send').and.callFake(mail => {
            mails.push(mail);
            return of(null);
        });

    });

    it('should be created', inject([MailerEngineService], (service: MailerEngineService) => {
        expect(service).toBeTruthy();
    }));

    describe('logging', () => {

        it('should log on mail successfully sent', async () => {
            // Arrange
            const data = <MailingData>{
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                template: null,
                renderType: MIMETYPE_PDF,
                datasource: <MailingDataSource>{
                    mailAddressField: 'email',
                    data: [
                        { email: 'john.doe@somedomain.com' }
                    ]
                }
            };

            spyOn(mailingLoggerServiceStub, 'success').and.callThrough();

            // Act
            await target.sendMails(data).toPromise();

            // Assert
            expect(mailingLoggerServiceStub.success).toHaveBeenCalledWith(mails[0], 1);
        });

        it('should log fail when mail sending fail', async () => {
            // Arrange
            const data = <MailingData>{
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                template: null,
                renderType: MIMETYPE_PDF,
                datasource: <MailingDataSource>{
                    mailAddressField: 'email',
                    data: [
                        { email: 'john.doe@somedomain.com' }
                    ]
                }
            };

            const error = new Error('Error Test');
            sendSpy.and.callFake(mail => {
                mails.push(mail);
                return throwError(error);
            });

            spyOn(mailingLoggerServiceStub, 'sendFail').and.callThrough();

            // Act
            await target.sendMails(data).toPromise();

            // Assert
            expect(mailingLoggerServiceStub.sendFail).toHaveBeenCalledWith(mails[0], error, 1);
        });

        it('should log fail row doesn\'t contains email os email is not valid', async () => {
            // Arrange
            const data = <MailingData>{
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                template: null,
                renderType: MIMETYPE_PDF,
                datasource: <MailingDataSource>{
                    mailAddressField: 'email',
                    lastNameField: 'fullName',
                    data: [
                        { noemail: 'SomeData' },
                        { email: null },
                        { email: 'john..doe@somedomain.com', fullName: 'John Doe' }
                    ]
                }
            };

            sendSpy.and.callFake(mail => {
                mails.push(mail);
                return throwError(new Error('Test error'));
            });

            const errors: InvalidEmailAddressError[] = [];
            spyOn(mailingLoggerServiceStub, 'emailAddressError').and.callFake(error => {
                errors.push(error);
            });

            // Act
            await target.sendMails(data).toPromise();

            // Assert
            expect(mailingLoggerServiceStub.emailAddressError).toHaveBeenCalledTimes(3);

            expect(errors[0].emailAddress).toBeUndefined();
            expect(errors[0].emailField).toEqual('email');
            expect(errors[0].row).toEqual(data.datasource.data[0]);
            expect(errors[0].rowNum).toEqual(1);

            expect(errors[1].emailAddress).toBeNull();
            expect(errors[1].emailField).toEqual('email');
            expect(errors[1].row).toEqual(data.datasource.data[1]);
            expect(errors[1].rowNum).toEqual(2);

            expect(errors[2].emailAddress).toEqual('john..doe@somedomain.com');
            expect(errors[2].emailField).toEqual('email');
            expect(errors[2].row).toEqual(data.datasource.data[2]);
            expect(errors[2].rowNum).toEqual(3);
        });
    });

    describe('sending', () => {
        it('should send a mail', async () => {
            // Arrange
            const data = <MailingData>{
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                template: null,
                renderType: MIMETYPE_PDF,
                datasource: <MailingDataSource>{
                    mailAddressField: 'email',
                    data: [
                        { email: 'john.doe@somedomain.com' }
                    ]
                }
            };

            // Act
            await target.sendMails(data).toPromise();

            // Assert
            expect(mailSenderServiceStub.send).toHaveBeenCalled();
        });

        it('should send a mail to each address in source', async () => {
            // Arrange
            const data = <MailingData>{
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                template: null,
                renderType: MIMETYPE_PDF,
                datasource: <MailingDataSource>{
                    mailAddressField: 'email',
                    data: [
                        { email: 'john.doe@somedomain.com' },
                        { email: 'john.doe2@somedomain.com' },
                    ]
                }
            };

            // Act
            await target.sendMails(data).toPromise();

            // Assert
            expect(mailSenderServiceStub.send).toHaveBeenCalledTimes(2);
        });

        it('should send a mail to valid address only', async () => {
            // Arrange
            const data = <MailingData>{
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                template: null,
                renderType: MIMETYPE_PDF,
                datasource: <MailingDataSource>{
                    mailAddressField: 'email',
                    data: [
                        { email: 'john.doe@somedomain.com' },
                        { email: 'john.doe2=>somedomain.com' },
                    ]
                }
            };


            // Act
            await target.sendMails(data).toPromise();

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
                renderType: MIMETYPE_PDF,
                datasource: <MailingDataSource>{
                    mailAddressField: 'email',
                    data: [
                        { email: 'john.doe@somedomain.com' },
                        { email: null },
                    ]
                }
            };

            // Act
            await target.sendMails(data).toPromise();

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
                renderType: MIMETYPE_PDF,
                datasource: <MailingDataSource>{
                    mailAddressField: 'email',
                    data: [
                        { email: 'john.doe@somedomain.com' },
                        { someOtherValue: 'SomeValue' },
                    ]
                }
            };

            // Act
            await target.sendMails(data).toPromise();

            // Assert
            expect(mails.length).toEqual(1);
            expect(mails[0].to[0]).toEqual('john.doe@somedomain.com');
        });
    });

    describe('data preparing', () => {

        it('should prepare email data correctly', async () => {
            // Arrange
            const data = <MailingData>{
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                template: null,
                renderType: MIMETYPE_PDF,
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
            await target.sendMails(data).toPromise();

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
                renderType: MIMETYPE_PDF,
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
            await target.sendMails(data).toPromise();

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
                renderType: MIMETYPE_PDF,
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
            await target.sendMails(data).toPromise();

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

        it('should prepare email data and replace place holders in subject and body', async () => {
            // Arrange
            const encoder = new TextEncoder();
            const fileContent = encoder.encode('Hello {title}');
            const renderedContent = encoder.encode('Hello some title');
            const templateDocument = <DocumentModel>{ mimeType: MIMETYPE_TXT, content: fileContent };
            const renderedDocument = <DocumentModel>{ mimeType: MIMETYPE_TXT, content: renderedContent };

            const data = <MailingData>{
                subject: 'My subject is: {subject}',
                body: '<h1>{title}</h1>',
                template: templateDocument,
                renderType: MIMETYPE_TXT,
                datasource: <MailingDataSource>{
                    mailAddressField: 'email',
                    data: [
                        {
                            email: 'john.doe@somedomain.com',
                            subject: 'some subject',
                            title: 'some title',
                            someData: 'MiscData'
                        }
                    ]
                }
            };

            spyOn(documentMergerServiceStub, 'mergeAndRender').and.returnValues(of(renderedDocument));

            // Act
            await target.sendMails(data).toPromise();

            // Assert
            expect(mails[0].attachments.length).toEqual(1);
            const attachment = mails[0].attachments[0];
            expect(renderedContent).toEqual(attachment);
        });
    });
});
