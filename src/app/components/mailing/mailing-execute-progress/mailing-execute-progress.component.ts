/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DialogResponse } from '../../../enums/dialog-response.enum';
import { ElectronService } from '../../../providers/electron.service';
import { LogService } from '../../../providers/log-service';
import { MailerEngineService } from '../../../providers/mailer-engine/mailer-engine.service';
import { MailingDataModel } from '../../../providers/mailer-engine/mailingDataModel';
import { MailingLoggerService } from '../../../providers/mailing-logger/mailing-logger.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
    selector: 'app-mailing-execute-progress',
    templateUrl: './mailing-execute-progress.component.html',
    styleUrls: ['./mailing-execute-progress.component.scss']
})
export class MailingExecuteProgressComponent implements OnInit {

    DialogResponse: any = DialogResponse;
    sending = false;
    sent = false;
    data: MailingDataModel;
    progress: number;
    count: number;
    addressErrCount: number;
    errCount: number;
    total: number;

    get successLogUrl(): string { return new URL(`file:///${this._mailingLogger.successFileName}`).href; }
    get failLogUrl(): string { return new URL(`file:///${this._mailingLogger.sendFailFileName}`).href; }
    get badAddressLogUrl(): string { return new URL(`file:///${this._mailingLogger.emailAddressErrorFileName}`).href; }

    private _sendSubscription: Subscription;

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        private _mailerEngineService: MailerEngineService,
        private _mailingLogger: MailingLoggerService,
        private _electron: ElectronService,
        private _logger: LogService,
    ) {
    }

    ngOnInit() {
    }

    setData(data: MailingDataModel) {
        this.data = data;
    }

    openFile(fileName: string) {
        this._electron.shell.openExternal(fileName);
    }

    send() {
        this.sending = true;
        this.sent = false;
        this.count = 0;
        this.errCount = 0;
        this.addressErrCount = 0;
        this.total = this.data.datasource.data.length;
        this._sendSubscription = this._mailerEngineService.sendMails(this.data).subscribe(data => {
            if (data) {
                data.type === 'InvalidEmailAddressError' ? this.addressErrCount++ : this.errCount++;
            }
            this.progress = Math.ceil(++this.count / this.total * 100);
        }, err => {
            this._logger.error(err.message, err);
        }, () => {
            this.sending = false;
            this.sent = true;
        });
    }

    cancel() {
        this._sendSubscription.unsubscribe();
        this.sending = false;
        this.sent = false;
    }
}
