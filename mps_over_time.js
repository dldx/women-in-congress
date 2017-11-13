// ----------------------------------------------------------------------------
// ██╗    ██╗ ██████╗ ███╗   ███╗███████╗███╗   ██╗    ██╗███╗   ██╗    ██████╗  █████╗ ██████╗ ██╗     ██╗ █████╗ ███╗   ███╗███████╗███╗   ██╗████████╗
// ██║    ██║██╔═══██╗████╗ ████║██╔════╝████╗  ██║    ██║████╗  ██║    ██╔══██╗██╔══██╗██╔══██╗██║     ██║██╔══██╗████╗ ████║██╔════╝████╗  ██║╚══██╔══╝
// ██║ █╗ ██║██║   ██║██╔████╔██║█████╗  ██╔██╗ ██║    ██║██╔██╗ ██║    ██████╔╝███████║██████╔╝██║     ██║███████║██╔████╔██║█████╗  ██╔██╗ ██║   ██║
// ██║███╗██║██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║    ██║██║╚██╗██║    ██╔═══╝ ██╔══██║██╔══██╗██║     ██║██╔══██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║
// ╚███╔███╔╝╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║    ██║██║ ╚████║    ██║     ██║  ██║██║  ██║███████╗██║██║  ██║██║ ╚═╝ ██║███████╗██║ ╚████║   ██║
//  ╚══╝╚══╝  ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝    ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// A visualization celebrating women MPs in the UK House of Commons
//
// by Durand D'souza
//
// https://github.com/dldx/women-in-parliament
//
// ----------------------------------------------------------------------------
//
//  ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗         ██╗   ██╗ █████╗ ██████╗ ██╗ █████╗ ██████╗ ██╗     ███████╗███████╗
// ██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║         ██║   ██║██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗██║     ██╔════╝██╔════╝
// ██║  ███╗██║     ██║   ██║██████╔╝███████║██║         ██║   ██║███████║██████╔╝██║███████║██████╔╝██║     █████╗  ███████╗
// ██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║         ╚██╗ ██╔╝██╔══██║██╔══██╗██║██╔══██║██╔══██╗██║     ██╔══╝  ╚════██║
// ╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗     ╚████╔╝ ██║  ██║██║  ██║██║██║  ██║██████╔╝███████╗███████╗███████║
//  ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝      ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚══════╝
// ----------------------------------------------------------------------------

// These are the margins for the SVG
var margin = {
    top: 60,
    right: 50,
    bottom: 60,
    left: 100
}

// These are the colours used to identify each political party as well as
// a few additional functions
var colors = {
    "Lab": "#C61148",
    "Con": "#0096DB",
    "SNP": "#FCCA46",
    "Lib Dem": "#F37A48",
    "LD": "#F37A48",
    "Green": "#A1C181",
    "SF": "#008e4b",
    "Other": "#50514F", // Used as fallback when no party colour has been defined
    "Hover": "#e5e5e5", // Used when hovering over an item
    "Active": "#A1C181" // Used for the active slide on the tracker
}

// Track the current and desired slides for transitioning
var new_slide = 0
var current_slide = -1
var partyToggled = false
var lastTransitioned = -1

// These are the labels for each slide
var tracker_data = [
    { section: "1" },
    { section: "2" },
    { section: "3" },
    { section: "4" },
    { section: "5" },
    { section: "6" }
]

// ----------------------------------------------------------------------------
// FIND TIMELINE DIV AND ADD SVG
// ----------------------------------------------------------------------------
var timeline = document.getElementById("timeline")
var svg = d3.select(timeline)
    .append("svg")


var width = 0,
    height = 0

var clippedArea,
    electionRects,
    zoom,
    zoomedArea,
    pointsGroup,
    slide2Group,
    instance,
    x, y,
    xAxis, gX,
    yAxis, gY,
    tooltip,
    lineThickness,
    circleRadius,
    mps_over_time_data,
    number_women_over_time_data,
    total_mps_over_time_data,
    mp_base64_data,
    info_bubbles_data

// If a political party has a colour defined,
// then it also has an SVG logo that we can use
var partyHasLogo = Object.keys(colors)


// ----------------------------------------------------------------------------
// WHEN SUPPLIED WITH PARTY ACRONYM, RETURN PARTY COLOUR OR FALLBACK
// IF PARTY ISN'T FOUND
// ----------------------------------------------------------------------------
function colorParty(party) {
    "use strict"
    if (colors[party] !== undefined) {
        return colors[party]
    }
    return colors.Other
}

// ----------------------------------------------------------------------------
// FORMAT DATE AS Jan 2016
// ----------------------------------------------------------------------------
function formatDate(date) {
    "use strict"
    var monthNames = [
            "Jan", "Feb", "March",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sept", "Oct",
            "Nov", "Dec"
        ],
        monthIndex = date.getMonth(),
        year = date.getFullYear()

    return monthNames[monthIndex] + " " + year
}

// ----------------------------------------------------------------------------
// RESET THE GRAPH IF ZOOMED IN AND REMOVE ANY EVENT CALLBACKS
// ----------------------------------------------------------------------------
function reset_zoom(callback) {
    "use strict"
    svg.transition()
        .duration(500)
        .call(zoom.transform, d3.zoomIdentity)
        .on("end", () => {
            zoomedArea.attr("transform", null)
            zoom.on("zoom", null)
            svg.on("wheel.zoom", null)
                .on("wheel.zoom", null)
                .on("mousedown.zoom", null)
                .on("dblclick.zoom", null)
                .on("touchstart.zoom", null)
                .on("touchmove.zoom", null)
                .on("touchend.zoom touchcancel.zoom", null)

            // Add the y axis to the left of the graph
            yAxis = d3.axisLeft(y)
            gY = d3.select(".y-axis")
                .call(yAxis)
            callback()
        })
}
// ----------------------------------------------------------------------------
// UPDATE GRAPH WHEN USER MOVES TO A NEW SLIDE
// ----------------------------------------------------------------------------
function update_state() {
    "use strict"
    // Only update if we are actually changing states
    if (current_slide != new_slide) {
        // Go from slide 0 to slide 1
        if (current_slide == 0 & new_slide == 1) {
            // Reset zoom, then load second slide
            reset_zoom(to_second_slide)
        } else if (current_slide != -1 & new_slide == 0) {
            // Add zoom capabilities for the points
            zoom.on("zoom", zoomed)
            svg.call(zoom)
            to_first_slide()
        }
        current_slide = new_slide
    }
    // Lastly update the hexagon tracker colours
    d3.selectAll(".arc")
        .classed("c-1", function (a) {
            return a.index % 2 == 0
        })
        .classed("c-2", function (a) {
            return a.index % 2 == 1
        })
        .classed("active", function (a) {
            return a.index == current_slide
        })
}

// ----------------------------------------------------------------------------
// ██╗███╗   ██╗██╗████████╗██╗ █████╗ ██╗     ██╗███████╗███████╗    ██╗  ██╗███████╗██╗  ██╗ █████╗  ██████╗  ██████╗ ███╗   ██╗
// ██║████╗  ██║██║╚══██╔══╝██║██╔══██╗██║     ██║██╔════╝██╔════╝    ██║  ██║██╔════╝╚██╗██╔╝██╔══██╗██╔════╝ ██╔═══██╗████╗  ██║
// ██║██╔██╗ ██║██║   ██║   ██║███████║██║     ██║███████╗█████╗      ███████║█████╗   ╚███╔╝ ███████║██║  ███╗██║   ██║██╔██╗ ██║
// ██║██║╚██╗██║██║   ██║   ██║██╔══██║██║     ██║╚════██║██╔══╝      ██╔══██║██╔══╝   ██╔██╗ ██╔══██║██║   ██║██║   ██║██║╚██╗██║
// ██║██║ ╚████║██║   ██║   ██║██║  ██║███████╗██║███████║███████╗    ██║  ██║███████╗██╔╝ ██╗██║  ██║╚██████╔╝╚██████╔╝██║ ╚████║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚══════╝╚══════╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝
// TRACKER TO IDENTIFY AND SWITCH BETWEEN SLIDES
// ----------------------------------------------------------------------------
function initialise_tracker() {
    "use strict"
    var tracker_outer_radius = 30
    var tracker_inner_radius = 0
    d3.select(".tracker")
        .remove()
    var tracker_div = d3.select("body")
        .append("div")
        .attr("class", "tracker")

    // Prev button
    tracker_div
        .append("button")
        .attr("type", "button")
        .attr("class", "nav-prev")
        .text("Prev")
        .on("click", function () {
            new_slide = Math.max(0, current_slide - 1)
            update_state()
        })
    // Tracker hexagon wrapper
    var tracker_wrapper = tracker_div
        .append("svg")
        .append("g")
        .attr("class", "tracker-wrapper")
        .attr("transform", `translate(${tracker_outer_radius},${tracker_outer_radius})`)

    // Next button
    tracker_div
        .append("button")
        .attr("type", "button")
        .attr("class", "nav-next")
        .text("Next")
        .on("click", function () {
            new_slide = Math.min(tracker_data.length - 1, current_slide + 1)
            update_state()
        })

    var pie = d3.pie()
        .value(1) // Same fraction for every slice

    var path = d3.arc()
        .outerRadius(tracker_outer_radius)
        .innerRadius(tracker_inner_radius)

    var labels = d3.arc()
        .outerRadius(tracker_outer_radius)
        .innerRadius(tracker_inner_radius)

    var arcGroup = tracker_wrapper.selectAll(".arc")
        .data(pie(tracker_data))
        .enter()
        .append("g")
        .attr("class", "arc")

    arcGroup
        .append("path")
        .attr("d", path)

    arcGroup
        .append("text")
        .attr("transform", function (d) { return "translate(" + labels.centroid(d) + ")" })
        .text(function (d) { return d.data.section })

    arcGroup
        .on("mouseover", function () {
            d3.select(this)
                .classed("hover", true)
        })
        .on("mouseout", function () {
            d3.select(this)
                .classed("hover", false)
            update_state()
        })
        .on("click", function (d) {
            new_slide = d.index
            update_state()
        })
    update_state()

    ///////////////////////////////////////////////////////////////////////////
    /////////////////////// Hexagon ///////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var SQRT3 = Math.sqrt(3),
        hexRadius = tracker_outer_radius,
        hexagonPoly = [
            [0, -1],
            [SQRT3 / 2, 0.5],
            [0, 1],
            [-SQRT3 / 2, 0.5],
            [-SQRT3 / 2, -0.5],
            [0, -1],
            [SQRT3 / 2, -0.5]
        ]
    var hexagonPath = "m" + hexagonPoly.map(function (p) {
        return [p[0] * hexRadius, p[1] * hexRadius].join(",")
    })
        .join("l") + "z"

    //Place a hexagon on the scene
    tracker_wrapper.append("path")
        .attr("class", "tracker-hexagon")
        .attr("d", hexagonPath)


    tracker_wrapper.append("clipPath")
        .attr("id", "hex-mask")
        .append("path")
        .attr("fill", "none")
        .attr("d", hexagonPath)

    // Attach hexagon clip mask to tracker wrapper
    d3.select(".tracker-wrapper")
        .attr("clip-path", "url(#hex-mask)")
}

// ----------------------------------------------------------------------------
// ██╗███╗   ██╗██╗████████╗██╗ █████╗ ██╗     ██╗███████╗███████╗    ██╗   ██╗██╗███████╗██╗   ██╗ █████╗ ██╗     ██╗███████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
// ██║████╗  ██║██║╚══██╔══╝██║██╔══██╗██║     ██║██╔════╝██╔════╝    ██║   ██║██║██╔════╝██║   ██║██╔══██╗██║     ██║╚══███╔╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
// ██║██╔██╗ ██║██║   ██║   ██║███████║██║     ██║███████╗█████╗      ██║   ██║██║███████╗██║   ██║███████║██║     ██║  ███╔╝ ███████║   ██║   ██║██║   ██║██╔██╗ ██║
// ██║██║╚██╗██║██║   ██║   ██║██╔══██║██║     ██║╚════██║██╔══╝      ╚██╗ ██╔╝██║╚════██║██║   ██║██╔══██║██║     ██║ ███╔╝  ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
// ██║██║ ╚████║██║   ██║   ██║██║  ██║███████╗██║███████║███████╗     ╚████╔╝ ██║███████║╚██████╔╝██║  ██║███████╗██║███████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚══════╝╚══════╝      ╚═══╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
// CREATE AXES, SCALES, ZOOM REGION, TRACKER, TOOLTIP
// ----------------------------------------------------------------------------
function initial_render() {
    "use strict"
    // INITIALISE THE X AND Y AXIS SCALES AND RANGES
    x = d3.scaleTime()
        .domain([new Date(1915, 1, 1), new Date(2020, 1, 1)])
        .range([0, width])

    y = d3.scaleLinear()
        .domain([0, 210]) // Almost 210 MPs by 2020
        .range([height, 0])

    svg.append("defs")
    // Add the group wrapper that contains the whole graph
    var wrapper = svg
        .append("g")
        .attr("class", "timeline-wrapper")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Initialise the hexagon tracker that tracks the state of the graph
    initialise_tracker()

    // Initialise info bubble
    d3.select("#tooltip")
        .remove()
    d3.select("#timeline")
        .append("div")
        .attr("id", "tooltip")
    tooltip = document.getElementById("tooltip")

    // Add a bounding box to clip points so that they aren't visible outside
    // the chart area when we zoom in
    wrapper
        .append("rect")
        .style("opacity", 0.0)
        .attr("width", width)
        .attr("height", height)

    // Add a group and clip it to a rectangle defined below
    clippedArea = wrapper.append("g")
        .attr("id", "clippedArea")
        .attr("clip-path", "url(#clip)")

    // Add a zoom area to hold all other groups
    zoomedArea = clippedArea
        .append("g")
        .attr("id", "zoomed-area")

    // Create the clip rectangle used for the graph
    wrapper.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)

    // Add the x axis to the bottom of the graph
    xAxis = d3.axisBottom(x)
    gX = wrapper.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    // Add the y axis to the left of the graph
    yAxis = d3.axisLeft(y)
    gY = wrapper.append("g")
        .attr("class", "y-axis")
        .call(yAxis)

    // Add chart title
    wrapper.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Women MPs in the House of Commons")

    // Add axes labels
    wrapper.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom / 2)
        .attr("class", "x-label")
        .text("Time")

    wrapper.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left / 2)
        .attr("x", 0 - (height / 2))
        .attr("class", "y-label")
        .text("Number of MPs")

    // Add zoom capabilities for the points
    zoom = d3.zoom()
        .scaleExtent([0.95, 40])
        .on("zoom", zoomed)
    svg.call(zoom)

}

// ----------------------------------------------------------------------------
// ZOOM function
// ----------------------------------------------------------------------------
function zoomed() {
    "use strict"
    zoomedArea.attr("transform", d3.event.transform)
    gX.call(xAxis.scale(d3.event.transform.rescaleX(x)))
    gY.call(yAxis.scale(d3.event.transform.rescaleY(y)))
}

// ----------------------------------------------------------------------------
// FUNCTIONS TO MOVE OBJECTS TO FRONT AND BACK
// https://github.com/wbkd/d3-extended
// ----------------------------------------------------------------------------
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this)
    })
}
d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild)
        }
    })
}

// ----------------------------------------------------------------------------
// ███████╗██╗██████╗ ███████╗████████╗    ███████╗██╗     ██╗██████╗ ███████
// ██╔════╝██║██╔══██╗██╔════╝╚══██╔══╝    ██╔════╝██║     ██║██╔══██╗██╔════
// █████╗  ██║██████╔╝███████╗   ██║       ███████╗██║     ██║██║  ██║█████╗
// ██╔══╝  ██║██╔══██╗╚════██║   ██║       ╚════██║██║     ██║██║  ██║██╔══╝
// ██║     ██║██║  ██║███████║   ██║       ███████║███████╗██║██████╔╝███████
// ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝       ╚══════╝╚══════╝╚═╝╚═════╝ ╚══════
// ALL WOMEN MPS OVER TIME
// ----------------------------------------------------------------------------
function first_slide() {
    "use strict"
    d3.select("#slide1-group")
        .remove()
    d3.select("#election-rects")
        .remove()

    // Add rectangles in the background to identify parliamentary terms
    electionRects = zoomedArea
        .append("g")
        .attr("id", "election-rects")
        .selectAll("rect")
        .data(total_mps_over_time_data)
        .enter()
        .append("rect")
        .attr("class", "election-rect")
        .classed("c-1", function (d, i) {
            return i % 2 == 0
        })
        .classed("c-2", function (d, i) {
            return i % 2 == 1
        })
        .attr("x", function (d) {
            return x(d.year)
        })
        .attr("y", y(800))
        .attr("width", function (d, i) {
            var first_election = d.year
            var second_election = total_mps_over_time_data[Math.min(total_mps_over_time_data.length - 1, i + 1)].year
            return x(second_election) - x(first_election)
        })
        .attr("height", y(0) - y(2000)) // height of rectangle is one unit of the y axis

    // Add the points group that will hold all our data points
    pointsGroup = zoomedArea
        .append("g")
        .attr("id", "slide1-group")
    // Add a group to contain each data point and bind to timeline data
    instance = pointsGroup
        .selectAll("g")
        .data(mps_over_time_data)
        .enter()
        .append("g")

    // Add a line connecting start and end of term
    instance
        .append("line")
        .attr("class", "line-connect")
        .style("stroke-width", lineThickness)
        .style("stroke-linecap", "round")

    // Use a hidden rect to catch mouseovers more easily (similar to voronoi mouseover grid)
    instance
        .append("rect")
        .attr("class", "hover-rect")
        .style("opacity", 0)

    // For each MP line, set position and stroke colour
    instance.selectAll(".line-connect")
        .attr("x1", function (d) {
            return x(d.term_start)
        })
        .attr("x2", function (d) {
            return x(d.term_end) - lineThickness * 1.2
        })
        .attr("y1", function (d) {
            return y(d.stream)
        })
        .attr("y2", function (d) {
            return y(d.stream)
        })
        .attr("stroke", function (d) {
            return colorParty(d.party)
        })

    // For each hidden rectangle belonging to a point, set position and size
    // so that it covers the space between points
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
        .attr("height", y(1) - y(2)) // height of rectangle is one unit of the y axis

    // Each group includes the start and end cirles, line inbetween and the hidden hover rectangle
    function mpMouseover(d) {
        // Only show mouseover if MP is in toggled party or if no party is filtered
        if (partyToggled == false || d.party == partyToggled) {
            d3.select(this)
                .moveToFront()
            // For each point group, set tooltip to display on mouseover
            d3.select("#tooltip")
                .style("opacity", 1)
            var partyLogo = partyHasLogo.indexOf(d.party) != -1
            tooltip.innerHTML = `
                    <h1 style="background-color: ${colorParty(d.party)};">${d.name}</h1>
                    <div class="mp-image-parent">
                    ${typeof mp_base64_data[d.id] === "undefined" ? "" : "<img class=\"mp-image-blurred\" src=\"data:image/jpeg;base64," + mp_base64_data[d.id] + "\" />" +
                    "<img class=\"mp-image\" src=\"./mp-images/mp-" + d.id + ".jpg\" style=\"opacity: ${typeof d.loaded == 'undefined' ? 0 : d.loaded;d.loaded = 1;};\" onload=\"this.style.opacity = 1;\" />"}
                    </div>
                    <div class="mp-term">${d3.timeFormat("%Y")(d.term_start)} &rarr; \
                    ${d3.timeFormat("%Y")(d.term_end)}</div>
                    <div class="mp-party" style="opacity: ${partyLogo ? 0: 1}">${d.party}</div>
                    <div class="mp-constituency">${d.constituency}</div>
                    ${partyLogo ? `<img class="mp-party-logo" alt="${d.party} logo" style="opacity: ${partyLogo ? 1: 0}" src="./party_logos/${d.party}.svg"/>` : ""}
                    `

            // Increase line thickness of all terms of the same MP
            pointsGroup
                .selectAll("g")
                .style("opacity", function (a) {
                    return (d.clean_name == a.clean_name) ? 1.0 : 0.6
                })
                .selectAll(".line-connect")
                .style("stroke-width", function (a) {
                    return (d.clean_name == a.clean_name) ? 2 * lineThickness : lineThickness
                })
        }
        d3.event.preventDefault()
    }
    instance
        .on("mouseover", mpMouseover)
        // On mouse out, change everything back
        .on("mouseout", function() {
            pointsGroup
                .selectAll("g")
                .style("opacity", function (a) {
                    if (partyToggled != false) {
                        return (a.party == partyToggled) ? 1.0 : 0.1
                    } else {
                        return 1.0
                    }
                })
            pointsGroup
                .selectAll(".line-connect")
                .style("stroke-width", lineThickness)
        })
        .on("touchend", mpMouseover)
        // When an MP point is clicked, toggle show all MPs from the same party and hide the rest
        .on("mousedown", function (d) {
            if (partyToggled == false) {
                // Store toggled party
                partyToggled = d.party
            } else {
                partyToggled = false
            }
            pointsGroup.selectAll("g")
                .style("opacity", function (a) {
                    return (d.party == a.party) ? 1.0 : ((partyToggled == false) ? 1.0 : 0.1)
                })
                .moveToFront()
            d3.event.preventDefault()
        })

    // Exit
    instance
        .exit()
        .remove()

    // Update current slide number
    current_slide = 0
}

// ----------------------------------------------------------------------------
// GO TO FIRST SLIDE FROM ANOTHER
// ----------------------------------------------------------------------------
function to_first_slide() {
    // Increment lastTransitioned counter if it is less than 0
    if (lastTransitioned < 0) {
        lastTransitioned = 0
    }
    var t0 = svg
        .transition()
        .duration(1000)

    // Fade all objects belonging to second slide
    t0.select("#slide2-group")
        .style("opacity", 0)
        .remove()
    t0.select("#info-bubbles")
        .style("opacity", 0)
        .remove()
    // Remove election rect events and tooltip
    d3.select("#tooltip")
        .style("opacity", 0)
    d3.selectAll(".election-rect")
        .on("mouseover", null)
        .on("mouseout", null)

    // Change domain to include all MPs and rescale y axis
    y.domain([0, 210])
    t0.select(".y-axis")
        .call(yAxis)

    first_slide()
    pointsGroup.style("opacity", 0)
    t0.select("#slide1-group")
        .style("opacity", 1)
}
// ----------------------------------------------------------------------------
// TRANSITION TO SECOND SLIDE, EITHER WITH OR WITHOUT FANCY TRANSITIONS
// ----------------------------------------------------------------------------
function to_second_slide() {
    "use strict"
    if (lastTransitioned < 1) {
        second_slide(false)
        // Update transition counter
        lastTransitioned = 1
    } else {
        d3.select("#slide1-group")
            .style("opacity", 1)
            .transition()
            .duration(1000)
            .style("opacity", 0)
            .remove()
        second_slide(true)
    }
}


// ----------------------------------------------------------------------------
//
// ███████╗███████╗ ██████╗ ██████╗ ███╗   ██╗██████╗     ███████╗██╗     ██╗██████╗ ███████╗
// ██╔════╝██╔════╝██╔════╝██╔═══██╗████╗  ██║██╔══██╗    ██╔════╝██║     ██║██╔══██╗██╔════╝
// ███████╗█████╗  ██║     ██║   ██║██╔██╗ ██║██║  ██║    ███████╗██║     ██║██║  ██║█████╗
// ╚════██║██╔══╝  ██║     ██║   ██║██║╚██╗██║██║  ██║    ╚════██║██║     ██║██║  ██║██╔══╝
// ███████║███████╗╚██████╗╚██████╔╝██║ ╚████║██████╔╝    ███████║███████╗██║██████╔╝███████╗
// ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═════╝     ╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝
// SHOW THE TOTAL NUMBER OF MPS OVER TIME AS A LINE GRAPH
// ----------------------------------------------------------------------------
function second_slide(no_transition = false) {
    // Set all points to full opacity in case they were filtered previously
    pointsGroup.selectAll("g")
        .style("opacity", 1)
    // Remove elements from this slide if already created
    d3.select("#slide2-group")
        .remove()
    // Add group to hold second slide lines
    slide2Group = zoomedArea
        .append("g")
        .attr("id", "slide2-group")

    // Add a smooth but quick transition if no fancy transition is requested
    if (no_transition) {
        slide2Group
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1)
    }

    // Add interpolation line for total mps over time
    var max_mps_line = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d.total_mps)
        })
        .curve(d3.curveCardinal)

    // Add the svg path to display this line
    var max_mps_path = slide2Group.append("path")
        .attr("class", "max-mps-path slide2")
        .datum(total_mps_over_time_data)
        .attr("stroke-width", 1.5 * lineThickness)
        .attr("d", max_mps_line)

    // Also add an area curve to shade the whole region below the max mp line
    var max_mps_area = d3.area()
        .curve(d3.curveCardinal)
        .x(function (d) {
            return x(d.year)
        })
        .y0(height)
        .y1(function (d) {
            return y(d.total_mps)
        })

    // Add the svg path for this shaded region
    var max_mps_path_area = slide2Group.append("path")
        .attr("class", "max-mps-area slide2")
        .data([total_mps_over_time_data])
        .attr("d", max_mps_area)
        .style("opacity", 0)

    // Mask election rectangles with the total area path
    var mask = slide2Group
        .append("clipPath")
        .attr("id", "slide2-hover-mask")
        .append("path")
        .data([total_mps_over_time_data])
        .attr("d", max_mps_area)

    d3.select("#election-rects")
        .attr("clip-path", "url(#slide2-hover-mask)")
        .moveToFront()

    // Add a 50% line to show halfway mark for gender
    var half_max_mps_line = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d.total_mps / 2)
        })
        .curve(d3.curveBasis)

    // Add this in svg
    var half_max_mps_path = slide2Group.append("path")
        .attr("class", "half-max-mps-path slide2")
        .datum(total_mps_over_time_data)
        .attr("stroke-width", 1.5 * lineThickness)
        .attr("d", half_max_mps_line)

    // Curve to show total number of women MPs over time
    var total_women_mps_line = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d.total_women_mps)
        })
        .curve(d3.curveBasis)

    // add the line path
    var total_women_mps_path = slide2Group.append("path")
        .attr("class", "total-women-mps-path slide2")
        .datum(number_women_over_time_data)
        .attr("fill", "none")
        .attr("stroke-width", 1.5 * lineThickness)
        .attr("d", total_women_mps_line)
        .attr("stroke-dasharray", function () {
            return this.getTotalLength()
        })
        .attr("stroke-dashoffset", function () {
            return this.getTotalLength()
        })

    // Area curve for total number of women MPs
    var total_women_mps_area = d3.area()
        .curve(d3.curveBasis)
        .x(function (d) {
            return x(d.year)
        })
        .y0(height)
        .y1(function (d) {
            return y(d.total_women_mps)
        })

    // Add the area path
    var total_women_mps_path_area = slide2Group.append("path")
        .attr("class", "total-women-mps-area slide2")
        .data([number_women_over_time_data])
        .attr("d", total_women_mps_area)
        .style("opacity", 0)



    // ----------------------------------------------------------------------------
    // START THE TRANSITION FROM MP POINTS TO LINE GRAPH
    // ------------------------------------------------------------------------

    // ----------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗     ██████╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ██╔═████╗
    // ███████║██║        ██║       ██║██╔██║
    // ██╔══██║██║        ██║       ████╔╝██║
    // ██║  ██║╚██████╗   ██║       ╚██████╔╝
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝        ╚═════╝
    // HIDE THE TOOLTIP
    // ----------------------------------------------------------------------------
    // Hide the tooltip
    d3.select("#tooltip")
        .style("opacity", 0)

    // ----------------------------------------------------------------------------
    // █████╗  ██████╗████████╗     ██╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ███║
    // ███████║██║        ██║       ╚██║
    // ██╔══██║██║        ██║        ██║
    // ██║  ██║╚██████╗   ██║        ██║
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝        ╚═╝
    // SQUASH CONNECTING LINE AND TERM END CIRCLE INTO TERM START CIRCLE
    // ----------------------------------------------------------------------------

    // Create a bisector method to find the nearest point in the total mp data
    var bisect = d3.bisector(function (a) {
        return a.year
    })
        .left

    pointsGroup.selectAll(".line-connect")
        .transition()
        .delay(no_transition ? 500 : 0)
        .duration(no_transition ? 0 : 500)
        .attr("x2", function (a) {
            return x(a.term_start)
        })

    // ----------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗    ██████╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ╚════██╗
    // ███████║██║        ██║        █████╔╝
    // ██╔══██║██║        ██║       ██╔═══╝
    // ██║  ██║╚██████╗   ██║       ███████╗
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚══════╝
    // MOVE CIRCLES TO NEAREST POINT ON TOTAL WOMEN MP LINE
    // ----------------------------------------------------------------------------
    pointsGroup.selectAll(".line-connect")
        .transition()
        .delay(no_transition ? 500 : 500)
        .duration(no_transition ? 0 : 500)
        .attr("y1", function (a) {
            return y(number_women_over_time_data[bisect(number_women_over_time_data, a.term_start)].total_women_mps)
        })
        .attr("y2", function (a) {
            return y(number_women_over_time_data[bisect(number_women_over_time_data, a.term_start)].total_women_mps)
        })
        .transition()
        .delay(no_transition ? 0 : 2000)
        .duration(no_transition ? 0 : 250)
        .style("opacity", 0)


    // ----------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗    ██████╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ╚════██╗
    // ███████║██║        ██║        █████╔╝
    // ██╔══██║██║        ██║        ╚═══██╗
    // ██║  ██║╚██████╗   ██║       ██████╔╝
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚═════╝
    // DRAW LINE SHOWING TOTAL WOMEN MPS OVER TIME
    // ----------------------------------------------------------------------------
    total_women_mps_path
        .transition()
        .delay(no_transition ? 0 : 1000)
        .ease(d3.easeCubic)
        .duration(no_transition ? 0 : 3000)
        .attr("stroke-dashoffset", 0)

    // Draw women mps line
    total_women_mps_path
        .transition()
        .delay(no_transition ? 0 : 4000)
        .duration(no_transition ? 0 : 750)
        .attr("d", total_women_mps_line)

    // Fade in women mps area
    total_women_mps_path_area
        .transition()
        .delay(no_transition ? 0 : 4000)
        .duration(no_transition ? 0 : 750)
        .attr("d", total_women_mps_area)
        .style("opacity", 1)

    // ----------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗    ██╗  ██╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ██║  ██║
    // ███████║██║        ██║       ███████║
    // ██╔══██║██║        ██║       ╚════██║
    // ██║  ██║╚██████╗   ██║            ██║
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝            ╚═╝
    // RESCALE Y AXIS, FADE IN MP AREAS AND LINES
    // ----------------------------------------------------------------------------


    // Rescale y axis to include all MPs
    y.domain([0, 750])

    slide2Group.append("text")
        .attr("x", x(new Date(2010, 1, 1)))
        .attr("y", y(0) - 10 * lineThickness)
        .attr("font-size", Math.min(y(number_women_over_time_data.slice(-1)[0].total_women_mps) / 4,
            (x(new Date(2020, 1, 1)) - x(new Date(2000, 1, 1))) / 4))
        .attr("class", "women-label")
        .text("Women")
        .style("opacity", 0)
        .transition()
        .delay(no_transition ? 0 : 4000)
        .duration(no_transition ? 0 : 500)
        .style("opacity", 1)

    // Do the actual axis rescale now
    gY
        .transition()
        .delay(no_transition ? 0 : 5500)
        .duration(no_transition ? 1000 : 750)
        .call(yAxis)

    // Now rescale the women mps line and area to fit new axis
    total_women_mps_path
        .transition()
        .delay(no_transition ? 0 : 5500)
        .duration(no_transition ? 0 : 750)
        .attr("d", total_women_mps_line)

    total_women_mps_path_area
        .transition()
        .delay(no_transition ? 0 : 5500)
        .duration(no_transition ? 0 : 750)
        .attr("d", total_women_mps_area)

    // Draw a line and area for the total number of MPs
    max_mps_path
        .transition()
        .delay(no_transition ? 0 : 6500)
        .duration(no_transition ? 0 : 750)
        .attr("d", max_mps_line)

    max_mps_path_area
        .transition()
        .delay(no_transition ? 0 : 6500)
        .duration(no_transition ? 0 : 750)
        .attr("d", max_mps_area)
        .style("opacity", 1)

    // And a mask for the rects
    mask
        .transition()
        .delay(no_transition ? 0 : 6500)
        .duration(no_transition ? 0 : 750)
        .attr("d", max_mps_area)

    // Draw a 50% line
    half_max_mps_path
        .transition()
        .delay(no_transition ? 0 : 6500)
        .duration(no_transition ? 0 : 750)
        .attr("d", half_max_mps_line)

    instance
        .on("mouseover", null)
        .on("mouseout", null)
        .on("click", null)

    // ------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗    ███████╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ██╔════╝
    // ███████║██║        ██║       ███████╗
    // ██╔══██║██║        ██║       ╚════██║
    // ██║  ██║╚██████╗   ██║       ███████║
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚══════╝
    // DRAW LABELS FOR EACH AREA AND OVERLAY RECTS FOR EACH PARLIAMENT
    // ----------------------------------------------------------------------------

    svg.transition()
        .delay(no_transition ? 0 : 7000)
        .on("end", () => {
            // Add text labels for areas
            slide2Group.append("text")
                .attr("x", x(new Date(2010, 1, 1)))
                .attr("y", y(500))
                .attr("font-size", Math.min(y(number_women_over_time_data.slice(-1)[0].total_women_mps) / 4,
                    (x(new Date(2020, 1, 1)) - x(new Date(2000, 1, 1))) / 4))
                .attr("class", "men-label")
                .text("Men")
                .style("opacity", 0)
                .transition()
                .duration(no_transition ? 0 : 500)
                .style("opacity", 1)

            // Add a smoothed 50% line to show halfway mark for gender and place text label on it
            var half_max_mps_line_smooth = d3.line()
                .x(function (d) {
                    return x(d.year)
                })
                .y(function (d) {
                    return y(d.total_mps / 2)
                })
                .curve(d3.curveBundle.beta(0.75))

            // Add path for text to follow
            slide2Group
                .append("defs")
                .append("path")
                .attr("id", "half-max-textpath")
                .datum(total_mps_over_time_data)
                .attr("d", half_max_mps_line_smooth)

            slide2Group
                .append("text")
                .append("textPath")
                // .attr("x", x(new Date(1970, 1, 1)))
                // .attr("y", y(630/2))
                .attr("startOffset", "75%")
                .attr("xlink:href", "#half-max-textpath")
                .attr("font-size", Math.max(lineThickness * 10, Math.min(lineThickness * 20,
                    (x(new Date(2020, 1, 1)) - x(new Date(2000, 1, 1))) / 6)))
                .attr("class", "i5050-label")
                .text("50:50 gender representation")
                .style("opacity", 0)
                .transition()
                .duration(no_transition ? 0 : 500)
                .style("opacity", 1)

            // Use election rects to catch mouseovers and display information
            electionRects
                .on("mouseover", function (d, i) {
                    d3.select("#tooltip")
                        .style("opacity", 1)
                    d3.select(this)
                        .classed("hover", true)
                    // Reconfigure tooltip to show different information
                    var first_election = d.year
                    var second_election = total_mps_over_time_data[Math.min(total_mps_over_time_data.length - 1, i + 1)].year
                    var num_women = number_women_over_time_data[bisect(number_women_over_time_data, first_election)].total_women_mps
                    var gender_ratio = d.total_mps / num_women - 1
                    tooltip.innerHTML = `<div class="slide2-tooltip"><h1>${formatDate(first_election)} &rarr; ${formatDate(second_election)}</h1>
            ${num_women > 0 ? `For every <span class="female">female</span> MP, there ${new Date() > second_election ? "were" : "are"}
                                <div class="gender-ratio">${gender_ratio.toFixed(1)}</div> <span class="male">male</span> MPs.` :
        "There were no women in the House of Commons yet :("}
                                </div>
            `
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .classed("hover", false)
                })
            // ----------------------------------------------------------------
            // Add info bubbles to show information at specific points
            // ----------------------------------------------------------------
            var parseDate = d3.timeParse("%Y-%m-%d")

            // Remove old info bubbles
            d3.select("#info-bubbles")
                .remove()
            var infoBubbles = zoomedArea
                .append("g")
                .attr("id", "info-bubbles")
                .selectAll("g")
                .data(info_bubbles_data.slide2)
                .enter()
                .append("g")
            // Create a voronoi grid with clipPaths to use them to clip large circles
            var voronoi = d3.voronoi()
                .x(function (d) { return x(d3.timeParse("%Y-%m-%d")(d.x)) })
                .y(function (d) { return y(d.y) })
                .extent([
                    [-margin.left, -margin.top],
                    [width + margin.right, height + margin.bottom]
                ])

            d3.select("#info-bubbles")
                .append("defs")
                .selectAll("clipPath")
                .data(voronoi.polygons(info_bubbles_data.slide2))
                .enter()
                .append("clipPath")
                .attr("id", function (d, i) { return `voronoi-clip-${i}` })
                .append("path")
                .attr("d", function (d) { return d ? "M" + d.join("L") + "Z" : null })
            // add large hidden circle to catch hover events
            infoBubbles
                .append("circle")
                .attr("r", 50 * circleRadius)
                .attr("class", "info-bubble-hidden")
                .style("opacity", 0)
                .attr("cx", function (d) {
                    return x(parseDate(d.x))
                })
                .attr("cy", function (d) {
                    return y(d.y)
                })
                .style("clip-path", function (d, i) { return `url(#voronoi-clip-${i})` })
                .attr("clip-path", function (d, i) { return `url(#voronoi-clip-${i})` })
            // Then add visible circle
            infoBubbles
                .append("circle")
                .attr("r", 0)
                .attr("class", "info-bubble")
                .attr("stroke-width", 2 * circleRadius)
                .attr("cx", function (d) {
                    return x(parseDate(d.x))
                })
                .attr("cy", function (d) {
                    return y(d.y)
                })
                .transition()
                .delay(no_transition ? 0 : function (d, i) { return 1000 + i * 250 })
                .duration(no_transition ? 0 : 1000)
                .ease(d3.easeBounce)
                .attr("r", 5 * circleRadius)
            // Add the mouseover effects
            infoBubbles
                .on("mouseover", function (d) {
                    d3.select(this)
                        .moveToFront()
                    d3.select(this)
                        .select(".info-bubble")
                        .classed("hover", true)
                        .transition()
                        .duration(500)
                        .ease(d3.easeBounce)
                        .attr("r", 10 * circleRadius)

                    d3.select("#tooltip")
                        .style("opacity", 1)
                    // Show relevant tooltip info
                    tooltip.innerHTML = `
                            <div class="info-bubble-tip">
                                <h1>${d.head}</h1>
                                <div class="date">${formatDate(parseDate(d.x))}</div>
                                <div class="body">${d.body}</div>
                            </div>`
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .select(".info-bubble")
                        .classed("hover", false)
                        .transition()
                        .duration(500)
                        .ease(d3.easeBounce)
                        .attr("r", 5 * circleRadius)
                })
        })

}

// ----------------------------------------------------------------------------
// ██████╗  ██████╗ ██╗    ██╗███╗   ██╗██╗      ██████╗  █████╗ ██████╗     ██████╗  █████╗ ████████╗ █████╗
// ██╔══██╗██╔═══██╗██║    ██║████╗  ██║██║     ██╔═══██╗██╔══██╗██╔══██╗    ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
// ██║  ██║██║   ██║██║ █╗ ██║██╔██╗ ██║██║     ██║   ██║███████║██║  ██║    ██║  ██║███████║   ██║   ███████║
// ██║  ██║██║   ██║██║███╗██║██║╚██╗██║██║     ██║   ██║██╔══██║██║  ██║    ██║  ██║██╔══██║   ██║   ██╔══██║
// ██████╔╝╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗╚██████╔╝██║  ██║██████╔╝    ██████╔╝██║  ██║   ██║   ██║  ██║
// ╚═════╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
// DOWNLOAD ALL THE MP DATA WE NEED TO DRAW THE GRAPHS
// ----------------------------------------------------------------------------
function download_data() {
    d3.queue()
        .defer(d3.csv, "women_mps.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d")
            return {
                id: d.id,
                name: d.name,
                constituency: d.constituency,
                term_start: parseDate(d.term_start),
                term_end: parseDate(d.term_end),
                party: d.party,
                byelection: (d.byelection == "TRUE"),
                notes: d.notes,
                clean_name: d.clean_name,
                stream: +d.stream
            }
        })
        .defer(d3.csv, "number_women_over_time.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d")
            return {
                year: parseDate(d.Year),
                total_women_mps: +d.Total,
                total_mps: +d.total_mps
            }
        })
        .defer(d3.csv, "total_mps_over_time.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d")
            return {
                year: parseDate(d.Year),
                total_mps: +d.total_mps
            }
        })
        .defer(d3.json, "info_bubbles.json")
        .await(function(error,
            mps_over_time,
            number_women_over_time,
            total_mps_over_time,
            info_bubbles) {
            // Make global
            window.mps_over_time_data = mps_over_time
            window.number_women_over_time_data = number_women_over_time
            window.total_mps_over_time_data = total_mps_over_time
            window.info_bubbles_data = info_bubbles
            // INITIAL DRAW
            draw_graph()
        })

    // This file can download independently because we don't need to wait for it
    d3.queue()
        .defer(d3.csv, "mp_base64.csv", function (d) {
            return {
                id: d.id,
                base64: d.base64
            }
        })
        .await(function(error, mp_base64) {
            // Turn d3 array into a pythonic dictionary
            mp_base64_data = {}
            for (var i = 0; i < mp_base64.length; i++) {
                mp_base64_data[mp_base64[i].id] = mp_base64[i].base64
            }
        })
}

// GET ALL DATA
download_data()


// ----------------------------------------------------------------------------
// ██╗███╗   ██╗██╗████████╗
// ██║████╗  ██║██║╚══██╔══╝
// ██║██╔██╗ ██║██║   ██║
// ██║██║╚██╗██║██║   ██║
// ██║██║ ╚████║██║   ██║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝
//  DRAW GRAPH WHILE RESIZING TO FIT WITHIN WINDOW
// ----------------------------------------------------------------------------
function draw_graph() {
    "use strict"

    d3.select("svg").selectAll("*")
        .remove()
    // Chart dimensions - use parent div size
    var new_width = timeline.clientWidth - margin.left - margin.right,
        new_height = timeline.clientHeight - margin.top - margin.bottom

    if (new_width != width | new_height != height) {
        width = new_width
        height = new_height
        // SET THE THICKNESS OF EACH LINE BASED ON THE CHART HEIGHT
        lineThickness = 0.0018 * height * 2
        // SET THE RADIUS OF EACH LINE'S END BASED ON THE LINE THICKNESS
        circleRadius = lineThickness / 2
        svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        new_slide = 0
        current_slide = -1
        // REDRAW
        initial_render()
        first_slide()
    }
}
// ----------------------------------------------------------------------------
// REDRAW GRAPH ON WINDOW RESIZE
// ----------------------------------------------------------------------------
window.addEventListener("resize", draw_graph)
