/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Material
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// NG Translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CKEditorModule } from 'ng2-ckeditor';
import 'reflect-metadata';
import 'zone.js/dist/zone-mix';
import '../polyfills';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigLogComponent } from './components/config/config-log/config-log.component';
import { ConfigSenderComponent } from './components/config/config-sender/config-sender.component';
import { ConfigSmtpComponent } from './components/config/config-smtp/config-smtp.component';
import { ConfigComponent } from './components/config/config.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { HomeComponent } from './components/home/home.component';
import { MailingExecuteProgressComponent } from './components/mailing/mailing-execute-progress/mailing-execute-progress.component';
import { MailingExecuteComponent } from './components/mailing/mailing-execute/mailing-execute.component';
import { MailingMailComponent } from './components/mailing/mailing-mail/mailing-mail.component';
import { MailingMergeComponent } from './components/mailing/mailing-merge/mailing-merge.component';
import { MailingComponent } from './components/mailing/mailing.component';
import { WebviewDirective } from './directives/webview.directive';
import { ConfigService } from './providers/config/config.service';
import { DataLoaderService } from './providers/data-loader/data-loader.service';
import { ExcelDataLoader } from './providers/data-loader/excel-data-loader';
import { DialogService } from './providers/dialog/dialog.service';
import { DocumentService } from './providers/document/document.service';
import { ElectronService } from './providers/electron.service';
import { FileService } from './providers/file/file.service';
import { LogService } from './providers/log-service';
import { MailSenderService } from './providers/mail-sender/mail-sender.service';
import { MailerEngineService } from './providers/mailer-engine/mailer-engine.service';
import { MessageHubService } from './providers/message-hub.service';
import { DocumentMergerTxt } from './providers/render-engine/document-merger/document-merger-txt';
import { DocumentMergerWord } from './providers/render-engine/document-merger/document-merger-word';
import { DocumentMergerService } from './providers/render-engine/document-merger/document-merger.service';
import { RenderEnginePdf } from './providers/render-engine/render-engines/render-engine-pdf.service';
import { RenderEngineTxt } from './providers/render-engine/render-engines/render-engine-txt.service';
import { DocxToPdfService } from './providers/toPdf/docx-to-pdf-service';





// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        WebviewDirective,
        ConfigComponent,
        ConfigSmtpComponent,
        ConfigSenderComponent,
        ConfigLogComponent,
        MailingComponent,
        MailingMailComponent,
        MailingMergeComponent,
        MailingExecuteComponent,
        DialogComponent,
        MailingExecuteProgressComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
        CKEditorModule,
        FlexLayoutModule,
        // Material
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatDialogModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatRadioModule,
        MatProgressSpinnerModule,
    ],
    providers: [
        ElectronService,
        LogService,
        MailSenderService,
        MailerEngineService,
        ConfigService,
        DocumentMergerService,
        FileService,
        DocumentService,
        DialogService,
        DocxToPdfService,
        MessageHubService,
        // Data loaders
        DataLoaderService,
        ExcelDataLoader,
        // Mergers
        DocumentMergerTxt,
        DocumentMergerWord,
        // Renderers
        RenderEngineTxt,
        RenderEnginePdf,
    ],
    entryComponents: [
        DialogComponent,
        MailingExecuteProgressComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
