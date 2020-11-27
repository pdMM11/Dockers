import {NgModule} from '@angular/core';
import {NbCardModule, NbMenuModule, NbRadioModule, NbSelectModule, NbTooltipModule} from '@nebular/theme';

import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {DashboardModule} from './dashboard/dashboard.module';
import {ECommerceModule} from './e-commerce/e-commerce.module';
import {PagesRoutingModule} from './pages-routing.module';
import {MiscellaneousModule} from './miscellaneous/miscellaneous.module';
import {FrontPageComponent} from './front-page/front-page.component';
import {BlastNcbiComponent} from './tools-webserver/blast-ncbi/blast-ncbi.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HmmerComponent} from './tools-webserver/hmmer/hmmer.component';
import {WeblogoComponent} from './tools-webserver/weblogo/weblogo.component';
import {EpitopesComponent} from './tools-webserver/epitopes/epitopes.component';
import {ClustalComponent} from './tools-webserver/clustal/clustal.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {MlPredictComponent} from './tools-webserver/ml-predict/ml-predict.component';

import { LoginComponent } from './admin-pages/login/login.component';
import { RegisterComponent } from './admin-pages/register/register.component';
import { LogoutComponent } from './admin-pages/logout/logout.component';
import { RequestPasswordComponent } from './admin-pages/request-password/request-password.component';
import { ResetPasswordComponent } from './admin-pages/reset-password/reset-password.component';

// import { FlexLayoutModule } from '@angular/flex-layout';


// import { TaxonomyVirusCreateComponent } from './tables/taxonomy-virus-create/taxonomy-virus-create.component';
// import { TaxonomyVirusListComponent } from './tables/taxonomy-virus-list/taxonomy-virus-list.component';
// import { ProteinListComponent } from './tables/protein-list/protein-list.component';
// import { ProteinCreateComponent } from './tables/protein-create/protein-create.component';
// import { FusionPeptideListComponent } from './tables/fusion-peptide-list/fusion-peptide-list.component';
// import { FusionPeptideCreateComponent } from './tables/fusion-peptide-create/fusion-peptide-create.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NbCardModule,
    NbSelectModule,
    NbSelectModule,
    NbRadioModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NbTooltipModule,
    // FlexLayoutModule,
  ],
  declarations: [
    PagesComponent,
    FrontPageComponent,
    BlastNcbiComponent,
    HmmerComponent,
    WeblogoComponent,
    EpitopesComponent,
    ClustalComponent,
    MlPredictComponent,
    /**
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
     */

  ],
})
export class PagesModule {
}
