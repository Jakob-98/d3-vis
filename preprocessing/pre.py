# %%
import os
import pandas as pd



# %%
trading = pd.read_csv(r'../dataset/ETS_Database_v38.tsv', sep = '\t')
trading.rename(columns = {'value':'traded_CO2'}, inplace=True) #renaming Country column


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
print([i for i in ec if i not in tc]) # -> turkey, switserland not found
print([i for i in tc if i not in ec]) # -> need to rename Germany

# %%
trading['CO2_emission'] = None
for ix, row in trading.iterrows():
    ctry, year = row.country, row.year
    try: 
        co = emission.loc[emission['Country'] == ctry][year].values[0]
    except:
        continue
    trading.loc[ix, 'CO2_emission'] = co

# %%
trading.dropna(inplace=True)

# %%
trading.to_csv(r'../dataset/processed2.csv')

# %%
