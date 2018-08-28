/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { RenderEngine } from './render-engine';



describe('RenderEngineService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderEngine]
        });
    });

    it('should be created', inject([RenderEngine], (service: RenderEngine) => {
        expect(service).toBeTruthy();
    }));

});
