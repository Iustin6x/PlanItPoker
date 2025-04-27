import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should add Authorization header for non-excluded routes', () => {
    spyOn(authService, 'getToken').and.returnValue('valid-token');
    spyOn(authService, 'isTokenExpired').and.returnValue(false);

    httpClient.get('/api/protected').subscribe();

    const req = httpTestingController.expectOne('/api/protected');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer valid-token');
  });

  it('should not add Authorization header for excluded routes', () => {
    httpClient.get('/login').subscribe();

    const req = httpTestingController.expectOne('/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('should handle expired token by redirecting to login', () => {
    spyOn(authService, 'getToken').and.returnValue('expired-token');
    spyOn(authService, 'isTokenExpired').and.returnValue(true);
    const logoutSpy = spyOn(authService, 'logout');
    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

    httpClient.get('/api/protected').subscribe({
      error: () => {
        expect(logoutSpy).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledWith(['/login']);
      }
    });

    httpTestingController.expectOne('/api/protected').flush(null, { status: 401, statusText: 'Unauthorized' });
  });
});