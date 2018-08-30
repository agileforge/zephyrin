import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigService } from '../../../providers/config/config.service';
import { SenderConfigModel, MailingLogConfigModel } from '../../../providers/config/configModel';
import { ElectronService } from '../../../providers/electron.service';
import { LogService } from '../../../providers/log-service';

@Component({
    selector: 'app-config-log',
    templateUrl: './config-log.component.html',
    styleUrls: ['./config-log.component.scss']
})
export class ConfigLogComponent implements OnInit {

    mailingLog: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _configService: ConfigService,
        private _logger: LogService,
    ) { }

    ngOnInit() {
        const that = this;

        this._configService.config.mailingLog = this._configService.config.mailingLog || <MailingLogConfigModel>{};
        const fb = this._formBuilder;
        const config = this._configService.config.mailingLog;

        this.mailingLog = fb.group({
            directoryPath: fb.control(config.directoryPath),
        });

        this.mailingLog.valueChanges.subscribe(() => {
            if (that.mailingLog.valid) {
                that._configService.save().subscribe(() => {
                    that._logger.debug('Saved finish');
                });
            }
        });
    }

    // selectDirectory() {
    //     this._electronService.dialog.showOpenDialog(this._electronService.window, { properties: ['openDirectory'] });
    // }

}
