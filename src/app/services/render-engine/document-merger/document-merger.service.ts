/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { DocumentModel } from '../../../complexes/documents/documentModel';
import { DocumentMerger } from './document-merger';
import { RenderEngine } from '../render-engines/render-engine';
import { DocumentMergerTxt } from './document-merger-txt';
import { MIMETYPE_TXT, MIMETYPE_DOCX } from '../../../misc/const';
import { DocumentMergerWord } from './document-merger-word';

/**
 * Service that is able to merge data with a document template.
 * @export
 * @class DocumentMergerService
 */
@Injectable({
    providedIn: 'root'
})
export class DocumentMergerService {

    constructor(
        private _mergerTxt: DocumentMergerTxt,
        private _mergerWord: DocumentMergerWord,
    ) { }

    /**
     * Merge a template document with some data and render it to
     * specified renderingType.
     * @param {*} data Date source  for merging.
     * @param {DocumentModel} template Template document to merge.
     * @param {string} renderingType Final type of rendered document.
     * @returns {DocumentModel} Merged and rendered document.
     * @memberof DocumentMergerService
     */
    mergeAndRender(data: any, template: DocumentModel, renderingType: string): DocumentModel {
        // // Get merger by mime type
        const merger = this.getDocumentMerger(template.mimeType);
        const document = merger.merge(data, template);
        // // // Get renderEngine according renderingType
        // const renderer: RenderEngine = getRenderEngine(renderingType);
        // return renderer.render(document);
        return null;
    }

    /**
     * Gets the merger that is able to merge some data with
     * the specified mimeType template document.
     * @protected
     * @param {string} mimeType Type of template document.
     * @returns {DocumentMerger} Merger engine for the specified mimeType.
     * @memberof DocumentMergerService
     */
    protected getDocumentMerger(mimeType: string): DocumentMerger {
        switch (mimeType) {
            case MIMETYPE_TXT:
                return this._mergerTxt;
            case MIMETYPE_DOCX:
                return this._mergerWord;
            default:
                throw new Error(`No merger found for mime type '${mimeType}'`);
        }
    }

    /**
     * Gets the render engine that is able to render a document
     * to the specified mimeType document.
     * @protected
     * @param {string} mimeType
     * @returns {RenderEngine}
     * @memberof DocumentMergerService
     */
    protected getRenderEngine(mimeType: string): RenderEngine {
        return null;
    }

}
