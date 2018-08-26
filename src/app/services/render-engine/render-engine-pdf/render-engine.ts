import { Injectable } from '@angular/core';
import { DocumentModel } from '../../../complexes/documents/documentModel';

@Injectable({
    providedIn: 'root'
})
export abstract class RenderEngine {

    constructor() { }

    render(data: any, template: DocumentModel): DocumentModel {
        // Get merger according template.mimeType
        // const merger: DocumentMerger;
        // return this._renderEngine.render(data, template);
        throw new Error();
    }

    // protected abstract executeRendering(data: any, template: Document): any;
}
