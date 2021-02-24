import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {EnvService} from './env.service';
import {Observable} from 'rxjs';

export interface DataSeqs {
  seqs?: string;
  output?: string;
  line_size?: number;
  colour?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WeblogoService {
  API_URL = '';
  httpOptions = {};
  data: DataSeqs = {};

  constructor(private httpClient: HttpClient,
              private env: EnvService) {
    this.API_URL = env.apiUrl;
  }

  send(seqsSend: string) {
    /**
     POST request to perform multiple alignment of the sequences to later send to the
     http://weblogo.threeplusone.com/create.cgi.
     */
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.data.seqs = seqsSend;
    return this.httpClient.post<any>(`${this.API_URL}/weblogoclustal/`, this.data, this.httpOptions);
  }
  getImage(seqsSend: string, output: string, stack_line: number, colour: string) { // : Observable<Blob>
    /**
     POST request to build Weblogos in the backend, using the sequences defined in "seqsSend"; the output will be
     either "png", which will retrieve a base-64 string of the generated image, or "txt" for the text output.
     */
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text/plain',
    };
    this.data.seqs = seqsSend;
    this.data.output = output;
    this.data.colour = colour;
    this.data.line_size = stack_line;
    // return this.httpClient.post<Blob>(`${this.API_URL}/weblogobackend/`, this.data , this.httpOptions);
    return this.httpClient.post(`${this.API_URL}/weblogobackend/`, this.data , this.httpOptions);
  }
}
