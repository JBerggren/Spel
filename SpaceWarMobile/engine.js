window.ejb = window.ejb || {};

ejb.engine = (function() {
    var init,
        run,
        player,
        pointsLabel,
        pointValue = 0,
        keys = {
            left: false,
            right: false,
            up: false,
            down: false
        },
        soundIndex = {},
        gameLoopMode = 0,
        waitTimeForNewEnemy = 60 * 1,
        enemies = [],
        bullets = [];


    init = function (onLoaded) {
        player = $("#player");
        pointsLabel = $("#points");
        soundIndex.music = 0;
        soundIndex.gameover = 1;
        soundIndex.laser = 2;
        soundIndex.explosion = 3;
        ejb.sound.init(["music.mp3", "game_over.mp3", "laser.mp3", "explosion.mp3"], onLoaded);
    };

    run = function () {
        bindEvents();
        ejb.sound.play(soundIndex.music);
        (function animloop() {
            requestAnimFrame(animloop);            
            gameLoop();
        })();
    };

    function bindEvents() {
        $("body").on("touchstart",function(){
          return false;
        });
        $("#controlLeft").on("touchstart", function() {
            keys.left = true;
        });
        $("#controlLeft").on("touchend", function () {
            keys.left = false;
        });

        $("#controlRight").on("touchstart", function () {
            keys.right = true;
        });        
        $("#controlRight").on("touchend", function () {
            keys.right = false;
        });

        $("#controlFire").on("touchstart", function () {
            keys.up= true;
        });
        $("#controlFire").on("touchend", function () {
            keys.up = false;
        });


        $(document).on("keydown", function(e) {
            if (e.which == 37) {
                keys.left = true;
            } else if (e.which == 39) {
                keys.right = true;
            } else if (e.which == 38) {
                keys.up = true;
            } else if (e.which == 40) {
                keys.down = true;
            } else {
                //alert(e.which);
            }
        });
        $(document).on("keyup", function(e) {
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

    function gameLoop() {
        if (player.data("dead")) {
            $("#status").text("Game over!").addClass("gameOver");
            return;
        }

        if (gameLoopMode ==1) {
            handleInput();
            handleEnemies();
            checkCollision();
            gameLoopMode = 0;
        } else {
            renderObjects();
            gameLoopMode = 1;
        }
    }
    function checkCollision() {
        var playerPosition = player.offset(),
        playerWidth = 40,
        enemyWidth = 40,
        enemyHeight = 40,
        bulletWidth = 5,
        bulletHeight = 10;

        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i],
                enemyPosition = enemy.offset();

            for (var j = 0; j < bullets.length; j++) {
                var bullet = bullets[j],
                    bulletPosition = bullet.offset();

                if (enemyPosition.left + enemyWidth < bulletPosition.left || enemyPosition.left > bulletPosition.left + bulletWidth) {
                    continue;
                }

                if (enemyPosition.top + enemyHeight < bulletPosition.top || enemyPosition.top > bulletPosition.top + bulletHeight) {
                    continue;
                }

                bullet.data("dead", true);
                enemy.data("dead", true);
                ejb.sound.play(soundIndex.explosion);
                changePoint(1);
                break;
            }


            if (enemyPosition.left + enemyWidth < playerPosition.left || enemyPosition.left > (playerPosition.left + playerWidth)) {                
                continue;
            }

            if (enemyPosition.top + enemyHeight < playerPosition.top) {                
                continue;
            }

            console.log("Dead!");
            player.data("dead", true);
            ejb.sound.play(soundIndex.gameover);            
        }

    }

    function changePoint(delta) {
        pointValue+= delta;
        pointsLabel.text(pointValue);
    }

    function handleEnemies() {
        waitTimeForNewEnemy -= 1;
        if (waitTimeForNewEnemy > 0) {
            return;
        }

        waitTimeForNewEnemy = 60 * 2 * Math.random();

        var enemy = $("<div class='enemy'></div>");
        var leftPosition = Math.random() * ($(document).width() - 50);
        enemy.css("left", leftPosition).appendTo("body");
        enemies.push(enemy);
    }

    function handleInput() {
        var position = player.position(),
            documentWidth = $(document).width() - 50;
        if (keys.left) {
            if (position.left - 7 >= 0) {
                player.css("left", position.left - 7);
            }
        }
        if (keys.right) {
            if (position.left + 7 <= documentWidth) {
                player.css("left", position.left + 7);
            }
        } if (keys.up) {
            fire();
            keys.up= false;
        }
    }

    function fire() {
        var bullet = $("<div class='bullet'/>"),
            position = player.position();

        ejb.sound.play(soundIndex.laser);        

        position.left += player.width() / 2;
        bullet.css("left", position.left).css("top", position.top).appendTo("body");
        bullets.push(bullet);
    }

    function renderObjects() {
        var pageHeight = $(document).height(),
            position = 0;

        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            position = enemy.offset();
            enemy.css("top", position.top + 3);
            if (position.top + 60 > pageHeight || enemy.data("dead")) {
                if (!enemy.data("dead")) {
                    changePoint(-1);
                }                
                enemy.remove();
                enemies.splice(i, 1);
                i--;
            }
        }

        for (var j = 0; j < bullets.length; j++) {
            var bullet = bullets[j];
            position = bullet.offset();
            bullet.css("top", position.top - 5);
            if (position.top <= 0 || bullet.data("dead")) {
                bullet.remove();
                bullets.splice(j, 1);
                j--;
            }
        }

    }


    return {
        init: init,
        run:run
    };
})();