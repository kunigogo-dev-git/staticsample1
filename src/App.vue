<template>
  <div id="app">
	<div class="container-fluid text-secondary bg-dark">
	    <div class="page-header">
	        <h1>Dicom Parse Test</h1>
	        <p class="lead">
	            Full Javascript based DICOM Utility example.
	        </p>
	        <strong>Use of this example require IE10+ or any other modern browser.</strong>
	    </div>

	    <div class="row">
	        <div class="col-md-6">
	            <div id="dropZone" @dragleave.prevent @dragover.prevent @drop.prevent="onDrop">
	                <div class="panel panel-default ">
	                    <div class="panel-heading">
	                        <h3 class="panel-title">Tag Output (drag file here)</h3>
	                    </div>
	                    <div class="panel-body">
												<div class="table-responsive">
													<table class="table table-striped table-sm bg-light">
													<thead>
														<tr>
														<th>Tag</th>
														<th>Value</th>
														</tr>
													</thead>
													<tbody>
														<tr v-for="tag in parsedTags" v-bind:key="tag.id">
														<td>{{tag.id}}</td>
														<td>{{tag.value}}</td>
														</tr>
													</tbody>
													</table>
												</div>
	                    </div>
	                </div>
	            </div>
	        </div>
			<div id="viewer" class="col-md-6">
				<div height="500px"></div>
			</div>
	    </div>
	</div>
  </div>
</template>

<script>
(function (a) { 
	var b = a
	console.log(b)
} ("1 liner function notation."))

var initialParsetTags = []

import {parseDICOMFile} from "./dicom-manager"

export default {
  name: 'app',
  data () {
    return {
			msg: 'Welcome to Your Vue.js App',
			parsedTags: initialParsetTags
    }
  },
  methods:{
    //inputタグとドラッグ&ドロップから呼ばれる
    onDrop:function(event){
      let fileList = event.target.files ? 
                     event.target.files:
                     event.dataTransfer.files;

      let files = [];
      	
      this.$data.parsedTags[0]
      for(let i = 0; i < fileList.length; i++){
        files.push(fileList[i]);
	    }
	  
	    parseDICOMFile(files[0]).then( (result) => {
				parse_completed_callback(this.$data, result)
			})
    }
  },
}

var parse_completed_callback = function (vuemodel, result) {
	//document.getElementById("dropZone").innerHTML = result
  vuemodel.parsedTags = result.parsed
	// get the pixel data element (contains the offset and length of the data)
	var pixelDataElement = result.dataset.elements.x7fe00010
	// create a typed array on the pixel data (this example assumes 16 bit unsigned data)
	var pixelData = new Uint16Array(result.dataset.byteArray.buffer, 
																	pixelDataElement.dataOffset, 
																	pixelDataElement.length/2)

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
