import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material';
import { MIMETYPE_PDF, MSG_MISSING_DATASOURCE, MSG_MISSING_EMAILDATA } from '../../misc/const';
import { DialogService } from '../../providers/dialog/dialog.service';
import { MailingDataModel } from '../../providers/mailer-engine/mailingDataModel';
import { MailingDataSource } from '../../providers/mailer-engine/mailingDataSource';
import { MessageHubService } from '../../providers/message-hub.service';

@Component({
    selector: 'app-mailing',
    templateUrl: './mailing.component.html',
    styleUrls: ['./mailing.component.scss']
})
export class MailingComponent implements OnInit {

    @Output() configClick = new EventEmitter<void>();
    mailingData = <MailingDataModel>{
        renderType: MIMETYPE_PDF,
        datasource: <MailingDataSource>{}
    };

    @ViewChild('mailingMergePanel') private _mailingMergePanel: MatExpansionPanel;
    @ViewChild('mailingMailPanel') private _mailingMailPanel: MatExpansionPanel;

    constructor(
        private _messageHub: MessageHubService,
        private _dialog: DialogService
    ) { }

    ngOnInit() {
        this.loadLocally();

        this._messageHub.register(MSG_MISSING_DATASOURCE).subscribe(() => {
            this._dialog.info('Datasource', 'Datasource or email binding is missing, please provide it.').subscribe(() => {
                this._mailingMergePanel.open();
            });
        });

        this._messageHub.register(MSG_MISSING_EMAILDATA).subscribe(() => {
            this._dialog.info('Email data', 'Subject or body is missing, please provide it.').subscribe(() => {
                this._mailingMailPanel.open();
            });
        });
    }

    private saveLocally() {
        localStorage.setItem('zephyrin-mailing-data', JSON.stringify(this.mailingData));
    }

    private loadLocally() {
        const dataJson = localStorage.getItem('zephyrin-mailing-data');
        if (dataJson) {
            this.mailingData = <MailingDataModel>JSON.parse(dataJson);
        }
    }

}
