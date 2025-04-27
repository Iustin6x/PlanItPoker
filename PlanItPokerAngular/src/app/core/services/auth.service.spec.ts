import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: '/' });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(service as any, 'decodeToken').and.returnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('registers a user', () => {
    const dummyRequest = { username: 'test', password: 'pass' };

    service.register(dummyRequest).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyRequest);
    req.flush({});
  });

  it('login and set token',()=>{
    const loginData = { username: 'test', password: 'pass'};
    const mockToken = 'mock.jwt.token';

    service.login(loginData).subscribe(res => {
      expect(res.jwt).toEqual(mockToken);
      expect(localStorage.getItem('jwt')).toBe(mockToken);
    });
  
    const req = httpMock.expectOne('http://localhost:8080/login');
    expect(req.request.method).toBe('POST');
    req.flush({ jwt: mockToken });
  });

  it('quickplay and set token',()=>{
    const mockName = 'tester';
    const mockToken = 'mock.jwt.token';

    service.quickplay(mockName).subscribe(res => {
      expect(res.jwt).toEqual(mockToken);
      expect(localStorage.getItem('jwt')).toBe(mockToken);
    });
  
    const req = httpMock.expectOne('http://localhost:8080/quickplay');
    expect(req.request.method).toBe('POST');
    req.flush({ jwt: mockToken });
  });

  it('should set and get returnUrl', () => {
    service.setReturnUrl('/profile');
    expect(service.returnUrl()).toBe('/profile');
  });
  
  it('should logout and clear jwt', () => {
    localStorage.setItem('jwt', 'mock.token');
    service.logout();
    expect(localStorage.getItem('jwt')).toBeNull();
    expect(service.getToken()).toBeNull();
  });

  it('should return true if token is expired', () => {
    const expiredToken = generateFakeToken(Date.now() / 1000 - 10); // Expirat cu 10 secunde în urmă
    expect(service.isTokenExpired(expiredToken)).toBeTrue();
  });
  
  it('returns false if token is valid', () => {
    const validToken = generateFakeToken(Date.now() / 1000 + 3600); 
    expect(service.isTokenExpired(validToken)).toBeFalse();
  });

  // it('auto logout after token expiration', (done) => {
  //   const validToken = generateFakeToken(Date.now() / 1000 + 1);
  
  //   localStorage.setItem('jwt', validToken);
  //   service = TestBed.inject(AuthService);
  
  //   setTimeout(() => {
  //     expect(localStorage.getItem('jwt')).toBeNull();
  //     expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  //     done();
  //   }, 1500); 
  // });
  
  function generateFakeToken(exp: number): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp }));
    return `${header}.${payload}.signature`;
  }


});
