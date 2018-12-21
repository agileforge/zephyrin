/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import * as childProcess from 'child_process';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { MIMETYPE_PDF } from '../../misc/const';
import { DocumentModel } from '../document/documentModel';
import { FileService } from '../file/file.service';
import { LogService } from '../log-service';

@Injectable({
    providedIn: 'root'
})
export class DocxToPdfService {

    constructor(
        private _logger: LogService,
        private _fileService: FileService,
    ) { }

    /**
     * Converts a Word document to PDF document.
     * Remarks: This only works in Windows. This is a bit dirty but
     * seems not exists a JS library that do the job correctly. So
     * a solution was to call ActiveX to convert.
     * @param {Uint8Array} source Byte array that contains the Word document.
     * @returns {Observable<DocumentModel>} The converted PDF document.
     * @memberof DocxToPdfService
     */
    convert(source: Uint8Array): Observable<DocumentModel> {
        const that = this;
        const tempDir = this._fileService.tempDir;
        const docxFileName = this._fileService.pathJoin(tempDir, (new Date().getTime()).toString() + '.docx');
        const pdfFileName = this._fileService.changeExtension(docxFileName, '.pdf');

        let result: DocumentModel = null;

        return this._fileService.writeBytes(docxFileName, source).pipe(
            concatMap(() => that.getScriptFileName()),
            concatMap(fileName => that.spawn('cscript.exe', [
                '/b',
                fileName,
                docxFileName,
                pdfFileName
            ])),
            concatMap(() => that._fileService.readBytes(pdfFileName)),
            concatMap(pdfContent => {
                result = <DocumentModel>{ mimeType: MIMETYPE_PDF, content: pdfContent };
                return of(result);
            }),
            concatMap(() => that._fileService.deleteFile(docxFileName)),
            concatMap(() => that._fileService.deleteFile(pdfFileName)),
            map(() => result)
        );
    }


    /**
     * Execute a process.
     * @private
     * @param {string} command The command to execute.
     * @param {string[]} args The command arguments.
     * @param {*} [options] Some options.
     * @memberof DocxToPdfService
     */
    private spawn(command: string, args: string[], options?: any) {
        const that = this;
        return Observable.create(observer => {
            that._logger.debug('Starting process to convert docx to PDF...', command, args, options);
            const process = childProcess.spawn(command, args, options);

            process.stdout.on('data', function (data) {
                that._logger.debug(data);
            });

            process.stderr.on('data', function (data) {
                that._logger.error(data);
            });

            process.on('exit', function (code) {
                if (code === 0) {
                    observer.next();
                    observer.complete();
                } else {
                    observer.error({ code: code });
                }
            });
        });
    }

    /**
     * Returns the JS script that launch MS-Word ActiveX to convert document to PDF.
     * @private
     * @returns {Observable<string>} The script.
     * @memberof DocxToPdfService
     */
    private getScriptFileName(): Observable<string> {
        const fileName = this._fileService.pathJoin(this._fileService.tempDir, 'word2pdf.js');
        return this._fileService.writeText(
            fileName,
            // tslint:disable-next-line:max-line-length
            'try{var w=new ActiveXObject("Word.Application");if(w){var d=w.Documents,f=d.Open(WScript.Arguments(0));f.SaveAs2(WScript.Arguments(1),17),d.Close(),w.Quit()}}catch(t){WScript.StdErr.WriteLine(t.message),WScript.Quit(1)}'
        ).pipe(map(() => fileName));
    }

}
