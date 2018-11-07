<template>
  <div id="app">
	<div class="container">
	    <div class="page-header">
	        <h1>Getting Started</h1>
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
	        <div class="col-md-12">
	            <div id="dropZone" @dragleave.prevent @dragover.prevent @drop.prevent="onDrop">
	                <div class="panel panel-default ">
	                    <div class="panel-heading">
	                        <h3 class="panel-title">Example Output</h3>
	                    </div>
	                    <div class="panel-body">
	                        <div class="row">
	                            <div class="col-xs-12">
	                                Parse Error: <span id="parseError"></span>
	                            </div>
	                        </div>
	                        <div class="row">
	                            <div class="col-xs-12">
	                                SOP Instance UID: <span id="sopInstanceUid"></span>
	                            </div>
	                        </div>
	                        <div class="row">
	                            <div class="col-xs-12">
	                                Patient Id: <span id="patientId"></span>
	                            </div>
	                        </div>
	                        <div class="row">
	                            <div class="col-xs-12">
	                                Other Patient Ids: <span id="otherPatientIds"></span>
	                            </div>
	                        </div>
	                        <div class="row">
	                            <div class="col-xs-12">
	                                Rows: <span id="rows"></span>
	                            </div>
	                        </div>
	                        <div class="row">
	                            <div class="col-xs-12">
	                                ReferencedSOPClassUID: <span id="referencedSOPClassUID"></span>
	                            </div>
	                        </div>
	                        <div class="row">
	                            <div class="col-xs-3">
	                                ImagePositionPatient:
	                            </div>
	                            <div class="col-xs-3">
	                                <span id="imagePositionPatientX"></span>
	                            </div>
	                            <div class="col-xs-3">
	                                <span id="imagePositionPatientY"></span>
	                            </div>
	                            <div class="col-xs-3">
	                                <span id="imagePositionPatientZ"></span>
	                            </div>
	                        </div>
	                        <div class="row">
	                            <div class="col-xs-12">
	                                ImagePositionPatient # of values: <span id="imagePositionPatientNumValues"></span>
	                            </div>
	                        </div>
	                        <div class="row">
	                            <div class="col-xs-12">
	                                SopInstanceUid Data Offset and Length: <span id="sopInstanceUidDataOffsetAndLength"></span>
	                            </div>
	                        </div>
	                        <div class="row">
	                            <div class="col-xs-12">
	                                SopInstanceUid VR: <span id="sopInstanceUidVR"></span>
	                            </div>
	                        </div>
	                    </div>
	                </div>

	            </div>
	        </div>
	    </div>
	</div>
  </div>
</template>

<script>
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
    }
  },
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
