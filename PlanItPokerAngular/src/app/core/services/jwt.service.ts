import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const BASE_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  http = inject(HttpClient);
 

  register(signRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'signup', signRequest)
  }

  quickplay(name: string): Observable<{ jwt: string }> {
    return this.http.post<{ jwt: string }>(BASE_URL + 'quickplay', { name });
  }

  // login(loginRequest: any): Observable<{ jwt: string }> {
  //   return this.http.post<{ jwt: string }>(BASE_URL + 'login', loginRequest)
  // }

  login(loginRequest: any): Observable<{ jwt: string }> {
    return this.http.post<{ jwt: string }>(
      `${BASE_URL}login`, 
      loginRequest,
      { headers: new HttpHeaders({'Content-Type': 'application/json'}) }
    );
  }

}
