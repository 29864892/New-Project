

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
	var enemyGroup;//group of enemies
	var left = true;
	var right = false;
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
			key: 'eLeft',
			frames: this.anims.generateFrameNumbers('officer', { start: 0, end: 3 }),
			frameRate: 10,
			
		});
		
		this.anims.create({//left animation
			key: 'eTurn',
			frames: [ { key: 'officer', frame: 4 } ],
			frameRate: 20
		});
		
		this.anims.create({//left animation
			key: 'eRight',
			frames: this.anims.generateFrameNumbers('officer', { start: 5, end: 8 }),
			frameRate: 10,
			
		});
		
		enemyGroup = this.physics.add.group({
        key: 'officer',
		allowGravity: false,
        repeat: 3,
        setXY: { x: 1200, y: 527, stepX: 1000 }
		});
		this.physics.add.overlap(player, enemyGroup, hit, null, this);
		this.physics.add.collider(enemyGroup, enemyGroup, gturn, null, this);
		
		enemyGroup.children.iterate(function (child) {
				child.setVelocityX(-100);
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
		console.log(player.x + ',' + player.y);
		//player hidden check
		if((player.x > 0 && player.x < 358) || (player.x > 1217 && player.x < 1900) || (player.x > 2257 && player.x < 2600) || (player.x > 3305 && player.x < 3643)){
			hiding = true;
		}
		else{
			hiding = false;
		}
		
		//console.log(player.x);
		
		//enemy animations
		if(!enemy.anims.isPlaying){
			if(enemy.body.velocity.x > 0){
				enemy.anims.play('eRight');
				//console.log('right');
			}
			else if(enemy.body.velocity.x < 0){
				enemy.anims.play('eLeft');
				//console.log('left');
			}
			else{
				enemy.anims.play('eTurn');
			}
		}
		//enemy movement
		if(enemy.x > 500 && !left){
			enemy.anims.stop;
			enemy.anims.play('eTurn');
			enemy.setVelocityX(-100);
			left = true;
			right = false;
		}
		
		if(enemy.x < 20 && !right){
			enemy.anims.stop;
			enemy.anims.play('eTurn');
			enemy.setVelocityX(100);
			right = true;
			left = false;
		}
		
		//enemyGroup animations and movement
		enemyGroup.children.iterate(function (child) {
			if(child.x < 1100){
				child.anims.stop;
				child.anims.play('eTurn');
				child.setVelocityX(100);
			}
			if(child.x > 4057){
				child.anims.stop;
				child.anims.play('eTurn');
				child.setVelocityX(-100);
			}
			//player detected nearby
			if((player.x - child.x <= 50 && player.x -child.x >= -50) && !hiding){
				//midair
				if(player.y > 520){
					child.anims.play('eTurn');
					if(player.x > child.x){ 
						child.setVelocityX(200);
					}
					else{
						child.setVelocityX(-200);
					}
				}//ground
				else{
					if(player.x > child.x){
						child.setVelocityX(200);
					}
					else{
						child.setVelocityX(-200);
					}
				}
				console.log('seen!');
			}
			if(!child.anims.isPlaying){
				if(child.body.velocity.x > 0){
					child.anims.play('eRight');
					//console.log('eRight');
				}
				else if(child.body.velocity.x < 0){
					child.anims.play('eLeft');
					//console.log('eLeft');
				}
				else{
					child.anims.play('eTurn');
				}
			}
		});
		//console.log(enemy.body.velocity.x);
		
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
			if(player.x < 400){
				this.add.image(400, 300, 'end');
				this.add.text(300, 200, 'Game Over', {fontSize: '40px', fill: '#000'});
				this.add.text(300, 300, 'Score ' + score, {fontSize: '30px', fill: '#000'});
				this.add.text(300, 260, 'Time ' +  currentTime, {fontSize: '30px', fill: '#000'});
			}
			else{
				this.add.image(player.x, 300, 'end');
				this.add.text(player.x-100, 200, 'Game Over', {fontSize: '40px', fill: '#000'});
				this.add.text(player.x-80, 300, 'Score ' + score, {fontSize: '30px', fill: '#000'});
				this.add.text(player.x-80, 260, 'Time ' +  currentTime, {fontSize: '30px', fill: '#000'});
			}
			player.destroy();
			gameOver = true;
			return;
		}
		//player.x = 4901;
		//player win (reach end of level);
		if(player.x > 4900){
			console.log('end reached');
			this.add.image(4600, 300, 'end');
			this.add.text(4435, 200, 'Stage Cleared!', {fontSize: '40px', fill: '#000'});
			this.add.text(4435, 300, 'Score: ' + score, {fontSize: '30px', fill: '#000'});
			this.add.text(4435, 260, 'Time: ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60, {fontSize: '30px', fill: '#000'});
			gameOver = true;
			return;
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
		if (cursor.up.isDown && player.body.onFloor() && !gameOver && !hiding)
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
		if(player.x > 400 && player.x < 4600){
			lifeText.x = player.x - 390;
			scoreText.x = player.x - 260;
			timeText.x = player.x - 130;
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
			player.setX(318);//reset player position
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
			//else
				//console.log('hidden');
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
	
	function gturn(enemyGroup1, enemyGroup2){
		
		//turn after collision
		if(enemyGroup1.x < enemyGroup2.x){
			enemyGroup1.anims.play('eTurn');
			enemyGroup1.setVelocityX(-100);
			enemyGroup1.anims.play('eLeft');
		}
		else{
			enemyGroup1.anims.play('eTurn');
			enemyGroup1.setVelocityX(100);
			enemyGroup1.anims.play('eRight');
		}
		if(enemyGroup2.x < enemyGroup1.x){
			enemyGroup2.anims.play('eTurn');
			enemyGroup2.setVelocityX(-100);
			enemyGroup2.anims.play('eLeft');
		}
		else{
			enemyGroup2.anims.play('eTurn');
			enemyGroup2.setVelocityX(100);
			enemyGroup2.anims.play('eRight');
		}
	}
};

