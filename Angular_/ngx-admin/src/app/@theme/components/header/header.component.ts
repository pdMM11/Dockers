import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSearchService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import {UserData} from '../../../@core/data/users';
import {LayoutService} from '../../../@core/utils';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';


import {ProteinService} from '../../../services/protein.service';
import {TaxonomyVirusService} from '../../../services/taxonomy-virus.service';
import {FusionPeptideService} from '../../../services/fusion-peptide.service';
import {FormControl} from '@angular/forms';
import {FormsComponent} from '../../../pages/forms/forms.component';
import {NbWindowService} from '@nebular/theme';

import {TemplateRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('escClose', {static: false, read: TemplateRef}) escCloseTemplate: TemplateRef<HTMLElement>;
  @ViewChild('disabledEsc', {static: false, read: TemplateRef}) disabledEscTemplate: TemplateRef<HTMLElement>;

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  value = '';
  fp_data = [];
  prot_data = [];
  tax_data = [];

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  // userMenu = [{title: 'Profile'}, {title: 'Log out'}];
  userMenu = []
  search_form = new FormControl('');
  prots_autocomplete = [];
  fps_autocomplete = [];
  tax_autocomplete = [];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private authService: NbAuthService,
              private fusionpeptideService: FusionPeptideService,
              private proteinService: ProteinService,
              private taxonomyvirusService: TaxonomyVirusService,
              private searchService: NbSearchService,
              private windowService: NbWindowService,
              private route: ActivatedRoute,
              private router: Router) {
    this.searchService.onSearchSubmit()
      .subscribe((data: any) => {
        this.value = data.term;

        this.fetchFusionPeptide(this.value);
        this.fetchProtein(this.value);
        this.fetchTaxonomyVirus(this.value);
        this.onSearchChange_prot(this.value);
        this.onSearchChange_fp(this.value);
        this.onSearchChange_Tax(this.value);

        this.openWindow();

      });

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
          // here we receive a payload from the token and assigns it to our `user` variable
        }
      });
    if (this.user !== {}) {
      this.userMenu = [{title: 'Log out'}];
    }
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const {xl} = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({name}) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick().subscribe(( event ) => {
      this.onItemSelection(event.item.title);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  openResults(val: string, FP: boolean, Prot: boolean, Tax: boolean) {
    /**
     Results from the Search; each of the buttons will allow to navigate within the app to the intended results.
     */
    // let id = 1;
    if (FP) {
      /**
      const page_FP = window.open('http://localhost:4201/pages/tables/fusion-peptide?search=' + val, '_blank');
      // id = id + 1;
       */
      this.gotoURLSameApp('pages/tables/fusion-peptide?search=' + val);
    }
    if (Prot) {
      /**
      const page_Prot = window.open('http://localhost:4201/pages/tables/protein?search=' + val, '_blank');
      // id = id + 1;
       */
      this.gotoURLSameApp('pages/tables/protein?search=' + val);
    }
    if (Tax) {
      /**
      const page_Tax = window.open('http://localhost:4201/pages/tables/taxonomy-virus?search=' + val, '_blank');
      // id = id + 1;
       */
      this.gotoURLSameApp('pages/tables/taxonomy-virus?search=' + val);
    }
  }

  fetchFusionPeptide(val) {
    /**
     Results from the Search against Fusion Peptide table.
     */
    // let dataSource = [];
    this.fusionpeptideService.getPage(1, '', val).subscribe((data: Array<object>) => {
      this.fp_data = data['results'];
    });
  }

  fetchProtein(val) {
    /**
     Results from the Search against Fusion Protein table.
     */
    // let dataSource = [];
    this.proteinService.getPage(1, '', val).subscribe((data: Array<object>) => {
      this.prot_data = data['results'];
    });
  }

  fetchTaxonomyVirus(val) {
    /**
     Results from the Search against Taxonomy Virus table.
     */
    // let dataSource = [];
    this.taxonomyvirusService.getPage(1, val).subscribe((data: Array<object>) => {
      this.tax_data = data['results'];
    });
  }

  openWindow() {
    /**
     Open the Results Window.
     */
    this.windowService.open(
      this.disabledEscTemplate,
      {title: 'Search Results', hasBackdrop: false, closeOnEsc: true},
    );
  }

  gotoURLSameApp(directory, target= '_blank') {
    /**
     Function to navigate within the app.
     */
    const url = this.router.serializeUrl(
      this.router.createUrlTree([directory]),
    );

    window.open(decodeURIComponent(url), target);
  }

  onSearchChange_prot(value: string): void {
    /**
     Function to retrieve autocomplete sugestions from the Fusion Protein page for the search form.
     */
    this.prots_autocomplete = [];
    this.proteinService.get_autocomplete(value)
      .subscribe((data) => {
          this.complete_aux_prot(data['results'], value);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
  }

  complete_aux_prot(data: any, value: string) {
    /**
     Function to complement the function onSearchChange_prot,
     so to retrieve autocomplete sugestions for the search form.
     */
    let aux_string = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]['idprotein'].toString().toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['idprotein'].toString());
        continue;
      } else if (data[i]['virus'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['virus']);
        continue;
      } else if (data[i]['name'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['name']);
        continue;
      } else if (data[i]['class_field'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['class_field']);
        continue;
      } else if (data[i]['activation'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['activation']);
        continue;
      } else if (data[i]['name_fusogenic_unit'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['name_fusogenic_unit']);
        continue;
      } else if (data[i]['location_fusogenic'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['location_fusogenic']);
        continue;
      } else if (data[i]['sequence_fusogenic'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['sequence_fusogenic']);
        continue;
      } else if (data[i]['uniprotid'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['uniprotid']);
        continue;
      } else if (data[i]['ncbiid'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['ncbiid']);
        continue;
      } else if (data[i]['idtaxonomy'].toString().toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['idtaxonomy'].toString());
        continue;
      }
    }
    let aux_array = Array.from(new Set(aux_string));
    if (aux_array.length > 5) {
      aux_array = aux_array.slice(0, 5);
    }
    // this.autocomplete.push({page: 'Fusion Proteins', sugestions: aux_array});
    this.prots_autocomplete = aux_array;
  }

  onSearchChange_fp(value: string): void {
    /**
     Function to retrieve autocomplete sugestions from the Fusion Peptide page for the search form.
     */
    this.fps_autocomplete = [];
    this.fusionpeptideService.get_autocomplete(value)
      .subscribe(
        (data) => {
          this.complete_aux_fp(data['results'], value);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
  }

  complete_aux_fp(data: any, value:string) {
    /**
     Function to complement the function onSearchChangeFP, so to retrieve autocomplete sugestions for the search form.
     */
    let aux_string = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]['idfusion_peptides'].toString().toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['idfusion_peptides'].toString());
        continue;
      } else if (data[i]['protein_name'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['protein_name']);
        continue;
      } else if (data[i]['virus'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['virus']);
        continue;
      } else if (data[i]['residues'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['residues']);
        continue;
      } else if (data[i]['sequence'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['sequence']);
        continue;
      } else if (data[i]['annotation_method'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['annotation_method']);
        continue;
      } else if (data[i]['exp_evidence'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['exp_evidence']);
        continue;
      } else if (data[i]['protein'].toString().toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['protein'].toString());
        continue;
      }
    }
    let aux_array = Array.from(new Set(aux_string));
    if (aux_array.length > 5) {
      aux_array = aux_array.slice(0, 5);
    }
    // this.autocomplete.push({page: 'Fusion Peptides', sugestions: aux_array});
    this.fps_autocomplete = aux_array;
  }

  onSearchChange_Tax(value: string): void {
    /**
     Function to retrieve autocomplete sugestions from the Virus' Taxonomy page for search form.
     */
    this.tax_autocomplete = [];
    this.taxonomyvirusService.get_autocomplete(value)
      .subscribe(
        (data) => {
          this.complete_aux_tax(data['results'], value);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
  }

  complete_aux_tax(data: any, value: string) {
    /**
     Function to complement the function onSearchChange_Tax, so to retrieve autocomplete sugestions for the search form.
     */
    let aux_string = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]['idtaxonomy'].toString().toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['idtaxonomy'].toString());
        continue;
      } else if (data[i]['commonname'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['commonname']);
        continue;
      } else if (data[i]['family'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['family']);
        continue;
      } else if (data[i]['genre'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['genre']);
        continue;
      } else if (data[i]['species'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['species']);
        continue;
      } else if (data[i]['subspecies'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['subspecies']);
        continue;
      } else if (data[i]['ncbitax'].toUpperCase().includes(value.toUpperCase())) {
        aux_string.push(data[i]['ncbitax']);
        continue;
      }
    }
    let aux_array = Array.from(new Set(aux_string));
    if (aux_array.length > 5) {
      aux_array = aux_array.slice(0, 5);
    }
    // this.autocomplete.push({page: 'Virus\' Taxonomy', sugestions: aux_array});
    this.tax_autocomplete = aux_array;
  }

  onItemSelection( title ) {
    if ( title === 'Log out' ) {
      this.router.navigate(['/auth/logout']).then();
    } else if ( title === 'Profile' ) {
      // Do something on Profile
      alert('Profile Clicked ');
    }
  }
}
