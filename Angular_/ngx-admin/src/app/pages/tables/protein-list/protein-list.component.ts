import { Component, OnInit } from '@angular/core';
import { ProteinService } from '../../../services/protein.service';

import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';



@Component({
  selector: 'ngx-app-protein-list',
  templateUrl: './protein-list.component.html',
  styleUrls: ['./protein-list.component.scss'],
})
export class ProteinListComponent implements OnInit {
  selected: object;
  current_page = 1;
  dataSource = [];
  constructor(private proteinService: ProteinService) {}

  ngOnInit() {
    this.fetchProtein();
  }

  fetchProtein() {
    this.proteinService.getPage(this.current_page).subscribe((data: Array<object>) => {
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
      name: {
        title: 'Name',
        type: 'string',
      },
      class_field: {
        title: 'Class',
        type: 'string',
      },
      activation: {
        title: 'Activation',
        type: 'string',
      },
      name_fusogenic_unit: {
        title: 'Name Fusogenic Unit',
        type: 'string',
      },
      location_fusogenic: {
        title: 'Location Fusogenic',
        type: 'string',
      },
      sequence_fusogenic: {
        title: 'Sequence fusogenic',
        type: 'string',
      },
      uniprotid: {
        title: 'UniProtID',
        type: 'string',
      },
      ncbiid: {
        title: 'NcbiID',
        type: 'string',
      },
      idtaxonomy: {
        title: 'Id Taxonomy',
        type: 'string',
      },
      virus: {
        title: 'Virus',
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
    this.fetchProtein();
  }
  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    if (this.current_page > 1) this.current_page = this.current_page - 1;
    this.fetchProtein();
  }


}
