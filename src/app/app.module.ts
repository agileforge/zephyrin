/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppComponent } from './app.component';
import { MailSenderService } from './services/mail-sender/mail-sender.service';
import { MailerEngineService } from './services/mailer-engine/mailer-engine.service';
import { ConfigService } from './services/config/config.service';
import { DocumentMergerService } from './services/render-engine/document-merger/document-merger.service';
import { FileService } from './services/file/file.service';
import { DocumentMergerWord } from './services/render-engine/document-merger/document-merger-word';
import { DocumentMergerTxt } from './services/render-engine/document-merger/document-merger-txt';
import { LogService } from './services/log-service';
import { RenderEngineTxt } from './services/render-engine/render-engines/render-engine-txt.service';
import { RenderEnginePdf } from './services/render-engine/render-engines/render-engine-pdf.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [
        LogService,
        MailSenderService,
        MailerEngineService,
        ConfigService,
        DocumentMergerService,
        FileService,
        // Mergers
        DocumentMergerTxt,
        DocumentMergerWord,
        // Renderers
        RenderEngineTxt,
        RenderEnginePdf,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
