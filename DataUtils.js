let dates = [];
let per_country_confirmed_cases = {};
let totalConfirmedCasesPerCountry = {};
let totalPopulationPerCountry = {};
let countryAndCountryCode = {};
let giniIndexPerCountry = {};
let healthExpenditurePerCountry = {};

function setConfirmedCasesPerCountry(countriesInDataset, response, dates){
    countriesInDataset.forEach(country => {
        per_country_confirmed_cases[country] = [];
        for (var key in response){
            if(response.hasOwnProperty(key)){
                let countriesList = response[key][0];
                let countryDatasetIndex = countriesList.indexOf(country);
                if(countryDatasetIndex != -1){
                    per_country_confirmed_cases[country].push(response[key][1][countryDatasetIndex]);
                }else{
                    per_country_confirmed_cases[country].push(0);
                }
            }
        }
        per_country_confirmed_cases[country] = per_country_confirmed_cases[country].splice(17, 46);
        
    });
    dates = dates.splice(17, 46);
    return [per_country_confirmed_cases, dates];
}


export const getConfirmedCases = new Promise((resolve, reject) => {
    let perCountryConfirmedCases = {};
    let confirmCasesArr = [];
    d3.json("per_day_per_country.json").then(function(response){
        let countriesInDataset = [];
        dates = Object.keys(response);

        for (var key in response) {
            if (response.hasOwnProperty(key)) {
                let countriesList = response[key][0];
                countriesList.forEach(element => {
                    if (countriesInDataset.indexOf(element) == -1){
                        countriesInDataset.push(element);
                    }
                })
            }
        }
        confirmCasesArr = setConfirmedCasesPerCountry(countriesInDataset, response, dates);
        perCountryConfirmedCases = confirmCasesArr[0];
        dates = confirmCasesArr[1];
        if(Object.keys(perCountryConfirmedCases).length != 0){
            resolve(perCountryConfirmedCases);
        }
        else{
            reject({});
        }
    });
    
});

export function getDates(){
    return dates;
}

export function setTotalConfirmedCasesPerCountry(){
    d3.json("countries_total_cases_list.json").then(function(response){
        totalConfirmedCasesPerCountry = response;
    });
}

export function getTotalConfirmedCasesPerCountry(){
    return totalConfirmedCasesPerCountry;
}

export function setTotalPopulationPerCountry(){
    d3.json("countries_population_dict.json").then(function(response){
        totalPopulationPerCountry = response;
    });
}

export function setGiniIndexPerCountry(){
    d3.json("countries_gini_index_dict.json").then(function(response){
        giniIndexPerCountry = response;
    });
}

export function setHealthExpenditurePerCountry(){
    d3.json("countries_health_expenditure_dict.json").then(function(response){
        healthExpenditurePerCountry = response;
    });
}

function setCountryCode(){
    d3.json("country_country_code.json").then(function(response){
        countryAndCountryCode = response;
    });
}

export function getTotalPopulationPerCountry(){
    return totalPopulationPerCountry;
}

export function getCountryCodes(){
    return countryAndCountryCode;
}

export function getGiniIndexPerCountry(){
    return giniIndexPerCountry;
}

export function getHealthExpenditurePerCountry(){
    return healthExpenditurePerCountry;
}

// setTotalPopulationPerCountry();
// setTotalConfirmedCasesPerCountry();
// setGiniIndexPerCountry();