/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfigService } from '../../providers/config/config.service';
import { MailingLogConfigModel, SenderConfigModel, SmtpConfigModel } from '../../providers/config/configModel';

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

