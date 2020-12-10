import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PeptideReferencesService} from '../../../services/peptide-references.service';
import {DomSanitizer} from '@angular/platform-browser';

import {
  NbGetters,
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
} from '@nebular/theme';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {EnvService} from '../../../services/env.service';


interface PeptideReferencesInterface {
  idpeptide?: string;
  residues?: string;
  sequence?: string;
  annotation_method?: string;
  exp_evidence?: string;
  protein?: string;
  virus?: string;
  doi?: string;
  idreferences?: string;
  children?: PeptideReferencesInterface[];
  expanded?: boolean;
}

@Component({
  selector: 'ngx-peptide-references',
  templateUrl: './peptide-references.component.html',
  styleUrls: ['./peptide-references.component.scss'],
})

export class PeptideReferencesComponent implements OnInit {

  customColumn = 'idpeptide';
  defaultColumns = ['residues', 'sequence', 'annotation_method', 'exp_evidence',
    'protein', 'virus', 'doi', 'idreferences'];
  allColumns = [this.customColumn, ...this.defaultColumns];
  headers = {
    'idpeptide': 'Fusion Peptide ID', 'residues': 'Position', 'sequence': 'Sequence',
    'annotation_method': 'Annotation Method', 'protein_name': 'Protein Name',
    'exp_evidence': 'Experimental Evidence', 'protein': 'Protein\' ID', 'virus': 'Virus',
    'doi': 'DOI', 'idreferences': 'Reference\'s ID'
  };
  current_page = 1;
  count_entries: number;
  n_pags: number;
  peptParam: string;
  search_term: string = '29';
  data_aux = [] as any;
  data_all = [] as any;
  addPeptRef: FormGroup;
  addRef: FormGroup;
  putPeptRef: FormGroup;
  putRef: FormGroup;
  search_form = new FormControl('');
  aux_inter: PeptideReferencesInterface = {};
  dataSource: NbTreeGridDataSource<PeptideReferencesInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  add_form_ref: boolean = false;
  put_form_ref: boolean = false;
  add_form_pr: boolean = false;
  put_form_pr: boolean = false;

  fileUrl;
  data_print;

  API_URL = '';

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<PeptideReferencesInterface>,
              private peptidereferencesService: PeptideReferencesService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private env: EnvService,
  ) {
    this.API_URL = env.apiUrl;
  }

  ngOnInit() {
    this.fetchPeptideReference();

    this.addPeptRef = this.formBuilder.group({
      idpeptide: new FormControl('', [
        Validators.required,
      ]),
      idreferences: new FormControl('', [
        Validators.required,
      ]),
    });
    this.addRef = this.formBuilder.group({
      idreferences: new FormControl('', [
        Validators.required,
      ]),
      type_reference: new FormControl(),
      doi: new FormControl('', [
        Validators.required,
      ]),
    });
    this.addRef.patchValue({
      idreferences: '10000',
    });

    this.putPeptRef = this.formBuilder.group({
      idpeptide: new FormControl('', [
        Validators.required,
      ]),
      idreferences: new FormControl('', [
        Validators.required,
      ]),
    });
    this.putRef = this.formBuilder.group({
      idreferences: new FormControl('', [
        Validators.required,
      ]),
      type_reference: new FormControl(),
      doi: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  fetchPeptideReference() {
    this.peptParam = this.route.snapshot.queryParamMap.get('idpeptide');
    if (this.peptParam !== null) {
      this.search_term = this.peptParam;
    }
    this.peptidereferencesService.getFirstPage(this.search_term, this.search_form.value, this.current_page).subscribe(
      (data: Array<object>) => {
        const getters: NbGetters<PeptideReferencesInterface, PeptideReferencesInterface> = {
          dataGetter: (node: PeptideReferencesInterface) => node,
          childrenGetter: (node: PeptideReferencesInterface) => node.children || undefined,
          expandedGetter: (node: PeptideReferencesInterface) => !!node.expanded,
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
    this.fetchPeptideReference();
  }

  // function fetches the next paginated items by using the url in the next property
  fetchNext() {
    if (this.current_page < this.n_pags) {
      this.current_page = this.current_page + 1;
    }
    this.fetchPeptideReference();
  }

  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    if (this.current_page > 1) {
      this.current_page = this.current_page - 1;
    }
    this.fetchPeptideReference();
  }

  // function fetches the first paginated items by using the url in the next property
  fetchFirst() {
    this.current_page = 1;
    this.fetchPeptideReference();
  }

  // function fetches the last paginated items by using the url in the previous property
  fetchLast() {
    this.current_page = this.n_pags;
    this.fetchPeptideReference();
  }

  goToUrl(newUrl, add = false): void {
    if (add === false) {
      if (newUrl !== null) {
        window.open(newUrl, '_blank');
      }
    }
    // tslint:disable-next-line:one-line
    else {
      window.open(`${this.API_URL}/admin/crmapp/peptidereferences/`,
        '_blank');
      window.open(`${this.API_URL}/admin/crmapp/references/`,
        '_blank');
    }
  }

  onSubmitPR(put: boolean = false) {
    if (!put) {
      if (this.addPeptRef.valid) {
        // this.taxonomyvirusService.add(this.addVirusForm as TaxonomyVirusInterface);
        this.peptidereferencesService.add(this.addPeptRef.value)
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
        alert('Required both parameters to be filled.');
      }
    } else {
      if (this.putPeptRef.valid) {
        // this.taxonomyvirusService.add(this.addVirusForm as TaxonomyVirusInterface);
        this.peptidereferencesService.put(this.putPeptRef.value, this.putPeptRef.value['idpeptide'])
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
        alert('Required both parameters to be filled.');
      }
    }
  }

  onSubmitRef(put: boolean = false) {
    if (!put) {
      if (this.addRef.valid) {
        // this.taxonomyvirusService.add(this.addVirusForm as TaxonomyVirusInterface);
        this.peptidereferencesService.addRef(this.addRef.value)
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
        alert('Required at least the reference parameter to be filled.');
      }
    } else {
      if (this.putRef.valid) {
        // this.taxonomyvirusService.add(this.addVirusForm as TaxonomyVirusInterface);
        this.peptidereferencesService.putRef(this.putRef.value, this.putRef.value['idreferences'])
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
        alert('Required at least the reference parameter to be filled.');
      }
    }
  }

  saveDataFile() {
    /**
     customColumn = 'idpeptide';
     defaultColumns = ['residues', 'sequence', 'annotation_method', 'exp_evidence',
     'protein', 'virus', 'doi', 'idreferences'];
     */
    this.data_all = [] as any;
    let data_to_print = 'idpeptide,residues,sequence,annotation_method,exp_evidence,protein,virus,idreferences,doi\n';
    let peptide = '';
    if (this.peptParam !== null) {
      peptide = this.peptParam;
    }
    this.peptidereferencesService.receive_all(this.search_form.value, peptide).subscribe(
      (data: Array<object>) => {
        this.data_all = data;

        for (const i of this.data_all) {
          data_to_print = data_to_print + i['idpeptide'] + ',' + i['residues'] + ',' + i['sequence'] + ','
            + i['annotation_method'] + ',' + i['exp_evidence']
            + ',' + i['protein'] + ',' + i['virus'] + ',' + i['idreferences'] + ',' + i['doi'] + '\n';
        }

        this.keepData(data_to_print);

        /**
         const data_send = {data: data_print};
         this.peptidereferencesService.send(data_send).subscribe(
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

  addDataForm_pr() {
    this.add_form_pr = true;
    this.put_form_pr = false;
  }

  putDataForm_pr() {
    this.put_form_pr = true;
    this.add_form_pr = false;
  }

  addDataForm_ref() {
    this.add_form_ref = true;
    this.put_form_ref = false;
  }

  putDataForm_ref() {
    this.put_form_ref = true;
    this.add_form_ref = false;
  }

  keepData(data: string) {
    this.data_print = data;

    const blob = new Blob([this.data_print], {type: 'text/csv'});

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

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







 export class PeptideReferencesComponent implements OnInit {
  dataSource = [];
  constructor(private peptideReferencesService: PeptideReferencesService) { }
  ngOnInit() {
    this.fetchTaxonomyVirus();
  }
  fetchTaxonomyVirus() {
    this.peptideReferencesService.getFirstPage().subscribe((data: Array<object>) => {
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
      idpeptide: {
        title: 'ID',
        type: 'string',
      },
      doi: {
        title: 'DOI',
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
