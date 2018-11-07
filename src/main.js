import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import Cornerstone from "cornerstone-core"
import DicomParser from "dicom-parser"

//import {parseDICOM} from "./dicom-manager"
//parseDICOM()

Vue.use(BootstrapVue)

new Vue({
  el: '#app',
  render: h => h(App)
})

