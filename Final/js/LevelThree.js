	var map3;
	var ground3;
	var bg3;
	var cheats = true;
	var gameOver3 = false;//ends game when false
	var cursor3;//input
	var platform3;//objects for player3 to jump on
	var player3;//player3 object
	var firstmove3 = true;//check for when to start sound
	var lives3 = 3;//player3 lives3 0 = gameOver3
	var lifeText3;//text displaying lives3
	var scoreText3;//text for score3 (# of item3s picked up)
	var music3;//in game music3
	var enemy3;//enemy3 object
	var enemy3Group;//group of enemies
	var left = true;
	var right = false;
	var explode3;//explosion animation
	var wasHit3 = false;
	var hiding = false;
	var score3 = 0;
	var item3;
	var timer3;
	var timeText3;
	var currentTime3;
	var invincible3 = false;
	var invincible3timer3;
	
	
	var cameraSet = false;
	var fillerZero = '';

class LevelThree extends Phaser.Scene{
	constructor(){
		super({key: 'LevelThree',
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
		this.load.tilemapTiledJSON('map3', 'assets/assets3/level3.json');
		this.load.spritesheet('tiles3', 'assets/assets3/lvl3final.png', {frameWidth: 50, frameHeight: 50});
	}
	create(){
		
		
		//load map
		map3 = this.make.tilemap({key: 'map3'});
		//ground tiles
		
		//tileset = map.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		var groundTiles = map3.addTilesetImage('levelThree','tiles3');
		var forestTiles = map3.addTilesetImage('levelThree', 'tiles3');
		var bushTiles = map3.addTilesetImage('levelThree','tiles3');
		//create the background of level3
		this.forestImg = map3.createDynamicLayer('background', forestTiles, 0, 0); 
		this.Sky = map3.createDynamicLayer('Sky',forestTiles,0,0);
		//create ground 
		this.ground3Layer = map3.createDynamicLayer('Ground', groundTiles, 0, 0);
		// the player will collide with this layer
		this.ground3Layer.setCollisionByExclusion([-1]);
		//world bounds
		this.physics.world.bounds.width = this.ground3Layer.width;
		this.physics.world.bounds.height = this.ground3Layer.height;
		
		player3 = this.physics.add.sprite(60, 527, 'mydude');//create player copied from phaser tutorial)
		player3.setBounce(0.2);
		player3.setCollideWorldBounds(true);//wont fall out of screen
		//collide with the ground
		this.physics.add.collider(this.ground3Layer, player3);
		//create bushes to hide player
		this.bushLayer = map3.createDynamicLayer('bushes',bushTiles, 0, 0);
		
		
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
		cursor3 = this.input.keyboard.createCursorKeys();//create input check
		lifeText3 = this.add.text(16, 16, 'Lives: 3', { fontSize: '20px', fill: '#001' });//create text for lives left
		scoreText3 = this.add.text(146, 16, 'Score: 0', { fontSize: '20px', fill: '#001' });//create text for lives left
		timeText3 = this.add.text(276, 16, 'Time: 0:00', { fontSize: '20px', fill: '#001' });//create text for timer
		
		
		enemy3 = this.physics.add.sprite(400,527, 'officer');
		enemy3.setFrame(4);
		enemy3.setCollideWorldBounds(true);
		this.physics.add.collider(this.ground3Layer, enemy3);
		enemy3.setVelocityX(-100);
		 
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
		
		enemy3Group = this.physics.add.group({
        key: 'officer',
		allowGravity: false,
        repeat: 3,
        setXY: { x: 1200, y: 527, stepX: 1000 }
		});
		this.physics.add.overlap(player3, enemy3Group, this.hit, null, this);
		this.physics.add.collider(enemy3Group, enemy3Group, this.gturn, null, this);
		
		enemy3Group.children.iterate(function (child) {
				child.setVelocityX(-100);
		});
		//add timer
		timer3 = this.time.addEvent({delay: 600000, callback: this.gameLost, callbackScope: this, loop: false});
		
		this.physics.add.overlap(player3, enemy3, hit, null, this);
		
		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, map3.widthInPixels, map3.heightInPixels);
		// make the camera follow the player
		this.cameras.main.startFollow(player3);
		//this.physics.add.overlap(player, this.bushLayer, hidden, null, this);
		this.cameras.main.setRenderToTexture();
		/*
		this.cheats = true;
		if(this.cheats){
			console.log('cheats enabled');
			player3.x = 4800;
		}*/
	}
	update(){
		
		//player3 loss
		if(lives3 == 0 && !gameOver3){
			console.log('end reached');
			if(player3.x < 400){
				this.add.image(400, 300, 'end');
				this.add.text(300, 200, 'Game Over', {fontSize: '40px', fill: '#000'});
				this.add.text(300, 300, 'score ' + score3, {fontSize: '30px', fill: '#000'});
				this.add.text(300, 260, 'Time ' +  currentTime3, {fontSize: '30px', fill: '#000'});
			}
			else{
				this.add.image(player3.x, 300, 'end');
				this.add.text(player3.x-100, 200, 'Game Over', {fontSize: '40px', fill: '#000'});
				this.add.text(player3.x-80, 300, 'score ' + score3, {fontSize: '30px', fill: '#000'});
				this.add.text(player3.x-80, 260, 'Time ' +  currentTime3, {fontSize: '30px', fill: '#000'});
			}
			player3.destroy();
			
			
			this.menuText = this.add.text(4535, 360, 'Menu', {fontSize: '30px', fill: '#000'});
			this.menuText.setInteractive();
			this.menuText.on('pointerdown', () => this.retMain());
			gameOver3 = true;
		}
		//player3.x = 4901;
		//player3 win (reach end of level);
		if(player3.x > 4900 && !gameOver3){
			console.log('end reached');
			this.add.image(4600, 300, 'end');
			this.add.text(4435, 200, 'Stage Cleared!', {fontSize: '40px', fill: '#000'});
			this.add.text(4435, 300, 'score: ' + score3, {fontSize: '30px', fill: '#000'});
			this.add.text(4435, 260, 'Time: ' + Math.floor(currentTime3 / 60) + ':' + fillerZero + currentTime3 % 60, {fontSize: '30px', fill: '#000'});
			gameOver3 = true;
			this.nextText = this.add.text(4535, 330, 'Next Level', {fontSize: '30px', fill: '#000'});
			this.nextText.setInteractive();
			this.nextText.on('pointerdown', () => this.nextLevel());
			
			this.menuText = this.add.text(4535, 360, 'Menu', {fontSize: '30px', fill: '#000'});
			this.menuText.setInteractive();
			this.menuText.on('pointerdown', () => this.retMain());
			player3.destroy();
			gameOver3 = true;
		}
		
		if(!gameOver3){
		
		//player3 hidden check
		if((player3.x > 0 && player3.x < 358) || (player3.x > 1217 && player3.x < 1900) || (player3.x > 2257 && player3.x < 2600) || (player3.x > 3305 && player3.x < 3643)){
			hiding = true;
		}
		else{
			hiding = false;
		}
		
		//console.log(player3.x);
		
		//enemy3 animations
		if(!enemy3.anims.isPlaying){
			if(enemy3.body.velocity.x > 0){
				enemy3.anims.play('eRight');
				//console.log('right');
			}
			else if(enemy3.body.velocity.x < 0){
				enemy3.anims.play('eLeft');
				//console.log('left');
			}
			else{
				enemy3.anims.play('eTurn');
			}
		}
		//enemy3 movement
		if(enemy3.x > 500 && !left){
			enemy3.anims.stop;
			enemy3.anims.play('eTurn');
			enemy3.setVelocityX(-100);
			left = true;
			right = false;
		}
		
		if(enemy3.x < 20 && !right){
			enemy3.anims.stop;
			enemy3.anims.play('eTurn');
			enemy3.setVelocityX(100);
			right = true;
			left = false;
		}
		
		//enemy3Group animations and movement
		enemy3Group.children.iterate(function (child) {
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
			//player3 detected nearby
			if((player3.x - child.x <= 50 && player3.x -child.x >= -50) && !hiding){
				//midair
				if(player3.y > 520){
					child.anims.play('eTurn');
					if(player3.x > child.x){ 
						child.setVelocityX(200);
					}
					else{
						child.setVelocityX(-200);
					}
				}//ground3
				else{
					if(player3.x > child.x){
						child.setVelocityX(200);
					}
					else{
						child.setVelocityX(-200);
					}
				}
				
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
		//console.log(enemy3.body.velocity.x);
		
		if(!gameOver3){
			currentTime3 = Math.floor(timer3.getElapsedSeconds());
			
			if(currentTime3 % 60 <= 9){
				fillerZero = '0';
			}
			else{
				fillerZero = '';
			}
			timeText3.setText('Time: ' + Math.floor(currentTime3 / 60) + ':' + fillerZero + currentTime3 % 60);
		}
		
		
		
		
		if (cursor3.left.isDown && !gameOver3)//left movement
		{
			if(firstmove3){//implement sound compatible with chrome (input before audio)
				music3 = this.sound.add('music3', {volume: .5, loop: true});
				music3.play();	
				firstmove3 = false;
			}
			firstmove3 = false;
			player3.setVelocityX(-160);

			player3.anims.play('left', true);
		}
		
		else if (cursor3.right.isDown && !gameOver3)//right movement
		{
			if(firstmove3){//implement sound compatible with chrome (input before audio)
				music3 = this.sound.add('music3', {volume: .5, loop: true});
				music3.play();
				firstmove3 = false;
			}
			player3.setVelocityX(160);

			player3.anims.play('right', true);
		}
		else
		{
			player3.anims.play('turn');
			player3.setVelocityX(0);

		}
		if (cursor3.up.isDown && player3.body.onFloor() && !gameOver3 && !hiding)
		{
			if(firstmove3){//implement sound compatible with chrome (input before audio)
				music3 = this.sound.add('music3', {volume: .5, loop: true});
				music3.play();
				firstmove3 = false;
			}
			this.sound.play('jump', {volume:0.5});
			player3.setVelocityY(-330);
		}
		
		
		
		//console.log(player3.x);
		//score3 and life text follow player3
		if(player3.x > 400 && player3.x < 4600){
			lifeText3.x = player3.x - 390;
			scoreText3.x = player3.x - 260;
			timeText3.x = player3.x - 130;
		}
		//if(invincible3){
			//console.log(invincible3timer3.getElapsedSeconds());
		//}
		//ally movement
		//console.log(hiding);
		}
	}
	
	//collision functions
	hit(){
		
		if(!invincible3 && !hiding){
		explode = this.add.image(player3.x,player3.y,'b00m');
		this.time.addEvent({delay: 100, callback: this.reapExplosion, callbackScope: this, loop: false});
		wasHit3 = true;
		this.sound.play('boom');
		if(lives3 != 1){
			player3.setX(318);//reset player3 position
		}
			
		
		player3.setY(527);
		lives3--;//decrement lives3 and update text
		lifeText3.setText('lives3: ' + lives3);
		invincible3 = true;
			invincible3timer3 = this.time.addEvent({delay: 5000, callback: this.stopinvincible3, callbackScope: this, loop: false});
		}
		else{
			if(invincible3)
			console.log(invincible3);
			//else
				//console.log('hidden');
		}
	}
	
	//end of timer3 (10 min)
	gameLost(){
			retMain
	}
	
	
	reapExplosion(){
		explode.destroy();
	}
	//end of invincibility
	stopinvincible3(){
		console.log('not invincible3');
		invincible3 = false;
	}
	
	gturn(enemy3Group1, enemy3Group2){
		
		//turn after collision
		if(enemy3Group1.x < enemy3Group2.x){
			enemy3Group1.anims.play('eTurn');
			enemy3Group1.setVelocityX(-100);
			enemy3Group1.anims.play('eLeft');
		}
		else{
			enemy3Group1.anims.play('eTurn');
			enemy3Group1.setVelocityX(100);
			enemy3Group1.anims.play('eRight');
		}
		if(enemy3Group2.x < enemy3Group1.x){
			enemy3Group2.anims.play('eTurn');
			enemy3Group2.setVelocityX(-100);
			enemy3Group2.anims.play('eLeft');
		}
		else{
			enemy3Group2.anims.play('eTurn');
			enemy3Group2.setVelocityX(100);
			enemy3Group2.anims.play('eRight');
		}
	}
	
	retMain(){
		invincible3 = false;
		lives3 = 3;
		hiding = false;
		gameOver3 = false;
		firstmove3 = true;
		music3.stop();
		left = true;
		right = false;
		this.registry.events.off('changedata', undefined, undefined, false);
		this.registry.destroy();
		this.events.off();
		this.scene.stop();
		this.scene.start('MainMenu');
	}
	
	nextLevel(){
		invincible3 = false;
		lives3 = 3;
		hiding = false;
		gameOver3 = false;
		firstmove3 = true;
		music3.stop();
		
		this.registry.events.off('changedata', undefined, undefined, false);
		this.registry.destroy();
		this.events.off();
		this.scene.stop();
		this.scene.start('LevelFour');
	}
}