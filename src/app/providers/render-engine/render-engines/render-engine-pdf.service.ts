/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import * as docxConverter from 'docx-pdf';
import { BehaviorSubject, from, Observable, ReplaySubject } from 'rxjs';
import { concatAll, last, map } from 'rxjs/operators';
// import * as PDFDocument from 'pdfkit';
// import * as MemoryStream from 'memorystream';
import { TextDecoder } from 'text-encoding';
import { MIMETYPE_DOCX, MIMETYPE_PDF, MIMETYPE_TXT } from '../../../misc/const';
import { DocumentModel } from '../../document/documentModel';
import { FileService } from '../../file/file.service';
import { LogService } from '../../log-service';
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
        private _fileService: FileService
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
        const tmpSourceFileName = this._fileService.pathJoin(__dirname, 'tmp', new Date().getTime() + '.docx');
        const tmpTargetFileName = this._fileService.pathJoin(__dirname, 'tmp', new Date().getTime() + '.pdf');

        return from([
            this._fileService.writeBytes(tmpSourceFileName, document.content),
            this.convertDocxToPdf(tmpSourceFileName, tmpTargetFileName),
            this._fileService.readBytes(tmpTargetFileName)
        ])
            .pipe(
                concatAll(),
                last<Uint8Array>(),
                map(fileContent => <DocumentModel>{ mimeType: MIMETYPE_PDF, content: fileContent })
            );
    }

    /**
     *Converts the docx source file to a pdf file.
     * @private
     * @param {*} fromFileName File name of docx source.
     * @param {*} toFileName File name of PDF target.
     * @returns {Observable<{}>}
     * @memberof RenderEnginePdf
     */
    private convertDocxToPdf(fromFileName, toFileName): Observable<void> {
        const that = this;
        const subject = new ReplaySubject<void>();
        docxConverter(fromFileName, toFileName, function (err, result) {
            if (err) {
                that._logger.error(`docx-pdf was unable to convert the document: ${err.message}`);
                throw err;
            }
            subject.next();
        });

        return subject;
    }
}
