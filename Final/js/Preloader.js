"use strict";

BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the Assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(0, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the Assets our game needs.
		//Main menu assets
			this.load.image('menu', 'assets/menu.png');
			this.load.image('playButton', 'assets/play.png');
		//Level 4 assets
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
			
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;
		
	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
