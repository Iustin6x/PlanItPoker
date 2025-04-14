import { TestBed } from '@angular/core/testing';

import { VoteStateService } from './vote-state.service';

describe('VoteStateService', () => {
  let service: VoteStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoteStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
