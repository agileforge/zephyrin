import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatSidenav } from '@angular/material';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    // @ViewChild('sidenav') sidenav: MatSidenav;

    // reason = '';

    constructor() { }

    ngOnInit() {
    }


    // close(reason: string) {
    //     this.reason = reason;
    //     this.sidenav.close();
    // }
}
