/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { DocumentModel } from '../../../complexes/documents/documentModel';

/**
 * Service that is able to merge data with a document template.
 * @export
 * @class DocumentMergerService
 */
@Injectable({
    providedIn: 'root'
})
export class DocumentMergerService {

    constructor() { }

    mergeAndRender(data: any, template: DocumentModel, renderingType: string): DocumentModel {
        // // Get merger by mime type
        // const merger = getMergerEngine(template.mimeType);
        // const document = merger.merge(data, template);
        // // // Get renderEngine according renderingType
        // const renderer: RenderEngine = getRenderEngine(renderingType);
        // return renderer.render(document);
        throw new Error();
    }
}
