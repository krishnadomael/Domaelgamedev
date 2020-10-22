ZenvaRunner.Game = function(){
  this.enemyRate = 2000;
  this.enemyTimer = 0;
  

  this.jump = false;
  this.rate=5000;
  this.time=0;

  this.Rate = 1000;
  this.Timer = 0;
  this.sec=0;
  this.min=0;


};
ZenvaRunner.Game.prototype = {        //extend the Game method prototype
  create: function(){
    //show the same animation when user tap the screen
    this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
    this.background.scale.setTo(1.6);
    this.background.autoScroll(-100,0);

    this.ground=this.game.add.tileSprite(0,this.game.height-210,this.game.width,220,'ground');
    this.ground.autoScroll(-400, 0);

    this.player = this.add.sprite(200, this.game.height/2,'player');
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(1.5);

    this.player.animations.add('run', [0,1,2,3,4,3,2,1]);
    this.player.animations.add('jump', [5,6,7,6,5]);
    this.player.animations.play('run', 8, true);
    //this will enable physics to our game
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //using the arcade physics system we are setting the gravity in the horizontal direction of 400, the higher the value the more gravity
    this.game.physics.arcade.gravity.y = 1000;
    this.game.physics.arcade.enableBody(this.ground); //add gravity to our ground( in preload.js)

    this.ground.body.allowGravity = false; // we dont want our ground affected by gravity
    this.ground.body.immovable = true; //this will keep the ground stay in place

    this.game.physics.arcade.enableBody(this.player); //apply physics to our player
    
    this.player.body.collideWorldBounds = true;// if player fall (the player gone) if dont enable
    this.player.body.bounce.set(0.25); // we want our player to bounce when it runs




    this.enemies = this.game.add.group();
    this.scoreText1=this.game.add.bitmapText(10,10,'minecraftia', 'time'+this.sec, 24);

    this.jetSound=this.game.add.audio('rocket');
    this.coinSound=this.game.add.audio('coin');
    this.deathSound=this.game.add.audio('death');
    this.gameMusic=this.game.add.audio('gameMusic');
    this.gameMusic.play('',0,true);

    cursors = this.input.keyboard.createCursorKeys();
  },
  update: function(){
    if (cursors.left.isDown){
      this.player.body.velocity.x-=20;
      this.player.animations.play('back', 6, true)
    }
    else if (cursors.right.isDown){
      this.player.body.velocity.x +=20;
      this.player.animations.play('front', 6, true)

    }
    else if (cursors.down.isDown){
      this.player.body.velocity.y +=120;

    }
     else{
        this.player.body.velocity.x =0; 
    }

    if(this.enemyTimer < this.game.time.now){
      this.createEnemy();
      this.enemyTimer = this.game.time.now + this.enemyRate;
    }
     if(this.Timer < this.game.time.now){
      this.show();
      this.Timer = this.game.time.now + this.Rate;
    }     
    

    //we are telling to the arcade physics to check for collison and apply approriate Physics
    this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);
  },

  shutdown: function(){
    this.enemies.destroy();
    this.enemyTimer=0;
    this.sec=0;
    this.min=0;
    this.Timer=0;
  },

  show:function(){
    this.sec++;
    if(this.sec==60){
      this.sec=0;
      this.min++;
    };
    this.scoreText1.text='time: '+this.min+':'+this.sec;
  },

  createEnemy: function(){
    var x = this.game.width;
    var y = this.game.world.height-300;
    
    var enemy = this.enemies.getFirstExists(false);
    if(!enemy){
      enemy = new Enemy(this.game, 0, 0);
      this.enemies.add(enemy);
    }
    enemy.reset(x, y);
    enemy.revive();
  },
  groundHit: function(player, ground){
    this.jump=true;
    this.player.animations.play('run', 8, true);
    if(this.jump==true){
      if(cursors.up.isDown){
        this.player.animations.play('jump', 2, true);
        this.player.body.velocity.y -=650;
        this.jump=false;
      }
    };
  },
  
  enemyHit: function(player, enemy){
    var shake = new Phaser.Plugin.wig(game);
    game.plugins.add(shake);

    // shake camera
    shake.shake(); // default displacement
    shake.shake(40); // 40 pixels max displacement

      player.kill();
      enemy.kill();

      this.deathSound.play();
      this.gameMusic.stop();
      
      this.ground.stopScroll();
      this.background.stopScroll();

      this.enemies.setAll('body.velocity.x', 0);

      this.enemyTimer=Number.MAX_VALUE;

      this.Timer=Number.MAX_VALUE;

      var scoreboard=new Scoreboard(this.game);
      scoreboard.show(this.scoreText1.text,this.min,this.sec);
  },


};