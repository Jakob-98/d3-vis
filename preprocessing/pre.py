# %%
import os
import networkx as nx
import matplotlib as mp
import pandas as pd



# %%
trading = pd.read_csv(r'../data/europe/eu-ets_csv.txt')

# %%
emission = pd.read_excel(r'../data/europe/co2.xlsx', sheet_name='Sheet 1')
emission.columns = list(emission.iloc[[5]].values) #renaming columns
emission = emission[7:] #dropping first seven columns
emission.rename(columns = {'TIME':'Country'}, inplace=True) #renaming Country column


# %%
