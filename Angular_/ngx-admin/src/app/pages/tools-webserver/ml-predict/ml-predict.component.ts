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

interface PosConservInterface {
  no?: number;
  carat?: string;
  Retroviridae?: number;
  Pneumoviridae?: number;
  Coronaviridae?: number;
  Paramyxoviridae?: number;
  Peribunyaviridae?: number;
  Togaviridae?: number;
  Flaviviridae?: number;
  Filoviridae?: number;
  Herpesviridae?: number;
  Orthomyxoviridae?: number;
  Arenaviridae?: number;
  Phenuiviridae?: number;
  Rhabdoviridae?: number;
  prob?: number;
  prob_correct?: number;
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
  window_size = new FormControl(20);
  gap_size = new FormControl(1);
  results: MlInterface[] = [];
  option_model = 'svm';
  pos_prob: PosInterface[] = [];
  table_bool: boolean = false;

  fileUrl;
  data_print;

  conserv_data = {};

  print_conserv: PosConservInterface[] = [];

  current_sequence: string;

  option_conserv = 'Retroviridae';

  conserv_card = false;
  name_family = '';
  taskID = '';
  asyncReturn = true;

  settings = {
    /**
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
     */
    actions: {
      add: false,
      edit: false,
      delete: false,
      hideSubHeader: true,
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
              private sanitizer: DomSanitizer,
              ) {
  }

  ngOnInit() {
    this.query_seq = this.route.snapshot.queryParamMap.get('sequence').split('\n')[1];
  }

  gotoML() {
    /**
     This function retrieves the probabilities of all possible peptides within the sequence to be a fusion peptide.
     */
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
    /**
     This function, from the probabilities of all possible peptides, gets the maximal score for each position,
     and attributes a color for each symbol. Also completes the link to download the results.
     */
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
    /**
     This function allow to show / hide the table of the ML results.
     */
    if (this.table_bool) {
      this.table_bool = false;
    } else {
      this.table_bool = true;
    }
  }

  writeFile() {
    /**
     This function writes the content to the ML results into the Download link.
     */
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
  getConserv() {
    /**
     This function gets all the conservation scores for each position of the sequence.
     */
    this.current_sequence = null;
    let sequence = '';
    if (this.sequence.value !== null && this.sequence.value !== '') {
      sequence = this.sequence.value;
    } else if (this.query_seq !== null && this.query_seq !== '') {
      sequence = this.query_seq;
    }
    if (sequence !== '') {
      this.MLService.getWeblogo(sequence, this.window_size.value, this.option_conserv).subscribe(
        (data_send) => {
          // const data_parse = JSON.parse(data_send);
          // alert(data_parse);
          // this.save_data(data_parse['data']);
          this.save_data(data_send);
          this.current_sequence = sequence;
          this.graphConserv();
          this.conserv_card = true;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          this.save_data({});
          this.conserv_card = false;
        });
      // this.current_sequence = sequence;
      // alert(JSON.stringify(this.conserv_data));
    } else {
      alert('ERROR: SEQUENCE NEEDS TO BE FILLED');
    }
  }
  save_data(data_send) {
    this.conserv_data = data_send;
  }
  graphConserv(new_seq: boolean = true) {
    /**
     This function attributes an color for each position of the sequence, regarding conservation score of
     the selected selected family.
     */
    if (new_seq) {
      this.print_conserv = [];
      for (let i = 0; i < this.current_sequence.length; i++) {
        const aux_array: PosConservInterface = {no: i, carat: this.current_sequence[i]};
        aux_array.Retroviridae = this.conserv_data[String(i)]['Retroviridae'];
        aux_array.Pneumoviridae = this.conserv_data[String(i)]['Pneumoviridae'];
        aux_array.Coronaviridae = this.conserv_data[String(i)]['Coronaviridae'];
        aux_array.Paramyxoviridae = this.conserv_data[String(i)]['Paramyxoviridae'];
        aux_array.Peribunyaviridae = this.conserv_data[String(i)]['Peribunyaviridae'];
        aux_array.Togaviridae = this.conserv_data[String(i)]['Togaviridae'];
        aux_array.Flaviviridae = this.conserv_data[String(i)]['Flaviviridae'];
        aux_array.Filoviridae = this.conserv_data[String(i)]['Filoviridae'];
        aux_array.Herpesviridae = this.conserv_data[String(i)]['Herpesviridae'];
        aux_array.Orthomyxoviridae = this.conserv_data[String(i)]['Orthomyxoviridae'];
        aux_array.Arenaviridae = this.conserv_data[String(i)]['Arenaviridae'];
        aux_array.Phenuiviridae = this.conserv_data[String(i)]['Phenuiviridae'];
        aux_array.Rhabdoviridae = this.conserv_data[String(i)]['Rhabdoviridae'];
        // alert(aux_array.hasOwnProperty(this.option_conserv) );
        aux_array.prob = this.conserv_data[String(i)][this.option_conserv];
        /**
        // alert(typeof aux_array.prob === 'number');
        if (aux_array.prob >= 1) {
          aux_array.color = 'red';
        } else if (aux_array.prob >= 0.80 && aux_array.prob < 1) {
          aux_array.color = 'orange';
        } else if (aux_array.prob >= 0.60 && aux_array.prob < 0.80) {
          aux_array.color = 'yellow';
        } else if (aux_array.prob >= 0.40 && aux_array.prob < 0.60) {
          aux_array.color = 'lightgreen';
        } else {
          aux_array.color = 'white';
        }
         */
        this.print_conserv.push(aux_array);
      }
      const maxScore = Math.max.apply(Math, this.print_conserv.map(function(o) { return o.prob; }));
      const minScore = Math.min.apply(Math, this.print_conserv.map(function(o) { return o.prob; }));
      for (let i = 0; i < this.print_conserv.length; i++) {
        this.print_conserv[i].prob_correct = (this.print_conserv[i].prob - minScore) / (maxScore - minScore);

        if (this.print_conserv[i].prob_correct >= 0.95) {
          this.print_conserv[i].color = 'red';
        } else if (this.print_conserv[i].prob_correct >= 0.90 && this.print_conserv[i].prob_correct < 0.95) {
          this.print_conserv[i].color = 'orange';
        } else if (this.print_conserv[i].prob_correct >= 0.80 && this.print_conserv[i].prob_correct < 0.90) {
          this.print_conserv[i].color = 'yellow';
        } else if (this.print_conserv[i].prob_correct >= 0.60 && this.print_conserv[i].prob_correct < 0.80) {
          this.print_conserv[i].color = 'lightgreen';
        } else {
          this.print_conserv[i].color = 'white';
        }

      }
    } else {
      for (let i = 0; i < this.print_conserv.length; i++) {
        this.print_conserv[i].prob = this.print_conserv[String(i)][this.option_conserv];

        if (this.print_conserv[i].prob >= 1) {
          this.print_conserv[i].color = 'red';
        } else if (this.print_conserv[i].prob >= 0.80 && this.print_conserv[i].prob < 1) {
          this.print_conserv[i].color = 'orange';
        } else if (this.print_conserv[i].prob >= 0.60 && this.print_conserv[i].prob < 0.80) {
          this.print_conserv[i].color = 'yellow';
        } else if (this.print_conserv[i].prob >= 0.40 && this.print_conserv[i].prob < 0.60) {
          this.print_conserv[i].color = 'lightgreen';
          /**
        } else if (aux_array.prob >= 0.70 && aux_array.prob < 0.80) {
          aux_array.color = 'lightblue';
        } else if (aux_array.prob >= 0.60 && aux_array.prob < 0.70) {
          aux_array.color = 'lightgray';
           */
        } else {
          this.print_conserv[i].color = 'white';
        }
      }
    }
    this.conserv_card = true;
    this.name_family = this.option_conserv;
  }
  getTaskID() {
    /**
     * Sent a Request to the Async Function.
     */
    this.taskID = '';
    let sequence = '';
    if (this.sequence.value !== null && this.sequence.value !== '') {
      sequence = this.sequence.value;
    } else if (this.query_seq !== null && this.query_seq !== '') {
      sequence = this.query_seq;
    }
    if (sequence !== '') {
      this.MLService.getTaskIDRedis(this.option_model, this.sequence.value,
        this.window_size.value, this.gap_size.value).subscribe(
        (data_send) => {
          alert(data_send['task_id']);
          this.getTaskID_aux(data_send['task_id']);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
    });

    } else {
      alert('ERROR: SEQUENCE NEEDS TO BE FILLED');
    }
  }
  getTaskID_aux(data) {
    /**
     * Complementary function to the getTaskID one, to save the task ID.
     */
    this.taskID = data;
    this.asyncReturn = false;
  }
  getResultfromTaskID() {
    if (this.taskID !== '') {
      this.MLService.getRedisResult(this.taskID).subscribe(
        (data_send) => {
          const data_parse = JSON.parse(data_send['task_result']);
          this.results = data_parse['data'];
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
  }
}
