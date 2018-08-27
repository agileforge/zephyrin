/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { DocumentMergerTxt } from './document-merger-txt';
import { MIMETYPE_TXT } from '../../../misc/const';
import { DocumentModel } from '../../../complexes/documents/documentModel';

describe('DocumentMergerTxt', () => {

    let target: DocumentMergerTxt;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DocumentMergerTxt]
        });

        target = TestBed.get(DocumentMergerTxt);
    });

    it('should be created', inject([DocumentMergerTxt], (service: DocumentMergerTxt) => {
        expect(service).toBeTruthy();
    }));

    it('should replace matching placeholders', async () => {
        // Arrange
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const text = 'a{b}c{d}{eF}';
        const data = {
            some: 'No matching data',
            b: 'b',
            // d: 'd', => This field is not present...
            Ef: 'ef'
        };

        const template = <DocumentModel>{ mimeType: MIMETYPE_TXT, content: encoder.encode(text) };

        // Act
        const mergedDocument = target.merge(data, template);

        // Assert
        const finalText = decoder.decode(mergedDocument.content);
        const expectedText  = 'abc{d}ef';
        expect(mergedDocument.mimeType).toEqual(MIMETYPE_TXT);
        expect(finalText).toEqual(expectedText);
    });
});
