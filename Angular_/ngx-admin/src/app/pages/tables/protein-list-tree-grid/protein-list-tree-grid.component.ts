import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {
  NbGetters, NbSortDirection, NbSortRequest,
  NbTreeGridDataSource, NbTreeGridDataSourceBuilder,
} from '@nebular/theme';
import {ProteinService} from '../../../services/protein.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {EnvService} from '../../../services/env.service';


interface ProteinInterface {
  idprotein?: string;
  name?: string;
  class_field?: string;
  activation?: string;
  name_fusogenic_unit?: string;
  location_fusogenic?: string;
  sequence_fusogenic?: string;
  uniprotid?: any;
  ncbiid?: any;
  idtaxonomy?: object;
  virus?: string;
  children?: ChildrenFP[];
  expanded?: boolean;
  actions?: any;
  page?: any;
}

interface ChildrenFP {
  idprotein?: string;
  actions?: any;
  page?: any;
}


@Component({
  selector: 'ngx-protein-list-tree-grid',
  templateUrl: './protein-list-tree-grid.component.html',
  styleUrls: ['./protein-list-tree-grid.component.scss'],
})
export class ProteinListTreeGridComponent implements OnInit {

  /**
   customColumn = 'idprotein';
   defaultColumns = ['name', 'class_field', 'activation', 'name_fusogenic_unit', 'location_fusogenic',
   'sequence_fusogenic', 'uniprotid', 'ncbiid', 'idtaxonomy', 'virus'];
   */
  customColumn = 'name';
  defaultColumns = ['class_field', 'activation', 'name_fusogenic_unit', 'location_fusogenic',
    'sequence_fusogenic', 'uniprotid', 'ncbiid', 'virus'];
  allColumns = [this.customColumn, ...this.defaultColumns]; // columns to be displayed in the table
  headers = {
    'idprotein': 'ID', 'name': 'Protein Name', 'class_field': 'Class',
    'activation': 'Activation Method', 'name_fusogenic_unit': 'Name of Fusogenic Unit',
    'location_fusogenic': 'Location of Fusogenic Unit', 'sequence_fusogenic': 'Sequence of Fusogenic Unit',
    'uniprotid': 'UniProt ID', 'ncbiid': 'NCBI Protein ID', 'idtaxonomy': 'Taxonomy ID', 'virus': 'Virus',
  }; // names to be shown in the headers

  current_page = 1; // page of the table
  count_entries: number; // entries in the query
  n_pags: number; // total of pages

  search: string = '';
  search_term: string;
  data_aux = [] as any;
  data_all = [] as any;
  idTax: string;
  idProt: string;
  addProteinForm: FormGroup; // Form to POST a data entry
  putProteinForm: FormGroup; // Form to PUT (update) a data entry
  search_form = new FormControl(''); // Form of the search

  aux_inter: ProteinInterface = {};
  dataSource: NbTreeGridDataSource<ProteinInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  protParam: string;
  taxParam: string;
  search_tools: string = '';

  add_form: boolean = false;
  put_form: boolean = false;

  fileUrl;
  data_print;

  API_URL = ''; // name of the API domain

  autocomplete = [];

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<ProteinInterface>,
              private proteinService: ProteinService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private env: EnvService,
  ) {
    this.API_URL = env.apiUrl;
  }


  ngOnInit() {
    this.fetchProtein();

    this.addProteinForm = this.formBuilder.group({
      idprotein: new FormControl('', [
        Validators.required,
      ]),
      name: new FormControl('', [
        Validators.required,
      ]),
      class_field: new FormControl(),
      activation: new FormControl(),
      name_fusogenic_unit: new FormControl(),
      location_fusogenic: new FormControl(),
      sequence_fusogenic: new FormControl(),
      uniprotid: new FormControl(),
      ncbiid: new FormControl(),
      idtaxonomy: new FormControl(),
    });
    this.addProteinForm.patchValue({
      idprotein: '1',
    });
    this.putProteinForm = this.formBuilder.group({
      idprotein: new FormControl('', [
        Validators.required,
      ]),
      name: new FormControl('', [
        Validators.required,
      ]),
      class_field: new FormControl(),
      activation: new FormControl(),
      name_fusogenic_unit: new FormControl(),
      location_fusogenic: new FormControl(),
      sequence_fusogenic: new FormControl(),
      uniprotid: new FormControl(),
      ncbiid: new FormControl(),
      idtaxonomy: new FormControl(),
    });

  }

  fetchProtein() {
    /**
     Function to retrieve the query results, given the search term, current page and query params from the URL
     */
    this.protParam = this.route.snapshot.queryParamMap.get('idprot');
    this.taxParam = this.route.snapshot.queryParamMap.get('idtax');
    if (this.route.snapshot.queryParamMap.get('search')) {
      this.search_form = new FormControl(this.route.snapshot.queryParamMap.get('search'));
    }
    if (this.protParam !== null) {
      this.search = 'Prot';
      this.search_term = this.protParam;
    }
    // tslint:disable-next-line:one-line
    else if (this.taxParam !== null) {
      this.search = 'Tax';
      this.search_term = this.taxParam;
    }
    this.proteinService.getPage(this.current_page, this.search,
      this.search_form.value, this.search_term).subscribe((data: Array<object>) => {
      const getters: NbGetters<ProteinInterface, ProteinInterface> = {
        dataGetter: (node: ProteinInterface) => node,
        childrenGetter: (node: ProteinInterface) => node.children || undefined,
        expandedGetter: (node: ProteinInterface) => !!node.expanded,
      };
      this.data_aux = [];
      for (let i = 0; i < data['results'].length; i++) {
        const aux = data['results'][i];
        this.idProt = String(aux['idprotein']);
        this.idTax = String(aux['idtaxonomy']);
        if (aux['uniprotid'] !== null) {
           aux['uniprotid'] = '<a href="https://www.uniprot.org/uniprot/' + aux['uniprotid'] + '" target="_blank">'
             + aux['uniprotid'] + '</a>';
        }
        if (aux['ncbiid'] !== null) {
           aux['ncbiid'] = '<a href="https://www.ncbi.nlm.nih.gov/protein/' + aux['ncbiid'] + '" target="_blank">'
             + aux['ncbiid'] + '</a>';
        }
        this.aux_inter.actions = null;
        this.aux_inter = aux;
        this.aux_inter.children = [
          {
            idprotein: '', actions:
              '../fusion-peptide?idprot=' + String(this.idProt),
            page: 'Fusion Peptide',
          },
          {
            idprotein: '', actions:
              '../taxonomy-virus?idtax=' + String(this.idTax),
            page: 'Virus',
          },
          {
            idprotein: '', actions:
              '../protein-references?idprot=' + String(this.idProt),
            page: 'References',
          },
          {
            idprotein: '', actions:
              '../peptide-structure?idprotein=' + String(this.idProt),
            page: 'Structure',
          },
          {
            idprotein: '', actions:
              '../inhibitor-antibody?idprot=' + String(this.idProt),
            page: 'Inhibitors / Antibodies',
          },
        ];
        this.aux_inter.expanded = false;
        this.data_aux.push(this.aux_inter);
      }

      // this.dataSource = this.dataSourceBuilder.create(data['results'], getters);
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
    this.fetchProtein();
  }

  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    if (this.current_page > 1) {
      this.current_page = this.current_page - 1;
    }
    this.fetchProtein();
  }

  // function fetches the first paginated items by using the url in the next property
  fetchFirst() {
    this.current_page = 1;
    this.fetchProtein();
  }

  // function fetches the last paginated items by using the url in the previous property
  fetchLast() {
    this.current_page = this.n_pags;
    this.fetchProtein();
  }

  searchTableResult() {
    /**
     Function to perform search of the data.
     */
    if (!this.route.snapshot.queryParamMap.get('search') && !this.route.snapshot.queryParamMap.get('idprot') &&
      !this.route.snapshot.queryParamMap.get('idtax')) {
      this.current_page = 1;
      this.fetchProtein();
    } else {
      this.gotoURLSameApp('../protein?search='
        + this.search_form.value, '_self');
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
      window.open(`${this.API_URL}/admin/crmapp/protein/`,
        '_blank');
    }
  }

  onSubmit(put: boolean = false) {
    /**
     Function to create or update a data entry.
     */
    if (!put) {
      if (this.addProteinForm.valid) {
        // alert(JSON.stringify(this.addProteinForm.value));
        // this.taxonomyvirusService.add(this.addVirusForm as TaxonomyVirusInterface);
        this.proteinService.add(this.addProteinForm.value)
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
        alert('Required at least Name Parameter');
      }
    } else {
      if (this.putProteinForm.valid) {
        // alert(JSON.stringify(this.addProteinForm.value));
        // this.taxonomyvirusService.add(this.addVirusForm as TaxonomyVirusInterface);
        this.proteinService.put(this.putProteinForm.value, this.putProteinForm.value['idprotein'])
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
        alert('Required at least Name Parameter');
      }
    }
  }

  seq_tools(checked: boolean, id: string, seq: string) {
    if (checked) {
      if (!this.search_tools.includes('>' + String(id) + '\n' + seq + '\n')) {
        this.search_tools = this.search_tools + '>' + String(id) + '\n' + seq + '\n';
      }
    } else {
      this.search_tools = this.search_tools.replace('>' + String(id) + '\n' + seq + '\n', '');
    }
  }

  goToTools(type: string) {
    /**
     Function to access the tools present in the webserver upon selecting sequences within the table.
     */
    if (type === 'BLAST') {
      if ((this.search_tools.match(/>/g) || []).length > 0) {
        this.gotoURLSameApp('../../blast?sequence=' + encodeURI(this.search_tools));
        /**
         window.open('http://localhost:4201/pages/tools/blast?sequence=' + encodeURI(this.search_tools),
         '_blank');
         */
      } else {
        alert('ERROR: SELECT AT LEAST 1 SEQUENCE');
      }
    } else if (type === 'CLUSTAL') {
      if ((this.search_tools.match(/>/g) || []).length > 2) {

        let string_url = '';

        const seqs = this.search_tools.split('\n');

        for (let i = 0; i < seqs.length; i++) {
          if (seqs[i][0] === '>') {
            string_url = string_url + seqs[i].substring(1) + ',';
          }
        }

        string_url = string_url.substring(0, string_url.length - 1);

        this.gotoURLSameApp('../../tools/clustal?sequence=' + encodeURI(string_url));
        /**
         window.open('http://localhost:4201/pages/tools/clustal?sequence=' + encodeURI(this.search_tools),
         '_blank');
         */
      } else {
        alert('ERROR: SELECT AT LEAST 3 SEQUENCES');
      }
    } else if (type === 'IEDB') {
      if ((this.search_tools.match(/>/g) || []).length === 1) {
        this.gotoURLSameApp('../../tools/epitopes?sequence=' + encodeURI(this.search_tools));
        /**
         window.open('http://localhost:4201/pages/tools/epitopes?sequence=' + encodeURI(this.search_tools),
         '_blank');
         */
      } else {
        alert('ERROR: SELECT 1 SEQUENCE');
      }
    } else if (type === 'HMMER') {
      if ((this.search_tools.match(/>/g) || []).length === 1) {
        this.gotoURLSameApp('../../tools/hmmer?sequence=' + encodeURI(this.search_tools));
        /**
         // const search_tools_hmmer = this.search_tools.replace('>' + String(id) + '\n', '');
         window.open('http://localhost:4201/pages/tools/hmmer?sequence=' + encodeURI(this.search_tools),
         '_blank');
         */
      } else {
        alert('ERROR: SELECT 1 SEQUENCE');
      }
    } else if (type === 'WEBLOGO') {
      if ((this.search_tools.match(/>/g) || []).length > 1) {

        let string_url = '';

        const seqs = this.search_tools.split('\n');

        for (let i = 0; i < seqs.length; i++) {
          if (seqs[i][0] === '>') {
            string_url = string_url + seqs[i].substring(1) + ',';
          }
        }

        string_url = string_url.substring(0, string_url.length - 1);

        this.gotoURLSameApp('../../tools/weblogo?sequence=' + encodeURI(string_url));
        /**
         window.open('http://localhost:4201/pages/tools/weblogo?sequence=' + encodeURI(this.search_tools),
         '_blank');
         */
      } else {
        alert('ERROR: SELECT AT LEAST 2 SEQUENCES');
      }
    } else if (type === 'ML') {
      if ((this.search_tools.match(/>/g) || []).length === 1) {
        this.gotoURLSameApp('../../tools/predict?sequence=' + encodeURI(this.search_tools));
        /**
         window.open('http://localhost:4201/pages/tools/predict?sequence=' + encodeURI(this.search_tools),
         '_blank');
         */
      } else {
        alert('ERROR: SELECT 1 SEQUENCE');
      }
    }
  }

  verify_checkbox(id: string, seq: string) {
    return this.search_tools.includes('>' + String(id) + '\n' + seq + '\n');
  }

  saveDataFile() {
    /**
     Function to retrieve all the query results and save it into file.
     */
    /**
     customColumn = 'idprotein';
     defaultColumns = ['name', 'class_field', 'activation', 'name_fusogenic_unit', 'location_fusogenic',
     'sequence_fusogenic', 'uniprotid', 'ncbiid', 'idtaxonomy', 'virus'];
     */
    this.data_all = [] as any;
    let data_to_print = 'idprotein,name,class_field,activation,name_fusogenic_unit,location_fusogenic,' +
      'sequence_fusogenic,uniprotid,ncbiid,idtaxonomy,virus\n';
    let protein = '';
    let taxonomy = '';
    if (this.protParam !== null) {
      protein = this.protParam;
    }
    if (this.taxParam !== null) {
      taxonomy = this.taxParam;
    }
    this.proteinService.receive_all(this.search_form.value, protein, taxonomy).subscribe(
      (data: Array<object>) => {
        this.data_all = data;

        for (const i of this.data_all) {
          data_to_print = data_to_print + i['idprotein'] + ',' + i['name'] + ',' + i['class_field'] + ','
            + i['activation'] + ',' + i['name_fusogenic_unit']
            + ',' + i['location_fusogenic'] + ',' + i['sequence_fusogenic'] + ',' + i['uniprotid']
            + ',' + i['ncbiid'] + ',' + i['idtaxonomy'] + ',' + i['virus'] + '\n';
        }

        this.keepData(data_to_print);

        /**
         const data_send = {data: data_print};
         this.proteinService.send(data_send).subscribe(
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
      this.proteinService.get_autocomplete(this.search_form.value)
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
      if (data[i]['idprotein'].toString().toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['idprotein'].toString());
        continue;
      } else if (data[i]['virus'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['virus']);
        continue;
      } else if (data[i]['name'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['name']);
        continue;
      } else if (data[i]['class_field'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['class_field']);
        continue;
      } else if (data[i]['activation'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['activation']);
        continue;
      } else if (data[i]['name_fusogenic_unit'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['name_fusogenic_unit']);
        continue;
      } else if (data[i]['location_fusogenic'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['location_fusogenic']);
        continue;
      } else if (data[i]['sequence_fusogenic'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
      aux_string.push(data[i]['sequence_fusogenic']);
      continue;
      } else if (data[i]['uniprotid'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['uniprotid']);
        continue;
      } else if (data[i]['ncbiid'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['ncbiid']);
        continue;
      } else if (data[i]['idtaxonomy'].toString().toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['idtaxonomy'].toString());
        continue;
      }
    }
    this.autocomplete = Array.from(new Set(aux_string));
    if (this.autocomplete.length > 5) {
      this.autocomplete = this.autocomplete.slice(0, 5);
    }
  }
}
