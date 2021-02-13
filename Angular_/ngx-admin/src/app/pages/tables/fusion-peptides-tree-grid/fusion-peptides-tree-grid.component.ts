import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {
  NbGetters, NbSortDirection, NbSortRequest,
  NbTreeGridDataSource, NbTreeGridDataSourceBuilder,
} from '@nebular/theme';
import {FusionPeptideService} from '../../../services/fusion-peptide.service';
import {PeptideReferencesService} from '../../../services/peptide-references.service';
import {PeptideStructuresService} from '../../../services/peptide-structures.service';
import {ProteinService} from '../../../services/protein.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {flatMap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {EnvService} from '../../../services/env.service';

interface FusionPeptideInterface {
  idfusion_peptides?: string;
  protein_name?: string;
  virus?: string;
  residues?: string;
  sequence?: string;
  annotation_method?: string;
  exp_evidence?: string;
  protein?: string;
  children?: ChildrenFP[];
  expanded?: boolean;
  actions?: any;
  page?: any;
}

interface ChildrenFP {
  idfusion_peptides?: string;
  actions?: any;
  page?: any;
}


@Component({
  selector: 'ngx-tree-grid',
  templateUrl: './fusion-peptides-tree-grid.component.html',
  styleUrls: ['./fusion-peptides-tree-grid.component.scss'],
})
export class FusionPeptidesTreeGridComponent implements OnInit {
  // customColumn = 'idfusion_peptides';
  customColumn = 'residues';
  /**
   defaultColumns = ['sequence', 'annotation_method', 'protein_name',
   'exp_evidence', 'protein', 'virus'];
   */
  defaultColumns = ['sequence', 'annotation_method', 'protein_name', 'exp_evidence'];
  allColumns = [this.customColumn, ...this.defaultColumns]; // columns to be displayed in the table
  headers = {
    'idfusion_peptides': 'ID', 'residues': 'Position', 'sequence': 'Sequence',
    'annotation_method': 'Annotation Method', 'protein_name': 'Protein Name',
    'exp_evidence': 'Experimental Evidence', 'protein': 'Protein\' ID', 'virus': 'Virus',
  }; // names to be shown in the headers
  current_page = 1; // page of the table
  count_entries: number; // entries in the query
  n_pags: number; // total of pages
  idFP: string;
  idProt: string;
  search: string = '';
  search_term: string;
  protParam: string;
  taxParam: string;
  data_aux = [] as any;
  data_all = [] as any;
  search_form = new FormControl(''); // Form of the search
  addFPForm: FormGroup; // Form to POST a data entry
  putFPForm: FormGroup; // Form to PUT (update) a data entry
  aux_inter: FusionPeptideInterface = {};
  dataSource: NbTreeGridDataSource<FusionPeptideInterface>;
  fileUrl;
  data_print;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  prot_data = [];
  ref_data = [];
  struct_data = [];
  add_form: boolean = false;
  put_form: boolean = false;
  API_URL = ''; // name of the API domain

  autocomplete = [];

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FusionPeptideInterface>,
              private fusionpeptideService: FusionPeptideService,
              private peptidestructuresService: PeptideStructuresService,
              private peptidereferencesService: PeptideReferencesService,
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
    this.fetchFusionPeptide();
    // this.searchTableResult();
    this.addFPForm = this.formBuilder.group({
      idfusion_peptides: new FormControl('', [
        Validators.required,
      ]),
      residues: new FormControl(),
      sequence: new FormControl('', [
        Validators.required,
      ]),
      annotation_method: new FormControl(),
      exp_evidence: new FormControl(),
      protein: new FormControl(),
    });
    this.addFPForm.patchValue({
      idfusion_peptides: '1',
    });
    this.putFPForm = this.formBuilder.group({
      idfusion_peptides: new FormControl('', [
        Validators.required,
      ]),
      residues: new FormControl(),
      sequence: new FormControl('', [
        Validators.required,
      ]),
      annotation_method: new FormControl(),
      exp_evidence: new FormControl(),
      protein: new FormControl(),
    });
  }

  fetchFusionPeptide() {
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
    } else if (this.taxParam !== null) {
      this.search = 'Tax';
      this.search_term = this.taxParam;
    }

    /**
     this.fusionpeptideService.getPage(this.current_page, this.search,
     this.search_form.value, this.search_term).pipe(
     flatMap((res1) => this.proteinService.getPage(1, 'Prot', '2')),
     flatMap((res2) => this.peptidereferencesService.getFirstPage('2')),
     flatMap((res3) => this.peptidestructuresService.getFirstPage('2')),
     ).subscribe((res3) => {
    });
     */
    this.fusionpeptideService.getPage(this.current_page, this.search,
      this.search_form.value, this.search_term).subscribe(
      (data: Array<object>) => {
        const getters: NbGetters<FusionPeptideInterface, FusionPeptideInterface> = {
          dataGetter: (node: FusionPeptideInterface) => node,
          childrenGetter: (node: FusionPeptideInterface) => node.children || undefined,
          expandedGetter: (node: FusionPeptideInterface) => !!node.expanded,
        };
        this.data_aux = [];
        for (let i = 0; i < data['results'].length; i++) {
          const aux = data['results'][i];
          this.aux_inter = aux;
          this.idFP = String(aux['idfusion_peptides']);
          this.idProt = String(aux['protein']);
          this.aux_inter.actions = null;


          // this.fetchData(this.idProt, this.idFP);
          /**
           this.aux_inter.children = [];
           this.fetchData(this.idProt, this.idFP);
           if (this.prot_data.length > 0) {
          this.aux_inter.children.push(
            {idfusion_peptides: '', actions:
                'http://localhost:4201/pages/tables/protein?idprot=' + String(this.idFP),
              page: 'Fusion Protein'},
          );
        }
           if (this.struct_data.length > 0) {
          this.aux_inter.children.push(
            {idfusion_peptides: '', actions: new URL(
                'http://localhost:4201/pages/tables/peptide-structure?idpeptide=' + String(this.idFP)),
              page: 'Structure'},
          );
        }
           if (this.ref_data.length > 0) {
          this.aux_inter.children.push(
            {idfusion_peptides: '', actions: new URL(
                'http://localhost:4201/pages/tables/peptide-references?idpeptide=' + String(this.idFP)),
              page: 'References'},
          );
        }
           this.aux_inter.children = [];
           if (this.fetchData('Protein', this.idProt, this.idFP)) {
          this.aux_inter.children.push(
            {idfusion_peptides: '', actions: new URL(
                'http://localhost:4201/pages/tables/protein?idprot=' + String(this.idFP)),
              page: 'Fusion Protein'},
          );
        }
           if (this.fetchData('Structures', this.idProt, this.idFP)) {
          this.aux_inter.children.push(
            {idfusion_peptides: '', actions: new URL(
                'http://localhost:4201/pages/tables/peptide-structure?idpeptide=' + String(this.idFP)),
              page: 'Structure'},
          );
        }
           if (this.fetchData('References', this.idProt, this.idFP)) {
          this.aux_inter.children.push(
            {idfusion_peptides: '', actions: new URL(
                'http://localhost:4201/pages/tables/peptide-references?idpeptide=' + String(this.idFP)),
              page: 'References'},
          );
        }
           */
          this.aux_inter.children = [
            {
              idfusion_peptides: '', actions:
                '../protein?idprot=' + String(this.idFP),
              page: 'Fusion Protein',
            },
            /**
            {
              idfusion_peptides: '', actions:
                '../peptide-structure?idpeptide=' + String(this.idFP),
              page: 'Structure',
            },
             */
            {
              idfusion_peptides: '', actions:
                '../peptide-references?idpeptide=' + String(this.idFP),
              page: 'References',
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
    this.fetchFusionPeptide();
  }

  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    if (this.current_page > 1) {
      this.current_page = this.current_page - 1;
    }
    this.fetchFusionPeptide();
  }

  // function fetches the first paginated items by using the url in the next property
  fetchFirst() {
    this.current_page = 1;
    this.fetchFusionPeptide();
  }

  // function fetches the last paginated items by using the url in the previous property
  fetchLast() {
    this.current_page = this.n_pags;
    this.fetchFusionPeptide();
  }

  searchTableResult() {
    /**
     Function to perform search of the data.
     */
    if (!this.route.snapshot.queryParamMap.get('search') && !this.route.snapshot.queryParamMap.get('idprot') &&
      !this.route.snapshot.queryParamMap.get('idtax')) {
      this.current_page = 1;
      this.fetchFusionPeptide();
    } else {
      this.gotoURLSameApp('../fusion-peptide?search='
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
      window.open(`${this.API_URL}/admin/crmapp/fusionpeptides/`,
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
      if (this.addFPForm.valid) {
        this.fusionpeptideService.add(this.addFPForm.value)
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
        alert('Required at least Sequence Parameter');
      }
    } else {
      if (this.putFPForm.valid) {
        this.fusionpeptideService.put(this.putFPForm.value, this.putFPForm.value['idfusion_peptides'])
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
        alert('Required at least ID and Sequence Parameters');
      }
    }
  }

  /**
   // verifies if there is additional data
   fetchData(table: string, id_prot: string, idFP: string): any {
    if (table === 'Protein') {
      this.proteinService.getPage(1, 'Prot', id_prot).subscribe(
        (data: Array<object>) => {
          this.prot_data = data['results'];
        });
    } else if (table === 'References') {
      this.peptidereferencesService.getFirstPage(idFP).subscribe(
        (data: Array<object>) => {
          this.ref_data = data['results'];
        });
    } else if (table === 'Structures') {
      this.peptidestructuresService.getFirstPage(idFP).subscribe(
        (data: Array<object>) => {
          this.struct_data = data['results'];
        });
    }
  }
   */
  // verifies if there is additional data
  fetchData(id_prot: string, idFP: string): any {
    /**
     * Function to verify if there are related data in the database.
     */
    this.prot_data = [];
    this.ref_data = [];
    this.struct_data = [];
    this.proteinService.getPage(1, 'Prot', id_prot, id_prot).subscribe(
      (data: Array<object>) => {
        this.prot_data = data['results'];
      });
    this.peptidereferencesService.getFirstPage(idFP).subscribe(
      (data: Array<object>) => {
        this.ref_data = data['results'];
      });
    this.peptidestructuresService.getFirstPage(idFP).subscribe(
      (data: Array<object>) => {
        this.struct_data = data['results'];
      });
  }

  saveDataFile() {
    /**
     Function to retrieve all the query results and save it into file.
     */
    /**
     'idfusion_peptides';
     defaultColumns = ['residues', 'sequence', 'annotation_method', 'protein_name',
     'exp_evidence', 'protein', 'virus'
     */
    this.data_all = [] as any;
    let data_to_print = 'idfusion_peptides,residues,sequence,' +
      'annotation_method,exp_evidence,protein,protein_name,virus\n';
    let protein = '';
    let taxonomy = '';
    if (this.protParam !== null) {
      protein = this.protParam;
    }
    if (this.taxParam !== null) {
      taxonomy = this.taxParam;
    }
    this.fusionpeptideService.receive_all(this.search_form.value, protein, taxonomy).subscribe(
      (data: Array<object>) => {
        this.data_all = data;

        for (const i of this.data_all) {
          data_to_print = data_to_print + i['idfusion_peptides'] + ',' + i['residues'] + ',' + i['sequence'] + ','
            + i['annotation_method'] + ',' + i['exp_evidence']
            + ',' + i['protein'] + ',' + i['protein_name'] + ',' + i['virus'] + '\n';
        }

        this.keepData(data_to_print);

        /**
         const data_send = {data: data_print};
         this.fusionpeptideService.send(data_send).subscribe(
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
     Function to retrieve autocomplete sugestions for search form.
     */
    if (this.search_form.value.length > 1) {
      this.fusionpeptideService.get_autocomplete(this.search_form.value)
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
     Function to complement the function onSearchChange, so  retrieve autocomplete sugestions for search form.
     */
    let aux_string = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]['idfusion_peptides'].toString().toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['idfusion_peptides'].toString());
        continue;
      } else if (data[i]['protein_name'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['protein_name']);
        continue;
      } else if (data[i]['virus'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['virus']);
        continue;
      } else if (data[i]['residues'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['residues']);
        continue;
      } else if (data[i]['sequence'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['sequence']);
        continue;
      } else if (data[i]['annotation_method'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['annotation_method']);
        continue;
      } else if (data[i]['exp_evidence'].toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['exp_evidence']);
        continue;
      } else if (data[i]['protein'].toString().toUpperCase().includes(this.search_form.value.toUpperCase())) {
        aux_string.push(data[i]['protein'].toString());
        continue;
      }
    }
    this.autocomplete = Array.from(new Set(aux_string));
    if (this.autocomplete.length > 5) {
      this.autocomplete = this.autocomplete.slice(0, 5);
    }
  }


}


/**
 @Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})

 export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
 */
