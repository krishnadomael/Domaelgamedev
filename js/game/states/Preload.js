ZenvaRunner.Preload=function(){
    this.ready=false;
};

ZenvaRunner.Preload.prototype={
    preload: function(){
        this.splash=this.add.sprite(this.game.world.centerX,this.game.world.centerY, 'logo' );
        this.splash.anchor.setTo(0.6);

        this.preloadBar=this.add.sprite(this.game.world.centerX,this.game.world.centerY+120, 'preloadbar' );
        this.preloadBar.anchor.setTo(0.6);

        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('ground','assets/images/ground.png');
        this.load.image('background','assets/images/background.png');

        // this.load.spritesheet('coins','assets/images/coins-ps.png',51,51,7);
        this.load.spritesheet('player','assets/images/run1.png',100,100,8);
        this.load.spritesheet('virus','assets/images/VIRUS.png',32,32,3);
        this.load.spritesheet('shield','assets/images/shield.png',200,200,1);
        

        this.load.audio('gameMusic',['assets/audio/Pamgaea.mp3','assets/audio/Pamgaea.ogg']);
        this.load.audio('rocket','assets/audio/rocket.wav');
        this.load.audio('bounce','assets/audio/bounce.wav');
        this.load.audio('coin','assets/audio/coin.wav');
        this.load.audio('death','assets/audio/death.wav');

        this.load.bitmapFont('minecraftia','assets/fonts/minecraftia/minecraftia.png','assets/fonts/minecraftia/minecraftia.xml');
        
        this.load.onLoadComplete.add(this.onLoadComplete, this);
    },
    create: function(){
        this.preloadBar.cropEnable=false;
    },
    update: function(){
        if(this.cache.isSoundDecoded('gameMusic') && this.ready === true){
            this.state.start('MainMenu');
        }
    },
    onLoadComplete: function(){
        this.ready=true;
    }
};