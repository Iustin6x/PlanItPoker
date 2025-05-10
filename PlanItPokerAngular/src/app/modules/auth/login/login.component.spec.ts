import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  
  let authService: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>

  authService = jasmine.createSpyObj('AuthService',['login'],{
    returnUrl:() => '/'
  })

  routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl', 'navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        {provide: AuthService, useValue: authService},
        {provide: Router, useValue: routerSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login',()=>{
    component.email = "test@email.com";
    component.password = "123456";
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit',null);
    fixture.detectChanges();
    expect(authService.login).toHaveBeenCalledWith(({
      email: 'test@example.com',
      password: '123456'
    }));
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  })
});
