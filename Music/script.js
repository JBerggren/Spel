$(function() {
    jb.sound.init(["music.mp3"],function(){alert("Loaded");});
});

$(document).on("click", "#startBtn", function () {
    jb.sound.play(0);
});