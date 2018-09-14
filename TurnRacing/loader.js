window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


$(function () {
    ejb.engine.init();
    $("#startBtn").on("click touchstart", function() {
        ejb.engine.run();
        $(this).remove();
    });
});