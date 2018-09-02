import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DialogButton } from '../../enums/dialog-button.enum';
import { DialogResponse } from '../../enums/dialog-response.enum';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    title: string;
    message: string;
    warn: string;
    buttons: DialogButton;

    // Make enum visible for template
    DialogButton: any = DialogButton;
    DialogResponse: any = DialogResponse;

    constructor(public dialogRef: MatDialogRef<DialogComponent>) {
    }

    ngOnInit() {
    }

    isButtonVisible(button: any) {
        // tslint:disable-next-line:no-bitwise
        return (this.buttons & button) === button;
    }

}
