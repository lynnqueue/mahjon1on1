const canvas = d3.select(".canva");

const svg = canvas.append("svg")
            .attr("width", 700 )
            .attr("height", 600);

const margin = {top: 20, right: 20, bottom: 70, left: 70};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const mainCanvas = svg.append("g")
                .attr("width", graphWidth / 2)
                .attr("height",  graphHeight / 2)
                .attr("transform", `translate(${margin.left + 300},
                    ${margin.top + 250})`);

const mColors = d3.scaleOrdinal(d3['schemeSet2']);

const formatComma = d3.format(",");

const tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0])
            .direction('w')
            .html(function(d) {
                // return "Pending" + ": <span style='color:orange'>" + formatComma(d.data.pending) + "</span>"
                //     +"<p>Denied: " + "<span style='color:orangered'>" + formatComma(d.data.denied)+"</span> </p>"
                //     +"<p>Approved: " + "<span style='color:orange'>" + formatComma(d.data.approved)+"</span> </p>"
                //     +"<p>Total: " + "<span style='color:orange'>" +formatComma(d.data.total)+"</span> </p>";
                return '<p>' + formatComma(d.data.avg) + '</p>';
            });

mainCanvas.call(tip);

//Inspired by: https://stackoverflow.com/questions/50572762/how-do-i-read-a-csv-file-into-an-array-using-d3js-v5
function getCSVData() {
    d3.csv('../daily-nutrients-requirements.csv', function(d){ 
        debugger;
        return d;
    }).then(drawPieChart);
}

getCSVData();

const pie = d3.pie()
    .sort(null)
    .value(data => data.avg);

const arcPath = d3.arc()
                .outerRadius(190)
                .innerRadius(100);

             
function drawPieChart(data){
    debugger;
    mColors.domain(data.map(d => d.avg));
             
    const angles = pie(data);
    const paths = mainCanvas.selectAll('path')
                    .data(angles);

    svg.append("text")
        .attr("class", "daca-title")
        .attr("dy", "5%")
        .attr("dx", "5%")
        .style("opacity", 0.0)
        .transition()
            .duration(1000)
            .style("opacity", (d, i) => i+0.7)
        .attr("text-anchor", "right")
        .attr("fill", "white")
        .text("Daily Nutrients Planner")

    mainCanvas.append("text")
        .attr("class", "daca-text")
        .attr("dy", ".85em")
        .style("opacity", 0.0)
        .transition()
            .duration(1000)
            .style("opacity", (d, i) => i+0.7)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text("Requirement On Average")

    paths.enter()
        .append("path")
        .attr("class", "arc")
        .attr("fill", d => mColors(d.data.avg))
        .attr("stroke", "#cde")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .transition()
            .duration(750)
            .attrTween("d", arcAnimation)        
}


const arcAnimation = d => {
    const i = d3.interpolate(d.endAngle, d.startAngle);

    return function(t){
        d.startAngle = i(t);
        return arcPath(d);
    }
}


