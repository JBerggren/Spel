main_state = (function(){
    var initState, preload,create,update;

    var game=null,
        worldSpeed=-200,
        fishes=null,
        myFish=null,
        otherFish=null,
        obstacles=null,
        world=null;

    initState = function(gameEngine){
        game = gameEngine;
    };
    
    preload =  function() {
        game.load.image("fish","assets/fish.png");
        game.load.image("ground","assets/ground.png");
        game.load.image("sky","assets/sky.png");
        game.load.image("rock","assets/rock.png");
    };

    create =  function() {                 
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.input.keyboard.addCallbacks(this,handleKeys)
        game.stage.backgroundColor="#0000ff";

        world = game.add.group();
        world.enableBody = true;
        var sky = world.create(0,0,"sky");
        sky.body.immovable=true;
        
        ground = game.add.tileSprite(0,game.world.height-10,640,10,"ground");            
        ground.autoScroll(worldSpeed,0);
        game.physics.arcade.enable(ground);                
        ground.body.immovable = true;
        world.add(ground);
        
        fishes = game.add.group();
        fishes.enableBody = true;
        myFish = fishes.create(100,100, "fish");                
        myFish.body.bounce.y = 0.5;
        myFish.checkWorldBounds = true;
        myFish.outOfBoundsKill = true;
        myFish.events.onOutOfBounds.add(function(){alert("Dead");game.state.start("main");},this);

        otherFish = fishes.create(150,100, "fish");
        otherFish.body.bounce.y = 0.1;
        otherFish.checkWorldBounds = true;
        otherFish.outOfBoundsKill = true;
        otherFish.events.onOutOfBounds.add(function(){alert("Yeah, 1 kill!");game.state.start("main");},this);                

        obstacles = game.add.group();
        obstacles.enableBody = true;
        
        game.time.events.loop(3000,function(){addObstacle()},null);
        addObstacle();
    };

    update = function() {                
        game.physics.arcade.collide(fishes);
        game.physics.arcade.collide(fishes, obstacles);
        game.physics.arcade.collide(fishes, world);
    };

    function addObstacle()
    {
        var yPosition = 0;
        //if(Math.random() > 0.5){
            yPosition = game.world.height-40;
        //}
        var obstacle = obstacles.create(game.world.width, yPosition,"rock");
        obstacle.body.immovable=true;
        obstacle.body.velocity.x = -200;
        obstacle.outOfBoundsKill = true;
        obstacle.checkWorldBounds = true;        
    }

    function handleKeys(ev){
        switch(ev.keyCode){
            case Phaser.Keyboard.UP:
                myFish.body.velocity.y =-150;
                myFish.rotation = -15*(Math.PI/180);
                break;
            case Phaser.Keyboard.DOWN:
                myFish.body.velocity.y =150;
                myFish.rotation = 15*(Math.PI/180);
                break;
            case Phaser.Keyboard.LEFT:
                myFish.body.velocity.x =-150;
                myFish.rotation = 0;
                break;
            case Phaser.Keyboard.RIGHT:
                myFish.body.velocity.x =150;
                myFish.rotation = 0;
                break;
        }
    }

    return {
        initState:initState,
        preload:preload,
        create:create,
        update:update
    };

})();    