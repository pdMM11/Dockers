# -*- coding: utf-8 -*-
"""
Created on Fri Aug  7 15:49:31 2020

@author: pedro
"""

import pandas as pd
from descriptors_conserv import Descriptor 
from propythia.sequence import ReadSequence
import pickle


from propythia.clustering import Cluster
from sklearn.preprocessing import StandardScaler
import timeit
import pandas as pd
from sklearn.svm import SVC
from propythia.sequence import ReadSequence
# from propythia.descriptors import Descriptor
from propythia.sequence import ReadSequence
import timeit
from propythia.feature_reduction import FeatureReduction
import pandas as pd
from propythia.feature_selection import FeatureSelection
import pandas as pd
from sklearn.feature_selection import GenericUnivariateSelect
from sklearn.feature_selection import f_classif, mutual_info_classif
#from sklearn.feature_selection import f_regression, mutual_info_regression #for regression problems
from sklearn.feature_selection import SelectFromModel
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import ExtraTreesClassifier
from propythia.adjuv_functions.scoring.scores import score_methods
#from propythia.machine_learning import MachineLearning
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import label_binarize
from sklearn.model_selection import ShuffleSplit
from propythia.preprocess import Preprocess


from Propythia_ML_weblogos import MachineLearning


def read_dataset(filename='dataset1_usar.csv'):
    """

    Parameters
    ----------
    filename : TYPE, optional
        DESCRIPTION. The default is 'dataset1_usar.csv'.

    Returns
    -------
    dataset : TYPE
        DESCRIPTION.

    """
    dataset = pd.read_csv(filename, names=['name', 'seq'])
    labels = []
    for i in range(dataset.shape[0]):
        if i < dataset.shape[0]/2: labels.append('neg')
        else: labels.append('pos')
    dataset['labels'] = labels
    return dataset

def get_descriptors(dataset):
    """

    Parameters
    ----------
    dataset : TYPE
        DESCRIPTION.

    Returns
    -------
    None.

    """
    sequence=ReadSequence() #create the object to read sequence
    descriptors = {}
    
    for i in range(dataset.shape[0]):
        print(dataset.loc[i,'seq'])
        ps_string=sequence.read_protein_sequence(dataset.loc[i,'seq'])#from string
        protein=Descriptor(ps_string)
        if descriptors == {}:
            
            descriptors_temp=protein.get_all() #all except tripeptide and binaries representations
            
            descriptors_temp['labels'] = dataset.loc[i,'labels']
            
            for key in descriptors_temp.keys():
                descriptors[key] = [descriptors_temp[key]]
    
        else:
            descriptors_temp=protein.get_all() #all except tripeptide and binaries representations
            descriptors_temp['labels'] = dataset.loc[i,'labels']
            
            for key in descriptors_temp.keys():
                descriptors[key].append(descriptors_temp[key])
        
    return descriptors

def save_descriptors(dataset, filename='descriptors.sav'):
    pickle.dump(dataset, open(filename, 'wb'))
    

def get_dataset(filename='descriptors.sav'):
    dataset = {}
    with open(filename, 'rb') as handle:
        dataset = pickle.load(handle)
        
    
    dataset_pd = pd.DataFrame.from_dict(dataset)
    
    print(dataset_pd)
    
    return dataset_pd


def test_preprocess(dataset):

    # separate labels
    labels = dataset['labels']
    dataset = dataset.loc[:, dataset.columns != 'labels']

    # Create Preprocess object
    prepro = Preprocess()

    # CHECK IF NAN
    prepro.missing_data(dataset)

    dataset_zero, colum_Zero = prepro.remove_columns_all_zeros(dataset, True)  # remove zero columns

    dataset_without_duplicate, column_duplicated = prepro.remove_duplicate_columns(dataset_zero,
                                                                                   True)  # DUPLICATED COLUMNS

    # REMOVE ZERO VARIANCE COLUMNS
    dataset_clean, column_not_variable = prepro.remove_low_variance(dataset_without_duplicate, standard=True,
                                                                    columns_names=True)
    # print(column_not_variable)
    # print(dataset_clean.shape)

    ######OR

    dataset_clean, columns_deleted = prepro.preprocess(dataset, columns_names=True, threshold=0, standard=True)

    # put labels back
    dataset_clean['labels'] = labels
    print(dataset_clean.shape)
    
    return dataset_clean
    

def test_feature_reduction(dataset):


    labels = dataset['labels']
    dataset = dataset.loc[:, dataset.columns != 'labels']

    # createObject
    fea_reduced=FeatureReduction()

    # perform pca
    pca,x_pca=fea_reduced.pca(dataset, n_components=50)

    # check the variance ratio of components
    print(fea_reduced.variance_ratio_components(x_pca))

    # table with the contribution of each feature to the pca. does not mean that are the most significant.
    # Unsupervised learning
    print(fea_reduced.contribution_of_features_to_component(dataset, pca, x_pca))

    # GRAPHS
    # bar plot with the contribution of each pca
    fea_reduced.pca_bar_plot(pca)

    # scatter plot of two principal components relative to labels
    fea_reduced.pca_scatter_plot(dataset, pca, x_pca, labels)

    print("Original shape: {}".format(str(dataset.shape)))
    print("Reduced shape: {}".format(str(x_pca.shape)))
    print('Variance explained by PC:', sum(pca.explained_variance_ratio_))
    print("Number of components {}".format(pca.n_components_))
    

def test_feature_selection(dataset):
    x_original=dataset.loc[:, dataset.columns != 'labels']
    labels=dataset['labels']

    fselect=FeatureSelection(dataset, x_original, labels)

    """
    # #**Select KBest**
    # #KBest com *mutual info classif*
    X_fit_univariate, X_transf_univariate,column_selected,scores,dataset_features = \
        fselect.univariate(score_func=mutual_info_classif, mode='k_best', param=1000)
    

    #**Select Percentile
    #Percentile with *f classif*
    X_fit_univariate, X_transf_univariate,column_selected,scores,dataset_features = \
        fselect.univariate(score_func=f_classif, mode='percentile', param=0.6)

    # Select only the features with p value inferior to 0.015
    X_fit_univariate, X_transf_univariate,column_selected,scores,dataset_features \
        = fselect.univariate(score_func=f_classif, mode='fpr', param=0.05)

    #shape of transformed dataset
    print(X_transf_univariate.shape)
    #columns selected by high score
    print(fselect.features_scores(x_original,scores,column_selected, False))
 


    #**SRecursive feature elimination
    #estimator=SVC kernel=linear with 5 cross validation
    X_fit_rfe, X_transf_rfe,column_selected,ranking,dataset_features= \
        fselect.recursive_feature_elimination(cross_validation=True,cv=5)
    

    #shape of transformed dataset
    print(X_transf_rfe.shape)
    #columns selected names
    print(dataset.columns[column_selected])
    #scores
    score_methods(x_original,X_transf_rfe,labels)
    #
    """
    # Select from model
    
    # L1-based feature selection   f linear_model.LogisticRegression/svm.LinearSVC for classification
    # With SVMs and logistic-regression, the parameter C controls the sparsity: the smaller C the fewer features selected.
    model_lsvc = LinearSVC(C=1, penalty="l1", dual=False)
    model_lr=LogisticRegression(C=0.1, penalty="l2", dual=False)
    model_tree=ExtraTreesClassifier(n_estimators=50)
    """

    # Select from model
    #model= Tree classifier. 50 estiamtors
    X_fit_model, X_transf_model,column_selected,feature_importances,feature_importances_DF,dataset_features= \
        fselect.select_from_model_feature_elimination(model=model_tree)

    #model= logistic regression

    X_fit_model, X_transf_model,column_selected,feature_importances,feature_importances_DF,dataset_features= \
        fselect.select_from_model_feature_elimination( model=model_lr)
        """
    #model= linearsvs
    X_fit_model, X_transf_model,column_selected,feature_importances,feature_importances_DF,dataset_features= \
        fselect.select_from_model_feature_elimination(model=model_lsvc)

    """
    print('original shape', dataset.shape)
    print('reduce shape', fselect.dataset.shape)
    print('dataset reduced with column names\n', fselect.dataset.head(3))
    print('feature importances\n',feature_importances_DF)
    print('scores')
    score_methods(x_original,X_transf_model,labels)
    print(fselect.dataset)
            """

    
    return fselect.dataset

def test_clustering(dataset):

    #separate labels
    x_original=dataset.loc[:, dataset.columns != 'labels']
    labels=dataset.loc[:,'labels']

    #scale data
    scaler = StandardScaler()
    scaler.fit_transform(x_original)

    #create the cluster object
    clust=Cluster(x_original,labels)

    # #perform K means
    clust.kmeans_predict().classify(model=SVC())
    clust.kmeans()

    #perform hierarchical clustering
    clust.hierarchical(metric='correlation', method='average')
    clust.hierarchical(metric='euclidean', method='ward')
    clust.hierarchical(metric='correlation', method='complete')
    clust.hierarchical(metric='cityblock', method='average')
    clust.hierarchical(metric='euclidean', method='complete')

    
def test_machine_learning(dataset):
    #split dataset
    # dataset = pd.read_csv(r'datasets/dataset1_test_clean_fselection.csv', delimiter=',')
    
    
    print(dataset.shape)
    
    x_original=dataset.loc[:, dataset.columns != 'labels']
    labels=dataset['labels']

    #create Machine learning object
    ml=MachineLearning(x_original, labels, classes=['pos', 'neg'])
    
    
    filename = 'crmapp/ml_models/dataset3_all_'
    
    #tests models
    print('best model svm')
    best_svm_model = ml.train_best_model('svm')
    
    pickle.dump(best_svm_model, open(filename + 'svm_model_24082020.sav', 'wb'))
    
    
    print('best model rf')
    best_rf_model = ml.train_best_model('rf')
    
    pickle.dump(best_rf_model, open(filename + 'rf_model_24082020.sav', 'wb'))
    
    print('best model sgd')
    best_sgd_model = ml.train_best_model('sgd')
    
    pickle.dump(best_sgd_model, open(filename + 'sgd_model_24082020.sav', 'wb'))
    
    print('best model gradient boosting')
    best_gboosting_model = ml.train_best_model('gboosting')
    
    pickle.dump(best_gboosting_model, open(filename + 'gboosting_model_24082020.sav', 'wb'))
    
    print('best model lr')
    best_lr_model = ml.train_best_model('lr')
    
    pickle.dump(best_lr_model, open(filename + 'lr_model_24082020.sav', 'wb'))

    # feature importance of models
    ml.features_importances(best_svm_model,'svm')
    ml.features_importances(best_rf_model,'rf')
    # ml.features_importances(best_sgd_model,'sgd')
    # ml.features_importances(best_gboosting_model,'gboosting')
    # ml.features_importances(best_lr_model,'lr')

    print('best model nn')
    best_nn_model = ml.train_best_model('nn')
    
    pickle.dump(best_nn_model, open(filename + 'nn_model_24082020.sav', 'wb'))

    print('best model gnb')
    best_gnb_model = ml.train_best_model('gnb')
    
    pickle.dump(best_gnb_model, open(filename + 'gnb_model_24082020.sav', 'wb'))

    print('best model knn')
    best_knn_model = ml.train_best_model('knn')
    
    pickle.dump(best_knn_model, open(filename + 'knn_model_24082020.sav', 'wb'))


    #plot validation curve
    print('plot validation_svm')
    ml.plot_validation_curve(best_svm_model, param_name='clf__C',
                             param_range=[0.00001,0.0001, 0.001, 0.01, 0.1, 1, 10,100])

    # print('plot validation_gboosting')
    # ml.plot_validation_curve(best_gboosting_model, param_name='clf__n_estimators',
    #                          param_range=[ 1, 10,100,500])


    print('score_test_set_svm')
    print(ml.score_testset(best_svm_model))

    print('score_test_set_rf')
    print(ml.score_testset(best_rf_model))

    print('score_test_set_rf')
    print(ml.score_testset(best_rf_model))

    print('score_test_set_gboosting')
    print(ml.score_testset(best_gboosting_model))

    print('score_test_set_lr')
    print(ml.score_testset(best_lr_model))
    #
    # print('roc curve')
    # ml.plot_roc_curve(best_svm_model)
    #
    # print('roc curve')
    # ml.plot_roc_curve(best_gboosting_model)
    #
    # print('roc curve')
    # ml.plot_roc_curve(best_lr_model)

    # print('plot learning curve')
    # title = "Learning Curves (SVM)"
    # # # SVC is more expensive so we do a lower number of CV iterations:
    # cv = ShuffleSplit(n_splits=50, test_size=0.3, random_state=42)
    # ml.plot_learning_curve(best_svm_model, title, ylim=(0.8, 1.01), cv=cv, n_jobs=4)
    #
    # cv = ShuffleSplit(n_splits=50, test_size=0.3, random_state=42)
    # ml.plot_learning_curve(best_lr_model, title="Learning Curves (LR)", ylim=(0.8, 1.01), cv=cv, n_jobs=4)
    # #
    # title = "Learning Curves (RF)"
    # # # SVC is more expensive so we do a lower number of CV iterations:
    # ml.plot_learning_curve(best_rf_model, title, ylim=(0.8, 1.01), cv=10, n_jobs=4)

    # title = "Learning Curves (SGD)"
    # # Cross validation with 100 iterations to get smoother mean tests and train
    # # score curves, each time with 20% data randomly selected as a validation set.
    # ml.plot_learning_curve(best_sgd_model, title, ylim=(0.4, 1.01), cv=cv, n_jobs=4)
    # #
    # title = "Learning Curves (Neural Networks)"
    # # Cross validation with 100 iterations to get smoother mean tests and train
    # # score curves, each time with 20% data randomly selected as a validation set.
    # ml.plot_learning_curve(best_nn_model, title, ylim=(0.7, 1.01), cv=cv, n_jobs=4)
    # #
    # title = "Learning Curves (Naive Bayes - Gaussian)"
    # # Cross validation with 100 iterations to get smoother mean tests and train
    # # score curves, each time with 20% data randomly selected as a validation set.
    # ml.plot_learning_curve(best_gnb_model, title, ylim=(0.7, 1.01), cv=cv, n_jobs=4)
    # #
    # title = "Learning Curves (Gboosting)"
    # # # SVC is more expensive so we do a lower number of CV iterations:
    # cv = ShuffleSplit(n_splits=50, test_size=0.3, random_state=42)
    # ml.plot_learning_curve(best_gboosting_model, title, ylim=(0.8, 1.01), cv=cv, n_jobs=4)
    #
    #
    #
    # #make previsions
    #X_train, X_test, y_train, y_test = train_test_split(x_original,labels)
    #print('predict_svm')
    #df = ml.predict(best_svm_model, x=X_test, seqs=y_test)
    #print(df.head(10))

    #seq='IQIPSEFTIGNMEEFIQTSSPKVTIDCAAFVCGDYAACKSQLVEYGSFCDNINAILTEVNELLDTTQLQVANSLMNGVTLSTKLKDGVNFNVDDINFSSVLGCLGSECSKASSRSAIEDLLFDKVKLSDVGFVAAYNNCTGGAEIRDLICVQSYKGIKVLPPLLSENQISGYTLAATSASLFPPWTAAAGVPFYLNVQYRINGLGVTMDVLSQNQKLIANAFNNALDAIQEGFDATNSALVKIQAVVNANAEALNNLLQQLSNRFGAISSSLQEILSRLDALEAEAQIDRLINGRLTALNAYVSQQLSDSTLVKFSAAQAMEKVNECVKSQSSRINFCGNGNHIISLVQNAPYGLYFIHFSYVPTKYVTAKVSPGLCIAGDRGIAPKSGYFVNVNNTWMYTGSGYYYPEPITENNVVVMSTCAVNYTKAPYVMLNTSTPNLPDFREELDQWFKNQTSVAPDLSLDYINVTFLDLQVEMNRLQEAIKVLNQSYINLKDIGTYEYYVKWPWYVWLLIGLAGVAMLVLLFFICCCTGCGTSCFKKCGGCC'
    #ml.predict_window(best_svm_model,seq=seq,x=None, window_size=15,gap=2,features=[], names=None, y=None, filename=None)
   
    
    
def predictions(model, dataset_file='dataset2_usar.csv', dataset='descriptors.sav', gap = 1):
    
    dataset_prev = read_dataset(dataset_file)
    
    dataset_prev_X = dataset_prev.loc[:, 'seq']

    dataset_prev_y = dataset_prev.loc[:, 'labels']
    
    model = pickle.load(open(model, 'rb'))
    
    # dataset = test_preprocess(get_dataset(dataset))
    
    dataset = get_dataset(dataset)

    x_original = dataset.loc[:, dataset.columns != 'labels']

    labels = dataset.loc[:, 'labels']
    
    ml=MachineLearning(x_original, labels, classes=['pos', 'neg'])
    
    """
    results = {'total':len(dataset_prev_X),
               'true_pos':0,
               'true_neg':0,
               'false_pos':0,
               'false_neg':0}
    """
    
    prevs = {}
    
    for i in range(len(dataset_prev_X)):

        seq = dataset_prev_X[i]
        
        print(i, seq)
        
        current_label = dataset_prev_y[i]
        
        
        result = ml.predict_window(model, seq=seq, x=None, window_size=len(seq),
                               gap=gap, features=[], names=None, y=None,
                               filename=None)
        
        #df = ml.predict(model, x=X_test, seqs=y_test)
        
        
        prevs[i] = (result, current_label)
        
        """
        if result['probability'][0] > 0.5 and current_label == 'pos':
            results['true_pos'] += 1
        elif result['probability'][0] <= 0.5 and current_label == 'neg':
            results['true_neg'] += 1
        elif result['probability'][0] <= 0.5 and current_label == 'pos':
            results['false_neg'] += 1
        elif result['probability'][0] > 0.5 and current_label == 'neg':
            results['false_pos'] += 1
        """
        
    return prevs



#def models_no_conserv():
    

    
if __name__ == '__main__':   

#    save_descriptors(get_descriptors(read_dataset('dataset3_usar.csv')), 'descriptors_3_max.sav')
#    save_descriptors(get_descriptors(read_dataset('dataset3_usar.csv')), 'descriptors_3_new.sav')
    
    #get_descriptors(read_dataset())
    
    
#    data = test_feature_selection(test_preprocess(get_dataset('descriptors_new.sav')))
#    test_feature_selection(test_preprocess(get_dataset('descriptors_new.sav')))
#    data = test_feature_selection(test_preprocess(get_dataset('descriptors_1.sav')))
    data = test_feature_selection(test_preprocess(get_dataset('descriptors_3_max.sav')))
#    test_machine_learning(get_dataset('descriptors_3.sav'))

"""    
    results = {}
    for i in ['svm', 'rf',
          'sgd', 'gboosting',
          'lr', 'nn',
          'gnb', 'knn']:
        results[i] = predictions('crmapp/ml_models/dataset3_all_'+i+'_model_24082020.sav', 
                                 'dataset1_usar.csv', 'descriptors_3.sav') 
    save_descriptors(results, filename='results_models_dataset1_24082020_all_features.sav')

    results = {}
    for i in ['svm', 'rf',
          'sgd', 'gboosting',
          'lr', 'nn',
          'gnb', 'knn']:
        results[i] = predictions('crmapp/ml_models/dataset3_all_'+i+'_model_24082020.sav', 
                                 'dataset2_usar.csv', 'descriptors_3.sav') 
    save_descriptors(results, filename='results_models_dataset2_24082020.sav')
"""
