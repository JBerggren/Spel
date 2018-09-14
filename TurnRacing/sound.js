window.ejb = window.ejb || {};
window.ejb.sound = (function () {
    var init,play,
        context, bufferLoader, sounds = [];

    init = function(files,loadedCallback) {
        // Fix up prefixing
        try{
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();

        bufferLoader = new BufferLoader(
            context,
            files,
          function(bufferList){
                    finishedLoading(bufferList);
            loadedCallback();
		}
        );
        bufferLoader.load();
        }catch(e){
          loadedCallback();
        }        
    };

    play = function(index) {
      if(sounds.length-1 < index){
        console.log("Trying to play faulty sound index " + index);
        return;
      }
        var source = context.createBufferSource();
        source.buffer = sounds[index];
        source.connect(context.destination);
        source.noteOn(1);
    };

    function finishedLoading(bufferList) {
        for (var i = 0; i < bufferList.length; i++) {            
            sounds.push(bufferList[i]);
        }
    }

    return {
        init: init,
        play:play
    };
})();