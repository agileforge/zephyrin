/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { FileService } from '../file/file.service';
import { ElectronService } from '../electron.service';
import { LogService } from '../log-service';
import { ConfigModel, SmtpConfigModel, SenderConfigModel, MailingLogConfigModel } from './configModel';

describe('ConfigService', () => {

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

    let target: ConfigService;
    let fileServiceStub: FileService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ConfigService,
                FileService,
                ElectronService,
                LogService,
            ]
        });

        target = TestBed.get(ConfigService);
        target.config.next(config);
        fileServiceStub = TestBed.get(FileService);
    });

    it('should be created', inject([ConfigService], (service: ConfigService) => {
        expect(service).toBeTruthy();
    }));

    describe('save', () => {

        it('should write JSON text to a file', async () => {
            // Arrange
            let fileName: string;
            let text: string;

            const spy = spyOn(fileServiceStub, 'writeText').and.callFake((t, fn) => {
                fileName = fn;
                text = t;
            });
            target.config.next(config);

            // Act
            target.save();

            // Assert
            expect(fileName).toEqual(__dirname + 'config.json');
            expect(text).toEqual(JSON.stringify(config, null, 2));
        });

    });

});
