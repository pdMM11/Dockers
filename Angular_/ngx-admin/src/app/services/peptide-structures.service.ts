import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class PeptideStructuresService {
  API_URL = '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      // 'Authorization': 'my-auth-token'
    }),
  };

  constructor(private httpClient: HttpClient,
              private env: EnvService) {
    this.API_URL = env.apiUrl;
  }

  getFirstPage(idpeptide = '4', search = '', page = 1) {
    if (search === '') {
      // return this.httpClient.get(`${this.API_URL}/peptidestructure/?idpeptide=` + String(idpeptide));
      return this.httpClient.get(`${this.API_URL}/peptidestructure/?idprotein=` + String(idpeptide));
    } else {
      return this.httpClient.get(`${this.API_URL}/peptidestructure/?search=` + String(search)
        + '&page=' + String(page));
    }
  }

  add(data): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/peptidestructure/`,
      data);
  }

  put(data, id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.API_URL}/peptidestructure/` + id + '/',
      data);
  }

  addStruct(data): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/structure/`,
      data);
  }

  putStruct(data, id: number): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/structure/` + id + '/',
      data);
  }

  receive_all(search: string, idpept: string) {
    return this.httpClient.get(`${this.API_URL}/peptidestructure/save/?search=` + search
      + '&idpeptide=' + idpept);
  }

  send(data: object) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<any>(`${this.API_URL}/save_peptidestructure_results/`, data, this.httpOptions);
  }
}
