/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { debounceTime, filter } from 'rxjs/operators';
import { MSG_MAILINGDATA_LOADED, MSG_MAILINGLOG_SAVED } from '../../../misc/const';
import { ConfigService } from '../../../providers/config/config.service';
import { DataLoaderService } from '../../../providers/data-loader/data-loader.service';
import { DocumentService } from '../../../providers/document/document.service';
import { FileService } from '../../../providers/file/file.service';
import { LogService } from '../../../providers/log-service';
import { MailingDataModel } from '../../../providers/mailer-engine/mailingDataModel';
import { MailingDataSource } from '../../../providers/mailer-engine/mailingDataSource';
import { MailingLoggerService } from '../../../providers/mailing-logger/mailing-logger.service';
import { MessageHubService } from '../../../providers/message-hub.service';

@Component({
    selector: 'app-mailing-merge',
    templateUrl: './mailing-merge.component.html',
    styleUrls: ['./mailing-merge.component.scss']
})
export class MailingMergeComponent implements OnInit {

    @Output() dataChanged = new EventEmitter<MailingDataModel>();
    @Input() set mailingData(value: MailingDataModel) { this.setMailingData(value, false); }
    get mailingData(): MailingDataModel { return this._mailingData; }
    get availableFieldsForEmail(): string[] { return this.getAvailableFields('lastNameField', 'firstNameField'); }
    get availableFieldsForLastName(): string[] { return this.getAvailableFields('emailField', 'firstNameField'); }
    get availableFieldsForFirstName(): string[] { return this.getAvailableFields('lastNameField', 'emailField'); }

    merge: FormGroup;
    sourceFileAccept = '.xlsx';
    templateFileAccept = '.docx';
    availableFields: string[] = [];
    mailingNames: string[] = [];

    @ViewChild('sourceFileInput') private _sourceFileInput: ElementRef;
    @ViewChild('templateFileInput') private _templateFileInput: ElementRef;
    private _mailingData: MailingDataModel;

    constructor(
        private _formBuilder: FormBuilder,
        private _fileService: FileService,
        private _dataLoaderService: DataLoaderService,
        private _documentService: DocumentService,
        private _configService: ConfigService,
        private _mailingLogger: MailingLoggerService,
        private _messageHub: MessageHubService,
        private _logger: LogService
    ) { }

    ngOnInit() {
        const that = this;
        const fb = this._formBuilder;

        this._fileService.getDirectories(this._configService.config.mailingLog.directoryPath).subscribe(dirs => {
            this.mailingNames = dirs;
        });

        this.merge = fb.group({
            name: fb.control(null),
            sourceFileName: fb.control(null),
            templateFileName: fb.control(null),
            emailField: fb.control(null),
            lastNameField: fb.control(null),
            firstNameField: fb.control(null),
        });

        this.merge.valueChanges.pipe(
            filter(() => that.merge.valid),
            debounceTime(400),
        ).subscribe(() => {
            that.mailingData.name = that.merge.get('name').value;
            that.mailingData.datasource.mailAddressField = that.merge.get('emailField').value;
            that.mailingData.datasource.lastNameField = that.merge.get('lastNameField').value;
            that.mailingData.datasource.firstNameField = that.merge.get('firstNameField').value;
        });

        this.merge.get('sourceFileName').valueChanges.pipe(
            debounceTime(400)
        ).subscribe(value => {
            that.sourceFileNameChanged(value);
        });

        this.merge.get('templateFileName').valueChanges.pipe(
            debounceTime(400)
        ).subscribe(value => {
            that.templateFileNameChanged(value);
        });

        this._messageHub.register(MSG_MAILINGDATA_LOADED).subscribe(data => {
            const fullData = <{ logPath: string, mailingData: MailingDataModel }>data;
            const mailingData = Object.assign(that.mailingData, fullData.mailingData);
            if (mailingData.datasource && mailingData.datasource.fileName) {
                const fileName = that._fileService.pathExtractFileName(mailingData.datasource.fileName);
                const sourceFullPath = that._fileService.pathJoin(fullData.logPath, fileName);
                that.sourceFileNameChanged(sourceFullPath);
                mailingData.datasource.fileName = sourceFullPath;
            }
            if (mailingData.template && mailingData.template.fullName) {
                const fileName = that._fileService.pathExtractFileName(mailingData.template.fullName);
                const templateFullPath = that._fileService.pathJoin(fullData.logPath, fileName);
                that.templateFileNameChanged(templateFullPath);
                mailingData.template.fileName = templateFullPath;
            }
            that.setMailingData(mailingData, false);
        });

        this._messageHub.register(MSG_MAILINGLOG_SAVED).subscribe(_ => {
            this._fileService.getDirectories(this._configService.config.mailingLog.directoryPath).subscribe(dirs => {
                this.mailingNames = dirs;
            });
        });
    }

    sourceFileSelected(event) {
        const fileName = event.target.files[0].path;
        this.merge.get('sourceFileName').setValue(fileName);
    }

    private sourceFileNameChanged(fileName: string) {
        const that = this;

        if ((fileName || '') === '' || !this._fileService.fileExists(fileName)) {
            this._logger.debug(`Filename '${fileName}' doen't exists, set empty data.`);
            this.mailingData.datasource = <MailingDataSource>{};
            this._sourceFileInput.nativeElement.value = '';
            this.availableFields = [];
            return;
        }

        if (!this.mailingData.datasource || this.mailingData.datasource.fileName !== fileName) {
            this._logger.debug(`Loading file '${fileName}' to mailing data.`);
            this._dataLoaderService.fromFile(fileName).subscribe(rows => {
                this._logger.debug(`File '${fileName}' loaded successfully and found ${rows.length} rows.`);
                that.mailingData.datasource.data = rows;
                that.mailingData.datasource.fileName = fileName;
                that.availableFields = [];
                if (rows.length > 0) {
                    that.availableFields = Object.keys(rows[0]);
                }
            });
        }
    }

    templateFileSelected(event) {
        const fileName = event.target.files[0].path;
        this.merge.get('templateFileName').setValue(fileName);
    }

    nameChanged(e: MatAutocompleteSelectedEvent) {
        const selectedPath = this._fileService.pathJoin(
            this._configService.config.mailingLog.directoryPath,
            e.option.value.toString());

        this._mailingLogger.load(selectedPath);
    }

    private templateFileNameChanged(fileName: string) {
        const that = this;

        if ((fileName || '') === '' || !this._fileService.fileExists(fileName)) {
            this.mailingData.template = null;
            this._templateFileInput.nativeElement.value = '';
            return;
        }

        if (!this.mailingData.template || this.mailingData.template.fullName !== fileName) {
            this._documentService.loadFromFile(fileName).subscribe(document => {
                that.mailingData.template = document;
            });
        }
    }

    private setMailingData(value: MailingDataModel, emitEvent: boolean): void {
        this._mailingData = value;

        if (value && this.merge) {
            this.merge.setValue({
                name: value.name,
                sourceFileName: value.datasource.fileName,
                templateFileName: value.template ? value.template.fullName : null,
                emailField: value.datasource.mailAddressField,
                lastNameField: value.datasource.lastNameField,
                firstNameField: value.datasource.firstNameField
            }, { emitEvent });
        }
    }

    private getAvailableFields(...excludedFields: string[]): string[] {
        const that = this;
        return this.availableFields.filter(f =>
            excludedFields.findIndex(formControlName => that.merge.get(formControlName).value === f) === -1);
    }

}
