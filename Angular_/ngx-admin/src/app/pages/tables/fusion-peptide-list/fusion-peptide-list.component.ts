import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FusionPeptideService } from '../../../services/fusion-peptide.service';
import { ProteinService } from '../../../services/protein.service';
import { PeptideReferencesService } from '../../../services/peptide-references.service';
import { PeptideStructuresService } from '../../../services/peptide-structures.service';
import { TaxonomyVirusService } from '../../../services/taxonomy-virus.service';
import { TaxHostService } from '../../../services/tax-host.service';


@Component({
  selector: 'ngx-app-fusion-peptide-list',
  templateUrl: './fusion-peptide-list.component.html',
  styleUrls: ['./fusion-peptide-list.component.scss'],
})
export class FusionPeptideListComponent implements OnInit {
  selected_data: object;
  current_page = 1;
  dataSource = [];
  count_entries: number;
  n_pags: number;
  protein = [];
  virus = [];
  hosts = [];
  structures = [];
  references = [];
  printstuff: string;
  constructor(private fusionpeptideService: FusionPeptideService,
              private proteinService: ProteinService,
              private taxonomyvirusService: TaxonomyVirusService,
              private peptidereferenceService: PeptideReferencesService,
              private peptidestructuresService: PeptideStructuresService,
              private taxhostService: TaxHostService) {} // private route: ActivatedRoute
  ngOnInit() {
    this.fetchFusionPeptide();
  }
  fetchFusionPeptide() {
    this.fusionpeptideService.getPage(this.current_page).subscribe((data: Array<object>) => {
      this.dataSource = data['results'];
      this.count_entries = data['count'];
      this.n_pags = Math.round(this.count_entries / 10) + 1;
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
      idfusion_peptides: {
        title: 'ID',
        type: 'string',
      },
      residues: {
        title: 'Position',
        type: 'string',
      },
      sequence: {
        title: 'Sequence',
        type: 'string',
      },
      annotation_method: {
        title: 'Annotation Method',
        type: 'string',
      },
      exp_evidence: {
        title: 'Experimental Evidence',
        type: 'string',
      },
      protein: {
        title: 'Protein',
        type: 'string',
      },

      virus: {
        title: 'virus',
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
  onUserRowSelect(event): void {
    /**
    this.selected_data = event.data;
    this.proteinService.getPage(1, 'Prot', this.selected_data['protein']).subscribe(
      (data: Array<object>) => {
      this.protein = data['results'];
      // this.printstuff = this.protein[0]['name'];
    });
    this.taxonomyvirusService.getPage(1, '', true, this.selected_data['idtaxonomy'].substring(
      this.selected_data['idtaxonomy'].indexOf('(') + 1, this.selected_data['idtaxonomy'].length - 1)).subscribe(
      (data: Array<object>) => { // arranjar modo de no django aparecer um integer
        this.virus = data['results'];
      });
    this.peptidereferenceService.getFirstPage(this.selected_data['idfusion_peptides']).subscribe(
      (data: Array<object>) => {
        this.references = data['results'];
      });
    this.peptidestructuresService.getFirstPage(this.selected_data['idfusion_peptides']).subscribe(
      (data: Array<object>) => {
        this.structures = data['results'];
      });
    this.taxhostService.getFirstPage(this.selected_data['idtaxonomy'].substring(
      this.selected_data['idtaxonomy'].indexOf('(') + 1, this.selected_data['idtaxonomy'].length - 1)).subscribe(
      (data: Array<object>) => { // arranjar modo de no django aparecer um integer
        this.hosts = data['results'];
      });
     */
  }

  // function fetches the next paginated items by using the url in the next property
  fetchNext() {
    if (this.current_page < this.n_pags) this.current_page = this.current_page + 1;
    this.fetchFusionPeptide();
  }
  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    if (this.current_page > 1) this.current_page = this.current_page - 1;
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
}



