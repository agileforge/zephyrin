/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { RenderEngine } from './render-engine';
import { DocumentModel } from '../../../complexes/documents/documentModel';

/**
 * Provide an engine that is able to render a document to a PDF document.
 * @export
 * @class RenderEngineTxt
 * @extends {RenderEngine}
 */
@Injectable({
    providedIn: 'root'
})
export class RenderEnginePdf extends RenderEngine {

    /**
     *Creates an instance of RenderEnginePdf.
     * @memberof RenderEnginePdf
     */
    constructor() {
        super();
    }

    /**
     * Render the document to a PDF document if possible.
     * @param {DocumentModel} document Document to render.
     * @returns {DocumentModel} The rendered PDF document.
     * @memberof RenderEngine
     */
    render(document: DocumentModel): DocumentModel {
        throw new Error('Method not implemented.');
    }

}
