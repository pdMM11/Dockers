import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
// import {WeblogoService} from "../../../services/weblogo.service";
import {ProteinService} from '../../../services/protein.service';
import {ClustalService} from '../../../services/clustal.service';

@Component({
  selector: 'ngx-clustal',
  templateUrl: './clustal.component.html',
  styleUrls: ['./clustal.component.scss'],
})
export class ClustalComponent implements OnInit {
  selectedItemPair = 'fast';
  selectedItemMat = 'blosum';
  query_seq = '';
  sequence = new FormControl('');
  options = [
    {value: ' ', label: 'CLUSTAL W', checked: true},
    {value: 'fasta', label: 'FASTA'},
    {value: 'phylip', label: 'PHYLIP'},
  ];
  option = ' ';
  dists = false;
  guide_tree = false;

  constructor(private route: ActivatedRoute,
              private clustal: ClustalService,
              private protein: ProteinService) {
  }

  ngOnInit() {
    const query_seq_id = this.route.snapshot.queryParamMap.get('sequence');

    const seqs_id = query_seq_id.split(',');

    // let seqs_data = '';
    // this cicle retrieves sequences from the ID's in the URL
    for (let i = 0; i < seqs_id.length; i++) {
      // seqs_data = seqs_data + '>' + seqs_id[i] + '\n';
      this.protein.getPage(1, 'Prot', '', seqs_id[i]).subscribe((data: Array<object>) => {
        this.aux_query_seq(seqs_id[i], data['results'][0]['sequence_fusogenic']);
      });
      // seqs_data = seqs_data + this.aux_data + '\n';
      // alert(seqs_data);
    }
    // this.query_seq = this.aux_data;
  }

  aux_query_seq(seqid, data) {
    this.query_seq = this.query_seq + '>' + seqid + '\n' + data + '\n';
  }

  gotoEBI(): void {
    /**
     If there are valid sequences in FASTA format, this functions opens a new tab to
     https://www.genome.jp/tools-bin/clustalw, providing the sequences and other paramethers necessary to the alignment
     */
    if (this.sequence.value !== null && this.sequence.value !== ''
      && this.sequence.value.includes('\n') && this.sequence.value.includes('>')) {
      window.open('https://www.genome.jp/tools-bin/clustalw?output=' +
        encodeURI(this.option) +
        '&pwalignment=' + this.selectedItemPair + '&type=protein&sequence=' +
        encodeURI(this.sequence.value) +
        '&outfmt=' + this.option + '&gapopen=10&gapext=0.05&transitions=No&hgapresidues=GPSNQERK&nohgap=Yes&' +
        'pwmatrix=' + this.selectedItemMat +
        '&ktuple=1&window=5&pairgap=3&topdiags=5&score=PERCENT&pwgapopen=10.0&pwgapext=0.1' +
        '&matrix=' + this.selectedItemMat, '_blank');
    } else if (this.query_seq !== null && this.query_seq !== ''
      && this.query_seq.includes('\n') && this.query_seq.includes('>')) {
      window.open('https://www.genome.jp/tools-bin/clustalw?output=' +
        encodeURI(this.option) +
        '&pwalignment=' + this.selectedItemPair + '&type=protein&sequence=' +
        encodeURI(this.query_seq) +
        '&outfmt=' + this.option + '&gapopen=10&gapext=0.05&transitions=No&hgapresidues=GPSNQERK&nohgap=Yes&' +
        'pwmatrix=' + this.selectedItemMat +
        '&ktuple=1&window=5&pairgap=3&topdiags=5&score=PERCENT&pwgapopen=10.0&pwgapext=0.1' +
        '&matrix=' + this.selectedItemMat, '_blank');
    } else {
      alert('ERROR: MULTIPLE SEQUENCE NEEDS TO BE FILLED in FASTA FORMAT');
    }
  }

  gotoClustal(): void {
    /**
     If there are valid sequences in FASTA format, this functions opens up to 2 new tabs, one with the result of the
     Clusltal multiple alignment performed in the backend, another (optional) with the guide tree output
     */
    let seqSend = '';
    if (this.sequence.value !== null && this.sequence.value !== ''
      && this.sequence.value.includes('\n') && this.sequence.value.includes('>')) {
      seqSend = this.sequence.value;
    }  else if (this.query_seq !== null && this.query_seq !== ''
      && this.query_seq.includes('\n') && this.query_seq.includes('>')) {
      seqSend = this.query_seq;
    } else {
      alert('ERROR: MULTIPLE SEQUENCE NEEDS TO BE FILLED in FASTA FORMAT');
    }
    if (seqSend !== '') {
      this.clustal.clustalBackend(seqSend, this.option,
        this.guide_tree, this.selectedItemMat).subscribe(data => {

        let data_result = data['align'] as string;
        let blob = new Blob([data_result], {type: 'text/plain'});
        let url = window.URL.createObjectURL(blob);
        window.open(url);
        /**
         if (this.dists) {
          data_result = data['dists'] as string;
          blob = new Blob([data_result], {type: 'text/plain'});
          url = window.URL.createObjectURL(blob);
          window.open(url);
        }
         */
        if (this.guide_tree) {
          data_result = data['tree'] as string;
          blob = new Blob([data_result], {type: 'text/plain'});
          url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      }, error => {
        alert(error.message);
      });
      /**
      this.clustal.clustalTreeBackend().subscribe(data => {
        const data_result = data as string;
        const blob = new Blob([data_result], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }, error => {
        alert(error.message);
      });
       */
    }
  }
  checkboxes(dists: boolean) {
    /**
     * Function to update the value of the checkboxes
     */
    if (dists) {
      if (this.dists) {
        this.dists = false;
      } else {
        this.dists = true;
      }
    } else {
      if (this.guide_tree) {
        this.guide_tree = false;
      } else {
        this.guide_tree = true;
      }
    }
  }
}
