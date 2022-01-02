//Configure API calls in this document
//Try to keep the methods in this document strictly related to retrieving data. Use mixins.js or App.vue to filter the data with D3
import Vue from 'vue'
import * as d3 from 'd3'

Vue.mixin({
  methods: {
    async fTest() {

      console.log("Fetch Test " + d3);

      var data1 = fetch('https://www.speedrun.com/api/v1/leaderboards/tenchu_fs/category/Any')
      .then(response => response.json())
      .then(data => {
        return data.data
      });

      var retVal = await data1
      return retVal
    }
  }
});