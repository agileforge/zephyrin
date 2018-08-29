/*---------------------------------------------------------------------------------------------
 * Copyright (c) agileforge. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';
import { MailSenderService } from './mail-sender.service';
import { FileService } from '../file/file.service';
import { LogService } from '../log-service';
import { ElectronService } from '../electron.service';
import { ConfigService } from '../config/config.service';

describe('MailSenderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          MailSenderService,
          ConfigService,
          FileService,
          LogService,
          ElectronService,
        ]
    });
  });

  it('should be created', inject([MailSenderService], (service: MailSenderService) => {
    expect(service).toBeTruthy();
  }));
});
