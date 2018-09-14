/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { inject, TestBed } from '@angular/core/testing';
import { MessageHubService } from './message-hub.service';


describe('MessageHubService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MessageHubService]
        });
    });

    it('should be created', inject([MessageHubService], (service: MessageHubService) => {
        expect(service).toBeTruthy();
    }));
});
