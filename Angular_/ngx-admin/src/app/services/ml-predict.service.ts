import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EnvService} from './env.service';


@Injectable({
  providedIn: 'root',
})
export class MlPredictService {
  API_URL = '';
  httpOptions = {};
  result: any;
  data: any;

  constructor(private httpClient: HttpClient,
              private env: EnvService) {
    this.API_URL = env.apiUrl;
    // `${this.API_URL}/peptidereferences/?idpeptide=`
  }

  send(method: string, sequence_text: string, window_size= 15, gap = 1, model = 'svm') {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.get<any>(`${this.API_URL}/ml_predict/?sequence=` + sequence_text
      + '&window_size=' + window_size +  '&gap=' + gap + '&model=' + model) ; // , this.httpOptions);
  }
  writeFile(text: object): Observable<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<any>(`${this.API_URL}/save_ml_results/`, text, this.httpOptions);
  }
}
