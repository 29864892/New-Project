//First level of the game 
var music1;
var map;
var ground;
var bg;
var gameOver = false;//ends game when false
var cursor;//input
var platform;//objects for player to jump on
var player;//player object
		
var firstmove = true;//check for when to start sound
var lives = 3;//player lives 0 = gameover
var lifeText;//text displaying lives
var scoreText;//text for score (# of items picked up)
var music1;//in game music1
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
var hit;

var menuMusic;

class LevelOne extends Phaser.Scene{
	constructor(){
		super({key: 'LevelOne',
		type: Phaser.AUTO,
		width: 800,
		height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 600 },
				debug: false
            }
        }
    });
	}
	
	preload(){
		//tilemap preload
		this.load.tilemapTiledJSON('map1', 'assets/assets1/levelOne.json');
		this.load.spritesheet('tiles1', 'assets/assets1/tileimage.png', {frameWidth: 50, frameHeight: 50});
	}
	
	create(){
		gameOver = false;
		//load map
		this.map = this.make.tilemap({key: 'map1'});
		//ground tiles
		
		//tileset = map.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		var groundTiles = this.map.addTilesetImage('tileimage','tiles1');
		var cityTiles = this.map.addTilesetImage('tileimage', 'tiles1');
		//create the background of the city
		this.cityImg = this.map.createDynamicLayer('City', cityTiles, 0, 0); 
		//create ground 
		this.groundLayer = this.map.createDynamicLayer('ground', groundTiles, 0, 0);
		// the player will collide with this layer
		this.groundLayer.setCollisionByExclusion([-1]);
		//world bounds
		
		this.physics.world.bounds.width = this.groundLayer.width;
		this.physics.world.bounds.height = this.groundLayer.height;
		//x = 60
		this.player = this.physics.add.sprite(60, 527, 'mydude');//create player copied from phaser tutorial)
		
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);//wont fall out of screen
		//collide with the ground
		this.physics.add.collider(this.groundLayer, this.player);
		
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
		this.physics.add.overlap(this.player, enemy, this.hit, null, this);
		
		//create item objects
		item = this.physics.add.group({
			key: 'item',
			allowGravity: false,
			repeat: 24,
			setXY: {x: 120, y: 450, stepX: 200 }
		});
		this.physics.add.overlap(this.player, item, this.pickUp, null, this);
		//add timer
		timer = this.time.addEvent({delay: 300000, callback: this.gameLost, callbackScope: this, loop: false});
		/*
		this.cheats = true;
		if(this.cheats){
			console.log('cheats enabled');
			this.player.x = 4600;
			invincible = true;
		}*/
		if(menuMusic.isPlaying){
			menuMusic.stop();
		}
	}
	
	update()
	{	
	
		var fillerZero = '';
		currentTime = Math.floor(timer.getElapsedSeconds());
		//console.log('time:' + currentTime);
		if(currentTime % 60 <= 9){
			fillerZero = '0';
		}
		else{
			fillerZero = '';
		}
		timeText.setText('Time: ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60);
		
		if(lives == 0 && !gameOver){
			if(this.player.x < 400){
				this.add.image(400, 300, 'end');
				this.add.text(300, 200, 'Game Over', {fontSize: '40px', fill: '#000'});
				this.add.text(300, 300, 'Score ' + score, {fontSize: '30px', fill: '#000'});
				this.add.text(300, 260, 'Time ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60, {fontSize: '30px', fill: '#000'});
				
				this.menuText = this.add.text(300, 360, 'Menu', {fontSize: '30px', fill: '#000'});
				this.menuText.setInteractive();
				this.menuText.on('pointerdown', () => this.retMain());
			}
			else{
				this.add.image(this.player.x, 300, 'end');
				this.add.text(this.player.x-100, 200, 'Game Over', {fontSize: '40px', fill: '#000'});
				this.add.text(this.player.x-80, 260, 'Time ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60, {fontSize: '30px', fill: '#000'});
				this.add.text(this.player.x-80, 300, 'Score ' + score, {fontSize: '30px', fill: '#000'});
				
				this.menuText = this.add.text(this.player.x-80, 360, 'Menu', {fontSize: '30px', fill: '#000'});
				this.menuText.setInteractive();
				this.menuText.on('pointerdown', () => this.retMain());
			}
			this.player.destroy();
			gameOver = true;
			
		}
		if(this.player.x >= 4960 && !gameOver){
			
			console.log('end reached');
			this.add.image(4600, 300, 'end');
			this.add.text(4435, 200, 'Stage Cleared!', {fontSize: '40px', fill: '#000'});
			this.add.text(4535, 290, 'Score: ' + score, {fontSize: '30px', fill: '#000'});
			this.add.text(4535, 260, 'Time: ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60, {fontSize: '30px', fill: '#000'});
			
			this.nextText = this.add.text(4535, 330, 'Next Level', {fontSize: '30px', fill: '#000'});
			this.nextText.setInteractive();
			this.nextText.on('pointerdown', () => this.nextLevel());
			
			this.menuText = this.add.text(4535, 360, 'Menu', {fontSize: '30px', fill: '#000'});
			this.menuText.setInteractive();
			this.menuText.on('pointerdown', () => this.retMain());
			gameOver = true;
			this.player.destroy();
			
			
		}
		
		
		
		if(!gameOver){
		
			if (cursor.left.isDown && !gameOver)//left movement
			{
				if(firstmove){//implement sound compatible with chrome (input before audio)
					music1 = this.sound.add('music1');
					music1.play();	
					firstmove = false;
				}
				firstmove = false;
				this.player.setVelocityX(-160);

				this.player.anims.play('left', true);
			}
			else if (cursor.right.isDown && !gameOver)//right movement
			{
				if(firstmove){//implement sound compatible with chrome (input before audio)
					music1 = this.sound.add('music1');
					music1.play();
					firstmove = false;
				}
				this.player.setVelocityX(160);

				this.player.anims.play('right', true);
			}
			else
			{
				this.player.anims.play('turn');
				this.player.setVelocityX(0);
			}
			if (cursor.up.isDown && this.player.body.onFloor() && !gameOver)
			{
				if(firstmove){//implement sound compatible with chrome (input before audio)
					music1 = this.sound.add('music1', {volume: 0.5, loop:true});
					music1.play();
					firstmove = false;
				}
				this.sound.play('jump', {volume:0.5});
				this.player.setVelocityY(-330);
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
			this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
			// make the camera follow the player
			this.cameras.main.startFollow(this.player);
		
			//score and life text follow player
			if(this.player.x > 400 && this.player.x < 4598){
				lifeText.x = this.player.x - 390;
				scoreText.x = this.player.x - 260;
				timeText.x = this.player.x - 130;
			}
		
		}
    }
	//collision functions
	hit(player, enemy){
		if(!invincible){
			explode = this.add.image(player.x,player.y,'b00m');
			this.time.addEvent({delay: 100, callback: this.reapExplosion, callbackScope: this, loop: false});
			wasHit = true;
			this.sound.play('boom', {volume:.25});
			if(this.player.x < 100 && lives != 1){
				player.setX(60);//reset player position
			}
			else if(lives != 1){
				player.setX(player.x - 100);
			}
		
		player.setY(527);
		lives--;//decrement lives and update text
		lifeText.setText('Lives: ' + lives);
		invincible = true;
			invincibleTimer = this.time.addEvent({delay: 5000, callback: this.stopInvincible, callbackScope: this, loop: false});
		}
		else{
			//console.log(invincible);
		}
	}
	//end of timer (5 min)
	gameLost(){
			this.player.destroy();
			gameOver = true;
			this.scene.start('GameOver');
	}
	pickUp(player, item){
		this.sound.play('pickup');
		item.destroy();
		score++;
		scoreText.setText('Score: ' + score);
	}
	reapExplosion(){
		explode.destroy();
	}
	//end of invincibility
	stopInvincible(){
		console.log('not invincible');
		invincible = false;
	}
	retMain(){
		music1.stop();
		invincible = false;
		lives = 3;
		score = 0;
		firstmove = false;
		this.registry.destroy();
		this.events.off();
		this.scene.stop();
		this.scene.start('MainMenu');
	}
	nextLevel(){
		music1.stop();
		invincible = false;
		lives = 3;
		score = 0;
		firstmove = false;
		this.registry.events.off('changedata', undefined, undefined, false);
		this.registry.destroy();
		this.events.off();
		this.scene.stop();
		this.scene.start('LevelTwo');
	}
}
