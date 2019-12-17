window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})(); 

function init() {    
    var leftKey = false, rightKey = false, upKey = false;
    var enemies = [],bullets=[];


    var player;
    var points;
    var pointValue = 0;    
    var randomWait = 60;
	var player = $("#player");
	var points = $("#points");
    
	var logicSwitch = true;
	
 //   document.getElementById("soundBG").play();
    
    var commands = {
        'left': function() {
          leftKey = true;
          rightKey = false;
          upKey = false;
        },
        'fire': function(){
            leftKey = false;
            rightKey = false;
            upKey = true;
        },
        'right': function(){
            leftKey = false;
            rightKey = true;
            upKey = false;
        },
        'stop': function(){
            leftKey=false;
            rightKey=false;
            upKey = false;
        }
      };
      annyang.addCommands(commands);
      annyang.start({ autoRestart: true, continuous: false });

	
    function render() {
        
        if (player.data("dead")) {
            $("#status").text("Game over!").addClass("gameOver");
            return;
        }

		if(logicSwitch){
		handleInput();
        handleEnemies();
        checkCollision();
		logicSwitch = false;
		}else{
		renderObjects();
		logicSwitch = true;		
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
                //new Audio("explosion.mp3").play();
				var sound = document.getElementById("soundExplosion");
				sound.currentTime=0;
				sound.play();
                pointValue++;
                points.text(pointValue);
                break;
            }


            if (enemyPosition.left + enemyWidth < playerPosition.left || enemyPosition.left > (playerPosition.left + playerWidth)) {
                //console.log("first case");
                continue;
            }

            if (enemyPosition.top + enemyHeight < playerPosition.top) {
                //console.log("second case");
                continue;
            }

            console.log("Dead!");
            player.data("dead", true);
            //new Audio("game_over.mp3").play();
			document.getElementById("soundGameOver").play();
        }

    }
    
    function handleEnemies() {
        randomWait -= 1;
        if (randomWait > 0) {
            return;
        }

        randomWait = 60 * 2 * Math.random();

        var enemy = $("<div class='enemy'></div>");
        var leftPosition = Math.random() * ($(document).width() - 50);        
        enemy.css("left", leftPosition).appendTo("body");
        enemies.push(enemy);        
    }

    function handleInput() {
        var movement = 7;
        var position = player.position(),
            documentWidth = $(document).width() - 50;
        if (leftKey) {
            if (position.left - movement >= 0) {
                player.css("left", position.left - movement);
            }
        }
        if (rightKey) {
            if (position.left + movement <= documentWidth) {
                player.css("left", position.left + movement);
            }
        } if (upKey) {
            fire();
            upKey = false;
        }
    }

    function fire() {
        var bullet = $("<div class='bullet'/>"),
            position = player.position();

        //new Audio("laser.mp3").play();
		var sound = document.getElementById("soundLaser");
		sound.currentTime = 0;
		sound.play();
		
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
            enemy.css("top", position.top +1);                        
            if (position.top + 60 > pageHeight || enemy.data("dead")) {
                enemy.remove();
                enemies.splice(i, 1);
                i--;
            }
        }
        
        for (var j = 0; j < bullets.length; j++) {
            var bullet = bullets[j];
            position = bullet.offset();
            bullet.css("top", position.top -5);
            if (position.top <= 0 || bullet.data("dead")) {
                bullet.remove();
                bullets.splice(j, 1);
                j--;
            }
        }
        
    }

    $("#status").text("Play!");
    
    (function animloop() {                
        requestAnimFrame(animloop);
        render();
    })();
}

$(document).on("click","#startGame",function(){
	init();
	$(this).remove();
});

