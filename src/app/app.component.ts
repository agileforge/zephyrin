import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ConfigService } from './providers/config/config.service';
import { LogService } from './providers/log-service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(
        public _electronService: ElectronService,
        private _translate: TranslateService,
        private _config: ConfigService,
        private _logger: LogService,
    ) {
        this._config.load().subscribe();
        _translate.setDefaultLang('en');
        this._logger.debug('AppConfig', AppConfig);

        if (_electronService.isElectron()) {
            this._logger.debug('Mode electron');
            this._logger.debug('Electron ipcRenderer', _electronService.ipcRenderer);
            this._logger.debug('NodeJS childProcess', _electronService.childProcess);
        } else {
            this._logger.debug('Mode web');
        }
    }
}
