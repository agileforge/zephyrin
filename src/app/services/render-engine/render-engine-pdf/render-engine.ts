import { Injectable } from '@angular/core';
import { Document } from "../../../complexes/documents/document";
import { DocumentMergerService } from '../document-merger/document-merger.service';

@Injectable({
    providedIn: 'root'
})
export abstract class RenderEngine {

    constructor() { }

    render(data: any, template: Document): Document {
        // Get merger according template.mimeType
        // const merger: DocumentMerger;
        // return this._renderEngine.render(data, template);
        throw new Error();
    }

    protected abstract executeRendering(data: any, template: Document);
}
