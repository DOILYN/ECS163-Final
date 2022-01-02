<!-- This file will be used to layout and connect your views -->
<template>
  <div id="app">
      <div id = "loadingScreen" class = "hidden"><h1 id = "loadingScreenMessage">Fetching Data...</h1></div>
      <div id = "buttonsParentG" ></div>

      <LineGraph 
        v-if='datasetLines'
        chartId="LineGraph1"
        class='line-chart'
        :axisData='datasetSelected'
        :categories='categoryData'
        :dataset ='datasetLines'
        :dataset1='dataset1'
        :dataset2='dataset2'
        :dataset3='dataset3'
        :dataset4='dataset4'
        :dataset5='dataset5' 
        attribColor="user"
        attribX="date" 
        attribY="time" 
        labelX="Month of Submission"
        labelY="Time of run"
        :title='lineTitle'
        @item-selected="userSelectedPromIN"
        @category-selected="leaderboardCall"
        :height="500" 
        :width="800"/>
      
      <GeoGraph 
      key = geoKey
      class="geo-chart"
      :dataset="nationData"
      />
      
      <BarGraph
      class="bar-chart"
      v-if="datasetSelected"
      chartId="BarGraph1"
      :title='barTitle'
      :dataset="datasetSelected"
      attribX="month"
      attribY="amount"
      labelX="Month Recorded"
      labelY="Amount of Submissions"
      :width="800"
      :height="500"
    />
  
    
  </div>
</template>

<script>

import * as d3 from "d3";

// You are free to define more than three views!
// Try to use descriptive names like 'OverviewScatterPlot' or 'DetailLineChart'
import LineGraph from './components/LineGraph.vue';
import GeoGraph from './components/GeoGraph.vue';
import BarGraph from './components/BarGraph.vue';
import api from './api';
import legendData from './legend-datasource.json';

export default {
  name: 'App',
  components: {
    LineGraph,
    GeoGraph,
    BarGraph
  },
  data() {
    return {
      categoryData: null,
      allRuns: null,
      dataset: null,
      dataset1: null,
      dataset2: null,
      dataset3: null,
      dataset4: null,
      dataset5: null,
      datasetSelected: null,
      datasetLines : null,
      nationData: null,
      userData: null,
      game: null,
      cat: null,
      gameTitle: null,
      catTitle: null,
      lineTitle: null,
      barTitle: "Community's Submission Frequency for 2020",
      games: [{title: 'Super Mario 64', name: 'sm64', cat: '120_star'}, {title: 'Hollow Knight', name: 'hollowknight', cat: 'Any'}, {title: 'DOOM Eternal', name: 'doom_eternal', cat: 'Any'}, {title: 'Celeste', name: 'celeste', cat: 'Any'}, {title: 'Super Mario Odyssey', name: 'smo', cat: 'Any'}]
    }
  },
  created() {
      //this.mixinTimeFormat("Test");
      this.game = 'sm64'
      this.cat = '120_Star'

      this.leaderboardCall(this.cat)
      // Dont add code here.
      // ! Add other code for 'created()' to datasetInst() to avoid async issues !
  },
  mounted() {
    this.loadingScreenTest();
  },
  methods: {
     gameButtons(){
      document.getElementById("buttonsParentG").innerHTML = "";
      for(var i in this.games){
        console.log("Buttons: ", name);
        let name = this.games[i].name;
        let newButton = document.createElement('span');
          newButton.setAttribute("id", name);
          newButton.setAttribute("class", "gameButton");
          newButton.innerHTML = this.games[i].title;
          document.getElementById("buttonsParentG").appendChild(newButton);
      }
      d3.select("#buttonsParentG")
      .selectAll("span")
      .on("click", event => {
        let obj = event.srcElement.id;
        this.game = obj
        var category = d3.filter(this.games, d => d.name == obj)
        var catIn = category[0].cat
        this.leaderboardCall(catIn);
        this.loadingScreenTest();
      });
    },
    leaderboardCall(c){
      
      this.datasetLines= null // Not sure why this works, but it works
      this.dataset = null
      this.dataset1 = null
      this.dataset2 = null
      this.dataset3 = null
      this.dataset4 = null
      this.dataset5 = null
      this.datasetSelected = null
      this.cat = c

      api.getGameCategories(this.game)
      .then(d => {
        this.categoryData = d.data.data
      })
      .catch(e => {
          console.log(`Error fetching data: ${e.errorReason}`);
      })
      api.getGameLeaderboards(this.game, c)
      .then(d => {                                 
        this.datasetInst(d.data.data.runs)                       // Call external method once promise is resolved
        this.getLineTitle(d.data.data.game, d.data.data.category)
      })
      .catch(e => {
          console.log(`Error fetching data: ${e.errorReason}`);
      })
    },
    gameCall(){
      api.getGames()
      .then(d => {
        console.log(d.data.data)
      })
    },
    getLineTitle(g, c){
      api.getGame(g)
      .then(d => {
        this.gameTitle = d.data.data.names.international
        this.setLineTitle(this.gameTitle, this.catTitle)
      })
      api.getCategory(c)
      .then(d => {
        this.catTitle = d.data.data.name  
        this.setLineTitle(this.gameTitle, this.catTitle)
      })
    },

    setLineTitle(g, c){
      this.lineTitle = "Record Progression for " + c + " category of " + g + " in 2020" 
    },

    // This method will wait for promise to be resolved. It is a continuation of 'created()'.
    datasetInst(d){

      var parseDate = d3.timeParse("%Y-%m-%d");

      var data = d3.map(d, (data) => {
        return Object.assign(data, {
              
        year: parseInt(((data.run.date)[0] + (data.run.date)[1] + (data.run.date)[2] + (data.run.date)[3])),
        month: parseInt(((data.run.date)[5] + (data.run.date)[6])),
        day: parseInt((data.run.date[8]) + (data.run.date[9])),
        date: parseDate(data.run.date),
        place: parseInt(data.place),
        user: data.run.players[0].id,
        //username: this.mixinIDToUsername(data.run.players[0].id),
        time: parseInt(data.run.times.primary_t),
        })
      })

      let userData = []
      var nulls = 0
      for(var i in data){
          api.getUserInfo(data[i].user)
          .then(u => {
            var user = d3.filter(data, d => d.user == u.data.data.id)
            
            userData.push({year: user[0].year, month: user[0].month, day: user[0].day, date: user[0].date, place: user[0].place, 
                          username: u.data.data.names.international, user: user[0].user, time: user[0].time, nationality: u.data.data.location.country.names.international})
            if(userData.length == data.length - nulls){
                this.processUsers(userData)
            }
          })
          .catch(e => {
            console.log(`Error fetching data: ${e.errorReason}`);
            nulls++
            console.log(nulls)
              if(userData.length == data.length - nulls){
                this.processUsers(userData)
              }
          })
      }   
    },

    processUsers(users){
      //console.log("Users", users)
      this.allRuns = users
      this.dataset = users
      this.sortCountry(users)
      this.sortPlace()
      this.userSelected(0)
      this.gameCall()
      this.gameButtons()
    },

    sortCountry(d){
      console.log(d)
      for(var country in legendData){
        var amt = d3.filter(d, d => d.nationality == legendData[country].name)
        legendData[country].density = amt.length
      }
      this.nationData = legendData
      /* console.log(legendData)
      console.log(this.nationData) */
    },
// Disgusting mess of a method. I will clean it up in the future
    sortPlace(){

      let dataset1 = [{month: 0, time: 0, user: "", date: "", username: "", nationality: "", day: ""}] // Add data to these points as needed. Must also add them in the push calls below.
      let dataset2 = [{month: 0, time: 0, user: "", date: "", username: "", nationality: "", day: ""}]
      let dataset3 = [{month: 0, time: 0, user: "", date: "", username: "", nationality: "", day: ""}]
      let dataset4 = [{month: 0, time: 0, user: "", date: "", username: "", nationality: "", day: ""}]
      let dataset5 = [{month: 0, time: 0, user: "", date: "", username: "", nationality: "", day: ""}]
      
      var temp = d3.filter(this.dataset, d => d.year == 2020)
      this.dataset = d3.filter(temp, d => d.year == 2020)
      
      
      for (var i = 1; i <= 12; i++) {                                                                                                       // For each month

        let Runs1 = d3.filter(temp, d => d.month == i)

        for(var j = 1; j <= 31; j++){                                                                                                                 // Check for top five runs
          
          let Runs = d3.filter(Runs1, d => d.day == j)  

          for(var run in Runs){                      

            if(dataset1[dataset1.length - 1].time == 0){                                                                                      // Is there a first place run yet?     
              //                                                                                                                              // If not, make one
              dataset1.pop() 
              dataset1.push({month: i, time: Runs[run].time, user: Runs[run].user, date: Runs[run].date, username: Runs[run].username, nationality: Runs[run].nationality, day: j})

            }
            
            else if(Runs[run].time < dataset1[dataset1.length - 1].time){                                                                      // Otherwise, if it is better than the first place run
                //                                                                                                                             // Set it to first place, and bump other runs down a rank
                                                                                                                                                                                                                                                                      
                if(dataset5[dataset5.length - 1].time == 0){  // Was the previous fifth place run from the same month?
                  dataset5.pop()                                                                                                               // If so replace it with this new run for "fifth best run of the month"
                }  
                dataset5.push({month: i, time: dataset4[dataset4.length - 1].time, user: dataset4[dataset4.length - 1].user, 
                date: Runs[run].date, username: dataset4[dataset4.length - 1].username, nationality: dataset4[dataset4.length - 1].nationality, day: j})

                if( dataset4[dataset4.length - 1].time == 0){  // Reapeat for 1-4 -------------------
                  dataset4.pop()
                }
                dataset4.push({month: i, time: dataset3[dataset3.length - 1].time, user: dataset3[dataset3.length - 1].user, 
                date: Runs[run].date, username: dataset3[dataset3.length - 1].username, nationality: dataset3[dataset3.length - 1].nationality, day: j})          

                if(dataset3[dataset3.length - 1].time == 0){
                  dataset3.pop()
                }
                dataset3.push({month: i, time: dataset2[dataset2.length - 1].time, user: dataset2[dataset2.length - 1].user, 
                date: Runs[run].date, username: dataset2[dataset2.length - 1].username, nationality: dataset2[dataset2.length - 1].nationality, day: j})

                if(dataset2[dataset2.length - 1].time == 0){
                  dataset2.pop()
                }
                dataset2.push({month: i, time: dataset1[dataset1.length - 1].time, user: dataset1[dataset1.length - 1].user, 
                date: Runs[run].date, username: dataset1[dataset1.length - 1].username, nationality: dataset1[dataset1.length - 1].nationality, day: j})   

                if(dataset1[dataset1.length - 1].day == Runs[run].day){
                  dataset1.pop()
                }
                dataset1.push({month: i, time: Runs[run].time, user: Runs[run].user, 
                date: Runs[run].date, username: Runs[run].username, nationality: Runs[run].nationality, day: j})                                                           //--------------------------------------
            }
            
            else if(dataset2[dataset2.length - 1].time == 0){                                                                                   // Then repeat all that for 2-5---------------------------
              dataset2.pop() 
              dataset2.push({month: i, time: Runs[run].time, user: Runs[run].user, 
              date: Runs[run].date, username: Runs[run].username, nationality: Runs[run].nationality, day: j})
            }

            else if(Runs[run].time < dataset2[dataset2.length - 1].time){
               
                if(dataset5[dataset5.length - 1].time == 0){
                  dataset5.pop()
                }
                  dataset5.push({month: i, time: dataset4[dataset4.length - 1].time, user: dataset4[dataset4.length - 1].user, 
                  date: Runs[run].date, username: dataset4[dataset4.length - 1].username, nationality: dataset4[dataset4.length - 1].nationality, day: j})
                
                
                if(dataset4[dataset4.length - 1].time == 0){
                  dataset4.pop()
                }
                  dataset4.push({month: i, time: dataset3[dataset3.length - 1].time, user: dataset3[dataset3.length - 1].user, 
                  date: Runs[run].date, username: dataset3[dataset3.length - 1].username, nationality: dataset3[dataset3.length - 1].nationality, day: j})
                

                if(dataset3[dataset3.length - 1].time == 0){
                  dataset3.pop()
                }
                  dataset3.push({month: i, time: dataset2[dataset2.length - 1].time, user: dataset2[dataset2.length - 1].user, 
                  date: Runs[run].date, username: dataset2[dataset2.length - 1].username, nationality: dataset2[dataset2.length - 1].nationality, day: j})
                

                if(dataset2[dataset2.length - 1].day == Runs[run].day){
                  dataset2.pop()
                }
                  dataset2.push({month: i, time: Runs[run].time, user: Runs[run].user, 
                  date: Runs[run].date, username: Runs[run].username, nationality: Runs[run].nationality, day: j})

            }

            else if(dataset3[dataset3.length - 1].time == 0){
              dataset3.pop() 
              dataset3.push({month: i, time: Runs[run].time, user: Runs[run].user, 
              date: Runs[run].date, username: Runs[run].username, nationality: Runs[run].nationality, day: j})
            }

            else if(Runs[run].time < dataset3[dataset3.length - 1].time){
                
                if(dataset5[dataset5.length - 1].time == 0){
                  dataset5.pop()
                }
                  dataset5.push({month: i, time: dataset4[dataset4.length - 1].time, user: dataset4[dataset4.length - 1].user, 
                  date: Runs[run].date, username: dataset4[dataset4.length - 1].username, nationality: dataset4[dataset4.length - 1].nationality, day: j})
                
                
                if(dataset4[dataset4.length - 1].time == 0){
                  dataset4.pop()
                }
                  dataset4.push({month: i, time: dataset3[dataset3.length - 1].time, user: dataset3[dataset3.length - 1].user, 
                  date: Runs[run].date, username: dataset3[dataset3.length - 1].username, nationality: dataset3[dataset3.length - 1].nationality, day: j})
                

                if(dataset3[dataset3.length - 1].day == Runs[run].day){
                  dataset3.pop()
                }
                  dataset3.push({month: i, time: Runs[run].time, user: Runs[run].user, 
                  date: Runs[run].date, username: Runs[run].username, nationality: Runs[run].nationality, day: j})

            }

            else if(dataset4[dataset4.length - 1].time == 0){
              dataset4.pop() 
              dataset4.push({month: i, time: Runs[run].time, user: Runs[run].user, 
              date: Runs[run].date, username: Runs[run].username, nationality: Runs[run].nationality, day: j})
            }

            else if(Runs[run].time < dataset4[dataset4.length - 1].time){
                if(dataset5[dataset5.length - 1].time == 0){
                  dataset5.pop()
                }
                  dataset5.push({month: i, time: dataset4[dataset4.length - 1].time, user: dataset4[dataset4.length - 1].user, 
                  date: Runs[run].date, username: dataset4[dataset4.length - 1].username, nationality: dataset4[dataset4.length - 1].nationality, day: j})

                if(dataset4[dataset4.length - 1].day == Runs[run].day){
                  dataset4.pop()
                }
                  dataset4.push({month: i, time: Runs[run].time, user: Runs[run].user, date: Runs[run].date, username: Runs[run].username, nationality: Runs[run].nationality, day: j})
            }

            else if(dataset5[dataset5.length - 1].time == 0){
              dataset5.pop() 
              dataset5.push({month: i, time: Runs[run].time, user: Runs[run].user, date: Runs[run].date, username: Runs[run].username, nationality: Runs[run].nationality, day: j})
            }

            else if(Runs[run].time < dataset5[dataset5.length - 1].time){
                if(dataset5[dataset5.length - 1].day == Runs[run].day){
                  dataset5.pop()
                }
                  dataset5.push({month: i, time: Runs[run].time, user: Runs[run].user, date: Runs[run].date, username: Runs[run].username, nationality: Runs[run].nationality, day: j})
                
            }
          
          //--------------------------------------------------
          }
        }
        }
         

      dataset1.sort(d => {
        return d3.ascending(d.month)
      })
      dataset2.sort(function(d){
        return d3.ascending(d.month)
      })
      dataset3.sort(function(d){
        return d3.ascending(d.month)
      })
      dataset4.sort(function(d){
        return d3.ascending(d.month)
      })
      dataset5.sort(d => {
        return d3.ascending(d.month)
      })
      this.dataset1 = dataset1 
      this.dataset2 = dataset2 
      this.dataset3 = dataset3 
      this.dataset4 = dataset4 
      this.dataset5 = dataset5 

      this.datasetLines = []
      for(var nodes1 in dataset1){
        this.datasetLines.push(dataset1[nodes1])
      }
      for(var nodes2 in dataset2){
        this.datasetLines.push(dataset2[nodes2])
      }
      for(var nodes3 in dataset3){
        this.datasetLines.push(dataset3[nodes3])
      }
      for(var nodes4 in dataset4){
        this.datasetLines.push(dataset4[nodes4])
      }
      for(var nodes5 in dataset5){
        this.datasetLines.push(dataset5[nodes5])
      }
      
    },

    getBarTitle(r){
      if(r!=0){
      api.getUserInfo(r)
      .then(d => {
        //console.log(d.data.data.names.international)
        this.setBarTitle(d.data.data.names.international)
      })
      }else{
        this.setBarTitle("Community")
      }
    },
    setBarTitle(r){
      this.barTitle = r + "'s Submission Frequency for 2020"
    },

    userSelectedPromIN(r){
      if(r != 0){
        this.userSelectedProm(r.user)
        this.countrySelected(r.nationality)
      }else{
        this.userSelectedProm(0)
        this.countrySelected(0)
      }
    },

    countrySelected(c){
      if(c == 0){
        this.sortCountry(this.allRuns)
      }else{
        var selected = [{nationality: c},{nationality: c},{nationality: c},{nationality: c},{nationality: c},{nationality: c},{nationality: c},{nationality: c},{nationality: c},{nationality: c}]
        console.log(selected)
        this.sortCountry(selected)
      }
    },
    userSelectedProm(r){
      
      this.getBarTitle(r)
      api.getUserRuns(r)
      .then(d => {                                           // Call external method once promise is resolved
        this.userProcess(d.data.data)
      })
      .catch(e => {
          console.log(`Error fetching data: ${e.errorReason}`);
      })
    },

    userProcess(d){
      var dataIn = d3.map(d, (data) => {

          return Object.assign(data, {
        
          year: parseInt(((data.run.date)[0] + (data.run.date)[1] + (data.run.date)[2] + (data.run.date)[3])),
          month: parseInt(((data.run.date)[5] + (data.run.date)[6])),

          })
        })
        this.userSelected(dataIn)
    },
    userSelected(r) {
      
      var runner = [];

      if(r != 0 && r != null){                                            // If r is an actual input  
                                                                                        
        runner = d3.filter(r, d => d.year == 2020)           // Create new Data set of specified runner's runs
      
      }else{    
        
        runner = this.dataset                                             // Otherwise use all runs in category
      
      }
      
      /* --- Less optimal, but cleaner --- 

      // Here I simply create an array for the bar chart by filtering datapoints in 'runner' by month, and finding the length of that array 
      var Jan = d3.filter(runner, d => d.Month == "Jan").length
      var Feb = d3.filter(runner, d => d.Month == "Feb").length
      var Mar = d3.filter(runner, d => d.Month == "Mar").length
      var Apr = d3.filter(runner, d => d.Month == "Apr").length
      var May = d3.filter(runner, d => d.Month == "May").length
      var Jun = d3.filter(runner, d => d.Month == "Jun").length
      var Jul = d3.filter(runner, d => d.Month == "Jul").length
      var Aug = d3.filter(runner, d => d.Month == "Aug").length
      var Sept = d3.filter(runner, d => d.Month == "Sept").length
      var Oct = d3.filter(runner, d => d.Month == "Oct").length
      var Nov = d3.filter(runner, d => d.Month == "Nov").length
      var Dec = d3.filter(runner, d => d.Month == "Dec").length

      
      */

      let entries = [];

      // Here I create an array for the bar chart by summing up the amount of datapoints in 'runner' (not super clean, but it should work fine) 
      var Jan = 0;
      var Feb = 0;
      var Mar = 0;
      var Apr = 0;
      var May = 0;
      var Jun = 0;
      var Jul = 0;
      var Aug = 0;
      var Sept = 0;
      var Oct = 0;
      var Nov = 0;
      var Dec = 0;

      for (var run of runner) {
        switch (run.month) { 
          case 1:
            Jan++;
            break;
          case 2:
            Feb++;
            break;
          case 3:
            Mar++;
            break;
          case 4:
            Apr++;
            break;
          case 5:
            May++;
            break;
          case 6:
            Jun++;
            break;
          case 7:
            Jul++;
            break;
          case 8:
            Aug++;
            break;
          case 9:
            Sept++;
            break;
          case 10:
            Oct++;
            break;
          case 11:
            Nov++;
            break;
          case 12:
            Dec++;
            break;
          default:
            break;
        }
      }
      
      let vals = [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sept, Oct, Nov, Dec];
      
      var i = 0;

      for (const month of ['Jan','Feb','Mar','April','May','June','Jul','Aug','Sept','Oct','Nov','Dec']) {
        entries.push({
          month: month,
          amount: vals[i]
        })
        i++;
      }
      this.datasetSelected = entries
    }
  }
}
/*
function loadingScreenTest() {
    console.log("Testing Loading Screen")
    d3.select("loadingScreen").classed('hidden', false);
    setTimeout(function(){
      d3.select("loadingScreen").classed('hidden', true);
    }, 2000);
  }
*/
</script>

<style>
body {
  background: #ccc;
}

#loadingScreen {
  position: absolute;
  top: 8%;
  left: 59%;
  z-index: 99;
  margin: 0;
  padding: 0;
  width: 40%;
  height: 85%;
  color: #eee;
  background: rgba(30,30,30,.87);
}

#loadingScreenMessage {
  position: absolute;
  top: 40%;
  left: 40%;
}
.gameButton {
  cursor: pointer;
  margin: 5px;
  padding: 5px;
  background: rgb(174, 253, 167);
  border: solid 2px #333;
  border-radius: 25px;
}

.gameButton:hover {
  background: #333;
  color: #eee;
  border: solid 2px #ffa;
}
.hidden {
  display: none;
   /* display: block; */
}

.visible {
  display: block;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 200px; */
  display: grid;
  grid-template-rows: 8vh 60vh auto;
  grid-template-columns: 2fr 10fr 2fr 10fr;
  grid-template-areas:
    "btnG btnG . bar"
    "line line . ."
    "line line . geo"    
}

#buttonsParentG {
  grid-area: btnG;
  z-index: 10;
  transform: translate(0%, 50%);
  width: 1000px; 
}

.bar-chart {
  grid-area: bar;
}
.line-chart {
  grid-area: line;
}
.geo-chart {
  grid-area: geo;
}
</style>
