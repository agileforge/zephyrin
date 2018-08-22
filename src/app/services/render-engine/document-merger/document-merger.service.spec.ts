/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { DocumentMergerService } from './document-merger.service';

describe('DocumentMergerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DocumentMergerService]
        });
    });

    it('should be created', inject([DocumentMergerService], (service: DocumentMergerService) => {
        expect(service).toBeTruthy();
    }));
});
