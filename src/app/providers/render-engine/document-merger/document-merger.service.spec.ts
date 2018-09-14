/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TextEncoder } from 'text-encoding';
import { MIMETYPE_DOCX, MIMETYPE_PDF, MIMETYPE_TXT } from '../../../misc/const';
import { DocumentModel } from '../../document/documentModel';
import { ElectronService } from '../../electron.service';
import { LogService } from '../../log-service';
import { RenderEngine } from '../render-engines/render-engine';
import { RenderEnginePdf } from '../render-engines/render-engine-pdf.service';
import { RenderEngineTxt } from '../render-engines/render-engine-txt.service';
import { DocumentMerger } from './document-merger';
import { DocumentMergerTxt } from './document-merger-txt';
import { DocumentMergerWord } from './document-merger-word';
import { DocumentMergerService } from './document-merger.service';

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

    let mergerWordSpy: any;
    let renderEnginePdfSpy: any;

    const defaultTxtRenderedDocument = <DocumentModel>{ mimeType: MIMETYPE_TXT, content: new Uint8Array([1, 2, 3]) };
    const defaultPdfRenderedDocument = <DocumentModel>{ mimeType: MIMETYPE_PDF, content: new Uint8Array([1, 2, 3]) };

    const encoder = new TextEncoder();

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DocumentMergerService, useClass: MockDocumentMergerService },
                DocumentMergerTxt,
                DocumentMergerWord,
                RenderEngineTxt,
                RenderEnginePdf,
                LogService,
                ElectronService
            ]
        });

        target = TestBed.get(DocumentMergerService);
        const mergerTxtStub = TestBed.get(DocumentMergerTxt);
        const mergerWordStub = TestBed.get(DocumentMergerWord);
        const renderEngineTxtStub = TestBed.get(RenderEngineTxt);
        const renderEnginePdfStub = TestBed.get(RenderEnginePdf);

        const defaultTxtMergedDocument = <DocumentModel>{ mimeType: MIMETYPE_TXT, content: new Uint8Array([1, 2, 3]) };
        const defaultWordMergedDocument = <DocumentModel>{ mimeType: MIMETYPE_DOCX, content: new Uint8Array([1, 2, 3]) };
        spyOn(mergerTxtStub, 'merge').and.returnValue(defaultTxtMergedDocument);
        mergerWordSpy = spyOn(mergerWordStub, 'merge').and.returnValue(defaultWordMergedDocument);

        renderEnginePdfSpy = spyOn(renderEnginePdfStub, 'render').and.returnValue(of(defaultPdfRenderedDocument));
        spyOn(renderEngineTxtStub, 'render').and.returnValue(of(defaultTxtRenderedDocument));
    });

    it('should be created', inject([DocumentMergerService], (service: DocumentMergerService) => {
        expect(service).toBeTruthy();
    }));

    it('should return rendered document', async () => {
        // Arrange
        const data = {
            email: 'john.doe@somedomain.com',
            number: 12
        };
        const template = <DocumentModel>{
            mimeType: MIMETYPE_DOCX,
            fileName: 'template.docx',
            content: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
        };

        renderEnginePdfSpy.and.returnValue(of(defaultPdfRenderedDocument));

        // Act
        const renderedDocument = await target.mergeAndRender(data, template, MIMETYPE_PDF).toPromise();

        // Assert
        expect(renderedDocument).toEqual(defaultPdfRenderedDocument);
    });

    describe('merger', () => {
        it('should throw error when mimeType is unknown', async () => {
            // Arrange
            const data = {
                email: 'john.doe@somedomain.com',
                number: 12
            };
            const template = <DocumentModel>{
                mimeType: 'unknownMimeType',
                fileName: 'template.docx',
                content: encoder.encode('Hello {email} num {number}!')
            };

            try {
                // Act
                await target.mergeAndRender(data, template, MIMETYPE_PDF).toPromise();
                fail('Should throw exception.');
            } catch (err) {
                // Assert
                expect(err.message).toContain('unknownMimeType');
                expect(err.message).toContain('No merger found');
            }
        });

        it('should use DocumentMergerTxt when template mimeType is plain/text', async () => {
            // Arrange
            const data = {
                email: 'john.doe@somedomain.com',
                number: 12
            };
            const template = <DocumentModel>{
                mimeType: MIMETYPE_TXT,
                fileName: 'template.docx',
                content: encoder.encode('Hello {email} num {number}!')
            };

            // Act
            await target.mergeAndRender(data, template, MIMETYPE_TXT).toPromise();

            // Assert
            expect(target.merger).toEqual(jasmine.any(DocumentMergerTxt));
        });

        it('should use DocumentMergerWord when template mimeType is docx', async () => {
            // Arrange
            const data = {
                email: 'john.doe@somedomain.com',
                number: 12
            };
            const template = <DocumentModel>{
                mimeType: MIMETYPE_DOCX,
                fileName: 'template.docx',
                content: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
            };

            // Act
            await target.mergeAndRender(data, template, MIMETYPE_PDF).toPromise();

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
                fileName: 'template.docx',
                content: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
            };

            let called = false;
            mergerWordSpy.and.callFake(() => {
                called = true;
            });

            // Act
            await target.mergeAndRender(data, template, MIMETYPE_PDF).toPromise();

            // Assert
            expect(called).toEqual(true);
        });
    });

    describe('renderer', () => {
        it('should throw error when mimeType is unknown', async () => {
            // Arrange
            const data = {
                email: 'john.doe@somedomain.com',
                number: 12
            };
            const template = <DocumentModel>{
                mimeType: MIMETYPE_TXT,
                fileName: 'template.docx',
                content: encoder.encode('Hello {email} num {number}!')
            };

            try {
                // Act
                await target.mergeAndRender(data, template, 'unknownMimeType').toPromise();
                fail('Should throw exception.');
            } catch (err) {
                // Assert
                expect(err.message).toContain('No render engine found');
                expect(err.message).toContain('unknownMimeType');
            }
        });

        it('should use RenderEngineTxt when mimeType is plain/text', async () => {
            // Arrange
            const data = {
                email: 'john.doe@somedomain.com',
                number: 12
            };
            const template = <DocumentModel>{
                mimeType: MIMETYPE_TXT,
                fileName: 'template.docx',
                content: encoder.encode('Hello {email} num {number}!')
            };

            // Act
            await target.mergeAndRender(data, template, MIMETYPE_TXT).toPromise();

            // Assert
            expect(target.render).toEqual(jasmine.any(RenderEngineTxt));
        });

        it('should use RenderEnginePdf when mimeType is application/pdf', async () => {
            // Arrange
            const data = {
                email: 'john.doe@somedomain.com',
                number: 12
            };
            const template = <DocumentModel>{
                mimeType: MIMETYPE_DOCX,
                fileName: 'template.docx',
                content: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
            };

            // Act
            await target.mergeAndRender(data, template, MIMETYPE_PDF).toPromise();

            // Assert
            expect(target.render).toEqual(jasmine.any(RenderEnginePdf));
        });

        it('should call render on render engine', async () => {
            // Arrange
            const data = {
                email: 'john.doe@somedomain.com',
                number: 12
            };
            const template = <DocumentModel>{
                mimeType: MIMETYPE_DOCX,
                fileName: 'template.docx',
                content: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
            };

            let called = false;
            renderEnginePdfSpy.and.callFake(() => {
                called = true;
                return of(defaultPdfRenderedDocument);
            });

            // Act
            await target.mergeAndRender(data, template, MIMETYPE_PDF).toPromise();

            // Assert
            expect(called).toEqual(true);
        });
    });
});
