/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MSG_CONFIG_NOK, MSG_MISSING_DATASOURCE, MSG_MISSING_EMAILDATA } from '../../../misc/const';
import Utils from '../../../misc/utils';
import { ConfigService } from '../../../providers/config/config.service';
import { DialogService } from '../../../providers/dialog/dialog.service';
import { MailingDataModel } from '../../../providers/mailer-engine/mailingDataModel';
import { MessageHubService } from '../../../providers/message-hub.service';
import { MailingExecuteProgressComponent } from '../mailing-execute-progress/mailing-execute-progress.component';

@Component({
    selector: 'app-mailing-execute',
    templateUrl: './mailing-execute.component.html',
    styleUrls: ['./mailing-execute.component.scss']
})
export class MailingExecuteComponent implements OnInit {

    @Input() mailingData: MailingDataModel;

    send: FormGroup;
    emailCount: number;

    constructor(
        private _formBuilder: FormBuilder,
        private _configService: ConfigService,
        private _dialogService: DialogService,
        private _messageHub: MessageHubService
    ) { }

    ngOnInit() {
        const fb = this._formBuilder;

        const senderEmailAddress = (this._configService.config.sender ? this._configService.config.sender.emailAddress : null);

        this.send = fb.group({
            test: fb.control(false),
            testType: fb.control('one'),
            testLineNumber: fb.control(1, Validators.required),
            testEmailAddress: fb.control(senderEmailAddress, Validators.email),
        });

        this.send.valueChanges.subscribe(() => {
            this.emailCount = this.getEmailCount();
        });

        this._configService.configSubject.subscribe(config => {
            const emailControl = this.send.get('testEmailAddress');
            if (!emailControl.value && config && config.sender) {
                emailControl.setValue(config.sender.emailAddress, { emitEvent: false });
            }
        });

    }

    private getEmailCount(): number {
        if (this.send.get('test').value === true && this.send.get('testType').value === 'one') {
            return 1;
        }

        if (this.mailingData && this.mailingData.datasource && this.mailingData.datasource.data) {
            return this.mailingData.datasource.data.length;
        }

        return 0;
    }

    get receiverText(): string {
        if (this.send.get('test').value === true) {
            if (this.send.get('testEmailAddress').value === '') {
                return `address specified above`;
            } else {
                return `address '${this.send.get('testEmailAddress').value}'`;
            }
        }

        return `addresses specified in source file`;
    }

    private getMailingDataToSend(): MailingDataModel {
        if (this.send.get('test').value === true) {
            const mailDataToSend = <MailingDataModel>(JSON.parse(JSON.stringify(this.mailingData)));
            mailDataToSend.template = this.mailingData.template; // This fix issue with serialisation...
            const testEmailAddress = this.send.get('testEmailAddress').value;
            // Replace all email with test email
            mailDataToSend.datasource.data.forEach(row => {
                row[mailDataToSend.datasource.mailAddressField] = testEmailAddress;
            });

            if (this.send.get('testType').value === 'one') {
                const lineNum = <number>this.send.get('testLineNumber').value;
                mailDataToSend.datasource.data = [mailDataToSend.datasource.data[lineNum - 1]];
            }
            return mailDataToSend;
        }

        return this.mailingData;
    }

    sendMails() {
        if (!this._configService.checkConfig()) {
            this._messageHub.emitMessage(MSG_CONFIG_NOK, this._configService.config);
            return;
        }

        if (!this.mailingData ||
            !this.mailingData.datasource ||
            Utils.isNullOrEmpty(this.mailingData.datasource.mailAddressField) ||
            !this.mailingData.datasource.data ||
            this.mailingData.datasource.data.length === 0) {
            this._messageHub.emit(MSG_MISSING_DATASOURCE);
            return;
        }

        if (!this.mailingData ||
            Utils.isNullOrEmpty(this.mailingData.subject) ||
            Utils.isNullOrEmpty(this.mailingData.body)) {
            this._messageHub.emit(MSG_MISSING_EMAILDATA);
            return;
        }

        this._dialogService.dialog(MailingExecuteProgressComponent, dr => {
            dr.componentInstance.setData(this.getMailingDataToSend());
        },
            { width: '400px', height: '322px' }).subscribe();
    }
}
