var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(hwData) {

    // Parse Data/Cast as numbers
    hwData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      //data.abbr = +data.abbr;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(hwData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(hwData, d => d.healthcare)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(hwData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    // shouts to my project group for help with this one
    chartGroup.selectAll(".circleText")
      .data(hwData)
      .enter()
      .append("text")
      .attr("class", "circleText")
      .text(function(d) { return d.abbr })
      .attr("x", d => xLinearScale(d.poverty)-7)
      .attr("y", d => yLinearScale(d.healthcare)+4)
      .attr("font-size", "9")
      .attr("fill", "black");

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

  }).catch(function(error) {
    console.log(error);
  });
