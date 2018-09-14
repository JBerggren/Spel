window.ejb = window.ejb || {};

ejb.engine = (function () {
    var init, run,
        ctx = null,
        images = {
            bg: null,
            tower: null,
            engemy: null
        },
        towerPosition = { x: 492, y: 710 },
        towerCenter = { x: towerPosition.x + 20, y: towerPosition.y + 20 },
        mousePosition = { x: 0, y: 0 },
        lasers = [],
        enemies=[],
	enemyWaitTimer=Math.random()*2*60;
        points = 0;

    init = function () {
        ctx = document.getElementById("canvas").getContext("2d");
        images.bg = new Image();
        images.bg.src = "bg.png";
        images.tower = new Image();
        images.tower.src = "tower.png";
        images.enemy = new Image();
        images.enemy.src = "enemy.png";        
    };


    run = function () {
        ejb.sound.init(["laser.mp3"],function() {
            bindEvents();
            (function animloop() {
                requestAnimFrame(animloop);
                render();
                collisionCheck();
	        createEnemy();
            })();
        });        
    };

    function bindEvents() {
        $("#canvas").on("click", function (e) {
            fire({x:e.offsetX,y:e.offsetY});
        });

        $("#canvas").on("mousemove", function (e) {
            mousePosition = { x: e.offsetX, y: e.offsetY };
        });

        $("#canvas").on("touchstart", function(e) {
            mousePosition = { x: e.offsetX, y: e.offsetY };
            fire(mousePosition);
        });
    }

    function calcVector(origin,destination,length) {        
        var offsetFromOrigin = {
            y: destination.y - origin.y,
            x: destination.x - origin.x
        };

        var angle = Math.atan(Math.abs(offsetFromOrigin.y / offsetFromOrigin.x));

        var x = Math.cos(angle) * length;
        var y = Math.sin(angle) * length;

        return {
            x: origin.x < destination.x ? x : -x,
            y: origin.y < destination.y ? y : -y,
        };
    }
    
    function collisionCheck() {
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            for (var j = 0; j < lasers.length; j++) {
                var laser = lasers[j];
                
                if (enemy.x > laser.x || enemy.x + enemy.width < laser.x) {
                    continue;                    
                }
                
                if (enemy.y > laser.y || enemy.y + enemy.height < laser.y) {
                    continue;
                }

                lasers.splice(j, 1);
                j--;
                enemies.splice(i, 1);
                i--;
                points++;
                break;
            }
		if(enemy.y > 748){
			enemies.splice(i,1);
			i--;
			points--;	
		}
        }
    }
    
    function createEnemy() {
	enemyWaitTimer--;
	if(enemyWaitTimer > 0){
		return;
	}
	enemyWaitTimer=Math.random()*2*60;
	var initialX = 1024*Math.random();
        var enemy = {
            x: initialX,
            y: 0,            
            width:40,
            height:40,
            speed: {
                x: 0,
                y: 2                
            }
        };

        enemies.push(enemy);
    }

    function fire(mousePoint) {
        var laser = {
            x: towerCenter.x,
            y: towerCenter.y,            
            speed: calcVector(towerCenter, mousePoint, 6)
        };

        lasers.push(laser);
        ejb.sound.play(0);
    }

    function render() {
        ctx.drawImage(images.bg, 0, 0);
        ctx.drawImage(images.tower, towerPosition.x, towerPosition.y);
        var gunVector = calcVector(towerCenter,mousePosition,20);
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#00ff00";
        ctx.moveTo(towerCenter.x, towerCenter.y);
        ctx.lineTo(towerCenter.x + gunVector.x, towerCenter.y + gunVector.y);
        ctx.stroke();

        ctx.textBaseline = "top";
        ctx.font = "22px terminal";
        ctx.fillStyle = "#00ff00";
        ctx.fillText(points, 990, 10);
        
        for (var i = 0; i < lasers.length; i++) {
            var laser = lasers[i];            
            ctx.beginPath();
            ctx.lineHeight = 3;
            ctx.strokeStyle = "#ff0000";
            ctx.moveTo(laser.x, laser.y);
            ctx.lineTo(laser.x + (laser.speed.x*3), laser.y + (laser.speed.y*3));
            ctx.stroke();
            laser.x += laser.speed.x;
            laser.y += laser.speed.y;            
        }
        
        for (var j = 0; j < enemies.length; j++) {
            var enemy = enemies[j];
            ctx.drawImage(images.enemy, enemy.x, enemy.y);
            enemy.x += enemy.speed.x;
            enemy.y += enemy.speed.y;
        }
    }

    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    return {
        init: init,
        run: run
    };
})();