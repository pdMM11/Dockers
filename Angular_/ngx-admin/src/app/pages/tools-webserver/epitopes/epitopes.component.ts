import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {IedbService} from '../../../services/iedb.service';
import {HttpErrorResponse} from '@angular/common/http';

export interface Bep1Interface {
  no?: string;
  start?: string;
  end?: string;
  peptide?: string;
  length?: string;
}

export interface Bep2Interface {
  position?: string;
  residue?: string;
  score?: string;
  assignment?: string;
}

export interface OtherMethodInterface {
  position?: string;
  residue?: string;
  start?: string;
  end?: string;
  peptide?: string;
  score?: string;
}

@Component({
  selector: 'ngx-epitopes',
  templateUrl: './epitopes.component.html',
  styleUrls: ['./epitopes.component.scss'],
})
export class EpitopesComponent implements OnInit {
  query_seq = '';
  sequence = new FormControl('');
  window_size = new FormControl(9);
  results: any;
  results_bepi1: any;
  results_bepi2: any;
  option = 'Bepipred';
  data_bepi1 = [];
  data_bepi2 = [];
  data_other = [];

  settings_bepi1 = {
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
      no: {
        title: 'Number',
        type: 'string',
      },
      start: {
        title: 'Start',
        type: 'string',
      },
      end: {
        title: 'End',
        type: 'string',
      },
      peptide: {
        title: 'Peptide',
        type: 'string',
      },
      length: {
        title: 'Length',
        type: 'string',
      },
    },
  };

  settings_bepi2 = {
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
      position: {
        title: 'Position',
        type: 'string',
      },
      residue: {
        title: 'Residue',
        type: 'string',
      },
      score: {
        title: 'Score',
        type: 'string',
      },
      assignment: {
        title: 'Assignment',
        type: 'string',
      },
    },
  };

  settings_other = {
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
      position: {
        title: 'Position',
        type: 'string',
      },
      residue: {
        title: 'Residue',
        type: 'string',
      },
      start: {
        title: 'Start',
        type: 'string',
      },
      end: {
        title: 'End',
        type: 'string',
      },
      peptide: {
        title: 'Peptide',
        type: 'string',
      },
      score: {
        title: 'Score',
        type: 'string',
      },
    },
  };

  constructor(private route: ActivatedRoute,
              private iedbService: IedbService) {
  }

  ngOnInit() {
    this.query_seq = this.route.snapshot.queryParamMap.get('sequence').split('\n')[1];
  }

  gotoIEDB(): void {
    /**
     This function sends a GET request to the backend, which itself sends another to IEDB API, and the this function
     receives the JSON output, displaying it in Smart Tables (2 tables for the Bepipred methods; 1 table for the rest
     of the methods).
     */
    /**
     if (this.sequence.value !== null && this.sequence.value !== '') {
      const random_id = makeid();
      const cookie = setCookie('iedb_cookie' + random_id,
        this.cookie_start + this.sequence.value + this.option)
      this.printstuff = cookie;
      this.iedbService.sendCookie(cookie);
      window.open('https://www.iedb.org/result_v3.php?cookie_id=' + String(random_id), '_blank');
    } else if (this.query_seq !== null && this.query_seq !== '') {
      const random_id = makeid();
      const cookie = setCookie('iedb_cookie' + random_id,
        this.cookie_start + this.query_seq + this.option)
      this.printstuff = cookie;
      this.iedbService.sendCookie(cookie);
      window.open('https://www.iedb.org/result_v3.php?cookie_id=' + String(random_id), '_blank');
    } else alert('ERROR: SEQUENCE NEEDS TO BE FILLED');
     */
    this.results = null;
    this.results_bepi1 = null;
    this.results_bepi2 = null;
    this.data_bepi1 = [];
    this.data_bepi2 = [];
    this.data_other = [];
    if (this.sequence.value !== null && this.sequence.value !== '') {
      this.iedbService.send(this.option, this.sequence.value, this.window_size.value).subscribe(
        (data) => {
          if (this.option === 'Bepipred' || this.option === 'Bepipred-2.0') {
            const new_table = data.indexOf('Position');
            this.results_bepi1 = data.substring(0, new_table).split('\n');
            for (const i of this.results_bepi1) {
              const row_data = i.split('\t');
              const row_data_int: Bep1Interface = {
                no: row_data[0],
                start: row_data[1],
                end: row_data[2],
                peptide: row_data[3],
                length: row_data[4],
              };
              if (row_data_int.no !== 'No') {
                this.data_bepi1.push(row_data_int);
              }
            }
            this.results_bepi2 = data.substring(new_table, data.length).split('\n');
            for (const i of this.results_bepi2) {
              const row_data = i.split('\t');
              const row_data_int: Bep2Interface = {
                position: row_data[0],
                residue: row_data[1],
                score: row_data[2],
                assignment: row_data[3],
              };
              if (row_data_int.position !== 'Position') {
                this.data_bepi2.push(row_data_int);
              }
            }
          } else {
            this.results = data.split('\n');
            for (const i of this.results) {
              const row_data = i.split('\t');
              const row_data_int: OtherMethodInterface = {
                position: row_data[0],
                residue: row_data[1],
                start: row_data[2],
                end: row_data[3],
                peptide: row_data[4],
                score: row_data[5],
              };
              if (row_data_int.position !== 'Position') {
                this.data_other.push(row_data_int);
              }
            }
          }
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    } else if (this.query_seq !== null && this.query_seq !== '') {
      this.iedbService.send(this.option, this.query_seq, this.window_size.value).subscribe(
        (data) => {
          if (this.option === 'Bepipred' || this.option === 'Bepipred-2.0') {
            const new_table = data.indexOf('Position');
            this.results_bepi1 = data.substring(0, new_table).split('\n');
            for (const i of this.results_bepi1) {
              const row_data = i.split('\t');
              const row_data_int: Bep1Interface = {
                no: row_data[0],
                start: row_data[1],
                end: row_data[2],
                peptide: row_data[3],
                length: row_data[4],
              };
              if (row_data_int.no !== 'No') {
                this.data_bepi1.push(row_data_int);
              }
            }
            this.results_bepi2 = data.substring(new_table, data.length).split('\n');
            for (const i of this.results_bepi2) {
              const row_data = i.split('\t');
              const row_data_int: Bep2Interface = {
                position: row_data[0],
                residue: row_data[1],
                score: row_data[2],
                assignment: row_data[3],
              };
              if (row_data_int.position !== 'Position') {
                this.data_bepi2.push(row_data_int);
              }
            }
          } else {
            this.results = data.split('\n');
            for (const i of this.results) {
              const row_data = i.split('\t');
              const row_data_int: OtherMethodInterface = {
                position: row_data[0],
                residue: row_data[1],
                start: row_data[2],
                end: row_data[3],
                peptide: row_data[4],
                score: row_data[5],
              };
              if (row_data_int.position !== 'Position') {
                this.data_other.push(row_data_int);
              }
            }
          }
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    } else {
      alert('ERROR: SEQUENCE NEEDS TO BE FILLED');
    }
  }
}
