"use strict";

System.register(["./bower_components/d3/d3.js"], function (_export, _context) {
    "use strict";

    function heatmap(data, num_of_slices, elem, svg_id, elem_size, date_domain, bin_domain, frq_domain, all_buckets, number_of_legend) {

        function my_log(x) {
            return Math.log(x);
        }

        function my_exp(x) {
            return Math.exp(x);
        }

        var legend_color = "red";

        var margin = { top: 20, right: 90, bottom: 50, left: 90 };
        var width = elem_size.width - margin.left - margin.right;
        var height = elem_size.height - margin.top - margin.bottom;

        var xStep_ms = Math.ceil((date_domain.max - date_domain.min) / num_of_slices);
        var yStep = 1;

        var vertical_domain_length = bin_domain.max - bin_domain.min;
        var rect_size = Math.min(width / num_of_slices, height / vertical_domain_length);

        // Extend the x- to fit the last bucket
        date_domain.max = new Date(date_domain.max.getTime() + xStep_ms);

        width = rect_size * num_of_slices;
        height = rect_size * vertical_domain_length;

        var svg = d3.select("svg#" + svg_id).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //Move the origin of drawing


        // In getting log we added 1 to each frequency so we never encounter Log(0) situation
        var x_scale = d3.time.scale().range([0, width]).domain([date_domain.min, date_domain.max]);
        var y_scale = d3.scale.linear().range([height, 0]).domain([bin_domain.min, bin_domain.max]);
        var z_scale = d3.scale.linear().range(['white', 'darkred']).domain([my_log(frq_domain.min + 1), my_log(frq_domain.max + 1)]);

        // Define the div for the tooltip
        var tooltip_div = d3.select("body").append("div").attr("class", "tooltip").style("background-color", "black").style("opacity", 0);

        // Draw heat map tiles
        // x and y indicates upper left of the rect, hence the "+ yStep" in 'y' is needed to prevent first row from going out of the div.
        svg.selectAll(".tile").data(data).enter().append("rect").attr('x', function (d) {
            return x_scale(d.date);
        }).attr('y', function (d) {
            return y_scale(d.bin + yStep);
        }).attr("height", rect_size).attr("width", rect_size).style("fill", function (d) {
            return z_scale(my_log(d.value + 1));
        }).on("mouseover", function (d) {
            tooltip_div.transition().style("opacity", 1);
            tooltip_div.html("</span> date: " + d.date + "<br/> bin: " + all_buckets[d.bin] + "<br/> value: " + d.value + "</span>").style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 75 + "px");
        });

        // Add a call back function to hide tooltip_div when mouse goes out of our svg.
        svg.on("mouseout", function () {
            return tooltip_div.style("opacity", 0);
        });

        // Add X Axis
        var xAxisFunc = d3.svg.axis().scale(x_scale).orient("bottom");
        var xAxis = svg.append("g").attr("transform", "translate(0," + height + ")").call(xAxisFunc).attr("fill", legend_color);
        xAxis.append("text").attr("x", width / 2).attr("y", 40).attr("text-anchor", "end").text("Date");

        // Add Y Axis
        var yAxisFunc = d3.svg.axis().scale(y_scale).orient("left").tickFormat(function (t) {
            return all_buckets[t];
        });
        var yAxis = svg.append("g").call(yAxisFunc).attr("fill", legend_color);
        yAxis.append("text").attr("x", -height / 2).attr("y", -60).attr("dy", ".71em").attr("transform", "rotate(-90)").text("Duration");

        // Add a legend for the color values.
        var legend = svg.selectAll(".legend").data(z_scale.ticks(number_of_legend).reverse()).enter().append("g").attr("class", "legend").attr("transform", function (d, i) {
            return "translate(" + (width + rect_size) + "," + (rect_size + i * rect_size) + ")";
        });

        legend.append("rect").attr("width", rect_size).attr("height", rect_size).style("fill", z_scale);

        legend.append("text").attr("x", rect_size + 6).attr("y", 10).attr("dy", ".35em").attr("fill", legend_color).text(function (d) {
            return String(Math.floor(my_exp(d) - 1));
        });

        svg.append("text").attr("class", "label").attr("x", width + rect_size).attr("y", 5).attr("dy", ".35em").attr("fill", legend_color).text("Count");
    }

    _export("default", heatmap);

    return {
        setters: [function (_bower_componentsD3D3Js) {}],
        execute: function () {}
    };
});
//# sourceMappingURL=heatmap.js.map
