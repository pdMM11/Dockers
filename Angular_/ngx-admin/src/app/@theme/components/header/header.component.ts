import {Component, OnDestroy, OnInit} from '@angular/core';
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


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
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

  userMenu = [{title: 'Profile'}, {title: 'Log out'}];
  search_form = new FormControl('');

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

        this.openWindow();

      });


    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
          // here we receive a payload from the token and assigns it to our `user` variable
        }
      });
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
}
