import { TestBed } from '@angular/core/testing';

import { WebSocketMessageService } from './web-socket-message.service';

describe('WebSocketMessageService', () => {
  let service: WebSocketMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
