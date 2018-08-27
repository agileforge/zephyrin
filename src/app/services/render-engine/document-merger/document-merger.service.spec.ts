/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { DocumentMergerService } from './document-merger.service';
import { DocumentMerger } from './document-merger';
import { RenderEngine } from '../render-engines/render-engine';
import { MIMETYPE_TXT, MIMETYPE_DOCX, MIMETYPE_PDF } from '../../../misc/const';
import { DocumentModel } from '../../../complexes/documents/documentModel';
import { DocumentMergerTxt } from './document-merger-txt';
import { DocumentMergerWord } from './document-merger-word';

export class MockDocumentMergerService extends DocumentMergerService {

    merger: DocumentMerger;
    render: RenderEngine;

    protected getDocumentMerger(mimeType: string): DocumentMerger {
        this.merger = super.getDocumentMerger(mimeType);
        return this.merger;
    }

    protected getRenderEngine(mimeType: string): RenderEngine {
        this.render = super.getRenderEngine(mimeType);
        return this.render;
    }

}

describe('DocumentMergerService', () => {

    let target: MockDocumentMergerService;

    let mergerTxtSpy: any;
    let mergerWordSpy: any;

    const encoder = new TextEncoder();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DocumentMergerService, useClass: MockDocumentMergerService },
                DocumentMergerTxt,
                DocumentMergerWord,
            ]
        });

        target = TestBed.get(DocumentMergerService);
        const mergerTxtStub = TestBed.get(DocumentMergerTxt);
        const mergerWordStub = TestBed.get(DocumentMergerWord);

        const defaultTxtMergedDocument = <DocumentModel>{ mimeType: MIMETYPE_TXT, content: new Uint8Array([1, 2, 3]) };
        const defaultWordMergedDocument = <DocumentModel>{ mimeType: MIMETYPE_DOCX, content: new Uint8Array([1, 2, 3]) };
        mergerTxtSpy = spyOn(mergerTxtStub, 'merge').and.returnValue(defaultTxtMergedDocument);
        mergerWordSpy = spyOn(mergerWordStub, 'merge').and.returnValue(defaultWordMergedDocument);

    });

    it('should be created', inject([DocumentMergerService], (service: DocumentMergerService) => {
        expect(service).toBeTruthy();
    }));

    it('should use DocumentMergerTxt when mimeType is plain/text', async () => {
        // Arrange
        const data = {
            email: 'john.doe@somedomain.com',
            number: 12
        };
        const template = <DocumentModel>{
            mimeType: 'unknownMimeType',
            content: encoder.encode('Hello {email} num {number}!')
        };

        try {
            // Act
            target.mergeAndRender(data, template, MIMETYPE_PDF);
            fail('Should throw exception.');
        } catch (err) {
            // Assert
            expect(err.message).toContain('unknownMimeType');
            expect(err.message).toContain('No merger found');
        }
    });

    it('should use DocumentMergerTxt when mimeType is plain/text', async () => {
        // Arrange
        const data = {
            email: 'john.doe@somedomain.com',
            number: 12
        };
        const template = <DocumentModel>{
            mimeType: MIMETYPE_TXT,
            content: encoder.encode('Hello {email} num {number}!')
        };

        // Act
        target.mergeAndRender(data, template, MIMETYPE_TXT);

        // Assert
        expect(target.merger).toEqual(jasmine.any(DocumentMergerTxt));
    });

    it('should use DocumentMergerTxt when mimeType is plain/text', async () => {
        // Arrange
        const data = {
            email: 'john.doe@somedomain.com',
            number: 12
        };
        const template = <DocumentModel>{
            mimeType: MIMETYPE_DOCX,
            content: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
        };

        // Act
        target.mergeAndRender(data, template, MIMETYPE_PDF);

        // Assert
        expect(target.merger).toEqual(jasmine.any(DocumentMergerWord));
    });

    it('should call merge on merger', async () => {
        // Arrange
        const data = {
            email: 'john.doe@somedomain.com',
            number: 12
        };
        const template = <DocumentModel>{
            mimeType: MIMETYPE_DOCX,
            content: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
        };

        let called = false;
        mergerWordSpy.and.callFake(() => {
            called = true;
        });

        // Act
        target.mergeAndRender(data, template, MIMETYPE_PDF);

        // Assert
        expect(called).toEqual(true);
    });

});
