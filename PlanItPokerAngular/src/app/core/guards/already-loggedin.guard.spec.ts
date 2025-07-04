import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { alreadyLoggedInGuard } from './already-loggedin.guard';

describe('alreadyLoggedinGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => alreadyLoggedInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
