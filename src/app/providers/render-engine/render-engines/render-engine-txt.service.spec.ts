/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { RenderEngineTxt } from './render-engine-txt.service';
import { DocumentModel } from '../../../complexes/documents/documentModel';
import { MIMETYPE_TXT } from '../../../misc/const';
import { TextEncoder } from 'text-encoding';

describe('RenderEnginePdfService', () => {

    let target: RenderEngineTxt;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderEngineTxt]
        });

        target = TestBed.get(RenderEngineTxt);
    });

    it('should be created', inject([RenderEngineTxt], (service: RenderEngineTxt) => {
        expect(service).toBeTruthy();
    }));

    it('should return document if document is a text document', async () => {
        // Arrange
        const encoder = new TextEncoder();
        const document = <DocumentModel>{ mimeType: MIMETYPE_TXT, content: encoder.encode('Hello world!') };

        // Act
        const renderedDocument = await target.render(document).toPromise();

        // Assert
        expect(renderedDocument).toEqual(document);
    });

});