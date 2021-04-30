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
import {DomSanitizer} from '@angular/platform-browser';
import {EnvService} from '../../../services/env.service';
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';


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
  /**
   customColumn = 'idtaxonomy';
   defaultColumns = ['commonname', 'family', 'genre',
   'species', 'subspecies', 'virus_ncbitax', 'host',
   'host_ncbitax', 'idhost', 'idtaxhost'];
   */
  customColumn = 'commonname';
  defaultColumns = ['family', 'genre',
    'species', 'subspecies', 'virus_ncbitax', 'host',
    'host_ncbitax'];
  allColumns = [this.customColumn, ...this.defaultColumns]; // columns to be displayed in the table
  headers = {
    'idtaxonomy': 'ID', 'commonname': 'Common Name', 'family': 'Family',
    'genre': 'Genus', 'species': 'Species',
    'subspecies': 'Subspecies / Strain', 'virus_ncbitax': 'Virus\' NCBI Tax ID',
    'host': 'Host', 'host_ncbitax': 'Host\'s NCBI Tax ID', 'idhost': 'Host\'s ID', 'idtaxhost': 'Entry ID',
  }; // names to be shown in the headers
  current_page = 1; // page of the table
  count_entries: number; // entries in the query
  n_pags: number; // total of pages

  taxParam: string;
  search_term: string = '2';
  search_form = new FormControl(''); // Form of the search
  data_aux = [] as any;
  data_all = [] as any;
  addTaxHostForm: FormGroup; // Form to POST a data entry (TaxHost table)
  addHostForm: FormGroup; // Form to POST a data entry (Host table)
  putTaxHostForm: FormGroup; // Form to PUT (update) a data entry (TaxHost table)
  putHostForm: FormGroup; // Form to PUT (update) a data entry (Host table)
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

  API_URL = ''; // name of the API domain
  user = {};

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<TaxHostInterface>,
              private taxhostService: TaxHostService,
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
    /**
     Function to retrieve the query results, given the search term, current page and query params from the URL
     */
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
          if (aux['virus_ncbitax'] !== null) {
            aux['virus_ncbitax'] = '<a href="https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' +
              aux['virus_ncbitax'] + '" target="_blank">' + aux['virus_ncbitax'] + '</a>';
          }
          if (aux['host_ncbitax'] !== null) {
            aux['host_ncbitax'] = '<a href="https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' +
              aux['host_ncbitax'] + '" target="_blank">' + aux['host_ncbitax'] + '</a>';
          }
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
    /**
     Function to create or update a data entry (TaxHost).
     */
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
    /**
     Function to create or update a data entry (Host).
     */
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
      window.open(`${this.API_URL}/admin/crmapp/taxhost/`,
        '_blank');
    }
  }

  saveDataFile() {
    /**
     Function to retrieve all the query results and save it into file.
     */
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
    /**
     Function to make the Add Form to show up in the page (TaxHost).
     */
    this.add_form_th = true;
    this.put_form_th = false;
  }

  putDataForm_th() {
    /**
     Function to make the Update Form to show up in the page (TaxHost).
     */
    this.put_form_th = true;
    this.add_form_th = false;
  }

  addDataForm_host() {
    /**
     Function to make the Add Form to show up in the page (Host).
     */
    this.add_form_host = true;
    this.put_form_host = false;
  }

  putDataForm_host() {
    /**
     Function to make the Update Form to show up in the page (Host).
     */
    this.put_form_host = true;
    this.add_form_host = false;
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
