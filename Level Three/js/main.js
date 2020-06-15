

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
	var eAnimation = true;
	
	var explode;//explosion animation
	var wasHit = false;
	var hiding = false;
	var score = 0;
	var item;
	var timer;
	var timeText;
	var currentTime;
	var invincible = false;
	var invincibleTimer;
	
	
	var cameraSet = false;
	var fillerZero = '';
	

    function preload ()
    {
		this.load.image('end', 'assets/endScreen.png');
		this.load.spritesheet('mydude', 'assets/mydude.png', { frameWidth: 32, frameHeight: 48 });//load in character sprite (sprite made by me)
		this.load.spritesheet('officer','assets/officer.png',{ frameWidth: 33, frameHeight: 48 });//lvl3 enemies
		
		this.load.audio('music', 'assets/Six_Umbrellas_09_Longest_Summer.mp3');//https://freemusicarchive.org/music/Six_Umbrellas
		
		
		this.load.audio('boom', 'assets/Explosion.mp3');//load in explosion sound https://www.freesoundeffects.com/free-sounds/explosion-10070/
		this.load.image('b00m', 'assets/b00m.png');//https://www.pinclipart.com/pindetail/iToRRR_download-clip-art-comic-explosion-transparent-clipart-comic/
		this.load.image('item','assets/item.png');
		
		//tilemap preload
		this.load.tilemapTiledJSON('map', 'assets/level3.json');
		this.load.spritesheet('tiles', 'assets/lvl3final.png', {frameWidth: 50, frameHeight: 50});
    }

    function create ()
    {
		
		
		//load map
		map = this.make.tilemap({key: 'map'});
		//ground tiles
		
		//tileset = map.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		var groundTiles = map.addTilesetImage('levelThree','tiles');
		var forestTiles = map.addTilesetImage('levelThree', 'tiles');
		var bushTiles = map.addTilesetImage('levelThree','tiles');
		//create the background of level3
		this.forestImg = map.createDynamicLayer('background', forestTiles, 0, 0); 
		this.Sky = map.createDynamicLayer('Sky',forestTiles,0,0);
		//create ground 
		this.groundLayer = map.createDynamicLayer('Ground', groundTiles, 0, 0);
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
		//create bushes to hide player
		this.bushLayer = map.createDynamicLayer('bushes',bushTiles, 0, 0);
		
		
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
		
		
		enemy = this.physics.add.sprite(400,527, 'officer');
		enemy.setFrame(4);
		enemy.setCollideWorldBounds(true);
		this.physics.add.collider(this.groundLayer, enemy);
		enemy.setVelocityX(-100);
		 
		this.anims.create({//left animation
			key: 'eleft',
			frames: this.anims.generateFrameNumbers('officer', { start: 0, end: 3 }),
			frameRate: 10,
			
		});
		
		this.anims.create({//left animation
			key: 'turn',
			frames: [ { key: 'officer', frame: 4 } ],
			frameRate: 20
		});
		
		this.anims.create({//left animation
			key: 'eright',
			frames: this.anims.generateFrameNumbers('officer', { start: 5, end: 8 }),
			frameRate: 10,
			
		});
		
		//add timer
		timer = this.time.addEvent({delay: 300000, callback: gameLost, callbackScope: this, loop: false});
		//bossBar = this.add.image(707,350,'bar');
		
		
		
		this.physics.add.overlap(player, enemy, hit, null, this);
		
		
		this.physics.add.overlap(player, item, pickUp, null, this);
		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		// make the camera follow the player
		this.cameras.main.startFollow(player);
		//this.physics.add.overlap(player, this.bushLayer, hidden, null, this);
		this.cameras.main.setRenderToTexture();
		
		
		
	}

     function update()
    {	
		//game information
		//console.log(player.x);
		//player hidden check
		if(player.x > 0 && player.x < 358){
			hiding = true;
		}
		else{
			hiding = false;
		}
		//enemy movement
		/**if(enemy.x <= 20 && enemy.anims.isPlaying){
			enemy.setVelocityX(0);
			console.log(enemy.anims.isPlaying);
			enemy.setFrame(4);
			//this.time.addEvent({delay: 500, callback: EnemyMoveRight, callbackScope: this, loop: false});
			enemy.anims.stop;
			enemy.setVelocityX(100);
		}
		else if(enemy.x > 1000){
			enemy.setVelocityX(-100);
		}
		if(enemy.body.velocity.x < 0){
			
				enemy.anims.play('eright');
			console.log('left');
		}
		else if(enemy.body.velocity.x > 0){
			//if(!enemy.anims.isPlaying){
				enemy.anims.play('eleft');
				console.log('moving right');
			//}
		}*/
		if(!enemy.anims.isPlaying && enemy.body.velocity.x < 0){
			console.log('playing');
			enemy.anims.play('eleft');
		}
		if(enemy.x <= 20){
			enemy.anims.stop;
			eAnimation = false;
			enemy.setFrame(5);
			console.log('animation stopped');
			if(!enemy.anims.isPlaying){
				enemy.anims.play('eright');
				enemy.setVelocityX(100);
			}
		}
		if(enemy.body.velocity.x > 0){
			if(!enemy.anims.isPlaying){
				enemy.anims.play('eright');
				console.log('moving right');
			}
		}
		console.log(enemy.anims.repeatCounter);
		if(!gameOver){
			currentTime = Math.floor(timer.getElapsedSeconds());
			
			if(currentTime % 60 <= 9){
				fillerZero = '0';
			}
			else{
				fillerZero = '';
			}
			timeText.setText('Time: ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60);
		}
		
		
		//player loss
		if(lives == 0){
			console.log('end reached');
		
				this.add.image(1065, 300, 'end');
				this.add.text(900, 200, 'Game Over', {fontSize: '40px', fill: '#000'});
				this.add.text(900, 300, 'Score ' + score, {fontSize: '30px', fill: '#000'});
				this.add.text(900, 260, 'Time ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60, {fontSize: '30px', fill: '#000'});
			
			
			
			
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
			
			enemyHit.paused = true;
			enemy.destroy();
			this.add.image(1400,400, 'bossF');
			gameOver = true;
			return;
		}
		
		
		//console.log(player.x);
		
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
		if(player.x > 90){
			lifeText.x = player.x - 80;
			scoreText.x = player.x + 50;
			timeText.x = player.x + 180;
		}
		//if(invincible){
			//console.log(invincibleTimer.getElapsedSeconds());
		//}
		//ally movement
		//console.log(hiding);
    }
	
	//collision functions
	function hit(){
		
		if(!invincible && !hiding){
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
			if(invincible)
			console.log(invincible);
			else
				console.log('hidden');
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
			
			console.log(velX + ',' + velY);
			console.log(player.x + '    ' + player.y);
			
			
		}
		else{
			console.log('gameOver');
		}
	}
	
	function EnemyMoveRight(){
		enemy.setVelocityX(100);
		

	}
};

