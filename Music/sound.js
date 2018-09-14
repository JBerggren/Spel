window.jb = {};
window.jb.sound = (function () {
    var init,play,
        context, bufferLoader, sounds = [];

    init = function(files,loadedCallback) {
        // Fix up prefixing
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
    };

    play = function(index) {
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