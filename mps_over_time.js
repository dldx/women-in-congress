// ----------------------------------------------------------------------------
// ██╗    ██╗ ██████╗ ███╗   ███╗███████╗███╗   ██╗    ██╗███╗   ██╗     ██████╗ ██████╗ ███╗   ██╗ ██████╗ ██████╗ ███████╗███████╗
// ██║    ██║██╔═══██╗████╗ ████║██╔════╝████╗  ██║    ██║████╗  ██║    ██╔════╝██╔═══██╗████╗  ██║██╔════╝ ██╔══██╗██╔════╝██╔════╝
// ██║ █╗ ██║██║   ██║██╔████╔██║█████╗  ██╔██╗ ██║    ██║██╔██╗ ██║    ██║     ██║   ██║██╔██╗ ██║██║  ███╗██████╔╝█████╗  ███████╗
// ██║███╗██║██║   ██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║    ██║██║╚██╗██║    ██║     ██║   ██║██║╚██╗██║██║   ██║██╔══██╗██╔══╝  ╚════██║
// ╚███╔███╔╝╚██████╔╝██║ ╚═╝ ██║███████╗██║ ╚████║    ██║██║ ╚████║    ╚██████╗╚██████╔╝██║ ╚████║╚██████╔╝██║  ██║███████╗███████║
//  ╚══╝╚══╝  ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝    ╚═╝╚═╝  ╚═══╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
// ----------------------------------------------------------------------------
// A visualization celebrating women in the House of Representatives
//
// by Durand D'souza
//
// https://github.com/dldx/women-in-congress
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

// These are the colours used to identify each political party as well as
// a few additional functions
var colors = {
    "Republican": "#E31331",
    "Democratic": "#2A9FD7",
    "Democrat": "#2A9FD7",
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
    height = 0,
    margin

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
    credit_alink,
    xAxis, gX, xLabel,
    yAxis, gY, yLabel,
    tooltip,
    lineThickness,
    circleRadius,
    selected_topic,
    circle_male,
    circle_female,
    slide5_xScale,
    slide5_yScale,
    temp_nodes,
    mp_filter,
    isMobile,
    all_mps_draw_timer,
    annotate_timer,
    tooltip_timer

var mps_over_time_data,
    number_women_over_time_data,
    total_mps_over_time_data,
    women_in_govt_data,
    mp_base64_data,
    topic_medians_data,
    baked_positions_data,
    house_candidates_data,
    nodes_male,
    nodes_female,
    states

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
            // yAxis = d3.axisLeft(y)
            gY = d3.select(".y-axis")
                .call(yAxis)
            if (typeof (callback) != "undefined") {
                callback(current_slide)
            }
        })

    d3.select(".switch").select("label").text("ZOOM")
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
        } else if (new_slide == 6) {
            // Load seventh slide
            reset_zoom(to_seventh_slide, current_slide)
        } else if (current_slide != -1 & new_slide == 0) {
            // Add zoom capabilities for the points
            zoom.on("zoom", zoomed)
            // svg.call(zoom)
            // canvas.call(zoom)
            to_first_slide(current_slide)
        }
        current_slide = new_slide
    }
}

// ----------------------------------------------------------------------------
// ██╗███╗   ██╗██╗████████╗██╗ █████╗ ██╗     ██╗███████╗███████╗    ██╗   ██╗██╗███████╗██╗   ██╗ █████╗ ██╗     ██╗███████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
// ██║████╗  ██║██║╚══██╔══╝██║██╔══██╗██║     ██║██╔════╝██╔════╝    ██║   ██║██║██╔════╝██║   ██║██╔══██╗██║     ██║╚══███╔╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
// ██║██╔██╗ ██║██║   ██║   ██║███████║██║     ██║███████╗█████╗      ██║   ██║██║███████╗██║   ██║███████║██║     ██║  ███╔╝ ███████║   ██║   ██║██║   ██║██╔██╗ ██║
// ██║██║╚██╗██║██║   ██║   ██║██╔══██║██║     ██║╚════██║██╔══╝      ╚██╗ ██╔╝██║╚════██║██║   ██║██╔══██║██║     ██║ ███╔╝  ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
// ██║██║ ╚████║██║   ██║   ██║██║  ██║███████╗██║███████║███████╗     ╚████╔╝ ██║███████║╚██████╔╝██║  ██║███████╗██║███████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝╚═╝╚══════╝╚══════╝      ╚═══╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
// CREATE AXES, SCALES, ZOOM REGION, TOOLTIP
// ----------------------------------------------------------------------------
function initial_render() {
    "use strict"
    // INITIALISE THE X AND Y AXIS SCALES AND RANGES
    x = d3.scaleUtc()
        .domain([new Date(1915, 1, 1), new Date(2020, 1, 1)])
        .range([0, width])

    y = d3.scaleLinear()
        .domain([0, 90]) // Almost 90 reps by 2020
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
        .style("transform", `translate(${margin.left * (isMobile ? 1.2 : 2)}px, ${isMobile ? 0.15*height : margin.top/2}px)`)
        .html("<input type=\"checkbox\" id=\"zoom-checkbox\"><span class=\"slider\"></span><div><label for='zoom-checkbox'>ZOOM</label></div>")

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
    yAxis = d3.axisRight(y)
    gY = wrapper.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .attr("transform", "translate(" + width  + ", 0)")

    // Add chart title
    chartTitle = svg.append("text")
        .attr("x", (width / 2) + margin.left)
        .attr("y", margin.top / 2)
        .style("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("")

    // Add axes labels
    credit_alink = svg.append("a")
        .attr("target", "_blank")
    credit_alink.append("text")
        .attr("transform",
            "translate(" + (margin.left) + " ," +
            (height + margin.top + margin.bottom) + ")")
        .attr("class", "credit-label")
        .style("text-anchor", "start")

    xLabel = svg.append("text")
        .attr("transform",
            "translate(" + (margin.left + margin.right + width)/2 + " ," +
            (height + margin.top + margin.bottom) + ")")
        .attr("class", "x-label")
        .style("text-anchor", "middle")
        .text("")

    yLabel = svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.left + margin.right*3/4)
        .attr("x", 0 - (height + margin.top + margin.bottom) / 2)
        .attr("class", "y-label")
        .attr("dominant-baseline", "baseline")
        .text("Number of Women Representatives")

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
        .style("opacity", show_rect ? 0.35 : 0)
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
        .text("Women in the House of Representatives")
    // Change credits
    credit_alink
        .attr("xlink:href", "https://en.wikipedia.org/wiki/Women_in_the_United_States_House_of_Representatives#List_of_female_members")
        .select("text")
        .transition()
        .text("Data: Wikipedia")

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
                context.lineWidth = hidden ? lineThickness * 1.6 : lineThickness
                context.strokeStyle = hidden ? node.attr("hiddenStrokeStyle") : node.attr("strokeStyle")
                // Different thickness and shape for hidden layer
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
                .on("end", () => {
                    mouseover_svg.selectAll(".annotation-group").remove()
                })

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

    // Interrupt previous transition
    d3.select("#tooltip").interrupt()
    // Hide tooltip on scroll but wait for window to settle first
    d3.timeout(() => {
        window.addEventListener("scroll", () => {
            d3.select("#tooltip")
                .style("opacity", 0)
                // Get rid of annotation line too
            mouseover_svg.selectAll(".annotation-group").remove()

        }, { once: true })
    }, 1000)
    // Hide tooltip after 5 secs
    d3.select("#tooltip").transition().delay(5000)
        .style("opacity", 0)
        .on("end", () => {
            // Get rid of annotation line too
            mouseover_svg.selectAll(".annotation-group").remove()
        })

    // Display tooltip
    d3.select("#tooltip")
        .style("opacity", 1)
        .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth/2,
            width - tooltip.offsetWidth - margin.right),
        0 + margin.left)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight * 2 - 20,
            height + tooltip.offsetHeight * 2 - 20), margin.top)}px)`)
        .style("pointer-events", "none")

    var partyLogo = partyHasLogo.indexOf(nodeData.party) != -1
    var tooltip_innerHTML = `
                    <h1 style="border-color: ${colorParty(nodeData.party)};">${nodeData.name}</h1>
                    <div class="body">
                <div class="mp-image-parent">`

    if (typeof (mp_base64_data) == "undefined") {
        tooltip_innerHTML += `<img class="mp-image-blurred" style="opacity: 0;"/>
                <img class="mp-image" src="./member-images/${nodeData.id}.jpg" />
                `

    } else {
        // If mp has a photo
        if (typeof (mp_base64_data[nodeData.id]) !== "undefined") {
            tooltip_innerHTML += `<img class="mp-image-blurred" src="data:image/jpeg;base64, ${mp_base64_data[nodeData.id]}"/>
                <img class="mp-image" src="./member-images/${nodeData.id}.jpg" style="opacity: ${typeof nodeData.loaded == "undefined" ? 0 : nodeData.loaded}${nodeData.loaded = 1};" onload="this.style.opacity = 1;" />
                `
        }
    }
    tooltip_innerHTML += `</div>
            <div class="body-facts">
                    <div class="mp-term">${d3.timeFormat("%Y")(nodeData.term_start)} &rarr; \
                    ${d3.timeFormat("%Y")(nodeData.term_end)}</div>
                    <div class="mp-constituency">${nodeData.district}</div>
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

    tooltip_timer = d3.timeout(() => {
        // Point to MP
        var tooltip_pos = tooltip.getBoundingClientRect()
        // var tooltip_pos = {x: Math.max(Math.min(mousePos[0] - tooltip.offsetWidth,
        //     width - tooltip.offsetWidth - margin.right),
        // 0 + margin.left), width: tooltip.offsetWidth, bottom: Math.max(Math.min(mousePos[1] - 20,
        //     height + 2*tooltip.offsetHeight - 20), margin.top + tooltip.offsetHeight)}
        var line_pos = mouseover_svg.select("line").node().getBoundingClientRect()

        mouseover_svg.selectAll(".annotation-group").remove()

        var makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations([{
                note: {
                    title: "...."
                },
                connector: {
                    end: "dot"
                },
                //can use x, y directly instead of data
                x: line_pos.x + line_pos.width/2,
                y: line_pos.y + line_pos.height/2,
                dx: tooltip_pos.x + tooltip_pos.width/2 - line_pos.x,
                dy: tooltip_pos.bottom - line_pos.y - 3
            }])

        mouseover_svg
            .append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations)

        // Hide label because we are using tooltip instead
        mouseover_svg.selectAll(".annotation-group text").style("opacity", 0)
    }, 300)
}

// ----------------------------------------------------------------------------
// GO TO FIRST SLIDE FROM ANOTHER
// ----------------------------------------------------------------------------
function to_first_slide(current_slide) {
    var t0 = svg
        .transition()
        .duration(1000)

    yLabel.transition(t0)
        .text("Number of Women Representatives")

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
        break
    case 2:
        // Fade all objects belonging to second and third slides
        t0.select("#slide2-group")
            .style("opacity", 0)
            .remove()
        t0.select("#slide3-group")
            .style("opacity", 0)
            .remove()
        d3.select("#tooltip")
            .classed("slide3-tooltip", false)
            .classed("slide5-tooltip", false)

        break
    }
    // Reduce opacity of election rects for first slide
    d3.selectAll(".election-rect")
        .on("mouseover", null)
        .on("mouseout", null)


    // Hide tooltip
    d3.select("#tooltip")
        .style("opacity", 0)
    // Get rid of annotation line too
    mouseover_svg.selectAll(".annotation-group").remove()

    // Show canvas
    d3.select("#visible-canvas")
        .style("opacity", 1)
        .style("display", null)
    // Scale axes to fit all data
    y.domain([0, 90])
    gY.transition()
        .duration(1000)
        .call(yAxis.tickFormat(d => d))
    xAxis.scale(x.domain([new Date(1915, 1, 1), new Date(2020, 1, 1)]))
    gX.transition()
        .duration(1000)
        .call(xAxis)

    d3.selectAll(".x-axis path").style("opacity", 1)

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
            .text("Number of Representatives")

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

            d3.select("#tooltip")
                .classed("slide3-tooltip", false)
                .classed("slide5-tooltip", false)
            break

        }

        // Scale axes to fit all data
        x.domain([new Date(1915, 1, 1), new Date(2020, 1, 1)])
        xAxis = d3.axisBottom(x)
        if (isMobile) xAxis.ticks(5)
        gX.transition()
            .duration(1000)
            .call(xAxis)


        d3.selectAll(".x-axis path").style("opacity", 1)

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
        .attr("stroke-width", lineThickness)
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
        .selectAll("rect")
        .style("opacity", 0.25)

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
        .attr("stroke-width", lineThickness)
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
        .attr("stroke-width", lineThickness)
        .attr("d", total_women_mps_line)
        .style("opacity", 0)

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
    // Get rid of annotation line too
    mouseover_svg.selectAll(".annotation-group").remove()

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
        .domain([0, 90]) // Almost 90 reps by 2020
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
    y.domain([0, 450])
    yAxis = d3.axisRight(y)

    // Change y axis label
    yLabel
        .transition()
        .delay(no_transition ? 0 : 4000)
        .duration(no_transition ? 0 : 750)
        .text("Number of Representatives")

    chartTitle
        .transition()
        .delay(no_transition ? 0 : 4000)
        .duration(no_transition ? 0 : 750)
        .text("Representatives in Congress")

    // Change credits
    credit_alink
        .attr("xlink:href", "https://en.wikipedia.org/wiki/Party_divisions_of_United_States_Congresses")
        .select("text")
        .transition()
        .text("Data: Wikipedia")


    slide2Group.append("text")
        .attr("x", x(new Date(2017, 1, 1)))
        .attr("y", y(0) - 2.5 * lineThickness)
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
        // .style("opacity", 0)

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
                .attr("x", x(new Date(2017, 1, 1)))
                .attr("y", y(300))
                .attr("class", "men-label")
                .text("Men")
                .style("opacity", 0)
                .transition()
                .duration(no_transition ? 0 : 500)
                .style("opacity", 1)

            // Add text label for party
            slide2Group.append("text")
                .attr("x", x(new Date(1920, 1, 1)))
                .attr("y", y(425))
                .attr("class", "party-label")
                .attr("alignment-baseline", "hanging")
                .text("")

            // Add a smoothed 50% line to show halfway mark for gender and place text label on it
            half_max_mps_line_smooth = d3.line()
                .x(function (d) {
                    return x(d.year)
                })
                .y(function (d) {
                    return y(d.total_mps / 2)
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
                .attr("class", "i5050-label")
                .text("50:50 gender representation")
                .style("opacity", 0)
                .transition()
                .duration(no_transition ? 0 : 500)
                .style("opacity", 1)

            // Use election rects to catch mouseovers and display information
            electionRects
                .on("mouseover", function (d, i) {
                    // Interrupt previous transition
                    d3.select("#tooltip").interrupt()
                    // Hide tooltip on scroll but wait for window to settle first
                    d3.timeout(() => {
                        window.addEventListener("scroll", () => {
                            d3.select("#tooltip")
                                .style("opacity", 0)
                            // Get rid of annotation line too
                            mouseover_svg.selectAll(".annotation-group").remove()

                        }, { once: true })
                    }, 1000)
                    // Hide tooltip after 5 secs
                    d3.select("#tooltip").transition().delay(5000)
                        .style("opacity", 0)
                        .on("end", () => {
                            // Get rid of annotation line too
                            mouseover_svg.selectAll(".annotation-group").remove()
                        })

                    // Get mouse positions
                    var mousePos = d3.mouse(this)

                    d3.select("#tooltip")
                        .style("opacity", 1)
                        .classed("slide3-tooltip", true)
                        .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth / 2,
                            width - tooltip.offsetWidth - margin.right),
                        0 + margin.left)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight - 20,
                            height + tooltip.offsetHeight - 20), margin.top)}px)`)
                        .style("pointer-events", "none")

                    d3.select(this)
                        .classed("hover", true)
                    // Reconfigure tooltip to show different information
                    var first_election = d.year
                    var second_election = total_mps_over_time_data[Math.min(total_mps_over_time_data.length - 1, i + 1)].year
                    if (chartTitle.text()
                        .includes("Democratic")) {
                        // Take highest number of women who served during that time
                        var num_women = Math.max(...number_women_over_time_data
                            .filter(d => d.year > first_election && d.year <= second_election)
                            .map(d => d.democrat_women_mps))
                        var gender_ratio = d.democrat_mps / num_women - 1
                        tooltip.innerHTML = `<div class="slide2-tooltip"><h1>${formatDate(first_election)} &rarr; ${formatDate(second_election)}</h1>
                        ${num_women > 0 ? `<p>${num_women} Wom${num_women == 1 ? "a" : "e"}n</p><hr/>
                        For every <span class="female">woman</span> Democrat, there ${new Date() > second_election ? "were" : "are"}
                        <div class="gender-ratio">${gender_ratio.toFixed(1)}</div> <span class="male">men</span> Democrats.` :
        "There were no Democratic women in the House of Representatives yet :("}
                        </div>
                        `
                    } else if (chartTitle.text()
                        .includes("Republican")) {
                        num_women = Math.max(...number_women_over_time_data
                            .filter(d => d.year > first_election && d.year <= second_election)
                            .map(d => d.republican_women_mps))
                        gender_ratio = d.republican_mps / num_women - 1
                        tooltip.innerHTML = `<div class="slide2-tooltip"><h1>${formatDate(first_election)} &rarr; ${formatDate(second_election)}</h1>
                        ${num_women > 0 ? `<p>${num_women} Wom${num_women == 1 ? "a" : "e"}n</p><hr/>
                        For every <span class="female">woman</span> Republican, there ${new Date() > second_election ? "were" : "are"}
                        <div class="gender-ratio">${gender_ratio.toFixed(1)}</div> <span class="male">men</span> Republicans.` :
        "There were no Republican women in the House of Representatives yet :("}
                        </div>
                        `
                    } else {
                        num_women = Math.max(...number_women_over_time_data
                            .filter(d => d.year > first_election && d.year <= second_election)
                            .map(d => d.total_women_mps))
                        gender_ratio = d.total_mps / num_women - 1
                        tooltip.innerHTML = `<div class="slide2-tooltip"><h1>${formatDate(first_election)} &rarr; ${formatDate(second_election)}</h1>
                        ${num_women > 0 ? `<p>${num_women} Wom${num_women == 1 ? "a" : "e"}n</p><hr/>
                        For every <span class="female">woman</span> representative, there ${new Date() > second_election ? "were" : "are"}
                        <div class="gender-ratio">${gender_ratio.toFixed(1)}</div> <span class="male">men</span> representatives.` :
        "There were no women in the House of Representatives yet :("}
                        </div>
                        `
                    }
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
            yAxis = d3.axisRight(y)
                .tickFormat(d => d)
            break
        case 1:
            // If we're coming from the second slide
            yAxis = d3.axisRight(y)
                .tickFormat(d => d)
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
                .tickFormat(d => d3.timeFormat("%Y")(d))
            if (isMobile) {
                xAxis
                    .tickValues(x.ticks(8).concat(x.domain()))
            }

            yAxis = d3.axisRight(y)
                .tickFormat(d => d)

            xLabel
                .text("")
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

            // Crop the 5050 line to 1990 onwards
            text_path_50_50.datum(total_mps_over_time_data.slice(13))

            // Disable all pointer events for canvas
            canvas.style("pointer-events", "none")
            break
        }

        d3.selectAll(".x-axis path").style("opacity", 1)
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
        .style("opacity", 1)
        .text("Parliaments in developed countries")

    // Change credits
    credit_alink.attr("xlink:href", "https://data.worldbank.org/indicator/SG.GEN.PARL.ZS")
        .select("text")
        .transition()
        .text("Data: Inter-parliamentary Union")

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
        .call(yAxis.tickFormat(d => d))

    total_women_mps_line
        .y(d => y(d.women_pct))

    total_women_mps_path
        .style("opacity", 1)
        .transition(t0)
        .attr("d", total_women_mps_line)

    // Label this line
    var make_country_label = d3.annotation()
        .type(d3.annotationCallout)
        .annotations([{
            note: {
                title: "United States"
            },
            connector: {
                end: "arrow"
            },
            //can use x, y directly instead of data
            x: x(new Date(2017, 1,1)),
            y: y(20.3),
            dx: x(new Date(2014,1,1)) - x(new Date(2017, 1,1)),
            dy: y(5) - y(20.3)
        }])

    d3.timeout(() => {
        slide3Group
            .append("g")
            .attr("class", "country-label")
            .call(make_country_label)

    }, no_transition ? 500 : 1000)

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
        .attr("d", half_max_mps_line_smooth)

    mask
        .transition(t0)
        .attr("d", max_mps_area)

    yLabel
        .transition(t0)
        .text("% of Women Representatives")

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
    x.domain([new Date(1990, 1, 1), new Date(2017, 12, 1)])
    xAxis.scale(x)

    if(isMobile) xAxis.tickValues(x.ticks(8).concat(x.domain())).tickFormat(d => d3.timeFormat("%Y")(d))

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
        .filter((d) => d.key == "United States")[0].values = number_women_over_time_data
            .map(d => {
                return {
                    year: d.year,
                    women_pct: d.women_pct,
                    country: "United States"
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
        .attr("stroke-width", lineThickness)
        .style("stroke", d => d.key == "United States" ? colors["Hover"] : countryColors(d.key))
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
        .classed("slide3-tooltip", true)
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
        .style("opacity", d => d.key == "United States" ? 1.0 : 0.5)
        .attr("stroke-width", d => d.key == "United States" ? 0.75 * lineThickness : lineThickness / 4)
        .on("start", d => {
            if (current_slide == 2) {
                d3.select("#tooltip")
                    .style("opacity", 1)

                // Show relevant tooltip info
                var gender_ratio = 100 / d.values.slice(-1)[0].women_pct - 1
                tooltip.innerHTML = `
                            <div class="slide3-tooltip">
                                <h1 style="border-color: ${d.values.slice(-1)[0].country == "United States" ? colors["Hover"] : countryColors(d.values.slice(-1)[0].country)}">${d.values.slice(-1)[0].country}</h1>
                                For every <span class="female">woman</span> representative, there were
                                <div class="gender-ratio">${gender_ratio.toFixed(1)}</div> <span class="male">men</span> representatives in ${d.values.slice(-1)[0].year.getFullYear()}.
                            </div>`
            }
        })
        .on("end", (d) => {
            // Record that the country is now visible on screen so that we can toggle its hover methods
            country_on_screen.push(d.key)
            // If country is the US, then we can get rid of the total women mps line
            if (d.key == "United States") total_women_mps_path.remove()
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
        // Interrupt previous transition
        d3.select("#tooltip").interrupt()
        // Hide tooltip on scroll but wait for window to settle first
        d3.timeout(() => {
            window.addEventListener("scroll", () => {
                d3.select("#tooltip")
                    .style("opacity", 0)

            }, { once: true })
        }, 1000)
        // Hide tooltip after 5 secs
        d3.select("#tooltip").transition().delay(5000)
            .style("opacity", 0)

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
                                <h1 style="border-color: ${d.data.country == "United States" ? colors["Hover"] : countryColors(d.data.country)};">${d.data.country}</h1>
                                For every <span class="female">woman</span> representative, there were
                                <div class="gender-ratio">${gender_ratio.toFixed(1)}</div> <span class="male">men</span> representatives in ${d.data.year.getFullYear()}.
                            </div>`
            d.line = d3.select("#" + d.data.country.replace(/[^a-zA-Z0-9s]/g, ""))
            d.line
                .attr("stroke-width", d => d.key == "United States" ? lineThickness * 2 : lineThickness)
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
                .attr("stroke-width", d => d.key == "United States" ? 0.75 * lineThickness : lineThickness / 4)
                .style("opacity", d => d.key == "United States" ? 1.0 : 0.5)
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

        d3.select("#slide3-group")
            .style("opacity", 0)
        t0
            .on("end", function () {
                d3.select("#slide3-group")
                    .remove()
            })
        d3.select("#tooltip")
            .classed("slide3-tooltip", false)
            .classed("slide5-tooltip", false)
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

        d3.selectAll(".slide5-dropdown, .slide5-search, .x-custom-axis, .switch")
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
    // Change credits
    credit_alink
        .attr("xlink:href", null)
        .select("text")
        .transition()
        .text("")

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
        d3.select("#tooltip")
            .classed("slide3-tooltip", false)
            .classed("slide5-tooltip", false)
        break
    case 5:
        // Fade out sixth slide
        d3.selectAll("#slide6-group, .x-custom-label, .y-axis")
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

    xLabel
        .style("opacity", 0)

    d3.select(".slide5-dropdown")
        .remove()


    // Increment lastTransitioned counter if it is less than 0
    if (lastTransitioned < 4) {
        lastTransitioned = 4
        fifth_slide(false)
    } else if (lastTransitioned == 5) {
        // Wait a bit for axes to fade out first
        d3.transition()
            .duration(600)
            .on("end", () => { fifth_slide(true) })
    } else {
        // Wait a bit for axes to fade out first
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
    // Change credits
    credit_alink
        .attr("xlink:href", "https://www.congress.gov/congressional-record")
        .select("text")
        .transition()
        .text("Data: Congressional Record (raw transcripts)")

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

    // d3.select(".switch")
    //     .style("opacity", 1)


    if (lastTransitioned > 4) {
        // Calculate labels for dropdown based on how polarised the topic is
        let hist = d3.histogram()
            .domain([-1.5, 1.5])
            .thresholds([-.8, -0.4, -0.05, 0.05, 0.4, .8])

        // dictionary to store the labels
        let dropdown_labels = {}

        // Loop through each topic, calculating the histogram bin that it belongs to.
        // All the male topics get ♂ symbols and all the female topics get ♀ symbols.
        // We assign 3 symbols to the most polarised topics and 0 to the least polarised
        Object.entries(topic_medians_data)
            .map(d => [d[0],
                ["♂♂♂", "♂♂ ", "♂  ", "⚤  ", "♀  ", "♀♀ ", "♀♀♀"][hist([(d[1]["female"] > d[1]["male"]) ? (d[1]["female"] / d[1]["male"] - 1) : (-d[1]["male"] / d[1]["female"] + 1)])
                    .map(i => i.length)
                    .indexOf(1)
                ] + " " + d[0]
            ])
            .forEach(d => { dropdown_labels[d[0]] = d[1] })

        // Add a dropdown to select different topics
        d3.select("body")
            .append("span")
            .attr("class", "slide5-dropdown")
            .append("select")
            .attr("id", "topic-dropdown")
            .attr("class", "slide5-dropdown__select")
            .on("change", update_fifth_slide)
            .selectAll(".topic")
            .data(baked_positions_data.map(topic => topic.key)
                .reverse())
            .enter()
            .append("option")
            .attr("selected", d => d == selected_topic ? "selected" : null)
            .attr("value", d => d)
            .text(d => dropdown_labels[d].toUpperCase())
    }

    // Add search box for MPs
    d3.selectAll(".slide5-search")
        .remove()
    d3.select("body")
        .append("span")
        .attr("class", "slide5-search")
        .append("input")
        .attr("id", "mp-search")
        .attr("type", "text")
        .attr("placeholder", "🔎 Search for your rep by name or district")


    let inp = document.getElementById("mp-search")
    // Variable that holds the currently focused mp
    let currentFocus

    function doSearch() {
        // This function is called every time the search input changes
        let val = this.value.toLowerCase()
        let results = temp_nodes.slice(2)
            .filter(d => d.search_string.includes(val))
            .sort((a, b) => a.search_string.search(val) - b.search_string.search(val)) // MPs with strings matching first names go first
        closeAllLists()
        if (results.length == 1) {
            slide5_show_mp_tooltip(results[0])
        } else {
            // Hide tooltip
            d3.select(tooltip)
                .style("opacity", 0)

            // Get rid of annotation line too
            mouseover_svg.selectAll(".annotation-group").remove()

        }
        if (!val) { return false }
        currentFocus = -1
        /*create a DIV element that will contain the items (values):*/
        let a = document.createElement("DIV")
        a.setAttribute("id", this.id + "autocomplete-list")
        a.setAttribute("class", "autocomplete-items")
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a)
        /*for each item in the array...*/
        for (let i = 0; i < results.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/

            /*create a DIV element for each matching element:*/
            let b = document.createElement("DIV")
            // MP appears as "Nancy Pelosi (D-California)"
            let mp_string = `${results[i].full_name} (${results[i].party[0]}-${states[results[i].state]})`
            /*make the matching letters bold:*/
            let match_position = mp_string.toLowerCase()
                .search(val)
            if (match_position != -1) {
                b.innerHTML = mp_string.slice(0, match_position) + "<b>" + mp_string.slice(match_position, match_position + val.length) + "</b>" + mp_string.slice(match_position + val.length)
            } else {
                b.innerHTML = mp_string
            }
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + results[i].id + "'>"
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function () {
                /*insert the value for the autocomplete text field:*/
                inp.value = temp_nodes.slice(2)
                    .filter(d => d.id == this.getElementsByTagName("input")[0].value)[0].full_name
                slide5_show_mp_tooltip(temp_nodes.slice(2)
                    .filter(d => d.id == this.getElementsByTagName("input")[0].value)[0])
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists()
            })
            a.appendChild(b)
        }
    }

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list")
        if (x) x = x.getElementsByTagName("div")
        if (x == null) return
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++

            // Show the MP that it corresponds to
            if(!isMobile) {
                slide5_show_mp_tooltip(temp_nodes.slice(2)
                    .filter(d => d.id == x[currentFocus].getElementsByTagName("input")[0].value)[0])
            }
            /*and and make the current item more visible:*/
            addActive(x)
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--
            // Show the MP that it corresponds to
            if(!isMobile) {
                slide5_show_mp_tooltip(temp_nodes.slice(2)
                    .filter(d => d.id == x[currentFocus].getElementsByTagName("input")[0].value)[0])
            }
            /*and and make the current item more visible:*/
            addActive(x)
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault()
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click()
            }
        }
    })

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false
        /*start by removing the "active" class on all items:*/
        removeActive(x)
        if (currentFocus >= x.length) currentFocus = 0
        if (currentFocus < 0) currentFocus = (x.length - 1)
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active")
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active")
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items")
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i])
            }
        }
    }

    // Bind search function to input event
    document.getElementById("mp-search")
        .addEventListener("input", doSearch)

    // Scales for this data
    slide5_xScale = d3.scaleLinear()
        .domain([-250, 120])
        .range([margin.left, width + margin.left + margin.right])

    slide5_yScale = d3.scaleLinear()
        .domain([-0.005, 0.5])
        .range([height, 0])

    y = slide5_yScale

    // Move y axis to the right and hide main line
    yAxis = d3.axisRight(y)
        .ticks(10)
        .tickFormat(d => ((d % 0.25 == 0) ? ((d * 100)
            .toFixed(0) + "%") : ""))
    gY.call(yAxis)
        .attr("transform", `translate(${width}, 0)`)
        .attr("text-anchor", "start")
        .style("opacity", 1)

    d3.select(".y-axis path")
        .style("opacity", 0)

    yLabel
        .text("% of time spent on topic")
        .style("opacity", 1)

    d3.select("#slide5-group")
        .remove()

    // Call draw function initially
    if (typeof (selected_topic) != "undefined") {
        update_fifth_slide(no_transition, selected_topic)
    } else {
        update_fifth_slide(no_transition, "energy policy", true, false)
        chartTitle
            .transition()
            .text("Time spent on energy policy")
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

    // Remove annotations
    mouseover_svg.selectAll(".annotation-group").remove()

    // Zoom out
    if (document.getElementById("zoom-checkbox") != null) {
        if (document.getElementById("zoom-checkbox")
            .checked != false) {
            document.getElementById("zoom-checkbox")
                .click()
        }
    }

    if (typeof (default_selected_topic) != "undefined" && typeof (default_selected_topic) != "number" && from_scroll) {
        selected_topic = default_selected_topic

        // Show title
        chartTitle.style("opacity", 1)
    } else {
        // Remove title because we have dropdown instead
        chartTitle.style("opacity", 0)
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
    temp_nodes = []

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
        .duration(1500)
        .attr("opacity", 0.7)
        .attr("cx", d => slide5_xScale(d.x) - 10)
        .attr("cy", d => slide5_yScale(d.y))

    // ENTER
    circle_male
        .enter()
        .append("custom")
        .attr("class", "male-node")
        .attr("r", circleRadius * (isMobile ? 0.5 : 0.8))
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
        .duration(1500)
        .attr("opacity", 0.7)
        .attr("cx", d => slide5_xScale(d.x) + 10)
        .attr("cy", d => slide5_yScale(d.y))

    // ENTER
    circle_female
        .enter()
        .append("custom")
        .attr("class", "female-node")
        .attr("r", circleRadius * (isMobile ? 0.5 : 0.8))
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
        .duration(1500)
        .attr("x1", slide5_xScale(0))
        .attr("x2", slide5_xScale(0))
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
        .duration(1500)
        .attr("cx", slide5_xScale(0))
        .attr("cy", d => slide5_yScale(drawMedian ? d : 0))
        .attr("opacity", drawMedian ? 1 : 0)

    // Enter
    male_median_circle
        .enter()
        .append("custom")
        .attr("class", "male-median")
        .attr("cx", slide5_xScale(0))
        .attr("cy", slide5_yScale(0))
        .attr("r", circleRadius * 1.5)
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
        .duration(1500)
        .attr("cx", slide5_xScale(0))
        .attr("cy", d => slide5_yScale(drawMedian ? d : 0))
        .attr("opacity", drawMedian ? 1 : 0)

    // Enter
    female_median_circle
        .enter()
        .append("custom")
        .attr("class", "female-median")
        .attr("cx", slide5_xScale(0))
        .attr("cy", slide5_yScale(0))
        .attr("r", circleRadius * 1.5)
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

    // ----------------------------------------------------------------------------
    // Annotate medians with labels
    // ----------------------------------------------------------------------------

    // Remove existing annotations
    mouseover_svg.selectAll(".female-label, .male-label").remove()

    if (drawMedian) {
    // Label female median dot
        var make_female_label = d3.annotation()
            .type(d3.annotationCallout)
            .annotations([{
                note: {
                    title: "Median woman: " + (topic_medians_data[selected_topic]["female"]*100).toFixed(1) + "%"
                },
                connector: {
                    end: "dot"
                },
                //can use x, y directly instead of data
                x: slide5_xScale(0),
                y: slide5_yScale(topic_medians_data[selected_topic]["female"]),
                dx: slide5_xScale(-100) - slide5_xScale(0),
                dy: slide5_yScale(topic_medians_data[selected_topic]["female"] > topic_medians_data[selected_topic]["male"] ? 0.25 : 0.1) - slide5_yScale(topic_medians_data[selected_topic]["female"])
            }])

        d3.timeout(() => {
            mouseover_svg
                .select(".timeline-wrapper")
                .append("g")
                .attr("class", "female-label")
                .call(make_female_label)
        }, 1500)
        // Label female median dot
        var make_male_label = d3.annotation()
            .type(d3.annotationCallout)
            .annotations([{
                note: {
                    title: "Median man: " + (topic_medians_data[selected_topic]["male"]*100).toFixed(1) + "%"
                },
                connector: {
                    end: "dot"
                },
                //can use x, y directly instead of data
                x: slide5_xScale(0),
                y: slide5_yScale(topic_medians_data[selected_topic]["male"]),
                dx: slide5_xScale(-100) - slide5_xScale(0),
                dy: slide5_yScale(topic_medians_data[selected_topic]["male"] > topic_medians_data[selected_topic]["female"] ? 0.25 : 0.1) - slide5_yScale(topic_medians_data[selected_topic]["male"])
            }])

        d3.timeout(() => {
            mouseover_svg
                .select(".timeline-wrapper")
                .append("g")
                .attr("class", "male-label")
                .call(make_male_label)
        }, 1500)
    }

    // mouseover function for getting MP info
    function mpMouseover() {

        // Get mouse positions from the main canvas.
        var mousePos = d3.mouse(this)
        // Get the data from our map!
        if (typeof (transform) !== "undefined") {
            var nodeData = quadtree.find((mousePos[0] - margin.left - transform["x"]) / transform["k"],
                (mousePos[1] - margin.top - transform["y"]) / transform["k"], 50)
        } else {
            nodeData = quadtree.find(mousePos[0] - margin.left, mousePos[1] - margin.top, 50)
        }

        // Only show mouseover if hovering near a point
        if (typeof (nodeData) !== "undefined") {
            // If we're dealing with mp nodes
            if (typeof (nodeData.id) !== "undefined") {
                slide5_show_mp_tooltip(nodeData, mousePos)
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


    window.slide5_show_mp_tooltip = function (nodeData, mousePos) {
        // Interrupt previous transition
        d3.select("#tooltip").interrupt()
        // Hide tooltip on scroll but wait for window to settle first
        d3.timeout(() => {
            window.addEventListener("scroll", () => {
                d3.select("#tooltip")
                    .style("opacity", 0)
                // Get rid of annotation line too
                mouseover_svg.selectAll(".annotation-group").remove()

            }, { once: true })
        }, 1000)
        // Hide tooltip after 5 secs
        d3.select("#tooltip").transition().delay(5000)
            .style("opacity", 0)
            .on("end", () => {
                // Get rid of annotation line too
                mouseover_svg.selectAll(".annotation-group").remove()
            })
        if (typeof (mousePos) === "undefined") {
            mousePos = [nodeData.x, nodeData.y] //[width * 3 / 4, height * 3 / 4]
            // if (isMobile) {
            //     mousePos = [width / 2, 0]
            // }
        }

        // Display tooltip either near mouse cursor or near MP
        d3.select("#tooltip")
            .style("opacity", 1)
            .classed("slide5-tooltip", true)
            .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth,
                width - tooltip.offsetWidth - margin.right),
            0 + margin.left)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight - 20,
                height + tooltip.offsetHeight - 20), margin.top)}px)`)
            .style("pointer-events", "none")

        var partyLogo = partyHasLogo.indexOf(nodeData.party) != -1
        // Show relevant tooltip info
        tooltip.innerHTML = `
                            <div class="slide5-tooltip">
                    <h1 style="border-color: ${colorParty(nodeData.party)};">${nodeData.full_name}</h1>
                    <div class="body">
                    <div class="mp-image-parent">
                    ${typeof mp_base64_data[nodeData.id] === "undefined" ? "" : "<img class=\"mp-image-blurred\" src=\"data:image/jpeg;base64," + mp_base64_data[nodeData.id] + "\" />" +
                    "<img class=\"mp-image\" src=\"./member-images/" + nodeData.id + ".jpg\" style=\"opacity: ${typeof nodeData.loaded == 'undefined' ? 0 : nodeData.loaded;d.loaded = 1;};\" onload=\"this.style.opacity = 1;\" />"}
                    </div>
                    <div class="body-facts">
                    <div class="mp-constituency">${nodeData.district}</div>
                    <p>${(slide5_yScale.invert(nodeData.y) * 100).toFixed(1)}%</em> of ${nodeData.gender == "Female" ? "her" : "his"} time spent on <em>${selected_topic}</em></p>
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
            .attr("r", circleRadius * (isMobile ? 0.8 : 1.2))
            .style("opacity", 1)
            .style("stroke-width", circleRadius)

        d3.timeout(() => {
        // Annotate circle
            var tooltip_pos = tooltip.getBoundingClientRect()
            // var tooltip_pos = {x: Math.max(Math.min(mousePos[0] - tooltip.offsetWidth,
            //     width - tooltip.offsetWidth - margin.right),
            // 0 + margin.left), width: tooltip.offsetWidth, bottom: Math.max(Math.min(mousePos[1] - 20,
            //     height + 2*tooltip.offsetHeight - 20), margin.top + tooltip.offsetHeight)}
            var circle_pos = mouseover_svg.select("circle").node().getBoundingClientRect()

            mouseover_svg.selectAll(".annotation-group").remove()

            var makeAnnotations = d3.annotation()
                .type(d3.annotationLabel)
                .annotations([{
                    note: {
                        title: "...."
                    },
                    connector: {
                        end: "dot"
                    },
                    //can use x, y directly instead of data
                    x: circle_pos.x + circle_pos.width/2,
                    y: circle_pos.y + circle_pos.width/2,
                    dx: tooltip_pos.x + tooltip_pos.width/2 - circle_pos.x,
                    dy: tooltip_pos.bottom - circle_pos.y - 3
                }])

            mouseover_svg
                .append("g")
                .attr("class", "annotation-group")
                .call(makeAnnotations)

            // Hide label because we are using tooltip instead
            mouseover_svg.selectAll(".annotation-group text").style("opacity", 0)
        }, 300)


    }

    // Mouseover for medians
    function median_mouseover(nodeData, mousePos) {
        // Interrupt previous transition
        d3.select("#tooltip").interrupt()
        // Hide tooltip on scroll but wait for window to settle first
        d3.timeout(() => {
            window.addEventListener("scroll", () => {
                d3.select("#tooltip")
                    .style("opacity", 0)
                // Get rid of annotation line too
                mouseover_svg.selectAll(".annotation-group").remove()

            }, { once: true })
        }, 1000)

        // Hide tooltip after 5 secs
        d3.select("#tooltip").transition().delay(5000)
            .style("opacity", 0)
            .on("end", () => {
                // Get rid of annotation line too
                mouseover_svg.selectAll(".annotation-group").remove()
            })
        d3.select("#tooltip")
            .style("opacity", 1)
            .classed("slide5-tooltip", true)
            .style("transform", `translate(${Math.max(Math.min(mousePos[0] - tooltip.offsetWidth / 2,
                width - tooltip.offsetWidth / 2 - margin.right),
            0 + margin.left)}px,${Math.max(Math.min(mousePos[1] - tooltip.offsetHeight - 20,
                height + tooltip.offsetHeight - 20), margin.top)}px)`)
            .style("pointer-events", "none")

        // Show relevant tooltip info
        tooltip.innerHTML = `
                            <div class="slide5-tooltip">
                    <h1 style="border-color: ${nodeData.gender == "female" ? colors["Female"] : colors["Male"]};">${nodeData.gender == "female" ? "WOMEN" : "MEN"}</h1>
                    The average ${nodeData.gender == "female" ? "WOMAN" : "MAN"} representative spends <em>${(nodeData.median*100).toFixed(1)}%</em> of ${nodeData.gender == "male" ? "his" : "her"} time talking about <em>${selected_topic}</em>.
</div>`
        mouseover_svg
            .select("circle")
            .datum(nodeData)
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", circleRadius * 2.5)
            .style("opacity", 1)
            .style("stroke-width", circleRadius)

        annotate_timer = d3.timeout(() => {
        // Annotate circle
            var tooltip_pos = tooltip.getBoundingClientRect()
            // var tooltip_pos = {x: Math.max(Math.min(mousePos[0] - tooltip.offsetWidth,
            //     width - tooltip.offsetWidth - margin.right),
            // 0 + margin.left), width: tooltip.offsetWidth, bottom: Math.max(Math.min(mousePos[1] - 20,
            //     height + 2*tooltip.offsetHeight - 20), margin.top + tooltip.offsetHeight)}
            var circle_pos = mouseover_svg.select("circle").node().getBoundingClientRect()

            mouseover_svg.selectAll(".annotation-group").remove()

            var makeAnnotations = d3.annotation()
                .type(d3.annotationLabel)
                .annotations([{
                    note: {
                        title: "...."
                    },
                    connector: {
                        end: "dot"
                    },
                    //can use x, y directly instead of data
                    x: circle_pos.x + circle_pos.width/2,
                    y: circle_pos.y + circle_pos.width/2,
                    dx: tooltip_pos.x + tooltip_pos.width/2 - circle_pos.x,
                    dy: tooltip_pos.bottom - circle_pos.y - 3
                }])

            mouseover_svg
                .append("g")
                .attr("class", "annotation-group")
                .call(makeAnnotations)

            // Hide label because we are using tooltip instead
            mouseover_svg.selectAll(".annotation-group text").style("opacity", 0)
        }, 300)
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

        d3.select("#tooltip")
            .classed("slide3-tooltip", false)
            .classed("slide5-tooltip", false)
        break

    case 3:
        d3.select("#slide4")
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .on("end", function () { this.remove() })
        break

    case 4:
        chartTitle.style("opacity", 1)
        d3.selectAll(".slide5-dropdown, .slide5-search, .x-custom-axis")
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .on("end", function () { this.remove() })

        d3.select(".y-axis")
            .style("opacity", 0)

        yLabel.style("opacity", 0)

        d3.select(".switch")
            .style("opacity", 0)
            .style("display", "none")
        if (document.getElementById("zoom-checkbox") != null) {
            if (document.getElementById("zoom-checkbox")
                .checked != false) {
                document.getElementById("zoom-checkbox")
                    .click()
            }
        }
        // Remove existing annotations
        mouseover_svg.selectAll(".female-label, .male-label").remove()
        d3.selectAll(".annotation-group").remove()
        break
    case 6:
        d3.select("#slide7-group").style("opacity", 0)
        d3.selectAll(".x-axis path").style("opacity", 1)
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
        // If first time transitioning
        // Change scales
        x = d3.scaleLinear()
            .range([0, width])
            .domain([0, 0.30])
        // Redraw axes
        xAxis = d3.axisBottom(x)
            .ticks(6)
            .tickFormat(d => (d * 100)
                .toFixed(0) + "%")
    } else {
        // Use x scale at end of transition instead
        x = d3.scaleLinear()
            .range([0, width])
            .domain([-1.5, 1.5])
        // Redraw axes
        xAxis = d3.axisBottom(x)
            .ticks(6)
            .tickFormat(d => (d * 100)
                .toFixed(0) + "%")
        // Hide canvas
        canvas
            .style("opacity", 0)
            .style("display", null)
            .style("pointer-events", "none")
    }
    gX.transition()
        .call(xAxis)

    y = d3.scalePoint()
        .range([height, 0])
        .padding(1)
    yAxis = d3.axisRight(y)
    gY.style("opacity", 0)
        .call(yAxis)

    d3.selectAll(".y-axis > .tick text").style("transition", null)


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

    // remove mp search
    d3.select(".slide5-search")
        .style("opacity", 0)
        .remove()

    // Change credits
    credit_alink
        .attr("xlink:href", null)
        .select("text")
        .transition()
        .text("")

    // Set the topics that will appear on the y axis
    let sorted_topics = Object.entries(topic_medians_data)
        .sort((a, b) => (a[1]["female"] / a[1]["male"] - b[1]["female"] / b[1]["male"]))

    y.domain(sorted_topics.map(d => d[0]))
    yAxis = d3.axisRight(y)
    gY.transition()
        .attr("transform", null)
        .attr("text-anchor", "start")
        .call(yAxis)

        // Move the axis labels while still hidden
        // Label position is on left or right according to location of point
    let label_pos = sorted_topics
        .map(d => {
            // If more space on the right
            if((x.range()[1] - x(Math.max(d[1]["male"], d[1]["female"]))) > (x(Math.min(d[1]["male"], d[1]["female"])) - x.range()[0])) {
                return "start"
            }
            return "end"
        })

    d3.selectAll(".y-axis > .tick text")
        .transition()
        .delay(500)
        .duration(1)
        .attr("x", (d, i) => label_pos[i] == "start" ? x(Math.max(sorted_topics[i][1]["male"], sorted_topics[i][1]["female"])) + 5 : x(Math.min(sorted_topics[i][1]["male"], sorted_topics[i][1]["female"])) - 5)
        .style("text-anchor", (d, i) => {
            return label_pos[i]
        })


    // Hide axis line and ticks
    d3.select(".y-axis > path")
        .style("opacity", 0)

    d3.selectAll(".y-axis > .tick line")
        .style("opacity", 0)

    var t0 = d3.transition()
        .duration(1000)


    // Only do the following steps if we'e coming from slide 5 for the first time
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
        median_connector_line_svg = slide6Group
            .selectAll(".median-connector")
            .data(sorted_topics)

        // Add hidden svg circle
        male_median_circle_svg = slide6Group
            .selectAll(".male-median")
            .data(sorted_topics)

        // Add hidden svg circle
        female_median_circle_svg = slide6Group
            .selectAll(".female-median")
            .data(sorted_topics)

        chartTitle
            .transition()
            .text("Gender bias of topics")

        xLabel
            .text("Relative gender bias")
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

        // Make all axis tick labels visible
        d3.selectAll(".y-axis > .tick text")
            .transition(t1)
            .delay((d, i) => 1800 + i * 50)
            .style("opacity", 1)

        var t2 = t1.transition()
            .delay(2500)
            .on("end", () => {
                slide6Group
                    .selectAll(".topic-" + sorted_topics.map(d => d[0])
                        .indexOf(selected_topic))
                    .attr("opacity", 1)
                slide6Group.selectAll(".tmp")
                    .remove()
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
                    .style("pointer-events", "none")
                update_state()
            })

        // Switch to relative change view
        var t3 = t2.transition()
            .delay(1000)
            .on("end", () => {
                x.domain([-1.5, 1.5])
                xAxis = d3.axisBottom(x)
                    .ticks(6)
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
                            .attr("x1", d => x((d[1]["female"] > d[1]["male"]) ? (d[1]["female"] / d[1]["male"] - 1) : (-d[1]["male"] / d[1]["female"] + 1)))
                            .attr("x2", x(0))

                        slide6Group.selectAll(".female-median")
                            .transition(t_)
                            .delay((d, i) => i * 50)
                            .attr("cx", d => d[1]["female"] > d[1]["male"] ? x(d[1]["female"] / d[1]["male"] - 1) : x(0))

                        slide6Group.selectAll(".male-median")
                            .transition(t_)
                            .delay((d, i) => i * 50)
                            .attr("cx", d => d[1]["female"] < d[1]["male"] ? x(-d[1]["male"] / d[1]["female"] + 1) : x(0))

                        d3.selectAll(".y-axis > .tick text")
                            .style("opacity", 0)

                        xLabel
                            .text("Relative gender bias")

                        wrapper.selectAll(".x-custom-label").remove()
                        wrapper.append("text")
                            .attr("class", "x-custom-label")
                            .attr("x", width)
                            .attr("y", height + (isMobile ? margin.bottom*2/3 : margin.bottom))
                            .text("Discussed more by women" + (isMobile ? "→" : " ⟶"))
                            .style("text-anchor", "end")
                            .style("fill", colors["Female"])
                            .style("alignment-baseline", "hanging")

                        wrapper.append("text")
                            .attr("class", "x-custom-label")
                            .attr("x", 0)
                            .attr("y", height + (isMobile ? margin.bottom*2/3 : margin.bottom))
                            .text((isMobile ? "←" : "⟵ ") + "Discussed more by men")
                            .style("text-anchor", "start")
                            .style("fill", colors["Male"])
                            .style("alignment-baseline", "hanging")

                    })

            })
        var t4 = t3.transition()
    } else {
        // Switch to relative change view in case this was skipped before
        slide6Group.selectAll(".median-connector")
            .attr("x1", d => x((d[1]["female"] > d[1]["male"]) ? (d[1]["female"] / d[1]["male"] - 1) : (-d[1]["male"] / d[1]["female"] + 1)))
            .attr("x2", x(0))

        slide6Group.selectAll(".female-median")
            .attr("cx", d => d[1]["female"] > d[1]["male"] ? x(d[1]["female"] / d[1]["male"] - 1) : x(0))

        slide6Group.selectAll(".male-median")
            .attr("cx", d => d[1]["female"] < d[1]["male"] ? x(-d[1]["male"] / d[1]["female"] + 1) : x(0))

        // Now fade in the slide
        t4 = d3.transition()
            .on("end", () => {
                slide6Group.style("opacity", 1)
            })

        wrapper.append("text")
            .attr("class", "x-custom-label")
            .attr("x", width)
            .attr("y", height + margin.bottom)
            .text("Discussed more by women ⟶")
            .style("text-anchor", "end")
            .style("fill", colors["Female"])
            .style("alignment-baseline", "hanging")

        wrapper.append("text")
            .attr("class", "x-custom-label")
            .attr("x", 0)
            .attr("y", height + margin.bottom)
            .text("⟵ Discussed more by men")
            .style("text-anchor", "start")
            .style("fill", colors["Male"])
            .style("alignment-baseline", "hanging")
    }


    label_pos = sorted_topics
        .map(d => d[1]["female"] - d[1]["male"] > 0)

    d3.selectAll(".y-axis > .tick text")
        .filter(d => Object.keys(topic_medians_data)
            .indexOf(d) != -1)
        .transition(t4)
        .delay(() => no_transition ? 0 : 2000)
        .duration(no_transition ? 1 : 0)
        .style("text-anchor", (d, i) => {
            return label_pos[i] ? "end" : "start"
        })
        .attr("x", (d, i) => label_pos[i] ? x.domain([-0.06, 0.06])(-0.001) : x.domain([-0.06, 0.06])(0.001))
        .transition()
        .delay(1000)
        .duration(500)
        .style("opacity", 1)


}

// ----------------------------------------------------------------------------
// TRANSITION TO SEVENTH SLIDE, EITHER WITH OR WITHOUT FANCY TRANSITIONS
// ----------------------------------------------------------------------------
function to_seventh_slide(current_slide) {
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

        d3.select("#tooltip")
            .classed("slide3-tooltip", false)
            .classed("slide5-tooltip", false)
        break

    case 3:
        d3.select("#slide4")
            .style("opacity", 0)
            .transition()
            .delay(1000)
            .on("end", function () { this.remove() })
        break

    case 4:
        chartTitle.style("opacity", 1)
        d3.selectAll(".slide5-dropdown, .slide5-search, .x-custom-axis")
            .remove()

        d3.select(".switch")
            .style("opacity", 0)
        style("display", "none")
        if (document.getElementById("zoom-checkbox") != null) {
            if (document.getElementById("zoom-checkbox")
                .checked != false) {
                document.getElementById("zoom-checkbox")
                    .click()
            }
        }
        // Remove existing annotations
        mouseover_svg.selectAll(".female-label, .male-label").remove()
        // Hide mouseover circle
        mouseover_svg
            .select("circle")
            .style("opacity", 0)
        break
    case 5:
        // Fade out sixth slide
        d3.selectAll("#slide6-group, .x-custom-label")
            .style("opacity", 0)
            .on("end", () => {
                d3.selectAll(".x-custom-label")
                    .remove()
            })

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

    canvas.style("opacity", 0)
        .style("display", "none")
        .style("pointer-events", "none")


    // Change axes
    x = d3.scaleBand().range([0, width])
        .domain(house_candidates_data.map(d => d.year)).paddingInner(0.2)
    xAxis = d3.axisBottom(x)
    gX.transition(t0)
        .call(xAxis)
        .style("opacity", 1)
        .on("end", () => {
            d3.selectAll(".x-axis path").style("opacity", 0)
            if(isMobile) {
                d3.selectAll(".x-axis text")
                    .attr("transform", "rotate(-45)")
                    .attr("text-anchor", "end")
                    .attr("dx", -5)
            }
        })
    y = d3.scaleLinear().domain([0, 500]).range([height, 0])
    yAxis = d3.axisRight(y).ticks(5).tickFormat(d => d)
    gY.style("opacity", 0)

    d3.timeout(() => {
        gY
            .transition(t0)
            .call(yAxis)
            .attr("transform", `translate(${width}, 0)`)
            .style("opacity", 1)
    }, 1000)

    xLabel.style("opacity", 1)
    yLabel.style("opacity", 1)
    // Increment lastTransitioned counter if it is less than 0
    if (lastTransitioned < 6) {
        t0.on("end", () => {
            seventh_slide(false)
            lastTransitioned = 6
        })
    } else {
        t0.on("end", () => seventh_slide(true))
    }

}

// ----------------------------------------------------------------------------
// ███████╗███████╗██╗   ██╗███████╗███╗   ██╗████████╗██╗  ██╗    ███████╗██╗     ██╗██████╗ ███████╗
// ██╔════╝██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██║  ██║    ██╔════╝██║     ██║██╔══██╗██╔════╝
// ███████╗█████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ███████║    ███████╗██║     ██║██║  ██║█████╗
// ╚════██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ██╔══██║    ╚════██║██║     ██║██║  ██║██╔══╝
// ███████║███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ██║  ██║    ███████║███████╗██║██████╔╝███████╗
// ╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝    ╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝
// SHOW CANDIDATES RUNNING IN 2018
// ----------------------------------------------------------------------------
function seventh_slide(no_transition = false) {
    // If we've already visited this slide, set no_transition to true
    no_transition = lastTransitioned >= 6

    xLabel.text("")
    yLabel.text("Number of Women House Candidates")
    chartTitle.text("Women House Candidates over Time")
    // Change credits
    credit_alink
        .attr("xlink:href", "http://cawp.rutgers.edu/facts/elections/past_candidates")
        .select("text")
        .transition()
        .text("Data: Center for American Women and Politics")

    if(no_transition) {
        var slide7Group = d3.select("#slide7-group").style("opacity", 1)
    } else {

        d3.select("#slide7-group").selectAll("*").remove()

        slide7Group = zoomedArea.append("g").attr("id", "slide7-group")


        var bar_stack = slide7Group.append("g")
            .selectAll("g")
            .data(d3.stack().keys(["dem_candidates", "rep_candidates"])(house_candidates_data))
            .enter().append("g")
            .attr("fill", d => d.key == "dem_candidates" ? colors["Democrat"] : colors["Republican"])

        bar_stack
            .selectAll("rect")
            .data(d => d)
            .enter().append("rect")
            .attr("x", d => x(d.data.year))
            .attr("y", height)
            .attr("height", 0)
            .attr("width", x.bandwidth())
            .transition()
            .duration(500)
            .delay((d,i) => i*100)
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))

        // Add some text labels for the values
        bar_stack
            .selectAll("text")
            .data(d => d)
            .enter()
            .append("text")
            .classed("bar-label", true)
            .attr("x", d => x(d.data.year) + x.bandwidth()/2)
            .attr("y", d => y(d[1]))
            .attr("dy", 10)
            .attr("dominant-baseline", "hanging")
            .style("opacity", 0)
            .text(d => d[1] - d[0])
            .transition()
            .duration(1)
            .delay((d,i) => 500 + i*100)
            .style("opacity", 1)
    }

    // Label 2018 election
    var make_2018_label = d3.annotation()
        .type(d3.annotationCallout)
        .annotations([{
            note: {
                title: "Record number of Democratic candidates in 2018",
                wrap: 250
            },
            connector: {
                end: "dot"
            },
            //can use x, y directly instead of data
            x: x(2018) + x.bandwidth()/2,
            y: y(320),
            dx: x(2014) - x(2018),
            dy: y(370) - y(320),
        }])

    d3.timeout(() => {
        slide7Group
            .append("g")
            .attr("class", "i2018-label")
            .call(make_2018_label)
    }, 14*100+500)
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
        .defer(d3.csv, "women_reps.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d")
            return {
                id: d.id,
                name: d.name,
                district: d.district,
                term_start: parseDate(d.term_start),
                term_end: parseDate(d.term_end),
                party: d.party,
                clean_name: d.clean_name,
                stream: +d.stream
            }
        })
        .defer(d3.csv, "number_women_over_time.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d")
            return {
                year: parseDate(d.date),
                total_women_mps: +d.total_women_reps,
                republican_women_mps: +d.rep_reps,
                democrat_women_mps: +d.dem_reps,
            }
        })
        .defer(d3.csv, "total_members_over_time.csv", function (d) {
            var parseDate = d3.timeParse("%Y-%m-%d")
            return {
                year: parseDate(d.date),
                total_mps: +d.total_reps,
                republican_mps: +d.rep_reps,
                democrat_mps: +d.dem_reps,
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
                d.republican_mps = total_mps_over_time_data[Math.max(0, bisect(total_mps_over_time_data, d.year) - 1)].republican_mps
                d.republican_women_pct = d.republican_women_mps / d.republican_mps * 100,
                d.democrat_mps = total_mps_over_time_data[Math.max(0, bisect(total_mps_over_time_data, d.year) - 1)].democrat_mps
                d.democrat_women_pct = d.democrat_women_mps / d.democrat_mps * 100
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
        .defer(d3.csv, "member_base64.csv", function (d) {
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
            "baked_positions.csv"
        )
        .defer(d3.csv, "topic_medians.csv",
            function (d) {
                return {
                    topic: d.topic,
                    male: Math.pow(10, +d.male),
                    female: Math.pow(10, +d.female)
                }
            })
        .defer(d3.csv, "number_women_house_candidates_over_time.csv",
            d => {
                return {
                    year: +d.Year,
                    dem_candidates: +d.Dem_Candidates,
                    rep_candidates: +d.Rep_Candidates
                }
            })
        .await(function (error, women_in_govt, baked_mp_positions, topic_medians, house_candidates) {
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

                        states = {
                            "AL": "Alabama",
                            "AK": "Alaska",
                            "AS": "American Samoa",
                            "AZ": "Arizona",
                            "AR": "Arkansas",
                            "CA": "California",
                            "CO": "Colorado",
                            "CT": "Connecticut",
                            "DE": "Delaware",
                            "DC": "District Of Columbia",
                            "FM": "Federated States Of Micronesia",
                            "FL": "Florida",
                            "GA": "Georgia",
                            "GU": "Guam",
                            "HI": "Hawaii",
                            "ID": "Idaho",
                            "IL": "Illinois",
                            "IN": "Indiana",
                            "IA": "Iowa",
                            "KS": "Kansas",
                            "KY": "Kentucky",
                            "LA": "Louisiana",
                            "ME": "Maine",
                            "MH": "Marshall Islands",
                            "MD": "Maryland",
                            "MA": "Massachusetts",
                            "MI": "Michigan",
                            "MN": "Minnesota",
                            "MS": "Mississippi",
                            "MO": "Missouri",
                            "MT": "Montana",
                            "NE": "Nebraska",
                            "NV": "Nevada",
                            "NH": "New Hampshire",
                            "NJ": "New Jersey",
                            "NM": "New Mexico",
                            "NY": "New York",
                            "NC": "North Carolina",
                            "ND": "North Dakota",
                            "MP": "Northern Mariana Islands",
                            "OH": "Ohio",
                            "OK": "Oklahoma",
                            "OR": "Oregon",
                            "PW": "Palau",
                            "PA": "Pennsylvania",
                            "PR": "Puerto Rico",
                            "RI": "Rhode Island",
                            "SC": "South Carolina",
                            "SD": "South Dakota",
                            "TN": "Tennessee",
                            "TX": "Texas",
                            "UT": "Utah",
                            "VT": "Vermont",
                            "VI": "Virgin Islands",
                            "VA": "Virginia",
                            "WA": "Washington",
                            "WV": "West Virginia",
                            "WI": "Wisconsin",
                            "WY": "Wyoming",
                            "PI": "Philippine Islands"
                        }
                        if (colname != "id" & colname != "full_name" & colname != "party" & colname != "gender" &
                            colname != "state" & colname != "district" & colname.slice(-1) != "y") {
                            var topic = colname.slice(0, -2)
                            baked_positions_data.push({
                                "id": row["id"],
                                "full_name": row["full_name"],
                                "party": row["party"],
                                "gender": row["gender"] == 1 ? "Female" : "Male",
                                "state": row["state"],
                                "district": states[row["state"]] + (row["district"] != "" ? ("'s " + row["district"]) : ""),
                                "search_string": (row["full_name"] + " " + row["state"] + " " + row["party"][0] + "-" + states[row["state"]] + " " + row["district"])
                                    .toLowerCase(),
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

            house_candidates_data = house_candidates
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

    if (response.direction == "down" && lastTransitioned >= 5) {
        // Go to seventh slide
        new_slide = 7
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
    if(d3.select(".is-active").node().innerText != "") {
        d3.select(".is-active")
            .style("opacity", 1)
            .style("pointer-events", "all")
    }

    // Hide tooltip
    d3.select("#tooltip")
        .style("opacity", 0)

    // Remove any annotations
    d3.selectAll(".annotation-group").remove()

    window.addEventListener("scroll", () => {
        d3.select("#tooltip")
            .style("opacity", 0)
        // Get rid of annotation line too
        mouseover_svg.selectAll(".annotation-group").remove()

    }, { once: true })
    // Remove existing labels
    mouseover_svg.selectAll(".mp-annotation-group, .female-label, .male-label").remove()

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
        mouseover_svg.select("line").style("opacity", 0)
        switch (new_step) {
        case -1:
            if (response.direction == "up") {
                // Hide election rects
                electionRects
                    .transition()
                    .delay((d, i) => (electionRects.nodes().length - i) * 50)
                    .style("opacity", 0)
            }
            break
        case 0:
            if (response.direction == "up") {

                // Unhighlight Roosevelt's term
                electionRects.filter((d, i) => i == 4)
                    .classed("hover", false)
                    .style("opacity", 0.35)

            }
            // Show election rects
            electionRects
                .transition()
                .delay((d, i) => i * 50)
                .style("opacity", 0.35)
            break
        case 0.1:
            // Highlight Roosevelt's term
            electionRects.filter((d, i) => i == 4)
                .classed("hover", true)
                .style("opacity", null)

            var makeAnnotations = d3.annotation()
                .type(d3.annotationCallout)
                .annotations([{
                    note: {
                        title: "FDR's Presidency"
                    },
                    connector: {
                        end: "dot"
                    },
                    //can use x, y directly instead of data
                    x: x(new Date(1940, 1, 1)),
                    y: y(50),
                    dx: isMobile ? 50 : 100,
                    dy: 200
                }])

            wrapper
                .append("g")
                .attr("class", "annotation-group")
                .call(makeAnnotations)

            break
        case 0.2:
            if (response.direction == "up") {
                d3.select(".switch")
                    .style("opacity", 0)
                    .style("display", "none")
                if (document.getElementById("zoom-checkbox") != null) {
                    if (document.getElementById("zoom-checkbox")
                        .checked != false) {
                        document.getElementById("zoom-checkbox")
                            .click()
                    }
                }

                dataContainer.selectAll("custom.line")
                    .filter(d => d.clean_name != "marcykaptur")
                    .transition()
                    .duration(1000)
                    .attr("x2", (d) => x(d.term_start))
                    .transition()
                    .duration(1000)
                    .attr("y1", () => y(0))
                    .attr("y2", () => y(0))
            }
            // Unhighlight Roosevelt's term
            electionRects.filter((d, i) => i == 4)
                .classed("hover", false)
                .style("opacity", 0.35)

            // Draw lines for longest serving woman
            dataContainer.selectAll("custom.line")
                .filter(d => d.clean_name == "marcykaptur")
                .transition()
                .duration(1000)
                .attr("y1", (d) => y(d.stream))
                .attr("y2", (d) => y(d.stream))
                .transition()
                .duration(1000)
                .attr("x2", (d) => x(d.term_end) - lineThickness * 1.2)
                .on("end", () => {
                    // Display tooltip
                    show_mp_tooltip(mps_over_time_data.filter(d => d.clean_name == "marcykaptur")[0])
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
                    if (elapsed > 3500) {
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
                .style("display", "inline-block")
                .on("mouseover", () => {
                    d3.select("#tooltip")
                        .style("opacity", 0)
                    mouseover_svg.selectAll(".annotation-group").remove()
                })
                .select("#zoom-checkbox")
                .on("change", function () {
                    if (this.checked) {
                        zoom.on("zoom", zoomed)
                        canvas.call(zoom)
                        d3.select(".is-active")
                            .style("opacity", 0)
                            .style("pointer-events", "none")
                        d3.select(".switch").select("label").text("STOP")
                    } else {
                        reset_zoom()
                        d3.select(".is-active")
                            .filter(function () {
                                // If it is an empty div, don't show
                                return this.innerText != ""
                            })
                            .style("opacity", 1)
                            .style("pointer-events", "all")
                    }

                })
            break

        case 1:
            // First step: first woman rep - Jeannette Rankin
            d3.select(".switch")
                .style("opacity", 0)
                .style("display", "none")
            if (document.getElementById("zoom-checkbox")
                .checked != false) {
                document.getElementById("zoom-checkbox")
                    .click()
                // If we have to zoom out first, wait a bit before executing next bit
                d3.timeout(() => {
                    all_mps_draw_timer.stop()
                    mpZoom("jeannetterankin")
                }, 1000)
                var zooming = true
            } else {
                // First step: zoom into first mp
                all_mps_draw_timer.stop()
                mpZoom("jeannetterankin")
            }

            // Annotate Jeannette
            annotate_timer = d3.timeout(() => {
                var line_pos = mouseover_svg.select("line").node().getBoundingClientRect()

                makeAnnotations = d3.annotation()
                    .type(d3.annotationCallout)
                    .annotations([{
                        note: {
                            title: "Jeannette Rankin"
                        },
                        //can use x, y directly instead of data
                        x: line_pos.x + line_pos.width/2,
                        y: line_pos.y + line_pos.height/2,
                        dx: isMobile ? 30 : 100,
                        dy: 100
                    }])
                mouseover_svg
                    .append("g")
                    .attr("class", "mp-annotation-group")
                    .call(makeAnnotations)
            }, zooming ? 2000 : 1000)


            canvas.style("pointer-events", "none")
            break

        case 2:
            // Second step: first minority woman representative
            mpZoom("patsymink")
            annotate_timer.stop()
            // Annotate Patsy
            annotate_timer = d3.timeout(() => {
                var line_pos = mouseover_svg.select("line").node().getBoundingClientRect()

                makeAnnotations = d3.annotation()
                    .type(d3.annotationCallout)
                    .annotations([{
                        note: {
                            title: "Patsy Mink"
                        },
                        //can use x, y directly instead of data
                        x: line_pos.x + line_pos.width/2,
                        y: line_pos.y + line_pos.height/2,
                        dx: isMobile ? 30 : 100,
                        dy: 200
                    }])
                mouseover_svg
                    .append("g")
                    .attr("class", "mp-annotation-group")
                    .call(makeAnnotations)
            }, 1000)


            canvas.style("pointer-events", "none")
            break
        case 3:
            // Third step: first african-american woman representative
            mpZoom("shirleychisholm")
            annotate_timer.stop()
            annotate_timer = d3.timeout(() => {
                var line_pos = mouseover_svg.select("line").node().getBoundingClientRect()

                makeAnnotations = d3.annotation()
                    .type(d3.annotationCallout)
                    .annotations([{
                        note: {
                            title: "Shirley Chisholm"
                        },
                        //can use x, y directly instead of data
                        x: line_pos.x + line_pos.width/2,
                        y: line_pos.y + line_pos.height/2,
                        dx: isMobile ? 30 : 100,
                        dy: 200
                    }])
                mouseover_svg
                    .append("g")
                    .attr("class", "mp-annotation-group")
                    .call(makeAnnotations)
            }, 1000)


            canvas.style("pointer-events", "none")
            break

        case 5:
            annotate_timer.stop()
            canvas.style("pointer-events", "all")
            d3.select(".switch")
                .style("opacity", 1)
                .style("display", "inline-block")

            mouseover_svg.transition()
                .duration(1000)
                .call(zoom.transform, d3.zoomIdentity)
                .on("end", () => {
                    d3.selectAll(".y-axis .tick")
                        .style("opacity", d => d >= 0 ? 1 : 0)

                    // // Unhighlight election term
                    // electionRects.filter((d, i) => i == 22)
                    //     .classed("hover", false)
                    // // Set default mp_filter
                    // mp_filter = mps_over_time_data.map(mp => mp.clean_name)
                    // // Unfade all MPs
                    // dataContainer.selectAll("custom.line")
                    //     .transition()
                    //     .attr("strokeStyle", d => colorParty(d.party))

                    var t = d3.timer((elapsed) => {
                        draw(context, false)
                        if (elapsed > 500) {
                            t.stop()
                            draw(context)
                        }
                    })
                })

            break


        }
        break

    case 1:
        // Second slide
        d3.select(".switch")
            .style("opacity", 0)
            .style("display", "none")
        if (document.getElementById("zoom-checkbox") != null) {
            if (document.getElementById("zoom-checkbox")
                .checked != false) {
                document.getElementById("zoom-checkbox")
                    .click()
            }
        }
        switch (new_step) {
        // Change graph to show breakdown by party
        case 0:
            if (response.direction == "up") {
                yLabel
                    .transition()
                    .text("Number of Representatives")
                chartTitle
                    .transition()
                    .text("Representatives in Congress")

                slide2Group.select(".party-label").transition().text("")
                // All MPs first
                y.domain([0, 450])
                yAxis = d3.axisRight(y)
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

                half_max_mps_line_smooth.y(d => y(d.total_mps / 2))
                text_path_50_50
                    .transition()
                    .attr("d", half_max_mps_line_smooth)

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
            // Democrats
            yLabel
                .transition()
                .text("% of Representatives")

            chartTitle
                .transition()
                .text("Representatives in the Democratic Party")

            slide2Group.select(".party-label").transition().text("Democrats")

            y.domain([0, 100])
            yAxis = d3.axisRight(y)
                .tickFormat(d => d)
            gY.transition()
                .call(yAxis)

            max_mps_line.y(y(100))
            max_mps_path.transition()
                .attr("d", max_mps_line)
            max_mps_area.y1(y(100))
            max_mps_path_area.transition()
                .attr("d", max_mps_area)
                .style("fill", colors["Democratic"])
                .style("opacity", 1)
            mask.transition()
                .attr("d", max_mps_area)

            half_max_mps_line.y(y(50))
            half_max_mps_path.transition()
                .attr("d", half_max_mps_line)

            half_max_mps_line_smooth.y(y(50))
            text_path_50_50
                .transition()
                .attr("d", half_max_mps_line_smooth)

            total_women_mps_line.y(d => y(d.democrat_women_pct))
            total_women_mps_path.transition()
                .attr("d", total_women_mps_line)
            total_women_mps_area.y1(d => y(d.democrat_women_pct))
            total_women_mps_path_area.transition()
                .attr("d", total_women_mps_area)

            d3.select(".women-label")
                .style("fill", colors["Democratic"])
            break
        case 2:
            // Republicans
            yLabel
                .transition()
                .text("% of Representatives")

            chartTitle
                .transition()
                .text("Representatives in the Republican Party")

            slide2Group.select(".party-label").transition().text("Republicans")

            y.domain([0, 100])
            yAxis = d3.axisRight(y)
                .tickFormat(d => d)
            gY.transition()
                .call(yAxis)

            max_mps_line.y(y(100))
            max_mps_path.transition()
                .attr("d", max_mps_line)
            max_mps_area.y1(y(100))
            max_mps_path_area.transition()
                .attr("d", max_mps_area)
                .style("fill", colors["Republican"])
                .style("opacity", 1)
            mask.transition()
                .attr("d", max_mps_area)

            half_max_mps_line.y(y(50))
            half_max_mps_path.transition()
                .attr("d", half_max_mps_line)

            half_max_mps_line_smooth.y(y(50))
            text_path_50_50
                .transition()
                .attr("d", half_max_mps_line_smooth)

            total_women_mps_line.y(d => y(d.republican_women_pct))
            total_women_mps_path.transition()
                .attr("d", total_women_mps_line)
            total_women_mps_area.y1(d => y(d.republican_women_pct))
            total_women_mps_path_area.transition()
                .attr("d", total_women_mps_area)

            d3.select(".women-label")
                .style("fill", colors["Republican"])
            break
        case 4:
            // All Representatives
            yLabel
                .transition()
                .text("% of Representatives")

            chartTitle
                .transition()
                .text("Representatives in Congress")

            slide2Group.select(".party-label").transition().text("")

            y.domain([0, 100])
            yAxis = d3.axisRight(y)
                .tickFormat(d => d)
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

            half_max_mps_line_smooth.y(y(50))
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
        // Fourth slide (no data, just text)
        d3.select("#slide4")
            .style("display", "none")
        d3.select(".switch")
            .style("opacity", 0)
            .style("display", "none")
        if (document.getElementById("zoom-checkbox") != null) {
            if (document.getElementById("zoom-checkbox")
                .checked != false) {
                document.getElementById("zoom-checkbox")
                    .click()
            }
        }
        chartTitle
            .transition()
            .text("")
        break

    case 4:
        // Fifth slide
        d3.select("#slide4")
            .style("display", "none")

        // Stop previous annotation timer
        annotate_timer.stop()

        switch (new_step) {
        case 0:
            update_fifth_slide(false, "energy policy", true, false)
            chartTitle
                .transition()
                .text("Time spent on energy policy")

            break
        case 1:
            update_fifth_slide(false, "energy policy", true, true)
            chartTitle
                .transition()
                .text("Time spent on energy policy")


            break
        case 2:
            update_fifth_slide(false, "healthcare", true, true)
            chartTitle
                .transition()
                .text("Time spent on healthcare")
            break
        case 3:
            update_fifth_slide(false, "government budget", true, true)
            chartTitle
                .transition()
                .text("Time spent on government budget")
            break
        }
        d3.select(".slide5-dropdown")
            .style("display", "none")
        // d3.select(".slide5-search")
        //     .style("display", "none")
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



    // These are the margins for the SVG
    margin = {
        top: 50,
        left: 25,
        bottom: 30,
        right: (timeline.clientWidth < 500 ? 50 : 70)
    }
    var new_width = timeline.clientWidth - margin.left - margin.right,
        new_height = (timeline.clientHeight - margin.top - margin.bottom)

    if (new_width != width | new_height != height) {
        width = new_width
        height = new_height


        // If width less than 500, we have a mobile (very abitrary)
        isMobile = width < 500

        // SET THE THICKNESS OF EACH LINE BASED ON THE CHART HEIGHT
        lineThickness = 0.003 * height * 2
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
