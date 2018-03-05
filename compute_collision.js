const D3Node = require('d3-node');
const d3 = require('d3')
const d3beeswarm = require('d3-beeswarm')
const request = require("d3-request")
const fs = require("fs")

var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom

var node_radius = 2.5;

// Get topic name from command line argument
topic_name = process.argv[2]

var x = d3.scaleLinear()
    .domain([-300, 300])
    .range([0 + width / 4, width * 3 / 4]);

var y = d3.scaleLinear()
    .domain([0, 0.3])
    .range([height, 0]);

fs.readFile("mp_topic_fraction.csv", "utf-8", function (error, data) {
    if (error) throw error;
    data = d3.csvParse(data)
    // Convert wide data to long
    nodes = data.map(function (d) {
        node = {
            "id": +d.id,
            "full_name": d.full_name,
            "party": d.Party,
            "gender": d.is_female == 1 ? "Female" : "Male"
        };
        Object.keys(d)
            .forEach(function (key) {
                if (key != "id" & key != "full_name" & key != "Party" & key != "is_female") {
                    node[key] = d[key] == '-inf' ? 0 : 10 ** (+d[key])
                }
            })
        return node
    })

    var nodes_male = nodes.filter(d => d.gender == "Male").sort((a,b) => a[topic_name] - b[topic_name]);
    var nodes_female = nodes.filter(d => d.gender != "Male").sort((a,b) => a[topic_name] - b[topic_name]);

    simulation_male = d3.forceSimulation(nodes_male)
        .force("x", d3.forceX(function (d) {
                return x(0);
            })
            .strength(0.004))
        .force("y", d3.forceY(function (d) {
                // return y(d[topic_name]);
                    return y(Math.round(d[topic_name]/(2*node_radius/(y(0)-y(1))))*(2*node_radius/(y(0)-y(1))));
            })
            .strength(1))
        .force("collide",
            d3.forceCollide()
            .radius(node_radius)
            .strength(2)
            .iterations(5))
        // .alphaMin(0.000000001)
        // .velocityDecay(0.1)

    simulation_female = d3.forceSimulation(nodes_female)
        .force("x", d3.forceX(function (d) {
                return x(0);
            })
            .strength(0.01))
        .force("y", d3.forceY(function (d) {
                // return y(d[topic_name]);
                    return y(Math.round(d[topic_name]/(2*node_radius/(y(0)-y(1))))*(2*node_radius/(y(0)-y(1))));
            })
            .strength(1))
        .force("collide",
            d3.forceCollide()
            .strength(2)
            .radius(node_radius)
            .iterations(5))
        // .alphaMin(0.000000001)
        // .velocityDecay(0.1)

            // compute beeswarm arrangement
            var swarm = d3beeswarm.beeswarm()
                .data(nodes_male)
                .radius(node_radius*1.)
                .orientation("vertical")
                .side("positive")
                .distributeOn(function(d) {

                    // return y(d[topic_name])
                    return y(Math.round(d[topic_name]/(2*node_radius/(y(0)-y(1))))*(2*node_radius/(y(0)-y(1))));
                })

            var beeswarmArrangement = swarm.arrange();

            nodes_male = beeswarmArrangement.map(d => {
                d.datum.x = x(0) - d.x - node_radius
                d.datum.y = d.y

                return d.datum
            })

            var swarm = d3beeswarm.beeswarm()
                .data(nodes_female)
                .radius(node_radius)
                .orientation("vertical")
                .side("negative")
                .distributeOn(function(d) {
                    // return y(d[topic_name]);
                    return y(Math.round(d[topic_name]/(2*node_radius/(y(0)-y(1))))*(2*node_radius/(y(0)-y(1))));
                })

            var beeswarmArrangement = swarm.arrange();

            nodes_female = beeswarmArrangement.map(d => {
                d.datum.x = x(0) - d.x - node_radius
                d.datum.y = d.y

                return d.datum
            })

    simulation_male.on("tick", function () {
        nodes_male.map(function (d) {
                    node_y = y(Math.round(d[topic_name]/(2*node_radius/(y(0)-y(1))))*(2*node_radius/(y(0)-y(1))))
                    d.x = Math.min(d.x, x(0) - node_radius)
                    d.y = Math.min(node_y + node_radius * 6, Math.max(node_y - node_radius * 6, d.y))
                    d.y = Math.min(y(0), d.y)
        })
    })

    simulation_female.on("tick", function () {
        nodes_female.map(function (d) {
                    d.x = Math.max(x(0) + node_radius, d.x)
                    node_y = y(Math.round(d[topic_name]/(2*node_radius/(y(0)-y(1))))*(2*node_radius/(y(0)-y(1))))
                    d.y = Math.min(node_y + node_radius * 6, Math.max(node_y - node_radius * 6, d.y))
                    d.y = Math.min(y(0), d.y)
        })
    })

    simulation_male.on("end", function () {
        nodes = nodes_male.concat(nodes_female)
        process.stdout.write(
                `id,${topic_name}_x,${topic_name}_y\n` + nodes.map(node => [node.id,
                    ((node.x - x(0)) / node_radius),
                    y.invert(node.y)*100
                ])
                .join("\n"),
            );
    })
})
