# %%
import os
import pandas as pd
import json



# %%
trading = pd.read_csv(r'../dataset/ETS_Database_v38.tsv', sep = '\t')
trading.rename(columns = {'value':'CO2'}, inplace=True) #renaming Country column


# %%
emission = pd.read_excel(r'../dataset/co2.xlsx', sheet_name='Sheet 1')
cols = [i != 'nan' for i in (map(str, emission.iloc[5].values))]
emission = emission.iloc[:, cols]
emission.columns = ['Country',
    '2000',
    '2001',
    '2002',
    '2003',
    '2004',
    '2005',
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018']
#renaming columns
emission = emission[7:] #dropping first seven rows
emission = emission[:-8] #dropping last 8 rows
emission.rename(columns = {'TIME':'Country'}, inplace=True) #renaming Country column
emission.Country.replace(['Germany (until 1990 former territory of the FRG)'], ['Germany'], inplace=True) #see print below


# %%
ec = [c for c in emission.Country.values]
tc = set([c for c in trading.country.values])
exclude = [i for i in ec if i not in tc] + [i for i in tc if i not in ec]
 

# %% 
trading = trading[~trading['country'].isin(exclude)]
trading = trading[trading['year'] != 2019]
emission = emission[~emission['Country'].isin(exclude)]

# %%
for _, row in emission.iterrows():
    country = row.Country
    for year in emission.columns[1:]:
        trading = trading.append({
            'country' : country,
            'country_code' : 'TODO',
            'ETS information' : 'SUM CO2 emitted',
            'main activity sector name'	: 'Total CO2 emitted',
            'unit' : 'tonne of CO2 equ.',
            'CO2' : row[year],
            'year' : year
        }, ignore_index=True)

# %%
trading.dropna(inplace=True)

# %%
trading.to_csv(r'../dataset/processed.csv')

# %%
with open(r'../src/europe.topojson') as f: 
    txt = json.load(f)
# %%
ctrylist = []
for ctry in txt['objects']['europe']['geometries']:
    ctrylist.append(ctry['properties']['name'])
# %%
print('in map, not in data:', [c for c in ctrylist if c not in trading.country.values])
print('in data, not in map:', set([c for c in trading.country.values if c not in ctrylist]))
# %%
