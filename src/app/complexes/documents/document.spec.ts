/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { Document } from '../documents/document';
import { MIMETYPE_TXT } from '../../misc/const';
import { Injector } from '@angular/core';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BehaviorSubject } from 'rxjs';
import { FileService } from '../../providers/file/file.service';
import { ElectronService } from '../../providers/electron.service';

describe('Document', () => {

    let fileServiceStub: FileService;

    beforeEach(() => {
        try {
            TestBed.resetTestEnvironment();
            TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

            TestBed.configureTestingModule({
                providers: [
                    Document,
                    FileService,
                    ElectronService
                ]
            });

            fileServiceStub = TestBed.get(FileService);
            const readBytesValue = new BehaviorSubject(new Uint8Array([1, 2, 3, 4, 5]));
            spyOn(fileServiceStub, 'readBytes').and.returnValue(readBytesValue);
        } catch (err) {
            console.log(err);
        }
    });

    it('should be created', async () => {
        // Act
        const document = Document.fromFile(TestBed, '/some/path/to/a/file.txt');

        // Assert
        expect(document.mimeType).toEqual(MIMETYPE_TXT);
        expect(document.content).toEqual(new Uint8Array([1, 2, 3, 4, 5]));
    });

    it('should throw error if file type unknown', async () => {
        try {
            // Act
            Document.fromFile(TestBed, '/some/path/to/a/file.unknownext');
            fail('No error thrown.');
        } catch (err) {
            // Assert
            expect(err.message).toContain('/some/path/to/a/file.unknownext');
            expect(err.message).toContain('This file is not supported');
        }

    });
});
