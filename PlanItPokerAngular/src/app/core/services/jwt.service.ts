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

  login(loginRequest: any): Observable<{ jwt: string }> {
    return this.http.post<{ jwt: string }>(BASE_URL + 'login', loginRequest)
  }

  hello(): Observable<any> {
    return this.http.get(BASE_URL + 'api/hello', {
      headers: this.createAuhtorizationHeader()
    })
  }

  private createAuhtorizationHeader() {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      console.log("JWT token found in local storage", jwtToken);
      return new HttpHeaders().set(
        "Authorization", "Bearer " + jwtToken
      )
    } else {
      console.log("JWT token not found in local storage");
    }
    return undefined;
  }

}
