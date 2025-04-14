import { TestBed } from '@angular/core/testing';

import { RoomMessageHandlerService } from './room-message-handler.service';

describe('RoomMessageHandlerService', () => {
  let service: RoomMessageHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomMessageHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
