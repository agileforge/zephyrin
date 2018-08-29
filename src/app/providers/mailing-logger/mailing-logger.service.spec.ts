/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { MailingLoggerService } from './mailing-logger.service';
import { FileService } from '../file/file.service';
import { ElectronService } from '../electron.service';
import { LogService } from '../log-service';
import { DateProviderService } from '../date-provider/date-provider.service';
import { ConfigModel, SmtpConfigModel, SenderConfigModel, MailingLogConfigModel } from '../config/configModel';
import { MailingDataModel } from '../mailer-engine/mailingDataModel';
import { MIMETYPE_PDF, MIMETYPE_DOCX } from '../../misc/const';
import { MailingDataSource } from '../mailer-engine/mailingDataSource';
import { DocumentModel } from '../../complexes/documents/documentModel';
import { empty } from 'rxjs';
import { MailModel } from '../mail-sender/mailModel';
import { ConfigService } from '../config/config.service';
import { InvalidEmailAddressError } from '../mailer-engine/invalidEmailAddressError';
import { MergeableRowDataModel } from '../data-loader/mergeableRowDataModel';

describe('MailingLoggerService', () => {

    let target: MailingLoggerService;
    let fileServiceStub: FileService;
    let dateStub: DateProviderService;
    let configStub: ConfigService;

    let now: Date;
    let config: ConfigModel;
    let data: MailingDataModel;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MailingLoggerService,
                FileService,
                ElectronService,
                LogService,
                DateProviderService,
                ConfigService
            ]
        });

        now = new Date(2018, 11, 21, 13, 55, 55);

        target = TestBed.get(MailingLoggerService);
        fileServiceStub = TestBed.get(FileService);
        dateStub = TestBed.get(DateProviderService);
        configStub = TestBed.get(ConfigService);

        configStub.config = config;
        spyOn(dateStub, 'now').and.returnValue(now);
        spyOn(fileServiceStub, 'makeDir').and.stub();
        spyOn(fileServiceStub, 'pathJoin').and.callFake((...paths: string[]) => paths.join('/').replace('//', '/'));
        spyOn(fileServiceStub, 'writeText').and.returnValue(empty());
        spyOn(fileServiceStub, 'writeBytes').and.returnValue(empty());
        spyOn(fileServiceStub, 'copyFile').and.returnValue(empty());
        spyOn(fileServiceStub, 'appendText').and.returnValue(empty());

        config = <ConfigModel>{
            smtp: <SmtpConfigModel>{
                host: 'smtp.somedomain.com',
                port: 999,
            },
            sender: <SenderConfigModel>{
                emailAddress: 'sender@sender-domain.com',
                fullName: 'Sender Name'
            },
            mailingLog: <MailingLogConfigModel>{
                directoryPath: '/log/path'
            }
        };

        data = <MailingDataModel>{
            name: 'TestMailing',
            subject: 'SomeSubject',
            body: '<h1>Some HTML code</h1>',
            template: <DocumentModel>{ fileName: 'template.docx', mimeType: MIMETYPE_DOCX, content: new Uint8Array([1, 2, 3]) },
            renderType: MIMETYPE_PDF,
            datasource: <MailingDataSource>{
                mailAddressField: 'email',
                firstNameField: 'firstName',
                lastNameField: 'lastName',
                fileName: '/file/to/datasource.xlsx',
                data: [
                    { email: 'john.doe@somedomain.com', firstName: null, lastName: 'Doe', other: 'OtherData' },
                    { email: 'john.doe1@somedomain.com', firstName: 'John', lastName: 'Doe', other: 'OtherData2' }
                ]
            }
        };
    });

    it('should be created', inject([MailingLoggerService], (service: MailingLoggerService) => {
        expect(service).toBeTruthy();
    }));

    describe('initial', () => {

        it('should create directory for current session with mailing name if provided', async () => {
            // Act
            await target.initial(data).toPromise();

            // Assert
            expect(fileServiceStub.makeDir).toHaveBeenCalledWith(config.mailingLog.directoryPath + '/TestMailing/20181221_135555');
        });

        it('should create directory for current session only with date time if name not provided', async () => {
            // Arrange
            delete data.name;

            // Act
            await target.initial(data).toPromise();

            // Assert
            expect(fileServiceStub.makeDir).toHaveBeenCalledWith(config.mailingLog.directoryPath + '/20181221_135555');
        });

        it('should create directory for current session on __dirname if not provided in config', async () => {
            // Arrange
            delete configStub.config.mailingLog.directoryPath;
            delete data.name;

            // Act
            await target.initial(data).toPromise();

            // Assert
            expect(fileServiceStub.makeDir).toHaveBeenCalledWith(__dirname + 'logs/20181221_135555');
        });

        it('should write config in file config.json', async () => {
            // Arrange
            const fileName = config.mailingLog.directoryPath + '/TestMailing/20181221_135555/config.json';
            const configJson = JSON.stringify(config, null, 2);

            // Act
            await target.initial(data).toPromise();

            // Assert
            expect(fileServiceStub.writeText).toHaveBeenCalledWith(fileName, configJson);
        });

        it('should write data without template in file mailing.json', async () => {
            // Arrange
            const fileName = config.mailingLog.directoryPath + '/TestMailing/20181221_135555/mailing.json';
            const dataSourceData = data.datasource.data;
            const template = data.template;
            delete data.datasource.data;
            delete data.template;
            const dataJson = JSON.stringify(data, null, 2);
            data.datasource.data = dataSourceData;
            data.template = template;

            // Act
            await target.initial(data).toPromise();

            // Assert
            expect(fileServiceStub.writeText).toHaveBeenCalledWith(fileName, dataJson);
        });

        it('should write template in its own file', async () => {
            // Arrange
            const fileName = config.mailingLog.directoryPath + '/TestMailing/20181221_135555/' + data.template.fileName;

            // Act
            await target.initial(data).toPromise();

            // Assert
            expect(fileServiceStub.writeBytes).toHaveBeenCalledWith(fileName, data.template.content);
        });

        it('should copy data source file to log directory', async () => {
            // Arrange
            const dest = config.mailingLog.directoryPath + '/TestMailing/20181221_135555/datasource.xlsx';
            spyOn(fileServiceStub, 'pathExtractFileName').and.returnValue('datasource.xlsx');

            // Act
            await target.initial(data).toPromise();

            // Assert
            expect(fileServiceStub.copyFile).toHaveBeenCalledWith(data.datasource.fileName, dest);
        });

    });

    describe('success', () => {

        it('should append line to success.log with email and row number', async () => {
            // Arrange
            const fileName = '/success.log';

            const mail = <MailModel>{
                from: 'Sender Name <sender@sender-domain.com>',
                to: ['John Doe <john.doe@somedomain.com>'],
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                attachments: []
            };

            // Act
            await target.success(mail, 12).toPromise();

            // Assert
            expect(fileServiceStub.appendText)
                .toHaveBeenCalledWith(fileName, '2018-12-21 13:55:55 - From row 12 sent to "John Doe <john.doe@somedomain.com>"\n');
        });

    });

    describe('sendFail', () => {

        it('should append line to error.log with email and row number', async () => {
            // Arrange
            const fileName = '/error.log';

            const mail = <MailModel>{
                from: 'Sender Name <sender@sender-domain.com>',
                to: ['John Doe <john.doe@somedomain.com>'],
                subject: 'SomeSubject',
                body: '<h1>Some HTML code</h1>',
                attachments: []
            };

            const error = new Error('SomeError');

            // Act
            await target.sendFail(mail, error, 12).toPromise();

            // Assert
            expect(fileServiceStub.appendText)
                .toHaveBeenCalledWith(
                    fileName,
                    '2018-12-21 13:55:55 - From row 12 fail to send email to "John Doe <john.doe@somedomain.com>": "SomeError"\n');
        });

    });

    describe('emailAddressError', () => {

        it('should append line to bad-address.log with email and row number', async () => {
            // Arrange
            const fileName = '/bad-address.log';

            const row = <MergeableRowDataModel> {
                a: 'a',
                b: 5
            };

            const error = new InvalidEmailAddressError('john..doe@somedomain.com', 'email', row, 12);

            // Act
            await target.emailAddressError(error).toPromise();

            // Assert
            expect(fileServiceStub.appendText)
                .toHaveBeenCalledWith(
                    fileName,
                    `2018-12-21 13:55:55 - ${error.message} It has been taken from field "email" in data source.\n`);
        });

    });

});
