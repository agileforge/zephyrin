/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentModel } from '../../document/documentModel';

@Injectable({
    providedIn: 'root'
})
export abstract class RenderEngine {

    constructor() { }

    /**
     * Render the document to another type of document.
     * @param {DocumentModel} document Document to render.
     * @returns {DocumentModel} The rendered document.
     * @memberof RenderEngine
     */
    abstract render(document: DocumentModel): Observable<DocumentModel>;

}
