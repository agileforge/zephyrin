/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { DocumentModel } from '../../../complexes/documents/documentModel';
// import { RenderedDocument } from '../../../complexes/documents/rendered-document';

/**
 * Service that is able to merge data with a document template.
 * @export
 * @class DocumentMergerService
 */
@Injectable({
    providedIn: 'root'
})
export abstract class DocumentMerger {

    constructor() { }

    merge(data: any, template: DocumentModel): DocumentModel {
        // Get renderEngine according renderingType
        // const renderer: RenderEngine = getRenderEngine(renderingType);
        // Launch rendering
        // return renderer.render(data, template);
        throw new Error('Method not implemented.');
    }
}
