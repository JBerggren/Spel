﻿window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


$(function () {
    ejb.engine.init(function() {
        $("#startBtn").on("click", function () {
            ejb.engine.run();
            $(this).remove();
        });
    });    
});