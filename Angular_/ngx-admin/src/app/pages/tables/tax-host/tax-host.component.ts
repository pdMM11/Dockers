import {Component, Input, OnInit} from '@angular/core';
import {TaxHostService} from '../../../services/tax-host.service';
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
import { DomSanitizer } from '@angular/platform-browser';
import {EnvService} from '../../../services/env.service';


interface TaxHostInterface {
  idtaxonomy?: string;
  commonname?: string;
  family?: string;
  genre?: string;
  species?: string;
  subspecies?: string;
  virus_ncbitax?: string;
  host?: string;
  host_ncbitax?: string;
  idhost?: string;
  idtaxhost?: string;
  children?: TaxHostInterface[];
  expanded?: boolean;
}

@Component({
  selector: 'ngx-tax-host',
  templateUrl: './tax-host.component.html',
  styleUrls: ['./tax-host.component.scss'],
})


export class TaxHostComponent implements OnInit {

  customColumn = 'idtaxonomy';
  defaultColumns = ['commonname', 'family', 'genre',
    'species', 'subspecies', 'virus_ncbitax', 'host',
    'host_ncbitax', 'idhost', 'idtaxhost'];
  allColumns = [this.customColumn, ...this.defaultColumns];
  current_page = 1;
  count_entries: number;
  n_pags: number;

  taxParam: string;
  search_term: string = '2';
  search_form = new FormControl('');
  data_aux = [] as any;
  data_all = [] as any;
  addTaxHostForm: FormGroup;
  addHostForm: FormGroup;
  putTaxHostForm: FormGroup;
  putHostForm: FormGroup;
  aux_inter: TaxHostInterface = {};
  dataSource: NbTreeGridDataSource<TaxHostInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  add_form_host: boolean = false;
  put_form_host: boolean = false;
  add_form_th: boolean = false;
  put_form_th: boolean = false;

  fileUrl;
  data_print;

  API_URL = '';

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<TaxHostInterface>,
              private taxhostService: TaxHostService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private env: EnvService,
  ) {
    this.API_URL = env.apiUrl;
  }

  ngOnInit() {
    this.fetchTaxHost();
    this.addTaxHostForm = this.formBuilder.group({
      idtaxonomy: new FormControl('', [
        Validators.required,
      ]),
      idhost: new FormControl('', [
        Validators.required,
      ]),
      idtaxhost: new FormControl('', [
        Validators.required,
      ]),
    });
    this.addTaxHostForm.patchValue({
      idtaxhost: '10000',
    });
    this.addHostForm = this.formBuilder.group({
      idhost: new FormControl('', [
        Validators.required,
      ]),
      host: new FormControl('', [
        Validators.required,
      ]),
      ncbitax: new FormControl(),
    });
    this.addHostForm.patchValue({
      idhost: '10000',
    });
    this.putTaxHostForm = this.formBuilder.group({
      idtaxonomy: new FormControl('', [
        Validators.required,
      ]),
      idhost: new FormControl('', [
        Validators.required,
      ]),
      idtaxhost: new FormControl('', [
        Validators.required,
      ]),
    });
    this.putHostForm = this.formBuilder.group({
      idhost: new FormControl('', [
        Validators.required,
      ]),
      host: new FormControl('', [
        Validators.required,
      ]),
      ncbitax: new FormControl(),
    });
  }

  fetchTaxHost() {
    this.taxParam = this.route.snapshot.queryParamMap.get('idtax');
    if (this.taxParam !== null) {
      this.search_term = this.taxParam;
    }
    this.taxhostService.getFirstPage(this.search_term, this.search_form.value, this.current_page).subscribe(
      (data: Array<object>) => {
        const getters: NbGetters<TaxHostInterface, TaxHostInterface> = {
          dataGetter: (node: TaxHostInterface) => node,
          childrenGetter: (node: TaxHostInterface) => node.children || undefined,
          expandedGetter: (node: TaxHostInterface) => !!node.expanded,
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
    this.fetchTaxHost();
  }

  // function fetches the next paginated items by using the url in the next property
  fetchNext() {
    if (this.current_page < this.n_pags) {
      this.current_page = this.current_page + 1;
    }
    this.fetchTaxHost();
  }

  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    if (this.current_page > 1) {
      this.current_page = this.current_page - 1;
    }
    this.fetchTaxHost();
  }

  // function fetches the first paginated items by using the url in the next property
  fetchFirst() {
    this.current_page = 1;
    this.fetchTaxHost();
  }

  // function fetches the last paginated items by using the url in the previous property
  fetchLast() {
    this.current_page = this.n_pags;
    this.fetchTaxHost();
  }

  onSubmit(put: boolean = false) {
    if (!put) {
      if (this.addTaxHostForm.valid) {
        this.taxhostService.add(this.addTaxHostForm.value)
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
      if (this.putTaxHostForm.valid) {
        this.taxhostService.put(this.putTaxHostForm.value, this.putTaxHostForm.value['idtaxhost'])
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

  onSubmitHost(put: boolean = false) {
    if (!put) {
      if (this.addHostForm.valid) {
        this.taxhostService.addHost(this.addHostForm.value)
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
        alert('Required at least Name parameter to be filled');
      }
    } else {
      if (this.putHostForm.valid) {
        this.taxhostService.putHost(this.putHostForm.value, this.putHostForm.value['idhost'])
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
        alert('Required at least Name parameter to be filled');
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
      window.open(`${this.API_URL}/admin/crmapp/taxhost/`,
        '_blank');
    }
  }

  saveDataFile() {
    /**
     customColumn = 'idtaxonomy';
     defaultColumns = ['commonname', 'family', 'genre',
     'species', 'subspecies', 'virus_ncbitax', 'host',
     'host_ncbitax', 'idhost'];
     */
    this.data_all = [] as any;
    let data_to_print = 'idtaxonomy,commonname,family,genre,species,' +
      'subspecies,virus_ncbitax,host,host_ncbitax,idhost\n';
    let taxonomy = '';
    if (this.taxParam !== null) {
      taxonomy = this.taxParam;
    }
    this.taxhostService.receive_all(this.search_form.value, taxonomy).subscribe(
      (data: Array<object>) => {
        this.data_all = data;

        for (const i of this.data_all) {
          data_to_print = data_to_print + i['idtaxonomy'] + ',' + i['commonname'] + ',' + i['family'] + ','
            + i['genre'] + ',' + i['species'] + ',' + i['subspecies'] + ',' + i['virus_ncbitax'] +
            ',' + i['host'] + ',' + i['host_ncbitax'] + ',' + i['idhost'] + '\n';
        }

        this.keepData(data_to_print);

        /**
        const data_send = {data: data_print};
        this.taxhostService.send(data_send).subscribe(
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

  addDataForm_th() {
    this.add_form_th = true;
    this.put_form_th = false;
  }

  putDataForm_th() {
    this.put_form_th = true;
    this.add_form_th = false;
  }

  addDataForm_host() {
    this.add_form_host = true;
    this.put_form_host = false;
  }

  putDataForm_host() {
    this.put_form_host = true;
    this.add_form_host = false;
  }

  keepData(data: string) {
    this.data_print = data;

    const blob = new Blob([this.data_print], { type: 'text/csv' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

  }
}

/**


 @Component({
  selector: 'ngx-tax-host',
  templateUrl: './tax-host.component.html',
  styleUrls: ['./tax-host.component.scss'],
})
 export class TaxHostComponent implements OnInit {
  dataSource = [];
  constructor(private taxHostService: TaxHostService) { }
  ngOnInit() {
    this.fetchTaxonomyVirus();
  }
  fetchTaxonomyVirus() {
    this.taxHostService.getFirstPage().subscribe((data: Array<object>) => {
      this.dataSource = data['results'];
    });
  }
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
      idtaxonomy: {
        title: 'ID',
        type: 'string',
      },
      host: {
        title: 'Host',
        type: 'string',
      },
      host_ncbitax: {
        title: 'NCBI Taxonomy',
        type: 'string',
      },
    },
  };

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
 */
