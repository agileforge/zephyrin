import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DialogResponse } from '../../../enums/dialog-response.enum';
import { LogService } from '../../../providers/log-service';
import { MailerEngineService } from '../../../providers/mailer-engine/mailer-engine.service';
import { MailingDataModel } from '../../../providers/mailer-engine/mailingDataModel';
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
    total: number;

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        private _mailerEngineService: MailerEngineService,
        private _logger: LogService,
    ) { }

    ngOnInit() {
    }

    setData(data: MailingDataModel) {
        this.data = data;
    }

    send() {
        this.sending = true;
        this.sent = false;
        this.count = 0;
        this.total = this.data.datasource.data.length;
        this._mailerEngineService.sendMails(this.data).subscribe(() => {
            this.progress = ++this.count / this.total * 100;
        }, err => {
            this._logger.error(err.message, err);
        }, () => {
            this.sending = false;
            this.sent = true;
        });
    }

    cancel() {
        this.sending = false;
        this.sent = false;
    }
}
