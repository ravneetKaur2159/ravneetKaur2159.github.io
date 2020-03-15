import { getTotalConfirmedCasesPerCountry, getTotalPopulationPerCountry, getGiniIndexPerCountry, getHealthExpenditurePerCountry } from './DataUtils.js';

const yAxisLabelValue = "TOTAL NUMBER OF CONFIRMED CASES";
const xAxisLabelValues = [];
xAxisLabelValues[0] = "POPULATION";
xAxisLabelValues[1] = "GINI INDEX";
xAxisLabelValues[2] = "HEALTH EXPENDITURE";

let confirmedCasesPerCountry = {};
let totalPopulationPerCountry = {};
let colorScale = d3.scaleSequential().domain([1,100]).interpolator(d3.interpolateInferno);

function setupDom(){
    //console.log(canvas);
    var gridline1 = d3.select(".canvasClass").selectAll("g")
                        .append("line")
                        .attr("class", "gridLine")
                        .attr("x1", 333.33)
                        .attr("y2", 60)
                        .attr("x2", 333.33)
                        .attr("y2", 560)
                        .attr("stroke", "#faedbf")
                        .attr("stroke-width", 2)
                        .style("opacity", 0);
    gridline1.transition().duration(400).ease(d3.easeLinear).style("opacity", 1);

    var gridline2 = d3.select(".canvasClass").selectAll("g")
                        .append("line")
                        .attr("class", "gridLine")
                        .attr("x1", 770.67)
                        .attr("y2", 60)
                        .attr("x2", 770.67)
                        .attr("y2", 560)
                        .attr("stroke", "#faedbf")
                        .attr("stroke-width", 2)
                        .style("opacity", 0);
    gridline2.transition().duration(400).ease(d3.easeLinear).style("opacity", 1);

    var gridline3 = d3.select(".canvasClass").selectAll("g")
                    .append("line")
                    .attr("class", "gridLine")
                    .attr("x1", 0)
                    .attr("y1", 166.7)
                    .attr("x2", 1100)
                    .attr("y2", 166.7)
                    .attr("stroke", "#faedbf")
                    .attr("stroke-width", 2)
                    .style("opacity", 0);
    gridline3.transition().duration(400).ease(d3.easeLinear).style("opacity", 1);

    var gridline4 = d3.select(".canvasClass").selectAll("g")
                        .append("line")
                        .attr("class", "gridLine")
                        .attr("x1", 0)
                        .attr("y1", 333.34)
                        .attr("x2", 1100)
                        .attr("y2", 333.34)
                        .attr("stroke", "#faedbf")
                        .attr("stroke-width", 2)
                        .style("opacity", 0);
    gridline4.transition().duration(400).ease(d3.easeLinear).style("opacity", 1);

    d3.select(".yAxisContainer").style("display", "block");
    d3.select(".yAxisContainer")
        .html("TOTAL NUMBER OF CONFIRMED CASES");
        

}

function getXAxisTotalPopMaxValue(totalPopulationPerCountry){
    let maxValue = 0;
    let totalPopulation = 0;
    for(let key in totalPopulationPerCountry){
        if(totalPopulationPerCountry.hasOwnProperty(key)){
            totalPopulation = totalPopulationPerCountry[key];
            if(maxValue < totalPopulation){
                maxValue = totalPopulation;
            }
        }
    }
    return maxValue;
}

function getYAxisMaxValue(confirmedCasesPerCountry){
    let maxValue = 0;
    let confirmedCases = 0;
    for(let key in confirmedCasesPerCountry){
        if(confirmedCasesPerCountry.hasOwnProperty(key)){
            confirmedCases = confirmedCasesPerCountry[key];
            if(maxValue < confirmedCases){
                maxValue = confirmedCases;
            }
        }
    }
    return maxValue;
}

function getTotalCasesPerCountryArray(confirmedCasesPerCountry){
    let totalCases = [];
    for(let key in confirmedCasesPerCountry){
        if(confirmedCasesPerCountry.hasOwnProperty(key)){
            totalCases.push(confirmedCasesPerCountry[key]);
        }
    }
    return totalCases;
}

function getTotalPopulationArray(totalPopulationPerCountry){
    let totalPop = [];
    for(let key in totalPopulationPerCountry){
        if(totalPopulationPerCountry.hasOwnProperty(key)){
            totalPop.push(totalPopulationPerCountry[key]);
        }
    }
    return totalPop;
}

function setPopulationVsConfirmedCasesPlot(confirmedCasesPerCountry, totalPopulationPerCountry, firstTimeLoad){
    let canvasWidth = parseInt(d3.select(".canvasClass").style("width"), 10);
    let canvasHeight = parseInt(d3.select(".canvasClass").style("height"), 10);
    let xAxisMaxValue = getXAxisTotalPopMaxValue(totalPopulationPerCountry);
    let yAxisMaxValue = getYAxisMaxValue(confirmedCasesPerCountry);
    let totalCasesArr = getTotalCasesPerCountryArray(confirmedCasesPerCountry);
    let countriesList = Object.keys(confirmedCasesPerCountry);
    let totalPopulationArr = getTotalPopulationArray(totalPopulationPerCountry);
    let position =[]


    // Add X-axis
    let xAxis = d3.scaleSymlog()
                    .domain([0, xAxisMaxValue])
                    .range([ 50, canvasWidth-60]);

    d3.select(".canvasClass").append("g").attr("class", "xAxisPopulationCases")
        .style("opacity", "0")
        .attr("transform", "translate(0," + (canvasHeight-40) + ")")
        .call(d3.axisBottom(xAxis));
    
    //Add Y-axis
    let yAxis = d3.scaleSymlog()
                    .domain([0, yAxisMaxValue])
                    .range([canvasHeight-40, 40]);

    d3.select(".canvasClass").append("g").attr("class", "yAxisPopulationCases")
        .style("opacity", "0")
        .attr("transform", "translate("+50+", 0)")
        .call(d3.axisLeft(yAxis));

    d3.select(".currentAttribute")
        .html("POPULATION")
        .style("font-family", "sans-serif")
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .attr("fill", "#645c3e");

    if(firstTimeLoad){
        position[0] = [];
        position[1] = [];
        for(let i = 0; i < 111 ; i++){
            position[0].push(Math.random()*100001);
            position[1].push(Math.random()*100001);
        }

        d3.select(".canvasClass")
            .append("g")
            .attr("class", "circles")
            .selectAll("dot")
            .data(totalCasesArr)
            .enter()
                .append("circle")
                .attr("cx", function(d, index){
                    return  xAxis(position[0][index])})
                .attr("cy", function(d, index){
                    return yAxis(position[1][index])})
                .attr("r", 17)
                .attr("class", "eachCircleElement")
                .attr("id", function(d, index){ return index})
                .style("fill", function(d, index){ return colorScale(index)})
                .style("opacity", "0");
    }

    d3.selectAll(".eachCircleElement")
        .data(totalCasesArr)
        .transition()
        .attr("cx", function(d, index){
            return  xAxis(totalPopulationArr[index])})
        .attr("cy", function(d){
            return yAxis(d)})
        .duration(700).ease(d3.easeLinear).style("opacity", 0.9);
    
    setTimeout(function(){
        d3.selectAll(".eachCircleElement").on("mouseover", function(d){
            // let colorFill = this.attributes.fill.value;
            let tooltipPosLeft = d3.mouse(this)[0]+145;
            let tooltipPosTop = d3.mouse(this)[1]+152;
            let index = this.attributes.id.value;
            // let countriesId = parseInt(this.attributes.id.value);
    
            d3.select(this)
                .transition()
                .duration("150")
                .attr("r", 27)
                .style("opacity", 0.5)
                .style("cursor", "pointer");
            
            d3.select(".country")
                .style("opacity", "1")
                .html(countriesList[index])
                .style("left", tooltipPosLeft + "px")
                .style("top", tooltipPosTop + "px");

        });
    
        d3.selectAll(".eachCircleElement").on("mouseout", function(d){
            d3.select(this)
            .transition()
            .duration("150")
            .attr("r",17);
    
            d3.select(".country")
                .style("opacity", 0);
        });
    }, 2000);

    d3.selectAll(".circles").append("g").selectAll("textElements")
        .data(totalCasesArr)
        .enter()
            .append("text")
            .text( function (d, i) { return countriesList[i][0].toUpperCase(); })
            .attr("id", function(d, index){return index})
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "white")
            .attr("class", "countriesElementTextClass")
            .attr('dy', function(d, i){
                return yAxis(d)+2.5})
            .attr('dx',function(d, i){
                return xAxis(totalPopulationArr[i])-4})
            .style("opacity", "0");
    
    d3.selectAll(".countriesElementTextClass")
        .transition()
        .delay(200)
        .duration(100).ease(d3.easeLinear).style("opacity", 1);

    d3.selectAll(".countriesElementTextClass").on("mouseover", function(d){
        // let tooltipPosLeft = d3.mouse(this)[0]+151;
        // let tooltipPosTop = d3.mouse(this)[1]+75;
        // let countriesId = parseInt(this.attributes.id.value);

        d3.select(this)
            .style("cursor", "pointer");

        
        // tooltipElementCountries
        //     .html(countriesList[countriesId])
        //     .style("background-color", colorScale(countriesId))
        //     .style("opacity", 1)
        //     .style("left", tooltipPosLeft + "px")
        //     .style("top", tooltipPosTop + "px");
    });

    d3.selectAll(".countriesElementTextClass").on("mouseout", function(d){
        // tooltipElementCountries
        //     .style("opacity", 0);
    });
}
 

export function loadScatterPlotsFromScript(){
    setupDom();
    confirmedCasesPerCountry = getTotalConfirmedCasesPerCountry();
    totalPopulationPerCountry = getTotalPopulationPerCountry();
    setPopulationVsConfirmedCasesPlot(confirmedCasesPerCountry, totalPopulationPerCountry, true);

}


function flushPopConfirmedCases(){
    d3.select(".canvasClass").selectAll(".circles").remove();
    d3.select(".canvasClass").selectAll(".xAxisPopulationCases").remove();
    d3.select(".canvasClass").selectAll(".yAxisPopulationCases").remove();
    d3.select(".canvasClass").selectAll(".countriesElementTextClass").remove();
}

function flushPopGiniCases(){
    d3.select(".canvasClass").selectAll(".xAxisGiniIndexCases").remove();
    d3.select(".canvasClass").selectAll(".yAxisPopulationCases").remove();
    d3.select(".canvasClass").selectAll(".circles").remove();
    d3.select(".canvasClass").selectAll(".countriesElementTextClass").remove();
}

function flushPopHealthExpenditure(){
    d3.select(".canvasClass").selectAll(".xAxisHealthExpenditureCases").remove();
    d3.select(".canvasClass").selectAll(".yAxisPopulationCases").remove();
    d3.select(".canvasClass").selectAll(".circles").remove();
    d3.select(".canvasClass").selectAll(".countriesElementTextClass").remove();
}

function getTotalCasesBasedOnGiniArr(giniIndexPerCountryObj){
    let countriesList = [];
    let totalConfirmedCasesBasedOnGini = [];
    let giniIndexPerCountry = [];
    for(let key in giniIndexPerCountryObj){
        if(giniIndexPerCountryObj.hasOwnProperty(key)){
            if(confirmedCasesPerCountry.hasOwnProperty(key)){
                totalConfirmedCasesBasedOnGini.push(confirmedCasesPerCountry[key]);
                countriesList.push(key);
                giniIndexPerCountry.push(giniIndexPerCountryObj[key]);
            }
            
            
        }
    }
    return [countriesList, giniIndexPerCountry, totalConfirmedCasesBasedOnGini];
}

function setGiniVsConfirmedCasesPlot(){
    let canvasWidth = parseInt(d3.select(".canvasClass").style("width"), 10);
    let canvasHeight = parseInt(d3.select(".canvasClass").style("height"), 10);
    let giniIndexPerCountryObj = getGiniIndexPerCountry();
    let giniValuesArr = getTotalCasesBasedOnGiniArr(giniIndexPerCountryObj);
    let countriesArr = giniValuesArr[0];
    let giniIndexPerCountryArr = giniValuesArr[1];
    let confirmedCasesPerCountryArr = giniValuesArr[2];
    let xAxisMaxValue = getXAxisTotalPopMaxValue(giniIndexPerCountryArr);
    let yAxisMaxValue = getYAxisMaxValue(confirmedCasesPerCountryArr);
    let position = [];
    let colorScaleGini = d3.scaleSequential().domain([1,75]).interpolator(d3.interpolateMagma);

    // Add X-axis
    let xAxis = d3.scaleSymlog()
                    .domain([0, xAxisMaxValue])
                    .range([ 50, canvasWidth-60]);

    d3.select(".canvasClass").append("g").attr("class", "xAxisGiniIndexCases")
        .style("opacity", "0")
        .attr("transform", "translate(0," + (canvasHeight-40) + ")")
        .call(d3.axisBottom(xAxis));

    //Add Y-axis
    let yAxis = d3.scaleSymlog()
                    .domain([0, yAxisMaxValue])
                    .range([canvasHeight-40, 40]);

    d3.select(".canvasClass").append("g").attr("class", "yAxisPopulationCases")
        .style("opacity", "0")
        .attr("transform", "translate("+50+", 0)")
        .call(d3.axisLeft(yAxis));

    d3.select(".currentAttribute")
        .html("GINI INDEX")
        .style("font-family", "sans-serif")
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .attr("fill", "#645c3e");

    position[0] = [];
    position[1] = [];
    for(let i = 0; i < 111 ; i++){
        position[0].push(Math.random()*100);
        position[1].push(Math.random()*100001);
    }

    d3.select(".canvasClass")
        .append("g")
        .attr("class", "circles")
        .selectAll("dot")
        .data(confirmedCasesPerCountryArr)
        .enter()
            .append("circle")
            .attr("cx", function(d, index){
                return  xAxis(position[0][index])})
            .attr("cy", function(d, index){
                return yAxis(position[1][index])})
            .attr("r", 17)
            .attr("class", "eachCircleElement")
            .attr("id", function(d, index){ return index})
            .style("fill", function(d, index){
                return colorScaleGini(index)})
            .style("opacity", "0");

        d3.selectAll(".eachCircleElement")
            .data(confirmedCasesPerCountryArr)
            .transition()
            .attr("cx", function(d, index){
                return  xAxis(giniIndexPerCountryArr[index])})
            .attr("cy", function(d){
                return yAxis(d)})
            .duration(700).ease(d3.easeLinear).style("opacity", 0.8);
        
    
    d3.selectAll(".circles").append("g").selectAll("textElements")
        .data(confirmedCasesPerCountryArr)
        .enter()
            .append("text")
            .text( function (d, i) { return countriesArr[i][0].toUpperCase(); })
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "white")
            .attr("class", "countriesElementTextClass")
            .attr('dy', function(d, i){
                return yAxis(d)+2.5})
            .attr('dx',function(d, i){
                return xAxis(giniIndexPerCountryArr[i])-4})
            .style("opacity", "0");
    
    d3.selectAll(".countriesElementTextClass")
        .transition()
        .delay(200)
        .duration(100).ease(d3.easeLinear).style("opacity", 1);
    
        setTimeout(function(){
            d3.selectAll(".eachCircleElement").on("mouseover", function(d){
                // let colorFill = this.attributes.fill.value;
                // let countriesId = parseInt(this.attributes.id.value);
                let tooltipPosLeft = d3.mouse(this)[0]+145;
                let tooltipPosTop = d3.mouse(this)[1]+152;
                let index = this.attributes.id.value;
        
                d3.select(this)
                    .transition()
                    .duration("150")
                    .attr("r", 21)
                    .style("cursor", "pointer");
                
                d3.select(".country")
                    .style("opacity", "1")
                    .html(countriesArr[index])
                    .style("left", tooltipPosLeft + "px")
                    .style("top", tooltipPosTop + "px");
    
            }, 2000);
        
            d3.selectAll(".eachCircleElement").on("mouseout", function(d){
                d3.select(this)
                .transition()
                .duration("150")
                .attr("r",17);
        
                d3.select(".country")
                    .style("opacity", 0);
            });
        },1000);

}

function getTotalCasesBasedOnHealthArr(healthPerCountryObj){
    let countriesList = [];
    let totalConfirmedCasesBasedOnHealth = [];
    let healthExpenditurePerCountry = [];
    for(let key in healthPerCountryObj){
        if(healthPerCountryObj.hasOwnProperty(key)){
            if(confirmedCasesPerCountry.hasOwnProperty(key)){
                totalConfirmedCasesBasedOnHealth.push(confirmedCasesPerCountry[key]);
                countriesList.push(key);
                healthExpenditurePerCountry.push(healthPerCountryObj[key]);
            }
            
            
        }
    }
    return [countriesList, healthExpenditurePerCountry, totalConfirmedCasesBasedOnHealth];
}

function setHealthVsConfirmedCasesPlot(){
    let canvasWidth = parseInt(d3.select(".canvasClass").style("width"), 10);
    let canvasHeight = parseInt(d3.select(".canvasClass").style("height"), 10);
    let healthPerCountryObj = getHealthExpenditurePerCountry();
    let healthValuesArr = getTotalCasesBasedOnHealthArr(healthPerCountryObj);
    let countriesArr = healthValuesArr[0];
    let healthExpenditurePerCountryArr = healthValuesArr[1];
    let confirmedCasesPerCountryArr = healthValuesArr[2];
    let xAxisMaxValue = getXAxisTotalPopMaxValue(healthExpenditurePerCountryArr);
    let yAxisMaxValue = getYAxisMaxValue(confirmedCasesPerCountryArr);
    let position = [];

    // Add X-axis
    let xAxis = d3.scaleSymlog()
                    .domain([0, xAxisMaxValue])
                    .range([ 50, canvasWidth-60]);

    d3.select(".canvasClass").append("g").attr("class", "xAxisHealthExpenditureCases")
        .style("opacity", "0")
        .attr("transform", "translate(0," + (canvasHeight-40) + ")")
        .call(d3.axisBottom(xAxis));

    //Add Y-axis
    let yAxis = d3.scaleSymlog()
                    .domain([0, yAxisMaxValue])
                    .range([canvasHeight-40, 40]);

    d3.select(".canvasClass").append("g").attr("class", "yAxisPopulationCases")
        .style("opacity", "0")
        .attr("transform", "translate("+50+", 0)")
        .call(d3.axisLeft(yAxis));

    d3.select(".currentAttribute")
        .html("HEALTH EXPENDITURE PER PERSON")
        .style("font-family", "sans-serif")
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .attr("fill", "#645c3e");
    
        position[0] = [];
        position[1] = [];
        for(let i = 0; i < 111 ; i++){
            position[0].push(Math.random()*1000);
            position[1].push(Math.random()*100001);
        }
    
        d3.select(".canvasClass")
            .append("g")
            .attr("class", "circles")
            .selectAll("dot")
            .data(confirmedCasesPerCountryArr)
            .enter()
                .append("circle")
                .attr("cx", function(d, index){
                    return  xAxis(position[0][index])})
                .attr("cy", function(d, index){
                    return yAxis(position[1][index])})
                .attr("r", 17)
                .attr("class", "eachCircleElement")
                .attr("id", function(d, index){ return index})
                .style("fill", function(d, index){
                    console.log(index)
                    return colorScale(index)})
                .style("opacity", "1");
    
        d3.selectAll(".eachCircleElement")
            .data(confirmedCasesPerCountryArr)
            .transition()
            .attr("cx", function(d, index){
                return  xAxis(healthExpenditurePerCountryArr[index])})
            .attr("cy", function(d){
                return yAxis(d)})
            .duration(700).ease(d3.easeLinear).style("opacity", 0.8);
            
        
        d3.selectAll(".circles").append("g").selectAll("textElements")
            .data(confirmedCasesPerCountryArr)
            .enter()
                .append("text")
                .text( function (d, i) { return countriesArr[i][0].toUpperCase(); })
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", "white")
                .attr("class", "countriesElementTextClass")
                .attr('dy', function(d, i){
                    return yAxis(d)+2.5})
                .attr('dx',function(d, i){
                    return xAxis(healthExpenditurePerCountryArr[i])-4})
                .style("opacity", "0");
        
        d3.selectAll(".countriesElementTextClass")
            .transition()
            .delay(200)
            .duration(100).ease(d3.easeLinear).style("opacity", 1);

        setTimeout(function(){
            d3.selectAll(".eachCircleElement").on("mouseover", function(d){
                let tooltipPosLeft = d3.mouse(this)[0]+145;
                let tooltipPosTop = d3.mouse(this)[1]+152;
                let index = this.attributes.id.value;
        
                d3.select(this)
                    .transition()
                    .duration("150")
                    .attr("r", 21)
                    .style("cursor", "pointer");
                
                d3.select(".country")
                    .style("opacity", "1")
                    .html(countriesArr[index])
                    .style("left", tooltipPosLeft + "px")
                    .style("top", tooltipPosTop + "px");
            });
        
            d3.selectAll(".eachCircleElement").on("mouseout", function(d){
                d3.select(this)
                .transition()
                .duration("150")
                .attr("r",17);
        
                d3.select(".country")
                    .style("opacity", 0);
            });
        }, 1000);
    
}

export function loadPrevAttribute(){
    let currentAttribute = d3.select(".currentAttribute").html();
    switch(currentAttribute){
        case "POPULATION":
            flushPopConfirmedCases();
            setHealthVsConfirmedCasesPlot();
            break;

        case "GINI INDEX":
            flushPopGiniCases();
            setPopulationVsConfirmedCasesPlot(confirmedCasesPerCountry, totalPopulationPerCountry, true);
            break;

        case "HEALTH EXPENDITURE PER PERSON":
            flushPopHealthExpenditure();
            setGiniVsConfirmedCasesPlot();
            break;

        default:
            break;
    }
}

export function loadNextAttribute(){
    let currentAttribute = d3.select(".currentAttribute").html();
    switch(currentAttribute){
        case "POPULATION":
            flushPopConfirmedCases();
            setGiniVsConfirmedCasesPlot();
            break;

        case "GINI INDEX":
            flushPopGiniCases();
            setHealthVsConfirmedCasesPlot();
            break;

        case "HEALTH EXPENDITURE PER PERSON":
            flushPopHealthExpenditure();
            setPopulationVsConfirmedCasesPlot(confirmedCasesPerCountry, totalPopulationPerCountry, true);
            break;

        default:
            break;
    }
}
function flushScatterPlots(){
    d3.select(".scatterIconClass").attr("class", "material-icons scatterIconClass");
    d3.select(".confirmedCases").attr("class", "material-icons confirmedCases");
    d3.select(".worldClass").attr("class", "material-icons worldClass");

    d3.select(".yAxisContainer").style("display", "none");
    d3.select(".xAxisContainer").style("display", "none");
    d3.select(".tooltipScatter").style("display", "none");

    let allCircleElement = d3.selectAll(".eachCircleElement");
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
        .attr("cx", function(d){ return position[0][d];})
        .attr("cy", function(d){ return position[1][d];})
        .duration(300).ease(d3.easeLinear).style("opacity", 0);
    setTimeout(function(){
        flushPopConfirmedCases();
        flushPopGiniCases();
        flushPopHealthExpenditure();
        d3.selectAll(".gridLine").remove();
    }, 310);
    

}

window.flushScatterPlots= () => flushScatterPlots();

window.loadScatterPlots = function(){

    d3.select(".confirmedCases").attr("class", "material-icons confirmedCases");
    d3.select(".scatterIconClass").attr("class", "material-icons scatterIconClass selected");
    d3.select(".worldClass").attr("class", "material-icons worldClass");

    d3.select(".yAxisContainer").style("display", "block");
    d3.select(".xAxisContainer").style("display", "block");
    d3.select(".tooltipScatter").style("display", "block");

    // clearHeatMaps();
    loadScatterPlotsFromScript();
    
}
