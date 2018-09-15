/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { inject, TestBed } from '@angular/core/testing';
import { ElectronService } from '../electron.service';
import { FileService } from '../file/file.service';
import { LogService } from '../log-service';
import { DocxToPdfService } from './docx-to-pdf-service';

describe('DocxToPdfServiceService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DocxToPdfService,
                LogService,
                FileService,
                ElectronService
            ]
        });
    });

    it('should be created', inject([DocxToPdfService], (service: DocxToPdfService) => {
        expect(service).toBeTruthy();
    }));
});
