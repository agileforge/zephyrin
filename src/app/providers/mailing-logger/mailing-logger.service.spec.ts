/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { MailingLoggerService } from './mailing-logger.service';

describe('MailingLoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailingLoggerService]
    });
  });

  it('should be created', inject([MailingLoggerService], (service: MailingLoggerService) => {
    expect(service).toBeTruthy();
  }));
});
