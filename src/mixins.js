//Put helper functions in this document. Call them in components by using 'this' keyword
//example myFunc(args);  in a component: this.myFunc(args);
import Vue from 'vue'
//import * as d3 from 'd3'
import api from './api'

Vue.mixin({
methods: {
  loadingScreenTest() {
    console.log("Testing Loading Screen")
    let target = document.getElementById("loadingScreen");
    //console.log(target);
    target.classList.remove("hidden");
    setTimeout(function(){
      //console.log(target);
      target.classList.add("hidden");
    }, 2000);
  },
  formatTime(seconds) {
    console.log("Seconds " + seconds);
    var h = Math.trunc(seconds/3600)
    var m = Math.trunc((seconds % 3600)/60)
    if(m < 10){
      var min = m.toString()
      m = "0" + min
    }
    var s = Math.trunc(seconds % 60)
    if(s < 10){
      var sec = s.toString()
      s = "0" + sec
    }
    h = h.toString()
    m = m.toString()
    s = s.toString()
    return (h + ":" + m + ":" + s)
  },
  mixinDateFormat(input){
    console.log(input);

  },
  mixinIDToName(input) {
    //let retval = 0;
    api.getUserInfo(input)
    .then(d => {return d});
  }

}
});