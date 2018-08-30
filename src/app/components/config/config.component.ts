import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SmtpConfigModel, SenderConfigModel, MailingLogConfigModel, ConfigModel } from '../../providers/config/configModel';
import { ConfigService } from '../../providers/config/config.service';

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

    @Output() close = new EventEmitter();

    constructor(
        private _configService: ConfigService,
    ) { }

    ngOnInit() {
    }

    saveSender(sender: SenderConfigModel) {
        this._configService.config.sender = sender;
        this._configService.save().subscribe();
    }

    saveSmtp(smtp: SmtpConfigModel) {
        this._configService.config.smtp = smtp;
        this._configService.save().subscribe();
    }

    saveMailingLog(mailingLog: MailingLogConfigModel) {
        this._configService.config.mailingLog = mailingLog;
        this._configService.save().subscribe();
    }
}

