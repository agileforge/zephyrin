import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../../../providers/config/config.service';
import { SenderConfigModel, SmtpConfigModel } from '../../../providers/config/configModel';

@Component({
    selector: 'app-config-smtp',
    templateUrl: './config-smtp.component.html',
    styleUrls: ['./config-smtp.component.scss']
})
export class ConfigSmtpComponent implements OnInit {


    smtp: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _configService: ConfigService,
    ) { }

    ngOnInit() {
        const that = this;
        this._configService.config.smtp = this._configService.config.smtp || <SmtpConfigModel>{};
        const fb = this._formBuilder;
        const config = this._configService.config.smtp;

        this.smtp = fb.group({
            host: fb.control(config.host, [Validators.required]),
            port: fb.control(config.port, Validators.pattern(/\d*/)),
            isSsl: fb.control(config.isSsl),
            userName: fb.control(config.userName, Validators.required),
            password: fb.control(config.password, Validators.required),
        });

        this.smtp.valueChanges.subscribe(() => {
            if (that.smtp.valid) {
                that._configService.save();
            }
        });
    }


}
