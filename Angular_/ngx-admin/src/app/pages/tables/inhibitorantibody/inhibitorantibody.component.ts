import {Component, Input, OnInit} from '@angular/core';
import {InhibitorantibodyService} from '../../../services/inhibitorantibody.service';
import {
  NbGetters,
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
} from '@nebular/theme';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {EnvService} from '../../../services/env.service';

interface InhibitorantibodyInterface {
  idsubstance?: string;
  type?: string;
  repository?: string;
  id_repository?: string;
  idprotein?: string;
  children?: InhibitorantibodyInterface[];
  expanded?: boolean;
}


@Component({
  selector: 'ngx-inhibitorantibody',
  templateUrl: './inhibitorantibody.component.html',
  styleUrls: ['./inhibitorantibody.component.scss'],
})
export class InhibitorantibodyComponent implements OnInit {

  customColumn = 'idsubstance';
  defaultColumns = ['type', 'repository', 'id_repository', 'idprotein'];
  allColumns = [this.customColumn, ...this.defaultColumns];
  headers = {
    'idsubstance': 'ID', 'type': 'Type', 'repository': 'Repository',
    'id_repository': 'ID in Repository', 'idprotein': 'Protein\'s ID'
  };
  current_page = 1;
  count_entries: number;
  n_pags: number;

  protParam: string;
  search_term: string = '2';
  search_form = new FormControl('');
  data_aux = [] as any;
  data_all = [] as any;
  addInhibForm: FormGroup;
  putInhibForm: FormGroup;
  aux_inter: InhibitorantibodyInterface = {};
  dataSource: NbTreeGridDataSource<InhibitorantibodyInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  add_form: boolean = false;
  put_form: boolean = false;

  fileUrl;
  data_print;

  API_URL = '';

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<InhibitorantibodyInterface>,
              private inhibService: InhibitorantibodyService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private env: EnvService,
  ) {
    this.API_URL = env.apiUrl;
  }

  ngOnInit() {
    this.fetchInhib();
    this.addInhibForm = this.formBuilder.group({
      idsubstance: new FormControl('', [
        Validators.required,
      ]),
      type: new FormControl('', [
        Validators.required,
      ]),
      repository: new FormControl('', [
        Validators.required,
      ]),
      id_repository: new FormControl('', [
        Validators.required,
      ]),
      idProtein: new FormControl('', [
        Validators.required,
      ]),
    });
    this.addInhibForm.patchValue({
      idtaxhost: '10000',
    });
    this.putInhibForm = this.formBuilder.group({
      idsubstance: new FormControl('', [
        Validators.required,
      ]),
      type: new FormControl('', [
        Validators.required,
      ]),
      repository: new FormControl('', [
        Validators.required,
      ]),
      id_repository: new FormControl('', [
        Validators.required,
      ]),
      idProtein: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  fetchInhib() {
    this.protParam = this.route.snapshot.queryParamMap.get('idprot');
    if (this.protParam !== null) {
      this.search_term = this.protParam;
    } else {
      this.search_term = '4';
    }
    this.inhibService.getFirstPage(this.search_term, this.search_form.value, this.current_page).subscribe(
      (data: Array<object>) => {
        const getters: NbGetters<InhibitorantibodyInterface, InhibitorantibodyInterface> = {
          dataGetter: (node: InhibitorantibodyInterface) => node,
          childrenGetter: (node: InhibitorantibodyInterface) => node.children || undefined,
          expandedGetter: (node: InhibitorantibodyInterface) => !!node.expanded,
        };
        this.data_aux = [];
        for (let i = 0; i < data['results'].length; i++) {
          const aux = data['results'][i];
          this.aux_inter = aux;
          this.aux_inter.expanded = false;
          this.data_aux.push(this.aux_inter);
        }
        this.dataSource = this.dataSourceBuilder.create(this.data_aux, getters);
        this.count_entries = data['count'];
        this.n_pags = Math.round(this.count_entries / 10) + 1;
      });

    this.saveDataFile();
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }


  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  searchTableResult() {
    this.current_page = 1;
    this.fetchInhib();
  }

  // function fetches the next paginated items by using the url in the next property
  fetchNext() {
    if (this.current_page < this.n_pags) {
      this.current_page = this.current_page + 1;
    }
    this.fetchInhib();
  }

  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    if (this.current_page > 1) {
      this.current_page = this.current_page - 1;
    }
    this.fetchInhib();
  }

  // function fetches the first paginated items by using the url in the next property
  fetchFirst() {
    this.current_page = 1;
    this.fetchInhib();
  }

  // function fetches the last paginated items by using the url in the previous property
  fetchLast() {
    this.current_page = this.n_pags;
    this.fetchInhib();
  }

  onSubmit(put: boolean = false) {
    if (!put) {
      if (this.addInhibForm.valid) {
        this.inhibService.add(this.addInhibForm.value)
          .subscribe(
            (data) => {
              alert('Form submitted successfully');
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
      }
      // tslint:disable-next-line:one-line
      else {
        alert('Required both parameters to be filled');
      }
    } else {
      if (this.putInhibForm.valid) {
        this.inhibService.put(this.putInhibForm.value, this.putInhibForm.value['idsubstance'])
          .subscribe(
            (data) => {
              alert('Form submitted successfully');
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
      }
      // tslint:disable-next-line:one-line
      else {
        alert('Required both parameters to be filled');
      }
    }
  }

  goToUrl(newUrl, add = false): void {
    if (add === false) {
      if (newUrl !== null) {
        window.open(newUrl, '_blank');
      }
    }
    // tslint:disable-next-line:one-line
    else {
      window.open(`${this.API_URL}/admin/crmapp/inhibitorantibody/`,
        '_blank');
    }
  }

  saveDataFile() {
    /**
     customColumn = 'idsubstance';
     defaultColumns = ['type', 'repository', 'id_repository', 'idprotein'];
     */
    this.data_all = [] as any;
    let data_to_print = 'idsubstance,type,repository,id_repository,idprotein\n';
    let protein = '';
    if (this.protParam !== null) {
      protein = this.protParam;
    }
    this.inhibService.receive_all(this.search_form.value, protein).subscribe(
      (data: Array<object>) => {
        this.data_all = data;
        for (const i of this.data_all) {
          data_to_print = data_to_print + i['idsubstance'] + ',' + i['type'] + ',' + i['repository'] + ','
            + i['id_repository'] + ',' + i['idprotein'] + '\n';
        }


        this.keepData(data_to_print);

        /**
         const data_send = {data: data_print};
         this.inhibService.send(data_send).subscribe(
         (data_) => {
            alert(data_['response']);
          },
         (error: HttpErrorResponse) => {
            alert(error.message);
          },
         );
         */
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  addDataForm() {
    this.add_form = true;
    this.put_form = false;
  }

  putDataForm() {
    this.put_form = true;
    this.add_form = false;
  }


  keepData(data: string) {
    this.data_print = data;

    const blob = new Blob([this.data_print], {type: 'text/csv'});

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

  }
}
