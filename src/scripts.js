// GLOBALS
var mousecountry = "";
var oldcountry = ""
var map;
var chart;
//default sector
let sector = 'Total CO2 emitted';
const years = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'];
let x, y;
let currentyear = 2015;

import {data} from './data.js';

// Gets the emissions in accordance to data
function getEmission(sector, country, year){
  return data.filter(d => d.country == country && d.year == year && d['main activity sector name'].includes(sector))[0];
  // return emission
}

function updateSector(s){
  sector = s;
}

function getDataset(country, sector){
  let emissions = years.map(year => getEmission(sector, country, year));

  // return all non-undefined values
  return emissions.filter(e => e);
  // return emissions
}

// FUNCTIONS
function onMouseUpdate(e) {
  x = e.pageX;
  y = e.pageY;
  if (mousecountry) {
    $("#chart").css({
      position: "absolute",
      top: y-65,
      left: x,
      display: 'Block'
    });
    
    if (mousecountry != oldcountry){
      oldcountry = mousecountry
      let dataset = getDataset(mousecountry.properties.name, sector);
      chart.config.data = {
        labels: dataset.map(e => e.year),
        datasets: [{
          label: "",
          fill: false,
          backgroundColor: window.chartColors.blue,
          borderColor: window.chartColors.blue,
          data: dataset.map(e => e['CO2'])
        }]
      }
      chart.options.title.text = 'CO2 emission of: ' + sector + ' in ' + mousecountry.properties.name;
      chart.update()
    }
  }
  else {
    $("#chart").css({ display: 'None' });
  }
}


let initMap = function(){
  map = new Datamap({
    element: document.getElementById('map'),
    responsive: true,
    scope: 'europe',
    geographyConfig: {
      popupOnHover: true,
      highlightOnHover: true,
      borderColor: '#000000',
      borderWidth: 1,
      // source: https://github.com/leakyMirror/map-of-europe/blob/master/TopoJSON/europe.topojson
      dataUrl: './src/eu.topojson'
      //dataJson: topoJsonData
    },
    fills: {
      'MAJOR': '#306596',
      'MEDIUM': '#0fa0fa',
      'SELECTED': '#bada55', 
      defaultFill: '#ffdd00'
    },
    data: {
        // 'CY': { fillKey: 'MINOR' },
        // 'NL': { fillKey: 'MINOR' },
        // 'DE': { fillKey: 'MINOR' }
    },
    setProjection: function (element) {
      var projection = d3.geo.equirectangular()
        .center([0, 50])
        .rotate([4, 0])
        .scale(1000)
        .translate([element.offsetWidth / 3, element.offsetHeight / 2]);
      var path = d3.geo.path()
        .projection(projection);
      return { path: path, projection: projection };
    },

    done: function(datamap) {
      datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
          console.log(geography);
          // alert(geography.properties.name);
          map.updateChoropleth({
            [geography.id]: {fillKey: 'SELECTED'}
          });
      });
      datamap.svg.selectAll('.datamaps-subunit').on('mouseover', function(geography) {
        // remove geometry for performance
        delete geography.geometry;
        mousecountry = geography;
        // $("#chart").css( {position:"absolute", display: "Inline"});
          // update chart data
      });
      datamap.svg.selectAll('.datamaps-subunit').on('mouseout', function(geography) {
        mousecountry = "";
        // $("#chart").css( {position:"absolute", display: "None"});
        //   console.log(geography);
        //   $("#chart").css( {position:"absolute", top:event.pageY, left: event.pageX});
          // update chart data
      });
    }
  });
}


let chartoptions = {
    maintainAspectRatio: false,
    responsive: false,
    scales: {
        xAxes: [{
            gridLines: {
                display:false
            },
            beginatzero: true
        }],
        yAxes: [{
            gridLines: {
                display:false
            }   
        }]
    },
    title: {
        position: 'bottom',
        display: true,
    },
    legend: {
        display: false
    },
    tooltips: {
        callbacks: {
           label: function(tooltipItem) {
                  return tooltipItem.yLabel;
           }
        }
    }
}
  
let initChart = function(){
    var ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
      },
        options: chartoptions
    }); 
}



// /// Slider


    // var formatDateIntoYear = d3.time.format("%Y");
    // var formatDate = d3.time.format("%b %Y");
    // var parseDate = d3.time.format("%m/%d/%y").parse;

    // var startDate = new Date("2004-11-01"),
    //     endDate = new Date("2017-04-01");

    // var margin = {top:50, right:50, bottom:0, left:50},
    //     width = 960 - margin.left - margin.right,
    //     height = 500 - margin.top - margin.bottom;

    // var svg = d3.select("#vis")
    //     .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom);  


    // var moving = false;
    // var currentValue = 0;
    // var targetValue = width;

    // var playButton = d3.select("#play-button");
        
    // var x = d3.time.scale()
    //     .domain([startDate, endDate])
    //     .range([0, targetValue])
    //     .clamp(true);

    // var slider = svg.append("g")
    //     .attr("class", "slider")
    //     .attr("transform", "translate(" + margin.left + "," + height/5 + ")");

    // slider.append("line")
    //     .attr("class", "track")
    //     .attr("x1", x.range()[0])
    //     .attr("x2", x.range()[1])
    // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    //     .attr("class", "track-inset")
    // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    //     .attr("class", "track-overlay")
    //     .call(d3.drag()
    //         .on("start.interrupt", function() { slider.interrupt(); })
    //         .on("start drag", function() {
    //         currentValue = d3.event.x;
    //         update(x.invert(currentValue)); 
    //         })
    //     );

    // slider.insert("g", ".track-overlay")
    //     .attr("class", "ticks")
    //     .attr("transform", "translate(0," + 18 + ")")
    // .selectAll("text")
    //     .data(x.ticks(10))
    //     .enter()
    //     .append("text")
    //     .attr("x", x)
    //     .attr("y", 10)
    //     .attr("text-anchor", "middle")
    //     .text(function(d) { return formatDateIntoYear(d); });

    // var handle = slider.insert("circle", ".track-overlay")
    //     .attr("class", "handle")
    //     .attr("r", 9);

    // var label = slider.append("text")  
    //     .attr("class", "label")
    //     .attr("text-anchor", "middle")
    //     .text(formatDate(startDate))
    //     .attr("transform", "translate(0," + (-25) + ")")

    
    // ////////// plot //////////

    // var dataset;

    // var plot = svg.append("g")
    //     .attr("class", "plot")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // d3.csv("./dataset/circles.csv", prepare, function(data) {
    // dataset = data;
    // drawPlot(dataset);
    
    // playButton
    //     .on("click", function() {
    //     var button = d3.select(this);
    //     if (button.text() == "Pause") {
    //     moving = false;
    //     clearInterval(timer);
    //     // timer = 0;
    //     button.text("Play");
    //     } else {
    //     moving = true;
    //     timer = setInterval(step, 100);
    //     button.text("Pause");
    //     }
    //     console.log("Slider moving: " + moving);
    // })
    // })

    // function prepare(d) {
    // d.id = d.id;
    // d.date = parseDate(d.date);
    // return d;
    // }
    
    // function step() {
    // update(x.invert(currentValue));
    // currentValue = currentValue + (targetValue/151);
    // if (currentValue > targetValue) {
    //     moving = false;
    //     currentValue = 0;
    //     clearInterval(timer);
    //     // timer = 0;
    //     playButton.text("Play");
    //     console.log("Slider moving: " + moving);
    // }
    // }

    // function drawPlot(data) {
    // var locations = plot.selectAll(".location")
    //     .data(data);

    // // if filtered dataset has more circles than already existing, transition new ones in
    // locations.enter()
    //     .append("circle")
    //     .attr("class", "location")
    //     .attr("cx", function(d) { return x(d.date); })
    //     .attr("cy", height/2)
    //     .style("fill", function(d) { return d3.hsl(d.date/1000000000, 0.8, 0.8)})
    //     .style("stroke", function(d) { return d3.hsl(d.date/1000000000, 0.7, 0.7)})
    //     .style("opacity", 0.5)
    //     .attr("r", 8)
    //     .transition()
    //     .duration(400)
    //     .attr("r", 25)
    //         .transition()
    //         .attr("r", 8);

    // // if filtered dataset has less circles than already existing, remove excess
    // locations.exit()
    //     .remove();
    // }

    // function update(h) {
    // // update position and text of label according to slider scale
    // handle.attr("cx", x(h));
    // label
    //     .attr("x", x(h))
    //     .text(formatDate(h));

    // // filter data set and redraw plot
    // var newData = dataset.filter(function(d) {
    //     return d.date < h;
    // })
    // drawPlot(newData);
    // }

/// BEGIN zooi voor piechart
let chartETS = '4. Total surrendered units';

let piecountry = 'Netherlands';

let getPieData = function(piecountry, chartETS){
  let tmp = data.filter(d => d.country == piecountry && d.year == currentyear && d['ETS information'] == chartETS); 
  console.log(tmp)
  tmp = tmp.map(function(elm) {
    return { label: elm['main activity sector name'], count: elm['CO2']};
 });

 return tmp;

};



var dataset = getPieData(piecountry, chartETS)//.slice(0,10);

// // define data
// var dataset = [
//   {label: "Assamese", count: 13},
//   {label: "Bengali", count: 83},
//   {label: "Bodo", count: 1.4},
//   {label: "Dogri", count: 2.3},
//   {label: "Gujarati", count: 46},
//   {label: "Hindi", count: 300},
//   {label: "Kannada", count: 38},
//   {label: "Kashmiri", count: 5.5},
//   {label: "Konkani", count: 5},
//   {label: "Maithili", count: 20},
//   {label: "Malayalam", count: 33},
//   {label: "Manipuri", count: 1.5},
//   {label: "Marathi", count: 72},
//   {label: "Nepali", count: 2.9},
//   {label: "Oriya", count: 33},
//   {label: "Punjabi", count: 29},
//   {label: "Sanskrit", count: 0.01},
//   {label: "Santhali", count: 6.5},
//   {label: "Sindhi", count: 2.5},
//   {label: "Tamil", count: 61},
//   {label: "Telugu", count: 74},
//   {label: "Urdu", count: 52},
//   {label: "Urdu3", count: 52},
//   {label: "Urdu4", count: 52},
//   {label: "Urdu5", count: 52},
//   {label: "Urdu6", count: 52},
//   {label: "Urdu7", count: 52}
// ];

// chart dimensions
var width = 1200;
var height = 800;

// a circle chart needs a radius
var radius = Math.min(width, height) / 2;

// legend dimensions
var legendRectSize = 25; // defines the size of the colored squares in legend
var legendSpacing = 6; // defines spacing between squares

// define color scale
var color = d3.scale.category20b();
// more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

var svg = d3.select('#piechart') // select element in the DOM with id 'chart'
.append('svg') // append an svg element to the element we've selected
.attr('width', width) // set the width of the svg element we just added
.attr('height', height) // set the height of the svg element we just added
.append('g') // append 'g' element to the svg element
.attr('transform', 'translate(' + (width / 4) + ',' + (height / 4) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

var arc = d3version6.arc()
.innerRadius(0) // none for pie chart
.outerRadius(radius); // size of overall chart

var pie = d3version6.pie() // start and end angles of the segments
.value(function(d) { return d.count; }) // how to extract the numerical data from each entry in our dataset
.sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

// define tooltip
var tooltip = d3.select('#piechart') // select element in the DOM with id 'chart'
.append('div') // append a div element to the element we've selected                                    
.attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected

tooltip.append('div') // add divs to the tooltip defined above                            
.attr('class', 'label'); // add class 'label' on the selection                         

tooltip.append('div') // add divs to the tooltip defined above                     
.attr('class', 'count'); // add class 'count' on the selection                  

tooltip.append('div') // add divs to the tooltip defined above  
.attr('class', 'percent'); // add class 'percent' on the selection

// Confused? see below:

// <div id="chart">
//   <div class="tooltip">
//     <div class="label">
//     </div>
//     <div class="count">
//     </div>
//     <div class="percent">
//     </div>
//   </div>
// </div>

dataset.forEach(function(d) {
d.count = + d.count; // calculate count as we iterate through the data
d.enabled = true; // add enabled property to track which entries are checked
});

// creating the chart
var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
.data(pie(dataset)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
.enter() //creates placeholder nodes for each of the values
.append('path') // replace placeholders with path elements
.attr('d', arc) // define d attribute with arc function above
.attr('fill', function(d) { return color(d.data.label); }) // use color scale to define fill of each label in dataset
.each(function(d) { this._current - d; }); // creates a smooth animation for each track

// mouse event handlers are attached to path so they need to come after its definition
path.on('mouseover', function(d) {  // when mouse enters div      
var total = d3version6.sum(dataset.map(function(d) { // calculate the total number of tickets in the dataset         
return (d.enabled) ? d.count : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase                                      
}));                                                      
var percent = Math.round(1000 * d.data.count / total) / 10; // calculate percent
tooltip.select('.label').html(d.data.label); // set current label           
tooltip.select('.count').html(Math.round(d.data.count/10000)); // set current count            
tooltip.select('.percent').html(percent + '%'); // set percent calculated above          
tooltip.style('display', 'block'); // set display                     
});                                                           

path.on('mouseout', function() { // when mouse leaves div                        
tooltip.style('display', 'none'); // hide tooltip for that element
});

path.on('mousemove', function(d) { // when mouse moves                  
tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
  .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
});

// define legend
var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
.data(color.domain()) // refers to an array of labels from our dataset
.enter() // creates placeholder
.append('g') // replace placeholders with g elements
.attr('class', 'legend') // each g is given a legend class
.attr('transform', function(d, i) {                   
  var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
  var offset =  height * color.domain().length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
  var horz = 18 * legendRectSize; // the legend is shifted to the left to make room for the text
  var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
    return 'translate(' + horz + ',' + vert + ')'; //return translation       
 });

// adding colored squares to legend
legend.append('rect') // append rectangle squares to legend                                   
.attr('width', legendRectSize) // width of rect size is defined above                        
.attr('height', legendRectSize) // height of rect size is defined above                      
.style('fill', color) // each fill is passed a color
.style('stroke', color) // each stroke is passed a color
.on('click', function(label) {
  var rect = d3.select(this); // this refers to the colored squared just clicked
  var enabled = true; // set enabled true to default
  var totalEnabled = d3.sum(dataset.map(function(d) { // can't disable all options
    return (d.enabled) ? 1 : 0; // return 1 for each enabled entry. and summing it up
  }));

  if (rect.attr('class') === 'disabled') { // if class is disabled
    rect.attr('class', ''); // remove class disabled
  } else { // else
    if (totalEnabled < 2) return; // if less than two labels are flagged, exit
    rect.attr('class', 'disabled'); // otherwise flag the square disabled
    enabled = false; // set enabled to false
  }

  pie.value(function(d) { 
    if (d.label === label) d.enabled = enabled; // if entry label matches legend label
      return (d.enabled) ? d.count : 0; // update enabled property and return count or 0 based on the entry's status
  });

  path = path.data(pie(dataset)); // update pie with new data

  path.transition() // transition of redrawn pie
    .duration(750) // 
    .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
      var interpolate = d3version6.interpolate(this._current, d); // this = current path element
      this._current = interpolate(0); // interpolate between current value and the new value of 'd'
      return function(t) {
        return arc(interpolate(t));
      };
    });
});

// adding text to legend
legend.append('text')                                    
.attr('x', legendRectSize + legendSpacing)
.attr('y', legendRectSize - legendSpacing)
.text(function(d) { return d; }); // return label


/// END zooi voor piechart


  window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };


$(document).ready(function(){
    initMap();
    initChart();
    document.addEventListener('mousemove', onMouseUpdate, false);

    $('#sector').change(function(){
        let selected_value = $("input[name='sector-type']:checked").val();
        console.log(selected_value);
        updateSector(selected_value);
    });
  });
  