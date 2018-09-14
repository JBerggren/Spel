window.ejb = window.ejb || {};

ejb.engine = (function () {
    var init,
        run,
        ctx = null,
        keys = {
            left: false,
            right: false,
            up: false,
            down: false
        },
        images = {
            bg: null,
            car: null
        },
        car = {
            x: 400,
            y: 50,
            speed: new Vector(0, 0)
        },
        isRunning = true,
        lapNr = 0,
        lapBestTime = 0,
        lapCurrentTime = 0,
        lapStartTime = 0,
        isOnLapLine = false,
	lapLineTimeout=0;




    init = function (callbackOnLoad) {
        ctx = document.getElementById("canvas").getContext("2d");
        images.bg = new Image();
        images.bg.src = "bg.png";
        images.bg.onload = function() {
            callbackOnLoad();
        };
        images.car = new Image();
        images.car.src = "car1.png";        
    };


    run = function () {        
        bindEvents();        
        (function animloop() {            
            ctx.drawImage(images.bg, 0, 0);            
            drawRotatedImage(ctx, images.car, car.x, car.y, car.speed.angle);
            ctx.fillStyle = "#00ff00";
            ctx.font = "18px terminal";
            ctx.fillText("Lap " + lapNr, 850, 20);
            ctx.fillText("Best time " + lapBestTime / 1000, 850, 40);
            ctx.fillText("Current time " + lapCurrentTime / 1000, 850, 60);
            gameTick();

            if (isRunning) {
                requestAnimFrame(animloop);
            } else {
                ctx.fillStyle = "#00ff00";
                ctx.font = "40px terminal";
                ctx.fillText("Game over", 400, 300);
            }
        })();
        //});
    };

    function bindEvents() {
        $(document).on("keydown", function (e) {
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

    function collisionCheck() {
        //Asfalt 87 87 87 dec
        //Check corners
        var corners = [{ x: car.x, y: car.y }, { x: car.x + images.car.width, y: car.y }, { x: car.x, y: car.y + images.car.height }, { x: car.x + images.car.width, y: car.y + images.car.height }];

        for (var i = 0; i < corners.length; i++) {
            var corner = corners[i];
            var colorData = ctx.getImageData(corner.x, corner.y, 1, 1).data;            
            if (colorData[0] != 87 || colorData[1] != 87 || colorData[2] != 87) {
                if (colorData[0] == 0 && colorData[1] == 255 && colorData[2] == 33) {
                    if (isOnLapLine) {
                        continue;
                    }
                    isOnLapLine = true;
			lapLineTimeout=0;
                    lapNr++;                    
                    if (lapBestTime == 0 || lapBestTime > lapCurrentTime) {
                        lapBestTime = lapCurrentTime;
                    }
                    lapStartTime = Date.now();
                } else {
                    console.log(colorData);
                    return true;
                }                
            }
        }
	if(isOnLapLine){
		lapLineTimeout++;
		if(lapLineTimeout > 60*5){
		        isOnLapLine = false;
			lapLineTimeout=0;
		}
	}	
        return false;
    }

    function gameTick() {
        if (keys.left) {
            car.speed.setAngle(car.speed.getAngle() - (Math.PI / 180) * 3);
        }
        if (keys.right) {
            car.speed.setAngle(car.speed.getAngle() + (Math.PI / 180) * 3);
        } if (keys.up) {
            car.speed.setLength(car.speed.getLength() + 0.1);
        } if (keys.down) {
            car.speed.setLength(car.speed.getLength() - 0.15);
        }

        car.x += car.speed.x;
        car.y += car.speed.y;
        if (lapStartTime != 0) {
            lapCurrentTime = Date.now() - lapStartTime;
        }        
    }

    function drawRotatedImage(context, image, x, y, angle) {
        context.save();
        context.translate(x + image.width / 2, y + image.height / 2);
        context.rotate(angle);
        if (collisionCheck()) {
            isRunning = false;
        }
        context.drawImage(image, -(image.width / 2), -(image.height / 2));
        context.restore();
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