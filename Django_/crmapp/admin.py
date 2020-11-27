from django.contrib import admin

# Register your models here.
from crmapp.models import *

admin.site.site_header = "VFP WebServer"
admin.site.site_title = "VFP WebServer Admin Portal"
admin.site.index_title = "Welcome to VFP WebServer Admin Portal"


@admin.register(FusionPeptides)
class FusionPeptidesAdmin(admin.ModelAdmin):
    fields = ['idfusion_peptides', 'residues', 'sequence', 'annotation_method',
                        'exp_evidence', 'protein']
    list_display = fields
    search_fields = ['idfusion_peptides', 'residues', 'sequence', 'annotation_method',
                        'exp_evidence', 'protein__name',
                        'protein__idtaxonomy__commonname']


@admin.register(Host)
class HostAdmin(admin.ModelAdmin):
    fields = ['idhost', 'host', 'ncbitax']
    list_display = fields
    search_fields = fields
    

@admin.register(InhibitorAntibody)
class InhibitorAntibodyAdmin(admin.ModelAdmin):
    fields = ['idsubstance', 'type', 'repository', 'id_repository', 'idprotein']
    list_display = fields
    search_fields = ['idsubstance', 'type', 'repository', 'id_repository', 'idprotein__name',
                     'idprotein__idtaxonomy__commonname']


@admin.register(PeptideReferences)
class PeptideReferencesAdmin(admin.ModelAdmin):
    fields = ['idpeptide', 'idreferences']
    list_display = fields
    search_fields = ['idpeptide__protein__name', 'idreferences__doi',
                        'idpeptide__protein__idtaxonomy__commonname']


@admin.register(PeptideStructure)
class PeptideStructureAdmin(admin.ModelAdmin):
    fields = ['idpeptide', 'idstructure']
    list_display = fields
    search_fields = ['idpeptide__protein__name', 'idpeptide__protein__idtaxonomy__commonname',
                        'idstructure__id_repository']


@admin.register(Protein)
class ProteinAdmin(admin.ModelAdmin):
    fields = ['idprotein', 'name', 'class_field', 'activation',
                        'name_fusogenic_unit', 'sequence_fusogenic',
                        'uniprotid', 'ncbiid', 'idtaxonomy']
    list_display = fields
    search_fields = ['idprotein', 'name', 'class_field', 'activation',
                        'name_fusogenic_unit', 'sequence_fusogenic',
                        'uniprotid', 'ncbiid','idtaxonomy__commonname']


@admin.register(ProteinReferences)
class ProteinReferencesAdmin(admin.ModelAdmin):
    fields = ['idprotein', 'idreferences']
    list_display = fields
    search_fields = ['idreferences__doi', 'idprotein__name',
                    'idprotein__idtaxonomy__commonname']


@admin.register(Structure)
class StructureAdmin(admin.ModelAdmin):
    fields = ['idstructure', 'exp_method', 'repository', 'id_repository', 'reference']
    list_display = fields
    search_fields = ['idstructure', 'exp_method', 'repository', 'id_repository', 'reference__doi']


@admin.register(References)
class ReferencesAdmin(admin.ModelAdmin):
    fields = ['idreferences', 'type_reference', 'doi']
    list_display = fields
    search_fields = ['idreferences', 'doi']


@admin.register(TaxHost)
class TaxHostAdmin(admin.ModelAdmin):
    fields = ['idtaxhost','idtaxonomy', 'idhost']
    list_display = fields
    search_fields = ['idtaxonomy__commonname', 'idtaxonomy__ncbitax',
                        'idhost__host', 'idhost__ncbitax']


@admin.register(TaxonomyVirus)
class TaxonomyVirusAdmin(admin.ModelAdmin):
    fields = ['idtaxonomy', 'commonname', 'family', 'genre',
                        'species', 'subspecies', 'ncbitax']
    list_display = fields
    search_fields = fields
