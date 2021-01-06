import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {EnvService} from './env.service';

@Injectable({
  providedIn: 'root',
})
export class IedbService {
  httpOptions = {};
  result: any;
  data: any;
  API_URL = '';

  constructor(private httpClient: HttpClient,
              private env: EnvService) {
    this.API_URL = this.env.apiUrl;
  }

  send(method: string, sequence_text: string, window_size= 9) {
    /**
     GET request to the backend to retrieve an epitope prediction by sending an request to the IEDB API
     (http://tools-cluster-interface.iedb.org/tools_api/bcell/)
     */
    // this.data = { method: method, sequence_text: sequence_text, window_size: window_size};
    // const dataString = 'method=' + method + '&sequence_text=' +  sequence_text + '&window_size=' + window_size;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    /**
    this.httpClient.post(`https://www.iedb.org/result_v3.php`, this.httpOptions);
    return this.httpClient.post<any>('http://tools-cluster-interface.iedb.org/tools_api/bcell/',
      this.data); // , this.httpOptions);
     */
    return this.httpClient.get<any>(`${this.API_URL}/iedb/?method=` + method + '&sequence_text='
      + sequence_text + '&window_size=' + window_size); // , this.httpOptions);
  }
}
