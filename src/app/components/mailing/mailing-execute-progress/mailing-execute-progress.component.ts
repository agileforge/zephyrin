import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DialogResponse } from '../../../enums/dialog-response.enum';
import { LogService } from '../../../providers/log-service';
import { MailerEngineService } from '../../../providers/mailer-engine/mailer-engine.service';
import { MailingDataModel } from '../../../providers/mailer-engine/mailingDataModel';
import { MessageHubService } from '../../../providers/message-hub.service';
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

    private _sendSubscription: Subscription;

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        private _mailerEngineService: MailerEngineService,
        private _messageHub: MessageHubService,
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
        this._sendSubscription = this._mailerEngineService.sendMails(this.data).subscribe(() => {
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
