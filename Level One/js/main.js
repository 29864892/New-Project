

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
	var explode;//explosion animation
	var wasHit = false;
	var score = 0;
	var item;
	var timer;
	var timeText;
	var currentTime;
	var invincible = false;
	var invincibleTimer;
	
    function preload ()
    {
		this.load.spritesheet('mydude', 'assets/mydude.png', { frameWidth: 32, frameHeight: 48 });//load in character sprite (sprite made by me)
		this.load.audio('music', 'assets/Six_Umbrellas_09_Longest_Summer.mp3');//https://freemusicarchive.org/music/Six_Umbrellas
		this.load.image('drone', 'assets/policedrone.png');// load enemy image (made by me)
		this.load.image('arrow', 'assets/arrow.png');//load in arrow(made by me)
		this.load.audio('boom', 'assets/Explosion.mp3');//load in explosion sound https://www.freesoundeffects.com/free-sounds/explosion-10070/
		this.load.image('b00m', 'assets/b00m.png');//https://www.pinclipart.com/pindetail/iToRRR_download-clip-art-comic-explosion-transparent-clipart-comic/
		this.load.image('item','assets/item.png');
		this.load.image('end', 'assets/endScreen.png');
		//tilemap preload
		this.load.tilemapTiledJSON('map', 'assets/levelOne.json');
		this.load.spritesheet('tiles', 'assets/tileimage.png', {frameWidth: 50, frameHeight: 50});
    }

    function create ()
    {
		//load map
		map = this.make.tilemap({key: 'map'});
		//ground tiles
		
		//tileset = map.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		var groundTiles = map.addTilesetImage('tileimage','tiles');
		var cityTiles = map.addTilesetImage('tileimage', 'tiles');
		//create the background of the city
		this.cityImg = map.createDynamicLayer('City', cityTiles, 0, 0); 
		//create ground 
		this.groundLayer = map.createDynamicLayer('ground', groundTiles, 0, 0);
		// the player will collide with this layer
		this.groundLayer.setCollisionByExclusion([-1]);
		//world bounds
		this.physics.world.bounds.width = this.groundLayer.width;
		this.physics.world.bounds.height = this.groundLayer.height;
		//x = 60
		player = this.physics.add.sprite(60, 527, 'mydude');//create player copied from phaser tutorial)
		player.setBounce(0.2);
		player.setCollideWorldBounds(true);//wont fall out of screen
		//collide with the ground
		this.physics.add.collider(this.groundLayer, player);
		//this.physics.add.collider(player, platform);//player will not fall through platforms
		this.add.image(4960, 475, 'arrow');
		//player animations
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
		
		cursor = this.input.keyboard.createCursorKeys();//create input check
		lifeText = this.add.text(16, 16, 'Lives: 3', { fontSize: '20px', fill: '#001' });//create text for lives left
		scoreText = this.add.text(146, 16, 'Score: 0', { fontSize: '20px', fill: '#001' });//create text for lives left
		timeText = this.add.text(276, 16, 'Time: 0:00', { fontSize: '20px', fill: '#001' });//create text for timer
		//create enemy objects
		enemy = this.physics.add.group({
        key: 'drone',
		allowGravity: false,
        repeat: 47,
        setXY: { x: 120, y: 0, stepX: 100 }
		});
		//set up interaction with player
		this.physics.add.overlap(player, enemy, hit, null, this);
		
		//create item objects
		item = this.physics.add.group({
			key: 'item',
			allowGravity: false,
			repeat: 24,
			setXY: {x: 120, y: 450, stepX: 200 }
		});
		this.physics.add.overlap(player, item, pickUp, null, this);
		//add timer
		timer = this.time.addEvent({delay: 300000, callback: gameLost, callbackScope: this, loop: false});
	}

    function update()
    {	//copied from phaser tutorial
		//console.log(player.y); //debug
		var fillerZero = '';
		//console.log(gameOver);
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
		
		
		//scoreText.x = player.x - 300
		//console.log(player.x + ',' + player.y)
		if(player.x >= 4960 && !gameOver){
			console.log('end reached');
			this.add.image(4600, 300, 'end');
			this.add.text(4435, 200, 'Stage Cleared!', {fontSize: '40px', fill: '#000'});
			this.add.text(4535, 300, 'Score: ' + score, {fontSize: '30px', fill: '#000'});
			this.add.text(4535, 260, 'Time: ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60, {fontSize: '30px', fill: '#000'});
			gameOver = true;
		}
		
		
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
		
		//update child velocities
		enemy.children.iterate(function (child) {
			if(child.y <= 30){//inital movement and movement from top
				child.setVelocityY(Phaser.Math.FloatBetween(100, 800));
			}
			if(child.y >= 500){//movement from bottom
				child.setVelocityY(Phaser.Math.FloatBetween(-100, -800));
			}
		});
		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		// make the camera follow the player
		this.cameras.main.startFollow(player);
		
		//score and life text follow player
		if(player.x > 400 && player.x < 4598){
			lifeText.x = player.x - 390;
			scoreText.x = player.x - 260;
			timeText.x = player.x - 130;
		}
		if(invincible){
			console.log(invincibleTimer.getElapsedSeconds());
		}
    }
	
	//collision functions
	function hit(){
		
		if(!invincible){
			explode = this.add.image(player.x,player.y,'b00m');
			this.time.addEvent({delay: 100, callback: reapExplosion, callbackScope: this, loop: false});
			wasHit = true;
			this.sound.play('boom');
			if(player.x < 100 && lives != 1){
				player.setX(60);//reset player position
			}
			else if(lives != 1){
				player.setX(player.x - 100);
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
};
