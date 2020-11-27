import {Component, OnInit} from '@angular/core';
import {MlPredictService} from '../../../services/ml-predict.service';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

export interface MlInterface {
  'index': number;
  'pos_0': number;
  'pos_-1': number;
  'probability': number;
  'scale_probability': number;
  'sequence': string;
}

interface PosInterface {
  no?: number;
  carat?: string;
  prob?: number;
  color?: string;
}

@Component({
  selector: 'ngx-ml-predict',
  templateUrl: './ml-predict.component.html',
  styleUrls: ['./ml-predict.component.scss'],
})
export class MlPredictComponent implements OnInit {
  query_seq = '';
  sequence = new FormControl('');
  window_size = new FormControl(15);
  gap_size = new FormControl(1);
  results: MlInterface[] = [];
  option_model = 'svm';
  pos_prob: PosInterface[] = [];
  table_bool: boolean = false;

  fileUrl;
  data_print;

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      'pos_0': {
        title: 'Initial Position',
        type: 'string',
      },
      'pos_-1': {
        title: 'Final Position',
        type: 'string',
      },
      'probability': {
        title: 'Probability',
        type: 'number',
      },
      'scale_probability': {
        title: 'Scale Probability',
        type: 'number',
      },
      'sequence': {
        title: 'Sequence',
        type: 'string',
      },
    },
  };

  constructor(private route: ActivatedRoute,
              private MLService: MlPredictService,
              private sanitizer: DomSanitizer,) {
  }

  ngOnInit() {
    this.query_seq = this.route.snapshot.queryParamMap.get('sequence').split('\n')[1];
  }

  gotoML() {
    this.results = [];
    this.pos_prob = [];
    if (this.sequence.value !== null && this.sequence.value !== '') {
      this.MLService.send(this.option_model, this.sequence.value,
        this.window_size.value, this.gap_size.value).subscribe(
        (data) => {
          // alert(data);
          const data_parse = JSON.parse(data);
          this.results = data_parse['data'];
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    } else if (this.query_seq !== null && this.query_seq !== '') {
      this.MLService.send(this.option_model, this.query_seq,
        this.window_size.value, this.gap_size.value).subscribe(
        (data) => {
          // alert(data);
          const data_parse = JSON.parse(data);
          this.results = data_parse['data'];
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    } else {
      alert('ERROR: SEQUENCE NEEDS TO BE FILLED');
    }
    this.writeFile();

    const blob = new Blob([this.data_print], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  seqColor() {
    let sequence = '';
    if (this.query_seq !== null && this.query_seq !== '') {
      sequence = this.query_seq;
    } else if (this.sequence.value !== null && this.sequence.value !== '') {
      sequence = this.sequence.value;
    }
    if (sequence !== '') {
      this.pos_prob = [];
      // const max_value = Math.max.apply(Math, this.results.map(function(o) { return o['pos_-1']; }));
      const max_value = sequence.length - 1;
      const list = [];
      for (let i = 0; i <= max_value; i++) {
        list.push(i);
      }

      for (const i of list) {
        const aux_array: PosInterface = {no: i};
        let best_prob = 0;
        for (const j of this.results) {
          if (i >= j.pos_0 && i <= j['pos_-1'] && best_prob < j.probability) {
            best_prob = j.probability;
          }
        }
        aux_array.carat = sequence[i];
        aux_array.prob = best_prob;
        if (aux_array.prob >= 0.99) {
          aux_array.color = 'red';
        } else if (aux_array.prob >= 0.95 && aux_array.prob < 0.99) {
          aux_array.color = 'orange';
        } else if (aux_array.prob >= 0.90 && aux_array.prob < 0.95) {
          aux_array.color = 'yellow';
        } else if (aux_array.prob >= 0.80 && aux_array.prob < 0.90) {
          aux_array.color = 'lightgreen';
        } else if (aux_array.prob >= 0.70 && aux_array.prob < 0.80) {
          aux_array.color = 'lightblue';
        } else if (aux_array.prob >= 0.60 && aux_array.prob < 0.70) {
          aux_array.color = 'lightgray';
        } else {
          aux_array.color = 'white';
        }
        this.pos_prob.push(aux_array);
      }
    }
    this.writeFile();

    const blob = new Blob([this.data_print], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  showTable() {
    if (this.table_bool) {
      this.table_bool = false;
    } else {
      this.table_bool = true;
    }
  }

  writeFile() {
    // const currentDate = new Date().toLocaleString();
    let text_file = 'Results Fusion Peptide Prediction\n\n'
      + 'Type of Model: ' + this.option_model + '\n'
      + 'Window Size: ' + this.window_size.value + '\n'
      + 'Gap Size: ' + this.gap_size.value + '\n'
      + 'Position\tAminoacid\tProbability\n';
    for (const i of this.pos_prob) {
      text_file = text_file + i.no + '\t' + i.carat + '\t' + i.prob + '\n';
    }
    

    this.data_print = text_file;


    /**
    const data = {data: text_file};
    this.MLService.writeFile(data).subscribe(
      (data_send) => {
        alert(data_send['response']);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      });
      */
  }
}
