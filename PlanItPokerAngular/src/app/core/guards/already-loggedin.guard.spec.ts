import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { alreadyLoggedinGuard } from './already-loggedin.guard';

describe('alreadyLoggedinGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => alreadyLoggedinGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
