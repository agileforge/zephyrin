import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { MSG_CONFIG_NOK } from '../../misc/const';
import { ConfigModel } from '../../providers/config/configModel';
import { DialogService } from '../../providers/dialog/dialog.service';
import { MessageHubService } from '../../providers/message-hub.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild('sidenav') private _sidenav: MatSidenav;

    constructor(
        private _messageHub: MessageHubService,
        private _dialog: DialogService
    ) { }

    ngOnInit() {
        const that = this;
        this._messageHub.register(MSG_CONFIG_NOK).subscribe((config: ConfigModel) => {
            this._dialog.info('Configuration', 'Missing configuration informations. Please set it.').subscribe(() => {
                that._sidenav.open();
            });
        });
    }

}
