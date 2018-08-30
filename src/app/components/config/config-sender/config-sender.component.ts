import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../../../providers/config/config.service';
import { SenderConfigModel } from '../../../providers/config/configModel';
import { filter, map, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-config-sender',
    templateUrl: './config-sender.component.html',
    styleUrls: ['./config-sender.component.scss']
})
export class ConfigSenderComponent implements OnInit {

    @Output() configChanged = new EventEmitter<SenderConfigModel>();

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

        this.sender = fb.group({
            email: fb.control(config.emailAddress, [Validators.required, Validators.email]),
            fullName: fb.control(config.fullName),
        });

        that._configService.configSubject.subscribe(conf => {
            that.sender.setValue(conf.sender, { emitEvent: false });
        });

        this.sender.valueChanges.pipe(
            filter(() => that.sender.valid),
            debounceTime(400),
            map(() => <SenderConfigModel>that.sender.getRawValue())
        ).subscribe(c => {
            that.configChanged.emit(c);
        });
    }

}
