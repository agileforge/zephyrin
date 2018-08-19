import { TestBed, inject } from '@angular/core/testing';

import { MailerEngineServiceService } from './mailer-engine-service.service';

describe('MailerEngineServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailerEngineServiceService]
    });
  });

  it('should be created', inject([MailerEngineServiceService], (service: MailerEngineServiceService) => {
    expect(service).toBeTruthy();
  }));
});
