import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

    @Output() close = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

}
