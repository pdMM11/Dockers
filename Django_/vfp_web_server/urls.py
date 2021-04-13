"""vfp_web_server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from crmapp import views
from rest_framework_simplejwt import views as jwt_views
from rest_framework_jwt.views import verify_jwt_token
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static

#from rest_framework import router


urlpatterns = [
    path('admin/', admin.site.urls),

    path(r'fusionpeptides/', views.FusionPeptidesAPIView.as_view(), name='fusion-peptides'),
    path(r'fusionpeptides/<int:pk>/', views.FusionPeptidesAPIView.as_view()),
    path(r'fusionpeptides/save/', views.FusionPeptidesAPIView_Save.as_view()),
    path(r'save_fusionpeptides_results/', views.WriteResultsAPIView.write_fusion_peptide_results),
    path(r'fusionpeptides/autocomplete/', views.FusionPeptidesAPIView_Autocomplete.as_view()),

    path(r'inhibitorantibody/', views.InhibitorAntibodyAPIView.as_view(), name='inhibitor-antibody'),
    path(r'inhibitorantibody/<int:pk>/', views.InhibitorAntibodyAPIView.as_view()),
    path(r'inhibitorantibody/save/', views.InhibitorAntibodyAPIView_Save.as_view()),
    path(r'save_inhibitorantibody_results/', views.WriteResultsAPIView.write_inhibitor_antibody_results),

    path(r'host/', views.HostAPIView.as_view(), name='host'),
    path(r'host/<int:pk>/', views.HostAPIView.as_view()),

    path(r'peptidereferences/', views.PeptideReferencesAPIView.as_view(), name='peptide-references'),
    path(r'peptidereferences/<int:pk>/', views.PeptideReferencesAPIView.as_view()),
    path(r'peptidereferences/save/', views.PeptideReferencesAPIView_Save.as_view()),
    path(r'save_peptidereferences_results/', views.WriteResultsAPIView.write_peptide_structures_results),

    path(r'peptidestructure/', views.PeptideStructureAPIView.as_view(), name='peptide-structures'),
    path(r'peptidestructure/<int:pk>/', views.PeptideStructureAPIView.as_view()),
    path(r'peptidestructure/save/', views.PeptideStructureAPIView_Save.as_view()),
    path(r'save_peptidestructure_results/', views.WriteResultsAPIView.write_peptide_structures_results),

    path(r'protein/', views.ProteinAPIView.as_view(), name='protein'),
    path(r'protein/<int:pk>/', views.ProteinAPIView.as_view()),
    path(r'protein/save/', views.ProteinAPIView_Save.as_view()),
    path(r'save_protein_results/', views.WriteResultsAPIView.write_protein_results),
    path(r'protein/autocomplete/', views.ProteinAPIView_Autocomplete.as_view()),

    path(r'proteinreferences/', views.ProteinReferencesAPIView.as_view(), name='protein-references'),
    path(r'proteinreferences/<int:pk>/', views.ProteinReferencesAPIView.as_view()),
    path(r'proteinreferences/save/', views.ProteinReferencesAPIView_Save.as_view()),
    path(r'save_proteinreferences_results/', views.WriteResultsAPIView.write_protein_references_results),

    path(r'structure/', views.StructureAPIView.as_view(), name='structure'),
    path(r'structure/<int:pk>/', views.StructureAPIView.as_view()),

    path(r'references/', views.ReferencesAPIView.as_view(), name='references'),
    path(r'references/<int:pk>/', views.ReferencesAPIView.as_view()),

    path(r'taxhost/', views.TaxHostAPIView.as_view(), name='tax-host'),
    path(r'taxhost/<int:pk>/', views.TaxHostAPIView.as_view()),
    path(r'taxhost/save/', views.TaxHostAPIView_Save.as_view()),
    path(r'save_taxhost_results/', views.WriteResultsAPIView.write_tax_host_results),

    path(r'taxonomyvirus/', views.TaxonomyVirusAPIView.as_view(), name='taxonomy-virus'),
    path('taxonomyvirus/<int:pk>/', views.TaxonomyVirusAPIView.as_view()),
    path(r'taxonomyvirus/save/', views.TaxonomyVirusAPIView_Save.as_view()),
    path(r'save_taxonomy_results/', views.WriteResultsAPIView.write_taxonomy_virus_results, name='save-tax-predict'),
    path(r'taxonomyvirus/autocomplete/', views.TaxonomyVirusAPIView_Autocomplete.as_view()),


    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path(r'api/token/verify/', verify_jwt_token),


    path(r'clustal/', views.clustal, name='clustal'),

    path(r'clustal_all/', views.clustal_all, name='clustal_all'),
    path(r'clustal_tree/', views.send_clustal_tree, name='send_clustal_tree'),

    path(r'weblogoclustal/', views.weblogo, name='weblogo'),
    path(r'iedb/', views.iedb, name='iedb'),
    path(r'ml_predict/', views.ml_predict, name='ml-predict'),
    path(r'save_ml_results/', views.WriteResultsAPIView.write_ml_results, name='save-ml-predict'),

    path(r'^rest-auth/', include('rest_auth.urls')),
    path(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    
    path(r'weblogobackend/', views.weblogologomaker, name='weblogologomaker'),

    path(r'conserv/', views.conservation_features, name="conservation_features"),

    path(r'token-auth/', obtain_jwt_token),
    path(r'token-refresh/', refresh_jwt_token),

]

"""
    path(
        r'^taxonomy-virus-autocomplete/',
        views.TaxonomyVirusAutocomplete.as_view(),
        name='taxonomy-virus-autocomplete',
    ),
"""

urlpatterns += staticfiles_urlpatterns()
