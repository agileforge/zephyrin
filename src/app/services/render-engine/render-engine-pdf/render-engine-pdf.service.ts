import { Injectable } from '@angular/core';
import { RenderEngine } from './render-engine';
import { DocumentMergerService } from '../document-merger/document-merger.service';

@Injectable({
    providedIn: 'root'
})
export class RenderEnginePdf extends RenderEngine {

    constructor() {
        super(_documentMerger);
    }
}
