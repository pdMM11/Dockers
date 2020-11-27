import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'ngx-blast-ncbi',
  templateUrl: './blast-ncbi.component.html',
  styleUrls: ['./blast-ncbi.component.scss'],
})
export class BlastNcbiComponent implements OnInit {
  selectedItem = 'nr';
  query_seq = '';
  sequence = new FormControl('');
  options = [
    {value: 'kmerBlastp', label: 'Quick BLASTP (Accelerated protein-protein BLAST)'},
    {value: 'blastp', label: 'blastp (protein-protein BLAST)', checked: true},
    {value: 'psiBlast', label: 'PSI-BLAST (Position-Specific Iterated BLAST)'},
    {value: 'phiBlast', label: 'PHI-BLAST (Pattern Hit Initiated BLAST)'},
    {value: 'deltaBlast', label: 'DELTA-BLAST (Domain Enhanced Lookup Time Accelerated BLAST)'},
  ];
  option = 'blastp';

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.query_seq = this.route.snapshot.queryParamMap.get('sequence');
  }

  gotoNCBI(): void {
    if (this.sequence.value !== null && this.sequence.value !== ''
      && this.sequence.value.includes('>')) {
      window.open('https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&QUERY=' + encodeURI(this.sequence.value)
        + '&DATABASE=' + this.selectedItem + '&BLAST_PROGRAMS=' + this.option, '_blank');
    } else if (this.query_seq !== null && this.query_seq !== '' && this.query_seq.includes('>')) {
      window.open('https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Proteins&QUERY=' + encodeURI(this.query_seq)
        + '&DATABASE=' + this.selectedItem + '&BLAST_PROGRAMS=' + this.option, '_blank');
    } else {
      alert('ERROR: SEQUENCE NEEDS TO BE FILLED IN FASTA FORMAT');
    }
  }
}

