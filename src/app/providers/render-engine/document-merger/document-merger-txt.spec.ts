/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { inject, TestBed } from '@angular/core/testing';
import { TextDecoder, TextEncoder } from 'text-encoding';
import { MIMETYPE_TXT } from '../../../misc/const';
import { DocumentModel } from '../../document/documentModel';
import { DocumentMergerTxt } from './document-merger-txt';

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
        const text = 'a{b}c{d}{eF}{num}';
        const data = {
            some: 'No matching data',
            b: 'b',
            // d: 'd', => This field is not present...
            Ef: 'ef',
            num: 5
        };

        const template = <DocumentModel>{ mimeType: MIMETYPE_TXT, content: encoder.encode(text) };

        // Act
        const mergedDocument = target.merge(data, template);

        // Assert
        const finalText = decoder.decode(mergedDocument.content);
        const expectedText = 'abc{d}ef5';
        expect(mergedDocument.mimeType).toEqual(MIMETYPE_TXT);
        expect(finalText).toEqual(expectedText);
    });
});
