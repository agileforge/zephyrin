import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
import { ExcelDataLoader } from './providers/data-loader/excel-data-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        WebviewDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        }),
    ],
    providers: [
        ElectronService,
        LogService,
        MailSenderService,
        MailerEngineService,
        ConfigService,
        DocumentMergerService,
        FileService,
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
