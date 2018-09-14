/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { inject, TestBed } from '@angular/core/testing';
import { DateProviderService } from './date-provider.service';


describe('DateProviderService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DateProviderService]
        });
    });

    it('should be created', inject([DateProviderService], (service: DateProviderService) => {
        expect(service).toBeTruthy();
    }));
});
