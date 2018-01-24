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
    "Labour": "#C61148",
    "Con": "#0096DB",
    "Conservative": "#0096DB",
    "SNP": "#FCCA46",
    "Scottish National Party": "#FCCA46",
    "Lib Dem": "#F37A48",
    "Liberal Democrat": "#F37A48",
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
// var partyToggled = false
var lastTransitioned = -1

// define scroller
var scroller = scrollama()

// ----------------------------------------------------------------------------
// SCROLL TO TOP OF PAGE ON LOAD
// ----------------------------------------------------------------------------
window.onbeforeunload = function () {
    window.scrollTo(0, 0)
}

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

// Add a canvas above the svg
var canvas = d3.select(timeline)
    .append("canvas")
    .attr("id", "visible-canvas")

var context = canvas
    .node()
    .getContext("2d")

// Add a hidden canvas to catch mouseover events
var canvas_hidden = d3.select(timeline)
    .append("canvas")
    .attr("id", "hidden-canvas")

var context_hidden = canvas_hidden
    .node()
    .getContext("2d")

// Create an in memory only element of type 'custom'
var detachedContainer = document.createElement("custom")

// Create a d3 selection for the detached container. We won't
// actually be attaching it to the DOM.
var dataContainer = d3.select(detachedContainer)

var width = 0,
    height = 0

var ratio,
    clippedArea,
    electionRects,
    zoom,
    wrapper,
    zoomedArea,
    pointsGroup,
    slide2Group,
    slide3Group,
    // slide5Group,
    slide6Group,
    max_mps_line,
    max_mps_path,
    max_mps_area,
    max_mps_path_area,
    half_max_mps_line,
    half_max_mps_path,
    total_women_mps_line,
    total_women_mps_path,
    total_women_mps_area,
    total_women_mps_path_area,
    half_max_mps_line_smooth,
    text_path_50_50,
    women_in_govt_paths,
    mask,
    instance,
    x, y,
    xAxis, gX, xLabel,
    yAxis, gY, yLabel,
    tooltip,
    lineThickness,
    circleRadius,
    selected_mp,
    topic_bar_width,
    topic_bar_height,
    topicBarScale,
    topicColorScale,
    selected_topic,
    circle_male,
    circle_female,
    slide5_xScale,
    slide5_yScale

var mps_over_time_data,
    number_women_over_time_data,
    total_mps_over_time_data,
    women_in_govt_data,
    mp_base64_data,
    info_bubbles_data,
    speech_samples_data,
    topic_medians_data,
    baked_positions_data,
    nodes_male,
    nodes_female

// If a political party has a colour defined,
// then it also has an SVG logo that we can use
var partyHasLogo = Object.keys(colors)

// Dict to track the colours of nodes for the canvas mouseovers
var colourToNode = {}
var colourToNode_slide5 = {}
var initial_slide5 = true

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
// GENERATES A UNIQUE COLOUR EVERY TIME THIS FUNCTION IS CALLED
// USED FOR MAPPING CANVAS INTERACTIONS TO NODES
// ----------------------------------------------------------------------------
var nextCol = 1

function genColor() {

    var ret = []
    if (nextCol < 16777215) {

        ret.push(nextCol & 0xff) // R
        ret.push((nextCol & 0xff00) >> 8) // G
        ret.push((nextCol & 0xff0000) >> 16) // B
        nextCol += 1

    }
    var col = "rgb(" + ret.join(",") + ")"
    return col
}
// ----------------------------------------------------------------------------
// CONVERT HEX TO RGBA
// ----------------------------------------------------------------------------
function hexToRGBA(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16)

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")"
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")"
    }
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
function reset_zoom(callback, current_slide) {
    "use strict"
    canvas.transition()
        .duration(500)
        .call(zoom.transform, d3.zoomIdentity)
        .on("end", () => {
            zoomedArea.attr("transform", null)
            zoom.on("zoom", null)
            canvas.on("wheel.zoom", null)
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
            callback(current_slide)
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
        if (new_slide == 1) {
            // Reset zoom, then load second slide
            reset_zoom(to_second_slide, current_slide)
        } else if (new_slide == 2) {
            // Load third slide
            reset_zoom(to_third_slide, current_slide)
        } else if (new_slide == 3) {
            // Load fourth slide
            reset_zoom(to_fourth_slide, current_slide)
        } else if (new_slide == 4) {
            // Load fifth slide
            // Add zoom capabilities for the points
            zoom.on("zoom", zoomed)
            // canvas.call(zoom)
            to_fifth_slide(current_slide)
        } else if (new_slide == 5) {
            // Load sixth slide
            reset_zoom(to_sixth_slide, current_slide)
        } else if (current_slide != -1 & new_slide == 0) {
            // Add zoom capabilities for the points
            zoom.on("zoom", zoomed)
            // svg.call(zoom)
            // canvas.call(zoom)
            to_first_slide(current_slide)
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
    // Thanks Nadieh Bremer!
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
    x = d3.scaleUtc()
        .domain([new Date(1915, 1, 1), new Date(2020, 1, 1)])
        .range([0, width])

    y = d3.scaleLinear()
        .domain([0, 210]) // Almost 210 MPs by 2020
        .range([height, 0])

    svg.append("defs")
    // Add the group wrapper that contains the whole graph
    wrapper = svg
        .append("g")
        .attr("class", "timeline-wrapper")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Initialise the hexagon tracker that tracks the state of the graph
    initialise_tracker()

    // Initialise info bubble
    d3.select("#tooltip")
        .remove()
    d3.select("body")
        .append("div")
        .attr("id", "tooltip")
    tooltip = document.getElementById("tooltip")
    tooltip.innerHTML = `<div style='padding: 2rem'>
    You can hover on everything in this visualisation so go ahead and explore. Click the <em>Next</em> button when you're ready to continue.</div>`

    // Add a bounding box to clip points so that they aren't visible outside
    // the chart area when we zoom in
    wrapper
        .append("rect")
        .style("opacity", 0)
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
    xLabel = wrapper.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom / 2)
        .attr("class", "x-label")
        .text("Time")

    yLabel = wrapper.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left / 2)
        .attr("x", 0 - (height / 2))
        .attr("class", "y-label")
        .text("Number of Women MPs")

    // Add zoom capabilities for the points
    zoom = d3.zoom()
        .scaleExtent([0.95, 40])
        .on("zoom", zoomed)
    // svg.call(zoom)
    // canvas.call(zoom)

}

// ----------------------------------------------------------------------------
// ZOOM function
// ----------------------------------------------------------------------------
function zoomed() {
    "use strict"
    let transform = d3.event.transform
    if (current_slide == 0) zoomedArea.attr("transform", transform)
    // Scale the canvas
    context.save()
    context.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)
    context.translate(transform.x, transform.y)
    context.scale(transform.k, transform.k)
    draw(context, false)
    context.restore()

    // And do the same for the hidden canvas
    context_hidden.save()
    context_hidden.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)
    context_hidden.translate(transform.x, transform.y)
    context_hidden.scale(transform.k, transform.k)
    draw(context_hidden, true)
    context_hidden.restore()

    // And the svg axes
    if (current_slide == 0 |
        current_slide == 1) {
        gX.call(xAxis.scale(d3.event.transform.rescaleX(x)))
    } else if (current_slide == 4) {
        gX.call(d3.axisBottom(d3.event.transform.rescaleX(slide5_xScale))
            .ticks(20))
        draw_custom_labels()
    } else {
        d3.event.transform.rescaleX(x)
    }
    if (current_slide == 0 | current_slide == 1) {
        gY.call(yAxis.scale(d3.event.transform.rescaleY(y)))
    } else {
        d3.event.transform.rescaleY(y)
    }
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
// ███████╗██╗     ███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗    ██████╗ ███████╗ ██████╗████████╗███████╗
// ██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║    ██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔════╝
// █████╗  ██║     █████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║    ██████╔╝█████╗  ██║        ██║   ███████╗
// ██╔══╝  ██║     ██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║    ██╔══██╗██╔══╝  ██║        ██║   ╚════██║
// ███████╗███████╗███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║    ██║  ██║███████╗╚██████╗   ██║   ███████║
// ╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝ ╚═════╝   ╚═╝   ╚══════╝
// Let's add shaded rectangles in the background to show each parliamentary term
// ----------------------------------------------------------------------------
function add_election_rects() {
    // remove pre-existing rects
    d3.select("#election-rects")
        .remove()
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
function first_slide(no_transition = false) {
    d3.select("#slide1-group")
        .remove()
    d3.select("#election-rects")
        .remove()

    // Add rectangles in the background to identify parliamentary terms
    add_election_rects()

    // Add the points group that will hold all our data points
    pointsGroup = zoomedArea
        .append("g")
        .attr("id", "slide1-group")

    // Add a group to contain each data point and bind to timeline data
    instance = dataContainer
        .selectAll("custom.line")
        .data(mps_over_time_data)

    // Add a line connecting start and end of term
    instance
        .attr("x2", (d) => x(d.term_end) - lineThickness * 1.2)

    if (no_transition == false) {
        instance
            .enter()
            .append("custom")
            .attr("class", "line")
            .attr("x1", (d) => x(d.term_start))
            .attr("x2", (d) => x(d.term_start))
            .attr("y1", () => y(0))
            .attr("y2", () => y(0))
            .attr("strokeStyle", (d) => colorParty(d.party))
            .attr("hiddenStrokeStyle", function (d) {
                if (!d.hiddenCol) {
                    d.hiddenCol = genColor()
                    colourToNode[d.hiddenCol] = d
                }
                // Here you (1) add a unique colour as property to each element
                // and(2) map the colour to the node in the colourToNode-map.
                return d.hiddenCol
            })
            .transition()
            .delay((d, i) => 500 + i * 2)
            .duration(1000)
            .attr("y1", (d) => y(d.stream))
            .attr("y2", (d) => y(d.stream))
            .transition()
            .delay((d, i) => 200 + i * 2)
            .duration(1000)
            .attr("x2", (d) => x(d.term_end) - lineThickness * 1.2)
    } else {
        dataContainer.selectAll("custom.line")
            .attr("x1", (d) => x(d.term_start))
            .attr("y1", (d) => y(d.stream))
            .attr("y2", (d) => y(d.stream))
            .attr("x2", (d) => x(d.term_end) - lineThickness * 1.2)
    }
    if (no_transition == false) {

        context.scale(ratio, ratio)
        context.translate(margin.left, margin.top)
        context.rect(0, 0, width, height)
        context.clip()

        context_hidden.scale(ratio, ratio)
        context_hidden.translate(margin.left, margin.top)
        context_hidden.rect(0, 0, width, height)
        context_hidden.clip()
    }

    window.draw = function (context, hidden = false) {
        context.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)

        dataContainer.selectAll("custom.line")
            .each(function () {
                let node = d3.select(this)
                context.beginPath()
                context.lineWidth = hidden ? lineThickness * 1.3 : lineThickness
                context.strokeStyle = hidden ? node.attr("hiddenStrokeStyle") : node.attr("strokeStyle")
                if (!hidden) {
                    context.lineCap = "round"
                    context.moveTo(node.attr("x1"), node.attr("y1"))
                    context.lineTo(node.attr("x2"), node.attr("y2"))
                } else {
                    context.moveTo(node.attr("x1") - circleRadius, node.attr("y1"))
                    context.lineTo(+node.attr("x2") + circleRadius, node.attr("y2"))
                }
                context.stroke()
            })
    }

    // Animate node entrances
    var t = d3.timer((elapsed) => {
        draw(context, false)
        if (elapsed > 5000) {
            t.stop()
            draw(context)
            // Draw hidden canvas nodes to catch interactions
            draw(context_hidden, true)
        }
    })

    // mouseover function for getting MP info
    function mpMouseover() {
        // Get mouse positions from the main canvas.
        var mousePos = d3.mouse(this)

        // Pick the colour from the mouse position.
        context_hidden.save()
        var col = context_hidden.getImageData(mousePos[0] * ratio, mousePos[1] * ratio, 1, 1)
            .data
        context_hidden.restore()
        // Then stringify the values in a way our map-object can read it.
        var colKey = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")"
        // Get the data from our map!
        var nodeData = colourToNode[colKey]

        // Only show mouseover if MP is in toggled party or if no party is filtered
        if (typeof (nodeData) !== "undefined") {
            // For each point group, set tooltip to display on mouseover
            d3.select("#tooltip")
                .style("opacity", 1)
                .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth / 2,
                    width - tooltip.offsetWidth - margin.right),
                0 + margin.left)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight - 20,
                    height + tooltip.offsetHeight - 20), margin.top)}px)`)
                .style("pointer-events", "none")

            var partyLogo = partyHasLogo.indexOf(nodeData.party) != -1
            var tooltip_innerHTML = `
                    <h1 style="background-color: ${colorParty(nodeData.party)};">${nodeData.name}</h1>
                    <div class="body-container">
                <div class="mp-image-parent">`

            if (typeof (mp_base64_data) == "undefined") {
                tooltip_innerHTML += `<img class="mp-image-blurred" style="opacity: 0;"/>
                <img class="mp-image" src="./mp-images/mp-${nodeData.id}.jpg" />
                `

            } else {
                // If mp has a photo
                if (typeof (mp_base64_data[nodeData.id]) !== "undefined") {
                    tooltip_innerHTML += `<img class="mp-image-blurred" src="data:image/jpeg;base64, ${mp_base64_data[nodeData.id]}"/>
                <img class="mp-image" src="./mp-images/mp-${nodeData.id}.jpg" style="opacity: ${typeof nodeData.loaded == "undefined" ? 0 : nodeData.loaded}${nodeData.loaded = 1};" onload="this.style.opacity = 1;" />
                `
                }
            }
            tooltip_innerHTML += `</div>
            <div class="body">
                    <div class="mp-term">${d3.timeFormat("%Y")(nodeData.term_start)} &rarr; \
                    ${d3.timeFormat("%Y")(nodeData.term_end)}</div>
                    <div class="mp-constituency">${nodeData.constituency}</div>
                    </div>
                    </div>
                    <div class="mp-party" style="opacity: ${partyLogo ? 0: 1}">${nodeData.party}</div>
                    ${partyLogo ? `<img class="mp-party-logo" alt="${nodeData.party} logo" style="opacity: ${partyLogo ? 1: 0}" src="./party_logos/${nodeData.party}.svg"/>` : ""}
                    `

            tooltip.innerHTML = tooltip_innerHTML

        } else {
            d3.select(tooltip)
                .transition()
                .delay(3000)
                .style("opacity", 0)
        }
        d3.event.preventDefault()
    }
    canvas
        .on("mousemove", mpMouseover)
        // On mouse out, change everything back
        .on("mouseout", () => {
            d3.select(tooltip)
                .transition()
                .delay(3000)
                .style("opacity", 0)
        })
        .on("touchend", mpMouseover)

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
function to_first_slide(current_slide) {
    var t0 = svg
        .transition()
        .duration(1000)

    yLabel.transition(t0)
        .text("Number of Women MPs")

    // Different actions depending on which slide we're coming from
    switch (current_slide) {
    case 1:
        // If we're coming from the second slide
        t0.select("#slide2-group")
            .style("opacity", 0)
            .remove()
        t0.select("#info-bubbles")
            .style("opacity", 0)
            .remove()
        d3.selectAll(".election-rect")
            .on("mouseover", null)
            .on("mouseout", null)
        break
    case 2:
        // Fade all objects belonging to second and third slides
        t0.select("#slide2-group")
            .style("opacity", 0)
            .remove()
        t0.select("#slide3-group")
            .style("opacity", 0)
            .remove()
        break
    }

    // Hide tooltip
    d3.select("#tooltip")
        .style("opacity", 0)

    // Show canvas
    d3.select("#visible-canvas")
        .style("opacity", 1)
        .style("display", null)
    // Scale axes to fit all data
    y.domain([0, 210])
    gY.transition()
        .duration(1000)
        .call(yAxis)
    xAxis.scale(x.domain([new Date(1915, 1, 1), new Date(2020, 1, 1)]))
    gX.transition()
        .duration(1000)
        .call(xAxis)

    pointsGroup.style("opacity", 0)
    t0.select("#slide1-group")
        .style("opacity", 1)
    // Enable all pointer events for canvas
    canvas.style("pointer-events", "all")

    // Increment lastTransitioned counter if it is less than 0
    if (lastTransitioned < 0) {
        lastTransitioned = 0
        first_slide(false)
    } else {
        first_slide(true)
    }
}
// ----------------------------------------------------------------------------
// TRANSITION TO SECOND SLIDE, EITHER WITH OR WITHOUT FANCY TRANSITIONS
// ----------------------------------------------------------------------------
function to_second_slide(current_slide) {
    "use strict"

    if (lastTransitioned < 1) {
        second_slide(false)
        // Update transition counter
        lastTransitioned = 1
    } else {
        var t0 = svg
            .transition()
            .duration(1000)

        yLabel.transition(t0)
            .text("Number of MPs")

        // Different actions depending on which slide we're coming from
        switch (current_slide) {
        case 0:
            // If we're coming from the first slide
            t0.select("#slide1-group")
                .style("opacity", 0)
                .remove()
            break
        case 2:
            // Fade all objects belonging to third slide
            t0.select("#slide3-group")
                .style("opacity", 0)
                .remove()
            break

        }

        // Scale axes to fit all data
        xAxis.scale(x.domain([new Date(1915, 1, 1), new Date(2020, 1, 1)]))
        gX.transition()
            .duration(1000)
            .call(xAxis)

        add_election_rects()
        second_slide(true)
    }
}


// ----------------------------------------------------------------------------
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
    // pointsGroup.selectAll("g")
    //     .style("opacity", 1)
    d3.select("#slide1-group")
        .remove()

    d3.select("#holding-div")
        .remove()
    // .style("display", "unset")
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
    max_mps_line = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d.total_mps)
        })
        .curve(d3.curveCardinal)

    // Add the svg path to display this line
    max_mps_path = slide2Group.append("path")
        .attr("class", "max-mps-path slide2")
        .datum(total_mps_over_time_data)
        .attr("stroke-width", 1.5 * lineThickness)
        .attr("d", max_mps_line)

    // Also add an area curve to shade the whole region below the max mp line
    max_mps_area = d3.area()
        .curve(d3.curveCardinal)
        .x(function (d) {
            return x(d.year)
        })
        .y0(height)
        .y1(function (d) {
            return y(d.total_mps)
        })

    // Add the svg path for this shaded region
    max_mps_path_area = slide2Group.append("path")
        .attr("class", "max-mps-area slide2")
        .data([total_mps_over_time_data])
        .attr("d", max_mps_area)
        .style("opacity", 0)

    // Mask election rectangles with the total area path
    mask = slide2Group
        .append("clipPath")
        .attr("id", "slide2-hover-mask")
        .append("path")
        .data([total_mps_over_time_data])
        .attr("d", max_mps_area)

    d3.select("#election-rects")
        .attr("clip-path", "url(#slide2-hover-mask)")
        .moveToFront()

    // Add a 50% line to show halfway mark for gender
    half_max_mps_line = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d.total_mps / 2)
        })
        .curve(d3.curveBasis)

    // Add this in svg
    half_max_mps_path = slide2Group.append("path")
        .attr("class", "half-max-mps-path slide2")
        .datum(total_mps_over_time_data)
        .attr("stroke-width", 1.5 * lineThickness)
        .attr("d", half_max_mps_line)

    // Curve to show total number of women MPs over time
    total_women_mps_line = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y(d.total_women_mps)
        })
        .curve(d3.curveBasis)

    // add the line path
    total_women_mps_path = slide2Group.append("path")
        .attr("class", "total-women-mps-path slide2")
        .datum(number_women_over_time_data)
        .attr("stroke-width", 1.5 * lineThickness)
        .attr("d", total_women_mps_line)

    let path_node = total_women_mps_path.node()
    // path_node.style.transition = "none"
    // path_node.style.strokeDasharray = path_length
    // path_node.style.strokeDashoffset = path_length

    path_node.getBoundingClientRect()

    // Area curve for total number of women MPs
    total_women_mps_area = d3.area()
        .curve(d3.curveBasis)
        .x(function (d) {
            return x(d.year)
        })
        .y0(height)
        .y1(function (d) {
            return y(d.total_women_mps)
        })

    // Add the area path
    total_women_mps_path_area = slide2Group.append("path")
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

    // Disable all pointer events for canvas
    canvas.style("pointer-events", "none")


    // ----------------------------------------------------------------------------
    // █████╗  ██████╗████████╗     ██╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ███║
    // ███████║██║        ██║       ╚██║
    // ██╔══██║██║        ██║        ██║
    // ██║  ██║╚██████╗   ██║        ██║
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝        ╚═╝
    // SQUASH CONNECTING LINE AND TERM END CIRCLE INTO TERM START CIRCLE
    // MOVE CIRCLES TO NEAREST POINT ON TOTAL WOMEN MP LINE
    // ----------------------------------------------------------------------------

    // Create a bisector method to find the nearest point in the total mp data
    var bisect = d3.bisector(function (a) {
        return a.year
    })
        .left
    if (no_transition == false) {

        // Change length to 0
        dataContainer.selectAll("custom.line")
            .transition()
        // .delay(no_transition ? 500 : 0)
            .duration(500)
            .attr("x2", function (a) {
                return x(a.term_start) + circleRadius
            })
            .transition()
            .duration(500)
            .attr("y1", function (a) {
                return y(number_women_over_time_data[bisect(number_women_over_time_data, a.term_start)].total_women_mps)
            })
            .attr("y2", function (a) {
                return y(number_women_over_time_data[bisect(number_women_over_time_data, a.term_start)].total_women_mps)
            })

        // Animate line squashing
        var t_ = d3.timer((elapsed) => {
        // console.log(elapsed)
            draw(context, false)
            if (elapsed > 1000) {
                t_.stop()
            }
        })
    }

    // ----------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗    ██████╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ╚════██╗
    // ███████║██║        ██║        █████╔╝
    // ██╔══██║██║        ██║       ██╔═══╝
    // ██║  ██║╚██████╗   ██║       ███████╗
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚══════╝
    // DRAW LINE SHOWING TOTAL WOMEN MPS OVER TIME
    // ----------------------------------------------------------------------------

    let y_canvas = d3.scaleLinear()
        .domain([0, 210]) // Almost 210 MPs by 2020
        .range([height, 0])

    let total_women_mps_line_canvas = d3.line()
        .x(function (d) {
            return x(d.year)
        })
        .y(function (d) {
            return y_canvas(d.total_women_mps)
        })
        .curve(d3.curveBasis)
        .context(context)

    if (no_transition == false) {
        d3.timeout(() => {
        // context.globalCompositeOperation = "copy"
            context.lineWidth = 1.5 * lineThickness
            context.strokeStyle = "#CDCDCD"
        }, 1000)

        const path_len = total_women_mps_path.node()
            .getTotalLength()
        context.setLineDash([path_len])
        const ease = d3.easeCubic

        let t = d3.timer(function (elapsed) {
            const frac = ease(elapsed / 3000) * path_len
            // const fraction_complete = parseInt(frac * 206)
            total_women_mps_line_canvas(number_women_over_time_data) //.slice(0,fraction_complete))
            context.lineDashOffset = -(frac + path_len)
            context.stroke()

            if (elapsed > 3000) {
                t.stop()
            }
        }, 1000)
    }

    // ----------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗    ██████╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ╚════██╗
    // ███████║██║        ██║        █████╔╝
    // ██╔══██║██║        ██║        ╚═══██╗
    // ██║  ██║╚██████╗   ██║       ██████╔╝
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚═════╝
    // HIDE CANVAS
    // ----------------------------------------------------------------------------

    d3.selectAll("#timeline canvas")
        .transition()
        .delay(no_transition ? 100 : 4000)
        .duration(500)
        .style("opacity", 0)
        .on("end", function () {
            // Clear canvas
            context.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)
            d3.select(this)
                .style("display", "none")
        })

    // ----------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗    ██╗  ██╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ██║  ██║
    // ███████║██║        ██║       ███████║
    // ██╔══██║██║        ██║       ╚════██║
    // ██║  ██║╚██████╗   ██║            ██║
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝            ╚═╝
    // RESCALE Y AXIS, FADE IN MP AREAS AND LINES
    // ----------------------------------------------------------------------------

    // // Fade in women mps area
    total_women_mps_path_area
        .transition()
        .delay(no_transition ? 0 : 4000)
        .duration(no_transition ? 0 : 750)
        .attr("d", total_women_mps_area)
        .style("opacity", 1)

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

    total_women_mps_path_area
        .transition()
        .delay(no_transition ? 0 : 5500)
        .duration(no_transition ? 0 : 750)
        .attr("d", total_women_mps_area)

    total_women_mps_path
        .transition()
        .delay(no_transition ? 0 : 5500 + 750)
        .duration(0)
        .attr("d", total_women_mps_line)
        .style("opacity", 1)

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
            half_max_mps_line_smooth = d3.line()
                .x(function (d) {
                    return x(d.year)
                })
                .y(function (d) {
                    return y(d.total_mps / 2)
                })
                .curve(d3.curveBundle.beta(0.5))

            // Add path for text to follow
            text_path_50_50 = slide2Group
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
                .attr("startOffset", "50%")
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
                    // Get mouse positions
                    var mousePos = d3.mouse(this)

                    d3.select("#tooltip")
                        .style("opacity", 1)
                        .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth / 2,
                            width - tooltip.offsetWidth / 2 - margin.right),
                        0 + margin.left)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight - 20,
                            height + tooltip.offsetHeight - 20), margin.top)}px)`)
                        .style("pointer-events", "none")

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

                    // Get mouse positions
                    var mousePos = d3.mouse(this)

                    d3.select("#tooltip")
                        .style("opacity", 1)
                        .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth / 2,
                            width - tooltip.offsetWidth / 2 - margin.right),
                        0 + margin.left)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight - 20,
                            height + tooltip.offsetHeight - 20), margin.top)}px)`)
                        .style("pointer-events", "none")

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
// TRANSITION TO THIRD SLIDE, EITHER WITH OR WITHOUT FANCY TRANSITIONS
// ----------------------------------------------------------------------------
function to_third_slide(current_slide) {
    "use strict"

    if (lastTransitioned < 2) {
        third_slide(false)
        // Update transition counter
        lastTransitioned = 2
    } else {
        var t0 = svg
            .transition()
            .duration(1000)

        // Different actions depending on which slide we're coming from
        switch (current_slide) {
        case 0:
            // If we're coming from the first slide
            t0.select("#slide1-group")
                .style("opacity", 0)
                .remove()
            break
        case 3:
            // If we're coming from the fourth slide
            d3.select("#slide4")
                .transition(t0)
                .style("opacity", 0)
                .on("end", function () { this.remove() })


            // Change scales
            x = d3.scaleUtc()
                .range([0, width])
                .domain([new Date(1990, 1, 1), new Date(2017, 12, 1)])
            // Redraw axes
            xAxis = d3.axisBottom(x)

            yAxis = d3.axisLeft(y)
                .tickFormat(d => d)

            xLabel
                .text("Time")
                .style("opacity", 1)

            yLabel
                .style("opacity", 1)

            gX.call(xAxis)
                .style("opacity", 1)
            gY.call(yAxis)
                .style("opacity", 1)

            d3.select(".y-axis > path")
                .style("opacity", 1)

            // Show 50% line again
            d3.select("#slide2-group")
                .style("opacity", 1)

            d3.selectAll(".i5050-label").attr("startOffset", "90%")
            break
        }

        third_slide(true)
    }
}
// ----------------------------------------------------------------------------
// ████████╗██╗  ██╗██╗██████╗ ██████╗     ███████╗██╗     ██╗██████╗ ███████╗
// ╚══██╔══╝██║  ██║██║██╔══██╗██╔══██╗    ██╔════╝██║     ██║██╔══██╗██╔════╝
//    ██║   ███████║██║██████╔╝██║  ██║    ███████╗██║     ██║██║  ██║█████╗
//    ██║   ██╔══██║██║██╔══██╗██║  ██║    ╚════██║██║     ██║██║  ██║██╔══╝
//    ██║   ██║  ██║██║██║  ██║██████╔╝    ███████║███████╗██║██████╔╝███████╗
//    ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═════╝     ╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝
// SHOW PROGRESS IN DIFFERENT COUNTRIES
// ----------------------------------------------------------------------------
function third_slide(no_transition = false) {
    // Remove elements from this slide if already created
    d3.select("#slide3-group")
        .remove()

    // Remove old info bubbles
    d3.select("#info-bubbles")
        .remove()

    // Add group to hold third slide lines
    slide3Group = zoomedArea
        .append("g")
        .attr("id", "slide3-group")

    // Add a smooth but quick transition if no fancy transition is requested
    // if (no_transition) {
    //     slide3Group
    //         .style("opacity", 0)
    //         .transition()
    //         .duration(200)
    //         .style("opacity", 1)
    // }

    // ----------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗     ██╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ███║
    // ███████║██║        ██║       ╚██║
    // ██╔══██║██║        ██║        ██║
    // ██║  ██║╚██████╗   ██║        ██║
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝        ╚═╝
    // Make axis into percentage axis and scale areas accordingly
    // ----------------------------------------------------------------------------
    var t0 = d3.transition()
        .duration(no_transition ? 500 : 1000)
    y.domain([0, 100])
    gY
        .transition(t0)
        .call(yAxis)

    total_women_mps_line
        .y(d => y(d.women_pct))

    total_women_mps_path
        .transition(t0)
        .attr("d", total_women_mps_line)

    total_women_mps_area
        .y1(d => y(d.women_pct))

    total_women_mps_path_area
        .transition(t0)
        .attr("d", total_women_mps_area)

    max_mps_line
        .y(() => y(100))

    max_mps_path
        .transition(t0)
        .attr("d", max_mps_line)

    max_mps_area
        .y1(() => y(100))

    max_mps_path_area
        .transition(t0)
        .attr("d", max_mps_area)

    half_max_mps_line
        .y(() => y(50))

    half_max_mps_path
        .transition(t0)
        .attr("d", half_max_mps_line)

    half_max_mps_line_smooth
        .y(() => y(50))

    text_path_50_50
        .transition(t0)
        .attr("d", half_max_mps_line)
    mask
        .transition(t0)
        .attr("d", max_mps_area)

    yLabel
        .transition(t0)
        .text("% of Women MPs")

    // ----------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗    ██████╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ╚════██╗
    // ███████║██║        ██║        █████╔╝
    // ██╔══██║██║        ██║       ██╔═══╝
    // ██║  ██║╚██████╗   ██║       ███████╗
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚══════╝
    // Zoom into modern history on x axis & hide area paths so that only women MPs in the UK line is left
    // ----------------------------------------------------------------------------
    var countryColors = d3.scaleOrdinal(d3.schemeCategory20)

    // Scale axis to focus on modern history
    xAxis.scale(x.domain([new Date(1990, 1, 1), new Date(2017, 12, 1)]))

    var t1 = t0.transition()
        .duration(no_transition ? 500 : 1000)

    gX
        .transition(t1)
        .call(xAxis)

    max_mps_path_area
        .transition(t1)
        .style("opacity", 0)
        .remove()

    max_mps_path
        .transition(t1)
        .style("opacity", 0)
        .remove()

    total_women_mps_path
        .transition(t1)
        .attr("d", total_women_mps_line)

    total_women_mps_path_area
        .transition(t1)
        .style("opacity", 0)
        .attr("d", total_women_mps_area)
        .remove()

    electionRects
        .transition(t1)
        .style("opacity", 0)
        .remove()

    d3.selectAll(".women-label,.men-label")
        .transition(t1)
        .style("opacity", 0)
        .remove()

    // ------------------------------------------------------------------------
    //  █████╗  ██████╗████████╗    ██████╗
    // ██╔══██╗██╔════╝╚══██╔══╝    ╚════██╗
    // ███████║██║        ██║        █████╔╝
    // ██╔══██║██║        ██║        ╚═══██╗
    // ██║  ██║╚██████╗   ██║       ██████╔╝
    // ╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚═════╝
    // Draw women MP percentage lines from other countries, one by one
    // ----------------------------------------------------------------------------

    var women_in_govt_line = d3.line()
        .curve(d3.curveBasis)
        .x(d => x(d.year))
        .y(d => y(d.women_pct))

    // Replace data about UK with more precise data
    women_in_govt_data
        .filter((d) => d.key == "United Kingdom")[0].values = number_women_over_time_data
            .map(d => {
                return {
                    year: d.year,
                    women_pct: d.women_pct,
                    country: "United Kingdom"
                }
            })

    women_in_govt_paths = slide3Group
        .selectAll(".women-in-govt-path")
        .data(women_in_govt_data)
        .enter()
        .append("path")
        .attr("d", function (d) { return women_in_govt_line(d.values) })
        .attr("class", "women-in-govt-path")
        .attr("id", d => d.key.replace(/[^a-zA-Z0-9s]/g, ""))
        .style("stroke", d => d.key == "United Kingdom" ? colors["Hover"] : countryColors(d.key))
        .style("stroke-width", lineThickness * 2)
        .style("fill", "none")
        .style("opacity", 1)
        .attr("stroke-dasharray", function () {
            return this.getTotalLength()
        })
        .attr("stroke-dashoffset", function () {
            return this.getTotalLength()
        })

    var t2 = t1.transition()
        .duration(no_transition ? 1000 : 2000)

    // Move tooltip to better location
    d3.select("#tooltip")
        .style("transform", "translate(50vw, 20vh)")
        .style("transform-origin", "50% 50%")

    // Start drawing all the other countries, one by one, speeding up as we go along
    var country_on_screen = []
    women_in_govt_paths
        .transition(t2)
        .delay((d, i) => no_transition ? 0 : (2200 + i * 1000 - Math.pow(i, 1.5) * 100))
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0)
        .style("opacity", d => d.key == "United Kingdom" ? 1.0 : 0.5)
        .style("stroke-width", d => d.key == "United Kingdom" ? 1.5 * lineThickness : lineThickness / 2)
        .on("start", d => {
            if (current_slide == 2) {
                d3.select("#tooltip")
                    .style("opacity", 1)

                // Show relevant tooltip info
                var gender_ratio = 100 / d.values.slice(-1)[0].women_pct - 1
                tooltip.innerHTML = `
                            <div class="slide3-tooltip">
                                <h1 style="background-color: ${d.values.slice(-1)[0].country == "United Kingdom" ? colors["Hover"] : countryColors(d.values.slice(-1)[0].country)}">${d.values.slice(-1)[0].country}</h1>
                                For every <span class="female">female</span> MP, there were
                                <div class="gender-ratio">${gender_ratio.toFixed(1)}</div> <span class="male">male</span> MPs in ${d.values.slice(-1)[0].year.getFullYear()}.
                            </div>`
            }
        })
        .on("end", (d) => {
            // Record that the country is now visible on screen so that we can toggle its hover methods
            country_on_screen.push(d.key)
            // If country is the UK, then we can get rid of the total women mps line
            if (d.key == "United Kingdom") total_women_mps_path.remove()
        })
    var focus = slide3Group.append("g")
        .attr("transform", "translate(-100,-100)")
        .attr("class", "focus")

    focus.append("circle")
        .attr("r", 3.5)

    focus.append("text")
        .attr("y", -10)

    var voronoiGroup = slide3Group.append("g")
        .attr("class", "voronoi")

    var voronoi = d3.voronoi()
        .x(function (d) { return x(d.year) })
        .y(function (d) { return y(d.women_pct) })
        .extent([
            [-margin.left, -margin.top],
            [width + margin.right, height + margin.bottom]
        ])

    voronoiGroup.selectAll("path")
        .data(voronoi.polygons(d3.merge(women_in_govt_data.map(function (d) { return d.values }))))
        .enter()
        .append("path")
        .attr("d", function (d) { return d ? "M" + d.join("L") + "Z" : null })
        .attr("fill", "none")
        // .attr("stroke", "red")
        .attr("pointer-events", "all")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)

    function mouseover(d) {
        // If country line is on screen, then enable mouseover
        if (country_on_screen.indexOf(d.data.country) > -1) {
            // Get mouse positions
            var mousePos = d3.mouse(this)

            d3.select("#tooltip")
                .style("opacity", 1)
                .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth / 2,
                    width - tooltip.offsetWidth / 2 - margin.right),
                0 + margin.left)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight - 20,
                    height + tooltip.offsetHeight - 20), margin.top)}px)`)
                .style("pointer-events", "none")
            // Show relevant tooltip info
            var gender_ratio = 100 / d.data.women_pct - 1
            tooltip.innerHTML = `
                            <div class="slide3-tooltip">
                                <h1 style="background-color: ${d.data.country == "United Kingdom" ? colors["Hover"] : countryColors(d.data.country)};">${d.data.country}</h1>
                                For every <span class="female">female</span> MP, there were
                                <div class="gender-ratio">${gender_ratio.toFixed(1)}</div> <span class="male">male</span> MPs in ${d.data.year.getFullYear()}.
                            </div>`
            d.line = d3.select("#" + d.data.country.replace(/[^a-zA-Z0-9s]/g, ""))
            d.line
                .style("stroke-width", d => d.key == "United Kingdom" ? 2 * lineThickness : lineThickness)
                .style("opacity", 1)

            // d.line.parentNode.appendChild(d.line);
            // focus.attr("transform", "translate(" + x(d.data.year) + "," + y(d.data.women_pct) + ")");
            // focus.select("text")
            //     .text(d.data.country);
        }
    }

    function mouseout(d) {
        if (country_on_screen.indexOf(d.data.country) > -1) {
            d.line
                .style("stroke-width", d => d.key == "United Kingdom" ? 1.5 * lineThickness : lineThickness / 2)
                .style("opacity", d => d.key == "United Kingdom" ? 1.0 : 0.5)
            // focus.attr("transform", "translate(-100,-100)")
        }
    }
}

// ----------------------------------------------------------------------------
// TRANSITION TO FOURTH SLIDE, EITHER WITH OR WITHOUT FANCY TRANSITIONS
// ----------------------------------------------------------------------------
function to_fourth_slide(current_slide) {
    "use strict"
    // Increment lastTransitioned counter if it is less than 0
    if (lastTransitioned < 3) {
        lastTransitioned = 3
    }
    var t0 = svg
        .transition()
        .duration(1000)

    // Different actions depending on which slide we're coming from
    switch (current_slide) {
    case 0:
        // If we're coming from the first slide
        canvas
            .style("opacity", 0)
            .style("pointer-events", "none")
        break

    case 1:
        // If we're coming from the second slide
        t0.select("#slide2-group")
            .style("opacity", 0)
            .remove()
        break

    case 2:
        // Fade all objects belonging to third slide
        d3.select("#slide2-group")
            .style("opacity", 0)

        t0.select("#slide3-group")
            .style("opacity", 0)
            .remove()
        break
    case 4:
        // Fade canvas
        canvas
            .style("opacity", 0)
            .style("pointer-events", "none")

        d3.selectAll("#floating-topic, .slide5-dropdown, .x-custom-axis")
            .style("opacity", 0)
            .transition()
            .delay(500)
            .on("end", function () { this.remove() })

        break
    }

    // Remove Election rectangles
    electionRects
        .transition(t0)
        .style("opacity", 0)
        .remove()

    gX
        .transition(t0)
        .style("opacity", 0)
    gY
        .transition(t0)
        .style("opacity", 0)

    xLabel
        .transition(t0)
        .style("opacity", 0)
    yLabel
        .transition(t0)
        .style("opacity", 0)

    d3.select("#tooltip")
        .transition(t0)
        .style("opacity", 0)
        .on("end", function () {
            fourth_slide(false)
        })

}

// ----------------------------------------------------------------------------
// ███████╗ ██████╗ ██╗   ██╗██████╗ ████████╗██╗  ██╗    ███████╗██╗     ██╗██████╗ ███████╗
// ██╔════╝██╔═══██╗██║   ██║██╔══██╗╚══██╔══╝██║  ██║    ██╔════╝██║     ██║██╔══██╗██╔════╝
// █████╗  ██║   ██║██║   ██║██████╔╝   ██║   ███████║    ███████╗██║     ██║██║  ██║█████╗
// ██╔══╝  ██║   ██║██║   ██║██╔══██╗   ██║   ██╔══██║    ╚════██║██║     ██║██║  ██║██╔══╝
// ██║     ╚██████╔╝╚██████╔╝██║  ██║   ██║   ██║  ██║    ███████║███████╗██║██████╔╝███████╗
// ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝
// Go to the fourth slide
// ----------------------------------------------------------------------------
function fourth_slide() {

    // First remove old div
    d3.select("#slide4")
        .remove()
    // Add a new div that goes over everything to store contents of this slide
    d3.select("body")
        .append("div")
        .attr("id", "slide4")
        .html(`<div class="slide4-tooltip"><h1 style='background-color: ${colors["Green"]};'>Topics mentioned in parliament by
    <div id="slide4-mp-dropdown" class="ui inline dropdown search">
    <div class="text"></div> <i class="dropdown icon"></i>
  </div>
</h1>
    <div class="speech-flex-row">
    <div class="mp-image-parent" id="slide4-mp-image">
    </div>
    <div class="mp-name-debate">
    <div class="mp-name" id="slide4-mp-name"></div>
    <div class="speech-debate" id="slide4-speech-debate"></div>
    </div>
    <button class="ui icon button" onclick="update_speech_tooltip()"><i class="random big icon"></i></button>
    </div>
    <p class="blockquote" id="slide4-speech"></p>
    <svg id="slide4-speech-topic-bar"></svg></div>`)


    d3.select("#slide4")
        .transition()
        .delay(1000)
        .style("opacity", 1)

    // Set width based on header width
    topic_bar_width = document.querySelector("#slide4 > div > h1")
        .offsetWidth
    topic_bar_height = 30
    d3.select("#slide4-speech-topic-bar")
        .attr("width", topic_bar_width)
        .attr("height", topic_bar_height)

    // Load mp dropdown with the list of mps
    $("#slide4-mp-dropdown")
        .dropdown({
            values: speech_samples_data.map((d, i) => ({
                name: `<i class="${d.values[0].is_female ? "female" : "male"} fitted inverted grey icon" style="margin-right: 0.3rem !important"></i>` + d.key,
                value: i,
                selected: i == 0,
            })),
            fullTextSearch: true
        })
    // Default to the first MP (Caroline Lucas)
    $("#slide4-mp-dropdown")
        .dropdown("set selected", "0")

    update_speech_tooltip()
    $("#slide4-mp-dropdown")
        .dropdown("setting", "onChange", function (value) {
            if (selected_mp != value) {
                selected_mp = value
                update_speech_tooltip()
            }
        })
}

// Define scales for topics if not yet defined
function define_topic_scales() {
    "use strict"
    if (topicColorScale == null) {
        // Find all unique topics and use that for domain
        topicColorScale = d3.scaleOrdinal(d3.schemeCategory20)
            .domain([...new Set(speech_samples_data
                .map(d => d.values
                    .map(s => Object.keys(s.topics))
                    .reduce((a, b) => a.concat(b)))
                .reduce((a, b) => a.concat(b)))])
    }

    if (topicBarScale == null) {
        topicBarScale = d3.scaleLinear()
            .domain([0, 1])
    }
    topicBarScale.range([0, topic_bar_width])
}

// Function to update the tooltip with randomnly chosen speeches
function update_speech_tooltip() {
    "use strict"
    // Define color scale
    define_topic_scales()

    // Randomly choose a new speech from the selected MP
    var chosen_mp = speech_samples_data[selected_mp || 0].values

    var chosen_speech = chosen_mp[Math.floor(Math.random() * chosen_mp.length)]
    var old_speech = chosen_speech
    while (old_speech == chosen_speech) {
        chosen_speech = chosen_mp[Math.floor(Math.random() * chosen_mp.length)]
    }

    // Fill in all the blanks
    d3.select("#slide4-mp-image")
        .html(`${typeof mp_base64_data[chosen_speech.mp_id] === "undefined" ? "" : "<img class=\"mp-image-blurred\" src=\"data:image/jpeg;base64," + mp_base64_data[chosen_speech.mp_id] + "\" />" +
    "<img class=\"mp-image\" src=\"./mp-images/mp-" + chosen_speech.mp_id + ".jpg\" style=\"opacity: ${typeof d.loaded == 'undefined' ? 0 : d.loaded;d.loaded = 1;};\" onload=\"this.style.opacity = 1;\" />"}
                `)

    d3.select("#slide4-mp-name")
        .html(chosen_speech.mp_name)
    d3.select("#slide4-speech-debate")
        .html("on " + chosen_speech.debate_title + " (" + ((new Date(chosen_speech.date))
            .toLocaleDateString("en-GB", { year: "numeric", month: "short" }) + ")"))
    d3.select("#slide4-speech")
        .html(chosen_speech.body)

    // Sum up remaining fraction
    chosen_speech.topics.others = 1 - Object.entries(chosen_speech.topics)
        .filter(d => d[0] != "others")
        .map(d => d[1])
        .reduce((a, b) => a + b)

    // Stack topics in speech to make a stacked horizontal bar graph
    var stack = d3.stack()
        .keys(Object.keys(chosen_speech.topics))

    var stacked = stack([chosen_speech.topics])

    // JOIN new data with old elements
    var topic_bar = d3.select("#slide4-speech-topic-bar")
        .selectAll(".rect-fg")
        .data(stacked)

    // EXIT old elements not present in new data.
    topic_bar
        .exit()
        .transition()
        .duration(1000)
        .attr("x", topicBarScale(1))
        .attr("height", topic_bar_height)
        .style("opacity", 0)
        .remove()

    // UPDATE old elements present in new data.
    topic_bar
        .attr("height", topic_bar_height)
        .transition()
        .style("opacity", 1)
        .attr("fill", d => d.key == "others" ? colors["Hover"] : topicColorScale(d.key))
        .attr("x", d => topicBarScale(d[0][0]))
        .attr("width", d => (topicBarScale(d[0][1]) - topicBarScale(d[0][0])))
        .attr("title", d => `${d.key}: ${ Math.round(Number(d[0].data[d.key] * 100))}%`)

    // ENTER new elements present in new data.
    topic_bar
        .enter()
        .append("rect")
        .attr("class", "rect-fg")
        .attr("fill", d => d.key == "others" ? colors["Hover"] : topicColorScale(d.key))
        .attr("x", topicBarScale(1))
        .attr("height", topic_bar_height)
        .transition()
        .style("opacity", 1)
        .attr("x", d => topicBarScale(d[0][0]))
        .attr("width", d => (topicBarScale(d[0][1]) - topicBarScale(d[0][0])))
        .attr("y", 0)
        .attr("title", d => `${d.key}: ${ Math.round(Number(d[0].data[d.key] * 100))}%`)

    // JOIN new data with old elements
    var topic_bar_label = d3.select("#slide4-speech-topic-bar")
        .selectAll(".rect-label")
        .data(stacked)

    // EXIT old elements not present in new data.
    topic_bar_label
        .exit()
        .transition()
        .duration(1000)
        .attr("x", topicBarScale(1))
        .style("opacity", 0)
        .remove()

    function adjust_text_width(d) {
        var text = d3.select(this)
            .text(d.key)
        var bar_width = topicBarScale(d[0][1]) - topicBarScale(d[0][0])
        var needs_elipsis = false
        while (text.node()
            .getComputedTextLength() > bar_width) {
            if (bar_width <= 0) break
            text.text(text.text()
                .slice(0, -1))
            needs_elipsis = true
        }
        if (needs_elipsis) text.text(text.text()
            .trim()
            .slice(0, -2) + "...")
    }

    // UPDATE old elements present in new data.
    topic_bar_label
        .transition()
        .attr("x", d => 5 + topicBarScale(d[0][0]))
        .each(adjust_text_width)

    // ENTER new elements present in new data.
    topic_bar_label
        .enter()
        .append("text")
        .attr("class", "rect-label")
        .attr("x", topicBarScale(1))
        .attr("alignment-baseline", "middle")
        .transition()
        .attr("x", d => 5 + topicBarScale(d[0][0]))
        .attr("y", topic_bar_height / 2)
        .each(adjust_text_width)

    // // Put a title on the "other" segment
    // d3.select(".rect-bg")
    //     .attr("title", `other: ${ Math.round(Number((1-stacked.slice(-1)[0][0][1]) * 100))}%`)

    // Add tooltips for all the topic segments
    $(".rect-fg") //,.rect-bg")
        .popup({
            duration: 100,
            position: "top right",
            transition: "fade",
            variation: "inverted"
        })
}

// ----------------------------------------------------------------------------
// TRANSITION TO FIFTH SLIDE, EITHER WITH OR WITHOUT FANCY TRANSITIONS
// ----------------------------------------------------------------------------
function to_fifth_slide(current_slide) {
    "use strict"
    var t0 = svg
        .transition()
        .duration(1000)

    // Different actions depending on which slide we're coming from
    switch (current_slide) {
    case 0:
        // If we're coming from the first slide
        t0.select("#slide1-group")
            .style("opacity", 0)
            .remove()

        break

    case 1:
        // If we're coming from the first slide
        t0.select("#slide2-group")
            .style("opacity", 0)
            .remove()
        break

    case 2:
        // Fade all objects belonging to third slide
        d3.select("#slide2-group")
            .style("opacity", 0)

        t0.select("#slide3-group")
            .style("opacity", 0)
            .remove()
        break
    case 5:
        // Fade out sixth slide
        d3.select("#slide6-group")
            .style("opacity", 0)
        break
    }

    // Fade tooltip
    d3.select("#tooltip")
        .transition(t0)
        .style("opacity", 0)
        .on("end", function () { this.innerHTML = "" })


    // Remove Election rectangles
    electionRects
        .transition(t0)
        .style("opacity", 0)
        .on("end", function () {
            this.remove()
        })

    gX
        .style("opacity", 0)
    gY
        .style("opacity", 0)

    xLabel
        .style("opacity", 0)
    yLabel
        .style("opacity", 0)

    // Increment lastTransitioned counter if it is less than 0
    if (lastTransitioned < 4) {
        lastTransitioned = 4
        fifth_slide(false)
    } else {
        fifth_slide(true)
    }

}
// ----------------------------------------------------------------------------
// ███████╗██╗███████╗████████╗██╗  ██╗    ███████╗██╗     ██╗██████╗ ███████╗
// ██╔════╝██║██╔════╝╚══██╔══╝██║  ██║    ██╔════╝██║     ██║██╔══██╗██╔════╝
// █████╗  ██║█████╗     ██║   ███████║    ███████╗██║     ██║██║  ██║█████╗
// ██╔══╝  ██║██╔══╝     ██║   ██╔══██║    ╚════██║██║     ██║██║  ██║██╔══╝
// ██║     ██║██║        ██║   ██║  ██║    ███████║███████╗██║██████╔╝███████╗
// ╚═╝     ╚═╝╚═╝        ╚═╝   ╚═╝  ╚═╝    ╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝
// Go to the fifth slide
// ----------------------------------------------------------------------------
function fifth_slide(no_transition = false) {

    d3.select("#topic-dropdown")
        .remove()

    d3.selectAll(".slide5-dropdown")
        .remove()

    d3.select("#floating-topic")
        .remove()

    wrapper.select(".x-custom-axis")
        .remove()
    wrapper.append("g")
        .attr("class", "x-custom-axis")
        .attr("transform", "translate(0," + height + ")")

    // Switching from 4th slide
    try {
        // Get the position of the first label in the topic selection
        var label_pos = d3.select("#slide4-speech-topic-bar > .rect-fg")
            .node()
            .getBoundingClientRect()

        // Append a new svg to the document containing a copy of this label
        d3.select("body")
            .append("svg")
            .attr("id", "floating-topic")
            .style("top", 0)
            .style("left", 0)
            .style("position", "fixed")
            .style("transform", `translate(${label_pos.x}px, ${label_pos.y}px) translateZ(0)`)
            .style("transition", "transform 1s ease-in-out 1s, opacity 1s ease-in-out")
            .node()
            .appendChild(d3.select("#slide4-speech-topic-bar > .rect-fg")
                .node()
                .cloneNode())
            .parentNode
            .appendChild(d3.select("#slide4-speech-topic-bar > .rect-label")
                .node()
                .cloneNode())

        // Fade out slide4
        d3.select("#slide4")
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .on("end", function () { this.remove() })

        // Resize the label rect
        d3.select("#floating-topic")
            .attr("width", label_pos.width)
            .transition()
            .delay(1000)
            .duration(1000)
            .attr("width", width / 2)

        // Set the label text because it doesn't get copied for some reason
        d3.select("#floating-topic > .rect-label")
            .html(function () {
                selected_topic = this.parentElement.getElementsByClassName("rect-fg")[0].getAttribute("title")
                    .split(":")[0]
                return selected_topic
            })

        // Finally, move the label to a better location
        d3.timeout(() => {
            d3.select("#floating-topic")
                .style("transform", `translate(${width/4}px, ${margin.top*2}px)`)
                .transition()
                .delay(1000)
                .style("fill", "white")
                .select(".rect-fg")
                .style("opacity", 0)
        }, 1000)

    } catch (e) {
        // Not coming from slide 4 so we can just put text in the right location without animation

        if (lastTransitioned < 5) {
            // Append a new svg to the document containing a copy of this label
            d3.select("body")
                .append("svg")
                .attr("id", "floating-topic")
                .style("top", 0)
                .style("left", 0)
                .style("position", "absolute")
                .style("transform", `translate(${width/4 + 20}px, ${margin.top*2 + 10}px) translateZ(0)`)
                .style("transition", " opacity 1s ease-in-out")
                .append("text")
                .attr("class", "rect-label")
                .attr("alignment-baseline", "middle")
                .attr("x", 5)
                .attr("y", 15)
                .style("fill", "white")
                .html(selected_topic)
        }

    }

    // Wait for 3 secs before doing this next bit
    d3.timeout(() => {
        // Enable canvas
        d3.select("#visible-canvas")
            .style("opacity", 1)
            .style("display", null)
            .style("pointer-events", "all")

        // Add a dropdown to select different topics
        if (lastTransitioned > 4) {
            d3.select("body")
                .insert("select", ":first-child")
                .attr("id", "topic-dropdown")
                .on("change", update_fifth_slide)
                .selectAll(".topic")
                .data(baked_positions_data.map(topic => topic.key))
                .enter()
                .append("option")
                .attr("selected", d => d == selected_topic ? "selected" : null)
                .attr("value", d => d)
                .text(d => d.toUpperCase())

            $("#topic-dropdown")
                .dropdown()
            d3.select("#topic-dropdown")
                .node()
                .parentNode
                .className += " slide5-dropdown"

            d3.select(".slide5-dropdown")
                .style("transform", `translate(${width/4}px, ${margin.top*2}px)`)

        }


        // Scales for this data
        slide5_xScale = d3.scaleLinear()
            .domain([-300, 150])
            .range([0, width + margin.left + margin.right])

        slide5_yScale = d3.scaleLinear()
            .domain([0, 0.3])
            .range([height, 0])

        y = slide5_yScale

        d3.select("#slide5-group")
            .remove()

        // Create group for this slide
        // slide5Group = zoomedArea
        //     .append("g")
        //     .attr("id", "slide5-group")
        // .attr("transform", "translate(" + margin.right + "," + margin.top + ")")
        // .attr("transform", "scale(" + width/1900 + ")")

        // Call function initially
        update_fifth_slide(no_transition)
    }, no_transition ? 500 : 3000)
}

function update_fifth_slide(no_transition) {
    // Get value of topic dropdown
    try {
        selected_topic = d3.select("#topic-dropdown")
            .property("value")
    } catch (err) {
        let topics = Object.keys(topic_medians_data)
        // If there is no selected topic or no dropdown, select a random one
        selected_topic = selected_topic || topics[Math.floor(Math.random() * topics.length)]
    }

    // Change the floating label
    d3.select("#floating-topic > .rect-label")
        .html(selected_topic)

    var baked_data = baked_positions_data.filter(d => d.key == selected_topic)[0].values

    nodes_male.map(function (d) {
        var n = baked_data.filter(n => n.id == d.id)[0]
        d.x = slide5_xScale(n.x) - 10
        d.y = slide5_yScale(n.y)
    })

    nodes_female.map(function (d) {
        var n = baked_data.filter(n => n.id == d.id)[0]
        d.x = slide5_xScale(n.x) + 10
        d.y = slide5_yScale(n.y)
    })


    // transition
    var t0 = d3.transition()
        .duration(no_transition ? 3000 : 3000)

    // transition
    var t1 = t0.transition()
        .delay(no_transition ? 1000 : 2000)
        .duration(1000)

    // JOIN
    circle_male = dataContainer
        .selectAll(".male-node")
        .data(nodes_male)

    // UPDATE
    circle_male
        .transition(t0)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)

    // ENTER
    circle_male
        .enter()
        .append("custom")
        .attr("class", "male-node")
        .attr("r", 1.8)
        .attr("cx", d => no_transition ? d.x : slide5_xScale(0))
        .attr("cy", d => d.y)
        .attr("opacity", 0.0)
        .attr("hiddenFillStyle", function (d) {
            if (!d.hiddenCol) {
                d.hiddenCol = genColor()
                colourToNode_slide5[d.hiddenCol] = d
            }
            // Here you (1) add a unique colour as property to each element
            // and(2) map the colour to the node in the colourToNode_slide5-map.
            return d.hiddenCol
        })
        .transition(t0)
        .delay((d, i) => no_transition ? 0 : (100 * Math.sqrt(i)))
        .attr("opacity", 0.7)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)

    // Female nodes
    // JOIN
    circle_female = dataContainer.selectAll(".female-node")
        .data(nodes_female)

    // UPDATE
    circle_female
        .transition(t0)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)

    // ENTER
    circle_female
        .enter()
        .append("custom")
        .attr("class", "female-node")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 1.8)
        .attr("cx", d => no_transition ? d.x : slide5_xScale(0))
        .attr("cy", d => d.y)
        .attr("opacity", 0.0)
        .attr("hiddenFillStyle", function (d) {
            if (!d.hiddenCol) {
                d.hiddenCol = genColor()
                colourToNode_slide5[d.hiddenCol] = d
            }
            // Here you (1) add a unique colour as property to each element
            // and(2) map the colour to the node in the colourToNode-map.
            return d.hiddenCol
        })
        .transition(t0)
        .delay((d, i) => no_transition ? 0 : (100 * Math.sqrt(i)))
        .attr("opacity", 0.7)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)

    // Median connector line
    // Join
    var median_connector_line = dataContainer
        .selectAll(".median-connector")
        .data([topic_medians_data[selected_topic]])

    // Update
    median_connector_line
        .transition(t0)
        .attr("y1", d => slide5_yScale(d["female"]))
        .attr("y2", d => slide5_yScale(d["male"]))

    // Enter
    median_connector_line
        .enter()
        .append("custom")
        .attr("class", "median-connector")
        .attr("x1", slide5_xScale(0))
        .attr("x2", slide5_xScale(0))
        .transition(t1)
        .attr("y1", d => slide5_yScale(d["female"]))
        .attr("y2", d => slide5_yScale(d["male"]))


    // Male median fraction
    // Join
    var male_median_circle = dataContainer
        .selectAll(".male-median")
        .data([topic_medians_data[selected_topic]["male"]])

    // Update
    male_median_circle
        .transition(t0)
        .attr("cy", d => slide5_yScale(d))

    // Enter
    male_median_circle
        .enter()
        .append("custom")
        .attr("class", "male-median")
        .attr("cx", slide5_xScale(0))
        .attr("cy", slide5_yScale(0))
        .attr("r", 3)
        .attr("opacity", 0)
        .attr("hiddenFillStyle", function (d) {
            if (!d.hiddenCol) {
                var hiddenCol = genColor()
                colourToNode_slide5[hiddenCol] = { male_median: d }
            }
            // Here you (1) add a unique colour as property to each element
            // and(2) map the colour to the node in the colourToNode-map.
            return hiddenCol
        })
        .transition(t1)
        .attr("opacity", 1)
        .attr("cy", d => slide5_yScale(d))


    // Female median fraction
    // Join
    var female_median_circle = dataContainer
        .selectAll(".female-median")
        .data([topic_medians_data[selected_topic]["female"]])

    // Update
    female_median_circle
        .transition(t0)
        .attr("cy", d => slide5_yScale(d))

    // Enter
    female_median_circle
        .enter()
        .append("custom")
        .attr("class", "female-median")
        .attr("cx", slide5_xScale(0))
        .attr("cy", slide5_yScale(0))
        .attr("r", 3)
        .attr("opacity", 0)
        .attr("hiddenFillStyle", function (d) {
            if (!d.hiddenCol) {
                var hiddenCol = genColor()
                colourToNode_slide5[hiddenCol] = { female_median: d }
            }
            // Here you (1) add a unique colour as property to each element
            // and(2) map the colour to the node in the colourToNode-map.
            return hiddenCol
        })
        .transition(t1)
        .attr("opacity", 1)
        .attr("cy", d => slide5_yScale(d))

    // Clear the hidden canvas so that we don't catch the wrong hover info
    context_hidden.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)

    window.draw = function (context, hidden = false) {
        context.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)

        dataContainer.selectAll("custom.male-node")
            .each(function () {
                let node = d3.select(this)
                context.fillStyle = hidden ? node.attr("hiddenFillStyle") : hexToRGBA(colors["Lab"], node.attr("opacity"))
                context.beginPath()
                context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI)
                context.fill()
            })

        dataContainer.selectAll("custom.female-node")
            .each(function () {
                let node = d3.select(this)
                context.fillStyle = hidden ? node.attr("hiddenFillStyle") : hexToRGBA(colors["Hover"], node.attr("opacity"))
                context.beginPath()
                context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI)
                context.fill()
            })

        dataContainer.select("custom.median-connector")
            .each(function () {
                let node = d3.select(this)
                context.beginPath()
                context.lineWidth = 1
                context.strokeStyle = "white"
                context.moveTo(node.attr("x1"), node.attr("y1"))
                context.lineTo(+node.attr("x2"), node.attr("y2"))
                context.stroke()
            })

        dataContainer.select("custom.male-median")
            .each(function () {
                let node = d3.select(this)
                context.fillStyle = hidden ? node.attr("hiddenFillStyle") : hexToRGBA(colors["Lab"], node.attr("opacity"))
                context.beginPath()
                context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI)
                context.fill()
            })

        dataContainer.select("custom.female-median")
            .each(function () {
                let node = d3.select(this)
                context.fillStyle = hidden ? node.attr("hiddenFillStyle") : hexToRGBA(colors["Hover"], node.attr("opacity"))
                context.beginPath()
                context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI)
                context.fill()
            })
    }

    // Animate node entrances
    var t = d3.timer((elapsed) => {
        draw(context, false)
        if ((initial_slide5 & (elapsed > 5000)) | (initial_slide5 != true & (elapsed > 1000))) {
            t.stop()
            draw(context)
            // Draw hidden canvas nodes to catch interactions
            draw(context_hidden, true)
            // First time we run this, we record the fact it was run
            initial_slide5 = false
        }
    })

    window.draw_custom_labels = function () {
        let xlabels = d3.selectAll(".x-axis text")
            .nodes()
        let female_label = xlabels[xlabels.map(d => +d.textContent)
            .indexOf(8)]
        if (typeof (female_label) == "undefined") {
            female_label = xlabels.filter(d => +d.textContent > 0)[0]
        }
        let male_label = xlabels[xlabels.map(d => +d.textContent)
            .indexOf(-8)]
        if (typeof (male_label) == "undefined") {
            male_label = xlabels.filter(d => +d.textContent < 0)
            male_label = male_label[male_label.length - 1]
        }

        // Clear old labels
        wrapper.select(".x-custom-axis")
            .selectAll("*")
            .remove()

        // Draw axis labels for men and women if within range
        if (typeof (male_label) != "undefined") {
            wrapper.select(".x-custom-axis")
                .append("text")
                .attr("class", "x-label x-custom-label")
                .attr("transform", male_label.parentNode.getAttribute("transform"))
                .attr("dy", 10)
                .style("text-anchor", "end")
                .style("fill", colors["Lab"])
                .html("Men")
        }

        if (typeof (female_label) != "undefined") {
            wrapper.select(".x-custom-axis")
                .append("text")
                .attr("class", "x-label x-custom-label")
                .attr("transform", female_label.parentNode.getAttribute("transform"))
                .attr("dy", 10)
                .style("text-anchor", "start")
                .style("fill", colors["Hover"])
                .html("Women")
        }

    }
    // Update axis ticks and draw custom labels for Men and Women on x-axis
    gX.call(d3.axisBottom(slide5_xScale)
        .ticks(20))
    draw_custom_labels()

    // mouseover function for getting MP info
    function mpMouseover() {
        // Get mouse positions from the main canvas.
        var mousePos = d3.mouse(this)

        // Pick the colour from the mouse position.
        context_hidden.save()
        var col = context_hidden.getImageData(mousePos[0] * ratio, mousePos[1] * ratio, 1, 1)
            .data
        context_hidden.restore()
        // Then stringify the values in a way our map-object can read it.
        var colKey = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")"
        // Get the data from our map!
        var nodeData = colourToNode_slide5[colKey]

        // Only show mouseover if MP is in toggled party or if no party is filtered
        if (typeof (nodeData) !== "undefined") {
            // If we're dealing with mp nodes
            if (typeof (nodeData.id) !== "undefined") {
                // For each point group, set tooltip to display on mouseover
                d3.select("#tooltip")
                    .style("opacity", 1)
                    .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth / 2,
                        width - tooltip.offsetWidth - margin.right),
                    0 + margin.left)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight - 20,
                        height + tooltip.offsetHeight - 20), margin.top)}px)`)
                    .style("pointer-events", "none")

                var partyLogo = partyHasLogo.indexOf(nodeData.party) != -1
                // Show relevant tooltip info
                tooltip.innerHTML = `
                            <div class="slide5-tooltip">
                    <h1 style="background-color: ${colorParty(nodeData.party)};">${nodeData.full_name}</h1>
                    <div class="body-container">
                    <div class="mp-image-parent">
                    ${typeof mp_base64_data[nodeData.id] === "undefined" ? "" : "<img class=\"mp-image-blurred\" src=\"data:image/jpeg;base64," + mp_base64_data[nodeData.id] + "\" />" +
                    "<img class=\"mp-image\" src=\"./mp-images/mp-" + nodeData.id + ".jpg\" style=\"opacity: ${typeof nodeData.loaded == 'undefined' ? 0 : nodeData.loaded;d.loaded = 1;};\" onload=\"this.style.opacity = 1;\" />"}
                    </div>
                    <p class="body">${(nodeData[selected_topic] * 100).toFixed(2)}% of ${nodeData.full_name}'s time spent on ${selected_topic}</p>
                    </div>
                    <div class="mp-party" style="opacity: ${partyLogo ? 0: 1}">${nodeData.party}</div>
                    ${partyLogo ? `<img class="mp-party-logo" alt="${nodeData.party} logo" style="opacity: ${partyLogo ? 1: 0}" src="./party_logos/${nodeData.party}.svg"/>` : ""}
</div>`
            } else {
                median_mouseover(nodeData, mousePos)
            }
        }
        d3.event.preventDefault()
    }

    canvas
        .on("mousemove", mpMouseover)
        .on("drag", mpMouseover)
        .on("touchend", mpMouseover)


    String.prototype.capitalize = function () {
        return this.charAt(0)
            .toUpperCase() + this.slice(1)
    }

    // Mouseover for medians
    function median_mouseover(d, mousePos) {
        let gender = Object.keys(d)[0].split("_")[0]
        d = Object.values(d)[0]
        d3.select("#tooltip")
            .style("opacity", 1)
            .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth / 2,
                width - tooltip.offsetWidth / 2 - margin.right),
            0 + margin.left)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight - 20,
                height + tooltip.offsetHeight - 20), margin.top)}px)`)
            .style("pointer-events", "none")

        // Show relevant tooltip info
        tooltip.innerHTML = `
                            <div class="slide5-tooltip">
                    <h1 style="background-color: ${gender == "female" ? colors["Hover"] : colors["Lab"]};">${gender.capitalize()}</h1>
                    The average ${gender.capitalize()} MP spends ${(d*100).toFixed(1)}% of ${gender == "male" ? "his" : "her"} time talking about ${selected_topic}.
</div>`
    }

}

// ----------------------------------------------------------------------------
// TRANSITION TO SIXTH SLIDE, EITHER WITH OR WITHOUT FANCY TRANSITIONS
// ----------------------------------------------------------------------------
function to_sixth_slide(current_slide) {
    "use strict"
    var t0 = svg
        .transition()
        .duration(1000)

    // Different actions depending on which slide we're coming from
    switch (current_slide) {
    case 0:
        // If we're coming from the first slide
        t0.select("#slide1-group")
            .style("opacity", 0)
            .remove()
        break

    case 1:
        // If we're coming from the second slide
        d3.select("#slide2-group")
            .style("opacity", 0)
        break

    case 2:
        // Fade all objects belonging to third slide
        d3.select("#slide2-group")
            .style("opacity", 0)

        t0.select("#slide3-group")
            .style("opacity", 0)
            .on("end", function () { this.remove() })
        break

    case 3:
        d3.select("#slide4")
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .on("end", function () { this.remove() })
        break

    case 4:
        d3.selectAll("#floating-topic, .slide5-dropdown, .x-custom-axis")
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .on("end", function () { this.remove() })
        break
    }

    // Fade tooltip
    d3.select("#tooltip")
        .transition(t0)
        .style("opacity", 0)
        .on("end", function () { this.innerHTML = "" })


    // Remove Election rectangles
    electionRects
        .transition(t0)
        .style("opacity", 0)
        .remove()


    if (lastTransitioned < 5) {
        // Change scales
        x = d3.scaleLinear()
            .range([0, width])
            .domain([0, 0.05])
        // Redraw axes
        xAxis = d3.axisBottom(x)
            .tickFormat(d => (d * 100)
                .toFixed(1) + "%")
    } else {
        // Use x scale at end of transition instead
        x = d3.scaleLinear()
            .range([0, width])
            .domain([-0.04, 0.04])
        // Redraw axes
        xAxis = d3.axisBottom(x)
            .tickFormat(d => (d * 100)
                .toFixed(0) + "%")
    }
    gX.transition()
        .call(xAxis)

    y = d3.scalePoint()
        .range([height, 0])
        .padding(1)


    // Increment lastTransitioned counter if it is less than 0
    if (lastTransitioned < 5) {
        t0.on("end", () => {
            sixth_slide(false)
            lastTransitioned = 5
        })
    } else {
        t0.on("end", () => sixth_slide(true))
    }

}

// ----------------------------------------------------------------------------
// ███████╗██╗██╗  ██╗████████╗██╗  ██╗    ███████╗██╗     ██╗██████╗ ███████╗
// ██╔════╝██║╚██╗██╔╝╚══██╔══╝██║  ██║    ██╔════╝██║     ██║██╔══██╗██╔════╝
// ███████╗██║ ╚███╔╝    ██║   ███████║    ███████╗██║     ██║██║  ██║█████╗
// ╚════██║██║ ██╔██╗    ██║   ██╔══██║    ╚════██║██║     ██║██║  ██║██╔══╝
// ███████║██║██╔╝ ██╗   ██║   ██║  ██║    ███████║███████╗██║██████╔╝███████╗
// ╚══════╝╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝
// SHOW HOW OFTEN EACH GENDER TALKS ABOUT EVERY TOPIC
// ----------------------------------------------------------------------------
function sixth_slide(no_transition = false) {
    // If we've already visited this slide, set no_transition to true
    no_transition = lastTransitioned >= 5

    if (no_transition == false) {
        // Remove elements from this slide if already created
        d3.select("#slide6-group")
            .remove()

        // Add group to hold sixth slide lines
        slide6Group = zoomedArea
            .append("g")
            .attr("id", "slide6-group")
    }

    // Hide canvas
    canvas
        .style("opacity", 0)
        .style("display", null)
        .style("pointer-events", "none")

    // remove dropdown
    d3.select("#topic-dropdown")
        .style("opacity", 0)
        .remove()

    // Set the topics that will appear on the y axis
    let sorted_topics = Object.entries(topic_medians_data)
        .sort((a, b) => (a[1]["female"] - a[1]["male"]) - (b[1]["female"] - b[1]["male"]))

    y.domain(sorted_topics.map(d => d[0]))
    yAxis = d3.axisLeft(y)
    gY.transition()
        .call(yAxis)

    // Hide axis line and ticks
    d3.select(".y-axis > path")
        .style("opacity", 0)

    d3.selectAll(".y-axis > .tick line")
        .style("opacity", 0)

    var t0 = d3.transition()
        .duration(1000)

    // Make y-axis topic labels all uppercase
    d3.selectAll(".y-axis > .tick text")
        .style("text-transform", "uppercase")

    // Only do the ollowing steps if we'e coming from slide 5
    if (lastTransitioned == 4) {
        // Only show selected topic's label for now
        d3.selectAll(".y-axis > .tick text")
            .style("opacity", d => d == selected_topic ? 1 : 0)

        // Draw svg version of median topic line for current topic
        var median_connector_line_svg = slide6Group
            .selectAll(".median-connector")
            .data([topic_medians_data[selected_topic]])

        median_connector_line_svg
            .enter()
            .append("line")
            .attr("class", "median-connector tmp")
            .attr("stroke-width", 1)
            .attr("x1", slide5_xScale(0))
            .attr("x2", slide5_xScale(0))
            .attr("y1", d => slide5_yScale(d["female"]))
            .attr("y2", d => slide5_yScale(d["male"]))
            .transition(t0)
            .attr("x1", d => x(d["female"]))
            .attr("x2", d => x(d["male"]))
            .attr("y1", y(selected_topic))
            .attr("y2", y(selected_topic))

        // Add hidden svg circle
        var male_median_circle_svg = slide6Group
            .selectAll(".male-median")
            .data([topic_medians_data[selected_topic]["male"]])

        male_median_circle_svg
            .enter()
            .append("circle")
            .attr("class", "male-median tmp")
            .attr("cx", slide5_xScale(0))
            .attr("cy", d => slide5_yScale(d))
            .attr("r", 3)
            .transition(t0)
            .attr("cx", d => { return x(d) })
            .attr("cy", y(selected_topic))

        // Add hidden svg circle
        var female_median_circle_svg = slide6Group
            .selectAll(".female-median")
            .data([topic_medians_data[selected_topic]["female"]])

        female_median_circle_svg
            .enter()
            .append("circle")
            .attr("class", "female-median tmp")
            .attr("cx", slide5_xScale(0))
            .attr("cy", d => slide5_yScale(d))
            .attr("r", 3)
            .transition(t0)
            .attr("cx", d => { return x(d) })
            .attr("cy", y(selected_topic))
            .on("end", () => {

                gX.style("opacity", 1)
                gY.style("opacity", 1)
                xLabel
                    .text("Average % of time spent on topic")
                    .style("opacity", 1)
                // yLabel.style("opacity", 1)
            })

    } else {
        var median_connector_line_svg = slide6Group
            .selectAll(".median-connector")
            .data(sorted_topics)

        // Add hidden svg circle
        var male_median_circle_svg = slide6Group
            .selectAll(".male-median")
            .data(sorted_topics)

        // Add hidden svg circle
        var female_median_circle_svg = slide6Group
            .selectAll(".female-median")
            .data(sorted_topics)

        xLabel
            .text("Average % of time spent on topic")
            .style("opacity", 1)

        gX.style("opacity", 1)
        gY.style("opacity", 1)
        yLabel.style("opacity", 0)

    } // endif no_transition == false

    // Next transition
    var t1 = t0.transition()
        .duration(500)


    if (no_transition == false) {
        // Add all the other topics too
        median_connector_line_svg
            .data(sorted_topics)
            .enter()
            .append("line")
            .attr("class", (d, i) => "median-connector topic-" + i)
            .attr("stroke-width", 1)
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y1", d => y(d[0]))
            .attr("y2", d => y(d[0]))
            .attr("opacity", 0)
            .transition(t1)
            .delay((d, i) => 1000 + i * 50)
            .attr("opacity", d => d[0] == selected_topic ? 0 : 1)
            .attr("x1", d => x(d[1]["female"]))
            .attr("x2", d => x(d[1]["male"]))

        male_median_circle_svg
            .data(sorted_topics)
            .enter()
            .append("circle")
            .attr("class", (d, i) => "male-median topic-" + i)
            .attr("r", 3)
            .attr("cx", x(0))
            .attr("cy", d => y(d[0]))
            .attr("opacity", 0)
            .transition(t1)
            .delay((d, i) => 1000 + i * 50)
            .attr("opacity", d => d[0] == selected_topic ? 0 : 1)
            .attr("cx", d => x(d[1]["male"]))

        female_median_circle_svg
            .data(sorted_topics)
            .enter()
            .append("circle")
            .attr("class", (d, i) => "female-median topic-" + i)
            .attr("r", 3)
            .attr("cx", x(0))
            .attr("cy", d => y(d[0]))
            .attr("opacity", 0)
            .transition(t1)
            .delay((d, i) => 1000 + i * 50)
            .attr("opacity", d => d[0] == selected_topic ? 0 : 1)
            .attr("cx", d => x(d[1]["female"]))

        var t2 = t1.transition()
            .delay(3400)
            .on("end", () => {
                slide6Group
                    .selectAll(".topic-" + sorted_topics.map(d => d[0])
                        .indexOf(selected_topic))
                    .attr("opacity", 1)
                slide6Group.selectAll(".tmp")
                    .remove()
                // Make all axis tick labels visible
                d3.selectAll(".y-axis > .tick text")
                    .style("opacity", 1)
                    .style("transition", "opacity 0.2s ease-in-out")
            })

        // Hover rects to catch mouseovers
        slide6Group
            .selectAll(".hover-rect")
            .data(sorted_topics)
            .enter()
            .append("rect")
            .attr("class", "hover-rect")
            .attr("x", x(0))
            .attr("y", d => y(d[0]) - y.step() / 2)
            .attr("width", width)
            .attr("height", y.step())
            .on("mouseover", (d, i) => {
                slide6Group.selectAll("circle.topic-" + i)
                    .attr("r", 6)
                slide6Group.select("line.topic-" + i)
                    .attr("stroke-width", 3)
            })
            .on("mouseout", (d, i) => {
                slide6Group.selectAll("circle.topic-" + i)
                    .attr("r", 3)
                slide6Group.select("line.topic-" + i)
                    .attr("stroke-width", 1)
            })
            .on("click", d => {
                selected_topic = d[0]
                new_slide = 4
                update_state()

            })

        // Switch to relative change view
        var t3 = t2.transition()
            .delay(1000)
            .on("end", () => {
                x.domain([-0.04, 0.04])
                xAxis = d3.axisBottom(x)
                    .tickFormat(d => (d * 100)
                        .toFixed(0) + "%")
                gX.transition()
                    .call(xAxis)
                    .on("end", () => {
                        var t_ = d3.transition()
                            .duration(1000)

                        slide6Group.selectAll(".median-connector")
                            .transition(t_)
                            .delay((d, i) => i * 50)
                            .attr("x1", d => x(d[1]["female"] - d[1]["male"]))
                            .attr("x2", x(0))

                        slide6Group.selectAll(".female-median")
                            .transition(t_)
                            .delay((d, i) => i * 50)
                            .attr("cx", d => d[1]["female"] - d[1]["male"] > 0 ? x(d[1]["female"] - d[1]["male"]) : x(0))

                        slide6Group.selectAll(".male-median")
                            .transition(t_)
                            .delay((d, i) => i * 50)
                            .attr("cx", d => d[1]["female"] - d[1]["male"] < 0 ? x(d[1]["female"] - d[1]["male"]) : x(0))
                            .on("end", () => d3.selectAll(".y-axis > .tick text")
                                .style("opacity", 0))

                    })

            })
        var t4 = t3.transition()
    } else {
        // Switch to relative change view in case this was skipped before
        slide6Group.selectAll(".median-connector")
            .attr("x1", d => x(d[1]["female"] - d[1]["male"]))
            .attr("x2", x(0))

        slide6Group.selectAll(".female-median")
            .attr("cx", d => d[1]["female"] - d[1]["male"] > 0 ? x(d[1]["female"] - d[1]["male"]) : x(0))

        slide6Group.selectAll(".male-median")
            .attr("cx", d => d[1]["female"] - d[1]["male"] < 0 ? x(d[1]["female"] - d[1]["male"]) : x(0))

        // Now fade in the slide
        t4 = d3.transition()
            .on("end", () => {
                slide6Group.style("opacity", 1)
            })
    }

    let label_pos = sorted_topics
        .map(d => d[1]["female"] - d[1]["male"] > 0)


    d3.selectAll(".y-axis > .tick text")
        .filter(d => Object.keys(topic_medians_data)
            .indexOf(d) != -1)
        .transition(t4)
        .delay(() => no_transition ? 0 : 3000)
        .duration(no_transition ? 1 : 1000)
        .style("text-anchor", (d, i) => {
            return label_pos[i] ? "end" : "start"
        })
        .attr("x", (d, i) => label_pos[i] ? x.domain([-0.04, 0.04])(-0.001) : x.domain([-0.04, 0.04])(0.001))
        .transition()
        .delay(500)
        .duration(500)
        .style("opacity", 1)
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
        .await(function (error,
            mps_over_time,
            number_women_over_time,
            total_mps_over_time,
            info_bubbles) {
            // Make global
            window.mps_over_time_data = mps_over_time
            window.number_women_over_time_data = number_women_over_time
            window.total_mps_over_time_data = total_mps_over_time
            var bisect = d3.bisector(function (a) {
                return a.year
            })
                .left
            number_women_over_time_data.forEach(d => {
                d.total_mps = total_mps_over_time_data[Math.max(0, bisect(total_mps_over_time_data, d.year) - 1)].total_mps
                d.women_pct = d.total_women_mps / d.total_mps * 100
            })
            window.info_bubbles_data = info_bubbles
            // INITIAL DRAW
            draw_graph()
        })

    // These files can download later because we don't need to wait for them
    // to load initial view
    d3.queue()
        .defer(d3.csv, "mp_base64.csv", function (d) {
            return {
                id: d.id,
                base64: d.base64
            }
        })
        .await(function (error, mp_base64) {
            // Turn d3 array into a pythonic dictionary
            mp_base64_data = {}
            for (var i = 0; i < mp_base64.length; i++) {
                mp_base64_data[mp_base64[i].id] = mp_base64[i].base64
            }
        })

    d3.queue()
        .defer(d3.csv, "women_in_govt.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d")
            return {
                year: parseDate(d.date),
                women_pct: +d.women_parliament,
                country: d.country
            }
        })
        .defer(d3.json, "speech_samples.json")
        .defer(d3.csv,
            "baked_positions.csv" + "?" + Math.floor(Math.random() * 1000)
        )
        .defer(d3.csv,
            "mp_topic_fraction.csv" + "?" + Math.floor(Math.random() * 1000)
        )
        .defer(d3.csv, "topic_medians.csv" + "?" + Math.floor(Math.random() * 100),
            function (d) {
                return {
                    topic: d.topic,
                    male: Math.pow(10, +d.male),
                    female: Math.pow(10, +d.female)
                }
            })
        .await(function (error, women_in_govt, speech_samples, baked_mp_positions, mp_topics, topic_medians) {
            // Group stats by country
            women_in_govt_data = d3.nest()
                .key(d => d.country)
                .entries(women_in_govt)

            // Group MP speeches by MP
            speech_samples_data = d3.nest()
                .key(d => d.mp_name)
                .entries(speech_samples)

            topic_medians_data = {}
            baked_positions_data = []
            var nodes = []

            topic_medians.forEach(a => {
                topic_medians_data[a.topic] = {
                    male: a.male,
                    female: a.female
                }
            })

            baked_mp_positions.forEach(function (row) {

                Object.keys(row)
                    .forEach(
                        function (colname) {
                            if (colname == "id" || colname.slice(-1) == "y") return
                            var topic = colname.slice(0, -2)
                            baked_positions_data.push({
                                "id": +row["id"],

                                "topic": topic,
                                "x": +row[topic + "_x"],
                                "y": +row[topic + "_y"],
                            })
                        }
                    )
            })

            baked_positions_data = d3.nest()
                .key(d => d.topic)
                .entries(baked_positions_data)

            // Convert wide data to long
            nodes = mp_topics.map(function (d) {
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

            nodes_male = nodes.filter(d => d.gender == "Male")
            nodes_female = nodes.filter(d => d.gender != "Male")

        })

}

// GET ALL DATA
download_data()

function getRetinaRatio() {
    var devicePixelRatio = window.devicePixelRatio || 1
    var c = document.createElement("canvas")
        .getContext("2d")
    var backingStoreRatio = [
        c.webkitBackingStorePixelRatio,
        c.mozBackingStorePixelRatio,
        c.msBackingStorePixelRatio,
        c.oBackingStorePixelRatio,
        c.backingStorePixelRatio,
        1
    ].reduce(function (a, b) { return a || b })

    return devicePixelRatio / backingStoreRatio
}
// ----------------------------------------------------------------------------
// ███████╗ ██████╗██████╗  ██████╗ ██╗     ██╗      █████╗ ███╗   ███╗ █████╗
// ██╔════╝██╔════╝██╔══██╗██╔═══██╗██║     ██║     ██╔══██╗████╗ ████║██╔══██╗
// ███████╗██║     ██████╔╝██║   ██║██║     ██║     ███████║██╔████╔██║███████║
// ╚════██║██║     ██╔══██╗██║   ██║██║     ██║     ██╔══██║██║╚██╔╝██║██╔══██║
// ███████║╚██████╗██║  ██║╚██████╔╝███████╗███████╗██║  ██║██║ ╚═╝ ██║██║  ██║
// ╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝
// ----------------------------------------------------------------------------
var $container = d3.select("#scroll")
var $graphic = $container.select(".scroll__graphic")
var $chart = $graphic.select(".chart")
var $text = $container.select(".scroll__text")
var $step = $text.selectAll(".step")

function handleContainerEnter(response) {
    // response = { direction }

    // sticky the graphic
    $graphic.classed("is-fixed", true)
    $graphic.classed("is-bottom", false)
}

function handleContainerExit(response) {
    // response = { direction }

    // un-sticky the graphic, and pin to top/bottom of container
    $graphic.classed("is-fixed", false)
    $graphic.classed("is-bottom", response.direction === "down")
}

function handleStepEnter(response) {
    // response = { element, direction, index }

    // fade in current step
    $step.classed("is-active", function (d, i) {
        return i === response.index
    })

    // update graphic based on step here
    new_slide = response.index
    update_state()
}

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

    // d3.select("svg")
    //     .selectAll("*")
    //     .remove()
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

        // Scale the canvas correctly
        ratio = getRetinaRatio()
        context.scale(ratio, ratio)
        context.translate(margin.left, margin.top)

        canvas
            .attr("width", ratio * (width + margin.left + margin.right))
            .attr("height", ratio * (height + margin.top + margin.bottom))
            // .attr("width", (width + margin.left + margin.right))
            // .attr("height", (height + margin.top + margin.bottom))
            .style("width", (width + margin.left + margin.right))
            .style("height", (height + margin.top + margin.bottom))

        // And do the same for the hidden canvas
        context_hidden.scale(ratio, ratio)
        context_hidden.translate(margin.left, margin.top)

        canvas_hidden
            .attr("width", ratio * (width + margin.left + margin.right))
            .attr("height", ratio * (height + margin.top + margin.bottom))
            // .attr("width", (width + margin.left + margin.right))
            // .attr("height", (height + margin.top + margin.bottom))
            .style("width", (width + margin.left + margin.right))
            .style("height", (height + margin.top + margin.bottom))

        new_slide = 0
        current_slide = -1
        // REDRAW
        initial_render()
        first_slide()

        // bind scrollama event handlers
        scroller
            .setup({
                container: "#scroll", // our outermost scrollytelling element
                graphic: ".scroll__graphic", // the graphic
                text: ".scroll__text", // the step container
                step: ".scroll__text .step", // the step elements
                offset: 0.9, // set the trigger to be 1/2 way down screen
                debug: false, // display the trigger offset for testing
            })
            .onStepEnter(handleStepEnter)
            .onContainerEnter(handleContainerEnter)
            .onContainerExit(handleContainerExit)

        d3.selectAll(".sticky")
            .each(function () {
                Stickyfill.add(this)
            })

        // Set height of each step
        $step.style("margin-bottom", height)
        // Move the footer down until it can be seen
        d3.select("#footer")
            .style("margin-top", (height + margin.top + margin.bottom) * 1.1)

    }
}
// ----------------------------------------------------------------------------
// REDRAW GRAPH ON WINDOW RESIZE
// ----------------------------------------------------------------------------
window.addEventListener("resize", draw_graph)
