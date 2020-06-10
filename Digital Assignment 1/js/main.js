

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
	var music;//in game music
	var enemy;//enemy object
	var explode;//explosion animation
	var wasHit = false;
	
    function preload ()
    {
		this.load.image('city', 'assets/city.png');//load background
		this.load.image('ledge', 'assets/platf0rm.png');//load platform
		this.load.spritesheet('mydude', 'assets/mydude.png', { frameWidth: 32, frameHeight: 48 });//load in character sprite (sprite made by me)
		this.load.audio('music', 'assets/Six_Umbrellas_09_Longest_Summer.mp3');//https://freemusicarchive.org/music/Six_Umbrellas
		this.load.image('drone', 'assets/policedrone.png');// load enemy image (made by me)
		this.load.image('arrow', 'assets/arrow.png');//load in arrow(made by me)
		this.load.audio('boom', 'assets/Explosion.mp3');//load in explosion sound https://www.freesoundeffects.com/free-sounds/explosion-10070/
		this.load.image('b00m', 'assets/b00m.png');//https://www.pinclipart.com/pindetail/iToRRR_download-clip-art-comic-explosion-transparent-clipart-comic/
		//tilemap preload
		this.load.tilemapTiledJSON('map', 'assets/levelOne.json');
		this.load.spritesheet('tiles', 'assets/tileimage.png', {frameWidth: 50, frameHeight: 50});
    }

    function create ()
    {
		this.add.image(400,300,'city');
		/*platform = this.physics.add.staticGroup();//create group of platforms (copied from phaser tutorial)
		platform.create(50, 250, 'ledge');//start ledge
		platform.create(175, 320, 'ledge');
		platform.create(300, 400, 'ledge');
		platform.create(450, 400, 'ledge');
		platform.create(575, 310, 'ledge');
		platform.create(750, 220, 'ledge');//end ledge
		this.add.image(775, 150, 'arrow');
		*/
		
		//load map
		map = this.make.tilemap({key: 'map'});
		//ground tiles
		
		//tileset = map.addTilesetImage('tilesetNameInTiled', 'tilesetNameInPhaser');
		var groundTiles = map.addTilesetImage('tileimage','tiles');
		var cityTiles = map.addTilesetImage('tileimage', 'tiles');
		//create the background of the city
		this.cityImg = map.createDynamicLayer('City', cityTiles, 0, 0); 
		
		this.groundLayer = map.createDynamicLayer('ground', groundTiles, 0, 0);
		// the player will collide with this layer
		this.groundLayer.setCollisionByExclusion([-1]);
		
		this.physics.world.bounds.width = this.groundLayer.width;
		this.physics.world.bounds.height = this.groundLayer.height;
		
		player = this.physics.add.sprite(60, 0, 'mydude');//create player copied from phaser tutorial)
		player.setBounce(0.2);
		player.setCollideWorldBounds(true);//wont fall out of screen
		//collide with the ground
		this.physics.add.collider(this.groundLayer, player);
		//this.physics.add.collider(player, platform);//player will not fall through platforms
		
		//copied from phaser tutorial
		this.anims.create({//animation for moving left
			key: 'left',
			frames: this.anims.generateFrameNumbers('mydude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});
		//copied from phaser tutorial
		this.anims.create({//turning animation
			key: 'turn',
			frames: [ { key: 'mydude', frame: 4 } ],
			frameRate: 20
		});
		//copied from phaser tutorial
		this.anims.create({//right animation
			key: 'right',
			frames: this.anims.generateFrameNumbers('mydude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
		//copied from phaser tutorial
		cursor = this.input.keyboard.createCursorKeys();//create input check
		lifeText = this.add.text(16, 16, 'Lives: 3', { fontSize: '20px', fill: '#001' });//create text for lives left
		
		//create enemy objects
		enemy = this.physics.add.group({
        key: 'drone',
		allowGravity: false,
        repeat: 6,
        setXY: { x: 120, y: 0, stepX: 100 }
		});
		
		this.physics.add.overlap(player, enemy, hit, null, this);
	}

    function update ()
    {	//copied from phaser tutorial
		//console.log(player.y); //debug
		if(wasHit && player.y >= 227) {//remove explosion after player has respawned
			explode.destroy();//remove object
			wasHit = false;//sets to false to avoid errors
		}

		//console.log(player.x + ',' + player.y)
		if(player.y == 199 && player.x >= 768){
		
		
		
		}
		//console.log(player.x + ',' + player.y);
		if((player.y <= 199 || player.y == 207) && player.x >= 768){//207 because the character goes through the platform in the github version
			this.add.text(175, 200, 'YOU WIN!', {fontSize: '80px', fill: '#000'});//notify player
			gameOver = true;
			return;
		}
	
		/*if(player.y >= 560){//check if player has fallen off the platforms
			player.setX(60);//reset player position
			player.setY(0);
			lives--;//decrement lives and update text
			lifeText.setText('Lives: ' + lives);
		}*/
		if(lives == 0){
			gameOver = true;
			//music.stop();//stop music from playing
			lifeText.setText('GAME OVER');
			this.add.text(175, 200, 'GAME OVER', {fontSize: '80px', fill: '#000'});//print text to alert player
			player.destroy();//remove object
			return;
		}
		
		if (cursor.left.isDown)//left movement
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
		else if (cursor.right.isDown)//right movement
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
		if (cursor.up.isDown && player.body.onFloor())
		{
			if(firstmove){//implement sound compatible with chrome (input before audio)
				//music = this.sound.add('music');
				//music.play();
				firstmove = false;
			}
			player.setVelocityY(-330);
		}
		
		enemy.children.iterate(function (child) {
			if(child.y <= 25){//inital movement and movement from top
				child.setVelocityY(Phaser.Math.FloatBetween(100, 800));
			}
			if(child.y >= 560){//movement from bottom
				child.setVelocityY(Phaser.Math.FloatBetween(-100, -800));
			}
		});
		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		// make the camera follow the player
		this.cameras.main.startFollow(player);
    
		// set background color, so the sky is not black    
		//this.cameras.main.setBackgroundColor('#ccccff'); 
    }
	
	function hit(){
		explode = this.add.image(player.x,player.y,'b00m');
		wasHit = true;
		//this.destroy(player.x,player.y,'b00m');
		this.sound.play('boom');
		player.setX(60);//reset player position
		player.setY(0);
		lives--;//decrement lives and update text
		lifeText.setText('Lives: ' + lives);
	
	}

};
