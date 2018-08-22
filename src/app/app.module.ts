/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MailSenderService } from './services/mail-sender/mail-sender.service';
import { MailerEngineService } from './services/mailer-engine/mailer-engine.service';
import { ConfigService } from './services/config/config.service';
import { DocumentMergerService } from './services/render-engine/document-merger/document-merger.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [
        MailSenderService,
        MailerEngineService,
        ConfigService,
        DocumentMergerService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
