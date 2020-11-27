from rest_framework import serializers
from django.db import connection

from .models import *

class FusionPeptidesSerializer(serializers.ModelSerializer):
    protein_name = serializers.CharField(source='protein.name', allow_blank=True, allow_null=True, required=False)
    virus = serializers.CharField(source='protein.idtaxonomy.commonname', allow_blank=True, allow_null=True, required=False)
    class Meta:
        model = FusionPeptides
        fields = "__all__"

    def create(self, validated_data):
        with connection.cursor() as cursor:
            cursor.execute("""SELECT MIN(t1.idFusion_Peptides + 1) AS nextID
FROM fusion_peptides t1
   LEFT JOIN fusion_peptides t2
       ON t1.idFusion_Peptides + 1 = t2.idFusion_Peptides
WHERE t2.idFusion_Peptides IS NULL;
            """);
            value = cursor.fetchall()[0][0]

        return FusionPeptides.objects.create(idfusion_peptides=value,
                                             residues=validated_data['residues'],
                                             sequence=validated_data['sequence'],
                                             annotation_method=validated_data['annotation_method'],
                                             exp_evidence=validated_data['exp_evidence'],
                                             protein=validated_data['protein'])


class InhibitorAntibodySerializer(serializers.ModelSerializer):
    protein_name = serializers.CharField(source='protein.name', allow_blank=True, allow_null=True, required=False)
    virus = serializers.CharField(source='protein.idtaxonomy.commonname', allow_blank=True, allow_null=True, required=False)
    class Meta:
        model = InhibitorAntibody
        fields = "__all__"

        def create(self, validated_data):
            with connection.cursor() as cursor:
                cursor.execute("""
SELECT MIN(t1.idSubstance + 1) AS nextID
FROM inhibitor_antibody t1
   LEFT JOIN inhibitor_antibody t2
       ON t1.idSubstance + 1 = t2.idSubstance
WHERE t2.idSubstance IS NULL;
                    """);
                value = cursor.fetchall()[0][0]

                return InhibitorAntibody.objects.create(idsubstance=value,
                                           type=validated_data['type'],
                                           repository=validated_data['repository'],
                                           id_repository=validated_data['id_repository'],
                                           idprotein=validated_data['idprotein'])


class HostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Host
        fields = "__all__"

        def create(self, validated_data):
            with connection.cursor() as cursor:
                cursor.execute("""
SELECT MIN(t1.idHost + 1) AS nextID
FROM host t1
   LEFT JOIN host t2
       ON t1.idHost + 1 = t2.idHost
WHERE t2.idHost IS NULL;   
                """);
                value = cursor.fetchall()[0][0]

            return Host.objects.create(idhost=value,
                                        host=validated_data['host'],
                                        ncbitax=validated_data['ncbitax'])


class PeptideReferencesSerializer(serializers.ModelSerializer):
    residues = serializers.CharField(source='idpeptide.residues', allow_blank=True, allow_null=True, required=False)
    sequence = serializers.CharField(source='idpeptide.sequence', allow_blank=True, allow_null=True, required=False)
    annotation_method = serializers.CharField(source='idpeptide.annotation_method', allow_blank=True, allow_null=True, required=False)
    exp_evidence = serializers.CharField(source='idpeptide.exp_evidence', allow_blank=True, allow_null=True, required=False)
    protein = serializers.CharField(source='idpeptide.protein.name', allow_blank=True, allow_null=True, required=False)
    virus = serializers.CharField(source='idpeptide.protein.idtaxonomy.commonname', allow_blank=True, allow_null=True, required=False)
    doi = serializers.CharField(source='idreferences.doi', allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = PeptideReferences
        fields = "__all__"

    def create(self, validated_data):
        return PeptideReferences.objects.create(idpeptide=validated_data['idpeptide'],
                                                   idreferences=validated_data['idreferences'])


class ProteinSerializer(serializers.ModelSerializer):
    virus = serializers.CharField(source='idtaxonomy.commonname', allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = Protein
        fields = "__all__"

    def create(self, validated_data):
        with connection.cursor() as cursor:
            cursor.execute("""
SELECT MIN(t1.idProtein + 1) AS nextID
FROM protein t1
   LEFT JOIN protein t2
       ON t1.idProtein + 1 = t2.idProtein
WHERE t2.idProtein IS NULL; 
                    """);
            value = cursor.fetchall()[0][0]

        return Protein.objects.create(idprotein=value,
                                       name=validated_data['name'],
                                       class_field=validated_data['class_field'],
                                       activation=validated_data['activation'],
                                       name_fusogenic_unit=validated_data['name_fusogenic_unit'],
                                       location_fusogenic=validated_data['location_fusogenic'],
                                       sequence_fusogenic=validated_data['sequence_fusogenic'],
                                       uniprotid=validated_data['uniprotid'],
                                       ncbiid=validated_data['ncbiid'],
                                       idtaxonomy=validated_data['idtaxonomy'],)


class PeptideStructureSerializer(serializers.ModelSerializer):
    exp_method = serializers.CharField(source='idstructure.exp_method', allow_blank=True, allow_null=True, required=False)
    repository = serializers.CharField(source='idstructure.repository', allow_blank=True, allow_null=True, required=False)
    pdb = serializers.CharField(source='idstructure.id_repository', allow_blank=True, allow_null=True, required=False)
    class Meta:
        model = PeptideStructure
        fields = "__all__"

        def create(self, validated_data):
            with connection.cursor() as cursor:
                cursor.execute("""
SELECT MIN(t1.idPeptide_Structure + 1) AS nextID
FROM peptide_structure t1
   LEFT JOIN peptide_structure t2
       ON t1.idPeptide_Structure + 1 = t2.idPeptide_Structure
WHERE t2.idPeptide_Structure IS NULL;
                        """);
                value = cursor.fetchall()[0][0]

            return PeptideStructure.objects.create(idpeptide_structure=value,
                                          idpeptide=validated_data['idpeptide'],
                                          idprotein=validated_data['idpeptide'],
                                          idstructure=validated_data['idstructure'])


class ProteinReferencesSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='idprotein.name', allow_blank=True, allow_null=True, required=False)
    class_field = serializers.CharField(source='idprotein.class_field', allow_blank=True, allow_null=True, required=False)
    activation = serializers.CharField(source='idprotein.activation', allow_blank=True, allow_null=True, required=False)
    name_fusogenic_unit = serializers.CharField(source='idprotein.name_fusogenic_unit', allow_blank=True, allow_null=True, required=False)
    location_fusogenic = serializers.CharField(source='idprotein.location_fusogenic', allow_blank=True, allow_null=True, required=False)
    sequence_fusogenic = serializers.CharField(source='idprotein.sequence_fusogenic', allow_blank=True, allow_null=True, required=False)
    uniprotid = serializers.CharField(source='idprotein.uniprotid', allow_blank=True, allow_null=True, required=False)
    ncbiid = serializers.CharField(source='idprotein.ncbiid', allow_blank=True, allow_null=True, required=False)
    idtaxonomy = serializers.CharField(source='idprotein.idtaxonomy', allow_blank=True, allow_null=True, required=False)
    virus = serializers.CharField(source='idprotein.idtaxonomy.commonname', allow_blank=True, allow_null=True, required=False)
    doi = serializers.CharField(source='idreferences.doi', allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = ProteinReferences
        fields = "__all__"

    def create(self, validated_data):
        return ProteinReferences.objects.create(idprotein=validated_data['idprotein'],
                                                idreferences=validated_data['idreferences'])


class ReferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = References
        fields = "__all__"

    def create(self, validated_data):
        with connection.cursor() as cursor:
            cursor.execute("""
SELECT MIN(t1.idReferences + 1) AS nextID
FROM viral_fusion_protein.references t1
   LEFT JOIN viral_fusion_protein.references t2
       ON t1.idReferences + 1 = t2.idReferences
WHERE t2.idReferences IS NULL;
                            """);
            value = cursor.fetchall()[0][0]

        return References.objects.create(idreferences=value,
                                             type_reference=validated_data['type_reference'],
                                             doi=validated_data['doi'])


class StructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Structure
        fields = "__all__"

    def create(self, validated_data):
        with connection.cursor() as cursor:
            cursor.execute("""
SELECT MIN(t1.idStructure + 1) AS nextID
FROM structure t1
   LEFT JOIN structure t2
       ON t1.idStructure + 1 = t2.idStructure
WHERE t2.idStructure IS NULL;
                                """);
            value = cursor.fetchall()[0][0]

        return Structure.objects.create(idstructure=value,
                                        exp_method=validated_data['exp_method'],
                                        repository=validated_data['repository'],
                                        id_repository=validated_data['id_repository'],
                                        reference=validated_data['reference'])

class TaxHostSerializer(serializers.ModelSerializer):
    virus = serializers.CharField(source='idtaxonomy.commonname', allow_blank=True, allow_null=True, required=False)
    commonname = serializers.CharField(source='idtaxonomy.commonname', allow_blank=True, allow_null=True, required=False)
    family = serializers.CharField(source='idtaxonomy.family', allow_blank=True, allow_null=True, required=False)
    genre = serializers.CharField(source='idtaxonomy.genre', allow_blank=True, allow_null=True, required=False)
    species = serializers.CharField(source='idtaxonomy.species', allow_blank=True, allow_null=True, required=False)
    subspecies = serializers.CharField(source='idtaxonomy.subspecies', allow_blank=True, allow_null=True, required=False)
    virus_ncbitax = serializers.CharField(source='idtaxonomy.ncbitax', allow_blank=True, allow_null=True, required=False)
    host = serializers.CharField(source='idhost.host', allow_blank=True, allow_null=True, required=False)
    host_ncbitax = serializers.CharField(source='idhost.ncbitax', allow_blank=True, allow_null=True, required=False)
    class Meta:
        model = TaxHost
        fields = "__all__"

    def create(self, validated_data):
        with connection.cursor() as cursor:
            cursor.execute("""
SELECT MIN(t1.idTaxHost + 1) AS nextID
FROM tax_host t1
   LEFT JOIN tax_host t2
       ON t1.idTaxHost + 1 = t2.idTaxHost
WHERE t2.idTaxHost IS NULL;
                                """);
            value = cursor.fetchall()[0][0]

        return TaxHost.objects.create(idtaxhost=value,
                                        idtaxonomy=validated_data['idtaxonomy'],
                                        idhost=validated_data['idhost'])


class TaxonomyVirusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxonomyVirus
        fields = "__all__"

    def create(self, validated_data):
        with connection.cursor() as cursor:
            cursor.execute("""
SELECT MIN(t1.idTaxonomy + 1) AS nextID
FROM taxonomy_virus t1
   LEFT JOIN taxonomy_virus t2
       ON t1.idTaxonomy + 1 = t2.idTaxonomy
WHERE t2.idTaxonomy IS NULL;
                                """);
            value = cursor.fetchall()[0][0]

        return TaxonomyVirus.objects.create(idtaxonomy=value,
                                        commonname=validated_data['commonname'],
                                        family=validated_data['family'],
                                        genre=validated_data['genre'],
                                        species=validated_data['species'],
                                        subspecies=validated_data['subspecies'],
                                        ncbitax=validated_data['ncbitax'])