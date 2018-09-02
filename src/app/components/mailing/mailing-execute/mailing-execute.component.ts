import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogResponse } from '../../../enums/dialog-response.enum';
import { ConfigService } from '../../../providers/config/config.service';
import { DialogService } from '../../../providers/dialog/dialog.service';
import { MailingDataModel } from '../../../providers/mailer-engine/mailingDataModel';

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

    sendMails() {
        this._dialogService.confirm('Send', `You are going to send ${this.emailCount} emails. Are you sure ?`)
            .subscribe(response => {
                if (response === DialogResponse.Yes) {
                    const mailDataCopy = <MailingDataModel>Object.assign({}, this.mailingData);
                }
            });
    }
}
