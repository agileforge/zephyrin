import { TestBed, inject } from '@angular/core/testing';

import { MailerEngineService } from './mailer-engine.service';

describe('MailerEngineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailerEngineService]
    });
  });

  it('should be created', inject([MailerEngineService], (service: MailerEngineService) => {
    expect(service).toBeTruthy();
  }));
});
