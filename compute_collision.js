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
var d3n = new D3Node();

var topics = ["Male", "Female"]
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

    // nodes = nodes.filter(node => ["welfare reforms"].indexOf(node.topic_name) >= 0)
    topic_name = "welfare reforms";

    simulation = d3.forceSimulation(nodes)
        .force("x", d3.forceX(function (d) {
                return x(d.gender);
            })
            .strength(0.1))
        .force("collide",
            d3.forceCollide(1.0)
            .radius(2)
            .iterations(10))
        .on("tick", function () {
            nodes.map(function (d) {
                node_y = y(d[topic_name])
                d.y = Math.min(node_y + 2.5, Math.max(node_y - 2.5, d.y))
            })
        })
    .stop();

    for (var i = 0; i < 50; ++i) simulation.tick()

    simulation.on("end", function () {
        require('fs')
            .writeFile(
                './baked_positions.csv',
                nodes.map(node => [node.id,
                    node.x.toFixed(5),
                    // node["welfare reforms"],
                    y.invert(node.y)
                    .toFixed(5)
                ])
                .join("\n"),

                function (err) {
                    if (err) {
                        console.error('Crap happens');
                    }
                }
            );
    })
})
