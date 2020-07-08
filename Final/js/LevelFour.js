var map;
var ground;
var bg;
var cheats = false;
var gameOver4 = false;//ends game when false
var cursor4;//input
var music4;
var player4;//player4 object
var firstmove4 = true;//check for when to start sound
var lives4 = 1;//player4 lives 0 = gameOver4
var lifeText4;//text displaying lives
var scoreText4;//text for score4 (# of items picked up)
var music4;//in game music4
var enemy4;//enemy4 object
var enemy4Hp = 5;
var enemy4Hit;
var eAnimation4 = false;
var ball4;
var explode4;//explosion animation
var wasHit4 = false;
var score4 = 0;
var endLives;
var timer4;
var timeText4;
var currentTime4;
var invincible4 = false;
var invincibletimer4;
var bossbar4;
var bossFight4 = false;
var cameraSet4 = false;
var fillerZero = '';
var firetimer4;
var projectile4;
var bombs4;
var ally4;
var bullet4;
var officer4;

class LevelFour extends Phaser.Scene{
	constructor(){
		super({key: 'LevelFour',
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
		this.load.tilemapTiledJSON('map', 'assets/assets4/level4.json');
		this.load.spritesheet('tiles', 'assets/assets4/lvl4map.png', {frameWidth: 50, frameHeight: 50});
	}
	create(){
		//load map
		map = this.make.tilemap({key: 'map'});
		//ground tiles
		
		//tileset = map.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		var groundTiles = map.addTilesetImage('level4','tiles');
		var cityTiles = map.addTilesetImage('level4', 'tiles');
		//create the background of the city
		this.background = map.createDynamicLayer('Sky',cityTiles,0,0);
		this.cityImg = map.createDynamicLayer('trees', cityTiles, 0, 0); 
		//create ground 
		this.groundLayer = map.createDynamicLayer('ground', groundTiles, 0, 0);
		// the player4 will collide with this layer
		this.groundLayer.setCollisionByExclusion([-1]);
		//world bounds
		this.physics.world.bounds.width = this.groundLayer.width;
		this.physics.world.bounds.height = this.groundLayer.height;
		
		player4 = this.physics.add.sprite(60, 527, 'mydude');//create player4 copied from phaser tutorial)
		player4.setBounce(0.2);
		//player4.setCollideWorldBounds(true);//wont fall out of screen
		//collide with the ground
		this.physics.add.collider(this.groundLayer, player4);
		
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
		
		
		cursor4 = this.input.keyboard.createCursorKeys();//create input check
		lifeText4 = this.add.text(16, 16, 'Lives: 3', { fontSize: '20px', fill: '#001' });//create text for lives left
		scoreText4 = this.add.text(146, 16, 'Score: 0', { fontSize: '20px', fill: '#001' });//create text for lives left
		timeText4 = this.add.text(276, 16, 'Time: 0:00', { fontSize: '20px', fill: '#001' });//create text for timer4
		
		
		enemy4 = this.physics.add.sprite(1380,340, 'boss');
		
		this.anims.create({//right animation
			key: 'bossDmg4',
			frames: this.anims.generateFrameNumbers('bossV2Sheet', { start: 0, end: 1 }),
			frameRate: 10,
			repeat: -1
		});
		
		enemy4.body.setAllowGravity(false);
		ball4 = this.physics.add.sprite(1280,345, 'ballSprite');
		ball4.body.setAllowGravity(false);
		ball4.visible = false;
		firetimer4 = this.time.addEvent({delay: 5000, callback: this.fire, callbackScope: this, loop: true});
		firetimer4.paused = true;
		//add timer4
		timer4 = this.time.addEvent({delay: 300000, callback: this.gameLost, callbackScope: this, loop: false});
		//bossbar4 = this.add.image(707,350,'bar');
		bossbar4 = this.physics.add.staticGroup();
		
		this.physics.add.overlap(player4, bossbar4, this.hit4, null, this);
		this.physics.add.overlap(player4, enemy4, this.hit4, null, this);
		this.physics.add.overlap(player4, ball4, this.hit4, null, this);
		
		
		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		// make the camera follow the player4
		this.cameras.main.startFollow(player4);
		this.cameras.main.setFollowOffset(-300,0);
		this.cameras.main.setRenderToTexture();
		
		//boss projectile4 animations
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
		projectile4 = this.physics.add.sprite(-50, -50, 'bombsprite');
		//collide with enemy4
		this.physics.add.overlap(projectile4, enemy4, this.eHit, null, this);
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
		ally4 = this.physics.add.sprite(900, 227, 'ally');
		ally4.body.setAllowGravity(false);
		ally4.setVelocityX(50);
		ally4.setVelocityY(50);
		
		
		officer4 = this.physics.add.sprite(1300, 500, 'minion');
		bullet4 = this.physics.add.sprite(1250, 500, 'bullet');
		bullet4.body.setAllowGravity(false);
		this.physics.add.overlap(officer4, player4, this.hit4, null, this);
		this.physics.add.overlap(bullet4, player4, this.hit4, null, this);
		officer4.body.setAllowGravity(false);
		
		this.cheats = true;
		if(this.cheats){
			
			console.log('cheats enabled');
			enemy4Hp = 1;
		}
	}
	update(){
	
		//check if game over before update
		if(lives4 == 0){
			console.log('end reached');
		
				this.add.image(1065, 300, 'end');
				this.add.text(900, 200, 'Game Over', {fontSize: '40px', fill: '#000'});
				this.add.text(900, 300, 'Score ' + score4, {fontSize: '30px', fill: '#000'});
				this.add.text(900, 260, 'Time ' + Math.floor(currentTime4 / 60) + ':' + fillerZero + currentTime4 % 60, {fontSize: '30px', fill: '#000'});
			
			ball4.destroy();
			//enemy4.anims.stop('bossDmg');
			enemy4.setFrame(0);
			ally4.setVelocityY(-100);
			ally4.setVelocityX(100);
			player4.destroy();
			gameOver4 = true;
			this.nextText = this.add.text(950, 330, 'Next Level', {fontSize: '30px', fill: '#000'});
			this.nextText.setInteractive();
			this.nextText.on('pointerdown', () => this.nextLevel());
		}
		//player4 win
		if(enemy4Hp == 0 && !gameOver4){
			console.log('end reached');
			this.add.image(1120, 300, 'end');
			this.add.text(950, 200, 'Stage Cleared!', {fontSize: '40px', fill: '#000'});
			this.add.text(950, 300, 'Score: ' + score4, {fontSize: '30px', fill: '#000'});
			this.add.text(950, 260, 'Time: ' + Math.floor(currentTime4 / 60) + ':' + fillerZero + currentTime4 % 60, {fontSize: '30px', fill: '#000'});
			ball4.destroy();
			enemy4Hit.paused = true;
			enemy4.destroy();
			officer4.destroy();
			bullet4.destroy();
			player4.destroy();
			this.add.image(1400,340, 'bossF');
			gameOver4 = true;
			this.nextText = this.add.text(950, 330, 'Next Level', {fontSize: '30px', fill: '#000'});
			this.nextText.setInteractive();
			this.nextText.on('pointerdown', () => this.nextLevel());
		}
		
		if(!gameOver4){
			console.log(player4.x);
			currentTime4 = Math.floor(timer4.getElapsedSeconds());
			//console.log('time:' + currentTime4);
			if(currentTime4 % 60 <= 9){
				fillerZero = '0';
			}
			else{
				fillerZero = '';
			}
			timeText4.setText('Time: ' + Math.floor(currentTime4 / 60) + ':' + fillerZero + currentTime4 % 60);
		
		//start of battle
			if(!bossFight4 && player4.x >= 800){
				bossbar4.create(707,350,'bar');
				bossFight4 = true;
			//ally4 throws bomb 
				this.time.addEvent({delay: 6000, callback: this.allyFire, callbackScope: this, loop: true});
			}
		//stop camera from following the player4
			if(bossFight4 && !cameraSet4){
				if(player4.x >= 800){
					this.cameras.main.stopFollow(player4);
				}
				lifeText4.x = 707;
				scoreText4.x = 837;
				timeText4.x = 967;
				cameraSet4 = true;
			}
		
		//stop player4 from leaving area
			if(player4.x < 730 && bossFight4){
				player4.x = 740;
			}
		
		//show ball4 charging and prepare boss attack
			if(bossFight4 && !gameOver4){
				firetimer4.paused = false;
				ball4.visible = true;
				ball4.anims.play('1', true);
				projectile4.anims.play('1b',true);
			}
		//ball4 xy 1280,345,
			if(ball4.x < 600 || ball4.y > 600){
				ball4.setVelocityX(0);
				ball4.setVelocityY(0);
				ball4.x = 1280;
				ball4.y = 345;
			
			}
		//bullet4 xy 1250, 500
			if(bullet4.x < 600 || bullet4.y > 600){
				bullet4.setVelocityX(0);
				bullet4.setVelocityY(0);
				bullet4.x = 1250;
				bullet4.y = 500;
			
			}
			if (cursor4.left.isDown && !gameOver4)//left movement
			{
				if(firstmove4){//implement sound compatible with chrome (input before audio)
					music4 = this.sound.add('music4');
					music4.play();	
					firstmove4 = false;
				}
				firstmove4 = false;
				player4.setVelocityX(-160);

				player4.anims.play('left', true);
			}
		
			else if (cursor4.right.isDown && !gameOver4)//right movement
			{
				if(firstmove4){//implement sound compatible with chrome (input before audio)
					music4 = this.sound.add('music4');
					music4.play();
					firstmove4 = false;
				}
				player4.setVelocityX(160);

				player4.anims.play('right', true);
			}
			else
			{
				player4.anims.play('turn');
				player4.setVelocityX(0);

			}
			if (cursor4.up.isDown && player4.body.onFloor() && !gameOver4)
			{
				if(firstmove4){//implement sound compatible with chrome (input before audio)
				music4 = this.sound.add('music4');
				music4.play();
				firstmove4 = false;
				}
				this.sound.play('jump', {volume:0.5});
				player4.setVelocityY(-330);
			}
		
		
		
		//console.log(player4.x);
		//score and life text follow player4
			if(player4.x > 90 && !bossFight4){
				lifeText4.x = player4.x - 80;
				scoreText4.x = player4.x + 50;
				timeText4.x = player4.x + 180;
			}
		//if(invincible4){
			//console.log(invincible4timer4.getElapsedSeconds());
		//}
		//ally4 movement
			if(ally4.x > 1200){
				ally4.setVelocityX(-50);
			}
			else if(ally4.x < 900){
				ally4.setVelocityX(50);
			}
			else if(ally4.y < 200){
				ally4.setVelocityY(50);
			}
			else if(ally4.y > 300){
				ally4.setVelocityY(-50);
			}
		}
	}
	//collision functions
	hit4(player, bossbar){
		
		if(!invincible4){
		explode4 = this.add.image(player4.x,player4.y,'b00m');
		this.time.addEvent({delay: 100, callback: this.reapExplosion, callbackScope: this, loop: false});
		wasHit4 = true;
		this.sound.play('boom');
		if(lives4 != 1){
			player4.setX(900);//reset player4 position
		}
			
		
		player4.setY(527);
		lives4--;//decrement lives and update text
		lifeText4.setText('Lives: ' + lives4);
		invincible4 = true;
			invincibletimer4 = this.time.addEvent({delay: 5000, callback: this.stopinvincible4, callbackScope: this, loop: false});
		}
		/*else{
			console.log(invincible4);
		}*/
	}
	
	//end of timer4 (5 min)
	gameLost(){
		invincible43 = false;
		lives3 = 3;
		this.registry.destroy();
		this.events.off();
		this.scene.stop();
		this.scene.start('MainMenu');
	}
	
	reapExplosion(){
		explode4.destroy();
	}
	//end of invincibility
	stopinvincible4(){
		invincible4 = false;
	}
	//shoot enemy4 projectile4
	fire(){
		if(!gameOver4){
				var velX;
				var velY;
			console.log('xd');
			if(player4.x < 1000){
				velX = -800;
				velY = Phaser.Math.FloatBetween(90, 200);
				console.log('a');
			}
			else if(player4.x < 1200){
				velX = -600;
				velY = Phaser.Math.FloatBetween(150, 200);
				console.log('a');
			}
			else{
				velX = Phaser.Math.FloatBetween(0,100);
				velY = 400;
				console.log('b');
			}
			ball4.setVelocityX(velX);
			ball4.setVelocityY(velY);
			console.log(velX + ',' + velY);
			console.log(player4.x + '    ' + player4.y);
			bullet4.setVelocityX(-300);
			this.sound.play('laser');
		}
		
	}
	//enemy4 hit animation
	eHit(){
		projectile4.y = 1000;
		enemy4Hp--;
		console.log('bossHp: ' + enemy4Hp);
		if(!eAnimation4){
			enemy4.anims.play('bossDmg4', false);
			eAnimation4 = true;
			enemy4Hit = this.time.addEvent({delay: 600, callback: this.stopenemyFlash, callbackScope: this, loop: false});
		}
		this.sound.play('boom');
	}
	stopenemyFlash(){
		enemy4.anims.stop('bossDmg4');
		eAnimation4 = false;
	}
	allyFire(){
		//fire projectile4
		if(!gameOver4){
			projectile4.body.setGravityY(1);
			projectile4.setVelocityY(0);
			projectile4.x = ally4.x;
			projectile4.y = ally4.y;
			projectile4.setVelocityX(500);
		}
	}
	//tranition to end scene
	nextLevel(){
		
		gameOver4 = false;
		invincible4 = false;
		endLives = lives4;
		lives4 = 3;
		console.log(endLives);
		bossFight4 = false;
		cameraSet4 = false;
		music4.stop();
		firstmove4 = true;
		this.registry.events.off('changedata', undefined, undefined, false);
		this.registry.destroy();
		this.events.off();
		this.scene.stop();
		if(endLives > 0){
			this.scene.start('Victory');
		}
		else{
			this.scene.start('MainMenu');
		}
	}
}