import {getConfirmedCases} from "./DataUtils.js";
let confirmedCasesPerCountry = {};


function setupDom(){

    // Setting the canvas
    let svg = d3.select(".canvasClass").selectAll("g"),
        width = 500,
        height = 100;

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
    .scale(120)
    // .center([0,20])
    // .translate([width / 2, height / 2]);

    d3.json("countries_total_cases_list.json").then(function(data){
        var colorScale = d3.scaleThreshold()
        .domain([0, 10, 100, 1000])
        .range(d3.schemeBlues[4]);
    
        // Load external data and boot
    
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(topo){
            let mouseOver = function(d) {
                d3.selectAll(".Country")
                    .transition()
                    .duration(200)
                    .style("opacity", .5)
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("stroke", "black")
            }
          
            let mouseLeave = function(d) {
                d3.selectAll(".Country")
                    .transition()
                    .duration(200)
                    .style("opacity", .8)
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("stroke", "transparent")
            }
          
            // Draw the map
            svg
                .selectAll("path")
                .data(topo.features)
                .enter()
                .append("path")
                // draw each country
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                // set the color of each country
                .attr("fill", function (d) {
                    d.total = data[d.properties.name] || 0;
                    return colorScale(d.total);
                })
                .style("stroke", "transparent")
                .attr("class", function(d){ return "Country" } )
                .style("opacity", .8)
                .on("mouseover", mouseOver )
                .on("mouseleave", mouseLeave )
                .append("title")
                .text(function(d){return d.properties.name + " "+data[d.properties.name]})
        });
    });

}

export function loadLinePlotsFromScript(){
    // confirmedCasesPerCountry = getConfirmedCases();
    setupDom();
}

function flushLinePlot(){
    d3.select(".scatterIconClass").attr("class", "material-icons scatterIconClass");
    d3.select(".confirmedCases").attr("class", "material-icons confirmedCases");
    d3.select(".worldClass").attr("class", "material-icons worldClass");
    d3.select(".canvasClass").selectAll("path").remove();
}

window.loadLinePlots = function(){
    d3.select(".confirmedCases").attr("class", "material-icons confirmedCases");
    d3.select(".scatterIconClass").attr("class", "material-icons scatterIconClass");
    d3.select(".worldClass").attr("class", "material-icons worldClass selected");
    loadLinePlotsFromScript();
}

window.flushLinePlot= () => flushLinePlot();