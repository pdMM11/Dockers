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

  send(method: string, sequence_text: string, window_size= 15, gap = 1) {
    /**
     POST request to retrieve the ML prediction of the likelihood of all subpeptides of size "window_size"
     apart from each other by "gap" positions of a sequence "sequence_text" to be fusion peptides,
     using the selected ML model.
     */
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.get<any>(`${this.API_URL}/ml_predict/?sequence=` + sequence_text
      + '&window_size=' + window_size +  '&gap=' + gap + '&model=' + method) ; // , this.httpOptions);
  }
  writeFile(text: object): Observable<any> {
    /**
     POST request to save all the data from a ML prediction. ONLY WORKS LOCALLY.
     */
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.httpClient.post<any>(`${this.API_URL}/save_ml_results/`, text, this.httpOptions);
  }
  getWeblogo(seq: string, window_size: number = 15, family = 'Retroviridae') {
    /**
     POST request to retrieve the conservation features for a sequence "seq",
     split into subsequences of size "window_size" against a Weblogo with VFP from the same Taxonomy "family".
     */
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.data = {};
    this.data.seq = seq;
    this.data.window_size = window_size;
    this.data.family = family;
    return this.httpClient.post<any>(`${this.API_URL}/conserv/`, this.data, this.httpOptions);
  }
  getTaskIDRedis(method: string, sequence_text: string, window_size= 15, gap = 1) {
  /**
   GET request to retrieve the task ID for the Async Function to obtain the ML prediction.
   Inputs: a sequence "seq", split into subsequences of size "window_size"
   against a Weblogo with VFP from the same Taxonomy "family".
   */
    return this.httpClient.get<any>(`${this.API_URL}/ml_predict_redis/?sequence=` + sequence_text
      + '&window_size=' + window_size +  '&gap=' + gap + '&model=' + method) ; // , this.httpOptions);
  }
  getRedisResult(task_id: string) {
    /**
     GET request to retrieve result from the last request to the Asyns Tool: input the task ID.
     */
    return this.httpClient.get<any>(`${this.API_URL}/get_status/?task_id=` + task_id);
    // , this.httpOptions);
  }
}

