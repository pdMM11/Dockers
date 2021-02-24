import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {WeblogoService} from '../../../services/weblogo.service';
import {HttpErrorResponse} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import {ProteinService} from '../../../services/protein.service';
import {isString} from 'util';


interface ProteinInterface {
  idprotein?: string;
  name?: string;
  class_field?: string;
  activation?: string;
  name_fusogenic_unit?: string;
  location_fusogenic?: string;
  sequence_fusogenic?: string;
  uniprotid?: object;
  ncbiid?: string;
  idtaxonomy?: object;
  virus?: string;
}

@Component({
  selector: 'ngx-weblogo',
  templateUrl: './weblogo.component.html',
  styleUrls: ['./weblogo.component.scss'],
})
export class WeblogoComponent implements OnInit {

  query_seq = '';
  sequence = new FormControl('');
  selectedItemPair = 'fast';
  selectedItemMat = 'blosum';
  option = ' ';
  clustal_result = '';

  isImageLoading = true;

  data_image = '';

  aux_data= '';

  select_color_weblogo = 'NajafabadiEtAl2017';
  stack_per_line = 25;

  // @ViewChild('imgRef', {static: false}) img: ElementRef;

  constructor(private route: ActivatedRoute,
              private domSanitizer: DomSanitizer,
              private cdRef: ChangeDetectorRef,
              private weblogo: WeblogoService,
              private protein: ProteinService) {
  }

  ngOnInit() {
    const query_seq_id = this.route.snapshot.queryParamMap.get('sequence');

    const seqs_id = query_seq_id.split(',');

    // let seqs_data = '';

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

  gotoWebLogo(image: boolean = true): void {
    /**
     This function sends valid protein sequences in FASTA format into a multiple alignment in the backend, and then
     send those results to http://weblogo.threeplusone.com/create.cgi to create WebLogos.
     */
    if (this.sequence.value !== null && this.sequence.value !== '' && this.sequence.value.includes('\n')) {
      this.weblogo.send(encodeURI(this.sequence.value)).subscribe(
        (data_send) => {
          this.clustal_result = data_send['data'];
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    } else if (this.query_seq !== null && this.query_seq !== '' && this.query_seq.includes('\n')) {
      this.weblogo.send(encodeURI(this.query_seq)).subscribe(
        (data_send) => {
          this.clustal_result = data_send['data'];
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }

    if (image) {
      if (this.sequence.value !== null && this.sequence.value !== '' && this.sequence.value.includes('\n')) {
        this.weblogo.send(this.sequence.value).subscribe(
          (data_send) => {
            this.clustal_result = data_send['data'];

            window.open('http://weblogo.threeplusone.com/create.cgi?sequences=' +
              encodeURI(this.clustal_result) +
              '&format=png_print&stacks_per_line=40&ignore_lower_case=true&unit_name=bits' +
              '&show_errorbars=true&show_fineprint=true', '_blank');
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      } else if (this.query_seq !== null && this.query_seq !== '' && this.query_seq.includes('\n')) {

        this.weblogo.send(this.query_seq).subscribe(
          (data_send) => {
            this.clustal_result = data_send['data'];

            window.open('http://weblogo.threeplusone.com/create.cgi?sequences=' +
              encodeURI(this.clustal_result) +
              '&format=png_print&stacks_per_line=40&ignore_lower_case=true&unit_name=bits' +
              '&show_errorbars=true&show_fineprint=true', '_blank');
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      } else {
        alert('ERROR: MULTIPLE SEQUENCE NEEDS TO BE FILLED');
      }
    } else {
      if (this.sequence.value !== null && this.sequence.value !== '' && this.sequence.value.includes('\n')) {

        this.weblogo.send(encodeURI(this.sequence.value)).subscribe(
          (data_send) => {
            this.clustal_result = data_send['data'];

            window.open('http://weblogo.threeplusone.com/create.cgi?sequences=' +
              encodeURI(this.clustal_result) +
              '&format=logodata&stacks_per_line=40&ignore_lower_case=true&unit_name=bits' +
              '&show_errorbars=true&show_fineprint=true', '_blank');
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      } else if (this.query_seq !== null && this.query_seq !== '' && this.query_seq.includes('\n')) {
        this.weblogo.send(encodeURI(this.query_seq)).subscribe(
          (data_send) => {
            this.clustal_result = data_send['data'];

            window.open('http://weblogo.threeplusone.com/create.cgi?sequences=' +
              encodeURI(this.clustal_result) +
              '&format=logodata&stacks_per_line=40&ignore_lower_case=true&unit_name=bits' +
              '&show_errorbars=true&show_fineprint=true', '_blank');
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          });
      } else {
        alert('ERROR: MULTIPLE SEQUENCE NEEDS TO BE FILLED');
      }
    }
  }

  getImageFromService() {

    /**
     This function sends valid protein sequences in FASTA format to the backend, and it returns the base-64 string
     of the Weblogo image.
     */
    this.isImageLoading = true;

    if ((this.query_seq.match(/>/g) || []).length > 2)  {
      this.weblogo.getImage(this.query_seq, 'png',
        this.stack_per_line, this.select_color_weblogo).subscribe(data => {

        // this.createImageFromBlob(data);

        let data_string = data as string;

        data_string = 'data:image/png;base64, ' + data_string;

        // alert(data_string);

        this.saveImage(data_string);
        // this.transform(data);
        this.isImageLoading = false;
      }, error => {
        this.isImageLoading = false;
        alert(error.message);
        // console.log(error);
      });
    } else if ((this.sequence.value.match(/>/g) || []).length > 2) {
      this.weblogo.getImage(this.sequence.value, 'png',
        this.stack_per_line, this.select_color_weblogo).subscribe(data => {

        // this.createImageFromBlob(data);

        let data_string = data as string;

        data_string = 'data:image/png;base64, ' + data_string;

        // alert(data_string);

        this.saveImage(data_string);
        // this.transform(data);
        this.isImageLoading = false;
      }, error => {
        this.isImageLoading = false;
        alert(error.message);
        // console.log(error);
      });
    } else {
      alert('ERROR: ENTER AT LEAST 3 SEQUENCES');
    }
  }

  /**
  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    // alert(JSON.stringify(JSON.stringify(image)));
    reader.addEventListener('load', () => {
      const data = reader.result as string;
      this.imageToShow = data;
      // this.imageToShow = this.domSanitizer.bypassSecurityTrustResourceUrl(data);
      alert(this.imageToShow);
      this.saveImage(data);
      // alert(data);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }
  */

  // Call this method in the image source, it will sanitize it.
  transform() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.data_image);
  }
  saveImage(data: any) {
    this.data_image = data;
    this.transform();
  }

  downloadWeblogoFile() {
    /**
     This function sends valid protein sequences in FASTA format to the backend, and it returns the text matrix
     of the Weblogo, which it will appear in a new tab.
     */
    if ((this.query_seq.match(/>/g) || []).length > 2)  {
      this.isImageLoading = true;
      this.weblogo.getImage(this.query_seq, 'txt',
        this.stack_per_line, this.select_color_weblogo).subscribe(data => {
        const data_result = data as string;
        const blob = new Blob([data_result], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }, error => {
        this.isImageLoading = false;
        alert(error.message);
      });
    } else if ((this.sequence.value.match(/>/g) || []).length > 2) {
        this.isImageLoading = true;
        this.weblogo.getImage(this.query_seq, 'txt',
          this.stack_per_line, this.select_color_weblogo).subscribe(data => {
          const data_result = data as string;
          const blob = new Blob([data_result], {type: 'text/plain'});
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        }, error => {
          this.isImageLoading = false;
          alert(error.message);
        });
    } else {
      alert('ERROR: ENTER AT LEAST 3 SEQUENCES');
    }
    /**
    this.isImageLoading = true;
    this.weblogo.getImage(this.query_seq, 'txt').subscribe(data => {
      const blob = new Blob([data], {type: 'text/plain'});
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    }, error => {
      this.isImageLoading = false;
      alert('ERROR');
    });
     */
  }


  /**
  getBlob (b64Data) {
    contentType = '';
    sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
   */

}

/**
 PythonShell = require('python-shell');

 options = {
    mode: 'text',
    pythonPath: 'path/to/python',
    pythonOptions: ['-u'],
    scriptPath: 'path/to/my/scripts',
    args: ['value1', 'value2', 'value3'],
  };
 this.PythonShell.run('BLAST_VFP.py', this.options, function (err, results) {
      if (err)
        throw err;
      // Results is an array consisting of messages collected during execution
      console.log('results: %j', results);
    });
 */
