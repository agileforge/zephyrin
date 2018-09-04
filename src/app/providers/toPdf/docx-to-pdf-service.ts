/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { PrintToPDFOptions } from 'electron';
import * as mammoth from 'mammoth';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { MIMETYPE_PDF } from '../../misc/const';
import { DocumentModel } from '../document/documentModel';
import { ElectronService } from '../electron.service';
import { FileService } from '../file/file.service';
import { LogService } from '../log-service';

@Injectable({
    providedIn: 'root'
})
export class DocxToPdfService {

    constructor(
        private _logger: LogService,
        private _fileService: FileService,
        private _electron: ElectronService,
    ) { }

    private docxToHtml(docxFileName: string): Observable<string> {
        const that = this;
        this._logger.debug('Starting to convert a Word document to HTML...');
        return Observable.create(subscriber => {
            mammoth.convertToHtml({ path: docxFileName }).then(result => {
                const html = result.value; // The generated HTML
                that._logger.trace('Word document has been converted as:', html);
                subscriber.next(html);
                subscriber.complete();
            });
        });
    }

    private printToPdf(htmlFileName: string): Observable<DocumentModel> {
        const that = this;
        this._logger.debug('Starting to convert a HTML document to PDF...');
        const windowToPdf = this._electron.createBrowserWindow({ show: false });
        windowToPdf.loadURL(`file://${htmlFileName}`);

        const pdfSettings = <PrintToPDFOptions>{
            landscape: false,
            marginsType: 0,
            printBackground: false,
            printSelectionOnly: false,
            pageSize: 'A4',
        };
        return Observable.create(subscriber => {
            windowToPdf.webContents.on('did-finish-load', () => {
                windowToPdf.webContents.printToPDF(pdfSettings, (err, data) => {
                    if (err) {
                        that._logger.error('Conversion to HTML fail.', err);
                        subscriber.error(err);
                        return;
                    }
                    that._logger.debug('HTML has been successfully converted to PDF.');
                    subscriber.next(<DocumentModel>{
                        mimeType: MIMETYPE_PDF,
                        content: new Uint8Array(data)
                    });
                    subscriber.complete();
                });
            });
        });
    }

    convert(source: Uint8Array): Observable<DocumentModel> {
        const that = this;
        this._logger.debug('Starting to convert a document to PDF...');
        const docxFileName = this._fileService.pathJoin(this._fileService.tempDir, new Date().getTime().toString() + '.docx');
        const htmlFileName = this._fileService.pathJoin(this._fileService.tempDir, new Date().getTime().toString() + '.html');

        return this._fileService.writeBytes(docxFileName, source).pipe(
            concatMap(() => that.docxToHtml(docxFileName)),
            concatMap(html => that._fileService.writeText(htmlFileName, html)),
            concatMap(() => that.printToPdf(htmlFileName)),
            map(document => {
                const fileName = '/home/paf/Temp/' + new Date().getTime().toString() + '.pdf';
                that._fileService.writeBytes(fileName, document.content).subscribe();
                return document;
            })
        );
    }
}
