/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Defines the row structure for mergeable data.
 * @export
 * @interface MergeableRowDataModel
 */
export interface MergeableRowDataModel {
    [fieldName: string]: string | number | boolean[];
}
