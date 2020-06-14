

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
		physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
        scene: {
            preload: preload,
            create: create,
            update: update
        },
		audio: {
			disableWebAudio: true
		}
    };
	//tile vars
	var map;
	var ground;
	var bg;
	
	var gameOver = false;//ends game when false
	var cursor;//input
	var platform;//objects for player to jump on
	var player;//player object
    var game = new Phaser.Game(config);//game object
	var firstmove = true;//check for when to start sound
	var lives = 3;//player lives 0 = gameover
	var lifeText;//text displaying lives
	var scoreText;//text for score (# of items picked up)
	var music;//in game music
	var enemy;//enemy object
	var enemyHp = 5;
	var enemyHit;
	var eAnimation = false;
	var ball;
	var explode;//explosion animation
	var wasHit = false;
	var score = 0;
	var item;
	var timer;
	var timeText;
	var currentTime;
	var invincible = false;
	var invincibleTimer;
	var bossBar;
	var bossFight = false;
	var cameraSet = false;
	var fillerZero = '';
	var fireTimer;
	var projectile;
	var bombs;
	var ally;
    function preload ()
    {
		this.load.image('end', 'assets/endScreen.png');
		this.load.spritesheet('mydude', 'assets/mydude.png', { frameWidth: 32, frameHeight: 48 });//load in character sprite (sprite made by me)
		this.load.spritesheet('ballSprite', 'assets/ballSheet.png', { frameWidth: 50, frameHeight: 50 });//ball sprite
		this.load.spritesheet('bombSprite', 'assets/bombsheet.png', { frameWidth: 30, frameHeight: 30 });//ally projectiles
		this.load.audio('music', 'assets/Six_Umbrellas_09_Longest_Summer.mp3');//https://freemusicarchive.org/music/Six_Umbrellas
		//boss assets
		this.load.image('boss', 'assets/boss.png');// load enemy image (made by me)
		this.load.spritesheet('bossSheet','assets/bossSheet.png', {frameWidth: 200, frameHeight: 300});//boss animation image
		this.load.image('bossF','assets/bossF.png');
		
		this.load.image('arrow', 'assets/arrow.png');//load in arrow(made by me)
		this.load.audio('boom', 'assets/Explosion.mp3');//load in explosion sound https://www.freesoundeffects.com/free-sounds/explosion-10070/
		this.load.image('b00m', 'assets/b00m.png');//https://www.pinclipart.com/pindetail/iToRRR_download-clip-art-comic-explosion-transparent-clipart-comic/
		this.load.image('item','assets/item.png');
		this.load.image('ball','assets/energy ball.png');
		this.load.image('bar','assets/encounterBar.png');
		this.load.image('ally', 'assets/random.png');
		//tilemap preload
		this.load.tilemapTiledJSON('map', 'assets/levelTwo.json');
		this.load.spritesheet('tiles', 'assets/levelTwo.png', {frameWidth: 50, frameHeight: 50});
    }

    function create ()
    {
		
		//load map
		map = this.make.tilemap({key: 'map'});
		//ground tiles
		
		//tileset = map.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		var groundTiles = map.addTilesetImage('levelTwo','tiles');
		var cityTiles = map.addTilesetImage('levelTwo', 'tiles');
		//create the background of the city
		this.cityImg = map.createDynamicLayer('Tile Layer 1', cityTiles, 0, 0); 
		//create ground 
		this.groundLayer = map.createDynamicLayer('ground', groundTiles, 0, 0);
		// the player will collide with this layer
		this.groundLayer.setCollisionByExclusion([-1]);
		//world bounds
		this.physics.world.bounds.width = this.groundLayer.width;
		this.physics.world.bounds.height = this.groundLayer.height;
		
		player = this.physics.add.sprite(60, 527, 'mydude');//create player copied from phaser tutorial)
		player.setBounce(0.2);
		player.setCollideWorldBounds(true);//wont fall out of screen
		//collide with the ground
		this.physics.add.collider(this.groundLayer, player);
		
		this.anims.create({//animation for moving left
			key: 'left',
			frames: this.anims.generateFrameNumbers('mydude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});
		
		this.anims.create({//turning animation
			key: 'turn',
			frames: [ { key: 'mydude', frame: 4 } ],
			frameRate: 20
		});
		
		this.anims.create({//right animation
			key: 'right',
			frames: this.anims.generateFrameNumbers('mydude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
		
		//copied from phaser tutorial
		cursor = this.input.keyboard.createCursorKeys();//create input check
		lifeText = this.add.text(16, 16, 'Lives: 3', { fontSize: '20px', fill: '#001' });//create text for lives left
		scoreText = this.add.text(146, 16, 'Score: 0', { fontSize: '20px', fill: '#001' });//create text for lives left
		timeText = this.add.text(276, 16, 'Time: 0:00', { fontSize: '20px', fill: '#001' });//create text for timer
		
		
		enemy = this.physics.add.sprite(1400,400, 'boss');
		
		this.anims.create({//right animation
			key: 'bossDmg',
			frames: this.anims.generateFrameNumbers('bossSheet', { start: 0, end: 1 }),
			frameRate: 10,
			repeat: -1
		});
		
		enemy.body.setAllowGravity(false);
		ball = this.physics.add.sprite(1300,440, 'ballSprite');
		ball.body.setAllowGravity(false);
		ball.visible = false;
		fireTimer = this.time.addEvent({delay: 5000, callback: fire, callbackScope: this, loop: true});
		fireTimer.paused = true;
		//add timer
		timer = this.time.addEvent({delay: 300000, callback: gameLost, callbackScope: this, loop: false});
		//bossBar = this.add.image(707,350,'bar');
		bossBar = this.physics.add.staticGroup();
		
		this.physics.add.overlap(player, bossBar, hit, null, this);
		this.physics.add.overlap(player, enemy, hit, null, this);
		this.physics.add.overlap(player, ball, hit, null, this);
		
		this.physics.add.overlap(player, item, pickUp, null, this);
		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		// make the camera follow the player
		this.cameras.main.startFollow(player);
		this.cameras.main.setFollowOffset(-300,0);
		this.cameras.main.setRenderToTexture();
		
		//boss projectile animations
		this.anims.create({//right animation
			key: '1',
			frames: this.anims.generateFrameNumbers('ballSprite', { start: 0, end: 1 }),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({//right animation
			key: '2',
			frames: this.anims.generateFrameNumbers('ballSprite', { start: 1, end: 0 }),
			frameRate: 10,
			repeat: -1
		});
		//bomb creation and animations
		projectile = this.physics.add.sprite(-50, -50, 'bombSprite');
		//collide with enemy
		this.physics.add.overlap(projectile, enemy, eHit, null, this);
		this.anims.create({//right animation
			key: '1b',
			frames: this.anims.generateFrameNumbers('bombSprite', { start: 0, end: 1 }),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({//right animation
			key: '2b',
			frames: this.anims.generateFrameNumbers('bombSprite', { start: 1, end: 0 }),
			frameRate: 10,
			repeat: -1
		});
		ally = this.physics.add.sprite(900, 227, 'ally');
		ally.body.setAllowGravity(false);
		ally.setVelocityX(50);
		ally.setVelocityY(50);
	}

     function update()
    {	
		//game information
		
		if(!gameOver){
			currentTime = Math.floor(timer.getElapsedSeconds());
			//console.log('time:' + currentTime);
			if(currentTime % 60 <= 9){
				fillerZero = '0';
			}
			else{
				fillerZero = '';
			}
			timeText.setText('Time: ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60);
		}
		//start of battle
		if(!bossFight && player.x >= 800){
			bossBar.create(707,350,'bar');
			bossFight = true;
			//ally throws bomb 
			this.time.addEvent({delay: 6000, callback: allyFire, callbackScope: this, loop: true});
		}
		//stop camera from following the player
		if(bossFight && !cameraSet){
			if(player.x >= 800){
				this.cameras.main.stopFollow(player);
			}
			lifeText.x = 707;
			scoreText.x = 837;
			timeText.x = 967;
			cameraSet = true;
		}
		
		//player loss
		if(lives == 0){
			console.log('end reached');
		
				this.add.image(1065, 300, 'end');
				this.add.text(900, 200, 'Game Over', {fontSize: '40px', fill: '#000'});
				this.add.text(900, 300, 'Score ' + score, {fontSize: '30px', fill: '#000'});
				this.add.text(900, 260, 'Time ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60, {fontSize: '30px', fill: '#000'});
			
			ball.destroy();
			enemy.anims.stop('bossDmg');
			enemy.setFrame(0);
			ally.setVelocityY(-100);
			ally.setVelocityX(100);
			player.destroy();
			gameOver = true;
			return;
		}
		
		//player win
		if(enemyHp == 0 && !gameOver){
			console.log('end reached');
			this.add.image(1120, 300, 'end');
			this.add.text(950, 200, 'Stage Cleared!', {fontSize: '40px', fill: '#000'});
			this.add.text(950, 300, 'Score: ' + score, {fontSize: '30px', fill: '#000'});
			this.add.text(950, 260, 'Time: ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60, {fontSize: '30px', fill: '#000'});
			ball.destroy();
			enemyHit.paused = true;
			enemy.destroy();
			this.add.image(1400,400, 'bossF');
			gameOver = true;
			return;
		}
		
		//stop player from leaving area
		if(player.x < 730 && bossFight){
			player.x = 740;
		}
		console.log(player.x);
		//show ball charging and prepare boss attack
		if(bossFight && !gameOver){
			fireTimer.paused = false;
			ball.visible = true;
			ball.anims.play('1', true);
			projectile.anims.play('1b',true);
		}
		if(ball.x < 600 || ball.y > 600){
			ball.setVelocityX(0);
			ball.setVelocityY(0);
			ball.x = 1300;
			ball.y = 430;
			
		}
		if (cursor.left.isDown && !gameOver)//left movement
		{
			if(firstmove){//implement sound compatible with chrome (input before audio)
				music = this.sound.add('music');
				music.play();	
				firstmove = false;
			}
			firstmove = false;
			player.setVelocityX(-160);

			player.anims.play('left', true);
		}
		
		else if (cursor.right.isDown && !gameOver)//right movement
		{
			if(firstmove){//implement sound compatible with chrome (input before audio)
				music = this.sound.add('music');
				music.play();
				firstmove = false;
			}
			player.setVelocityX(160);

			player.anims.play('right', true);
		}
		else
		{
			player.anims.play('turn');
			player.setVelocityX(0);

		}
		if (cursor.up.isDown && player.body.onFloor() && !gameOver)
		{
			if(firstmove){//implement sound compatible with chrome (input before audio)
				//music = this.sound.add('music');
				//music.play();
				firstmove = false;
			}
			player.setVelocityY(-330);
		}
		
		
		
		//console.log(player.x);
		//score and life text follow player
		if(player.x > 90 && !bossFight){
			lifeText.x = player.x - 80;
			scoreText.x = player.x + 50;
			timeText.x = player.x + 180;
		}
		//if(invincible){
			//console.log(invincibleTimer.getElapsedSeconds());
		//}
		//ally movement
		if(ally.x > 1200){
			ally.setVelocityX(-50);
		}
		else if(ally.x < 900){
			ally.setVelocityX(50);
		}
		else if(ally.y < 200){
			ally.setVelocityY(50);
		}
		else if(ally.y > 300){
			ally.setVelocityY(-50);
		}
    }
	
	//collision functions
	function hit(){
		
		if(!invincible){
		explode = this.add.image(player.x,player.y,'b00m');
		this.time.addEvent({delay: 100, callback: reapExplosion, callbackScope: this, loop: false});
		wasHit = true;
		this.sound.play('boom');
		if(lives != 1){
			player.setX(800);//reset player position
		}
			
		
		player.setY(527);
		lives--;//decrement lives and update text
		lifeText.setText('Lives: ' + lives);
		invincible = true;
			invincibleTimer = this.time.addEvent({delay: 5000, callback: stopInvincible, callbackScope: this, loop: false});
		}
		else{
			console.log(invincible);
		}
	}
	
	//end of timer (5 min)
	function gameLost(){
			console.log('end reached');
			this.add.image(player.x, 300, 'end');
			this.add.text(player.x-80, 200, 'Time Up', {fontSize: '40px', fill: '#000'});
			this.add.text(player.x-80, 300, 'Score ' + score, {fontSize: '30px', fill: '#000'});
			this.add.text(player.x-80, 260, 'Time ' +  currentTime, {fontSize: '30px', fill: '#000'});
			player.destroy();
			gameOver = true;
			fireTimer.paused = true;
			enemyHit.paused = true;
			return;
	}
	function pickUp(player, item){
		item.destroy();
		score++;
		scoreText.setText('Score: ' + score);
	}
	function reapExplosion(){
		explode.destroy();
	}
	//end of invincibility
	function stopInvincible(){
		console.log('not invincible');
		invincible = false;
	}
	function fire(){
		if(!gameOver){
				var velX;
				var velY;
			console.log('xd');
			if(player.x < 1000){
				velX = -800;
				velY = Phaser.Math.FloatBetween(90, 200);
				console.log('a');
			}
			else if(player.x < 1200){
				velX = -600;
				velY = Phaser.Math.FloatBetween(150, 200);
				console.log('a');
			}
			else{
				velX = Phaser.Math.FloatBetween(0,100);
				velY = 400;
				console.log('b');
			}
			ball.setVelocityX(velX);
			ball.setVelocityY(velY);
			console.log(velX + ',' + velY);
			console.log(player.x + '    ' + player.y);
			
			
		}
		else{
			console.log('gameOver');
		}
	}
	function eHit(){
		projectile.y = 1000;
		enemyHp--;
		console.log('bossHp: ' + enemyHp);
		if(!eAnimation){
			enemy.anims.play('bossDmg', false);
			eAnimation = true;
			enemyHit = this.time.addEvent({delay: 600, callback: stopEnemyFlash, callbackScope: this, loop: false});
		}
	}
	
	function stopEnemyFlash(){
		enemy.anims.stop('bossDmg');
		eAnimation = false;
	}
	function allyFire(){
		//fire projectile
		if(!gameOver){
			projectile.body.setGravityY(1);
			projectile.setVelocityY(0);
			projectile.x = ally.x;
			projectile.y = ally.y;
			projectile.setVelocityX(500);
		}
	}
};

