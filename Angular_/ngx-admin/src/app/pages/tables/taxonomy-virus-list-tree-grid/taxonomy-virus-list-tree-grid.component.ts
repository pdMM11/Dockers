import {Component, Input, OnInit} from '@angular/core';
import {
  NbGetters, NbSortDirection, NbSortRequest,
  NbTreeGridDataSource, NbTreeGridDataSourceBuilder,
} from '@nebular/theme';
import {TaxonomyVirusService} from '../../../services/taxonomy-virus.service';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {EnvService} from '../../../services/env.service';


export interface TaxonomyVirusInterface {
  idtaxonomy?: string;
  commonname?: string;
  family?: string;
  genre?: string;
  species?: string;
  subspecies?: string;
  ncbitax?: string;
  children?: ChildrenFP[];
  expanded?: boolean;
  actions?: any;
  page?: any;
  buttons?: any;
}

interface ChildrenFP {
  idtaxonomy?: string;
  actions?: any;
  page?: any;
}


@Component({
  selector: 'ngx-taxonomy-virus-list-tree-grid',
  templateUrl: './taxonomy-virus-list-tree-grid.component.html',
  styleUrls: ['./taxonomy-virus-list-tree-grid.component.scss'],
})
export class TaxonomyVirusListTreeGridComponent implements OnInit {
  /**
   customColumn = 'idtaxonomy';
   defaultColumns = ['commonname', 'family', 'genre', 'species',
   'subspecies', 'ncbitax'];
   */
  customColumn = 'buttons';
  defaultColumns = ['commonname','family', 'genre', 'species',
    'subspecies', 'ncbitax'];
  allColumns = [this.customColumn, ...this.defaultColumns]; // columns to be displayed in the table
  headers = { 'buttons': 'Additional Links',
    'idtaxonomy': 'ID', 'commonname': 'Common Name', 'family': 'Family',
    'genre': 'Genus', 'species': 'Species',
    'subspecies': 'Subspecies / Strain', 'ncbitax': 'NCBI Tax ID',
  }; // names to be shown in the headers
  current_page = 1; // page of the table
  count_entries: number; // entries in the query
  n_pags: number;
  idTax: string;
  search: boolean;
  search_term: string = '';
  data_aux = [] as any;
  data_all = [] as any;
  aux_inter: TaxonomyVirusInterface = {};
  search_form = new FormControl(''); // Form of the search
  addVirusForm: FormGroup; // Form to POST a data entry
  putVirusForm: FormGroup; // Form to PUT (update) a data entry
  dataSource: NbTreeGridDataSource<TaxonomyVirusInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  add_form: boolean = false;
  put_form: boolean = false;

  fileUrl;
  data_print;

  API_URL = ''; // name of the API domain

  autocomplete = [];

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<TaxonomyVirusInterface>,
              private taxonomyvirusService: TaxonomyVirusService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private router: Router,
              private env: EnvService,
  ) {
    this.API_URL = env.apiUrl;
  }

  ngOnInit() {
    this.fetchTaxonomy();
    this.addVirusForm = this.formBuilder.group({
      idtaxonomy: new FormControl('', [
        Validators.required,
      ]),
      commonname: new FormControl('', [
        Validators.required,
      ]),
      family: new FormControl(),
      genre: new FormControl(),
      species: new FormControl(),
      subspecies: new FormControl(),
      ncbitax: new FormControl(),
    });
    this.addVirusForm.patchValue({
      idtaxonomy: '1',
    });
    this.putVirusForm = this.formBuilder.group({
      idtaxonomy: new FormControl('', [
        Validators.required,
      ]),
      commonname: new FormControl('', [
        Validators.required,
      ]),
      family: new FormControl(),
      genre: new FormControl(),
      species: new FormControl(),
      subspecies: new FormControl(),
      ncbitax: new FormControl(),
    });
  }

  fetchTaxonomy() {
    /**
     Function to retrieve the query results, given the search term, current page and query params from the URL
     */
    this.search = false;
    this.idTax = this.route.snapshot.queryParamMap.get('idtax');
    if (this.route.snapshot.queryParamMap.get('search')) {
      this.search_form = new FormControl(this.route.snapshot.queryParamMap.get('search'));
    }
    if (this.idTax !== null) {
      this.search = true;
      this.search_term = this.idTax;
    }
    this.taxonomyvirusService.getPage(this.current_page, this.search_form.value,
      this.search, this.search_term).subscribe(
      (data: Array<object>) => {
        const getters: NbGetters<TaxonomyVirusInterface, TaxonomyVirusInterface> = {
          dataGetter: (node: TaxonomyVirusInterface) => node,
          childrenGetter: (node: TaxonomyVirusInterface) => node.children || undefined,
          expandedGetter: (node: TaxonomyVirusInterface) => !!node.expanded,
        };
        this.data_aux = [];
        for (let i = 0; i < data['results'].length; i++) {
          const aux = data['results'][i];
          this.aux_inter = aux;
          this.aux_inter.actions = null;
          this.idTax = String(aux['idtaxonomy']);
          if (aux['ncbitax'] !== null) {
            aux['ncbitax'] = '<a href="https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' +
              aux['ncbitax'] + '" target="_blank">' + aux['ncbitax'] + '</a>';
          }
          this.aux_inter.children = [
            {
              idtaxonomy: '', actions:
                '../protein?idtax=' +
                String(this.idTax), page: 'Fusion Protein',
            },
            {
              idtaxonomy: '', actions:
                '../fusion-peptide?idtax='
                + String(this.idTax), page: 'Fusion Peptide',
            },
            {
              idtaxonomy: '', actions:
                '../tax-host?idtax='
                + String(this.idTax), page: 'Hosts',
            },
          ];
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

  // function fetches the next paginated items by using the url in the next property
  fetchNext() {
    if (this.current_page < this.n_pags) {
      this.current_page = this.current_page + 1;
    }
    this.fetchTaxonomy();
  }

  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    if (this.current_page > 1) {
      this.current_page = this.current_page - 1;
    }
    this.fetchTaxonomy();
  }

  // function fetches the first paginated items by using the url in the next property
  fetchFirst() {
    this.current_page = 1;
    this.fetchTaxonomy();
  }

  // function fetches the last paginated items by using the url in the previous property
  fetchLast() {
    this.current_page = this.n_pags;
    this.fetchTaxonomy();
  }

  searchTableResult() {
    /**
     Function to perform search of the data.
     */
    if (!this.route.snapshot.queryParamMap.get('search') &&
      !this.route.snapshot.queryParamMap.get('idtax')) {
      this.current_page = 1;
      this.fetchTaxonomy();
    } else {
      this.gotoURLSameApp('../taxonomy-virus?search='
        + this.search_form.value, '_self');
      /**
       window.open('http://localhost:4201/pages/tables/taxonomy-virus?search='
       + this.search_form.value, '_self');
       */
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
    } else {
      window.open(`${this.API_URL}/admin/crmapp/taxonomyvirus/`,
        '_blank');
    }
  }

  verifyNull(data) {
    return data === null;
  }

  onSubmit(put: boolean = false) {
    /**
     Function to create or update a data entry.
     */
    if (!put) {
      if (this.addVirusForm.valid) {
        // this.taxonomyvirusService.add(this.addVirusForm as TaxonomyVirusInterface);
        this.taxonomyvirusService.add(this.addVirusForm.value)
          .subscribe(
            (data) => {
              alert('Form submitted successfully');
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
      } else {
        alert('Required at least Name Parameter');
      }
    } else {
      if (this.putVirusForm.valid) {
        // this.taxonomyvirusService.add(this.addVirusForm as TaxonomyVirusInterface);
        this.taxonomyvirusService.put(this.putVirusForm.value, this.putVirusForm.value['idtaxonomy'])
          .subscribe(
            (data) => {
              alert('Form submitted successfully');
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            });
      } else {
        alert('Required at least Name Parameter');
      }
    }
  }

  saveDataFile() {
    /**
     Function to retrieve all the query results and save it into file.
     */
    /**
     window.open(`${this.API_URL}/taxonomyvirus/save/?search=` +  this.search_form.value,
     '_blank');
     */
    this.data_all = [] as any;
    let data_to_print = 'idtaxonomy,commonname,family,genre,species,subspecies,ncbitax\n';
    let taxonomy = '';
    if (this.idTax !== null) {
      taxonomy = this.idTax;
    }
    this.taxonomyvirusService.receive_all(this.search_form.value, taxonomy).subscribe(
      (data: Array<object>) => {
        this.data_all = data;

        for (const i of this.data_all) {
          data_to_print = data_to_print + i['idtaxonomy'] + ',' + i['commonname'] + ',' + i['family'] + ','
            + i['genre'] + ',' + i['species'] + ',' + i['subspecies'] + ',' + i['ncbitax'] + '\n';
        }

        this.keepData(data_to_print);

        /**
         const data_send = {data: data_print};
         this.taxonomyvirusService.send(data_send).subscribe(
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

  gotoURLSameApp(directory, target = '_blank') {
    /**
     Function to navigate within the app.
     */
    const url = this.router.serializeUrl(
      this.router.createUrlTree([directory], {relativeTo: this.route}),
    );

    window.open(decodeURIComponent(url), target);
  }

  onSearchChange(): void {
    /**
     Function to retrieve autocomplete sugestions for the search form.
     */
    if (this.search_form.value.length > 1) {
      this.taxonomyvirusService.get_autocomplete(this.search_form.value)
        .subscribe(
          (data) => {
            this.complete_aux(data['results']);
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
    } else {
      this.autocomplete = [];
    }
  }
  complete_aux(data: any) {
    /**
     Function to complement the function onSearchChange, so to retrieve autocomplete sugestions for the search form.
     */
    let aux_string = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]['idtaxonomy'].toString().toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['idtaxonomy'].toString());
        continue;
      } else if (data[i]['commonname'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['commonname']);
        continue;
      } else if (data[i]['family'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['family']);
        continue;
      } else if (data[i]['genre'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['genre']);
        continue;
      } else if (data[i]['species'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['species']);
        continue;
      } else if (data[i]['subspecies'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['subspecies']);
        continue;
      } else if (data[i]['ncbitax'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['ncbitax']);
        continue;
      }
    }
    this.autocomplete = Array.from(new Set(aux_string));
    if (this.autocomplete.length > 5) {
      this.autocomplete = this.autocomplete.slice(0, 5);
    }
  }
}
