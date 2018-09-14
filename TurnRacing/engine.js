window.ejb = window.ejb || {};

ejb.engine = (function () {
    var init,
        run,
        ctx = null,
        images = {
            bg: null,
            car: null
        },
        car = {
            x: 400,
            y: 50,
            speed: new Vector(0, 0)            
        },
        mousePosition = { x: 0, y: 0 },
        bestMatchVector = new Vector(0, 0),
        isRunning = true,
        gridSize = 20,
        turnNr = 0;



    init = function () {
        ctx = document.getElementById("canvas").getContext("2d");
        images.bg = new Image();
        images.bg.src = "bg.png";
        images.car = new Image();
        images.car.src = "car1.png";        
    };


    run = function () {
        //ejb.sound.init(["laser.mp3"], function () {
        bindEvents();        
        (function animloop() {            
            ctx.drawImage(images.bg, 0, 0);            
            drawRotatedImage(images.car, car.x, car.y, car.speed.angle);
            drawMovementLine({x:car.x+images.car.width/2,y:car.y+images.car.height/2},car.speed,mousePosition);
            ctx.fillStyle = "#00ff00";
            ctx.font = "20px terminal";
            ctx.fillText("Turn:" + turnNr, 940, 20);

            if (isRunning) {
                requestAnimFrame(animloop);
            } else {
                ctx.fillStyle = "#00ff00";
                ctx.font = "40px terminal";
                ctx.fillText("Game over", 400, 300);
            }
        })();
        setCameraToCenterOfCar();
        //});
    };

    function bindEvents() {

        //How to check for touch, or else remove dupes        
        $("#canvas").on("mousemove", function (e) {
            mousePosition = { x: e.offsetX, y: e.offsetY };
        });

        //$("#canvas").on("click", function(e) {
        //    mousePosition = { x: e.offsetX, y: e.offsetY };
        //    moveCar();
        //});
        
        $("#canvas").on("touchmove", function (e) {
            var canvasPosition = $(this).position();
            var scrollPos = { x: $(document).scrollLeft(), y: $(document).scrollTop() };
            mousePosition = {
                x: e.originalEvent.touches[0].clientX - canvasPosition.left + scrollPos.x,
                y: e.originalEvent.touches[0].clientY - canvasPosition.top + scrollPos.y
        };
            return false;
        });
        $("#canvas").on("touchend", function(e) {                        
            moveCar();
        });
    }

    function checkCollision() {
        //Asfalt 87 87 87 dec
        //Check corners
        var corners = [{ x: car.x, y: car.y }, { x: car.x + images.car.width, y: car.y }, { x: car.x, y: car.y + images.car.height }, { x: car.x + images.car.width, y: car.y + images.car.height }];

        for (var i = 0; i < corners.length; i++) {
            var corner = corners[i];
            var colorData = ctx.getImageData(corner.x, corner.y, 1, 1).data;
            if (colorData[0] != 87 || colorData[1] != 87 || colorData[2] != 87) {
                isRunning = false;                
            }
        }        
    }


    function drawMovementLine(origin,speed,destination) {
        var possibleMovements = [];
        var destinationVector = new Vector((destination.x - origin.x)/gridSize, (destination.y - origin.y)/gridSize);
        possibleMovements.push(speed);
        possibleMovements.push(new Vector(speed.x - 1, speed.y));
        possibleMovements.push(new Vector(speed.x - 1, speed.y - 1));
        possibleMovements.push(new Vector(speed.x, speed.y - 1));
        possibleMovements.push(new Vector(speed.x + 1, speed.y));
        possibleMovements.push(new Vector(speed.x, speed.y + 1));
        possibleMovements.push(new Vector(speed.x + 1, speed.y + 1));
        possibleMovements.push(new Vector(speed.x + 1, speed.y - 1));
        possibleMovements.push(new Vector(speed.x - 1, speed.y + 1));
        bestMatchVector = speed;

        for (var i = 0; i < possibleMovements.length; i++) {
            var movement = possibleMovements[i];
            ctx.fillStyle = "#00ff00";
            ctx.fillRect(origin.x + (movement.x * gridSize) - 2, origin.y + (movement.y * gridSize) - 2, 4, 4);
            if (new Vector(destinationVector.x-movement.x,destinationVector.y-movement.y).getLength() < new Vector(destinationVector.x-bestMatchVector.x,destinationVector.y-bestMatchVector.y).getLength()) {
                bestMatchVector = movement;
            }
        }

        ctx.fillStyle = "#ff0000";
        ctx.fillRect(origin.x + (bestMatchVector.x * gridSize) - 2, origin.y + (bestMatchVector.y * gridSize) - 2, 4, 4);

        ctx.beginPath();
        ctx.moveTo(origin.x,origin.y);
        ctx.lineTo(origin.x+bestMatchVector.x*gridSize, origin.y+bestMatchVector.y*gridSize);
        ctx.stroke();
    }

    function drawRotatedImage(image, x, y, angle) {
        ctx.save();
        ctx.translate(x + image.width / 2, y + image.height / 2);
        ctx.rotate(angle);        
        ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
        ctx.restore();
    }

    function moveCar() {
        car.speed = bestMatchVector;
        car.x += car.speed.x*gridSize;
        car.y += car.speed.y * gridSize;
        turnNr++;
        setCameraToCenterOfCar();
        checkCollision();
    }

    function setCameraToCenterOfCar() {
        var windowSize = { width: $(window).width(), height: $(window).height() };
        $(document).scrollLeft(car.x - windowSize.width/2);
        $(document).scrollTop(car.y - windowSize.height/2);
    }
    
    return {
        init: init,
        run: run
    };
})();