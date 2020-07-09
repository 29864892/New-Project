	var map2;
	var ground2;
	var bg2;
	var cheats = true;
	var gameOver2 = false;//ends game when false
	var cursor2;//input
	var platform2;//objects for player to jump on
	var player2;//player object
	var firstmove2 = true;//check for when to start sound
	var lives2 = 3;//player lives 0 = gameover
	var lifeText2;//text displaying lives
	var scoreText2;//text for score (# of items picked up)
	var music2;//in game music
	var enemy2;//enemy object
	var enemyHp2 = 5;
	var enemyHit2;
	var eAnimation2 = false;
	var ball2;
	var explode2;//explosion animation
	var wasHit2 = false;
	var score2 = 0;
	var item2;
	var timer2;
	var timeText2;
	var currentTime;
	var invincible2 = false;
	var invincibleTimer2;
	var bossBar2;
	var bossFight2 = false;
	var cameraSet2 = false;
	var fillerZero = '';
	var fireTimer2;
	var projectile2;
	var bombs2;
	var ally2;
	
class LevelTwo extends Phaser.Scene{
	constructor(){
		super({key: 'LevelTwo',
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
		this.load.tilemapTiledJSON('map2', 'assets/assets2/levelTwo.json');
		this.load.spritesheet('level4', 'assets/assets2/levelTwo.png', {frameWidth: 50, frameHeight: 50});
	}
	create(){
		//load map
		map2 = this.make.tilemap({key: 'map2'});
		//ground tiles
		
		//tileset = map.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		var groundTiles2 = map2.addTilesetImage('levelTwo','level4');
		var cityTiles2 = map2.addTilesetImage('levelTwo', 'level4');
		//create the background of the city
		this.cityImg = map2.createDynamicLayer('Tile Layer 1', cityTiles2, 0, 0); 
		//create ground 
		this.groundLayer2 = map2.createDynamicLayer('ground', groundTiles2, 0, 0);
		// the player will collide with this layer
		this.groundLayer2.setCollisionByExclusion([-1]);
		//world bounds
		this.physics.world.bounds.width = this.groundLayer2.width;
		this.physics.world.bounds.height = this.groundLayer2.height;
		
		player2 = this.physics.add.sprite(60, 527, 'mydude');//create player copied from phaser tutorial)
		player2.setBounce(0.2);
		player2.setCollideWorldBounds(true);//wont fall out of screen
		//collide with the ground
		this.physics.add.collider(this.groundLayer2, player2);
		
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
		cursor2 = this.input.keyboard.createCursorKeys();//create input check
		lifeText2 = this.add.text(16, 16, 'Lives: 3', { fontSize: '20px', fill: '#001' });//create text for lives left
		scoreText2 = this.add.text(146, 16, 'Score: 0', { fontSize: '20px', fill: '#001' });//create text for lives left
		timeText2 = this.add.text(276, 16, 'Time: 0:00', { fontSize: '20px', fill: '#001' });//create text for timer
		
		
		enemy2 = this.physics.add.sprite(1400,400, 'boss1');
		
		this.anims.create({//right animation
			key: 'bossDmg',
			frames: this.anims.generateFrameNumbers('bossSheet1', { start: 0, end: 1 }),
			frameRate: 10,
			repeat: -1
		});
		
		enemy2.body.setAllowGravity(false);
		ball2 = this.physics.add.sprite(1300,440, 'ballSprite');
		ball2.body.setAllowGravity(false);
		ball2.visible = false;
		fireTimer2 = this.time.addEvent({delay: 5000, callback: this.fire, callbackScope: this, loop: true});
		fireTimer2.paused = true;
		//add timer
		timer2 = this.time.addEvent({delay: 300000, callback: this.retMain, callbackScope: this, loop: false});
		//bossBar = this.add.image(707,350,'bar');
		bossBar2 = this.physics.add.staticGroup();
		
		this.physics.add.overlap(player2, bossBar2, this.hit, null, this);
		this.physics.add.overlap(player2, enemy2, this.hit, null, this);
		this.physics.add.overlap(player2, ball2, this.hit, null, this);
		
		
		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels);
		// make the camera follow the player
		this.cameras.main.startFollow(player2);
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
		projectile2 = this.physics.add.sprite(-50, -50, 'bombSprite');
		//collide with enemy
		this.physics.add.overlap(projectile2, enemy2, this.eHit, null, this);
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
		ally2 = this.physics.add.sprite(900, 227, 'ally');
		ally2.body.setAllowGravity(false);
		ally2.setVelocityX(50);
		ally2.setVelocityY(50);
		
		/*this.cheats = true;
		if(this.cheats){
			console.log('cheats enabled');
			enemyHp2 = 1;
		}*/
	}
	
	update()
    {	
		//player loss
		if(lives2 == 0){
		
			this.add.image(1065, 300, 'end');
			this.add.text(900, 200, 'Game Over', {fontSize: '40px', fill: '#000'});
			this.add.text(900, 300, 'Score ' + score2, {fontSize: '30px', fill: '#000'});
			this.add.text(900, 260, 'Time ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60, {fontSize: '30px', fill: '#000'});
			
			this.menuText2 = this.add.text(900, 360, 'Menu', {fontSize: '30px', fill: '#000'});
			this.menuText2.setInteractive();
			this.menuText2.on('pointerdown', () => this.retMain());
				
			ball2.destroy();
			enemy2.anims.stop('bossDmg');
			enemy2.setFrame(0);
			ally2.setVelocityY(-100);
			ally2.setVelocityX(100);
			player2.destroy();
			gameOver2 = true;
		}
		
		//player win
		if(enemyHp2 == 0 && !gameOver2){
			console.log('end reached');
			this.add.image(1120, 300, 'end');
			this.add.text(950, 200, 'Stage Cleared!', {fontSize: '40px', fill: '#000'});
			this.add.text(950, 300, 'Score: ' + score2, {fontSize: '30px', fill: '#000'});
			this.add.text(950, 260, 'Time: ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60, {fontSize: '30px', fill: '#000'});
			
			this.cont = this.add.text(950, 330, 'Next Level',  {fontSize: '30px', fill: '#000'});
			this.cont.setInteractive();
			this.cont.on('pointerdown', () => this.nextLevel());
			
			this.menuText2 = this.add.text(950, 360, 'Quit', {fontSize: '30px', fill: '#000'});
			this.menuText2.setInteractive();
			this.menuText2.on('pointerdown', () => this.retMain());
				
			ball2.destroy();
			enemyHit2.paused = true;
			enemy2.destroy();
			ally2.destroy();
			player2.destroy();
			this.add.image(1400,400, 'boss1F');
			gameOver2 = true;
		}
		
		//game information
		if(!gameOver2){
		//time
			currentTime = Math.floor(timer2.getElapsedSeconds());
			//console.log('time:' + currentTime);
			if(currentTime % 60 <= 9){
				fillerZero = '0';
			}
			else{
				fillerZero = '';
			}
			timeText2.setText('Time: ' + Math.floor(currentTime / 60) + ':' + fillerZero + currentTime % 60);
		
		//start of battle
		if(!bossFight2 && player2.x >= 800){
			bossBar2.create(707,350,'bar');
			bossFight2 = true;
			//ally throws bomb 
			this.time.addEvent({delay: 6000, callback: this.allyFire, callbackScope: this, loop: true});
		}
		//stop camera from following the player
		if(bossFight2 && !cameraSet2){
			if(player2.x >= 800){
				this.cameras.main.stopFollow(player2);
			}
			lifeText2.x = 707;
			scoreText2.x = 837;
			timeText2.x = 967;
			cameraSet2 = true;
		}
		
		//stop player from leaving area
		if(player2.x < 730 && bossFight2){
			player2.x = 740;
		}
		
		//show ball charging and prepare boss attack
		if(bossFight2 && !gameOver2){
			fireTimer2.paused = false;
			ball2.visible = true;
			ball2.anims.play('1', true);
			projectile2.anims.play('1b',true);
		}
		if(ball2.x < 600 || ball2.y > 600){
			ball2.setVelocityX(0);
			ball2.setVelocityY(0);
			ball2.x = 1300;
			ball2.y = 430;
			
		}
		if (cursor2.left.isDown && !gameOver2)//left movement
		{
			if(firstmove2){//implement sound compatible with chrome (input before audio)
				music2 = this.sound.add('music');
				music2.play();	
				firstmove2 = false;
			}
			firstmove2 = false;
			player2.setVelocityX(-160);

			player2.anims.play('left', true);
		}
		
		else if (cursor2.right.isDown && !gameOver2)//right movement
		{
			if(firstmove2){//implement sound compatible with chrome (input before audio)
				music2 = this.sound.add('music');
				music2.play();
				firstmove2 = false;
			}
			player2.setVelocityX(160);

			player2.anims.play('right', true);
		}
		else
		{
			player2.anims.play('turn');
			player2.setVelocityX(0);

		}
		if (cursor2.up.isDown && player2.body.onFloor() && !gameOver2)
		{
			if(firstmove2){//implement sound compatible with chrome (input before audio)
				music2 = this.sound.add('music');
				music2.play();
				firstmove2 = false;
			}
			this.sound.play('jump', {volume:0.5});
			player2.setVelocityY(-330);
		}
		
		//score and life text follow player
		if(player2.x > 90 && !bossFight2){
			lifeText2.x = player2.x - 80;
			scoreText2.x = player2.x + 50;
			timeText2.x = player2.x + 180;
		}
		//if(invincible){
			//console.log(invincibleTimer.getElapsedSeconds());
		//}
		//ally movement
		if(ally2.x > 1200){
			ally2.setVelocityX(-50);
		}
		else if(ally2.x < 900){
			ally2.setVelocityX(50);
		}
		else if(ally2.y < 200){
			ally2.setVelocityY(50);
		}
		else if(ally2.y > 300){
			ally2.setVelocityY(-50);
		}
		}
    }
	
	
	//collision functions
	hit(){
		
		if(!invincible2){
		explode2 = this.add.image(player2.x,player2.y,'b00m');
		this.time.addEvent({delay: 100, callback: this.reapExplosion, callbackScope: this, loop: false});
		wasHit2 = true;
		this.sound.play('boom');
		if(lives2 != 1){
			player2.setX(800);//reset player position
		}
			
		
		player2.setY(527);
		lives2--;//decrement lives and update text
		lifeText2.setText('Lives: ' + lives2);
		invincible2 = true;
			invincibleTimer2 = this.time.addEvent({delay: 5000, callback: this.stopInvincible, callbackScope: this, loop: false});
		}
		
	}
	
	reapExplosion(){
		explode2.destroy();
	}
	//end of invincibility
	
	stopInvincible(){
		console.log('not invincible');
		invincible2 = false;
	}
	
	fire(){
		if(!gameOver2){
				var velX;
				var velY;
			console.log('xd');
			if(player2.x < 1000){
				velX = -800;
				velY = Phaser.Math.FloatBetween(90, 200);
				console.log('a');
			}
			else if(player2.x < 1200){
				velX = -600;
				velY = Phaser.Math.FloatBetween(150, 200);
				console.log('a');
			}
			else{
				velX = Phaser.Math.FloatBetween(0,100);
				velY = 400;
				console.log('b');
			}
			this.sound.play('laser');
			ball2.setVelocityX(velX);
			ball2.setVelocityY(velY);
			
			
		}
		
	}
	
	eHit(){
		projectile2.y = 1000;
		enemyHp2--;
		console.log('bossHp: ' + enemyHp2);
		if(!eAnimation2){
			enemy2.anims.play('bossDmg', false);
			eAnimation2 = true;
			enemyHit2 = this.time.addEvent({delay: 600, callback: this.stopEnemyFlash, callbackScope: this, loop: false});
		}
		this.sound.play('boom');
	}
	
	stopEnemyFlash(){
		enemy2.anims.stop('bossDmg');
		eAnimation2 = false;
	}
	
	allyFire(){
		//fire projectile
		if(!gameOver2){
			projectile2.body.setGravityY(1);
			projectile2.setVelocityY(0);
			projectile2.x = ally2.x;
			projectile2.y = ally2.y;
			projectile2.setVelocityX(500);
		}
	}
	retMain(){
		this.reset();
		this.scene.stop();
		this.scene.start('MainMenu');
	}
	nextLevel(){
		this.reset();
		this.scene.stop();
		this.scene.start('LevelThree');
	}
	reset(){
		enemyHit2 = false;
		eAnimation2 = false
		invincible2 = false;
		lives2 = 3;
		enemyHp2 = 5;
		gameOver2 = false;
		bossFight2 = false;
		cameraSet2 = false;
		firstmove2 = true;
		music2.stop();
		this.registry.destroy();
		this.registry.events.off('changedata', undefined, undefined, false);
	}
}