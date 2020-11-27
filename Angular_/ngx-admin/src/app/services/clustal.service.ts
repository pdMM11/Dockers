import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnvService} from './env.service';

export interface dataseqs{
  seqs?: string;
  type?: string;
}


@Injectable({
  providedIn: 'root',
})
export class ClustalService {
  API_URL = '';
  httpOptions = {};
  result: any;
  data: dataseqs;
  res: any;

  constructor(private httpClient: HttpClient,
              private env: EnvService) {
    this.API_URL = env.apiUrl;
  }

  send(url: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin' : '*',
      }),
    };
    return this.httpClient.get(url, this.httpOptions );
  }
  clustalBackend(seqsSend: string, output: string) { // : Observable<Blob>
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text/plain',
    };
    this.data = {};
    this.data.seqs = seqsSend;
    this.data.type = output;
    return this.httpClient.post(`${this.API_URL}/clustal_all/`, this.data , this.httpOptions);
  }
  clustalTreeBackend() { // : Observable<Blob>
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text/plain',
    };
    return this.httpClient.get(`${this.API_URL}/clustal_tree/`, this.httpOptions);
  }

}
