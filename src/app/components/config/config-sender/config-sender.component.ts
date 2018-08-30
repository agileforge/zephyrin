import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../../providers/config/config.service';
import { SenderConfigModel } from '../../../providers/config/configModel';

@Component({
    selector: 'app-config-sender',
    templateUrl: './config-sender.component.html',
    styleUrls: ['./config-sender.component.scss']
})
export class ConfigSenderComponent implements OnInit {

    sender: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _configService: ConfigService,
    ) { }

    ngOnInit() {
        const that = this;
        this._configService.config.sender = this._configService.config.sender || <SenderConfigModel>{};
        const fb = this._formBuilder;
        const config = this._configService.config.sender;

        this.sender = fb.group( {
            email: fb.control(config.emailAddress, [Validators.required, Validators.email]),
            fullName: fb.control(config.fullName),
        });

        this.sender.valueChanges.subscribe(() => {
            if (that.sender.valid) {
                that._configService.save();
            }
        });

    }

}
