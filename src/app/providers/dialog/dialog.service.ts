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

    /**
     * Show a confirm dialog with a title, a message, eventually
     * a warning message and yes/no buttons.
     * @param title The title of dialog.
     * @param message The message to user.
     * @param warn The warning message to user.
     * @param options Miscellaneous options for dialog.
     */
    confirm(title: string, message: string, warn: string = null, options?: MatDialogConfig): Observable<DialogResponse> {
        return this.custom(title, message, warn, DialogButton.BtnYesNo, options);
    }

    /**
     * Show an info dialog with a title, a message, eventually
     * a warning message and an OK button.
     * @param title The title of dialog.
     * @param message The message to user.
     * @param warn The warning message to user.
     * @param options Miscellaneous options for dialog.
     */
    info(title: string, message: string, warn: string = null, options?: MatDialogConfig): Observable<DialogResponse> {
        return this.custom(title, message, warn, DialogButton.BtnOk, options);
    }

    /**
     * Show a dialog with a title, a message, eventually
     * a warning message and some button(s).
     * @param title The title of dialog.
     * @param message The message to user.
     * @param warn The warning message to user.
     * @param buttons Buttons to show.
     * @param options Miscellaneous options for dialog.
     */
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

    /**
     * Show a custom dialog.
     * @param component The component that is embedded inside the dialog.
     * @param initAction A delegate action executed. It can be used to initialize dialog.
     * @param options Miscellaneous options for dialog.
     */
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
