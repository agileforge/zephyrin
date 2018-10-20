/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { MSG_DATASOURCE_FIELDS_LOADED, MSG_MAILINGDATA_LOADED } from '../../../misc/const';
import Utils from '../../../misc/utils';
import { MailingDataModel } from '../../../providers/mailer-engine/mailingDataModel';
import { MessageHubService } from '../../../providers/message-hub.service';

const EMAIL_SEP = ',;|';
@Component({
    selector: 'app-mailing-mail',
    templateUrl: './mailing-mail.component.html',
    styleUrls: ['./mailing-mail.component.scss']
})
export class MailingMailComponent implements OnInit {

    @Input() set mailingData(value: MailingDataModel) { this.setMailingData(value, false); }
    get mailingData(): MailingDataModel { return this._mailingData; }

    email: FormGroup;
    fields: string[];

    private _mailingData: MailingDataModel;

    constructor(
        private _formBuilder: FormBuilder,
        private _messageHub: MessageHubService
    ) { }

    ngOnInit() {
        const that = this;
        const fb = this._formBuilder;
        this.email = fb.group({
            copyToAddresses: fb.control(null),
            blindCopyToAddresses: fb.control(null),
            subject: fb.control(null, Validators.required),
            body: fb.control(null, Validators.required)
        });

        this.email.valueChanges.subscribe(() => {
            if (this.mailingData) {
                this.mailingData.copyToAddresses = this.email.get('copyToAddresses').value;
                this.mailingData.blindCopyToAddresses = this.email.get('blindCopyToAddresses').value;
                this.mailingData.subject = this.email.get('subject').value;
                this.mailingData.body = this.email.get('body').value;
            }
        });

        this._messageHub.register(MSG_MAILINGDATA_LOADED).subscribe(data => {
            const fullData = <{ logPath: string, mailingData: MailingDataModel }>data;
            const mailingData = fullData.mailingData;
            that.setMailingData(mailingData, true);
        });

        this._messageHub.register(MSG_DATASOURCE_FIELDS_LOADED).subscribe((data: string[]) => {
            that.fields = data;
        });
    }

    private setMailingData(value: MailingDataModel, emitEvent: boolean): void {
        this._mailingData = value;

        if (value && this.email) {
            this.email.setValue({
                copyToAddresses: value.copyToAddresses || null,
                blindCopyToAddresses: value.blindCopyToAddresses || null,
                subject: value.subject,
                body: value.body,
            }, { emitEvent });
        }
    }

    addCopyPlaceholder(event: MatSelectChange, field: string) {
        if (event.value) {
            const chars = ' ' + EMAIL_SEP;
            const container = this.email.get(field);
            const currentValue: string = container.value || '';
            const newValue = Utils.trimChar(Utils.trimChar(currentValue, chars) + ', {' + event.value + '}', chars);
            container.setValue(newValue);
            event.source.value = null;
        }
    }
}
