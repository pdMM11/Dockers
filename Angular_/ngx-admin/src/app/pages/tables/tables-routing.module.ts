import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablesComponent } from './tables.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { TreeGridComponent } from './tree-grid/tree-grid.component';

import { TaxonomyVirusCreateComponent } from './taxonomy-virus-create/taxonomy-virus-create.component';
import { TaxonomyVirusListComponent } from './taxonomy-virus-list/taxonomy-virus-list.component';
import { ProteinListComponent } from './protein-list/protein-list.component';
import { ProteinCreateComponent } from './protein-create/protein-create.component';
import { FusionPeptideListComponent } from './fusion-peptide-list/fusion-peptide-list.component';
import { FusionPeptideCreateComponent } from './fusion-peptide-create/fusion-peptide-create.component';
import { PeptideReferencesComponent } from './peptide-references/peptide-references.component';
import { ProteinReferencesComponent } from './protein-references/protein-references.component';
import { PeptideStructuresComponent } from './peptide-structures/peptide-structures.component';
import { TaxHostComponent } from './tax-host/tax-host.component';

import { FusionPeptidesTreeGridComponent } from './fusion-peptides-tree-grid/fusion-peptides-tree-grid.component';
import { ProteinListTreeGridComponent } from './protein-list-tree-grid/protein-list-tree-grid.component';
import {TaxonomyVirusListTreeGridComponent} from './taxonomy-virus-list-tree-grid/taxonomy-virus-list-tree-grid.component';
import { InhibitorantibodyComponent } from './inhibitorantibody/inhibitorantibody.component';

const routes: Routes = [{
  path: '',
  component: TablesComponent,
  children: [
    /**
    {
      path: 'smart-table',
      component: SmartTableComponent,
    },
    {
      path: 'tree-grid',
      component: TreeGridComponent,
    },
    {
      path: 'protein-smart-table',
      component: ProteinListComponent,
    },
    {
      path: 'create-protein',
      component: ProteinCreateComponent,
    },
    {
      path: 'taxonomy-virus-smart-table',
      component: TaxonomyVirusListComponent,
    },
    {
      path: 'create-taxonomy-virus',
      component: TaxonomyVirusCreateComponent,
    },
    {
      path: 'fusion-peptide-smart-table',
      component: FusionPeptideListComponent,
    },
    {
      path: 'create-fusion-peptide',
      component: FusionPeptideCreateComponent,
    },*/
    {
      path: 'peptide-references',
      component: PeptideReferencesComponent,
    },
    {
      path: 'protein-references',
      component: ProteinReferencesComponent,
    },
    {
      path: 'peptide-structure',
      component: PeptideStructuresComponent,
    },
    {
      path: 'tax-host',
      component: TaxHostComponent,
    },
    {
      path: 'fusion-peptide',
      component: FusionPeptidesTreeGridComponent,
    },
    {
      path: 'protein',
      component: ProteinListTreeGridComponent,
    },
    {
      path: 'taxonomy-virus',
      component: TaxonomyVirusListTreeGridComponent,
    },
    {
      path: 'inhibitor-antibody',
      component: InhibitorantibodyComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  TablesComponent,
  SmartTableComponent,
  TreeGridComponent,
];
