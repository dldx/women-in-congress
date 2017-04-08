var margin = {
    top: 60,
    right: 50,
    bottom: 60,
    left: 100
};

var colors = {
    "Lab": "#C61148",
    "Con": "#0096DB",
    "SNP": "#FCCA46",
    "Lib Dem": "#F37A48",
    "LD": "#F37A48",
    "Green": "#A1C181",
    "SF": "#008e4b",
    "Other": "#50514F",
    "Hover": "#e5e5e5",
}

var partyHasSVG = Object.keys(colors);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function render(data_timeline, data_total_women_mps, data_total_mps) {
    var lineThickness = 0.0018 * height;
    var circleRadius = lineThickness;

    // Min and max dates
    data_timeline.minDate = d3.min(data_timeline, function (d) {
        return d.term_start;
    });
    data_timeline.maxDate = d3.max(data_timeline, function (d) {
        return d.term_end;
    });

    var x = d3.scaleTime()
        .domain([new Date(1915, 01, 01), new Date(2020, 01, 01)])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data_timeline, function (d) {
            return d.stream;
        })])
        .range([height, 0]);

    // Enter
    // Wrapper that contains the whole graph
    var wrapper = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Bounding box to clip points so that they aren't visible outside the chart area
    var boundingBox = wrapper
        .append("rect")
        .attr("opacity", 0.0)
        .attr("width", width)
        .attr("height", height)

    var stage = 1
    // Tooltip details
    var tooltip = d3.tip()
        .attr("class", "d3-tip")
        // .offset([-10, 0])
        .direction('s')
        .html(function (d) {
            if (partyHasSVG.indexOf(d.party) != -1) {
                partySVG = 0
            } else {
                partySVG = 1
            }
            return `<h1 style="background-color: ${colorParty(d.party)};">${d.name}</h1><div class="mp-term">${d3.timeFormat("%Y")(d.term_start)} &rarr; \
            ${d3.timeFormat("%Y")(d.term_end)}</div><div class="mp-party" style="opacity: ${partySVG}">${d.party}</div><div class="mp-constituency">${d.constituency}</div>
            <svg role="img"><title>${d.party}</title><use xlink:href="./party_logos/party_logos.svg#${d.party}"/></svg>`;
        })

    wrapper.call(tooltip);

    var clippedArea = wrapper.append("g")
        .attr("id", "clippedArea")
        .attr("clip-path", "url(#clip)")


    var pointsGroup = clippedArea
        .append("g")
        .attr("id", "points")

    wrapper.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);


    var xAxis = d3.axisBottom(x)
    var gX = wrapper.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var yAxis = d3.axisLeft(y)
    var gY = wrapper.append("g")
        .attr("class", "y-axis")
        // .attr("opacity", 0)
        .call(yAxis);

    // Tooltip target location
    var target = wrapper
        .append("circle")
        .attr("id", "target-loc")
        .attr("cx", Math.max(100, margin.left + 0.2 * width))
        .attr("cy", 0.1 * height)
        .attr("r", 5)
        .attr("opacity", 0)
        .node()

    // Curve to show max number of MPs over time
    var max_mps_line = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d.total_mps)
        })
        .curve(d3.curveBasis)

    var max_mps_path = pointsGroup.append("path")
        .datum(data_total_mps)
        .attr("fill", "none")
        .attr("stroke", colors["Hover"])
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", max_mps_line);

    // define the area
    var max_mps_area = d3.area()
        .curve(d3.curveBasis)
        .x(function (d) {
            return x(d.year);
        })
        .y0(height)
        .y1(function (d) {
            return y(d.total_mps);
        });

    // add the area path
    var max_mps_path_area = pointsGroup.append("path")
        .data([data_total_mps])
        .attr("class", "area")
        .attr("d", max_mps_area)
        .attr("fill", colors["Lab"])
        .attr("opacity", 0)

        // 50% line
        var half_max_mps_line = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d.total_mps/2)
        })
        .curve(d3.curveBasis)

        var half_max_mps_path = pointsGroup.append("path")
        .datum(data_total_mps)
        .attr("fill", "none")
        .attr("stroke", colors["Hover"])
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "5,10")
        .attr("d", half_max_mps_line);

    // Curve to show total number of women MPs over time
    var total_women_mps_line = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d.total_women_mps)
        })
        .curve(d3.curveBasis)

    // define the area
    var total_women_mps_area = d3.area()
        .curve(d3.curveBasis)
        .x(function (d) {
            return x(d.year);
        })
        .y0(height)
        .y1(function (d) {
            return y(d.total_women_mps);
        });

    // add the area path
    var total_women_mps_path_area = pointsGroup.append("path")
        .data([data_total_women_mps])
        .attr("class", "area")
        .attr("d", total_women_mps_area)
        .attr("fill", colors["Hover"])
        .attr("opacity", 0)

    // add the line path
    var total_women_mps_path = pointsGroup.append("path")
        .datum(data_total_women_mps)
        .attr("fill", "none")
        .attr("stroke", colors["Hover"])
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5 * circleRadius)
        .attr("d", total_women_mps_line)
        .attr("stroke-dasharray", function (d) {
            return this.getTotalLength()
        })
        .attr("stroke-dashoffset", function (d) {
            return this.getTotalLength()
        })
    // .attr("opacity", 0)

    var instance = pointsGroup
        .selectAll("g")
        .data(data_timeline)
        .enter()
        .append("g")

    // Add line connecting start and end of term
    instance
        .append("line")
        .attr("class", "line-connect")
        .style("stroke-width", lineThickness)
    // Add circle for start and end
    instance
        .append("circle")
        .attr("r", circleRadius)
        .attr("class", "term-start")

    instance
        .append("circle")
        .attr("r", circleRadius)
        .attr("class", "term-end")

    // Use a hidden rect to catch mouseovers more easily
    instance
        .append("rect")
        .attr("class", "hover-rect")
        .attr("opacity", 0)

    function colorParty(party) {
        if (colors[party] != undefined) {
            return colors[party];
        } else {
            return colors["Other"];
        }
    }

    // Update
    instance.selectAll(".line-connect")
        .attr("x1", function (d) {
            return x(d.term_start)
        })
        .attr("x2", function (d) {
            return x(d.term_end)
        })
        .attr("y1", function (d) {
            return y(d.stream)
        })
        .attr("y2", function (d) {
            return y(d.stream)
        })
        .attr("stroke", function (d) {
            return colorParty(d.party);
        })

    instance.selectAll(".term-start")
        .attr("cx", function (d) {
            return x(d.term_start)
        })
        .attr("cy", function (d) {
            return y(d.stream)
        })
        .attr("fill", function (d) {
            return colorParty(d.party);
        })

    instance.selectAll(".term-end")
        .attr("cx", function (d) {
            return x(d.term_end)
        })
        .attr("cy", function (d) {
            return y(d.stream)
        })
        .attr("fill", function (d) {
            return colorParty(d.party);
        })

    instance.selectAll(".hover-rect")
        .attr("x", function (d) {
            return x(d.term_start) - circleRadius / 2
        })
        .attr("y", function (d) {
            return y(d.stream) - (y(1) - y(2)) / 2
        })
        .attr("width", function (d) {
            return x(d.term_end) - x(d.term_start) + circleRadius
        })
        .attr("height", y(1) - y(2))

    instance
        .on("mouseover", stage == 1 ? function (d) {
            tooltip.show(d, target)
            // d3.select(this)
            //     .selectAll(".line-connect").attr("stroke", colors["Hover"])
            // d3.select(this)
            //     .selectAll(".term-start").attr("fill", colors["Hover"])
            // d3.select(this)
            //     .selectAll(".term-end").attr("fill", colors["Hover"])
            pointsGroup.selectAll("g")
                .attr("opacity", function (a) {
                    return (d.clean_name == a.clean_name) ? 1.0 : 0.5
                })
            pointsGroup.selectAll(".line-connect")
                .style("stroke-width", function (a) {
                    return (d.clean_name == a.clean_name) ? 2 * lineThickness : lineThickness
                })
            pointsGroup.selectAll(".term-start")
                .attr("r", function (a) {
                    return (d.clean_name == a.clean_name) ? 1.5 * circleRadius : circleRadius
                })
            pointsGroup.selectAll(".term-end")
                .attr("r", function (a) {
                    return (d.clean_name == a.clean_name) ? 1.5 * circleRadius : circleRadius
                })
        } : null)
        .on("click", stage == 1 ? function (d) {
            pointsGroup.selectAll("g")
                .attr("opacity", function (a) {
                    return (d.party == a.party) ? 1.0 : 0.1
                })
            tooltip.hide()
            bisect = d3.bisector(function (a) {
                return a.year
            }).left
            pointsGroup.selectAll(".line-connect")
                .transition()
                .duration(1000)
                .attr("x2", function (a) {
                    return x(a.term_start)
                })
                //.attr("opacity", 0)
                .style("stroke-width", function (a) {
                    return (d.party == a.party) ? 2 * lineThickness : lineThickness
                })
            pointsGroup.selectAll(".term-start")
                // .attr("r", function (a) {
                //     return (d.party == a.party) ? 1.5 * circleRadius : circleRadius
                // })
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("cx", function (a) {
                    return x(data_total_women_mps[bisect(data_total_women_mps, a.term_start)].year)
                })
                .attr("cy", function (a) {
                    return y(data_total_women_mps[bisect(data_total_women_mps, a.term_start)].total_women_mps)
                })
                .attr("opacity", 0)
            pointsGroup.selectAll(".term-end")
                // .attr("r", function (a) {
                //     return (d.party == a.party) ? 1.5 * circleRadius : circleRadius
                // })
                .transition()
                .duration(1000)
                .attr("cx", function (a) {
                    return x(a.term_start)
                })
                .transition()
                .attr("r", function (a) {
                    return 3 * circleRadius
                })
                .attr("cy", function (a) {
                    return y(data_total_women_mps[bisect(data_total_women_mps, a.term_start)].total_women_mps)
                })
                .transition()
                .delay(3000)
                .attr("r", 0)

            total_women_mps_path
                .transition()
                .delay(2000)
                .duration(500)
                .transition()
                .ease(d3.easeCubic)
                .duration(3000)
                .attr("stroke-dashoffset", 0)

            y.domain([0, 800])

            gY
            .transition()
                .delay(6000)
                .duration(2000)
                .call(yAxis)
            total_women_mps_path
                .transition()
                .delay(6000)
                .duration(2000)
                .attr("d", total_women_mps_line)

            total_women_mps_path_area
            .transition()
                .delay(6000)
                .duration(2000)
                .attr("d", total_women_mps_area)
                .attr("opacity", 1)

            max_mps_path
            .transition()
                .delay(6000)
                .duration(2000)
                .attr("d", max_mps_line)

            max_mps_path_area
            .transition()
                .delay(6000)
                .duration(2000)
                .attr("d", max_mps_area)
                .attr("opacity", 1)
            half_max_mps_path
            .transition()
                .delay(6000)
                .duration(2000)
                .attr("d", half_max_mps_line)

            var stage = 2

        } : null)
        .on("mouseout", stage == 1 ? function (d) {
            // d3.select(this)
            //     .transition()
            //     .duration(500)
            //     .selectAll(".line-connect").attr("stroke", colorParty(d.party))
            // d3.select(this)
            //     .transition()
            //     .duration(500)
            //     .selectAll(".term-start").attr("fill", colorParty(d.party))
            // d3.select(this)
            //     .transition()
            //     .duration(500)
            //     .selectAll(".term-end").attr("fill", colorParty(d.party))
            pointsGroup.selectAll("g")
                .attr("opacity", 1.0)
            pointsGroup.selectAll(".line-connect")
                .style("stroke-width", lineThickness)
            pointsGroup.selectAll(".term-start")
                .attr("r", circleRadius)
            pointsGroup.selectAll(".term-end")
                .attr("r", circleRadius)
        } : null);

    wrapper.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Women MPs in the House of Commons")

    // Zoom
    var zoom = d3.zoom()
        .scaleExtent([0.98, 40])
        .on("zoom", zoomed);
    //wrapper.call(zoom);
    svg.call(zoom);

    function zoomed() {
        pointsGroup.attr("transform", d3.event.transform)
        gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    }
    // Exit
    instance.exit().remove();
}


// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};
d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

var timeline = document.getElementById("timeline")
var svg = d3.select(timeline).append("svg")

function draw_graph() {
    d3.selectAll("g").remove()
    d3.select(".d3-tip").remove()
    // Chart dimensions - use parent div size
    width = timeline.clientWidth - margin.left - margin.right,
        height = timeline.clientHeight - margin.top - margin.bottom;
    svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    d3.queue()
        .defer(d3.csv, "mps_over_time.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d");
            return {
                name: d.name,
                constituency: d.constituency,
                term_start: parseDate(d.term_start),
                term_end: parseDate(d.term_end),
                party: d.party,
                byelection: (d.byelection == "TRUE"),
                notes: d.notes,
                clean_name: d.clean_name,
                stream: +d.stream
            };
        })
        .defer(d3.csv, "number_women_over_time.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d");
            return {
                year: parseDate(d.Year),
                total_women_mps: +d.Total,
                total_mps: +d.total_mps
            }
        })
        .defer(d3.csv, "total_mps_over_time.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d");
            return {
                year: parseDate(d.Year),
                total_mps: +d.total_mps
            }
        })
        .await(analyze);

    function analyze(error, mps_over_time, number_women_over_time, total_mps_over_time) {
        render(mps_over_time, number_women_over_time, total_mps_over_time)
    };
}
draw_graph()
window.addEventListener('resize', draw_graph);
