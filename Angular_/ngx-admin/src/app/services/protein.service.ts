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
    /**
     Connection to the Fusion Protein' backend views.
     */
  }

  getFirstPage(tax: boolean = false, idtaxonomy = 1) { // page= 1
    // return this.httpClient.get(`${this.API_URL}/protein?page=` + String(page));
    /**
     NOT USED
     */
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
    /**
     GET request to retrieve Table data for the Fusion Protein (FP) page;
     - numpage: Page Number;
     - search: Type of search ('': directly from FP page;
          'Prot': related FP from a Fusion Peptide data entry;
          'Tax': related FP from a Virus' Taxonomy data entry)
     - search_term: Search Term
     - idsearch: Foreign key (if search is 'Prot' or 'Tax')
     */
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
    /**
     POST request to add a Fusion Protein data entry.
     */
    return this.httpClient.post<any>(`${this.API_URL}/protein/`,
      data);
  }

  put(data, id: number): Observable<any> {
    /**
     PUT request to update a Fusion Protein data entry.
     */
    return this.httpClient.put<any>(`${this.API_URL}/protein/` + id + '/',
      data);
  }

  receive_all(search: string, idprot: string, idtax: string) {
    /**
     GET request to get all the data from a specific query.
     */
    return this.httpClient.get(`${this.API_URL}/protein/save/?search=` + search
      + '&idprotein=' + idprot + '&idtaxonomy=' + idtax);
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
    return this.httpClient.post<any>(`${this.API_URL}/save_protein_results/`,
      data, this.httpOptions);
  }
  get_autocomplete(search: string) {
    /**
     GET request to retrieve 5 autocomplete sugestions for the search form.
     */
    return this.httpClient.get(`${this.API_URL}/protein/autocomplete/?search=` + search);
  }
}
