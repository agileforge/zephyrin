import { Component, OnInit } from '@angular/core';
import { MailingDataModel } from '../../../providers/mailer-engine/mailingDataModel';

@Component({
    selector: 'app-mailing-execute-progress',
    templateUrl: './mailing-execute-progress.component.html',
    styleUrls: ['./mailing-execute-progress.component.scss']
})
export class MailingExecuteProgressComponent implements OnInit {

    private data: MailingDataModel;

    constructor() { }

    ngOnInit() {
    }

    setData(data: MailingDataModel) {
        this.data = data;
    }
}
