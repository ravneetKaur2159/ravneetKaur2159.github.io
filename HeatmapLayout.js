import { getConfirmedCases, getDates, setTotalPopulationPerCountry, 
    setTotalConfirmedCasesPerCountry, setGiniIndexPerCountry, setHealthExpenditurePerCountry } from './DataUtils.js';
import { loadPrevAttribute, loadNextAttribute  } from './ScatterPlotsLayout.js';

d3.select("body")
    .style("background-color", "#fff6d5");


// Setting the canvas
let canvas = d3.select(".canvasContainer")
                .append("svg")
                .attr("class", 'canvasClass')
                .style("background-color", "#fff6d5")
                .append("g");


const newCasesColorScheme = {};
newCasesColorScheme[10] = "#ffd1a9";
newCasesColorScheme[50] = "#ff9e79";
newCasesColorScheme[100] = "#fb6d4c";
newCasesColorScheme[500] = "#c23b22";
newCasesColorScheme[1000] = "#8a0000";
newCasesColorScheme[5000] = "#580000";
newCasesColorScheme[10000] = "#5b1647";


let tooltipElementCountries, tooltipElementCases, tooltipElementCasesDates;
let colorScale = d3.scaleSequential().domain([1,111]).interpolator(d3.interpolateMagma);


function setupDomElements(){
    tooltipElementCountries = d3.select("body")
                                .append("p")
                                .style("opacity", 0)
                                .style("display", "inline-block")
                                .attr("class", "tooltipCountriesStyle");

    tooltipElementCases = d3.select("body")
                                .append("p")
                                .style("opacity", 0)
                                .style("display", "inline-block")
                                .attr("class", "tooltipCasesStyle");

    tooltipElementCasesDates = d3.select("body")
                                .append("p")
                                .style("opacity", 0)
                                .style("display", "inline-block")
                                .attr("class", "tooltipCasesDatesStyle");

    d3.select(".yAxisContainer").style("display", "none");
    d3.select(".xAxisContainer").style("display", "none");
    d3.select(".tooltipScatter").style("display", "none");
}




function drawRowOfCountries(xStartPoint, yStartPoint, colorSchemeIndex, countriesList){
    let dataArr = [];
    let index = [];

    for(let i = 1 ; i<=24 ; i++){
        dataArr.push(19*i);
        index.push(i-1);
    }

    let circleElement = canvas.selectAll("g")
                        .data(dataArr)
                        .enter()
                            .append("circle")
                            .attr("cx", 550)
                            .attr("cy", 250)
                            .attr("r", 8.6)
                            .attr("id", function(d, index){ return (index+colorSchemeIndex).toString();})
                            .attr("fill", function(d, index){ return colorScale(index+colorSchemeIndex)});
    
    let circleElementText = canvas.selectAll("g")
                            .data(dataArr)
                            .enter()
                                .append("text")
                                .text( function (d, index) { return countriesList[index+colorSchemeIndex][0]; })
                                .attr("font-family", "sans-serif")
                                .attr("font-size", "10px")
                                .attr("fill", "white")
                                .attr("id", function(d, index){ return (index+colorSchemeIndex).toString();})
                                .attr('dy', function(d){return yStartPoint+d+3})
                                .attr("class", "countriesClassHeatMap")
                                .attr('dx', xStartPoint-4);
    circleElement.transition()
        .duration(1300)
        .delay(550)
        .attr("cx", xStartPoint)
        .attr("cy", function(d){return yStartPoint+d})

    setTimeout(function(){
        circleElement.on("mouseover", function(d){
            let colorFill = this.attributes.fill.value;
            let tooltipPosLeft = d3.mouse(this)[0]+151;
            let tooltipPosTop = d3.mouse(this)[1]+75;
            let countriesId = parseInt(this.attributes.id.value);
    
            d3.select(this)
                .transition()
                .duration("150")
                .attr("r", 11)
                .style("cursor", "pointer");
            
            tooltipElementCountries
                .html(countriesList[countriesId])
                .style("background-color", colorFill)
                .style("opacity", 1)
                .style("left", tooltipPosLeft + "px")
                .style("top", tooltipPosTop + "px");
        });
    
        circleElement.on("mouseout", function(d){
            d3.select(this)
            .transition()
            .duration("150")
            .attr("r", 8.7);
    
            tooltipElementCountries
                .style("opacity", 0);
        });
    }, 2000);
    

    circleElementText.on("mouseover", function(d){
        let tooltipPosLeft = d3.mouse(this)[0]+151;
        let tooltipPosTop = d3.mouse(this)[1]+75;
        let countriesId = parseInt(this.attributes.id.value);

        d3.select(this)
            .style("cursor", "pointer");

        
        tooltipElementCountries
            .html(countriesList[countriesId])
            .style("background-color", colorScale(countriesId))
            .style("opacity", 1)
            .style("left", tooltipPosLeft + "px")
            .style("top", tooltipPosTop + "px");
    });

    circleElementText.on("mouseout", function(d){

        tooltipElementCountries
            .style("opacity", 0);
    });

    
}

function drawNumberOfConfirmedCases(xStartPoint, yStartPoint,idStartIndex, confirmedCasesPerCountryObj, countriesList, datesList){
    let heightShiftIndex = 0;
    let newConfirmedCases = 0;
    
    for(let i = idStartIndex;i<idStartIndex+24;i++){
        if(confirmedCasesPerCountryObj.hasOwnProperty(countriesList[i])){
            //console.log(confirmedCasesPerCountryObj[key]);
            setTimeout(function(){
                let confirmedCasesElement = canvas.selectAll("g")
                                .data(confirmedCasesPerCountryObj[countriesList[i]])
                                .enter()
                                    .append("rect")
                                    .attr("width", 5)
                                    .attr("height", 15)
                                    .attr("class", function(d, index){ return "cases_"+(heightShiftIndex+idStartIndex)})
                                    .attr("dates", function(d, index){ return datesList[index]})
                                    .attr("x", function(d, index){
                                        return xStartPoint+(5.5*index)
                                    })
                                    .attr("y", yStartPoint+(19*heightShiftIndex))
                                    .attr("fill", function(d, index){
                                        newConfirmedCases = confirmedCasesPerCountryObj[countriesList[i]][index];
                                        if(index != 0){
                                            newConfirmedCases = newConfirmedCases - confirmedCasesPerCountryObj[countriesList[i]][index-1];
                                        }
                                        if(newConfirmedCases<0){
                                            newConfirmedCases = 0;
                                        }
                                        console.log(newConfirmedCases);
                                        let colorVal = "";
                                        if(newConfirmedCases<10){
                                            colorVal = newCasesColorScheme[10];
                                        }else if(newConfirmedCases>=10 && newConfirmedCases<50){
                                            colorVal = newCasesColorScheme[50];
                                        }else if(newConfirmedCases>=50 && newConfirmedCases<100){
                                            colorVal = newCasesColorScheme[100];
                                        }else if(newConfirmedCases>=100 && newConfirmedCases<500){
                                            colorVal = newCasesColorScheme[500];
                                        }else if(newConfirmedCases>=500 && newConfirmedCases<1000){
                                            colorVal = newCasesColorScheme[1000];
                                        }else if(newConfirmedCases>=1000 && newConfirmedCases<5000){
                                            colorVal = newCasesColorScheme[5000];
                                        }else if(newConfirmedCases>=5000){
                                            colorVal = newCasesColorScheme[10000];
                                        }

                                        console.log(colorVal);
                                        return colorVal;
                                    })
                                    .attr("id", function(d, index){
                                        newConfirmedCases = confirmedCasesPerCountryObj[countriesList[i]][index];
                                        if(index != 0){
                                            newConfirmedCases = newConfirmedCases - confirmedCasesPerCountryObj[countriesList[i]][index-1];
                                        }
                                        if(newConfirmedCases<0){
                                            newConfirmedCases = 0;
                                        }
                                        return newConfirmedCases;
                                    }).style("opacity", 0);

                confirmedCasesElement.transition().duration(800).ease(d3.easeLinear).style("opacity", 1);
                                    
                confirmedCasesElement.on("mouseover", function(d){
                    let elementClassId = parseInt(this.attributes.class.value.split("_")[1]);
                    let date = this.attributes.dates.value;
                    let tooltipPosLeft = d3.mouse(this)[0]+151;
                    let tooltipPosTop = d3.mouse(this)[1]+75;
                    let backgroundPropertyValue = "linear-gradient(to right, "+colorScale(elementClassId)+" 15px, black 0)";
                    let newCases = this.attributes.id.value;
                    let htmlValue = "New Cases : "+newCases+"<br/>Date : "+date;

                    tooltipElementCases
                        .html(htmlValue)
                        .style("background", backgroundPropertyValue)
                        .style("opacity", 1)
                        .style("left", tooltipPosLeft + "px")
                        .style("top", tooltipPosTop + "px");
                    
                    d3.select(this)
                        .style("cursor", "pointer")
                        .style("filter", "blur(5px)");
                    // tooltipElementCasesDates
                    //     .html(datesList[elementId])
                    //     .style("opacity", 1)
                    //     .style("left", tooltipPosLeft+135 + "px")
                    //     .style("top", tooltipPosTop + "px");
                })

                confirmedCasesElement.on("mouseout", function(d){
                    tooltipElementCases
                        .style("opacity", 0);
                    
                    tooltipElementCasesDates
                        .style("opacity", 0);
                });
                heightShiftIndex = heightShiftIndex + 1;
            }, 2500);
            
        }
        
        //console.log(heightShiftIndex);
    }
}




function clearHeatMaps(){
    d3.select(".scatterIconClass").attr("class", "material-icons scatterIconClass");
    d3.select(".confirmedCases").attr("class", "material-icons confirmedCases");
    d3.select(".worldClass").attr("class", "material-icons worldClass");

    canvas.selectAll("rect").remove();
    let allCircleElement = canvas.selectAll("circle");
    canvas.selectAll(".countriesClassHeatMap").remove();
    d3.select("body").selectAll("p").remove();
    let position = [];
    position[0] = [];
    position[1] = [];
    let index = [];
    for(let i = 0; i < 120 ; i++){
        index.push(i);
        position[0].push(Math.random()*1001);
        position[1].push(Math.random()*1001);
    }

    allCircleElement
        .data(index)
        .transition()
        .duration(800)
        .attr("cx", function(d){ return position[0][d];})
        .attr("cy", function(d){ return position[1][d];})
        .duration(300).ease(d3.easeLinear).style("opacity", 0);

    setTimeout(function(){
        allCircleElement.remove();
    }, 310);
}



window.prevAttribute = function(){
    loadPrevAttribute();
}

window.nextAttribute = function(){
    loadNextAttribute();
}

export function loadHeatMapsFromScript(){
    setupDomElements();
    // Draw the cases per country
    getConfirmedCases.then(
        (confirmedCasesPerCountry) => {
            let countriesList = Object.keys(confirmedCasesPerCountry);
            let datesList = getDates();

            // Draw countries
            drawRowOfCountries(30, 10, 0, countriesList);
            drawRowOfCountries(242, 10, 24, countriesList);
            drawRowOfCountries(453, 10, 48, countriesList);
            drawRowOfCountries(666, 10, 62, countriesList);
            drawRowOfCountries(885, 10, 86, countriesList);

            // // Draw confirmed cases
            drawNumberOfConfirmedCases(47, 21.5,0, confirmedCasesPerCountry, countriesList, datesList);
            drawNumberOfConfirmedCases(256, 21.5,24, confirmedCasesPerCountry, countriesList, datesList);
            drawNumberOfConfirmedCases(470, 21.5,48, confirmedCasesPerCountry, countriesList, datesList);
            drawNumberOfConfirmedCases(685, 21.5,62, confirmedCasesPerCountry, countriesList, datesList);
            drawNumberOfConfirmedCases(904, 21.5,86, confirmedCasesPerCountry, countriesList, datesList);

            setTotalPopulationPerCountry();
            setTotalConfirmedCasesPerCountry();
            setGiniIndexPerCountry();
            setHealthExpenditurePerCountry();
        }). catch(function () { 
            console.log('Unable to get the response');
        });
}

window.loadHeatMaps=function(){

    d3.select(".confirmedCases").attr("class", "material-icons confirmedCases selected");
    d3.select(".scatterIconClass").attr("class", "material-icons scatterIconClass");
    d3.select(".worldClass").attr("class", "material-icons worldClass");
    // flushScatterPlots();

    loadHeatMapsFromScript();
}

window.flushHeatMaps= () => clearHeatMaps();

loadHeatMaps();