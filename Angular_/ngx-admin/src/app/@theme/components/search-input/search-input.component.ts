import { Component, ElementRef, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import {ProteinService} from '../../../services/protein.service';
import {TaxonomyVirusService} from '../../../services/taxonomy-virus.service';
import {FusionPeptideService} from '../../../services/fusion-peptide.service';
import {FormControl} from '@angular/forms';
import { NbWindowService } from '@nebular/theme';
import { FormsComponent } from '../../../pages/forms/forms.component';

@Component({
  selector: 'ngx-search-input',
  styleUrls: ['./search-input.component.scss'],
  template: `
    <i class="control-icon ion ion-ios-search"
       (click)="showInput()"></i>
    <input placeholder="Type your search request here..."
           #input
           [class.hidden]="!isInputShown"
           (blur)="hideInput()"
           (input)="onInput($event)"
           [formControl]="search_form">
  `,
})
export class SearchInputComponent {
  @ViewChild('input', { static: false }) input: ElementRef;

  @Output() search: EventEmitter<string> = new EventEmitter<string>();


  constructor(private fusionpeptideService: FusionPeptideService,
              private proteinService: ProteinService,
              private taxonomyvirusService: TaxonomyVirusService,
              private windowService: NbWindowService) {}

  isInputShown = false;

  search_form = new FormControl('');

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

  fetchFusionPeptide(val) {
    let dataSource = []
    this.fusionpeptideService.getPage(1, '', val).subscribe((data: Array<object>) => {
      dataSource = data['results'];
    });
    if (dataSource !== []) {
      window.open('http://localhost:4200/pages/tables/fusion-peptide?search=' + val, '_blank');
    }
  }

  fetchProtein(val) {
    let dataSource = []
    this.proteinService.getPage(1, '', val).subscribe((data: Array<object>) => {
      dataSource = data['results'];
    });
    if (dataSource !== []) {
      window.open('http://localhost:4200/pages/tables/protein?search=' + val, '_blank');
    }
  }

  fetchTaxonomyVirus(val) {
    let dataSource = []
    this.taxonomyvirusService.getPage(1, val).subscribe((data: Array<object>) => {
      dataSource = data['results'];
    });
    if (dataSource !== []) {
      window.open('http://localhost:4200/pages/tables/taxonomy-virus?search=' + val, '_blank');
    }
  }

}
