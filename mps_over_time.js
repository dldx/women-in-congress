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
    top: 50,
    right: 20,
    bottom: 30,
    left: 70
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
    "Male": "#7A47C6",
    "Female": "#e5e5e5",
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

var $container = d3.select("#scroll")
var $graphic = $container.select(".scroll__graphic")
var $chart = $graphic.select(".chart")
var $text = $container.select(".scroll__text")
var $step = $text.selectAll(".step")

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

// Add another svg above the canvas for mouseovers
var mouseover_svg = d3.select(timeline)
    .append("svg")
    .attr("id", "mouseover-svg")


// Add a hidden canvas to catch mouseover events
var canvas_hidden = d3.select(document.createElement("canvas"))
// .append("canvas")
// .attr("id", "hidden-canvas")

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
    transform,
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
    chartTitle,
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
    slide5_yScale,
    mp_filter,
    isMobile,
    all_mps_draw_timer

var mps_over_time_data,
    number_women_over_time_data,
    total_mps_over_time_data,
    women_in_govt_data,
    mp_base64_data,
    // info_bubbles_data,
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
var initial_slide5 = true
// Used to make sure mouseout transitions don't clash with scrollytelling
var IGNORE_STATE = false


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

String.prototype.capitalize = function () {
    return this.charAt(0)
        .toUpperCase() + this.slice(1)
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
    // mouseover_svg.select("#zoomed-area")
    //     .selectAll("*")
    //     .remove()
    canvas.transition()
        .duration(500)
        .call(zoom.transform, d3.zoomIdentity)
        .on("end", () => {
            mouseover_svg.select("#zoomed-area")
                .attr("transform", null)
            zoomedArea.attr("transform", null)
            zoom.on("zoom", null)
            canvas.on("wheel.zoom", null)
                .on("wheel.zoom", null)
                .on("mousedown.zoom", null)
                .on("dblclick.zoom", null)
                .on("touchstart.zoom", null)
                .on("touchmove.zoom", null)
                .on("touchend.zoom touchcancel.zoom", null)

            canvas.style("pointer-events", "auto")
                .style("touch-action", "auto")


            // Add the y axis to the left of the graph
            yAxis = d3.axisLeft(y)
            gY = d3.select(".y-axis")
                .call(yAxis)
            if (typeof (callback) != "undefined") {
                callback(current_slide)
            }
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
    // d3.selectAll(".arc")
    //     .classed("c-1", function (a) {
    //         return a.index % 2 == 0
    //     })
    //     .classed("c-2", function (a) {
    //         return a.index % 2 == 1
    //     })
    //     .classed("active", function (a) {
    //         return a.index == current_slide
    //     })
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
    // Do the same for the mouseover svg
    mouseover_svg
        .append("g")
        .attr("class", "timeline-wrapper")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Initialise the hexagon tracker that tracks the state of the graph
    // initialise_tracker()

    // Initialise info bubble
    d3.select("#tooltip")
        .remove()
    d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
    tooltip = document.getElementById("tooltip")

    // Add a checkbox for zooming in
    d3.select("body")
        .append("label")
        .attr("class", "switch")
        .style("transform", `translateX(${margin.left * (isMobile ? 1.2 : 2)}px)`)
        .html("<input type=\"checkbox\" id=\"zoom-checkbox\"><span class=\"slider\"></span><div><label for='zoom-checkbox'>Make it zoomable</label></div>")

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
    // Do the same for the mouseover svg
    mouseover_svg.select(".timeline-wrapper")
        .append("g")
        .attr("id", "clippedArea")
        .attr("clip-path", "url(#clip)")

    // Add a zoom area to hold all other groups
    zoomedArea = clippedArea
        .append("g")
        .attr("id", "zoomed-area")
    // Do the same for the mouseover svg
    mouseover_svg.select("#clippedArea")
        .append("g")
        .attr("id", "zoomed-area")

    // Create the clip rectangle used for the graph
    wrapper.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)
    // Do the same for the mouseover svg
    mouseover_svg.select(".timeline-wrapper")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height)

    // Add the x axis to the bottom of the graph
    xAxis = d3.axisBottom(x)
    if (isMobile) xAxis.ticks(5)
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
    chartTitle = svg.append("text")
        .attr("x", (width / 2) + margin.left)
        .attr("y", margin.top / 2)
        .style("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("")

    // Add axes labels
    xLabel = svg.append("text")
        .attr("transform",
            "translate(" + (width + margin.left + margin.right) / 2 + " ," +
            (height + margin.top + margin.bottom) + ")")
        .attr("class", "x-label")
        .style("text-anchor", "middle")
        .text("Time")

    yLabel = svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 3)
        .attr("x", 0 - (height + margin.top + margin.bottom) / 2)
        .attr("class", "y-label")
        .text("Number of Women MPs")

    // Add zoom capabilities for the points
    zoom = d3.zoom()
        .scaleExtent([0.95, 40])
        .on("zoom", zoomed)
    // svg.call(zoom)
    // canvas.call(zoom)


    // Now show the scroll text
    d3.select(".scroll__text")
        .style("opacity", 1)

}

// ----------------------------------------------------------------------------
// ZOOM function
// ----------------------------------------------------------------------------
function zoomed(new_transform) {
    "use strict"
    transform = new_transform || d3.event.transform
    if (current_slide == 0 || current_slide == 4 || current_slide == 5) {
        zoomedArea.attr("transform", transform)
        mouseover_svg.select("#zoomed-area")
            .attr("transform", transform)
    }
    // Scale the canvas
    context.save()
    context.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)
    context.translate(transform.x, transform.y)
    context.scale(transform.k, transform.k)
    // Animate node entrances
    // var t = d3.timer((elapsed) => {
    draw(context, false)
    //     if (elapsed > 1000) {
    //         t.stop()
    //         draw(context)
    //         // Draw hidden canvas nodes to catch interactions
    //         draw(context_hidden, true)
    //     }
    // })
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
        gX.call(xAxis.scale(d3.event.transform.rescaleX(x))
            .ticks(isMobile ? 4 : 8))
    } else if (current_slide == 4) {
        gX.call(d3.axisBottom(d3.event.transform.rescaleX(slide5_xScale))
            .ticks(isMobile ? 5 : 20))
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
function add_election_rects(show_rect = true) {
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
        .style("opacity", show_rect ? 0.15 : 0)
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

    // Change chart title
    chartTitle
        .transition()
        .text("Women MPs in the House of Commons")

    // Add rectangles in the background to identify parliamentary terms
    add_election_rects(no_transition)

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

    // Add a line in the mouseover svg to handle hovers
    mouseover_svg
        .select("#zoomed-area")
        .selectAll("*")
        .remove()
    mouseover_svg
        .select("#zoomed-area")
        .append("line")

    if (no_transition == false) {
        instance
            .enter()
            .append("custom")
            .attr("class", "line")
            .attr("x1", (d) => x(d.term_start))
            .attr("x2", (d) => x(d.term_start))
            .attr("y1", y(0))
            .attr("y2", y(0))
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
        // .transition()
        // .delay((d, i) => 500 + i * 2)
        // .duration(1000)
        // .attr("y1", (d) => y(d.stream))
        // .attr("y2", (d) => y(d.stream))
        // .transition()
        // .delay((d, i) => 200 + i * 2)
        // .duration(1000)
        // .attr("x2", (d) => x(d.term_end) - lineThickness * 1.2)
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

    // Set default mp_filter
    mp_filter = mps_over_time_data.map(mp => mp.clean_name)
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
            // Only match if within bounds to avoid problems with antialiasing
            if (Math.abs(y(nodeData.stream) - (mousePos[1] - margin.top)) > 2 &&
                Math.abs(y(nodeData.stream) - (mousePos[1] - margin.top - transform["y"]) / transform["k"]) > 2) {
                return
            }

            // If mp is not in the array of accepted MPs, then don't show tooltip
            if (mp_filter.indexOf(nodeData.clean_name) == -1) return

            show_mp_tooltip(nodeData, mousePos)


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

            // Also select the mouseover line and fade it out
            if (IGNORE_STATE == false) {
                mouseover_svg
                    .select("line")
                    .style("opacity", 0)
            }
        })
        .on("touchend", mpMouseover)

    // Exit
    instance
        .exit()
        .remove()

    // Update current slide number
    current_slide = 0
}

function show_mp_tooltip(nodeData, mousePos) {
    if (typeof (mousePos) === "undefined") {
        mousePos = [width * 3 / 4, height * 3 / 4]
        if (isMobile) {
            mousePos = [width / 2, 0]
        }
    }
    // Display tooltip
    d3.select("#tooltip")
        .style("opacity", 1)
        .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth / 2,
            width - tooltip.offsetWidth - margin.right),
        0 + margin.left/2)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight - 20,
            height + tooltip.offsetHeight - 20), margin.top)}px)`)
        .style("pointer-events", "none")

    var partyLogo = partyHasLogo.indexOf(nodeData.party) != -1
    var tooltip_innerHTML = `
                    <h1 style="background-color: ${colorParty(nodeData.party)};">${nodeData.name}</h1>
                    <div class="body">
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
            <div class="body-facts">
                    <div class="mp-term">${d3.timeFormat("%Y")(nodeData.term_start)} &rarr; \
                    ${d3.timeFormat("%Y")(nodeData.term_end)}</div>
                    <div class="mp-constituency">${nodeData.constituency}</div>
                    </div>
                    </div>
                    <div class="mp-party" style="opacity: ${partyLogo ? 0: 1}">${nodeData.party}</div>
                    ${partyLogo ? `<img class="mp-party-logo" alt="${nodeData.party} logo" style="opacity: ${partyLogo ? 1: 0}" src="./party_logos/${nodeData.party}.svg"/>` : ""}
                    `

    tooltip.innerHTML = tooltip_innerHTML

    // Also select the mouseover line and move it to the right location
    mouseover_svg
        .select("line")
        .datum(nodeData)
        .attr("x1", (d) => x(d.term_start))
        .attr("x2", (d) => x(d.term_end) - lineThickness * 1.2)
        .attr("y1", (d) => y(d.stream))
        .attr("y2", (d) => y(d.stream))
        .style("stroke-width", lineThickness)
        .style("opacity", 1)
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

        add_election_rects(true)
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
        .curve(d3.curveCardinal)

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

    // Hide the mouseover line
    mouseover_svg.select("line")
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

    // Change y axis label
    yLabel
        .transition()
        .delay(no_transition ? 0 : 4000)
        .duration(no_transition ? 0 : 750)
        .text("Number of MPs")

    chartTitle
        .transition()
        .delay(no_transition ? 0 : 4000)
        .duration(no_transition ? 0 : 750)
        .text("MPs in the House of Commons")

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
                    return y(d.total_mps / 2 + 2)
                })
                .curve(d3.curveBundle.beta(0.2))

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
                    if (chartTitle.text()
                        .includes("Labour")) {
                        var num_women = number_women_over_time_data[bisect(number_women_over_time_data, first_election)].labour_women_mps
                        var gender_ratio = d.labour_mps / num_women - 1
                    } else if (chartTitle.text()
                        .includes("Conservative")) {
                        num_women = number_women_over_time_data[bisect(number_women_over_time_data, first_election)].conservative_women_mps
                        gender_ratio = d.conservative_mps / num_women - 1
                    } else if (chartTitle.text()
                        .includes("Liberal")) {
                        num_women = number_women_over_time_data[bisect(number_women_over_time_data, first_election)].lib_snp_women_mps
                        gender_ratio = d.lib_snp_mps / num_women - 1
                    } else {
                        num_women = number_women_over_time_data[bisect(number_women_over_time_data, first_election)].total_women_mps
                        gender_ratio = d.total_mps / num_women - 1
                    }
                    tooltip.innerHTML = `<div class="slide2-tooltip"><h1>${formatDate(first_election)} &rarr; ${formatDate(second_election)}</h1>
        ${num_women > 0 ? `<p>${num_women} Wom${num_women == 1 ? "a" : "e"}n</p><hr/>
            For every <span class="female">female</span> MP, there ${new Date() > second_election ? "were" : "are"}
                                <div class="gender-ratio">${gender_ratio.toFixed(1)}</div> <span class="male">male</span> MPs.` :
        "There were no women in the House of Commons yet :("}
                                </div>
            `
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .classed("hover", false)
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
            if (isMobile) xAxis.ticks(5)

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

            d3.selectAll(".i5050-label")
                .attr("startOffset", "90%")

            // Disable all pointer events for canvas
            canvas.style("pointer-events", "none")
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

    chartTitle
        .transition()
        .text("Parliaments in developed countries")

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
        .y(() => y(52))

    text_path_50_50
        .transition(t0)
        .attr("d", half_max_mps_line_smooth)

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
        .attr("stroke-width", lineThickness * 2)
        .style("stroke", d => d.key == "United Kingdom" ? colors["Hover"] : countryColors(d.key))
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
        .style("transform", `translate(${Math.max(Math.min(width/2 - tooltip.offsetWidth / 2,
            width - tooltip.offsetWidth - margin.right),
        0 + margin.left/2)}px,${Math.max(Math.min(- tooltip.offsetHeight - 20,
            height + tooltip.offsetHeight - 20), margin.top)}px)`)

    // Start drawing all the other countries, one by one, speeding up as we go along
    var country_on_screen = []
    women_in_govt_paths
        .transition(t2)
        .delay((d, i) => no_transition ? 0 : (1200 + i * 1000 - Math.pow(i, 1.5) * 100))
        .ease(d3.easeCubic)
        .attr("stroke-dashoffset", 0)
        .style("opacity", d => d.key == "United Kingdom" ? 1.0 : 0.5)
        .attr("stroke-width", d => d.key == "United Kingdom" ? 1.5 * lineThickness : lineThickness / 2)
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
                .attr("stroke-width", d => d.key == "United Kingdom" ? 2 * lineThickness : lineThickness)
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
                .attr("stroke-width", d => d.key == "United Kingdom" ? 1.5 * lineThickness : lineThickness / 2)
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
            .on("end", function() {
                this.remove()
            })
        break
    case 4:
        // Fade canvas
        canvas
            .style("opacity", 0)
            .style("pointer-events", "none")

        // Hide mouseover circle
        mouseover_svg
            .select("circle")
            .style("opacity", 0)

        d3.selectAll("#topic-label, .slide5-dropdown, .x-custom-axis, .switch")
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
        .style("opacity", 0)
    gY
        .style("opacity", 0)

    xLabel
        .style("opacity", 0)
    yLabel
        .style("opacity", 0)

    d3.select("#tooltip")
        .transition(t0)
        .style("opacity", 0)
        .on("end", function () {
            chartTitle.transition()
                .text("")
            // fourth_slide(false)
            // Deleted from visualization
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
        d3.selectAll(".x-custom-label")
            .style("opacity", 0)
            .on("end", () => {
                d3.selectAll(".x-custom-label")
                    .remove()
            })
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

    d3.select("#topic-label")
        .remove()
    d3.select(".slide5-dropdown")
        .remove()

    // Increment lastTransitioned counter if it is less than 0
    if (lastTransitioned < 4) {
        lastTransitioned = 4
        fifth_slide(false)
    } else {
        fifth_slide(true)
    }
    d3.select("#slide4")
        .style("display", "none")

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

    d3.selectAll(".slide5-dropdown")
        .remove()

    wrapper.select(".x-custom-axis")
        .remove()
    wrapper.append("g")
        .attr("class", "x-custom-axis")
        .attr("transform", "translate(0," + height + ")")

    // Add a circle in the mouseover svg to handle hovers
    mouseover_svg
        .select("#zoomed-area")
        .selectAll("*")
        .remove()
    mouseover_svg
        .select("#zoomed-area")
        .append("circle")


    // Enable canvas
    d3.select("#visible-canvas")
        .style("opacity", 1)
        .style("display", null)
        .style("pointer-events", "all")

    d3.select(".switch")
        .style("opacity", 1)

    // Add a dropdown to select different topics
    if (lastTransitioned > 4) {
        d3.select("body")
            .append("span")
            .attr("class", "slide5-dropdown")
            .append("select")
            .attr("id", "topic-dropdown")
            .attr("class", "slide5-dropdown__select")
            .on("change", update_fifth_slide)
            .selectAll(".topic")
            .data(baked_positions_data.map(topic => topic.key))
            .enter()
            .append("option")
            .attr("selected", d => d == selected_topic ? "selected" : null)
            .attr("value", d => d)
            .text(d => d.toUpperCase())
    }


    // Scales for this data
    slide5_xScale = d3.scaleLinear()
        .domain([-350, 150])
        .range([0, width])

    slide5_yScale = d3.scaleLinear()
        .domain([-0.005, 0.3])
        .range([height, 0])

    y = slide5_yScale

    d3.select("#slide5-group")
        .remove()

    // Call function initially
    if (typeof (selected_topic) != "undefined") {
        update_fifth_slide(no_transition, selected_topic)
    } else {
        update_fifth_slide(no_transition, "economy", true, false)
        chartTitle
            .transition()
            .text("Time spent on the economy")
    }

}

function update_fifth_slide(no_transition, default_selected_topic, from_scroll, drawMedian) {

    // If from_scroll is undefined, then this function was not triggered through scrollytelling
    if (typeof (from_scroll) == "undefined") {
        from_scroll = false
    }

    // If drawMedian is undefined, then we must show the median line by default
    if (typeof (drawMedian) == "undefined") {
        drawMedian = true
    }

    // Hide mouseover circle
    mouseover_svg
        .select("circle")
        .style("opacity", 0)

    // Hide tooltip
    d3.select("#tooltip")
        .style("opacity", 0)

    // Zoom out
    if (document.getElementById("zoom-checkbox")
        .checked != false) {
        document.getElementById("zoom-checkbox")
            .click()
    }

    if (typeof (default_selected_topic) != "undefined" && typeof (default_selected_topic) != "number" && from_scroll) {
        selected_topic = default_selected_topic

        // Append a new label
        wrapper.select("#topic-label")
            .remove()
    } else {
        // Remove label because we have dropdown instead
        wrapper.select("#topic-label")
            .remove()
        // Get value of topic dropdown
        try {
            selected_topic = d3.select("#topic-dropdown")
                .property("value")
        } catch (err) {
            let topics = Object.keys(topic_medians_data)
            // If there is no selected topic or no dropdown, select a random one
            selected_topic = selected_topic || topics[Math.floor(Math.random() * topics.length)]
        }
    }
    chartTitle
        .transition()
        .text("Time spent on " + selected_topic)

    var baked_data = baked_positions_data.filter(d => d.key == selected_topic)[0].values

    nodes_male = baked_data.filter(d => d.gender == "Male")
    nodes_female = baked_data.filter(d => d.gender != "Male")

    // Make alternate data store for medians
    var temp_nodes = []

    temp_nodes.push({
        "x": slide5_xScale(0),
        "y": slide5_yScale(topic_medians_data[selected_topic]["female"]),
        "median": topic_medians_data[selected_topic]["female"],
        "gender": "female"
    })

    temp_nodes.push({
        "x": slide5_xScale(0),
        "y": slide5_yScale(topic_medians_data[selected_topic]["male"]),
        "median": topic_medians_data[selected_topic]["male"],
        "gender": "male"
    })

    nodes_male.forEach(d => {
        // Copy properties
        let node = Object.assign({}, d)
        node.x = slide5_xScale(d.x) - 10
        node.y = slide5_yScale(d.y)
        temp_nodes.push(node)
    })

    nodes_female.forEach(d => {
        // Copy properties
        let node = Object.assign({}, d)
        node.x = slide5_xScale(d.x) + 10
        node.y = slide5_yScale(d.y)
        temp_nodes.push(node)
    })


    // Quadtree to look up points
    var quadtree = d3.quadtree()
        .extent([
            [-1, -1],
            [width + 1, height + 1]
        ])
        .x(d => d.x)
        .y(d => d.y)
        .addAll(temp_nodes)

    // JOIN
    circle_male = dataContainer
        .selectAll(".male-node")
        .data(nodes_male)

    // UPDATE
    circle_male
        .transition()
        .duration(2000)
        .attr("opacity", 0.7)
        .attr("cx", d => slide5_xScale(d.x) - 10)
        .attr("cy", d => slide5_yScale(d.y))

    // ENTER
    circle_male
        .enter()
        .append("custom")
        .attr("class", "male-node")
        .attr("r", circleRadius * (isMobile ? 0.9 : 1.2))
        .attr("cx", d => no_transition ? d.x : slide5_xScale(0))
        .attr("cy", d => slide5_yScale(d.y))
        .attr("opacity", 0.0)
        .transition()
        .duration(2000)
        .delay((d, i) => no_transition ? 0 : (100 * Math.sqrt(i)))
        .attr("opacity", 0.7)
        .attr("cx", d => slide5_xScale(d.x) - 10)
        .attr("cy", d => slide5_yScale(d.y))

    // Female nodes
    // JOIN
    circle_female = dataContainer.selectAll(".female-node")
        .data(nodes_female)

    // UPDATE
    circle_female
        .transition()
        .duration(2000)
        .attr("opacity", 0.7)
        .attr("cx", d => slide5_xScale(d.x) + 10)
        .attr("cy", d => slide5_yScale(d.y))

    // ENTER
    circle_female
        .enter()
        .append("custom")
        .attr("class", "female-node")
        .attr("r", circleRadius * (isMobile ? 0.9 : 1.2))
        .attr("cx", d => no_transition ? d.x : slide5_xScale(0))
        .attr("cy", d => slide5_yScale(d.y))
        .attr("opacity", 0.0)
        .transition()
        .duration(2000)
        .delay((d, i) => no_transition ? 0 : (100 * Math.sqrt(i)))
        .attr("opacity", 0.7)
        .attr("cx", d => slide5_xScale(d.x) + 10)
        .attr("cy", d => slide5_yScale(d.y))

    // Median connector line
    // Join
    var median_connector_line = dataContainer
        .selectAll(".median-connector")
        .data([topic_medians_data[selected_topic]])

    // Update
    median_connector_line
        .transition()
        .duration(1000)
        .attr("y1", d => slide5_yScale(drawMedian ? d["female"] : 0.5))
        .attr("y2", d => slide5_yScale(drawMedian ? d["male"] : 0.5))
        .attr("opacity", drawMedian ? 1 : 0)

    // Enter
    median_connector_line
        .enter()
        .append("custom")
        .attr("class", "median-connector")
        .attr("x1", slide5_xScale(0))
        .attr("x2", slide5_xScale(0))
        .transition()
        .delay(2000)
        .duration(1000)
        .attr("y1", d => slide5_yScale(drawMedian ? d["female"] : 0.5))
        .attr("y2", d => slide5_yScale(drawMedian ? d["male"] : 0.5))
        .attr("opacity", drawMedian ? 1 : 0)


    // Male median fraction
    // Join
    var male_median_circle = dataContainer
        .selectAll(".male-median")
        .data([topic_medians_data[selected_topic]["male"]])

    // Update
    male_median_circle
        .transition()
        .duration(1000)
        .attr("cy", d => slide5_yScale(drawMedian ? d : 0))
        .attr("opacity", drawMedian ? 1 : 0)

    // Enter
    male_median_circle
        .enter()
        .append("custom")
        .attr("class", "male-median")
        .attr("cx", slide5_xScale(0))
        .attr("cy", slide5_yScale(0))
        .attr("r", circleRadius * 2)
        .attr("opacity", drawMedian ? 1 : 0)
        .transition()
        .delay(2000)
        .duration(1000)
        .attr("cy", d => slide5_yScale(drawMedian ? d : 0))


    // Female median fraction
    // Join
    var female_median_circle = dataContainer
        .selectAll(".female-median")
        .data([topic_medians_data[selected_topic]["female"]])

    // Update
    female_median_circle
        .transition()
        .duration(1000)
        .attr("cy", d => slide5_yScale(drawMedian ? d : 0))
        .attr("opacity", drawMedian ? 1 : 0)

    // Enter
    female_median_circle
        .enter()
        .append("custom")
        .attr("class", "female-median")
        .attr("cx", slide5_xScale(0))
        .attr("cy", slide5_yScale(0))
        .attr("r", circleRadius * 2)
        .attr("opacity", drawMedian ? 1 : 0)
        .transition()
        .delay(2000)
        .duration(1000)
        .attr("cy", d => slide5_yScale(drawMedian ? d : 0))

    // Clear the hidden canvas so that we don't catch the wrong hover info
    context_hidden.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)

    window.draw = function (context) {
        context.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)

        dataContainer.selectAll("custom.male-node")
            .each(function () {
                let node = d3.select(this)
                context.fillStyle = hexToRGBA(colors["Male"], node.attr("opacity"))
                context.beginPath()
                context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI)
                context.fill()
            })

        dataContainer.selectAll("custom.female-node")
            .each(function () {
                let node = d3.select(this)
                context.fillStyle = hexToRGBA(colors["Female"], node.attr("opacity"))
                context.beginPath()
                context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI)
                context.fill()
            })

        dataContainer.select("custom.median-connector")
            .each(function () {
                let node = d3.select(this)
                context.beginPath()
                context.lineWidth = 1
                context.strokeStyle = hexToRGBA("#ffffff", node.attr("opacity"))
                context.moveTo(node.attr("x1"), node.attr("y1"))
                context.lineTo(+node.attr("x2"), node.attr("y2"))
                context.stroke()
            })

        dataContainer.select("custom.male-median")
            .each(function () {
                let node = d3.select(this)
                context.fillStyle = hexToRGBA(colors["Male"], node.attr("opacity"))
                context.beginPath()
                context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI)
                context.fill()
            })

        dataContainer.select("custom.female-median")
            .each(function () {
                let node = d3.select(this)
                context.fillStyle = hexToRGBA(colors["Female"], node.attr("opacity"))
                context.beginPath()
                context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI)
                context.fill()
            })
    }

    // Animate node entrances
    var t = d3.timer((elapsed) => {
        draw(context, false)
        if ((initial_slide5 & (elapsed > 6000)) | (initial_slide5 != true & (elapsed > 3000))) {
            t.stop()
            draw(context)
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
                .style("fill", colors["Male"])
                .html("Men")
        }

        if (typeof (female_label) != "undefined") {
            wrapper.select(".x-custom-axis")
                .append("text")
                .attr("class", "x-label x-custom-label")
                .attr("transform", female_label.parentNode.getAttribute("transform"))
                .attr("dy", 10)
                .style("text-anchor", "start")
                .style("fill", colors["Female"])
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
        // Get the data from our map!
        if (typeof (transform) !== "undefined") {
            var nodeData = quadtree.find((mousePos[0] - margin.left - transform["x"]) / transform["k"],
                (mousePos[1] - margin.top - transform["y"]) / transform["k"], 50)
        } else {
            var nodeData = quadtree.find(mousePos[0] - margin.left, mousePos[1] - margin.top, 50)
        }

        // Only show mouseover if hovering near a point
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
                    <div class="body">
                    <div class="mp-image-parent">
                    ${typeof mp_base64_data[nodeData.id] === "undefined" ? "" : "<img class=\"mp-image-blurred\" src=\"data:image/jpeg;base64," + mp_base64_data[nodeData.id] + "\" />" +
                    "<img class=\"mp-image\" src=\"./mp-images/mp-" + nodeData.id + ".jpg\" style=\"opacity: ${typeof nodeData.loaded == 'undefined' ? 0 : nodeData.loaded;d.loaded = 1;};\" onload=\"this.style.opacity = 1;\" />"}
                    </div>
                    <div class="body-facts">
                    <p><em>${(slide5_yScale.invert(nodeData.y) * 100).toFixed(2)}%</em> of ${nodeData.full_name}'s time spent on <em>${selected_topic}</em></p>
                    </div>
                    </div>
                    <div class="mp-party" style="opacity: ${partyLogo ? 0: 1}">${nodeData.party}</div>
                    ${partyLogo ? `<img class="mp-party-logo" alt="${nodeData.party} logo" style="opacity: ${partyLogo ? 1: 0}" src="./party_logos/${nodeData.party}.svg"/>` : ""}
</div>`
                // Also select the mouseover circle and move it to the right location
                mouseover_svg
                    .select("circle")
                    .datum(nodeData)
                    .attr("cx", (d) => d.x)
                    .attr("cy", (d) => d.y)
                    .attr("r", circleRadius * 2.5)
                    .style("opacity", 1)
                    .style("stroke-width", circleRadius)
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



    // Mouseover for medians
    function median_mouseover(nodeData, mousePos) {
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
                    <h1 style="background-color: ${nodeData.gender == "female" ? colors["Female"] : colors["Male"]};">${nodeData.gender.toUpperCase()}</h1>
                    The average ${nodeData.gender.toUpperCase()} MP spends <em>${(nodeData.median*100).toFixed(1)}%</em> of ${nodeData.gender == "male" ? "his" : "her"} time talking about <em>${selected_topic}</em>.
</div>`
        mouseover_svg
            .select("circle")
            .datum(nodeData)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", circleRadius * 2.5)
            .style("opacity", 1)
            .style("stroke-width", circleRadius)
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
        d3.selectAll("#topic-label, .slide5-dropdown, .x-custom-axis")
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .on("end", function () { this.remove() })

        d3.select(".switch")
            .style("opacity", 0)
        if (document.getElementById("zoom-checkbox")
            .checked != false) {
            document.getElementById("zoom-checkbox")
                .click()
        }
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
            .domain([0, 0.10])
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

    // Hide mouseover circle
    mouseover_svg
        .select("circle")
        .style("opacity", 0)

    // remove dropdown
    d3.select(".slide5-dropdown")
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

                chartTitle
                    .transition()
                    .text("Gender bias of topics")

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

        chartTitle
            .transition()
            .text("Gender bias of topics")

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
            .delay(2500)
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
                d3.select(".is-active")
                    .style("opacity", 0)
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

                        xLabel
                            .text("Median female - Median male")

                        wrapper.append("text")
                            .attr("class", "x-custom-label")
                            .attr("x", width)
                            .attr("y", height + margin.bottom)
                            .text("FEMALE FRIENDLY")
                            .style("text-anchor", "end")
                            .style("fill", colors["Female"])
                            .style("alignment-baseline", "hanging")

                        wrapper.append("text")
                            .attr("class", "x-custom-label")
                            .attr("x", 0)
                            .attr("y", height + margin.bottom)
                            .text("MALE FRIENDLY")
                            .style("text-anchor", "start")
                            .style("fill", colors["Male"])
                            .style("alignment-baseline", "hanging")

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

        wrapper.append("text")
            .attr("class", "x-custom-label")
            .attr("x", width)
            .attr("y", height + margin.bottom)
            .text("FEMALE FRIENDLY")
            .style("text-anchor", "end")
            .style("fill", colors["Female"])
            .style("alignment-baseline", "hanging")

        wrapper.append("text")
            .attr("class", "x-custom-label")
            .attr("x", 0)
            .attr("y", height + margin.bottom)
            .text("MALE FRIENDLY")
            .style("text-anchor", "start")
            .style("fill", colors["Male"])
            .style("alignment-baseline", "hanging")
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
                conservative_women_mps: +d.Con,
                labour_women_mps: +d.Lab,
                lib_snp_women_mps: +d.Lib_SNP
            }
        })
        .defer(d3.csv, "total_mps_over_time.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d")
            return {
                year: parseDate(d.Year),
                total_mps: +d.total_mps,
                conservative_mps: +d.Con,
                labour_mps: +d.Lab,
                lib_snp_mps: +d.Lib_SNP
            }
        })
        .await(function (error,
            mps_over_time,
            number_women_over_time,
            total_mps_over_time) {
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
                d.women_pct = d.total_women_mps / d.total_mps * 100,
                d.conservative_mps = total_mps_over_time_data[Math.max(0, bisect(total_mps_over_time_data, d.year) - 1)].conservative_mps
                d.conservative_women_pct = d.conservative_women_mps / d.conservative_mps * 100,
                d.labour_mps = total_mps_over_time_data[Math.max(0, bisect(total_mps_over_time_data, d.year) - 1)].labour_mps
                d.labour_women_pct = d.labour_women_mps / d.labour_mps * 100,
                d.lib_snp_mps = total_mps_over_time_data[Math.max(0, bisect(total_mps_over_time_data, d.year) - 1)].lib_snp_mps
                d.lib_snp_women_pct = d.lib_snp_women_mps / d.lib_snp_mps * 100
            })
            // Hide loading text
            d3.select("#loading")
                .remove()
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
        .defer(d3.csv,
            "baked_positions.csv" + "?" + Math.floor(Math.random() * 1000)
        )
        .defer(d3.csv, "topic_medians.csv" + "?" + Math.floor(Math.random() * 100),
            function (d) {
                return {
                    topic: d.topic,
                    male: Math.pow(10, +d.male),
                    female: Math.pow(10, +d.female)
                }
            })
        .await(function (error, women_in_govt, baked_mp_positions, topic_medians) {
            // Group stats by country
            women_in_govt_data = d3.nest()
                .key(d => d.country)
                .entries(women_in_govt)

            topic_medians_data = {}
            baked_positions_data = []
            // var nodes = []

            topic_medians.forEach(a => {
                topic_medians_data[a.topic] = {
                    male: a.male,
                    female: a.female
                }
            })

            baked_mp_positions.forEach(function (row) {

                Object.keys(row)
                    .forEach(function (colname) {
                        if (colname != "id" & colname != "full_name" & colname != "Party" & colname != "is_female" & colname.slice(-1) != "y") {
                            var topic = colname.slice(0, -2)
                            baked_positions_data.push({
                                "id": +row["id"],
                                "full_name": row["full_name"],
                                "party": row["Party"],
                                "gender": row["is_female"] == 1 ? "Female" : "Male",
                                "topic": topic,
                                "x": +row[topic + "_x"],
                                "y": +row[topic + "_y"] / 100,
                            })
                        }
                    })
            })

            baked_positions_data = d3.nest()
                .key(d => d.topic)
                .entries(baked_positions_data)

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

    if (response.direction == "down" && lastTransitioned >= 4) {
        // Go to sixth slide
        new_slide = 5
        update_state()
    }
}

// ----------------------------------------------------------------------------
// Function to zoom into a particular mp on slide 1
// ----------------------------------------------------------------------------
function mpZoom(clean_name, focus = "mid", scale_level = 3, vshift = 0, hshift = 0) {
    // Add zoom capabilities
    zoom.on("zoom", zoomed)
    // Find MP
    let mp = mps_over_time_data.filter(d => d.clean_name == clean_name)[0]
    // Transition zoom to MP
    mouseover_svg.transition()
        .duration(1000)
        .call(zoom.transform, d3.zoomIdentity
            .translate(width / 2 + hshift, height / 2 + vshift)
            .scale(scale_level)
            .translate(-(focus == "mid" ? ((x(mp.term_start) + x(mp.term_end)) / 2) : x(mp.term_end)), -y(mp.stream)))
        .on("end", () => {
            d3.selectAll(".y-axis .tick")
                .style("opacity", d => d >= 0 ? 1 : 0)
        })
    // Hide tooltip
    d3.select(tooltip)
        .style("opacity", 0)
    // Set flag to not fade mouseover line
    IGNORE_STATE = true
    // Highlight MP
    mouseover_svg
        .select("line")
        .datum(mp)
        .attr("x1", (d) => x(d.term_start))
        .attr("x2", (d) => x(d.term_end) - lineThickness * 1.2)
        .attr("y1", (d) => y(d.stream))
        .attr("y2", (d) => y(d.stream))
        .style("stroke-width", lineThickness)
        .transition()
        .delay(500)
        .style("opacity", 1)
}

function handleStepEnter(response) {
    // response = { element, direction, index }

    // fade in current step
    $step.classed("is-active", function (d, i) {
        return i === response.index
    })

    // Hide tooltip
    d3.select("#tooltip")
        .style("opacity", 0)

    // go to next slide based on slide attribute
    new_slide = +$step.nodes()[response.index].getAttribute("data-slide")
    update_state()


    // update current slide based on step attribute
    let new_step = +$step.nodes()[response.index].getAttribute("data-step")
    try {
        // get previous step (based on direction)
        let previous_step = +$step.nodes()[response.index + (response.direction == "down" ? -1 : 1)].getAttribute("data-step")
        // If the current and previous are the same, do nothing
        if (new_step == previous_step) return
    } catch (e) {
        //pass
    }
    // Run different functions depending on slide and step no.
    switch (current_slide) {
    case 0:
        switch (new_step) {
        case 0:
            if (response.direction == "up") {

                // Unhighlight 97 election
                electionRects.filter((d, i) => i == 22)
                    .classed("hover", false)
                    .style("opacity", 0.15)
            }
            // Show election rects
            electionRects
                .transition()
                .delay((d, i) => i * 50)
                .style("opacity", 0.15)
            break
        case 0.1:
            // Highlight '97 election
            electionRects.filter((d, i) => i == 22)
                .classed("hover", true)
                .style("opacity", null)
            break
        case 0.2:
            if (response.direction == "up") {
                d3.select(".switch")
                    .style("opacity", 0)
                if (document.getElementById("zoom-checkbox")
                    .checked != false) {
                    document.getElementById("zoom-checkbox")
                        .click()
                }

                dataContainer.selectAll("custom.line")
                    .filter(d => d.clean_name != "margaretbeckett")
                    .transition()
                    .duration(1000)
                    .attr("x2", (d) => x(d.term_start))
                    .transition()
                    .duration(1000)
                    .attr("y1", () => y(0))
                    .attr("y2", () => y(0))
            }
            // Unhighlight 97 election
            electionRects.filter((d, i) => i == 22)
                .classed("hover", false)
                .style("opacity", 0.15)
            // Draw lines for longest serving woman
            dataContainer.selectAll("custom.line")
                .filter(d => d.clean_name == "margaretbeckett")
                .transition()
                .duration(1000)
                .attr("y1", (d) => y(d.stream))
                .attr("y2", (d) => y(d.stream))
                .transition()
                .duration(1000)
                .attr("x2", (d) => x(d.term_end) - lineThickness * 1.2)
                .on("end", () => {
                    // Display tooltip
                    show_mp_tooltip(mps_over_time_data.filter(d => d.clean_name == "margaretbeckett")[1])
                })
            // Animate node entrances
            var t = d3.timer((elapsed) => {
                draw(context, false)
                if (elapsed > 2000) {
                    t.stop()
                    draw(context)
                    // Draw hidden canvas nodes to catch interactions
                    draw(context_hidden, true)
                }
            })
            break

        case 0.3:
            if (response.direction == "down") {

                // Draw lines for all women
                dataContainer.selectAll("custom.line")
                    .transition()
                    .delay((d, i) => 500 + i * 2)
                    .duration(1000)
                    .attr("y1", (d) => y(d.stream))
                    .attr("y2", (d) => y(d.stream))
                    .transition()
                    .delay((d, i) => 200 + i * 2)
                    .duration(1000)
                    .attr("x2", (d) => x(d.term_end) - lineThickness * 1.2)
                // Animate node entrances
                all_mps_draw_timer = d3.timer((elapsed) => {
                    draw(context, false)
                    if (elapsed > 5000) {
                        all_mps_draw_timer.stop()
                        draw(context)
                        // Draw hidden canvas nodes to catch interactions
                        draw(context_hidden, true)
                        reset_zoom()
                    }
                })

            } else {
                // Reset zoom
                mouseover_svg.transition()
                    .duration(1000)
                    .call(zoom.transform, d3.zoomIdentity)
                    .on("end", () => {
                        reset_zoom()
                    })
            }
            canvas.style("pointer-events", "auto")

            d3.select(".switch")
                .style("opacity", 1)
                .on("mouseover", () => {
                    d3.select("#tooltip").style("opacity", 0)
                })
                .select("#zoom-checkbox")
                .on("change", function () {
                    if (this.checked) {
                        zoom.on("zoom", zoomed)
                        canvas.call(zoom)
                        d3.select(".is-active")
                            .style("opacity", 0)
                    } else {
                        reset_zoom()
                        d3.select(".is-active")
                            .filter(function () {
                                // If it is an empty div, don't show
                                return this.innerText != ""
                            })
                            .style("opacity", 1)
                    }

                })



            break

        case 1:
            d3.select(".switch")
                .style("opacity", 0)
            if (document.getElementById("zoom-checkbox")
                .checked != false) {
                document.getElementById("zoom-checkbox")
                    .click()
                // If we have to zoom out first, wait a bit before executing next bit
                d3.timeout(() => {
                    all_mps_draw_timer.stop()
                    mpZoom("constancemarkievicz", "mid", 10, 0, width / 4)
                }, 1000)
            } else {
                // First step: zoom into first mp
                all_mps_draw_timer.stop()
                mpZoom("constancemarkievicz", "mid", 10, 0, width / 4)
            }
            canvas.style("pointer-events", "none")
            break

        case 2:
            // Second step: first mp to take seat
            mpZoom("nancyastor")
            canvas.style("pointer-events", "none")
            break

        case 4:
            // Fourth step: first prime minister
            mpZoom("margaretthatcher")
            canvas.style("pointer-events", "none")
            break

        case 5:
            canvas.style("pointer-events", "all")
            d3.select(".switch")
                .style("opacity", 1)

            mouseover_svg.transition()
                .duration(1000)
                .call(zoom.transform, d3.zoomIdentity)
                .on("end", () => {
                    d3.selectAll(".y-axis .tick")
                        .style("opacity", d => d >= 0 ? 1 : 0)

                    // Unhighlight election term
                    electionRects.filter((d, i) => i == 22)
                        .classed("hover", false)
                    // Set default mp_filter
                    mp_filter = mps_over_time_data.map(mp => mp.clean_name)
                    // Unfade all MPs
                    dataContainer.selectAll("custom.line")
                        .transition()
                        .attr("strokeStyle", d => colorParty(d.party))

                    var t = d3.timer((elapsed) => {
                        draw(context, false)
                        if (elapsed > 500) {
                            t.stop()
                            draw(context)
                        }
                    })
                })
            break

        case 6:
            d3.select(".switch")
                .style("opacity", 0)
            if (document.getElementById("zoom-checkbox")
                .checked != false) {
                document.getElementById("zoom-checkbox")
                    .click()
            }
            canvas.style("pointer-events", "all")
            // Highlight '97 term
            electionRects.filter((d, i) => i == 22)
                .classed("hover", true)
            // Filter tooltip to Labour MPs elected in 1997
            mp_filter = mps_over_time_data.filter(mp => mp.term_start >= new Date(1997, 4, 1) &
                    mp.term_start <= new Date(1997, 6, 1) &
                    mp.party == "Lab")
                .map(mp => mp.clean_name)
            // Now talk about all women shortlists
            // First reset zoom
            if (response.direction == "down") {
                mouseover_svg
                    .select("line")
                    .style("opacity", 0)

                let mp = mps_over_time_data.filter(d => d.clean_name == "louiseellman")[0]
                transform = d3.zoomIdentity
                    .translate(width * 3 / 4, height * 3 / 5)
                    .scale(1.5)
                    .translate(-(x(mp.term_start) + x(mp.term_end)) / 2, -y(mp.stream))
                mouseover_svg.transition()
                    .duration(1000)
                    .call(zoom.transform, d3.zoomIdentity)
                    .on("end", () => {
                        d3.selectAll(".y-axis .tick")
                            .style("opacity", d => d >= 0 ? 1 : 0)

                    })
                    .transition()
                    .call(zoom.transform, transform)

            }

            // Highlight Labour MPs that were elected in 1997
            dataContainer.selectAll("custom.line")
                .transition()
                .delay(response.direction == "down" ? 1000 : 0)
                .duration(500)
                .attr("strokeStyle", mp => !(mp.term_start >= new Date(1997, 4, 1) &
                    mp.term_start <= new Date(1997, 6, 1) &
                    mp.party == "Lab") ? hexToRGBA(colorParty(mp.party), 0.2) : colorParty(mp.party))

            if (response.direction == "up") {
                // Scale the canvas
                context.save()
                context.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)
                context.translate(transform.x, transform.y)
                context.scale(transform.k, transform.k)
            }

            var t = d3.timer((elapsed) => {
                draw(context, false)
                if (elapsed > 500) {
                    t.stop()
                    draw(context)
                    if (response.direction == "up") context.restore()
                }
            })

            break

        case 7:
            if (response.direction == "up") {
                d3.select(".switch")
                    .style("opacity", 0)
                if (document.getElementById("zoom-checkbox")
                    .checked != false) {
                    document.getElementById("zoom-checkbox")
                        .click()
                }
            }
            // Set filter to these MPs who were elected through AWS in 1997
            mp_filter = ["annebegg", "judymallaber", "sandraosborne", "angelaesmith", "giselastuart", "annkeen", "janetdean",
                "chrismccafferty", "juliemorgan", "shonamcisaac", "kalimountford", "bettywilliams", "lauramoffatt",
                "lizblackman", "mscandyatherton", "dianaorgan", "anncryer", "gillianmerron", "mariaeagle", "louiseellman",
                "margaretmoran", "phyllisstarkey", "geraldinesmith", "sallykeeble", "helenbrinton", "lindagilroy",
                "jackielawrence", "jacquismith", "karenbuck", "fionamactaggart", "annemcguire", "daritaylor", "debrashipley",
                "melaniejohnson", "jennyjones"
            ]
            // Show only MPs which were elected through AWS
            dataContainer.selectAll("custom.line")
                .transition()
                .duration(500)
                .attr("strokeStyle", mp => !(mp.term_start >= new Date(1997, 4, 1) &
                    mp.term_start <= new Date(1997, 6, 1) &
                    mp.party == "Lab" & mp_filter.indexOf(mp.clean_name) != -1) ? hexToRGBA(colorParty(mp.party), 0.2) : colorParty(mp.party))
            if (response.direction == "down") {
                // Scale the canvas
                context.save()
                context.clearRect(0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top)
                context.translate(transform.x, transform.y)
                context.scale(transform.k, transform.k)

            }

            var t = d3.timer((elapsed) => {
                draw(context, false)
                if (elapsed > 500) {
                    t.stop()
                    draw(context)
                    context.restore()
                }
            })
            break

        case 8:
            d3.select(".switch")
                .style("opacity", 1)

            if (response.direction == "up") {
                // Draw canvas if coming from below
                draw(context, false)
            }
            break


        }
        break

    case 1:
        d3.select(".switch")
            .style("opacity", 0)
        if (document.getElementById("zoom-checkbox")
            .checked != false) {
            document.getElementById("zoom-checkbox")
                .click()
        }
        switch (new_step) {
        // Change graph to show breakdown by party
        case 0:
            if (response.direction == "up") {
                yLabel
                    .transition()
                    .text("Number of MPs")
                chartTitle
                    .transition()
                    .text("MPs in the House of Commons")
                // All MPs first
                y.domain([0, 750])
                gY.transition()
                    .call(yAxis)

                max_mps_line.y(d => y(d.total_mps))
                max_mps_path.transition()
                    .attr("d", max_mps_line)
                max_mps_area.y1(d => y(d.total_mps))
                max_mps_path_area.transition()
                    .attr("d", max_mps_area)
                    .style("fill", colors["Male"])
                mask.transition()
                    .attr("d", max_mps_area)

                half_max_mps_line.y(d => y(d.total_mps / 2))
                half_max_mps_path.transition()
                    .attr("d", half_max_mps_line)

                total_women_mps_line.y(d => y(d.total_women_mps))
                total_women_mps_path.transition()
                    .attr("d", total_women_mps_line)
                total_women_mps_area.y1(d => y(d.total_women_mps))
                total_women_mps_path_area.transition()
                    .attr("d", total_women_mps_area)

                d3.select(".women-label")
                    .style("fill", colors["Male"])
            }

            break
        case 1:
            // Labour
            yLabel
                .transition()
                .text("% of MPs")

            chartTitle
                .transition()
                .text("MPs in the Labour Party")

            y.domain([0, 100])
            gY.transition()
                .call(yAxis)

            max_mps_line.y(y(100))
            max_mps_path.transition()
                .attr("d", max_mps_line)
            max_mps_area.y1(y(100))
            max_mps_path_area.transition()
                .attr("d", max_mps_area)
                .style("fill", colors["Labour"])
            mask.transition()
                .attr("d", max_mps_area)

            half_max_mps_line.y(y(50))
            half_max_mps_path.transition()
                .attr("d", half_max_mps_line)

            half_max_mps_line_smooth.y(y(52))
            text_path_50_50
                .transition()
                .attr("d", half_max_mps_line_smooth)

            total_women_mps_line.y(d => y(d.labour_women_pct))
            total_women_mps_path.transition()
                .attr("d", total_women_mps_line)
            total_women_mps_area.y1(d => y(d.labour_women_pct))
            total_women_mps_path_area.transition()
                .attr("d", total_women_mps_area)

            d3.select(".women-label")
                .style("fill", colors["Labour"])
            break
        case 2:
            // Conservatives
            yLabel
                .transition()
                .text("% of MPs")

            chartTitle
                .transition()
                .text("MPs in the Conservative Party")

            y.domain([0, 100])
            gY.transition()
                .call(yAxis)

            max_mps_line.y(y(100))
            max_mps_path.transition()
                .attr("d", max_mps_line)
            max_mps_area.y1(y(100))
            max_mps_path_area.transition()
                .attr("d", max_mps_area)
                .style("fill", colors["Conservative"])
            mask.transition()
                .attr("d", max_mps_area)

            half_max_mps_line.y(y(50))
            half_max_mps_path.transition()
                .attr("d", half_max_mps_line)

            half_max_mps_line_smooth.y(y(52))
            text_path_50_50
                .transition()
                .attr("d", half_max_mps_line_smooth)

            total_women_mps_line.y(d => y(d.conservative_women_pct))
            total_women_mps_path.transition()
                .attr("d", total_women_mps_line)
            total_women_mps_area.y1(d => y(d.conservative_women_pct))
            total_women_mps_path_area.transition()
                .attr("d", total_women_mps_area)

            d3.select(".women-label")
                .style("fill", colors["Conservative"])
            break
        case 3:
            // Lib Dems & SNP
            yLabel
                .transition()
                .text("% of MPs")

            chartTitle
                .transition()
                .text(isMobile ? "MPs in the Lib Dems and SNP" : "MPs in the Liberal Democrats and Scottish National Party")

            y.domain([0, 100])
            gY.transition()
                .call(yAxis)

            max_mps_line.y(y(100))
            max_mps_path.transition()
                .attr("d", max_mps_line)
            max_mps_area.y1(y(100))
            max_mps_path_area.transition()
                .attr("d", max_mps_area)
                .style("fill", colors["LD"])
            mask.transition()
                .attr("d", max_mps_area)

            half_max_mps_line.y(y(50))
            half_max_mps_path.transition()
                .attr("d", half_max_mps_line)

            half_max_mps_line_smooth.y(y(52))
            text_path_50_50
                .transition()
                .attr("d", half_max_mps_line_smooth)

            total_women_mps_line.y(d => y(d.lib_snp_women_pct))
            total_women_mps_path.transition()
                .attr("d", total_women_mps_line)
            total_women_mps_area.y1(d => y(d.lib_snp_women_pct))
            total_women_mps_path_area.transition()
                .attr("d", total_women_mps_area)

            d3.select(".women-label")
                .style("fill", colors["LD"])
            break
        case 4:
            // All MPs again
            yLabel
                .transition()
                .text("% of MPs")

            chartTitle
                .transition()
                .text("MPs in the House of Commons")

            y.domain([0, 100])
            gY.transition()
                .call(yAxis)

            max_mps_line.y(y(100))
            max_mps_path.transition()
                .attr("d", max_mps_line)
            max_mps_area.y1(y(100))
            max_mps_path_area.transition()
                .attr("d", max_mps_area)
                .style("fill", colors["Male"])
            mask.transition()
                .attr("d", max_mps_area)

            half_max_mps_line.y(y(50))
            half_max_mps_path.transition()
                .attr("d", half_max_mps_line)

            half_max_mps_line_smooth.y(y(52))
            text_path_50_50
                .transition()
                .attr("d", half_max_mps_line_smooth)

            total_women_mps_line.y(d => y(d.women_pct))
            total_women_mps_path.transition()
                .attr("d", total_women_mps_line)
            total_women_mps_area.y1(d => y(d.women_pct))
            total_women_mps_path_area.transition()
                .attr("d", total_women_mps_area)

            d3.select(".women-label")
                .style("fill", colors["Male"])
            break
        }

        break

    case 3:
        d3.select("#slide4")
            .style("display", "none")
        d3.select(".switch")
            .style("opacity", 0)
        if (document.getElementById("zoom-checkbox")
            .checked != false) {
            document.getElementById("zoom-checkbox")
                .click()
        }
        chartTitle
            .transition()
            .text("")
        break

    case 4:
        d3.select("#slide4")
            .style("display", "none")
        switch (new_step) {
        case 0:
            update_fifth_slide(false, "economy", true, false)

            chartTitle
                .transition()
                .text("Time spent on the economy")
            break
        case 1:
            update_fifth_slide(false, "welfare reforms", true, false)
            chartTitle
                .transition()
                .text("Time spent on welfare reforms")
            break
        case 2:
            update_fifth_slide(false, "parliamentary terminology", true, false)
            chartTitle
                .transition()
                .text("Time spent on parliamentary terminology")
            break
        case 3:
            update_fifth_slide(false, "parliamentary terminology", true, true)
            chartTitle
                .transition()
                .text("Time spent on parliamentary terminology")
            break
        }
        d3.select(".slide5-dropdown")
            .style("display", "none")
        break
    }

}

function handleStepExit(response) {
    // response = { element, direction, index }

    // Always hide tooltips at the end of each step
    d3.select("#tooltip")
        .style("opacity", 0)
    // which step is exiting?
    let current_step = +$step.nodes()[response.index].getAttribute("data-step")

    // get next step (based on direction)
    try {
        let next_step = +$step.nodes()[response.index + (response.direction == "down" ? 1 : -1)].getAttribute("data-step")
        // If the current and next are the same, do nothing
        if (current_step == next_step) return
    } catch (e) {
        //pass
    }
    // What to do when a step exits
    switch (current_slide) {
    case 0:
        switch (current_step) {
        case 0.1:
            break
        case 0.2:
            // Hide tooltip
            d3.select("#tooltip")
                .style("opacity", 0)
            break
        case 7:
            if (response.direction == "down") {
                // Unhighlight election term
                electionRects.filter((d, i) => i == 22)
                    .classed("hover", false)
                mouseover_svg.transition()
                    .duration(1000)
                    .call(zoom.transform, d3.zoomIdentity)
                    .on("end", () => {
                        d3.selectAll(".y-axis .tick")
                            .style("opacity", d => d >= 0 ? 1 : 0)

                        // Set default mp_filter
                        mp_filter = mps_over_time_data.map(mp => mp.clean_name)
                        // Unfade all MPs
                        dataContainer.selectAll("custom.line")
                            .transition()
                            .attr("strokeStyle", d => colorParty(d.party))

                        var t = d3.timer((elapsed) => {
                            draw(context, false)
                            if (elapsed > 500) {
                                t.stop()
                                draw(context)
                            }
                        })
                    })

            }

            break
        }
        break

    case 3:
        // For the fourth slide
        switch (current_step) {
        case 2:
            if (response.direction == "up") {
                d3.select("#slide4")
                    .style("pointer-events", "none")
                    .style("opacity", 0)
            }
            break
        case 3:
            if (response.direction == "down") {
                d3.select("#slide4")
                    .style("pointer-events", "none")
                    .style("opacity", 0)
            }
        }
        break
    }
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
    // d3.selectAll(".sticky")
    //     .each(function () {
    //         Stickyfill.add(this)
    //     })


    var new_width = timeline.clientWidth - margin.left - margin.right,
        new_height = (timeline.clientHeight - margin.top - margin.bottom)

    if (new_width != width | new_height != height) {
        width = new_width
        height = new_height


        // If width less than 500, we have a mobile (very abitrary)
        isMobile = width < 500

        // SET THE THICKNESS OF EACH LINE BASED ON THE CHART HEIGHT
        lineThickness = 0.0018 * height * 2
        // SET THE RADIUS OF EACH LINE'S END BASED ON THE LINE THICKNESS
        circleRadius = lineThickness / 2
        svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom * 2)

        mouseover_svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom * 2)

        // Scale the canvas correctly
        ratio = getRetinaRatio()
        context.scale(ratio, ratio)
        context.translate(margin.left, margin.top)

        canvas
            .attr("width", ratio * (width + margin.left + margin.right))
            .attr("height", ratio * (height + margin.top + margin.bottom))
            // .attr("width", (width + margin.left + margin.right))
            // .attr("height", (height + margin.top + margin.bottom))
            .style("width", width + margin.left + margin.right + "px")
            .style("height", height + margin.top + margin.bottom + "px")

        // And do the same for the hidden canvas
        context_hidden.scale(ratio, ratio)
        context_hidden.translate(margin.left, margin.top)

        canvas_hidden
            .attr("width", ratio * (width + margin.left + margin.right))
            .attr("height", ratio * (height + margin.top + margin.bottom))
            // .attr("width", (width + margin.left + margin.right))
            // .attr("height", (height + margin.top + margin.bottom))
            .style("width", width + margin.left + margin.right + "px")
            .style("height", height + margin.top + margin.bottom + "px")

        new_slide = 0
        current_slide = -1
        // REDRAW
        initial_render()
        first_slide()

        // Set height of each step
        // $step.style("height", height/2)
        // $step.style("margin-top", height)

        // Move the footer down until it can be seen
        // d3.select("#footer")
        //     .style("margin-top", (height + margin.top + margin.bottom) * 1.1)

        // 3. tell scrollama to update new element dimensions
        // scroller.resize()

        // bind scrollama event handlers
        // scroller
        //     .setup({
        //         container: "#scroll", // our outermost scrollytelling element
        //         graphic: ".scroll__graphic", // the graphic
        //         text: ".scroll__text", // the step container
        //         step: ".scroll__text .step", // the step elements
        //         // offset: 0.5, // set the trigger to be 1/2 way down screen
        //         debug: true, // display the trigger offset for testing
        //     })
        //     .onStepEnter(handleStepEnter)
        //     .onStepExit(handleStepExit)
        //     .onContainerEnter(handleContainerEnter)
        //     .onContainerExit(handleContainerExit)


    }
}
// ----------------------------------------------------------------------------
// REDRAW GRAPH ON WINDOW RESIZE
// ----------------------------------------------------------------------------
// window.addEventListener("resize", draw_graph)
