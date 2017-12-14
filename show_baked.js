var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },
    width = 2000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom

var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("shape-rendering", "geometric-precision")

var wrapper = svg
    .append("g")
    .attr("class", "wrapper")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var topic_name = "european union"
// var topics = ["Male", "Female"]
var x = d3.scaleLinear()
    .domain([-350, 350])
    .range([0, width])

var xAxis = d3.axisBottom(x)

var y = d3.scaleLinear()
    .domain([0, 0.3])
    .range([height, 0])


var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-6, 0])
    .html(function (d) {
        return `<div id="tooltip">
                    <h1 style="background-color: black;">${d.full_name}</h1>
                    <div class="mp-image-parent">
                    <img class="mp-image" src="./mp-images/mp-${d.id}.jpg" style="opacity: 1;"/>
                    </div>
<p>${d[topic_name].toFixed(2)}</p><p>
</div>`
    })

svg.call(tip)


var xAxisTitle = svg.append("text")
    .attr("class", "axisTitle")
    .text("Topic")

xAxisTitle
    .attr("x", width - xAxisTitle.node()
        .getBBox()
        .width + margin.right)
    .attr("y", margin.top + (height / 2) - xAxisTitle.node()
        .getBBox()
        .height)

wrapper.append("text")
    .attr("x", 50)
    .attr("y", 30)
    .attr("dy", "0.71em")
    .text("What topics are MPs interested in?")

// nodes = nodes.filter(node => ["welfare reforms"].indexOf(node.topic_name) >= 0)
var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(["Labour", "Conservative", "Liberal Democrat", "Scottish National Party"])

// wrapper.append("g")
//     .attr("class", "x-axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis)

var yAxis = d3.axisLeft(y)
// wrapper.append("g")
//     .attr("class", "y-axis")
//     .attr("transform", "translate(" + (x(0)) + ", 0)")
//     .call(yAxis)

var baked_positions = []
var nodes = []

d3.queue()
    .defer(d3.csv,
        "baked_positions.csv" + "?" + Math.floor(Math.random() * 1000)
    )
    .defer(d3.csv,
        "data.csv" + "?" + Math.floor(Math.random() * 1000)
    )
    .defer(d3.csv, "topic_medians.csv", (d) => ({ topic: d.topic, male: Math.pow(10, +d.male), female: Math.pow(10, +d.female) }))
    .await(
        function (error, baked_data, mp_data, topic_medians_data) {

            var topic_medians = {}
            topic_medians_data.forEach(a => { topic_medians[a.topic] = { male: a.male, female: a.female } })

            baked_data.forEach(function (row) {

                Object.keys(row)
                    .forEach(
                        function (colname) {
                            if (colname == "id" || colname.slice(-1) == "y") return
                            var topic = colname.slice(0, -2)
                            baked_positions.push({
                                "id": +row["id"],

                                "topic": topic,
                                "x": +row[topic + "_x"],
                                "y": +row[topic + "_y"],
                            })
                        }
                    )
            })

            baked_positions = d3.nest()
                .key(d => d.topic)
                .entries(baked_positions)

            // Convert wide data to long
            nodes = mp_data.map(function (d) {
                var node = {
                    "id": +d.id,
                    "full_name": d.full_name,
                    "party": d.Party,
                    "gender": d.is_female == 1 ? "Female" : "Male",
                }
                Object.keys(d)
                    .forEach(function (key) {
                        if (key != "id" & key != "full_name" & key != "Party" & key != "is_female") {
                            node[key] = d[key] == "-inf" ? 0 : Math.pow(10, +d[key])
                        }
                    })
                return node
            })



            var nodes_male = nodes.filter(d => d.gender == "Male")
            var nodes_female = nodes.filter(d => d.gender != "Male")

            function update() {
                // Get value of topic dropdown
                topic_name = d3.select("#topic-dropdown")
                    .property("value")

                // Call function initially
                baked_data = baked_positions.filter(d => d.key == topic_name)[0].values

                nodes_male.map(function (d) {
                    var n = baked_data.filter(n => n.id == d.id)[0]
                    d.x = x(n.x) - 10
                    d.y = y(n.y)
                })

                nodes_female.map(function (d) {
                    var n = baked_data.filter(n => n.id == d.id)[0]
                    d.x = x(n.x) + 10
                    d.y = y(n.y)
                })

                // transition
                var transition = d3.transition()
                    .duration(1000)

                // JOIN
                circle_male = wrapper.selectAll(".male-node")
                    .data(nodes_male)

                // UPDATE
                circle_male
                    .transition(transition)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)

                // ENTER
                circle_male
                    .enter()
                    .append("circle")
                    .attr("class", "male-node")
                    .style("fill", "red")
                    .attr("r", 1.8)
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide)
                    .attr("cx", x(0))
                    .attr("cy", d => d.y)
                    .style("opacity", 0.0)
                    .transition(transition)
                    .delay((d, i) => 100 * Math.sqrt(i))
                    .style("opacity", 0.7)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)

                // Female nodes
                // JOIN
                circle_female = wrapper.selectAll(".female-node")
                    .data(nodes_female)

                // UPDATE
                circle_female
                    .transition(transition)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)

                // ENTER
                circle_female
                    .enter()
                    .append("circle")
                    .attr("class", "female-node")
                    .style("fill", "lightblue")
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .attr("r", 1.8)
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide)
                    .attr("cx", x(0))
                    .attr("cy", d => d.y)
                    .style("opacity", 0.0)
                    .transition(transition)
                    .delay((d, i) => 100 * Math.sqrt(i))
                    .style("opacity", 0.7)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)

                // Median connector line
                // Join
                var median_connector_line = wrapper
                    .selectAll(".median-connector")
                    .data([topic_medians[topic_name]])

                // Update
                median_connector_line
                    .transition(transition)
                    .attr("y1", d => y(d["female"]))
                    .attr("y2", d => y(d["male"]))

                // Enter
                median_connector_line
                    .enter()
                    .append("line")
                    .attr("class", "median-connector")
                    .attr("x1", x(0))
                    .attr("x2", x(0))
                    .transition(transition)
                    .delay(3000)
                    .attr("y1", d => y(d["female"]))
                    .attr("y2", d => y(d["male"]))
                    .style("stroke-width", 1)
                    .style("stroke", "white")

                // Male median fraction
                // Join
                var male_median_circle = wrapper
                    .selectAll(".male-median")
                    .data([topic_medians[topic_name]["male"]])

                // Update
                male_median_circle
                    .transition(transition)
                    .attr("cy", d => y(d))

                // Enter
                male_median_circle
                    .enter()
                    .append("circle")
                    .attr("class", "male-median")
                    .attr("cy", y(0))
                    .attr("cx", x(0))
                    .transition(transition)
                    .delay(2000)
                    .attr("cy", d => y(d))
                    .attr("r", 3)
                    .style("fill", "red")
                // .style("stroke-width", 1)
                // .style("stroke", "white")

                // Female median fraction
                // Join
                var female_median_circle = wrapper
                    .selectAll(".female-median")
                    .data([topic_medians[topic_name]["female"]])

                // Update
                female_median_circle
                    .transition(transition)
                    .attr("cy", d => y(d))

                // Enter
                female_median_circle
                    .enter()
                    .append("circle")
                    .attr("class", "female-median")
                    .attr("cy", y(0))
                    .attr("cx", x(0))
                    .transition(transition)
                    .delay(2000)
                    .attr("cy", d => y(d))
                    .attr("r", 3)
                    .style("fill", "lightblue")
                // .style("stroke-width", 1)
                // .style("stroke", "white")

            }

            var topic_dropdown = d3.select("body")
                .insert("select", ":first-child")
                .attr("id", "topic-dropdown")
                .on("change", update)
                .selectAll(".topic")
                .data(baked_positions.map(topic => topic.key))
                .enter()
                .append("option")
                .text(d => d)

            // Call function initially
            update()

            var simulation_male = d3.forceSimulation(nodes_male)
                .force("x", d3.forceX(x(0))
                    .strength(0.1))
                .force("y", d3.forceY(function (d) {
                    return y(d[topic_name])
                })
                    .strength(1))
                .force("collide",
                    d3.forceCollide(10.0)
                        .radius(2)
                        .iterations(30))
                .alphaMin(0.000000001)
                .velocityDecay(0.1)

            var simulation_female = d3.forceSimulation(nodes_female)
                .force("x", d3.forceX(x(0))
                    .strength(0.1))
                .force("collide",
                    d3.forceCollide(7.0)
                        .radius(2)
                        .iterations(10))
                .alphaMin(0.000001)
                .velocityDecay(0.2)

            simulation_male.on("tick", function () {
                nodes_male.map(function (d) {
                    d.x = Math.min(d.x, x(0) - 2.5)
                    var node_y = y(d[topic_name])
                    d.y = Math.min(node_y + 5, Math.max(node_y - 5, d.y))
                    d.y = Math.min(y(0), d.y)
                })
                circle_male.attr("cx", function (d) {
                    return d.x
                })
                    .attr("cy", function (d) {
                        // return Math.max(0 + 2.5, Math.min(height - 2.5, d.y))
                        return d.y
                    })
            })
                .stop()

            simulation_female.on("tick", function () {
                nodes_female.map(function (d) {
                    d.x = Math.max(x(0) + 2.5, d.x)
                    var node_y = y(d[topic_name])
                    d.y = Math.min(node_y + 2.5, Math.max(node_y - 2.5, d.y))
                })
                circle_female.attr("cx", function (d) {
                    return d.x
                })
                    .attr("cy", function (d) {
                        return d.y
                    })
            })
                .stop()

            // for (var i = 0; i < 30; ++i) simulation_male.tick()


        })
