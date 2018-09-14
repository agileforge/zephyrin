/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export enum DialogButton {
    BtnOk = 1,
    BtnYes = 2,
    BtnNo = 4,
    BtnCancel = 8,
    BtnSave = 16,
    BtnYesNo = BtnYes + BtnNo,
    BtnYesNoCancel = BtnYes + BtnNo + BtnCancel,
    BtnOkCancel = BtnOk + BtnCancel,
    BtnSaveCancel = BtnSave + BtnCancel
}
