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
	    <div class="col-md-4">
	      <div id="dropZone" @dragleave.prevent @dragover.prevent @drop.prevent="onDrop">
	        <div class="panel panel-default ">
	          <div class="panel-heading">
	            <div class="panel-title">Dicom file instance list (drag file here)</div>
	          </div>
	          <div class="panel-body">
						  <div class="table-responsive">
							  <table class="table table-striped table-sm bg-light">
								  <thead>
									  <tr>
										  <th>File</th>
											<th>Instance#</th>
											<th>Position</th>
										</tr>
									</thead>
									<tbody>
									  <tr v-for="fileEntry in analyzedFiles" v-bind:key="fileEntry.id">
										  <td>{{fileEntry.file}}</td>
										  <td>{{fileEntry.instancenumber}}</td>
										  <td>{{fileEntry.position}}</td>
										</tr>
									</tbody>
								</table>
							</div>
	          </div>
	        </div>
	      </div>
	    </div>
			<div class="col-md-8">
        <b-card no-body>
          <b-tabs card>
            <b-tab title="Viewer" active>
              <div id="viewer" width="100px" height="100px" @dragleave.prevent @dragover.prevent @drop.prevent="onDropTestFile"></div>
            </b-tab>
            <b-tab title="Tags">
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
            </b-tab>
          </b-tabs>
        </b-card>
			</div>
	  </div>
	</div>
</template>

<script>
import {handleFileFolderDrop} from "./file-manager"
import {parseDICOMFile,registerImage} from "./dicom-manager"
import * as cornerstone from "cornerstone-core"
import * as dicomParser from "dicom-parser"

var initialParsetTags = []
var analyzedFileLists = []
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
			parsedTags: initialParsetTags,
			analyzedFiles: analyzedFileLists,
    }
  },
  methods:{
    //Drop test dicom file
    onDropTestFile:function(event){
			event.preventDefault()
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
    },
    //folder drop test
    onDrop:function(event){
      handleFileFolderDrop(event).then( (result) => {
        this.$data.analyzedFiles.splice(0, analyzedFileLists.length)
        for(let i = 0; i < result.entries.length; i++){
          var filename = result.entries[i].split("/").pop()
          this.$data.analyzedFiles.push( {"fullpath": result.entries[i],
                                   "file": filename,
                                  })
        }
      })
    }
  },
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
#viewer {
	height: 128px;
	width: 128px;
	background-color: rgb(78, 78, 78);
}

#dropforfolder {
	height: 200px;
	width: 100%;
	border-style: dashed;
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
