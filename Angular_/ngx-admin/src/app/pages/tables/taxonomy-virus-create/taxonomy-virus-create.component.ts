import { Component, OnInit } from '@angular/core';
import { TaxonomyVirusService } from '../../../services/taxonomy-virus.service';

@Component({
  selector: 'ngx-app-taxonomy-virus-create',
  templateUrl: './taxonomy-virus-create.component.html',
  styleUrls: ['./taxonomy-virus-create.component.scss'],
})
export class TaxonomyVirusCreateComponent implements OnInit {

  constructor(private taxonomyvirusService: TaxonomyVirusService) {
  }

  ngOnInit() {
  }

  newTaxonomyVirus() {
    // this.taxonomyvirusService.postEntry().subscribe((data: Array<object>) => {});
  }
}
