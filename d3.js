console.log("script loaded");

const margin = {top: 20, right: 150, bottom: 180, left:60}
const width = 700 - margin.left - margin.right
const height = 900 - margin.top - margin.bottom - 200
const categories = document.getElementById("categories");
let data;
d3.csv("fatal-occupational-injuries.csv", function(d) {
    return {
        occupation: d['Occupation'],
        code: +d["Occupation code"].split("-")[1],
        total: +d['Total fatal injuries (number)'],
        violence: +d['Violence and other injuries by persons or animals'],
        transportation: +d['Transportation incidents'],
        fires: +d['Fires and explosions'],
        falls: +d["Falls, slips, trips"],
        exposure: +d['Exposure to harmful substances or environments'],
        contact: +d['Contact with objects and equipment']
    }
}).then((d) => {
    data = d.sort((a, b) => {
        return a.total - b.total;
    });
}).then((d) => {
    generateD3();
}).then((d) => {
    buildPolarChart(data);
});
       

function generateD3() {
    
    const cat = categories.options[categories.selectedIndex].value;


    let selectedData = data.filter((job) => {
        switch(cat) {
            case "Major groups":
                return job.code === 0;
            case "Minor groups":
                return job.code != 0 && job.code % 1000 === 0;
            case "Broad occupations":
                return job.code % 10 === 0 && job.code % 1000 != 0;
            case "Detailed occupations":
                return job.code % 10 != 0;
        }

    })
    selectedData = selectedData.slice(selectedData.length - 10);
    chartD3(selectedData)

}


function chartD3(data) {
    svgElement = document.getElementById("chart");
    svgElement.innerHTML = '';
    // Append the SVG to the body of the page
    const svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
    


    const x = d3.scaleBand()
                .domain(data.map(d=>d.occupation))
                .range([0, width])
                .padding(0.2)
    
    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d=> d.total)])
                .range([height, 0])
    
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")  
        .style("text-anchor", "start")
        .attr("dx", "-1em")
        .attr("dy", "1em")
        .attr("transform", "rotate(35)");
    
    svg.append("g")
        .call(d3.axisLeft(y))

    const describe = document.getElementById("describe");

    // Add in our marks
    svg.append("g")
        .selectAll("dot")
        .data(data)
        .join("rect")
            .attr("x", function(d){     // Update the x value to use country
                return x(d.occupation)     // instead of health
            })
            .attr("y", d => y(d.total)) // Same general mapping for the y-position
            .attr("width", x.bandwidth)                             // width and height. The bandwidth
            .attr("height", function(d){                            // is the bar width computed using 
                return height - y(d.total)                // Recall that the origin is in the 
            })                                                      // a look at the graph without "height                                                       // -" to see what changes.             .style("fill", function(d) {return color(d.occupation)})
            .on("mouseover", function(e, d) {
                describe.innerText = `Fatal work-related injuries: ${d.total} 
                Occupation: ${d.occupation}`
            })

}

