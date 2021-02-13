import { NgModule } from '@angular/core';
import {
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbTreeGridModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { TablesRoutingModule, routedComponents } from './tables-routing.module';
import { FsIconComponent } from './tree-grid/tree-grid.component';

import { TaxonomyVirusCreateComponent } from './taxonomy-virus-create/taxonomy-virus-create.component';
import { TaxonomyVirusListComponent } from './taxonomy-virus-list/taxonomy-virus-list.component';
import { ProteinListComponent } from './protein-list/protein-list.component';
import { ProteinCreateComponent } from './protein-create/protein-create.component';
import { FusionPeptideListComponent } from './fusion-peptide-list/fusion-peptide-list.component';
import { FusionPeptideCreateComponent } from './fusion-peptide-create/fusion-peptide-create.component';
import { PeptideReferencesComponent } from './peptide-references/peptide-references.component';
import { PeptideStructuresComponent } from './peptide-structures/peptide-structures.component';
import { ProteinReferencesComponent } from './protein-references/protein-references.component';
import { TaxHostComponent } from './tax-host/tax-host.component';


import { FusionPeptidesTreeGridComponent } from './fusion-peptides-tree-grid/fusion-peptides-tree-grid.component';
import { ProteinListTreeGridComponent } from './protein-list-tree-grid/protein-list-tree-grid.component';
import {TaxonomyVirusListTreeGridComponent} from './taxonomy-virus-list-tree-grid/taxonomy-virus-list-tree-grid.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {ReactiveFormsModule} from '@angular/forms';
import { InhibitorantibodyComponent } from './inhibitorantibody/inhibitorantibody.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    TablesRoutingModule,
    Ng2SmartTableModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    NbCheckboxModule,
    NbPopoverModule,
    MatAutocompleteModule,
  ],
  declarations: [
    ...routedComponents,
    FsIconComponent,
    TaxonomyVirusCreateComponent,
    TaxonomyVirusListComponent,
    ProteinListComponent,
    ProteinCreateComponent,
    FusionPeptideListComponent,
    FusionPeptideCreateComponent,
    PeptideReferencesComponent,
    ProteinReferencesComponent,
    PeptideStructuresComponent,
    TaxHostComponent,

    FusionPeptidesTreeGridComponent,
    ProteinListTreeGridComponent,
    TaxonomyVirusListTreeGridComponent,
    InhibitorantibodyComponent,


  ],
})
export class TablesModule { }
