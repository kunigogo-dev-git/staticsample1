
export function handleFileFolderDrop(event) {
  console.log("handleFileFolderDrop() start")

  var enumerateEntry = (entryPoint, parsedresults) => {
    var numDir = 0;
    var fileListText = "";
    
    function toArray(list) {
      return Array.prototype.slice.call(list || [], 0);
    }
    
    new Promise(function(res, rej) {
      function loop(entry){
        if(entry.isFile){
          // ファイルならそのままパスを追加
          parsedresults.push(entry.fullPath)
        } else if (entry.isDirectory){
          numDir++
          // 非同期ディレクトリの読み込み
          new Promise(function(resolve, reject) {
            var reader = entry.createReader()
            var entries = []

            //一度のreadEntriesで全て読むわけではないため複数回再帰呼び出し
            var readEntries = function(){
              reader.readEntries(
                function(results){
                  if (!results.length) {
                    resolve(entries)//thenへ
                  } else {
                    entries = entries.concat(toArray(results))
                    readEntries();//再帰
                  }
                },
                function(error){
                  console.error(error)
                }
              )
            }
            readEntries();
          }).then(function(results) {
            // ディレクトリの読み込み完了後、更にファイルやディレクトリがないか検査
            for (var i = 0, len = results.length; i < len; i++) {
              loop(results[i]);
            }
            // 読み込み終了したディレクトリなのでデクリメント
            numDir--;

            // デクリメント後に0になってたらもう探査可能なディレクトリはない＝役目は終えた
            if(numDir <= 0){
              res();
            }
          })
        }
      }
      loop(entryPoint)
    }).then(() => {
      
    })
  }

  return new Promise((resolve, reject) => {
    try {
      event.preventDefault()

      var dataTransfer = event.dataTransfer			
      if (dataTransfer && dataTransfer.items){
        var items = dataTransfer.items,
            len = items.length
        // check count of drag item
        if (len === 1) {
          var item = items[0], entry
          // HTML5 Standard
          if (item.getAsEntry) {
            entry = item.getAsEntry()
          // Webkit compatible
          } else if (item.webkitGetAsEntry) {
            entry = item.webkitGetAsEntry()
          }
          
          // Entryをパース
          var parsedresults = []
          if (item.isFile) {
            parsedresults = [item.fullPath]
          } else {
            enumerateEntry(entry, parsedresults)
          }
          resolve({"entries" : parsedresults})
        } else {
          console.log("unsupported operation at handleFileFolderDrop()");
        }
      }
        
      console.log("handleFileFolderDrop() end")
    } catch(err) {
      var message = err
      if(err.exception) {
        message = err.exception
      }
      reject(message)
      console.log("handleFileFolderDrop() ends with error")
    }
  });
}

