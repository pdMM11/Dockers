import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'ngx-hmmer',
  templateUrl: './hmmer.component.html',
  styleUrls: ['./hmmer.component.scss'],
})
export class HmmerComponent implements OnInit {
  query_seq = '';
  sequence = new FormControl('');
  selectedItem = 'uniprotrefprot';

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.query_seq = this.route.snapshot.queryParamMap.get('sequence');
  }

  gotoEBI(): void {
    /**
     If there is a valid sequence, this functions opens a new tab to https://www.ebi.ac.uk/Tools/hmmer/search/phmmer,
     providing the sequence and database.
     */
    if (this.sequence.value !== null && this.sequence.value !== '') {
      window.open('https://www.ebi.ac.uk/Tools/hmmer/search/phmmer?seq=' + encodeURI(this.sequence.value)
        + '&seqdb=' + this.selectedItem, '_blank');
    } else if (this.query_seq !== null && this.query_seq !== '') {
      window.open('https://www.ebi.ac.uk/Tools/hmmer/search/phmmer?seq=' + encodeURI(this.query_seq)
        + '&seqdb=' + this.selectedItem, '_blank');
    } else {
      alert('ERROR: SEQUENCE NEEDS TO BE FILLED');
    }
  }
}
