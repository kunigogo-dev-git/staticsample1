import * as cornerstone from "cornerstone-core"
import * as dicomParser from "dicom-parser"

export function parseDICOMFile(file) {
  console.log("ParseDICOM() start")

  return new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.onload = (file) => {
      var arrayBuffer = reader.result
      var byteArray = new Uint8Array(arrayBuffer)
      var kb = byteArray.length / 1024
      var mb = kb / 1024
      var byteStr = mb > 1 ? mb.toFixed(3) + " MB" : kb.toFixed(0) + " KB"

      // Invoke the paresDicom function and get back a DataSet object with the contents
      var dataSet
      try {
        var start = new Date().getTime()
        dataSet = dicomParser.parseDicom(byteArray)
        // Try to get array of dicom tags
        var output = []
        createDumpedArray(dataSet, output);

        var end = new Date().getTime()
        var time = end - start
        if(dataSet.warnings.length > 0)
        {
        
        }

        resolve({"parsed" : output,"dataset": dataSet})
        console.log("ParseDICOM() end")
      }
      catch(err)
      {
        var message = err
        if(err.exception) {
            message = err.exception
        }
        reject(message)
        console.log("ParseDICOM() ends with error")
      }
    }
    reader.readAsArrayBuffer(file)
  });
}

function createDumpedArray(dataSet, output, level) {
    try {
        for (var propertyName in dataSet.elements) {
            var element = dataSet.elements[propertyName]
  
            var tagExp = element.tag.substring(1)
            tagExp = tagExp.substring(0,4) + "," + tagExp.substring(4,8)
            var length = element.length
            var vr = element.vr

            if (element.items) {
                /// 追加してから子要素処理
                output.push({id:tagExp, length:length, vr:vr, level:level, value:""})

                element.items.forEach(function (item) {
                    createDumpedArray(item.dataSet, output, level+1)
                })
            }
            else if (element.fragments) {
                /*
                var itemNumber = 0;
                element.fragments.forEach(function (fragment) {
                    var basicOffset;
                    if(element.basicOffsetTable) {
                        basicOffset = element.basicOffsetTable[itemNumber];
                    }
  
                    var str = '<li>Fragment #' + itemNumber++ + ' offset = ' + fragment.offset;
                    str += '(' + basicOffset + ')';
                    str += '; length = ' + fragment.length + '</li>';
                    output.push(str);
                });
                output.push('</ul>');
                */
            }
            else {
                if (element.length < 128) {
                    /*
                    if (element.length === 2) {
                        text += " (" + dataSet.uint16(propertyName) + ")";
                    }
                    else if (element.length === 4) {
                        text += " (" + dataSet.uint32(propertyName) + ")";
                    }
                    */
  
                    var str = dataSet.string(propertyName);
                    var stringIsAscii = isASCII(str);
  
                    if (stringIsAscii) {
                        if (str === undefined) {
                            str = "";
                        }
                    }
                    else {
                        if (element.length !== 2 && element.length !== 4) {
                            str= "binary data<";
                        }
                    }
                    output.push({id:tagExp, length:length, vr:vr, level:level, value:str})
                }
                else {
                    var str = "data too long to show"
                    output.push({id:tagExp, length:length, vr:vr, level:level, value:str})
                }
            }
        }
    } catch(err) {
        var ex = {
            exception: err,
            output: output
        }
        throw ex;
    }
  
}

function isASCII(str) {
  return /^[\x00-\x7F]*$/.test(str);
}

export function registerImage(dataSet, schema, id) {
  var pixelDataElement = dataSet.elements.x7fe00010
  var pixelData = new Uint16Array(dataSet.byteArray.buffer, 
                                  pixelDataElement.dataOffset, 
                                  pixelDataElement.length/2)
  var height = dataSet.uint16("x00280010")
  var width = dataSet.uint16("x00280011")
  var wl = dataSet.string("x00281050")
  var ww = dataSet.string("x00281051")

  function getImage(imageId) {
    function getPixelData()
    {
      if(imageId == schema + "://" + id)
      {
        return pixelData;
      }
      throw "unknown imageId";
    }

    var image = {
      imageId: imageId,
      minPixelValue : 0,
      maxPixelValue : 4096,
      slope: 1.0,
      intercept : -1024,
      windowCenter : parseFloat(wl),
      windowWidth : parseFloat(ww),
      render: cornerstone.renderGrayscaleImage,
      getPixelData: getPixelData,
      rows: height,
      columns: width,
      height: height,
      width: width,
      color: false,
      columnPixelSpacing: 0.67578,
      rowPixelSpacing: 0.67578,
      sizeInBytes: width * height * 2
    };

    return {
      promise: new Promise((resolve) => {
        resolve(image);
      }),
      cancelFn: undefined
    };
  }

  cornerstone.registerImageLoader(schema, getImage);    
}