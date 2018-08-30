import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../../../providers/config/config.service';
import { SmtpConfigModel } from '../../../providers/config/configModel';
import { filter, map, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-config-smtp',
    templateUrl: './config-smtp.component.html',
    styleUrls: ['./config-smtp.component.scss']
})
export class ConfigSmtpComponent implements OnInit {

    @Output() configChanged = new EventEmitter<SmtpConfigModel>();

    smtp: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _configService: ConfigService,
    ) { }

    ngOnInit() {
        const that = this;

        // Create form
        that._configService.config.smtp = that._configService.config.smtp || <SmtpConfigModel>{};
        const fb = that._formBuilder;
        const config = that._configService.config.smtp;

        that.smtp = fb.group({
            host: fb.control(config.host, [Validators.required]),
            port: fb.control(config.port, Validators.pattern(/\d*/)),
            isSsl: fb.control(config.isSsl),
            userName: fb.control(config.userName, Validators.required),
            password: fb.control(config.password, Validators.required),
        });

        // Update when data are ready
        that._configService.configSubject.subscribe(conf => {
            that.smtp.setValue(conf.smtp, { emitEvent: false });
        });

        this.smtp.valueChanges.pipe(
            filter(() => that.smtp.valid),
            debounceTime(400),
            map(() => <SmtpConfigModel>that.smtp.getRawValue())
        ).subscribe(c => {
            that.configChanged.emit(c);
        });
    }

}
