// GLOBALS
var mousecountry = "";
var oldcountry = ""
var chart;
//default sector
let sector = 'Total CO2 emitted';
const years = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'];
let x, y;

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
      top: y,
      left: x,
      display: 'Block'
    });
    
    if (mousecountry != oldcountry){
      oldcountry = mousecountry
      let dataset = getDataset(mousecountry, sector);
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
      chart.options.title.text = 'CO2 emission of: ' + sector + ' in ' + mousecountry;
      chart.update()
    }
  }
  else {
    $("#chart").css({ display: 'None' });
  }
}


let initMap = function(){
  var bubble_map = new Datamap({
    element: document.getElementById('map'),
    responsive: true,
    scope: 'europe',
    geographyConfig: {
      popupOnHover: true,
      highlightOnHover: true,
      borderColor: '#000000',
      borderWidth: 1,
      // source: https://github.com/leakyMirror/map-of-europe/blob/master/TopoJSON/europe.topojson
      dataUrl: './src/europe.topojson'
      //dataJson: topoJsonData
    },
    fills: {
      'MAJOR': '#306596',
      'MEDIUM': '#0fa0fa',
      'MINOR': '#bada55',  
      defaultFill: '#ffdd00'
    },
    data: {
        'CY': { fillKey: 'MINOR' },
        'NL': { fillKey: 'MINOR' },
        'DE': { fillKey: 'MINOR' }
    },
    setProjection: function (element) {
      var projection = d3.geo.equirectangular()
        .center([10, 50])
        .rotate([4.4, 0])
        .scale(750)
        .translate([element.offsetWidth / 3, element.offsetHeight / 2]);
      var path = d3.geo.path()
        .projection(projection);
      return { path: path, projection: projection };
    },

    done: function(datamap) {
      datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
        //   console.log(geography);
          alert(geography.properties.name);
      });
      datamap.svg.selectAll('.datamaps-subunit').on('mouseover', function(geography) {
        //   console.log(geography);
        mousecountry = geography.properties.name;
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
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [{
              label: "Unfilled",
              fill: false,
              backgroundColor: window.chartColors.blue,
              borderColor: window.chartColors.blue,
              data: [
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor()
              ],
          }, {
              label: "Dashed",
              fill: false,
              backgroundColor: window.chartColors.green,
              borderColor: window.chartColors.green,
              borderDash: [5, 5],
              data: [
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor()
              ],
          }, {
              label: "Filled",
              backgroundColor: window.chartColors.red,
              borderColor: window.chartColors.red,
              data: [
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor(),
                  randomScalingFactor()
              ],
              fill: true,
          }]
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



// zooi voor dummy data
let getdummydata = function(){
    let datasets = [{
        label: "Unfilled",
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ],
    }, {
        label: "Dashed",
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        borderDash: [5, 5],
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ],
    }, {
        label: "Filled",
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ],
        fill: true,
    }]
    return datasets

  }


  window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };


window.randomScalingFactor = function() {
	return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
};



/// end zooi voor dummy data


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
  