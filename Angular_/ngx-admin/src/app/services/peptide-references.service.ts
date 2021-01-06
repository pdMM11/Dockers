import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnvService} from './env.service';

@Injectable({
  providedIn: 'root',
})
export class PeptideReferencesService {
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
     Connection to the Fusion Peptide Reference's backend views.
     */
  }

  getFirstPage(idpeptide = '29', search = '', page = 1) {
    /**
     GET request to retrieve Table data for the Fusion Peptide Reference page;
     - idpeptide: Fusion Peptide's PK;
     - search: Type of search ('': related Reference from a Fusion Peptide data entry;
                              else: search related the the search term and page number)
     - page: Page Number;
     */
    if (search === '') {
      return this.httpClient.get(`${this.API_URL}/peptidereferences/?idpeptide=` + String(idpeptide));
    } else {
      return this.httpClient.get(`${this.API_URL}/peptidereferences/?search=` + String(search)
        + '&page=' + String(page));
    }
  }

  add(data): Observable<any> {
    /**
     POST request to add a Fusion Peptide's Reference data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/peptidereferences/`,
      data);
  }

  put(data, id: number): Observable<any> {
    /**
     PUT request to update a Fusion Peptide's Reference data entry.
     */
    return this.httpClient.put<any>(`${this.API_URL}/peptidereferences/` + id + '/',
      data);
  }

  addRef(data): Observable<any> {
    /**
     POST request to add a Reference data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/references/`,
      data);
  }

  putRef(data, id: number): Observable<any> {
    /**
     PUT request to update a Reference data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/references/` + id + '/',
      data);
  }

  receive_all(search: string, idpept: string) {
    /**
     GET request to get all the data from a specific query.
     */
    return this.httpClient.get(`${this.API_URL}/peptidereferences/save/?search=` + search
      + '&idpeptide=' + idpept);
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
    return this.httpClient.post<any>(`${this.API_URL}/save_peptidereferences_results/`, data, this.httpOptions);
  }
}
