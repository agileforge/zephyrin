import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MailSenderService } from './services/mail-sender/mail-sender.service';
import { MailerEngineService } from './services/mailer-engine/mailer-engine.service';

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
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
