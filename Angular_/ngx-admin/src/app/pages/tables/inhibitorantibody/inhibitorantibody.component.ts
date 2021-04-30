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
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';

interface InhibitorantibodyInterface {
  idsubstance?: string;
  type?: string;
  repository?: string;
  id_repository?: string;
  idprotein?: string;
  protein_name?: string;
  children?: InhibitorantibodyInterface[];
  expanded?: boolean;
}


@Component({
  selector: 'ngx-inhibitorantibody',
  templateUrl: './inhibitorantibody.component.html',
  styleUrls: ['./inhibitorantibody.component.scss'],
})
export class InhibitorantibodyComponent implements OnInit {
  /**
  customColumn = 'idsubstance';
  defaultColumns = ['type', 'repository', 'id_repository', 'idprotein'];
   */
  customColumn = 'type';
  defaultColumns = ['repository', 'id_repository', 'protein_name'];
  allColumns = [this.customColumn, ...this.defaultColumns]; // columns to be displayed in the table
  headers = {
    'idsubstance': 'ID', 'type': 'Type', 'repository': 'Repository',
    'id_repository': 'ID in Repository', 'idprotein': 'Protein\'s ID', 'protein_name': 'Protein Name',
  }; // names to be shown in the headers
  current_page = 1; // page of the table
  count_entries: number; // entries in the query
  n_pags: number; // total of pages

  protParam: string;
  search_term: string = '2';
  search_form = new FormControl(''); // Form of the search
  data_aux = [] as any;
  data_all = [] as any;
  addInhibForm: FormGroup; // Form to POST a data entry
  putInhibForm: FormGroup; // Form to PUT (update) a data entry
  aux_inter: InhibitorantibodyInterface = {};
  dataSource: NbTreeGridDataSource<InhibitorantibodyInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  add_form: boolean = false;
  put_form: boolean = false;

  fileUrl;
  data_print;

  API_URL = ''; // name of the API domain
  user = {};

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<InhibitorantibodyInterface>,
              private inhibService: InhibitorantibodyService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private env: EnvService,
              private authService: NbAuthService,
  ) {
    this.API_URL = env.apiUrl;

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.user = token.getPayload();
          // here we receive a payload from the token and assigns it to our `user` variable
        }
      });
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
    /**
     Function to retrieve the query results, given the search term, current page and query params from the URL
     */
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
    /**
     Function to perform search of the data.
     */
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
    /**
     Function to create or update a data entry.
     */
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
    /**
     Function to open a new tab with a given URl.
     */
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
     Function to retrieve all the query results and save it into file.
     */
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
    /**
     Function to make the Add Form to show up in the page.
     */
    this.add_form = true;
    this.put_form = false;
  }

  putDataForm() {
    /**
     Function to make the Update Form to show up in the page.
     */
    this.put_form = true;
    this.add_form = false;
  }


  keepData(data: string) {
    /**
     Function to create a link to download the data file from "Download Results" link.
     */
    this.data_print = data;

    const blob = new Blob([this.data_print], {type: 'text/csv'});

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

  }
}
