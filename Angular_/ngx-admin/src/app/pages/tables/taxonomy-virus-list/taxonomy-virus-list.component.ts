import { Component, OnInit } from '@angular/core';
import { TaxonomyVirusService } from '../../../services/taxonomy-virus.service';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';



@Component({
  selector: 'ngx-app-taxonomy-virus-list',
  templateUrl: './taxonomy-virus-list.component.html',
  styleUrls: ['./taxonomy-virus-list.component.scss'],
})
export class TaxonomyVirusListComponent implements OnInit {
  selected: object;
  current_page = 1;
  dataSource = [];

  constructor(private taxonomyvirusService: TaxonomyVirusService) { }
  ngOnInit() {
    this.fetchTaxonomyVirus();
  }
  fetchTaxonomyVirus() {
    this.taxonomyvirusService.getPage(this.current_page).subscribe((data: Array<object>) => {
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
      commonname: {
        title: 'Common Name',
        type: 'string',
      },
      family: {
        title: 'Family',
        type: 'string',
      },
      genre: {
        title: 'Genus',
        type: 'string',
      },
      species: {
        title: 'Species',
        type: 'string',
      },
      subspecies: {
        title: 'Subspecies',
        type: 'string',
      },
      ncbitax: {
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

  // function fetches the next paginated items by using the url in the next property
  fetchNext() {
    this.current_page = this.current_page + 1;
    this.fetchTaxonomyVirus();
  }
  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    if (this.current_page > 1) this.current_page = this.current_page - 1;
    this.fetchTaxonomyVirus();
  }
}


