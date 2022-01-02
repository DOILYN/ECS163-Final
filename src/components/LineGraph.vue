<!-- Your HTML goes here -->
<template>
  <div id = "lineGraphParent">
    <div id = "lineLoadingScreen" class = "loadingScreen hidden"><p>Fetching Data...</p></div>
    <h1>{{this.title}}</h1>
    <svg id="datavis" :class="`line-svg`" :viewBox="viewBox">

        <!-- Chart and Axes -->
        <g :transform="`translate(${margin.left}, ${margin.top / 3})`">
            <path class='line-chart1'></path>
            <path class='line-chart2'></path>
            <path class='line-chart3'></path>
            <path class='line-chart4'></path>
            <path class='line-chart5'></path>
            <g class="plot"></g>
            <g class="x-axis" :transform="`translate(0, ${height})`"></g>
            <g class="y-axis"></g>
        </g>

        <!-- Axis Labels -->
        <g :transform="`translate(${margin.left + (width/2.5)}, ${margin.top + margin.bottom/10 + height * .9})`">
            <text>{{this.labelX}}</text>
        </g>
        <g :transform="`translate(${margin.left/4}, ${margin.top + (height/2.8)}) rotate(-90)`">
            <text>{{this.labelY}}</text>
        </g>
    </svg>
    <div id = "buttonsParent"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
//import mixin from '../mixins';
export default {
  name: "LineChart",
  props: {
    chartId: {
        required: true,
        type: String
    },
    categories: {
      required: true,
      type: Array
    },
    title: {
      type: String
    },
    axisData: {
      required: true,
      type: Array
    },
    dataset: {
      required: true,
      type: Array,
    },
    dataset1: {
      required: true,
      type: Array,
    },
    dataset2: {
      required: false,
      type: Array,
    },
    dataset3: {
      required: false,
      type: Array,
    },
    dataset4: {
      required: false,
      type: Array,
    },
    dataset5: {
      required: false,
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
    attribColor: {
      required: false,
      type: String,
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
      xA: null,
      y: null,
      x1: null,
      y1: null,
      color: null,
      margin: {
          left: 75,
          top: 150,
          right: 20,
          bottom: 150,
      }
    };
  },
  mounted() {
    this.init();
  },
  watch: {

    dataset1() {
      this.update()
    },
    dataset2() {
      this.update()
    },
    dataset3() {
      this.update()
    },
    dataset4() {
      this.update()
    },
    dataset5() {
      this.update()
    },
    title(){
      this.update()
    }
  },
  methods: {
    init() {
      this.x = d3.scaleTime();
      this.y = d3.scaleLinear();
      this.x1 = d3.scaleLinear().domain(d3.extent(this.dataset, d => d[this.attribX])).range([0, this.width]);
      this.y1 = d3.scaleLinear().domain(d3.extent(this.dataset, d => d[this.attribY])).range([this.height, 0]);
      this.xA = d3.scaleBand();
      this.color = d3.scaleOrdinal();
      this.update();
    },
    update() {

      this.x.domain(d3.extent(this.dataset, d => d[this.attribX])).range([0, this.width])
      this.xA
        .domain(d3.map(this.axisData, (d) => d.month))
        .range([0, this.width])
        .padding(0.2);
      this.y.domain(d3.extent(this.dataset, d => d[this.attribY])).range([this.height, 0])
      this.x1.domain(d3.extent(this.dataset, d => d[this.attribX])).range([0, this.width])
      this.y1.domain(d3.extent(this.dataset, d => d[this.attribY])).range([this.height, 0])
      this.color.domain(this.dataset, d => d[this.attribColor]).range(d3.schemeTableau10)
      this.renderLine();
      this.renderScatter();
      this.renderXAxis();
      this.renderYAxis();
      this.renderLegend();
      this.categoryButtons();
      d3.select("#buttonsParent")
      .selectAll("span")
      .on("click", event => {
        let obj = event.srcElement.id;
        console.log(obj);
        this.categorySelected(obj);
        this.loadingScreenTest();
      });
    },
    categoryButtons(){
      document.getElementById("buttonsParent").innerHTML = "";
      for(var i = 0; i < 5; i++){
        //console.log("Buttons: ", name);
        let weblink = this.categories[i].weblink;
        let splitVal = weblink.split('#');

        if (splitVal[1] != undefined) {
          let name = this.categories[i].name;
          let newButton = document.createElement('span');
          let category = splitVal[1].toString();
          newButton.setAttribute("id", category);
          newButton.setAttribute("class", "categoryButton");
          //newButton.setAttribute("cat", category);
          //newButton.setAttribute('onclick', "this.categorySelected(${event.srcElement.id})");
          //newButton.setAttribute('onclick', "console.log(event)");
          newButton.innerHTML = name;
          document.getElementById("buttonsParent").appendChild(newButton);
        }
      } 
    },
    renderLine() {
        let line = d3.line()
                .x(d => this.x1(d[this.attribX]))
                .y(d => this.y1(d[this.attribY]))

            d3.select('.line-chart1')
            .attr('d', line(this.dataset1))

            d3.select('.line-chart2')
            .attr('d', line(this.dataset2))

            d3.select('.line-chart3')
            .attr('d', line(this.dataset3))
            
            d3.select('.line-chart4')
            .attr('d', line(this.dataset4))
            
            d3.select('.line-chart5')
            .attr('d', line(this.dataset5))
    },
    renderLegend() {
      var svg = d3.select("#datavis")

      // Handmade legend
      svg.append("circle").attr("cx",800).attr("cy",5).attr("r", 4).style("fill", "#dac511")
      svg.append("circle").attr("cx",800).attr("cy",15).attr("r",4).style("fill", "#b7bfc9")
      svg.append("circle").attr("cx",800).attr("cy",25).attr("r", 4).style("fill", "#a0694f")
      svg.append("circle").attr("cx",800).attr("cy",35).attr("r", 4).style("fill", "#3d8aee")
      svg.append("circle").attr("cx",800).attr("cy",45).attr("r", 4).style("fill", "#000000")

      svg.append("text").attr("x", 820).attr("y", 10).text("1st Place").style("font-size", "10px").attr("alignment-baseline","right")
      svg.append("text").attr("x", 820).attr("y", 20).text("2nd Place").style("font-size", "10px").attr("alignment-baseline","right")
      svg.append("text").attr("x", 820).attr("y", 30).text("3rd Place").style("font-size", "10px").attr("alignment-baseline","right")
      svg.append("text").attr("x", 820).attr("y", 40).text("4th Place").style("font-size", "10px").attr("alignment-baseline","right")
      svg.append("text").attr("x", 820).attr("y", 50).text("5th Place").style("font-size", "10px").attr("alignment-baseline","right")

      svg.append("text").attr("x", 796).attr("y", 60).text("Node Color:").style("font-size", "10px").attr("alignment-baseline","right")
      svg.append("text").attr("x", 796).attr("y", 70).text("Different Runs").style("font-size", "10px").attr("alignment-baseline","right")
      
    },
    renderScatter() {
      // Plot points

      d3.select(`.line-svg`)
        .select(".plot")
        .selectAll("circle")
        .data(this.dataset)
        .join("circle")
        .transition()
        .duration(200)
        .attr("cx", (d) => this.x(d[this.attribX]))
        .attr("cy", (d) => this.y(d[this.attribY]))
        .attr("fill", (d) => this.color(d[this.attribColor]))
    
      // Add mouse events
      d3.select(`.line-svg`)
        .select(".plot")
        .selectAll("circle")
        .on('click', (event, d) => {
            this.itemSelected(d)
        })
        .on('mouseover', (event, d) => {
            this.itemSelected(d)
        })
        /*
        .on('mouseover', function() {
            d3.select(this).attr('class', 'hover')
   
        })
        .on('mouseout', function() {
            d3.select(this).attr('class', null)

        })
        */
        .on('mouseout', (event, d) => {
            this.itemSelected(0)
            console.log(d)
        })
        
        .append("title")
        .html(d => {
            return(
              "User:\n<span id = 'userField'>"
              + d.username + "</span>"
              
              +"\n\nDate Run Placed:\n"
              + d3.timeFormat("%x")(d.date)

              +"\n\nTime of Run:\n"
              + this.formatTime(d.time)// + " seconds"

              +"\n\nRegion:\n"
              + d.nationality
          )
        })
    },
    renderXAxis() {
        let xAxis = d3.axisBottom(this.x)
        d3.select(`.line-svg`)
          .select('.x-axis')
          .call(xAxis)
          .append("Month")
    },
    renderYAxis() {
        //let timeF = d3.timeFormat("%H:%M.%S")
        let yAxis = d3.axisLeft(this.y)
        .ticks(this.height / 39)
        .tickSizeOuter(0)
        .tickFormat(d => this.formatTime(d))
        d3.select(`.line-svg`)
          .select('.y-axis')
          .call(yAxis)
    },
    itemSelected(d) {
        if(d != 0){
          //console.log(`Selected:`)
          //console.log(d.user)
          this.$emit('item-selected', d)
        }else{
          this.$emit('item-selected', d)
        }
    },
    categorySelected(c) {
      this.$emit('category-selected', c);
    }
  },
  computed: {

    viewBox() {
      return `0 0 ${this.width+this.margin.left+this.margin.right} ${this.height+this.margin.top-20}`
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#lineGraphParent {
  position: relative;
}

#buttonsParent {
  transform: translate(0, 10px);
}

.categoryButton {
  z-index: 90;
  cursor: pointer;
  margin: 5px;
  padding: 5px;
  background: rgb(174, 253, 167);
  border: solid 2px #333;
  border-radius: 25px;
}

.categoryButton:hover {
  background: #333;
  color: #eee;
  border: solid 2px #ffa;
}

.plot rect {
    fill-opacity: 0.5;
}
.plot rect.hover {
    fill-opacity: 1;
    stroke: black;
}
.plot circle {
    fill-opacity: 0.75;
    r: 5;
}
.plot circle.hover {
    fill-opacity: 1;
    r: 7.5;
    stroke: black;
}

.line-svg {
    padding: 5px;
    background-color: #f0f0f0;
}

.line-svg .line-chart1 {
    stroke: #dac511;
    fill: none
}

.line-svg .line-chart2 {
    stroke: #b7bfc9;
    fill: none
}

.line-svg .line-chart3 {
    stroke: #a0694f;
    fill: none
}

.line-svg .line-chart4 {
    stroke: #3d8aee;
    fill: none
}

.line-svg .line-chart5 {
    stroke: #000000;
    fill: none
}
</style>