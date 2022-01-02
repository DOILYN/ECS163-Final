<!-- Your HTML goes here -->
<template>
  <div>
    <h1>{{ this.title }}</h1>
    <svg :class="`barchart-svg-${chartId} bar-chart-svg` " :viewBox="viewBox">
      <!-- Chart and Axes -->
      <g :transform="`translate(${margin.left}, ${margin.top})`">
        <g class="plot"></g>
        <g class="x-axis" :transform="`translate(0, ${height})`"></g>
        <g class="y-axis"></g>
      </g>

      <!-- Axis Labels -->
      <g :transform="`translate(${margin.left + width / 2.2}, ${margin.top + margin.bottom + height})`">
        <text>{{ labelX }}</text>
      </g>
      <g :transform="`translate(${margin.left / 4}, ${margin.top + height / 2}) rotate(-90)`">
        <text>{{ labelY }}</text>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "BarGraph",
  props: {
    chartId: {
      required: true,
      type: String,
    },
    title: {
      type: String,
    },
    dataset: {
      required: true,
      type: Array,
    },
    attribX: {
      required: true,
      type: String,
    },
    labelX: {
        type: String
    },
    attribY: {
      required: true,
      type: String,
    },
    labelY: {
        type: String
    },
    height: {
      required: true,
      type: Number,
    },
    width: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      x: null,
      y: null,
      margin: {
        left: 75,
        top: 30,
        right: 20,
        bottom: 30,
      }
    };
  },
  watch: {
    dataset() {
      this.loadingScreenTest();
      this.update();
    },
    title () {
      this.update()
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.x = d3.scaleBand();
      this.y = d3.scaleLinear();
      this.update();
    },
    update() {
      this.x
        .domain(d3.map(this.dataset, (d) => d[this.attribX]))
        .range([0, this.width])
        .padding(0.2);
      this.y
        .domain([0, d3.max(this.dataset, (d) => d[this.attribY])])
        .nice()
        .range([this.height, 0]);
      //console.log(this.dataset)
      //console.log(this.attribY);
      //console.log(d3.max(this.dataset, (d) => d[this.attribY]));
      this.renderBars();
      this.renderXAxis();
      this.renderYAxis();
    },
    renderBars() {
      d3.select(`.barchart-svg-${this.chartId}`)
        .select(".plot")
        .selectAll("rect")
        .data(this.dataset)
        .join("rect")
        .transition()
        .duration(200)
        .attr("x", (d) => this.x(d[this.attribX]))
        .attr("y", (d) => this.y(d[this.attribY]))
        .attr("width", this.x.bandwidth())
        .attr("height", (d) => this.y(0) - this.y(d[this.attribY]));

        d3.select(`.barchart-svg-${this.chartId}`)
        .select(".plot")
        .selectAll("rect")
        .on('mouseover', function() {
            d3.select(this).attr('class', 'hover')
        })
        .on('mouseout', function() {
            d3.select(this).attr('class', null)
        })
        .append("title")
        .html(d => {
            return(
              "Amount of Submissions: " + d[this.attribY]
          )
        })
    },
    renderXAxis() {
      let xAxis = d3.axisBottom(this.x);
      d3.select(`.barchart-svg-${this.chartId}`).select(".x-axis").call(xAxis);
    },
    renderYAxis() {
      let yAxis = d3.axisLeft(this.y)
      .ticks(this.height * 0.005)
      .tickFormat(d3.format("d")
      );
      d3.select(`.barchart-svg-${this.chartId}`).select(".y-axis").call(yAxis);
    },
  },
  computed: {
    viewBox() {
      return `0 0 ${this.width + this.margin.left + this.margin.right} ${
        this.height + this.margin.top + this.margin.bottom
      }`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.bar-chart-svg {
  background-color: #f0f0f0;
}
.plot rect {
    fill: #eeb27b;
    fill-opacity: 0.5;
}
.plot rect.hover {
    fill-opacity: 1;
    fill: #eeb27b;
    stroke: black;
}

</style>