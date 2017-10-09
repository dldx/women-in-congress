const D3Node = require('d3-node');
const d3 = require('d3')
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
var d3n = new D3Node();

// Get topic name from command line argument
topic_name = process.argv[2]

var topics = [topic_name]
var x = d3.scalePoint()
    .domain(topics)
    .range([0 + width / 4, width * 3 / 4]);

var y = d3.scaleLinear()
    .domain([0, 0.3])
    .range([height, 0]);

fs.readFile("data.csv", "utf-8", function (error, data) {
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

    var nodes_male = nodes.filter(d => d.gender == "Male");
    var nodes_female = nodes.filter(d => d.gender != "Male");

    simulation_male = d3.forceSimulation(nodes_male)
        .force("x", d3.forceX(function (d) {
                return x(topic_name);
            })
            .strength(0.1))
        .force("y", d3.forceY(function (d) {
                return y(d[topic_name]);
            })
            .strength(1))
        .force("collide",
            d3.forceCollide(10.0)
            .radius(2)
            .iterations(20))
        .alphaMin(0.000000001)
        .velocityDecay(0.1)

    simulation_female = d3.forceSimulation(nodes_female)
        .force("x", d3.forceX(function (d) {
                return x(topic_name);
            })
            .strength(0.1))
        .force("y", d3.forceY(function (d) {
                return y(d[topic_name]);
            })
            .strength(1))
        .force("collide",
            d3.forceCollide(10.0)
            .radius(2)
            .iterations(20))
        .alphaMin(0.000000001)
        .velocityDecay(0.1)

    // Set default positions for nodes
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
    nodes_male.map(function (d) {
        d.x = x(topic_name) + getRandomInt(0, -20)
        node_y = y(d[topic_name])
        d.y = Math.min(node_y + node_radius * 2, Math.max(node_y - node_radius * 2, d.y))
    })
    nodes_female.map(function (d) {
        d.x = x(topic_name) + getRandomInt(0, 20)
        node_y = y(d[topic_name])
        d.y = Math.min(node_y + node_radius * 2, Math.max(node_y - node_radius * 2, d.y))
    })

    simulation_male.on("tick", function () {
        nodes_male.map(function (d) {
            d.x = Math.min(d.x, x(topic_name) - node_radius)
            node_y = y(d[topic_name])
            d.y = Math.min(node_y + node_radius * 2, Math.max(node_y - node_radius * 2, d.y))
            d.y = Math.min(y(0), d.y)
        })
    })

    simulation_female.on("tick", function () {
        nodes_female.map(function (d) {
            d.x = Math.max(x(topic_name) + node_radius, d.x)
            node_y = y(d[topic_name])
            d.y = Math.min(node_y + node_radius * 2, Math.max(node_y - node_radius * 2, d.y))
            d.y = Math.min(y(0), d.y)
        })
    })

    simulation_male.on("end", function () {
        nodes = nodes_male.concat(nodes_female)
        process.stdout.write(
                `id,${topic_name}_x,${topic_name}_y\n` + nodes.map(node => [node.id,
                    ((node.x - x(topic_name)) / node_radius).toFixed(5),
                    y.invert(node.y).toFixed(5)
                ])
                .join("\n"),
            );
    })
})
