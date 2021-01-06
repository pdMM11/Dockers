import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class TaxHostService {
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
    /**
     Connection to the Tax Host's backend views.
     */
  }

  getFirstPage(idtaxonomy = '2', search = '', page = 1) {
    /**
     GET request to retrieve Table data for the Tax Host page;
     - idtaxonomy: Taxonomy Virus's PK;
     - search: Type of search ('': related Reference from a Taxonomy Virus data entry;
                              else: search related the the search term and page number)
     - page: Page Number;
     */
    if (search === '') {
      return this.httpClient.get(`${this.API_URL}/taxhost/?idtaxonomy=` + String(idtaxonomy));
    } else {
      return this.httpClient.get(`${this.API_URL}/taxhost/?search=` + String(search) + '&page=' + String(page));
    }
  }

  add(data): Observable<any> {
    /**
     POST request to add a Tax Host's data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/taxhost/`,
      data);
  }

  put(data, id: number): Observable<any> {
    /**
     PUT request to update a Tax Host's data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/taxhost/` + id + '/',
      data);
  }

  addHost(data): Observable<any> {
    /**
     POST request to add a Host's data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/host/`,
      data);
  }

  putHost(data, id: number): Observable<any> {
    /**
     PUT request to update a Host's data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/host/` + id + '/',
      data);
  }

  receive_all(search: string, idtax: string) {
    /**
     GET request to get all the data from a specific query.
     */
    return this.httpClient.get(`${this.API_URL}/taxhost/save/?search=` + search + '&idtaxonomy=' + idtax);
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
    return this.httpClient.post<any>(`${this.API_URL}/save_taxhost_results/`, data, this.httpOptions);
  }
}
