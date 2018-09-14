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
import { of } from 'rxjs';

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
    const configJson = JSON.stringify(config, null, 2);
    const currentDir = '/my/path/to/dir/';

    let target: ConfigService;
    let fileServiceStub: FileService;
    let electronServiceStub: ElectronService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ConfigService,
                FileService,
                ElectronService,
                LogService,
            ]
        });

        electronServiceStub = TestBed.get(ElectronService);
        spyOnProperty(electronServiceStub, 'currentDir', 'get').and.returnValue(currentDir);

        fileServiceStub = TestBed.get(FileService);
        spyOnProperty(fileServiceStub, 'currentDir', 'get').and.returnValue(currentDir);

        target = TestBed.get(ConfigService);
        target.config = config;
    });

    it('should be created', inject([ConfigService], (service: ConfigService) => {
        expect(service).toBeTruthy();
    }));

    describe('save', () => {

        it('should write JSON text to a file', async () => {
            // Arrange
            let fileName: string;
            let text: string;

            spyOn(fileServiceStub, 'writeText').and.callFake((fn, t) => {
                fileName = fn;
                text = t;
            });
            target.config = config;

            // Act
            target.save();

            // Assert
            expect(fileName).toEqual(currentDir + 'config.json');
            expect(text).toEqual(configJson);
        });

    });

    describe('load', () => {

        it('should call readText of FileService', async () => {
            // Arrange
            const spy = spyOn(fileServiceStub, 'readText').and.returnValue(of(configJson));

            // Act
            await target.load().toPromise();

            // Assert
            expect(spy).toHaveBeenCalledWith(currentDir + 'config.json');
        });

        it('should call return loaded config', async () => {
            // Arrange
            const localConfig = <ConfigModel>{ sender: { emailAddress: 'some@email.com' } };
            spyOn(fileServiceStub, 'readText').and.returnValue(of(JSON.stringify(localConfig, null, 2)));

            // Act
            const loadedConfig = await target.load().toPromise();
            console.log(loadedConfig);

            // Assert
            expect(loadedConfig).toEqual(localConfig);
        });

        it('should change config in service', async () => {
            // Arrange
            const localConfig = <ConfigModel>{ sender: { emailAddress: 'some@email.com' } };
            spyOn(fileServiceStub, 'readText').and.returnValue(of(JSON.stringify(localConfig, null, 2)));

            // Act
            await target.load().toPromise();

            // Assert
            expect(target.config).toEqual(localConfig);
        });

    });

});
