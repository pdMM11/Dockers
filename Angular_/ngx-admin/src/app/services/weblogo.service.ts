import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {EnvService} from './env.service';
import {Observable} from 'rxjs';

export interface dataseqs{
  seqs?: string;
  output?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WeblogoService {
  API_URL = '';
  httpOptions = {};
  data: dataseqs = {};

  constructor(private httpClient: HttpClient,
              private env: EnvService) {
    this.API_URL = env.apiUrl;
  }

  send(seqsSend: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.data.seqs = seqsSend;
    return this.httpClient.post<any>(`${this.API_URL}/weblogoclustal/`, this.data, this.httpOptions);
  }
  getImage(seqsSend: string, output: string) { // : Observable<Blob>
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text/plain',
    };
    this.data.seqs = seqsSend;
    this.data.output = output;
    // return this.httpClient.post<Blob>(`${this.API_URL}/weblogobackend/`, this.data , this.httpOptions);
    return this.httpClient.post(`${this.API_URL}/weblogobackend/`, this.data , this.httpOptions);
  }
}
