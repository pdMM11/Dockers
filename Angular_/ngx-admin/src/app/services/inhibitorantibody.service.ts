import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnvService} from './env.service';

@Injectable({
  providedIn: 'root',
})
export class InhibitorantibodyService {
  API_URL = '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      // 'Authorization': 'my-auth-token'
    }),
  };

  constructor(private httpClient: HttpClient,
              private env: EnvService) {
    this.API_URL = this.env.apiUrl;
  }

  getFirstPage(idprotein = '2', search = '', page = 1) {
    if (search === '') {
      return this.httpClient.get(`${this.API_URL}/inhibitorantibody/?idprotein=` + String(idprotein)
        + '&page=' + String(page));
    } else {
      return this.httpClient.get(`${this.API_URL}/inhibitorantibody/?search=` + String(search)
        + '&page=' + String(page));
    }
  }

  add(data): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/inhibitorantibody/`,
      data);
  }

  put(data, id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.API_URL}/inhibitorantibody/` + id + '/',
      data);
  }

  receive_all(search: string, idprot: string) {
    return this.httpClient.get(`${this.API_URL}/inhibitorantibody/save/?search=` + search
      + '&idprotein=' + idprot);
  }

  send(data: object) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<any>(`${this.API_URL}/save_inhibitorantibody_results/`, data, this.httpOptions);
  }
}
