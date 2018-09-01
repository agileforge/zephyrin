import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailingDataModel } from '../../../providers/mailer-engine/mailingDataModel';

@Component({
    selector: 'app-mailing-mail',
    templateUrl: './mailing-mail.component.html',
    styleUrls: ['./mailing-mail.component.scss']
})
export class MailingMailComponent implements OnInit {

    @Input() set mailingData(value: MailingDataModel) { this.setMailingData(value); }
    get mailingData(): MailingDataModel { return this._mailingData; }

    email: FormGroup;

    private _mailingData: MailingDataModel;

    constructor(
        private _formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        const fb = this._formBuilder;
        this.email = fb.group({
            subject: fb.control(null, Validators.required),
            body: fb.control(null, Validators.required)
        });

        this.email.valueChanges.subscribe(() => {
            if (this.mailingData) {
                this.mailingData.subject = this.email.get('subject').value;
                this.mailingData.body = this.email.get('body').value;
            }
        });
    }

    private setMailingData(value: MailingDataModel): void {
        this._mailingData = value;

        if (value && this.email) {
            this.email.setValue({
                subject: value.subject,
                body: value.body,
            }, { emitEvent: false });
        }
    }

}
