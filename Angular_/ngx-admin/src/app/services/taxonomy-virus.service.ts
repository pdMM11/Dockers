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
    /**
     Connection to the Taxonomy Virus' backend views.
     */
  }

  getPage(numpage: number = 1, search = '', taxonomy: boolean = false, idtax = '1') {
    /**
     GET request to retrieve Table data for the Taxonomy Virus (TV) page;
     - numpage: Page Number;
     - search: Type of search ('': directly from TV page;
                              else: search related the the search term and page number)
     - search_term: Search Term
     - idsearch: Foreign key (if search is 'Prot' or 'Tax')
     */
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
    /**
     POST request to add a Taxonomy Virus data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/taxonomyvirus/`,
      data);
  }

  put(data, id: number): Observable<any> {
    /**
     PUT request to update a Taxonomy Virus data entry.
     */
    return this.httpClient.put<any>(`${this.API_URL}/taxonomyvirus/` + id + '/',
      data);
  }

  receive_all(search: string, idtax: string) {
    /**
     GET request to get all the data from a specific query.
     */
    return this.httpClient.get(`${this.API_URL}/taxonomyvirus/save/?search=` + search + '&idtaxonomy=' + idtax);
  }

  send(data: object) {
    /**
     POST request to save all the data from a specific query. ONLY WORKS LOCALLY.
     */
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<any>(`${this.API_URL}/save_taxonomy_results/`, data, this.httpOptions);
  }
}
