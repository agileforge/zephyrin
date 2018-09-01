import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CKEditorModule } from 'ng2-ckeditor';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ElectronService } from './providers/electron.service';
import { WebviewDirective } from './directives/webview.directive';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LogService } from './providers/log-service';
import { MailSenderService } from './providers/mail-sender/mail-sender.service';
import { MailerEngineService } from './providers/mailer-engine/mailer-engine.service';
import { ConfigService } from './providers/config/config.service';
import { DocumentMergerService } from './providers/render-engine/document-merger/document-merger.service';
import { FileService } from './providers/file/file.service';
import { DocumentMergerTxt } from './providers/render-engine/document-merger/document-merger-txt';
import { DocumentMergerWord } from './providers/render-engine/document-merger/document-merger-word';
import { RenderEngineTxt } from './providers/render-engine/render-engines/render-engine-txt.service';
import { RenderEnginePdf } from './providers/render-engine/render-engines/render-engine-pdf.service';
import { DataLoaderService } from './providers/data-loader/data-loader.service';
import { DocumentService } from './providers/document/document.service';
import { ExcelDataLoader } from './providers/data-loader/excel-data-loader';
import { ConfigComponent } from './components/config/config.component';
import { ConfigSmtpComponent } from './components/config/config-smtp/config-smtp.component';
import { ConfigSenderComponent } from './components/config/config-sender/config-sender.component';
import { ConfigLogComponent } from './components/config/config-log/config-log.component';
import { MailingComponent } from './components/mailing/mailing.component';
import { MailingMailComponent } from './components/mailing/mailing-mail/mailing-mail.component';
import { MailingMergeComponent } from './components/mailing/mailing-merge/mailing-merge.component';
import { MailingExecuteComponent } from './components/mailing/mailing-execute/mailing-execute.component';

// Material
import { MatButtonModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatRadioModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material';


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
        MailingExecuteComponent
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
    bootstrap: [AppComponent]
})
export class AppModule { }
