/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DocumentModel } from '../../document/documentModel';
import { RenderEngine } from './render-engine';

/**
 * Provide an engine that is able to render a document to a text document.
 * @export
 * @class RenderEngineTxt
 * @extends {RenderEngine}
 */
@Injectable({
    providedIn: 'root'
})
export class RenderEngineTxt extends RenderEngine {

    /**
     *Creates an instance of RenderEngineTxt.
     * @memberof RenderEngineTxt
     */
    constructor() {
        super();
    }

    /**
     * Render the document to a text document (TXT) if possible.
     * This render a bit stupid, but has been mainly done for testing
     * @param {DocumentModel} document Document to render.
     * @returns {DocumentModel} The rendered text (TXT) document.
     * @memberof RenderEngine
     */
    render(document: DocumentModel): Observable<DocumentModel> {
        return of(document);
    }

}
