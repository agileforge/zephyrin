/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { RenderEngine } from './render-engine';
import { DocumentModel } from '../../../complexes/documents/documentModel';
import { MIMETYPE_TXT, MIMETYPE_DOCX, MIMETYPE_PDF } from '../../../misc/const';
import * as PDFDocument from 'pdfkit';
import * as MemoryStream from 'memorystream';
import { TextDecoder } from 'text-encoding';

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
    constructor() {
        super();
    }

    /**
     * Render the document to a PDF document if possible.
     * @param {DocumentModel} document Document to render.
     * @returns {DocumentModel} The rendered PDF document.
     * @memberof RenderEngine
     */
    render(document: DocumentModel): DocumentModel {
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
    private renderFromTxt(document: DocumentModel): DocumentModel {
        const renderedDocument = <DocumentModel>{ mimeType: MIMETYPE_PDF };

        const text = this._decoder.decode(document.content);
        const stream = new MemoryStream();

        const data = new Uint8Array();
        stream.on('data', chunk => {
            console.log(chunk);
        });

        stream.on('finish', () => {
            renderedDocument.content = data;
        });

        // Builds the PDF
        const pdf = new PDFDocument();
        pdf.pipe(stream);

        pdf
            .addPage()
            .fontSize(25)
            .text(text, 100, 100);

        pdf.end();

        // Close stream
        stream.end();

        return renderedDocument;
    }

    /**
     * Render from a word document (docx) to a PDF document.
     * @private
     * @param {DocumentModel} document
     * @returns {DocumentModel}
     * @memberof RenderEnginePdf
     */
    private renderFromDocx(document: DocumentModel): DocumentModel {
        return null;
    }
}
