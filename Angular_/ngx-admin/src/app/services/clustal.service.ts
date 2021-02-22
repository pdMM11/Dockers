import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnvService} from './env.service';

export interface DataSeqs {
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
  data: DataSeqs;
  res: any;

  constructor(private httpClient: HttpClient,
              private env: EnvService) {
    this.API_URL = env.apiUrl;
  }

  send(url: string) {
    /**
     GET Request to get Clustal Omega Alignment from EBI API.
     */
    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin' : '*',
      }),
    };
    return this.httpClient.get(url, this.httpOptions );
  }
  clustalBackend(seqsSend: string, output: string) { // : Observable<Blob>
    /**
     POST Request to get Clustal Omega Alignment from backend's Clustal Console (clustal_all view).
     */
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.data = {};
    this.data.seqs = seqsSend;
    this.data.type = output;
    return this.httpClient.post(`${this.API_URL}/clustal_all/`, this.data , this.httpOptions);
  }
  clustalTreeBackend() { // : Observable<Blob>
    /**
     GET Request to get guide tree of the last alignment from backend's (clustal_tree view).
     */
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text/plain',
    };
    return this.httpClient.get(`${this.API_URL}/clustal_tree/`, this.httpOptions);
  }

}
