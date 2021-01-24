// GLOBALS
var mousecountry = "";
var oldcountry = ""
var map;
var chart;
var piechartOuterSVG;
//default sector
let sector = 'CO2 emission per capita';
const years = ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'];
let x, y;
let currentyear = 2005;
let chartETS = '2. Verified emissions';
let piecountry = 'NL';


import {data} from './data.js';

// Gets the emissions in accordance to data
function getEmission(sector, country, year){
  return data.filter(d => d['country_code'] == country && d.year == year && d['main activity sector name'].includes(sector))[0];
  // return emission
}

function updateSector(s){
  sector = s;
}

function updateYear(y){  //TODO add listener
  currentyear = y;
  $("#currentyear").text(y);
  createPie(piecountry, chartETS, currentyear);
  updateMapColors();
}

function updateCountry(c){ //TODO add listener
  piecountry = c;
  createPie(piecountry, chartETS, currentyear);
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
      let dataset = getDataset(mousecountry.id, sector);
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
  document.getElementById('map').innerHTML = "";
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
          updateCountry(geography.id);
          // map.updateChoropleth({
          //   [geography.id]: {fillKey: 'SELECTED'}
          // }, {reset:true});
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

let createPie = function(piecountry, chartETS, currentyear){ 
  let getPieData = function(piecountry, chartETS){
    let tmp = data.filter(d => d['country_code'] == piecountry && d.year == currentyear && d['ETS information'] == chartETS); 
    console.log(tmp)
    tmp = tmp.map(function(elm) {
      return { label: elm['sector'], count: elm['CO2']};
   });
  
   return tmp;
  
  };
  
  
  var dataset = getPieData(piecountry, chartETS)//.slice(0,10);
  dataset = dataset.sort(function(a,b) { return b.count-a.count})
  
  // chart dimensions
  var width = $('#details').width();
  var height = $('#details').height();
  
  // a circle chart needs a radius
  var radius = Math.min(width, height) / 4;
  console.log(radius);
  
  // legend dimensions
  var legendRectSize = 17.5; // defines the size of the colored squares in legend
  var legendSpacing = 5; // defines spacing between squares
  
  // define color scale
  var color = d3.scale.category20();
  // more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
  
  d3.select("#piechart").html("");

  piechartOuterSVG = d3.select('#piechart') // select element in the DOM with id 'chart'
  .append('svg') // append an svg element to the element we've selected
  .attr('width', width) // set the width of the svg element we just added
  .attr('height', height) // set the height of the svg element we just added
  // .attr("preserveAspectRatio", "xMinYMin meet")

  let piechart = piechartOuterSVG
  .append('g') // append 'g' element to the svg element
  .attr('transform', 'translate(' + (radius) + ',' + (radius) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element
  
  var arc = d3version6.arc()
  .innerRadius(0) // none for pie chart
  .outerRadius(radius); // size of overall chart
  
  var pie = d3version6.pie() // start and end angles of the segments
  .value(function(d) { return d.count; }) // how to extract the numerical data from each entry in our dataset
  // .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null
  
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
  var path = piechart.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
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
  var legend = piechart.selectAll('.legend') // selecting elements with class 'legend'
  .data(color.domain()) // refers to an array of labels from our dataset
  .enter() // creates placeholder
  .append('g') // replace placeholders with g elements
  .attr('class', 'legend') // each g is given a legend class
  .attr('transform', function(d, i) {                   
    var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
    var offset =  height * color.domain().length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
    var horz = width / 3; // the legend is shifted to the left to make room for the text
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
        this._current = interpolate(1000); // interpolate between current value and the new value of 'd'
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
      grey: 'rgb(201, 203, 207)',
    };
}


let updateMapColors = function(){
  var countries = {};
    
    countries['BE'] = getEmission(sector, "BE", currentyear)['CO2'];
    countries['DE'] = getEmission(sector, "DE", currentyear)['CO2'];
    countries['PL'] = getEmission(sector, "PL", currentyear)['CO2']; //PL
    countries['RO'] = getEmission(sector, "RO", currentyear)['CO2']; //RO
    countries['IT'] = getEmission(sector, "IT", currentyear)['CO2'];//IT
    countries['HU'] = getEmission(sector, "HU", currentyear)['CO2'];//HU

    countries['DK'] = getEmission(sector, "DK", currentyear)['CO2'];//DK
    countries['BG'] = getEmission(sector, "BG", currentyear)['CO2'];//BG
    countries['LI'] = getEmission(sector, "LI", currentyear)['CO2'];//LI
    countries['SK'] = getEmission(sector, "SK", currentyear)['CO2'];//SK
    countries['FI'] = getEmission(sector, "FI", currentyear)['CO2'];//FI 
    countries['SE'] = getEmission(sector, "SE", currentyear)['CO2'];//SE
    countries['CZ'] = getEmission(sector, "CZ", currentyear)['CO2'];//CZ
    countries['PT'] = getEmission(sector, "PT", currentyear)['CO2'];//PT
    countries['NL'] = getEmission(sector, "NL", currentyear)['CO2'];//NL 
    countries['NO'] = getEmission(sector, "NO", currentyear)['CO2'];//NO 
    countries['HR'] = getEmission(sector, "HR", currentyear)['CO2'];//HR
    countries['ES'] = getEmission(sector, "ES", currentyear)['CO2'];//ES
    countries['FR'] = getEmission(sector, "FR", currentyear)['CO2'];//FR
    countries['EE'] = getEmission(sector, "EE", currentyear)['CO2'];//EE
    countries['LU'] = getEmission(sector, "LU", currentyear)['CO2'];//LU
    countries['SI'] = getEmission(sector, "SI", currentyear)['CO2'];//SI
    countries['IE'] = getEmission(sector, "IE", currentyear)['CO2'];//IE
    countries['CY'] = getEmission(sector, "CY", currentyear)['CO2'];//CY  
    countries['LT'] = getEmission(sector, "LT", currentyear)['CO2'];//LT
    countries['LV'] = getEmission(sector, "LV", currentyear)['CO2'];//LV
    countries['MT'] = getEmission(sector, "MT", currentyear)['CO2'];//MT 
    countries['GR'] = getEmission(sector, "GR", currentyear)['CO2'];//GR
    countries['GB'] = getEmission(sector, "GB", currentyear)['CO2'];//GB
    countries['AT'] = getEmission(sector, "AT", currentyear)['CO2'];//AT
    countries['IS'] = getEmission(sector, "IS", currentyear)['CO2'];//is
    //console.log(Belgium['CO2']);


  var sum = Object.values(countries).reduce(function (accumulator, value) {
    return accumulator + value
  }, 0)/30;
  var level1 = 2 * sum/ 3 ;
  var level2 = sum;

  Object.keys(countries).forEach(c => {
    let value = countries[c];
    if (value < level1) {
      map.updateChoropleth({[c]: { fillKey: 'MINOR' }});
    }
    else if (value < level2)  {
      map.updateChoropleth({[c]: { fillKey: 'MEDIUM' }});
    }
    else {
      map.updateChoropleth({[c]: { fillKey: 'MAJOR' }});
    }
  })
}

let resizeD3 = function(){
  // resize piechart, map
  console.log('resize');

  //resize piechart
  createPie(piecountry, chartETS, currentyear);
  // map.resize();
  
  let containerw = $('#mapcontainer').width;
  let containerh = $('#mapcontainer').height;
  let tmap = d3.select('#mapcontainer');
  tmap.style('width',parseInt(containerw) + 'px').style('height',parseInt(containerh) + 'px');
}

$(document).ready(function(){
    initMap();
    initChart();
    createPie(piecountry, chartETS, currentyear)
    document.addEventListener('mousemove', onMouseUpdate, false);

    // $("[type=range]").change(function(){
    //   var newval=$(this).val();
    //   updateYear(newval);
    // });

    let slider = document.getElementById("yearslider");
    slider.addEventListener('input', function () {
      updateYear(slider.value);
    }, false);

    $('#sector').change(function(){
      let selected_value = $("input[name='sector-type']:checked").val();
      console.log(selected_value);
      updateSector(selected_value);
    });

    // fire resize function 300ms after last resize event
    var lazyLayout = _.debounce(resizeD3, 300);
    $(window).resize(lazyLayout);
  });