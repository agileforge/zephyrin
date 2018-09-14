/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DialogButton } from '../../enums/dialog-button.enum';
import { DialogResponse } from '../../enums/dialog-response.enum';

@Injectable()
export class DialogService {

    constructor(private _dialog: MatDialog) {
    }

    confirm(title: string, message: string, warn: string = null, options?: MatDialogConfig): Observable<DialogResponse> {
        return this.custom(title, message, warn, DialogButton.BtnYesNo, options);
    }

    info(title: string, message: string, warn: string = null, options?: MatDialogConfig): Observable<DialogResponse> {
        return this.custom(title, message, warn, DialogButton.BtnOk, options);
    }

    custom(
        title: string,
        message: string,
        warn: string,
        buttons: DialogButton,
        options?: MatDialogConfig): Observable<DialogResponse> {

        return this.dialog(DialogComponent, r => {
            r.componentInstance.title = title;
            r.componentInstance.message = message;
            r.componentInstance.warn = warn;
            r.componentInstance.buttons = buttons;
        }, options);
    }

    dialog<TDialogComponent>(
        component: ComponentType<TDialogComponent>,
        initAction: (dialogRef: MatDialogRef<TDialogComponent>) => void = null,
        options?: MatDialogConfig): Observable<any> {

        let dialogRef: MatDialogRef<TDialogComponent>;
        dialogRef = this._dialog.open(component, options);
        dialogRef.disableClose = true;
        if (initAction != null) { initAction(dialogRef); }
        return dialogRef.afterClosed();
    }

}
