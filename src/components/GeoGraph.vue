<template>
<div class="control-section">
 <div id="chart"></div>
<ejs-maps id='container' ref="maps" align="center" :load='load' :itemSelection='itemSelection' :titleSettings='titleSettings' :zoomSettings='zoomSettings' :legendSettings='legendSettings'>
    <e-layers id = "shapeObj">
        <e-layer :shapeData='shapeData' :shapePropertyPath='shapePropertyPath' :shapeDataPath='shapeDataPath' :dataSource='dataSource' :shapeSettings='shapeSettings' :tooltipSettings='tooltipSettings' :highlightSettings='highlightSettings' :selectionSettings='selectionSettings'></e-layer>
    </e-layers>
</ejs-maps>    
 </div>
</template>

<script>
import Vue from 'vue';
import {  MapsPlugin, Legend, MapsTooltip, Highlight, } from '@syncfusion/ej2-vue-maps';
import world_map from '../world-map.json';
//import { isNullOrUndefined } from '@syncfusion/ej2-base';
//import legendDatasource from '../legend-datasource.json';
//import { population_density } from './population-density.js';
Vue.use(MapsPlugin);
export default {
    name: "GeoGraph",
    props: {
        dataset: {
            required: true,
            type: Array,
            handler: 'update'
        },
    },
    data() {
        
        return{
            titleSettings: {
                text: 'Speedrunning Frequency in 2020 by Country',
                textStyle: {
                    size: '16px'
                }
            },
            zoomSettings: {
                enable: true
            },
            legendSettings: {
            visible: true,
            position: 'Top'
            },
            legendModeData: ["Default", "Interactive"],
            positionData: ["Top", "Bottom", "Left", "Right"],
            labelswidth: 120,
            shapeData: world_map,
            shapeDataPath: 'name',
            shapePropertyPath: 'name',
            dataSource: null,
            shapeSettings: {
                colorValuePath: 'density',
                fill: '#E5E5E5',
                colorMapping: null
            },
            highlightSettings: {
                    enable: true,
                    fill: '#A3B0D0'
            },
              tooltipSettings: {
                    visible: true,
                    valuePath: 'name',
                    format: '${name} : ${density} active runners'
                },
            selectionSettings: {
                    enable: true,
                    fill: '#4C515B ',
                    opacity: 1
            },

        }
    },
    watch: {
        dataset : {
            deep: true,
            immediate: true,
            handler(){
                this.update()
            }
        },
    },
    mounted(){
        this.init()
    },
    provide: {
         maps: [MapsTooltip, Highlight, Legend]
    },
    methods: {
        // Code for Property Panel
        tooltipRender:function(args){
          if (!args.options.data) {
                args.cancel = true;
            }
        },
        init(){
            console.log("init")
        },
        update(){          
            //let maps = this.$refs.maps.ej2Instances;
                
            //console.log(maps);
            console.log("Data change")
            this.dataSource = this.dataset;
            this.shapeSettings = {
                colorValuePath: 'density',
                fill: '#E5E5E5',
                colorMapping: [
                    {
                        from: 1, to: 3, color: 'rgb(174,214,183)'
                    },
                    {
                        from: 3, to: 5, color: 'rgb(112,185,107)'
                    },
                    {
                        from: 5, to: 10, color: 'rgb(82,168,68)'
                    },
                    {
                        from: 10, to: 20, color: 'rgb(68,128,48)'
                    },
                    {
                        from: 20, to: 100, color: 'rgb(40,80,20)'
                    }
                ]
            };
        }
    }
}
</script>
<style type="text/css" scoped>
  .wrapper {
    max-width: 300px;
    margin: 0 auto;
  }
    #container{
    transform: translate(0, -15%);

}
 .tip {
     border: 1px solid #4D4D4D;
     box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
     border-radius: 7px;
     margin-right: 25px;
     min-width: 110px;
     padding-top: 9px;
     padding-right: 10px;
     padding-left: 10px;
     width: auto;
     height: auto;
     background: #4D4D4D;
 }  
</style>