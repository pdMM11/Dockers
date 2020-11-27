import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ECommerceComponent} from './e-commerce/e-commerce.component';
import {NotFoundComponent} from './miscellaneous/not-found/not-found.component';
import {FrontPageComponent} from './front-page/front-page.component';
import {BlastNcbiComponent} from './tools-webserver/blast-ncbi/blast-ncbi.component';
import {HmmerComponent} from './tools-webserver/hmmer/hmmer.component';
import {EpitopesComponent} from './tools-webserver/epitopes/epitopes.component';
import {WeblogoComponent} from './tools-webserver/weblogo/weblogo.component';
import {ClustalComponent} from './tools-webserver/clustal/clustal.component';
import {MlPredictComponent} from './tools-webserver/ml-predict/ml-predict.component';
// import { TaxonomyVirusCreateComponent } from './tables/taxonomy-virus-create/taxonomy-virus-create.component';
// import { TaxonomyVirusListComponent } from './tables/taxonomy-virus-list/taxonomy-virus-list.component';
// import { ProteinListComponent } from './tables/protein-list/protein-list.component';
// import { ProteinCreateComponent } from './tables/protein-create/protein-create.component';
// import { FusionPeptideListComponent } from './tables/fusion-peptide-list/fusion-peptide-list.component';
// import { FusionPeptideCreateComponent } from './tables/fusion-peptide-create/fusion-peptide-create.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: FrontPageComponent,
    },
    /**
     {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
     {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
     {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
     {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
     {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
     {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
     {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
     {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
     {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
     */
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'tools/blast',
      component: BlastNcbiComponent,
    },
    {
      path: 'tools/clustal',
      component: ClustalComponent,
    },
    {
      path: 'tools/epitopes',
      component: EpitopesComponent,
    },
    {
      path: 'tools/hmmer',
      component: HmmerComponent,
    },
    {
      path: 'tools/predict',
      component: MlPredictComponent,
    },
    {
      path: 'tools/weblogo',
      component: WeblogoComponent,
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
