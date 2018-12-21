/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TextDecoder } from 'text-encoding';
import { MIMETYPE_DOCX, MIMETYPE_TXT } from '../../../misc/const';
import { DocumentModel } from '../../document/documentModel';
import { FileService } from '../../file/file.service';
import { LogService } from '../../log-service';
import { DocxToPdfService } from '../../toPdf/docx-to-pdf-service';
import { RenderEngine } from './render-engine';

/**
 * Provide an engine that is able to render a document to a PDF document.
 * @export
 * @class RenderEngineTxt
 * @extends {RenderEngine}
 */
@Injectable({
    providedIn: 'root'
})
export class RenderEnginePdf extends RenderEngine {

    private _decoder = new TextDecoder();

    /**
     *Creates an instance of RenderEnginePdf.
     * @memberof RenderEnginePdf
     */
    constructor(
        private _logger: LogService,
        private _fileService: FileService,
        private _docxToPdfService: DocxToPdfService
    ) {
        super();
    }

    /**
     * Render the document to a PDF document if possible.
     * @param {DocumentModel} document Document to render.
     * @returns {DocumentModel} The rendered PDF document.
     * @memberof RenderEngine
     */
    render(document: DocumentModel): Observable<DocumentModel> {
        switch (document.mimeType) {
            case MIMETYPE_TXT:
                return this.renderFromTxt(document);
            case MIMETYPE_DOCX:
                return this.renderFromDocx(document);
            default:
                throw new Error(`Render engine for document type '${document.mimeType}' is not implemented.`);
        }
    }

    /**
     * Render simple text to a simple PDF.
     * Remarks, for the moment, this renderer is only for tests.
     * @private
     * @param {DocumentModel} document
     * @returns {DocumentModel}
     * @memberof RenderEnginePdf
     */
    private renderFromTxt(document: DocumentModel): Observable<DocumentModel> {
        // const renderedDocument = <DocumentModel>{ mimeType: MIMETYPE_PDF };

        // const text = this._decoder.decode(document.content);
        // const stream = new MemoryStream();

        // const data = new Uint8Array();
        // stream.on('data', chunk => {
        //     console.log(chunk);
        // });

        // stream.on('finish', () => {
        //     renderedDocument.content = data;
        // });

        // // Builds the PDF
        // const pdf = new PDFDocument();
        // pdf.pipe(stream);

        // pdf
        //     .addPage()
        //     .fontSize(25)
        //     .text(text, 100, 100);

        // pdf.end();

        // // Close stream
        // stream.end();

        // return renderedDocument;
        return new BehaviorSubject<DocumentModel>(null);
    }

    /**
     * Render from a word document (docx) to a PDF document.
     * @private
     * @param {DocumentModel} document
     * @returns {DocumentModel}
     * @memberof RenderEnginePdf
     */
    private renderFromDocx(document: DocumentModel): Observable<DocumentModel> {
        return this._docxToPdfService.convert(document.content);
    }

}
