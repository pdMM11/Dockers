import {Component, Input, OnInit} from '@angular/core';
import {ProteinReferencesService} from '../../../services/protein-references.service';
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


interface ProteinReferencesInterface {
  idprotein?: string;
  name?: string;
  class_field?: string;
  activation?: string;
  name_fusogenic_unit?: string;
  location_fusogenic?: string;
  sequence_fusogenic?: string;
  uniprotid?: string;
  ncbiid?: string;
  idtaxonomy?: string;
  virus?: string;
  doi?: string;
  children?: ProteinReferencesInterface[];
  expanded?: boolean;
}


@Component({
  selector: 'ngx-protein-references',
  templateUrl: './protein-references.component.html',
  styleUrls: ['./protein-references.component.scss'],
})


export class ProteinReferencesComponent implements OnInit {

  customColumn = 'idprotein';
  defaultColumns = ['name', 'class_field', 'activation', 'name_fusogenic_unit',
    'location_fusogenic', 'sequence_fusogenic', 'uniprotid', 'ncbiid',
    'idtaxonomy', 'virus', 'doi', 'idreferences'];
  allColumns = [this.customColumn, ...this.defaultColumns];
  headers = {'idprotein': 'ID', 'name': 'Protein Name', 'class_field': 'Class',
    'activation': 'Activation Method', 'name_fusogenic_unit': 'Name of Fusogenic Unit',
    'location_fusogenic': 'Location of Fusogenic Unit', 'sequence_fusogenic': 'Sequence of Fusogenic Unit',
    'uniprotid': 'UniProt ID', 'ncbiid': 'NCBI Protein ID', 'idtaxonomy': 'Taxonomy ID', 'virus': 'Virus',
    'doi': 'DOI', 'idreferences': 'Reference\'s ID'};
  current_page = 1;
  count_entries: number;
  n_pags: number;
  addProtRef: FormGroup;
  addRef: FormGroup;
  putProtRef: FormGroup;
  putRef: FormGroup;
  search_form = new FormControl('');
  protParam: string;
  search_term: string = '49';
  data_aux = [] as any;
  data_all = [] as any;

  aux_inter: ProteinReferencesInterface = {};
  dataSource: NbTreeGridDataSource<ProteinReferencesInterface>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  add_form_ref: boolean = false;
  put_form_ref: boolean = false;
  add_form_pr: boolean = false;
  put_form_pr: boolean = false;

  fileUrl;
  data_print;

  API_URL = '';

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<ProteinReferencesInterface>,
              private proteinreferencesService: ProteinReferencesService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer,
              private env: EnvService,
  ) {
    this.API_URL = env.apiUrl;
  }


  ngOnInit() {
    this.fetchProteinReference();

    this.addProtRef = this.formBuilder.group({
      idprotein: new FormControl('', [
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
    this.putProtRef = this.formBuilder.group({
      idprotein: new FormControl('', [
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

  fetchProteinReference() {
    this.protParam = this.route.snapshot.queryParamMap.get('idprot');
    if (this.protParam !== null) {
      this.search_term = this.protParam;
    }
    this.proteinreferencesService.getFirstPage(this.search_term, this.search_form.value, this.current_page).subscribe(
      (data: Array<object>) => {
        const getters: NbGetters<ProteinReferencesInterface, ProteinReferencesInterface> = {
          dataGetter: (node: ProteinReferencesInterface) => node,
          childrenGetter: (node: ProteinReferencesInterface) => node.children || undefined,
          expandedGetter: (node: ProteinReferencesInterface) => !!node.expanded,
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


  // function fetches the next paginated items by using the url in the next property
  fetchNext() {
    if (this.current_page < this.n_pags) {
      this.current_page = this.current_page + 1;
    }
    this.fetchProteinReference();
  }

  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    if (this.current_page > 1) {
      this.current_page = this.current_page - 1;
    }
    this.fetchProteinReference();
  }

  // function fetches the first paginated items by using the url in the next property
  fetchFirst() {
    this.current_page = 1;
    this.fetchProteinReference();
  }

  // function fetches the last paginated items by using the url in the previous property
  fetchLast() {
    this.current_page = this.n_pags;
    this.fetchProteinReference();
  }

  onSubmitPR(put: boolean = false) {
    if (!put) {
      if (this.addProtRef.valid) {
        this.proteinreferencesService.add(this.addProtRef.value)
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
      if (this.putProtRef.valid) {
        this.proteinreferencesService.put(this.putProtRef.value, this.putProtRef.value['idprotein'])
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
        this.proteinreferencesService.addRef(this.addRef.value)
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
        this.proteinreferencesService.putRef(this.putRef.value, this.putRef.value['idreferences'])
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

  searchTableResult() {
    this.current_page = 1;
    this.fetchProteinReference();
  }

  goToUrl(newUrl, add = false): void {
    if (add === false) {
      if (newUrl !== null) {
        window.open(newUrl, '_blank');
      }
    }
    // tslint:disable-next-line:one-line
    else {
      window.open(`${this.API_URL}/admin/crmapp/proteinreferences/`,
        '_blank');
    }
  }

  saveDataFile() {
    /**
     customColumn = 'idprotein';
     defaultColumns = ['name', 'class_field', 'activation', 'name_fusogenic_unit',
     'location_fusogenic', 'sequence_fusogenic', 'uniprotid', 'ncbiid',
     'idtaxonomy', 'virus', 'doi', 'idreferences'];
     */
    this.data_all = [] as any;
    let data_to_print = 'idprotein,name,class_field,activation,name_fusogenic_unit,' +
      'location_fusogenic,sequence_fusogenic,uniprotid,ncbiid,' +
      'idtaxonomy,virus,doi,idreferences\n';
    let protein = '';
    if (this.protParam !== null) {
      protein = this.protParam;
    }
    this.proteinreferencesService.receive_all(this.search_form.value, protein).subscribe(
      (data: Array<object>) => {
        this.data_all = data;

        for (const i of this.data_all) {
          data_to_print = data_to_print + i['idprotein'] + ',' + i['name'] + ',' + i['class_field'] + ','
            + i['activation'] + ',' + i['name_fusogenic_unit']
            + ',' + i['location_fusogenic'] + ',' + i['sequence_fusogenic']
            + ',' + i['uniprotid'] + ',' + i['ncbiid'] + ',' + i['idtaxonomy'] + ',' + i['virus'] + ',' + i['doi']
            + ',' + i['idreferences'] + '\n';
        }

        this.keepData(data_to_print);

        /**
        const data_send = {data: data_print};
        this.proteinreferencesService.send(data_send).subscribe(
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

    const blob = new Blob([this.data_print], { type: 'text/csv' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

  }

}


/**
 export class ProteinReferencesComponent implements OnInit {
  dataSource = [];
  constructor(private proteinReferencesService: ProteinReferencesService) { }
  ngOnInit() {
    this.fetchTaxonomyVirus();
  }
  fetchTaxonomyVirus() {
    this.proteinReferencesService.getFirstPage().subscribe((data: Array<object>) => {
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
      idprotein: {
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
