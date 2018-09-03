import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MIMETYPE_PDF } from '../../misc/const';
import { MailingDataModel } from '../../providers/mailer-engine/mailingDataModel';
import { MailingDataSource } from '../../providers/mailer-engine/mailingDataSource';

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

    constructor() { }

    ngOnInit() {
        this.loadLocally();
    }

    private saveLocally() {
        localStorage.setItem('zephyrin-mailing-data', JSON.stringify(this.mailingData));
    }

    private loadLocally() {

        // '/home/paf/projects/zephyrin/tmp/test.docx';


        const dataJson = localStorage.getItem('zephyrin-mailing-data');
        if (dataJson) {
            this.mailingData = <MailingDataModel>JSON.parse(dataJson);
        }
    }

}
