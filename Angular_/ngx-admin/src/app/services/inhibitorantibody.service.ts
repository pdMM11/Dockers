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
    /**
     Connection to the Inhibitor & Antibody's backend views.
     */
    this.API_URL = this.env.apiUrl;
  }

  getFirstPage(idprotein = '2', search = '', page = 1) {
    /**
     GET request to retrieve Table data for the Inhibitor & Antibody page;
     - idprotein: Fusion Protein's PK;
     - search: Type of search ('': related Inhibitor & Antibody from a Fusion Protein data entry;
                              else: search related the the search term and page number)
     - page: Page Number;
     */
    if (search === '') {
      return this.httpClient.get(`${this.API_URL}/inhibitorantibody/?idprotein=` + String(idprotein)
        + '&page=' + String(page));
    } else {
      return this.httpClient.get(`${this.API_URL}/inhibitorantibody/?search=` + String(search)
        + '&page=' + String(page));
    }
  }

  add(data): Observable<any> {
    /**
     POST request to add a Inhibitor & Antibody data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/inhibitorantibody/`,
      data);
  }

  put(data, id: number): Observable<any> {
    /**
     PUT request to add a Inhibitor & Antibody data entry.
     */
    return this.httpClient.put<any>(`${this.API_URL}/inhibitorantibody/` + id + '/',
      data);
  }

  receive_all(search: string, idprot: string) {
    /**
     GET request to get all the data from a specific query.
     */
    return this.httpClient.get(`${this.API_URL}/inhibitorantibody/save/?search=` + search
      + '&idprotein=' + idprot);
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
    return this.httpClient.post<any>(`${this.API_URL}/save_inhibitorantibody_results/`, data, this.httpOptions);
  }
}
