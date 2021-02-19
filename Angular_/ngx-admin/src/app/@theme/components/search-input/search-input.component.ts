import {Component, ElementRef, EventEmitter, Output, ViewChild, TemplateRef} from '@angular/core';
import {ProteinService} from '../../../services/protein.service';
import {TaxonomyVirusService} from '../../../services/taxonomy-virus.service';
import {FusionPeptideService} from '../../../services/fusion-peptide.service';
import {FormControl} from '@angular/forms';
import {NbWindowService} from '@nebular/theme';
import {FormsComponent} from '../../../pages/forms/forms.component';
import {HttpErrorResponse} from '@angular/common/http';

interface StateGroup {
  page: string;
  sugestions: string[];
}

@Component({
  selector: 'ngx-search-input',
  styleUrls: ['./search-input.component.scss'],
  template: `
    <i class="control-icon ion ion-ios-search"
       (click)="showInput()"></i>
    <input placeholder="Type your search term here"
           #input
           [class.hidden]="!isInputShown"
           (blur)="hideInput()"
           (input)="onChange($event.target.value)"
           [formControl]="search_form"
           [matAutocomplete]="autoGroup"
           (keyup.enter)="onInput($event)"
    >
    <mat-autocomplete #autoGroup="matAutocomplete">
      <mat-optgroup *ngFor="let group of autocomplete" [label]="group.page">
        <mat-option *ngFor="let name of group.sugestions" [value]="name">
          {{name}}
        </mat-option>
      </mat-optgroup>
    </mat-autocomplete>
  `,
})
export class SearchInputComponent {
  @ViewChild('input', {static: false}) input: ElementRef;

  @Output() search: EventEmitter<string> = new EventEmitter<string>();


  constructor(private fusionpeptideService: FusionPeptideService,
              private proteinService: ProteinService,
              private taxonomyvirusService: TaxonomyVirusService,
              private windowService: NbWindowService) {
  }

  isInputShown = false;

  search_form = new FormControl('');
  autocomplete: StateGroup[] = [];

  showInput() {
    this.isInputShown = true;
    this.input.nativeElement.focus();
  }

  hideInput() {
    this.isInputShown = false;
  }

  onInput(val: string) {
    this.search.emit(val);
    // this.fetchFusionPeptide(val);
    // this.fetchProtein(val);
    // this.fetchTaxonomyVirus(val);
  }
  onChange(searchValue: string) {
    alert(searchValue);
    alert(this.search_form.value);
    if (this.search_form.value.length > 1) {
      this.onSearchChange_prot();
      this.onSearchChangeFP();
      this.onSearchChange_Tax();
    } else {
      this.autocomplete = [];
    }
  }

  fetchFusionPeptide(val) {
    /**
     Results from the Search against Fusion Peptide table.
     */
    let dataSource = []
    this.fusionpeptideService.getPage(1, '', val).subscribe((data: Array<object>) => {
      dataSource = data['results'];
    });
    if (dataSource !== []) {
      window.open('http://localhost:4200/pages/tables/fusion-peptide?search=' + val, '_blank');
    }
  }

  fetchProtein(val) {
    /**
     Results from the Search against Fusion Protein table.
     */
    let dataSource = []
    this.proteinService.getPage(1, '', val).subscribe((data: Array<object>) => {
      dataSource = data['results'];
    });
    if (dataSource !== []) {
      window.open('http://localhost:4200/pages/tables/protein?search=' + val, '_blank');
    }
  }

  fetchTaxonomyVirus(val) {
    /**
     Results from the Search against Taxonomy Virus table.
     */
    let dataSource = []
    this.taxonomyvirusService.getPage(1, val).subscribe((data: Array<object>) => {
      dataSource = data['results'];
    });
    if (dataSource !== []) {
      window.open('http://localhost:4200/pages/tables/taxonomy-virus?search=' + val, '_blank');
    }
  }

  onSearchChange_prot(): void {
    /**
     Function to retrieve autocomplete sugestions from the Fusion Protein page for the search form.
     */
    this.proteinService.get_autocomplete(this.search_form.value)
      .subscribe((data) => {
          this.complete_aux_prot(data['results']);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
  }

  complete_aux_prot(data: any) {
    /**
     Function to complement the function onSearchChange_prot,
     so to retrieve autocomplete sugestions for the search form.
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
    let aux_array = Array.from(new Set(aux_string));
    if (aux_array.length > 5) {
      aux_array = aux_array.slice(0, 5);
    }
    this.autocomplete.push({page: 'Fusion Proteins', sugestions: aux_array});
  }

  onSearchChangeFP(): void {
    /**
     Function to retrieve autocomplete sugestions from the Fusion Peptide page for the search form.
     */
    this.fusionpeptideService.get_autocomplete(this.search_form.value)
      .subscribe(
        (data) => {
          this.complete_aux_fp(data['results']);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
  }

  complete_aux_fp(data: any) {
    /**
     Function to complement the function onSearchChangeFP, so to retrieve autocomplete sugestions for the search form.
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
    let aux_array = Array.from(new Set(aux_string));
    if (aux_array.length > 5) {
      aux_array = aux_array.slice(0, 5);
    }
    this.autocomplete.push({page: 'Fusion Peptides', sugestions: aux_array});
  }

  onSearchChange_Tax(): void {
    /**
     Function to retrieve autocomplete sugestions from the Virus' Taxonomy page for search form.
     */
    this.taxonomyvirusService.get_autocomplete(this.search_form.value)
      .subscribe(
        (data) => {
          this.complete_aux_tax(data['results']);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
  }

  complete_aux_tax(data: any) {
    /**
     Function to complement the function onSearchChange_Tax, so to retrieve autocomplete sugestions for the search form.
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
    let aux_array = Array.from(new Set(aux_string));
    if (aux_array.length > 5) {
      aux_array = aux_array.slice(0, 5);
    }
    this.autocomplete.push({page: 'Virus\' Taxonomy', sugestions: aux_array});
  }

}
