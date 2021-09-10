from multiprocessing.pool import AsyncResult

from django.shortcuts import render
# from django.core.paginator import Paginator
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.views import APIView
from rest_framework import generics

from vfp_web_server.celery import app as celery_app
from .models import *
from .serializers import *
from django.shortcuts import render
from django.http import Http404, JsonResponse, HttpResponse
import requests
from subprocess import run, PIPE
import sys, os
from urllib.parse import unquote
import pickle
from propythia.machine_learning import MachineLearning
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from crmapp.ml_models.Propythia_ML_PMML import MachineLearning_PMML
from sklearn2pmml import sklearn2pmml
from pypmml import Model
from datetime import date, datetime
from Bio.Align.Applications import ClustalOmegaCommandline
from Bio.SubsMat import MatrixInfo as matlist

import csv

import subprocess
from weblogo import *


import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


import logomaker

import base64
import json

from crmapp.conserv.descriptors_conserv import Descriptor

from django.shortcuts import render

from crmapp.tasks import MachineLearningTask

import celery

def index(request, path=''):
    """
    The home page. This renders the container for the single-page app.
    """
    return render(request, 'index.html')


class CustomPagination(PageNumberPagination):
    """
    Pagination method for the views that require the entirety of the data
    """
    page_size = 0
    page_size_query_param = 'page_size'
    max_page_size = 50000

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'page_size': self.page_size,
            'results': data
        })

class AutoCompletePagination(PageNumberPagination):
    """
    Pagination method for the views that require the entirety of the data
    """
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 50000

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'page_size': self.page_size,
            'results': data
        })

@api_view(["POST"])
@csrf_exempt
@authentication_classes([])
@permission_classes([])
def weblogo(request):
    """
    Clustal Omega multiple alignment function intend for the http://weblogo.threeplusone.com/create.cgi webpage.
    It receives a POST request, with 'seqs' attribute in its data, containing at least 3 protein sequences in FASTA format.
    Output is a JSON with that alignment in FASTA format.
    """
    if request.method == "POST":
        # seqs = unquote(request.GET.get('seq'))
        data = request.data
        seqs = data['seqs']
        output = weblogo_aux(seqs)
        return JsonResponse({'data': output}, safe=False)
    raise Http404


@api_view(["POST"])
@csrf_exempt
@authentication_classes([])
@permission_classes([])
def weblogologomaker(request):
    """
    Function to build Weblogos (either in text format, or in PNG format, using Logomaker package) from protein sequences that are later aligned with Clustal Omega.
    It receives a POST request, with the following attributes in its data:
     - 'seqs', containing at least 3 protein sequences in FASTA format.
     - 'type_output', either 'txt' or 'png'.
     - 'type_os': either 'windows' to use the Clustal console present in the project, or 'linux' for the one present in the Docker container.
     - 'line_size': the number of stacks per line.
     - 'colour': Weblogo's colour scheme.
    Output is a JSON with that weblogo in a txt format or the base-64 string of the PNG output.
    """
    if request.method == "POST":
        # seqs = unquote(request.GET.get('seq'))
        data = request.data
        seqs = data['seqs']
        try:
            type_output = data['output']
        except:
            type_output = "png"
        try:
            type_os = data['os']
        except:
            type_os = "linux"
        try:
            line_size = data['line_size']
        except:
            line_size = 25
        try:
            colour = data['colour']
        except:
            colour = 'NajafabadiEtAl2017'


        ##########################
        # type_os = "windows"
        #######################

        output = weblogo_aux(seqs, type_os)

        in_file = "unaligned.fasta"
        out_file = "aligned.fasta"

        file = open(out_file, "r")
        seqs = read_seq_data(file, alphabet="ACDEFGHIKLMNPQRSTVWY-")
        logodata = LogoData.from_seqs(seqs)
        logooptions = LogoOptions()
        logooptions.title = "VFP WEBSERVER"
        logoformat = LogoFormat(logodata, logooptions)
        weblogo_txt = txt_formatter(logodata, logoformat)

        # weblogo_jpeg = jpeg_formatter(logodata, logoformat)

        weblogo_file = "weblogo.txt"
        weblogo = open(weblogo_file, "w")
        data_weblogo = str(weblogo_txt)[2:len(str(weblogo_txt)) - 1].replace('\\n', '\n').replace('\\t', '\t')
        weblogo.write(data_weblogo)
        weblogo.close()

        filename = 'weblogo.txt'

        weblogoDf = pd.read_csv(filename, skiprows=7, sep='\t')


        weblogoDf = weblogoDf[:-1]

        columns = []
        for i in weblogoDf.columns:
            j = i.replace(' ', '')
            columns.append(j)
        weblogoDf.columns = columns

        weblogo_entropyes = weblogoDf.loc[:, weblogoDf.columns[1:len(weblogoDf.columns) - 4]]

        entropies = list((np.log2(20) - weblogoDf.loc[:, 'Entropy']))

        weblogo_entropyes = weblogo_entropyes.mul(entropies, axis=0)

        family_weblogo = weblogo_entropyes.drop(['-'], axis=1)

        if type_output == "txt":

            weblogo = open(weblogo_file)

            data = weblogo.read()

            return HttpResponse(data, content_type="text/plain")

            # return JsonResponse(family_weblogo.to_json(orient="index"), safe=False)

        else:
            data = logomaker.transform_matrix(family_weblogo)

            # create figure
            height_per_row = 2
            width_per_col = 1.5

            num_rows = int(data.shape[0] / line_size) + 1

            fig = plt.figure(figsize=[width_per_col * line_size,
                                      height_per_row * num_rows])

            max_df = data.sum(axis=1).max()

            for i in range(0, int(data.shape[0] / line_size)):
                # set axes limits and label

                ax = plt.subplot2grid((num_rows, 1), (i, 0))
                ax.spines['right'].set_visible(False)
                ax.spines['top'].set_visible(False)
                ax.set_ylim(bottom=0, top=max_df)

                # ax.set_xlabel("Type of peptide")
                ax.set_ylabel('Bits')

                logo = logomaker.Logo(data.loc[range(i * line_size, (i + 1) * line_size), :],
                                      ax=ax,
                                      color_scheme=colour, )

                # style using Axes methods
                # logo.ax.set_ylabel("$-\Delta \Delta G$ (kcal/mol)", labelpad=-1)
                # logo.ax.xaxis.set_ticks_position('none')
                logo.ax.set_ylim([0, max_df])

                # style using Logo methods
                # logo.style_glyphs(ceiling = max_df)

            if i * line_size != data.shape[0]:

                i += 1

                data_aux = data

                for j in range(i * line_size, (i + 1) * line_size):
                    data_aux = data_aux.append(pd.Series(0, index=data_aux.columns), ignore_index=True)

                ax = plt.subplot2grid((num_rows, 1), (i, 0))

                ax.spines['right'].set_visible(False)
                ax.spines['top'].set_visible(False)
                ax.set_ylim(bottom=0, top=max_df)

                # ax.set_xlabel("Type of peptide")
                ax.set_ylabel('Bits')

                logo = logomaker.Logo(data_aux.loc[range(i * line_size, (i + 1) * line_size), :],
                                      ax=ax,
                                      color_scheme=colour, )

                # style using Axes methods
                # logo.ax.set_ylabel("$-\Delta \Delta G$ (kcal/mol)", labelpad=-1)
                # logo.ax.xaxis.set_ticks_position('none')
                logo.ax.set_xlim([i * line_size - 0.5, (i + 1) * line_size - 0.5])
                logo.ax.set_ylim([0, max_df])

            image_path = "weblogo.png"
            fig.savefig("weblogo.png")

            with open(image_path, "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')

            # base64data = open("base64.txt","w")

            # base64data.write(image_data)

            # print(image_data)

            # base64data = open("base64.txt")

            # send_data = base64data.read()

            # return HttpResponse(image_data, content_type="image/png")

            return HttpResponse(image_data, content_type="text/plain")

        # return JsonResponse({'data': output}, safe=False)
    raise Http404


def weblogo_aux(seqs, type_os = "linux"):
    """
    Auxiliar function for the Weblogos functions to perform the Clustal Omega alignment.
    It receives 2 attributes:
    - 'seqs', containing at least 3 protein sequences in FASTA format.
    - 'type_os': either 'windows' to use the Clustal console present in the project, or 'linux' for the one present in the Docker container.
    This function writes the alignment result into "aligned.fasta" file, but also provides this content as its output.
    """
    in_file = "unaligned.fasta"
    out_file = "aligned.fasta"

    file = open(in_file, "w")
    file.write(seqs)
    file.close()
    clustalomega_cline = ClustalOmegaCommandline(infile=in_file, outfile=out_file, verbose=True, auto=False)
    print(clustalomega_cline)
    if type_os == "windows":
        os.system('cmd /c crmapp\clustal-omega-1.2.2-win64\\' + str(clustalomega_cline) + ' --force')
    else:
        # cmd = 'crmapp/clustal-omega-1.2.2-win64s/' + str(clustalomega_cline) + ' --force'
        cmd = str(clustalomega_cline) + ' --force'
        # subprocess.Popen(['/bin/bash', '-c', 'chmod u+x clustalo'])
        p = subprocess.Popen(['/bin/bash', '-c', cmd])

        p.communicate()


    """
    out_file = "out_filename.clustal_num"
    clustalomega_cline = ClustalOmegaCommandline(infile=in_file, outfile=out_file, verbose=True, auto=False)
    print(clustalomega_cline)
    os.system('cmd /c crmapp\clustal-omega-1.2.2-win64\\' + str(clustalomega_cline) + ' --outfmt clustal --force')
    """

    file_out = open("aligned.fasta", "r")
    seqs_aligned = file_out.readlines()

    # return_data = {'data': seqs_aligned}

    """

    seqs = read_seq_data(file_out)
    logodata = LogoData.from_seqs(seqs)
    logooptions = LogoOptions()
    logooptions.title = "VFP WEBSERVER"
    logoformat = LogoFormat(logodata, logooptions)
    weblogo_txt = txt_formatter(logodata, logoformat)

    # weblogo_jpeg = jpeg_formatter(logodata, logoformat)

    weblogo_file = "weblogo.txt"
    weblogo = open(weblogo_file, "w")
    data_weblogo = str(weblogo_txt)[2:len(str(weblogo_txt)) - 1].replace('\\n', '\n').replace('\\t', '\t')
    weblogo.write(data_weblogo)
    weblogo.close()

    """

    file_out.close()
    #os.remove(in_file)
    #os.remove(out_file)

    output = seqs_aligned[0]
    seq_found = False
    for i in range(1, len(seqs_aligned) - 1):
        if seqs_aligned[i + 1][0] == '>':
            output += seqs_aligned[i]
            seq_found = True
        elif seq_found:
            output += seqs_aligned[i]
            seq_found = False
        else:
            output += seqs_aligned[i][0:len(seqs_aligned[i]) - 1]
    output += seqs_aligned[len(seqs_aligned) - 1]


    # open(in_file, 'w').close()
    # open(out_file, 'w').close()

    return output


def iedb(request):
    """
    Function that receive a GET request to perform a request to the IEDB API to predict the likelihood of an epitope within a sequence.
    Inputs within the request:
    - 'method': Type of method to obtain the prediction.
    - 'sequence_text': Protein sequence.
    - 'window_size': window size.
    Returns a JSON with te output of the IEDB request.
    """
    data = {
        'method': unquote(request.GET.get('method')),
        'sequence_text': unquote(request.GET.get('sequence_text')),
        'window_size': unquote(request.GET.get('window_size'))
    }

    response = requests.post('http://tools-cluster-interface.iedb.org/tools_api/bcell/', data=data)
    # return render(request, 'home.html', {'data': response.text})
    # return_data = response.text.split('\n')

    return JsonResponse(response.text, safe=False)


def clustal(request):  # error no urllib
    """
    Function to access the EBI Clustal Omega API.
    Receives a GET request with the following paramethers:
    - 'email': email of the user
    - 'seq': protein sequence.
    Right now, this function does not function, since when requests are made using the official API, an urllib error shows up.
    """
    email = unquote(request.GET.get('email'))
    seqs = unquote(request.GET.get('seq'))

    file = open("unaligned.fasta", "w")
    file.write(seqs)
    file.close()
    # os.system('cmd /c"python crmapp/clustalo.py --email' + email + ' --stype protein' ' unaligned.fasta"')

    command = [sys.executable, 'crmapp/clustalo.py',
               "--email", email,
               "--stype", "protein",
               "unaligned.fasta"]

    output = run(command, shell=True, stdout=PIPE)
    # os.system(command)

    print(output)

    # file = open("unaligned.fasta", "w")
    # file.write(seqs)
    # file.close()
    # os.system('cmd /c"python clustalo.py --email' +  email +  ' --stype protein' ' unaligned.fasta"')

    return render(request, 'home.html')

@api_view(["POST"])
@csrf_exempt
@authentication_classes([])
@permission_classes([])
def clustal_all(request):
    """
    Function that performs a Clustal Omega Alignment to protein sequences, saving into files the alignemnt itself and guide tree information.
    It receives a POST request with the following paramethers:
    - 'seqs': at least 3 protein sequences in FASTA format
    - 'type': type of output: FASTA, CLUSTAL or PHYLIP
    - 'os': either 'windows' to use the Clustal console present in the project, or 'linux' for the one present in the Docker container.
    - 'guide_tree': boolean to determine whether the guide tree output is provided
    Return a JSON with the output of the CLustal alignment as text.
    """
    if request.method == "POST":
        # seqs = unquote(request.GET.get('seq'))
        data = request.data
        seqs = data['seqs']
        type = data['type']

        try:
            type_os = data['os']
        except:
            type_os = "linux"
        """
        try:
            dists = data['dists']
        except:
            dists = False
        """
        try:
            guide_tree = data['guide_tree']
        except:
            guide_tree = False
        try:
            mat_select = data['mat']
            if mat_select == 'blosum':
                mat = matlist.blosum62
            elif mat_select == 'pam':
                mat = matlist.pam250
        except:
            mat = matlist.blosum62



        ##########################
        # type_os = "windows"
        ###########################

        if type == "fasta":
            out_file = "aligned.fasta"

        elif type == "phylip":
            out_file = "aligned_clustal.phy"

        else:
            out_file = "aligned_clustal.alm"
            type = "clu"

        in_file = "unaligned_clustal.fasta"

        file = open(in_file, "w")
        file.write(seqs)
        file.close()

        """
        if guide_tree and dists:
            clustalomega_cline = ClustalOmegaCommandline(infile=in_file,
                                                         outfile=out_file,
                                                         verbose=True,
                                                         auto=False,
                                                         outfmt=type,
                                                         guidetree_out="tree.dnd")
        """
        if guide_tree:
            clustalomega_cline = ClustalOmegaCommandline(infile=in_file,
                                                         outfile=out_file,
                                                         verbose=True,
                                                         auto=False,
                                                         outfmt=type,
                                                         # distmat_in=mat,
                                                         guidetree_out="tree.dnd")
        else:
            clustalomega_cline = ClustalOmegaCommandline(infile=in_file,
                                                         outfile=out_file,
                                                         verbose=True,
                                                         auto=False,
                                                         outfmt=type,
                                                         # distmat_in=mat
                                                         )
        """
        elif dists:
            clustalomega_cline = ClustalOmegaCommandline(infile=in_file,
                                                         outfile=out_file,
                                                         verbose=True,
                                                         auto=False,
                                                         outfmt=type,
                                                         distmat_out="output.distmat")
        """


        print(clustalomega_cline)
        if type_os == "windows":
            os.system('cmd /c crmapp\clustal-omega-1.2.2-win64\\' + str(clustalomega_cline) + ' --force')
        else:
            # cmd = 'crmapp/clustal-omega-1.2.2-win64s/' + str(clustalomega_cline) + ' --force'
            cmd = str(clustalomega_cline) + ' --force'
            # subprocess.Popen(['/bin/bash', '-c', 'chmod u+x clustalo'])
            p = subprocess.Popen(['/bin/bash', '-c', cmd])

            p.communicate()

        file_out = open(out_file, "r")

        data_send = {}

        data_send['align'] = file_out.read()

        if guide_tree:
            # data_send['dnd'] = file_tree_out.read()
            file_tree_out = open("tree.dnd", "r")
            data_send['tree'] = file_tree_out.read()

        """
        if dists:
            file_tree_out = open("output.distmat", "r")
            data_send['dists'] = file_tree_out.read()
        """

        return HttpResponse(json.dumps(data_send))


def send_clustal_tree(request):
    """
    Function that, upon receiving a GET request, reads the guide tree information from the last Clustal Alignment.
    Returns that file's content in a Http Response.
    """
    file_tree_out = open("tree.dnd", "r")
    data_send = file_tree_out.read()
    return HttpResponse(data_send, content_type="text/plain")


def ml_predict(request):
    """
    Function that, using ML models trained with ProPythia, predicts the likelihood a peptide being a fusion peptide.
    It receives a GET request, with the following parameters:
    - 'seq': protein sequence.
    - 'window_size': window size
    - 'gap': gap between windows
    - 'model': ML model
    Returns a JSON with the probabilities from all possible peptides
    """
    seq = unquote(request.GET.get('sequence'))
    try:
        window_size = int(unquote(request.GET.get('window_size')))
    except:
        window_size = 15
    try:
        gap = int(unquote(request.GET.get('gap')))
    except:
        gap = 1
    try:
        model_picked = unquote(request.GET.get('model'))
    except:
        model_picked = 'svm'
    model = None

    if model_picked == 'svm':
        model = pickle.load(open('crmapp/ml_models/dataset3_all_svm.sav', 'rb'))
        # model = Model.fromFile('crmapp/ml_models/Model_pmml_svm_28052020.pmml')
    elif model_picked == 'rf':
        model = pickle.load(open('crmapp/ml_models/dataset3_all_rf_model.sav', 'rb'))
    elif model_picked == 'gboosting':
        model = pickle.load(open('crmapp/ml_models/dataset3_all_gboosting_model.sav', 'rb'))
    elif model_picked == 'knn':
        model = pickle.load(open('crmapp/ml_models/dataset3_all_knn_model.sav', 'rb'))
    elif model_picked == 'lr':
        model = pickle.load(open('crmapp/ml_models/dataset3_all_lr_model.sav', 'rb'))
    elif model_picked == 'gnb':
        model = pickle.load(open('crmapp/ml_models/dataset3_all_gnb_model.sav', 'rb'))
    elif model_picked == 'nn':
        model = pickle.load(open('crmapp/ml_models/dataset3_all_nn_model.sav', 'rb'))

    dataset = pd.read_csv(r'crmapp/ml_models/dataset3_all_svc.csv', delimiter=',')

    x_original = dataset.loc[:, dataset.columns != 'labels']
    labels = dataset['labels']

    # create Machine learning object
    ml = MachineLearning(x_original, labels, classes=['non_vfp', 'vfp'])
    # ml = MachineLearning_PMML(x_original, labels, classes=['non_vfp', 'vfp'])

    result = None
    if model is not None:
        result = ml.predict_window(model, seq=seq, x=None, window_size=window_size,
                                   gap=gap, features=[], names=None, y=None,
                                   filename=None)

        return JsonResponse(result.to_json(orient='table'), safe=False)

    else:
        JsonResponse([], safe=False)

    """
    if model_picked != 'svm':
        filename = 'crmapp/ml_models/dataset3_all_svc'
        dataset_in = r'crmapp/ml_models/dataset3_all_svc.csv'
        dataset = pd.read_csv(dataset_in, delimiter=',')
        x_original = dataset.loc[:, dataset.columns != 'labels']
        labels = dataset['labels']
        # create Machine learning object
        ml = MachineLearning_PMML(x_original, labels, classes=['non_vfp', 'vfp'])

        best_svm_model = ml.train_best_model('svm')

        # save the model to disk
        # filename2 = filename + 'svm_model.sav'
        # pickle.dump(best_svm_model, open(filename2, 'wb'))
        sklearn2pmml(best_svm_model, "Model_pmml_svm_27052020.pmml", with_repr=True)

        return HttpResponse('<h1>Page was found</h1>')

        return render(request, 'home.html')
      """

def ml_predict_task(request):
    """
        Function that, using ML models trained with ProPythia, predicts the likelihood a peptide being a fusion peptide.
        It receives a GET request, with the following parameters:
        - 'seq': protein sequence.
        - 'window_size': window size
        - 'gap': gap between windows
        - 'model': ML model
        Returns a JSON with the probabilities from all possible peptides
    """
    seq = unquote(request.GET.get('sequence'))
    try: window_size = int(unquote(request.GET.get('window_size')))
    except: window_size = 15
    try: gap = int(unquote(request.GET.get('gap')))
    except: gap = 1
    try: model_picked = unquote(request.GET.get('model'))
    except: model_picked = 'svm'
    predictions = MachineLearningTask.apply_async(kwargs={"model_picked": model_picked,
                                                       "seq": seq,
                                                       "window_size": window_size,
                                                       "gap": gap})
    print(predictions.id)

    return JsonResponse({"task_id": predictions.id}, status=202)

    # res = result.AsyncResult(id=predictions.id, app=MachineLearningTask)
    # res = predictions.get()

    # return predictions

    # async_result = AsyncResult(id=predictions.id, app=MachineLearningTask)


@csrf_exempt
def get_status(request):
    task_id = unquote(request.GET.get('task_id'))
    task_result = celery.result.AsyncResult(task_id, app=celery_app)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": task_result.result
    }
    return JsonResponse(result, status=200)


@api_view(["POST"])
@csrf_exempt
@authentication_classes([])
@permission_classes([])
def conservation_features(request):
    """
    Function that retrieves the conservation scores of a protein against different taxonomy Family's Weblogos.
    It receives a POST request, with the following paramethers:
    - 'seq': protein sequence
    - 'window_size': window size
    - 'family': Virus' Taxonomy family
    Returns a JSON with the conservation scores from positions within the sequence.
    """
    if request.method == "POST":
        data = request.data
        sequence = data['seq']
        try:
            window_size = data['window_size']
        except:
            window_size = 15
        try:
            family = data['family']
        except: family = 'Retroviridae'
        """
        try:
            gap = int(unquote(request.GET.get('gap')))
        except:
            gap = 1
        """
        features = Descriptor(sequence)

        data_conserv = features.scores_sequence(sequence, window_size, family)

        pos = list(data_conserv.keys())

        pos_new = []

        # print(pos)

        for i in pos:
            pos_init_end = i.split('-')
            # print(pos_init_end)
            pos0 = int(pos_init_end[0])
            pos1 = int(pos_init_end[1])
            pos_new.append([i, pos0, pos1])

        # print(pos_new)

        data_send = {}

        families = list(data_conserv[pos[0]].keys())

        # print(len(sequence))

        for i in range(len(sequence)):
            aux = {}
            for j in pos_new:
                if i >= (j[1]) and i < (j[2]):
                    if aux == {}:
                        aux = data_conserv[j[0]]
                    else:
                        for k in families:
                            if data_conserv[j[0]][k] > aux[k]:
                                aux[k] = data_conserv[j[0]][k]
            if i == len(sequence) - 1 and aux == {}:
                aux = data_conserv[j[0]]

            data_send[i] = aux

        return JsonResponse(data_send, safe=False)

        # return JsonResponse(json.dumps(data_send), safe=False)
    

class WriteResultsAPIView(APIView):
    """
    This method contains function capable to write query / ML results into file.
    ONLY WORKS LOCALLY.
    """
    @api_view(["POST"])
    @csrf_exempt
    def write_ml_results(request):
        """
        ML results.
        """
        if request.method == "POST":
            data = request.data
            today = datetime.now()
            today = today.strftime("%d-%m-%Y-%H%M%S")
            username = os.getlogin()  # Fetch username
            file = open(f'C:\\Users\\{username}\\Desktop\\results_ml' + str(today) + '.txt', 'w')
            file.write(data['data'])
            file.close()
            return JsonResponse({'response': "Data successfully saved."}, safe=False)
        raise Http404

    @api_view(["POST"])
    @csrf_exempt
    def write_fusion_peptide_results(request):
        """
        Fusion peptide table query results.
        """
        if request.method == "POST":
            data = request.data

            rows = data['data'].split('\n')

            """
            username = os.getlogin()  # Fetch username
            file = open(f'C:\\Users\\{username}\\Desktop\\fusion_peptide_' + str(today) + '.csv', 'w', newline='')
            file.write(data['data'])
            file.close()
            """
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="fusion_peptide_results.csv"'
            writer = csv.writer(response)

            for i in rows:
                writer.writerow(i)

            # return JsonResponse({'response': "Data successfully saved."}, safe=False)
            return response
        raise Http404

    @api_view(["POST"])
    @csrf_exempt
    def write_inhibitor_antibody_results(request):
        """
        Inhibitor Antibody table query results.
        """
        if request.method == "POST":
            """
            data = request.data
            today = datetime.now()
            today = today.strftime("%d-%m-%Y-%H%M%S")
            username = os.getlogin()  # Fetch username
            file = open(f'C:\\Users\\{username}\\Desktop\\inhibitor_antibody_' + str(today) + '.csv', 'w', newline='')
            file.write(data['data'])
            file.close()
            return JsonResponse({'response': "Data successfully saved."}, safe=False)
        raise Http404
        """
        if request.method == "POST":
            data = request.data

            rows = data['data'].split('\n')

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="fusion_peptide_results.csv"'
            writer = csv.writer(response)

            for i in rows:
                writer.writerow(i)

            # return JsonResponse({'response': "Data successfully saved."}, safe=False)
            return response
        raise Http404

    @api_view(["POST"])
    @csrf_exempt
    def write_peptide_references_results(request):
        """
        Fusion peptide references table query results.
        """
        if request.method == "POST":
            """
            data = request.data
            today = datetime.now()
            today = today.strftime("%d-%m-%Y-%H%M%S")
            username = os.getlogin()  # Fetch username
            file = open(f'C:\\Users\\{username}\\Desktop\\peptide_references_' + str(today) + '.csv', 'w', newline='')
            file.write(data['data'])
            file.close()
            return JsonResponse({'response': "Data successfully saved."}, safe=False)
            """
            data = request.data

            rows = data['data'].split('\n')

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="peptide_references_results.csv"'
            writer = csv.writer(response)

            for i in rows:
                writer.writerow(i)

            # return JsonResponse({'response': "Data successfully saved."}, safe=False)
            return response
        raise Http404

    @api_view(["POST"])
    @csrf_exempt
    def write_peptide_references_results(request):
        """
        Fusion peptide references table query results.
        """
        if request.method == "POST":
            """
            data = request.data
            today = datetime.now()
            today = today.strftime("%d-%m-%Y-%H%M%S")
            username = os.getlogin()  # Fetch username
            file = open(f'C:\\Users\\{username}\\Desktop\\peptide_references_' + str(today) + '.csv', 'w', newline='')
            file.write(data['data'])
            file.close()
            return JsonResponse({'response': "Data successfully saved."}, safe=False)
        raise Http404
        """
            data = request.data

            rows = data['data'].split('\n')

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="peptide_references_results.csv"'
            writer = csv.writer(response)

            for i in rows:
                writer.writerow(i)

            # return JsonResponse({'response': "Data successfully saved."}, safe=False)
            return response
        raise Http404


    @api_view(["POST"])
    @csrf_exempt
    def write_peptide_structures_results(request):
        """
        Fusion peptide structures table query results.
        """
        if request.method == "POST":
            """
            data = request.data
            today = datetime.now()
            today = today.strftime("%d-%m-%Y-%H%M%S")
            username = os.getlogin()  # Fetch username
            file = open(f'C:\\Users\\{username}\\Desktop\\peptide_structures_' + str(today) + '.csv', 'w', newline='')
            file.write(data['data'])
            file.close()
            return JsonResponse({'response': "Data successfully saved."}, safe=False)
        raise Http404
        """
            data = request.data

            rows = data['data'].split('\n')

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="peptide_structures_results.csv"'
            writer = csv.writer(response)

            for i in rows:
                writer.writerow(i)

            # return JsonResponse({'response': "Data successfully saved."}, safe=False)
            return response
        raise Http404

    @api_view(["POST"])
    @csrf_exempt
    def write_protein_results(request):
        """
        Fusion protein table query results.
        """
        if request.method == "POST":
            """
            data = request.data
            today = datetime.now()
            today = today.strftime("%d-%m-%Y-%H%M%S")
            username = os.getlogin()  # Fetch username
            file = open(f'C:\\Users\\{username}\\Desktop\\protein_' + str(today) + '.csv', 'w', newline='')
            file.write(data['data'])
            file.close()
            return JsonResponse({'response': "Data successfully saved."}, safe=False)
        raise Http404
        """
            data = request.data

            rows = data['data'].split('\n')

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="fusion_protein_results.csv"'
            writer = csv.writer(response)

            for i in rows:
                writer.writerow(i)

            # return JsonResponse({'response': "Data successfully saved."}, safe=False)
            return response
        raise Http404

    @api_view(["POST"])
    @csrf_exempt
    def write_protein_references_results(request):
        """
        Fusion protein references table query results.
        """
        if request.method == "POST":

            """
            data = request.data
            today = datetime.now()
            today = today.strftime("%d-%m-%Y-%H%M%S")
            username = os.getlogin()  # Fetch username
            file = open(f'C:\\Users\\{username}\\Desktop\\protein_references_' + str(today) + '.csv', 'w', newline='')
            file.write(data['data'])
            file.close()
            return JsonResponse({'response': "Data successfully saved."}, safe=False)
        raise Http404
        """
            data = request.data

            rows = data['data'].split('\n')

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="protein_references_results.csv"'
            writer = csv.writer(response)

            for i in rows:
                writer.writerow(i)

            # return JsonResponse({'response': "Data successfully saved."}, safe=False)
            return response
        raise Http404


    @api_view(["POST"])
    @csrf_exempt
    def write_tax_host_results(request):
        """
        Tax Host table query results.
        """
        if request.method == "POST":
            """
            data = request.data
            today = datetime.now()
            today = today.strftime("%d-%m-%Y-%H%M%S")
            username = os.getlogin()  # Fetch username
            file = open(f'C:\\Users\\{username}\\Desktop\\tax_host_' + str(today) + '.csv', 'w', newline='')
            file.write(data['data'])
            file.close()
            return JsonResponse({'response': "Data successfully saved."}, safe=False)
        raise Http404
        """
            data = request.data

            rows = data['data'].split('\n')

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="virus_hosts_results.csv"'
            writer = csv.writer(response)

            for i in rows:
                writer.writerow(i)

            # return JsonResponse({'response': "Data successfully saved."}, safe=False)
            return response
        raise Http404


    @api_view(["POST"])
    @csrf_exempt
    def write_taxonomy_virus_results(request):
        """
        Taxonomy Virus table query results.
        """
        if request.method == "POST":
            """
            data = request.data
            today = datetime.now()
            today = today.strftime("%d-%m-%Y-%H%M%S")
            username = os.getlogin()  # Fetch username
            file = open(f'C:\\Users\\{username}\\Desktop\\taxonomy_virus_' + str(today) + '.csv', 'w', newline='')
            file.write(data['data'])
            file.close()
            return JsonResponse({'response': "Data successfully saved."}, safe=False)
        raise Http404
        
        writer = csv.writer(file)
        writer.writerow(['idtaxonomy', 'commonname', 'family', 'genre',
                         'species', 'subspecies', 'ncbitax'])
        for obj in list(queryset.values()):
            writer.writerow(
                [obj['idtaxonomy'], obj['commonname'], obj['family'], obj['genre'],
                 obj['species'], obj['subspecies'], obj['ncbitax']])
        """
            data = request.data

            rows = data['data'].split('\n')

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="virus_taxonomy_results.csv"'
            writer = csv.writer(response)

            for i in rows:
                writer.writerow(i)

            # return JsonResponse({'response': "Data successfully saved."}, safe=False)
            return response
        raise Http404


"""
From now on, all the tables are similar, just for different serializers:
(TableName)APIView is each tables API View, that have its queryset from each model, and on each are defined filterset and search are defined all the possible attributes to run the search against.
Each of those methods have 3 functions: get_object (to get object to modify / delete); put (to modify an object) and delete (to delete an object).
(TableName)APIView_Save are very similar to the first ones, but with CustomPagination, to allow all objects to be in the same page; this will be used to save query results. 
"""


class FusionPeptidesAPIView(generics.ListCreateAPIView):
    queryset = FusionPeptides.objects.all()
    serializer_class = FusionPeptidesSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idfusion_peptides', 'residues', 'sequence', 'annotation_method',
                        'exp_evidence', 'protein', 'protein__name', 'protein__idtaxonomy',
                        'protein__idtaxonomy__family',
                        'protein__idtaxonomy__commonname']
    search_fields = ['idfusion_peptides', 'residues', 'sequence', 'annotation_method',
                     'exp_evidence', 'protein__name', 'protein__idtaxonomy__family',
                     'protein__idtaxonomy__commonname']

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return FusionPeptides.objects.get(pk=pk)
        except FusionPeptides.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = FusionPeptidesSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FusionPeptidesAPIView_Save(generics.ListCreateAPIView):
    queryset = FusionPeptides.objects.all()
    serializer_class = FusionPeptidesSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idfusion_peptides', 'residues', 'sequence', 'annotation_method',
                        'exp_evidence', 'protein', 'protein__name', 'protein__idtaxonomy',
                        'protein__idtaxonomy__family',
                        'protein__idtaxonomy__commonname']
    search_fields = ['idfusion_peptides', 'residues', 'sequence', 'annotation_method',
                     'exp_evidence', 'protein__name', 'protein__idtaxonomy__family',
                     'protein__idtaxonomy__commonname']
    pagination_class = CustomPagination


class FusionPeptidesAPIView_Autocomplete(generics.ListCreateAPIView):
    queryset = FusionPeptides.objects.all()
    serializer_class = FusionPeptidesSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idfusion_peptides', 'residues', 'sequence', 'annotation_method',
                        'exp_evidence', 'protein', 'protein__name', 'protein__idtaxonomy',
                        'protein__idtaxonomy__family',
                        'protein__idtaxonomy__commonname', 'protein__idtaxonomy__family']
    search_fields = ['idfusion_peptides', 'residues', 'sequence', 'annotation_method',
                     'exp_evidence', 'protein__name', 'protein__idtaxonomy__family',
                     'protein__idtaxonomy__commonname']
    pagination_class = AutoCompletePagination


class HostAPIView(generics.ListCreateAPIView):
    queryset = Host.objects.all()
    serializer_class = HostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idhost', 'host', 'ncbitax']
    search_fields = filterset_fields

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return Host.objects.get(pk=pk)
        except Host.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = HostSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class InhibitorAntibodyAPIView(generics.ListCreateAPIView):
    queryset = InhibitorAntibody.objects.all()
    serializer_class = InhibitorAntibodySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idsubstance', 'type', 'repository', 'id_repository', 'idprotein']
    search_fields = ['idsubstance', 'type', 'repository', 'id_repository', 'idprotein__name',
                     'idprotein__idtaxonomy__commonname']

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return InhibitorAntibody.objects.get(pk=pk)
        except InhibitorAntibody.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = InhibitorAntibodySerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class InhibitorAntibodyAPIView_Save(generics.ListCreateAPIView):
    queryset = InhibitorAntibody.objects.all()
    serializer_class = InhibitorAntibodySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idsubstance', 'type', 'repository', 'id_repository', 'idprotein']
    search_fields = ['idsubstance', 'type', 'repository', 'id_repository', 'idprotein__name',
                     'idprotein__idtaxonomy__commonname']
    pagination_class = CustomPagination


class PeptideReferencesAPIView(generics.ListCreateAPIView):
    queryset = PeptideReferences.objects.all()
    serializer_class = PeptideReferencesSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idpeptide', 'idreferences', 'idreferences__doi',
                        'idpeptide__protein__idtaxonomy__commonname']
    search_fields = ['idpeptide__protein__name', 'idreferences__doi',
                     'idpeptide__protein__idtaxonomy__commonname']

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return PeptideReferences.objects.get(pk=pk)
        except PeptideReferences.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = PeptideReferencesSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PeptideReferencesAPIView_Save(generics.ListCreateAPIView):
    queryset = PeptideReferences.objects.all()
    serializer_class = PeptideReferencesSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idpeptide', 'idreferences', 'idreferences__doi',
                        'idpeptide__protein__idtaxonomy__commonname']
    search_fields = ['idpeptide__protein__name', 'idreferences__doi',
                     'idpeptide__protein__idtaxonomy__commonname']
    pagination_class = CustomPagination


class PeptideStructureAPIView(generics.ListCreateAPIView):
    queryset = PeptideStructure.objects.all()
    serializer_class = PeptideStructureSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idpeptide', 'idprotein','idstructure',
                        'idstructure__id_repository']
    # search_fields = filterset_fields
    search_fields = ['idpeptide__protein__name', 'idpeptide__protein__idtaxonomy__commonname',
                     'idstructure__id_repository']

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return PeptideStructure.objects.get(pk=pk)
        except PeptideStructure.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = PeptideReferencesSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PeptideStructureAPIView_Save(generics.ListCreateAPIView):
    queryset = PeptideStructure.objects.all()
    serializer_class = PeptideStructureSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idpeptide', 'idstructure',
                        'idstructure__id_repository']
    # search_fields = filterset_fields
    search_fields = ['idpeptide__protein__name', 'idpeptide__protein__idtaxonomy__commonname',
                     'idstructure__id_repository']
    pagination_class = CustomPagination


class ProteinAPIView(generics.ListCreateAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idprotein', 'name', 'class_field', 'activation',
                        'name_fusogenic_unit', 'sequence_fusogenic',
                        'uniprotid', 'ncbiid', 'idtaxonomy', 'idtaxonomy__commonname', 'idtaxonomy__family']
    # search_fields = filterset_fields
    search_fields = ['idprotein', 'name', 'class_field', 'activation',
                     'name_fusogenic_unit', 'sequence_fusogenic',
                     'uniprotid', 'ncbiid', 'idtaxonomy__commonname', 'idtaxonomy__family']

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return Protein.objects.get(pk=pk)
        except Protein.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = ProteinSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProteinAPIView_Save(generics.ListCreateAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idprotein', 'name', 'class_field', 'activation',
                        'name_fusogenic_unit', 'sequence_fusogenic',
                        'uniprotid', 'ncbiid', 'idtaxonomy', 'idtaxonomy__commonname','idtaxonomy__family']
    # search_fields = filterset_fields
    search_fields = ['idprotein', 'name', 'class_field', 'activation',
                     'name_fusogenic_unit', 'sequence_fusogenic',
                     'uniprotid', 'ncbiid', 'idtaxonomy__commonname','idtaxonomy__family']
    pagination_class = CustomPagination


class ProteinAPIView_Autocomplete(generics.ListCreateAPIView):
    queryset = Protein.objects.all()
    serializer_class = ProteinSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idprotein', 'name', 'class_field', 'activation',
                        'name_fusogenic_unit', 'sequence_fusogenic',
                        'uniprotid', 'ncbiid', 'idtaxonomy', 'idtaxonomy__commonname','idtaxonomy__family']
    # search_fields = filterset_fields
    search_fields = ['idprotein', 'name', 'class_field', 'activation',
                     'name_fusogenic_unit', 'sequence_fusogenic',
                     'uniprotid', 'ncbiid', 'idtaxonomy__commonname','idtaxonomy__family']
    pagination_class = AutoCompletePagination


class ProteinReferencesAPIView(generics.ListCreateAPIView):
    queryset = ProteinReferences.objects.all()
    serializer_class = ProteinReferencesSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idprotein', 'idreferences', 'idreferences__doi',
                        'idprotein__idtaxonomy__commonname']
    # search_fields = filterset_fields
    search_fields = ['idreferences__doi', 'idprotein__name',
                     'idprotein__idtaxonomy__commonname']

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return ProteinReferences.objects.get(pk=pk)
        except ProteinReferences.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = ProteinReferencesSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProteinReferencesAPIView_Save(generics.ListCreateAPIView):
    queryset = ProteinReferences.objects.all()
    serializer_class = ProteinReferencesSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idprotein', 'idreferences', 'idreferences__doi',
                        'idprotein__idtaxonomy__commonname']
    # search_fields = filterset_fields
    search_fields = ['idreferences__doi', 'idprotein__name',
                     'idprotein__idtaxonomy__commonname']
    pagination_class = CustomPagination


class StructureAPIView(generics.ListCreateAPIView):
    queryset = Structure.objects.all()
    serializer_class = StructureSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idstructure', 'exp_method', 'repository', 'id_repository', 'reference__doi']
    search_fields = filterset_fields

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return Structure.objects.get(pk=pk)
        except Structure.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = StructureSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReferencesAPIView(generics.ListCreateAPIView):
    queryset = References.objects.all()
    serializer_class = ReferencesSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idreferences', 'doi']
    search_fields = filterset_fields

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return References.objects.get(pk=pk)
        except References.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = ReferencesSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaxHostAPIView(generics.ListCreateAPIView):
    queryset = TaxHost.objects.all()
    serializer_class = TaxHostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idtaxonomy', 'idtaxonomy__commonname', 'idtaxonomy__ncbitax',
                        'idhost', 'idhost__host', 'idhost__ncbitax']
    # search_fields = filterset_fields
    search_fields = ['idtaxonomy__commonname', 'idtaxonomy__ncbitax',
                     'idhost__host', 'idhost__ncbitax']

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return TaxHost.objects.get(pk=pk)
        except TaxHost.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = TaxHostSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaxHostAPIView_Save(generics.ListCreateAPIView):
    queryset = TaxHost.objects.all()
    serializer_class = TaxHostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idtaxonomy', 'idtaxonomy__commonname', 'idtaxonomy__ncbitax',
                        'idhost', 'idhost__host', 'idhost__ncbitax']
    # search_fields = filterset_fields
    search_fields = ['idtaxonomy__commonname', 'idtaxonomy__ncbitax',
                     'idhost__host', 'idhost__ncbitax']
    pagination_class = CustomPagination


class TaxonomyVirusAPIView(generics.ListCreateAPIView):
    queryset = TaxonomyVirus.objects.all()
    serializer_class = TaxonomyVirusSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idtaxonomy', 'commonname', 'family', 'genre',
                        'species', 'subspecies', 'ncbitax']
    search_fields = filterset_fields

    def get_object(self, pk=None):
        if pk is None: return
        try:
            return TaxonomyVirus.objects.get(pk=pk)
        except TaxonomyVirus.DoesNotExist:
            raise Http404

    def put(self, request, pk=None, format=None):
        if pk is None: return Response(status=status.HTTP_400_BAD_REQUEST)
        snippet = self.get_object(pk)
        serializer = TaxonomyVirusSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None, format=None):
        if pk is None: return
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaxonomyVirusAPIView_Save(generics.ListCreateAPIView):
    queryset = TaxonomyVirus.objects.all()
    serializer_class = TaxonomyVirusSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idtaxonomy', 'commonname', 'family', 'genre',
                        'species', 'subspecies', 'ncbitax']
    search_fields = filterset_fields
    pagination_class = CustomPagination


class TaxonomyVirusAPIView_Autocomplete(generics.ListCreateAPIView):
    queryset = TaxonomyVirus.objects.all()
    serializer_class = TaxonomyVirusSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['idtaxonomy', 'commonname', 'family', 'genre',
                        'species', 'subspecies', 'ncbitax']
    search_fields = filterset_fields
    pagination_class = AutoCompletePagination

"""
############################## AUTOCOMPLETE ###################


from dal import autocomplete
from django.db.models import Q

class TaxonomyVirusAutocomplete(autocomplete.Select2QuerySetView):

    def get_queryset(self):
        if 'q' in self.request.GET:
            #query = self.request.GET.get('q', '')

            qs = TaxonomyVirus.objects.all()

            query = self.q

            # qs_dict = {}

            if query:
                # qs = qs.filter(commonname__istartswith=query)
                qs = qs.filter(Q(commonname__icontains=query) | Q(family__icontains=query) | Q(
                    genre__icontains=query) | Q(species__icontains=query) | Q(subspecies__icontains=query) | Q(
                    ncbitax__icontains=query)).values()

                
                for i in qs:
                    qs_dict[index] = {"id": i.idtaxonomy,
                                      "text": str(i.idtaxonomy) + ',' + str(i.commonname) + ',' + str(i.family) + ',' +
                                        str(i.genre) + ',' + str(i.species) + ',' + str(i.subspecies) + ',' + str(i.ncbitax),
                                      "selected_text": self.q}
                return json.dumps(qs_dict)
                
    
                return qs

            else: return qs
        return None
"""