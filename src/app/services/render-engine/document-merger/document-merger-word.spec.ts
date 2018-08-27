/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { DocumentMergerTxt } from './document-merger-txt';
import { MIMETYPE_TXT } from '../../../misc/const';
import { DocumentModel } from '../../../complexes/documents/documentModel';
import { DocumentMergerWord } from './document-merger-word';

describe('DocumentMergerWord', () => {

    let target: DocumentMergerTxt;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DocumentMergerWord]
        });

        target = TestBed.get(DocumentMergerWord);
    });

    it('should be created', inject([DocumentMergerTxt], (service: DocumentMergerTxt) => {
        expect(service).toBeTruthy();
    }));

});
