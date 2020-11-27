import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {not} from 'rxjs/internal-compatibility';
import {HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnvService} from './env.service';

@Injectable({
  providedIn: 'root',
})
export class ProteinService {
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

  getFirstPage(tax: boolean = false, idtaxonomy = 1) { // page= 1
    // return this.httpClient.get(`${this.API_URL}/protein?page=` + String(page));
    if (tax === false) {
      return this.httpClient.get(`${this.API_URL}/protein/`);
    }
    // tslint:disable-next-line:one-line
    else {
      return this.httpClient.get(`${this.API_URL}/protein/?idtaxonomy=` + String(idtaxonomy));
    }
  }

  getPage(numpage: number = 1, search: string = '', search_term = '', ID = '1') { // page= 1
    // return this.httpClient.get(`${this.API_URL}/protein?page=` + String(page));
    if (search === '') {
      return this.httpClient.get(`${this.API_URL}/protein/?page=` + String(numpage) + '&search='
        + String(search_term));
    }
    // tslint:disable-next-line:one-line
    else if (search === 'Prot') {
      return this.httpClient.get(`${this.API_URL}/protein/?idprotein=` + String(ID));
    }
    // tslint:disable-next-line:one-line
    else if (search === 'Tax') {
      return this.httpClient.get(`${this.API_URL}/protein/?idtaxonomy=` + String(ID));
    }
  }

  add(data): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/protein/`,
      data);
  }

  put(data, id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.API_URL}/protein/` + id + '/',
      data);
  }

  receive_all(search: string, idprot: string, idtax: string) {
    return this.httpClient.get(`${this.API_URL}/protein/save/?search=` + search
      + '&idprotein=' + idprot + '&idtaxonomy=' + idtax);
  }

  send(data: object) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<any>(`${this.API_URL}/save_protein_results/`,
      data, this.httpOptions);
  }
}
