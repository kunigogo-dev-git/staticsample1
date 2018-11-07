<template>
  <div id="app">
	<div class="container">
	    <div class="page-header">
	        <h1>Dicom Parse Test</h1>
	        <p class="lead">
	            This is a walkthrough of how to use the dicomParser library.
	        </p>
	        <p>
	            This example shows how to use dicomParser to load a DICOM File and access its contents.  Drag
	            a DICOM P10 file into the region below to see a select few attributes from it.  Use your browser's
	            view source feature to see how this example was implemented along with source code comments.
	        </p>
	        <strong>Use of this example require IE10+ or any other modern browser.</strong>
	    </div>

	    <div class="row">
	        <div class="col-md-6">
	            <div id="dropZone" @dragleave.prevent @dragover.prevent @drop.prevent="onDrop">
	                <div class="panel panel-default ">
	                    <div class="panel-heading">
	                        <h3 class="panel-title">Example Output (drag file here)</h3>
	                    </div>
	                    <div class="panel-body">
	                        <div class="row">
	                            <div>
                                  
	                            </div>
	                        </div>
	                    </div>
	                </div>
	            </div>
	        </div>
			<div class="col-md-6">
				AAAA
			</div>
	    </div>
	</div>
  </div>
</template>

<script>
(function (a) { 
	var b = a
	console.log(b)
} ("abc"));

import {parseDICOMFile} from "./dicom-manager"

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    //inputタグとドラッグ&ドロップから呼ばれる
    onDrop:function(event){
      let fileList = event.target.files ? 
                     event.target.files:
                     event.dataTransfer.files;

      let files = [];

      for(let i = 0; i < fileList.length; i++){
        files.push(fileList[i]);
	  }
	  
	  parseDICOMFile(files[0], parse_completed_callback)
    }
  },
}

var parse_completed_callback = function (result) {
	document.getElementById("dropZone").innerHTML = result
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#dropZone {
	height: 400px;
	width: 100%;
	background-color: #F0F0F0;
	overflow: auto;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

</style>
