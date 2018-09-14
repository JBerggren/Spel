window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


window.game = (function () {
    var init,
        player,
        keys = {
            left: false,
            right: false,
            up: false,
            down: false
        };
    
    init = function() {
        player = $("#player");                    
        bindEvent();
        //player.css("left", $(document).width() / 2).css("top", $(document).height() / 2);
        loadMap("1",function() {
            (function animloop() {
                requestAnimFrame(animloop);
                render();
            })();
        });        
    };

    function bindEvent() {
        $(document).on("keydown", function (e) {
            if (e.which == 37) {
                keys.left = true;
            } else if (e.which == 39) {
                keys.right= true;
            } else if (e.which == 38) {
                keys.up = true;
            } else if (e.which == 40) {
                keys.down= true;
            }else {
                //alert(e.which);
            }
        });
        $(document).on("keyup", function (e) {
            if (e.which == 37) {
                keys.left = false;
            } else if (e.which == 39) {
                keys.right = false;
            } else if (e.which == 38) {
                keys.up = false;
            } else if (e.which == 40) {
                keys.down = false;
            }
        });
    }    
    

    function handleInput() {
        var position = player.position();            

        if (keys.up) {
            position.top -= 1;
        }
        if (keys.down) {
            position.top += 1;
        }
        if (keys.left) {
            position.left -= 1;
        }
        if (keys.right) {
            position.left += 1;
        }

        player.css("left", position.left).css("top",position.top);
    }

    function loadMap(mapFile,mapLoadedCallback) {
        $.get("maps/" + mapFile + ".txt", function (response) {
            alert(response);
            mapLoadedCallback();
        });        
    }

    function render() {
        handleInput();
    }

    return {
            init: init
        };
    })();

setTimeout(function() {
    game.init();
}, 500);

  
  /*
  function handleInput() {
      var position = player.position(),
          documentWidth = $(document).width() - 50;
      if (leftKey) {
          if (position.left - 7 >= 0) {
              player.css("left", position.left - 7);
          }      
    }
    if (rightKey) {
        if (position.left + 7 <= documentWidth) {
            player.css("left", position.left + 7);
        }      
    }if(upKey){
      fire();
      upKey=false;
    }
  }
  */          

