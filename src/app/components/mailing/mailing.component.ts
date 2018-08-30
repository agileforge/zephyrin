import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-mailing',
    templateUrl: './mailing.component.html',
    styleUrls: ['./mailing.component.scss']
})
export class MailingComponent implements OnInit {

    @Output() configClick = new EventEmitter<void>();

    constructor() { }

    ngOnInit() {
    }

}
