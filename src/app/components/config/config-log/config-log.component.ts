import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigService } from '../../../providers/config/config.service';
import { MailingLogConfigModel } from '../../../providers/config/configModel';
import { LogService } from '../../../providers/log-service';
import { filter, map, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-config-log',
    templateUrl: './config-log.component.html',
    styleUrls: ['./config-log.component.scss']
})
export class ConfigLogComponent implements OnInit {

    @Output() configChanged = new EventEmitter<MailingLogConfigModel>();

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

        that._configService.configSubject.subscribe(conf => {
            that.mailingLog.setValue(conf.mailingLog, { emitEvent: false });
        });

        this.mailingLog.valueChanges.pipe(
            filter(() => that.mailingLog.valid),
            debounceTime(400),
            map(() => <MailingLogConfigModel>that.mailingLog.getRawValue())
        ).subscribe(c => {
            that.configChanged.emit(c);
        });
    }

    // selectDirectory() {
    //     this._electronService.dialog.showOpenDialog(this._electronService.window, { properties: ['openDirectory'] });
    // }

}
