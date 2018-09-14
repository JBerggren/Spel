// Fork from Chromium's 'Bufferloader' class
// http://chromium.googlecode.com/svn/trunk/samples/audio/doc/loading-sounds.html
 
function BufferLoader(audioContext, urlList, callback){
  this.context = audioContext;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}
 
(function(){
  var is_iOS = navigator.userAgent.indexOf('like Mac OS X') !== -1;   
  BufferLoader.prototype.loadBuffer = function(url, index){
    // Load buffer asynchronously	
    var request = new XMLHttpRequest();
	request.responseType = 'arraybuffer';
    request.open('GET', url, true);    
    var loader = this;	
 
    // Asynchronously decode the audio file data in request.response
    request.onload = function(){
        
      loader.context.decodeAudioData(
        getArrayBuffer(request.response),
        function successCallback(buffer){
          if(! buffer){
            alert('error decoding file data: '+url);
            return;
          }
          loader.bufferList[index] = buffer;
          if(++loader.loadCount == loader.urlList.length){
            loader.onload(loader.bufferList);
          }
        },
        function errorCallback(error){
          console.error('decodeAudioData error', error);
        }
      );
    };
  
    request.onerror = function(){
      alert('BufferLoader: XHR error');
    };
    
    request.send();
  };
  
  var getArrayBuffer;
  if(is_iOS){
    // http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
    var ab2str = function(buf){
      // ???URL?????? String.fromCharCode.apply(null, new Uint8Array(buf)) ????
      // 'Maximum call stack size exceeded' ??????????????????
      
      var arr = new Uint8Array(buf);
      var str = '';
      for(var i=0, len=arr.length; i<len; i++){
        str += String.fromCharCode(arr[i]);
      }
      return str;
    };
 
    var str2ab = function(str){
      var buf = new ArrayBuffer(str.length * Uint8Array.BYTES_PER_ELEMENT); // BYTES_... = 1
      var bufView = new Uint8Array(buf);
      for (var i=0, len=str.length; i<len; i++){
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    };
    
    getArrayBuffer = function(response){
      // iOS???XHR????? ArrayBuffer ?????????????????
      // ?? ArrayBuffer ? String ??????? ArrayBuffer ?????????????
      return str2ab(ab2str(response));
    };
    
  }else{
    getArrayBuffer = function(response){
      return response;
    };
  }
 
  BufferLoader.prototype.load = function(){
    for(var i=0; i < this.urlList.length; ++i){
      this.loadBuffer(this.urlList[i], i);
    }
  };
  
}());