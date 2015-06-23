function drawScatter(data,charWidth,charHeight,chart,tooltip,xScale,yScale){
       
  var bars = chart.selectAll("circle")
    .data(data.dat)
    .enter()
    .append("circle")
    .attr("fill",function(d) { return d.color ;})
    .attr("cx",function(d) { return (xScale(d.x)+ xScale.rangeBand()/2); })
    .attr("cy",function(d) {return yScale(d.y); })
     .attr("r",function(d) {return d.size; })

    .on('mouseover', function(d) {
    tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html ( (d.x) 
          + ", " + (d.y) )
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    })
    .on('mouseout', function(d) {
      tooltip.transition()
               .duration(500)
               .style("opacity", 0);
    });


    drawAxes(chart,data,charWidth,charHeight,xScale,yScale);
    drawLegend(chart,data,charWidth);
};


function drawBar(data,charWidth,charHeight,chart,tooltip,xScale,yScale)
{
  
  var bars = chart.selectAll("rect")
    .data(data.dat)
    .enter()
    .append("rect")
    .attr("fill",data.dom.fill)
    .attr("width",xScale.rangeBand())
    .attr("height",function(d) { return (charHeight-yScale(d.y)); } )
    .attr("x",function(d) { return xScale(d.x); })
    .attr("y",function(d) {return yScale(d.y); })

    .on('mouseover', function(d) {
        tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              tooltip.html ( (d.x) 
              + ", " + (d.y) )
                   .style("left", (xScale(d.x)+data.dimensions.margin.left + xScale.rangeBand()/3 ) + "px")
                   .style("top", (yScale(d.y)) + "px" );
        d3.select(this)
          .attr('fill', data.dom.hover);
    })
    .on('mouseout', function(d) {
        tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        d3.select(this)
                .attr('fill', data.dom.fill);
    });

     drawAxes(chart,data,charWidth,charHeight,xScale,yScale) ;

}


function drawAxes(chart,data,charWidth,charHeight,xScale,yScale)
{  

  var xAxis = d3.svg.axis()
    .scale(xScale);
   // .ticks([numberOfBars]);
    //.orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");
    // .ticks(10, "%");

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform","translate(0," + charHeight + ")")
    .call(xAxis)
    .append("text")
    .attr("x",charWidth-(data.dimensions.margin.right ))
    .attr("y",35)
    .style("text-anchor", "end")
    .text(data.axes[0].label);

  chart.append("g")
    .attr("class", "y axis")
    //.attr("transform","rotate(90)")
     //.attr("transform","translate(0," + charHeight + ")")
    .call(yAxis)
    .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text(data.axes[1].label); 


}
 
function drawLegend(chart,data,charWidth)
{   
    var legend = chart.selectAll(".legend")
      .data(data.dat)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", charWidth - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) {return d.color ;});

  // draw legend text
  legend.append("text")
      .attr("x", charWidth - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d.x;})
}

function drawGraph(data)
{
  var height = data.dimensions.height;
  var width = data.dimensions.width;
  var charWidth = width - (data.dimensions.margin.left + data.dimensions.margin.right);
  var charHeight = height - (data.dimensions.margin.top + data.dimensions.margin.bottom);
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  var canvas = d3.select("body") 
    .append("svg") 
    .attr("width",width)
    .attr("height",height)
    .style("background-color", "#c7e9c0");
  var chart = canvas.append('g')
    .attr("transform", "translate(" + data.dimensions.margin.left + "," + data.dimensions.margin.top + ")");    
  var plotData=data.dat ;  
  var xScale = d3.scale.ordinal()
    .domain(plotData.map(function(d){
      return d.x;
    }))
    .rangeRoundBands([0, charWidth], 0.2);
  var yScale = d3.scale.linear()
    .domain([ d3.max(plotData, function(d){
      return d.y;
    }),0])
    .range([0,charHeight]);
  

  if(data.meta.type=='scatter')
    drawScatter(data,charWidth,charHeight,chart,tooltip,xScale,yScale);
  if(data.meta.type=='bar')
    drawBar(data,charWidth,charHeight,chart,tooltip,xScale,yScale);
}

 
d3.json("sample.json", drawGraph);
