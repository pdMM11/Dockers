import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';
import {EnvService} from './env.service';

@Injectable({
  providedIn: 'root',
})
export class FusionPeptideService {

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

  getPage(numpage: number = 1, search: string = '', search_term = '', idsearch = '1') {
    if (search === '') {
      return this.httpClient.get(`${this.API_URL}/fusionpeptides/?page=` + String(numpage) + '&search='
        + String(search_term));
    }
    // tslint:disable-next-line:one-line
    else if (search === 'Prot') {
      return this.httpClient.get(`${this.API_URL}/fusionpeptides/?protein=` + String(idsearch));
    }
    // tslint:disable-next-line:one-line
    else if (search === 'Tax') {
      return this.httpClient.get(`${this.API_URL}/fusionpeptides/?protein__idtaxonomy=` + String(idsearch));
    }
  }

  add(data): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/fusionpeptides/`,
      data);
  }

  put(data, id: number) {
    return this.httpClient.put<any>(`${this.API_URL}/fusionpeptides/` + id + '/',
      data);
  }

  receive_all(search: string, idprot: string, idtax: string) {
    return this.httpClient.get(`${this.API_URL}/fusionpeptides/save/?search=` + search
      + '&protein=' + idprot + '&protein__idtaxonomy=' + idtax);
  }

  send(data: object) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<any>(`${this.API_URL}/save_fusionpeptides_results/`, data, this.httpOptions);
  }

}
