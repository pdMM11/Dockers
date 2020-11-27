# -*- coding: utf-8 -*-
"""
Created on Fri May 29 15:35:41 2020

@author: pedro
"""

import pandas as pd
#from rest_framework import status
#from rest_framework.response import Response
from Propythia_ML_PMML import MachineLearning_PMML
#from sklearn2pmml import sklearn2pmml
from pypmml import Model


seq = "STGQKSIVAYTMSLGAENSIAYANNSIAIPTNFSISVTTEVMPVSMAKTAVDCTMYICGDSLECSNLLLQYGSFCTQLNRALTGIAIEQDKNTQEVFAQVKQMYKTPAIKDFGGFNFSQILPDPSKPTKRSFIEDLLFNKVTLADAGFMKQYGDCLGDVSARDLICAQKFNGLTVLPPLLTDEMVAAYTAALVSGTATAGWTFGAGAALQIPFAMQMAYRFNGIGVTQNVLYENQKLIANQFNSAIGKIQESLSSTASALGKLQDVVNQNAQALNTLVKQLSSNFGAISSVLNDILSRLDKVEAEVQIDRLITGRLQSLQTYVTQQLIRAAEIRASANLAATKMSECVLGQSKRVDFCGKGYHLMSFPQSAPHGVVFLHVTYVPSQEKNFTTAPAICHEGKAYFPREGVFVSNGTSWFITQRNFYSPQLITTDNTFVSGNCDVVIGIINNTVYDPLQPELDSFKEELDKYFKNHTSPDVDLGDISGINASVVNIQKEIDRLNEVAKNLNESLIDLQELGKYEQYIKWPWYVWLGFIAGLIAIVMVTILLCCMTSCCSCLKGACSCGSCCKFDEDDSEPVLKGVKLHYT"
gap = 1
window_size = 15

model = Model.fromFile('Model_pmml_svm_28052020.pmml')

print(model)

dataset = pd.read_csv(r'dataset3_all_svc.csv', delimiter=',')

x_original = dataset.loc[:, dataset.columns != 'labels']
labels = dataset['labels']

        # create Machine learning object
        # ml = MachineLearning(x_original, labels, classes=['non_vfp', 'vfp'])
ml = MachineLearning_PMML(x_original, labels, classes=['non_vfp', 'vfp'])

result = ml.predict_window(model, seq=seq, x=None, window_size=window_size,
                                   gap=gap, features=[], names=None, y=None,
                                   filename=None)