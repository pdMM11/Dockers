import pickle
from propythia.machine_learning import MachineLearning
import pandas as pd
from django.http import JsonResponse

from celery import Celery

app = Celery('vfp_web_server', broker='redis://redis_vfp:6379/0')


@app.task
def add(x, y):
    return x + y

@app.task
def MachineLearningTask(model_picked, seq, window_size, gap,):

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

