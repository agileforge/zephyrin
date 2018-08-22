/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { RenderEngine } from '../render-engine-pdf/render-engine';
import { Document } from "../../../complexes/documents/document";

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

    mergeAndRender(data: any, template: Document, renderingType: string): Document {
        // // Get renderEngine according renderingType
        // const renderer: RenderEngine = getRenderEngine(renderingType);
        // // Launch rendering
        // return renderer.render(data, template);
        throw new Error();
    }
}
