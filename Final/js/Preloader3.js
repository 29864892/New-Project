class Preloader3 extends Phaser.Scene{
	constructor(config){
		super(config);
	}
	preload(){
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(400, 300, 'preloaderBackground');
		
		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		

		//	Here we load the rest of the Assets our game needs.
		//Main menu assets
			this.load.image('menu', 'assets/menus/menu.png');
			this.load.image('playButton', 'assets/menus/play.png');
			this.load.image('controlButton', 'assets/menus/controls.png');
			this.load.image('backButton', 'assets/menus/back.png');
			this.load.image('controlScreen', 'assets/menus/controlScreen.png');
			this.load.image('clearScreen', 'assets/menus/clear.png');
			this.load.image('lossScreen', 'assets/menus/gameOver.png');
			this.load.image('winScreen', 'assets/menus/Victory.png');
			this.load.audio('titleMusic', 'assets/menus/Electronic Fantasy.ogg');//https://patrickdearteaga.com/arcade-music/
			this.load.audio('victory', 'assets/menus/Scott_Holmes_-_04_-_Upbeat_Party.mp3');//https://freemusicarchive.org/music/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_Upbeat_Party
			this.load.audio('click', 'assets/menus/mouse-click-clicking-single-click-2-www.FesliyanStudios.com.mp3');//https://www.fesliyanstudios.com/sound-effects-search.php?q=single+mouse+click
		//Level 4 assets
			this.load.audio('music4', 'assets/assets4/2020-06-01_-_The_Last_Time_-_www.FesliyanStudios.com_Steve_Oxen.mp3');
			this.load.image('end', 'assets/assets4/endScreen.png');
			this.load.spritesheet('mydude', 'assets/assets4/mydude.png', { frameWidth: 32, frameHeight: 48 });//load in character sprite (sprite made by me)
			//projectiles
			this.load.spritesheet('ballSprite', 'assets/assets4/ballSheet.png', { frameWidth: 50, frameHeight: 50 });//ball sprite
			this.load.spritesheet('bombSprite', 'assets/assets4/bombsheet.png', { frameWidth: 30, frameHeight: 30 });//ally projectiles
			//audio
			this.load.audio('music', 'assets/assets4/Six_Umbrellas_09_Longest_Summer.mp3');//https://freemusicarchive.org/music/Six_Umbrellas
			this.load.audio('boom', 'assets/assets4/Explosion.mp3');//load in explosion sound https://www.freesoundeffects.com/free-sounds/explosion-10070/
			this.load.image('b00m', 'assets/assets4/b00m.png');//https://www.pinclipart.com/pindetail/iToRRR_download-clip-art-comic-explosion-transparent-clipart-comic/
			//boss assets
			this.load.image('boss', 'assets/assets4/bossV2.png');// load enemy image (made by me)
			this.load.spritesheet('bossV2Sheet','assets/assets4/bossV2sheet.png', {frameWidth: 234, frameHeight: 427});//boss animation image
			this.load.image('bossF','assets/assets4/bossV2f.png');
			this.load.image('minion', 'assets/assets4/officerV2.png');
			this.load.image('bullet', 'assets/assets4/eBullet1.png');
			this.load.image('ball','assets/assets4/energy ball.png');
			this.load.image('bar','assets/assets4/encounterBar.png');
			this.load.image('ally', 'assets/assets4/random.png');
		
		//Level 3 assets
			this.load.spritesheet('officer','assets/assets3/officer.png',{ frameWidth: 33, frameHeight: 48 });//lvl3 enemies
			this.load.audio('music3', 'assets/assets3/2019-05-09_-_Escape_Chase_-_David_Fesliyan.mp3'); //https://www.fesliyanstudios.com/royalty-free-music/download/escape-chase/340
		//Level 2 assets
		
			//boss assets
			this.load.audio('laser','assets/assets2/laser6.wav');//http://www.cartoonopolis.com/wp-content/uploads/laser6.wav
			this.load.image('boss1', 'assets/assets2/boss.png');// load enemy image (made by me)
			this.load.spritesheet('bossSheet1','assets/assets2/bossSheet.png', {frameWidth: 200, frameHeight: 300});//boss animation image
			this.load.image('boss1F','assets/assets2/bossF.png');
			
	
		//Level 1 assets
			this.load.audio('jump', 'assets/assets1/262893__kwahmah-02__videogame-jump.wav');// https://freesound.org/people/kwahmah_02/sounds/262893/
			this.load.audio('pickup', 'assets/assets1/133280__leszek-szary__game-pick-up-object.wav');//https://freesound.org/people/unfa/sounds/245645/
			this.load.audio('music1', 'assets/assets1/Ketsa_-_12_-_Green_Man.mp3');//https://freemusicarchive.org/music/Ketsa/Raising_Frequecy/Green_Man
			this.load.image('drone', 'assets/assets1/policedrone.png');// load enemy image (made by me)
			this.load.image('arrow', 'assets/assets1/arrow.png');//load in arrow(made by me)
			this.load.image('item','assets/assets1/item.png');
	}
	create(){
		console.log('Preloader done');
		this.scene.start('MainMenu');
	}
}