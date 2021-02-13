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
    /**
     Connection to the Fusion Peptides' backend views.
     */
    this.API_URL = env.apiUrl;
  }

  getPage(numpage: number = 1, search: string = '', search_term = '', idsearch = '1') {
    /**
     GET request to retrieve Table data for the Fusion Peptide (FP) page;
     - numpage: Page Number;
     - search: Type of search ('': directly from FP page;
                              'Prot': related FP from a Fusion Protein data entry;
                              'Tax': related FP from a Virus' Taxonomy data entry)
     - search_term: Search Term
     - idsearch: Foreign key (if search is 'Prot' or 'Tax')
     */
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
    /**
     POST request to add a Fusion Peptide data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/fusionpeptides/`,
      data);
  }

  put(data, id: number) {
    /**
     PUT request to update a Fusion Peptide data entry.
     */
    return this.httpClient.put<any>(`${this.API_URL}/fusionpeptides/` + id + '/',
      data);
  }

  receive_all(search: string, idprot: string, idtax: string) {
    /**
     GET request to get all the data from a specific query.
     */
    return this.httpClient.get(`${this.API_URL}/fusionpeptides/save/?search=` + search
      + '&protein=' + idprot + '&protein__idtaxonomy=' + idtax);
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
    return this.httpClient.post<any>(`${this.API_URL}/save_fusionpeptides_results/`, data, this.httpOptions);
  }
  get_autocomplete(search: string) {
    /**
     GET request to retrieve 5 autocomplete sugestions for the search form.
     */
    return this.httpClient.get(`${this.API_URL}/fusionpeptides/autocomplete/?search=` + search);
  }
}
