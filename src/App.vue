<template>
  <div id="app" class="container-fluid text-secondary bg-dark">
	    <div class="page-header">
	        <h1>
	            Dicom parse utility
	        </h1>
	        <strong>Full Javascript based DICOM Utility example.</strong>
	        <strong>Use of this example require IE10+ or any other modern browser.</strong>
	    </div>

	    <div class="row">
	        <div class="col-md-6">
	            <div id="dropZone" @dragleave.prevent @dragover.prevent @drop.prevent="onDrop">
	                <div class="panel panel-default ">
	                    <div class="panel-heading">
	                        <strong class="panel-title">Tag Output (drag file here)</strong>
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
			<div class="col-md-6">
				<div id="viewer" height="100px"></div>
			</div>
	    </div>
	</div>
</template>

<script>
import {parseDICOMFile,registerImage} from "./dicom-manager"
import * as cornerstone from "cornerstone-core"
import * as dicomParser from "dicom-parser"

var initialParsetTags = [];
/*
(function (a) { 
	var b = a
	console.log(b)
} ("1 liner function notation."));
*/

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
				//put dumped array to data model of table 
				this.$data.parsedTags = result.parsed
				
				registerImage(result.dataset,"image", "1")

				setupImageView("image://1")
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

var setupImageView = function (imageid) {
	// image enable the dicomImage element
	const element = document.getElementById('viewer');
  element.style.width = '384px'
	element.style.height = '384px'

  cornerstone.enable(element);
  element.style.width = '384px'
	element.style.height = '384px'
	cornerstone.resize(element);

	// load and display the image
	cornerstone.loadImage(imageid).then(function(image) {

    cornerstone.displayImage(element, image)

		const viewport = cornerstone.getViewport(element)

			/*
		// Add event handler for the ww/wc presets
		document.getElementById('softTissue').addEventListener('click', function() {
				let viewport = cornerstone.getViewport(element);
				viewport.voi.windowWidth = 400;
				viewport.voi.windowCenter = 20;
				cornerstone.setViewport(element, viewport);
				document.getElementById('window').textContent = "WW/WC:" + Math.round(viewport.voi.windowWidth)
						+ "/" + Math.round(viewport.voi.windowCenter);
		});
		*/

		// add event handlers to mouse move to adjust window/center
		element.addEventListener('mousedown', function (e) {
				let lastX = e.pageX;
				let lastY = e.pageY;

				function mouseMoveHandler(e) {
						const deltaX = e.pageX - lastX;
						const deltaY = e.pageY - lastY;
						lastX = e.pageX;
						lastY = e.pageY;

						let viewport = cornerstone.getViewport(element);
						viewport.voi.windowWidth += (deltaX / viewport.scale);
						viewport.voi.windowCenter += (deltaY / viewport.scale);
						cornerstone.setViewport(element, viewport);
				}

				function mouseUpHandler() {
						document.removeEventListener('mousemove', mouseMoveHandler);
						document.removeEventListener('mouseup', mouseUpHandler);
				}

				document.addEventListener('mousemove', mouseMoveHandler);
				document.addEventListener('mouseup', mouseUpHandler);
		});
	});
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
	height: 500px;
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
