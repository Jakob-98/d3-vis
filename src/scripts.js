// GLOBALS
var mousecountry = "";
var chart;


// FUNCTIONS
function onMouseUpdate(e) {
    x = e.pageX;
    y = e.pageY;
    if(mousecountry){
        $("#chart").css({
            position:"absolute",
            top:y, 
            left: x,
            display: 'Block'
            });
        // chart neem data mee van land... 
    }
    else{
      $("#chart").css({display: 'None'});
    }
}


let initMap = function(){
  var bubble_map = new Datamap({
    element: document.getElementById('map'),
    scope: 'europe',
    geographyConfig: {
      popupOnHover: true,
      highlightOnHover: true,
      borderColor: '#0B4152',
      borderWidth: 1.5,
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
        text:'CO2 emission of [TODO]',
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
  

console.log(mousecountry)

let initChart = function(){
    var ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                data: [20, 0, 30, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2.5
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






$(document).ready(function(){
    initMap();
    initChart();
    document.addEventListener('mousemove', onMouseUpdate, false);
  });
  