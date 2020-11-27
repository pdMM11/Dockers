import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';
import {EnvService} from './env.service';


@Injectable({
  providedIn: 'root',
})
export class TaxonomyVirusService {
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

  getPage(numpage: number = 1, search = '', taxonomy: boolean = false, idtax = '1') {
    if (taxonomy === false) {
      return this.httpClient.get(`${this.API_URL}/taxonomyvirus/?page=` + String(numpage) + '&search='
        + String(search));
    }
    // tslint:disable-next-line:one-line
    else {
      return this.httpClient.get(`${this.API_URL}/taxonomyvirus/?idtaxonomy=` + String(idtax));
    }
  }

  add(data): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/taxonomyvirus/`,
      data);
  }

  put(data, id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.API_URL}/taxonomyvirus/` + id + '/',
      data);
  }

  receive_all(search: string, idtax: string) {
    return this.httpClient.get(`${this.API_URL}/taxonomyvirus/save/?search=` + search + '&idtaxonomy=' + idtax);
  }

  send(data: object) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<any>(`${this.API_URL}/save_taxonomy_results/`, data, this.httpOptions);
  }
}
