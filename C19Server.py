import pandas as pd
import datetime as dt
import json
from flask import Flask
from statistics import mean

app = Flask(__name__)
per_day_per_country = {}

def preprocess_data(df):
    df = df.dropna(subset=["Country", "Date"])
    df.Country = df.Country.replace('Mainland China', 'China')
    return df

def refine_pd(df):
    df.ObservationDate = pd.to_datetime(df["ObservationDate"]).dt.date
    df.columns = df.columns.str.replace('SNo', 'Sno')
    df.columns = df.columns.str.replace('ObservationDate', 'Date')
    df.columns = df.columns.str.replace('Country/Region', 'Country')
    return df

def parse_per_country_per_date_to_json(df):
    for index, row in df.iterrows():
        key = dt.datetime.strftime(row["Date"], "%Y-%m-%d")
        if key in per_day_per_country:
            per_day_per_country[key][0].append(row["Country"])
            per_day_per_country[key][1].append(row["Confirmed"])
        else:
            per_day_per_country[key] = []
            country_list = []
            country_list.append(row["Country"])
            count_list = []
            count_list.append(row["Confirmed"])
            per_day_per_country[key].append(country_list)
            per_day_per_country[key].append(count_list)

    per_day_per_country_json = json.dumps(per_day_per_country)
    with open("per_day_per_country.json", "w") as outfile:
        outfile.write(per_day_per_country_json)
    return per_day_per_country_json


def getCountPerCountryPerDay(df):
    df_groupby = df.groupby(["Date", "Country"]).sum().reset_index()
    #df_groupby_by_date = df_groupby[df_groupby["Date"] == dt.date(year=2020,month=3,day=5)]
    #print(df_groupby_by_date[df_groupby_by_date["Country"] == "China"])
    return df_groupby


@app.route('/getPerCountryPerDateConfirmedCases')
def getPerCountryPerDateConfirmedCases():
    countries_count_df_2 = pd.read_csv("./novel-corona-virus-2019-dataset/covid_19_data.csv")
    countries_count_df_full = refine_pd( countries_count_df_2)
    countries_count_df_full = preprocess_data(countries_count_df_full)

    countries_count_groupby = getCountPerCountryPerDay(countries_count_df_full)
    countries_count_groupby_json = parse_per_country_per_date_to_json(countries_count_groupby)
    return countries_count_groupby_json


@app.route('/getTotalListOfCountries')
def getTotalListOfCountries():
    countries_list = {}
    countries_df = pd.read_excel("./WDVP Datasets.xlsx", sheet_name="what makes a 'good' government")
    countries_list["countries"] = countries_df["indicator"][4:].to_list()
    countries_list_json = json.dumps(countries_list)
    with open("countries_list.json", "w") as outfile:
        outfile.write(countries_list_json)
    return countries_list_json


def get_total_population_per_country(write=False):
    total_pop_per_country = {}
    countries_df = pd.read_excel("./WDVP Datasets.xlsx", sheet_name="what makes a 'good' government")
    countries_list = countries_df["indicator"][4:].to_list()
    total_population_list = countries_df["population"][4:].to_list()
    mean_total_population = mean(total_population_list)
    total_population_relative = []

    for index, each_country in enumerate(countries_list):
        total_pop_per_country[each_country] = (total_population_list[index] - mean_total_population)/1000000
        total_population_relative.append((total_population_list[index] - mean_total_population)/1000000)

    print(min(total_population_relative))
    print(max(total_population_relative))
    if write:
        with open("countries_population_dict_relative.json", "w") as outfile:
            outfile.write(json.dumps(total_pop_per_country))
    return total_pop_per_country

def get_total_cases_per_country(write = False):
    total_cases_per_country = {}
    for each_date in per_day_per_country:
        cases = per_day_per_country[each_date]
        for index, each_country in enumerate(cases[0]):
            if not each_country in total_cases_per_country:
                total_cases_per_country[each_country] = []
            total_cases_per_country[each_country].append(cases[1][index])
    total_cases = []
    total_cases_relative = []
    for each_country in total_cases_per_country:
        total_cases.append(total_cases_per_country[each_country][-1])
        #total_cases_per_country[each_country] = total_cases_per_country[each_country][-1]
    mean_cases = mean(total_cases)
    for each_country in total_cases_per_country:
        value = total_cases_per_country[each_country][-1] - mean_cases
        total_cases_per_country[each_country] = value
        total_cases_relative.append(value)

    print(min(total_cases_relative))
    print(max(total_cases_relative))
    if write:
        with open("countries_total_cases_list_relative.json", "w") as outfile:
            outfile.write(json.dumps(total_cases_per_country))
    return(total_cases_per_country)

def get_health_expenditure_per_country(write= False):
    health_per_country = {}
    countries_df = pd.read_excel("./WDVP Datasets.xlsx", sheet_name="what makes a 'good' government")
    # print(countries_df.columns)
    health_expenditure_list = countries_df["health expenditure \nper person"][4:].to_list()
    countries_list = countries_df["indicator"][4:].to_list()

    for index, each_country in enumerate(countries_list):
        health_exp_value = health_expenditure_list[index]
        if health_exp_value != "-":
            health_per_country[each_country] = health_expenditure_list[index]

    if write:
        with open("countries_health_expenditure_dict.json", "w") as outfile:
            outfile.write(json.dumps(health_per_country))
    return health_per_country

def get_gini_index_per_country(write=True):
    gini_index_per_country = {}
    countries_df = pd.read_excel("./WDVP Datasets.xlsx", sheet_name="what makes a 'good' government")
    countries_list = countries_df["indicator"][4:].to_list()
    gini_index_list = countries_df["GINI index"][4:].to_list()

    for index, each_country in enumerate(countries_list):
        gini_value = gini_index_list[index]
        if gini_value != "-":
            gini_index_per_country[each_country] = gini_index_list[index]

    if write:
        with open("countries_gini_index_dict.json", "w") as outfile:
            outfile.write(json.dumps(gini_index_per_country))
    return gini_index_per_country

def get_stats():
    df = pd.read_excel("./WDVP Datasets.xlsx", sheet_name="what makes a 'good' government")
    print(df.columns)
    list_df = df["school life expectancy (YEARS)"][4:].to_list()
    refined_list_df = []
    for i in range(len(list_df)):
        if not list_df[i] == '-':
            refined_list_df.append(float(list_df[i]))

    print(min(refined_list_df))
    print(max(refined_list_df))
    # print(df["GINI index"][4:].max())

if __name__ == "__main__":

    getPerCountryPerDateConfirmedCases()
    # #getTotalListOfCountries()
    get_total_population_per_country(True)
    # get_total_cases_per_country(True)
    # get_gini_index_per_country(True)
    # get_health_expenditure_per_country(True)
    # get_stats()

    # app.run(host='0.0.0.0', port=5000, debug=True)

