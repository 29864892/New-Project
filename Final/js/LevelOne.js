//First level
BasicGame.LevelOne = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.LevelOne.prototype = {

	create: function () {

		//this.music = this.add.audio('titleMusic');
		//this.music.play();

		this.add.sprite(0, 0, 'menu');
		this.add.sprite(250,200, 'controlScreen');
		this.playButton = this.add.button( 30, 390, 'backButton', this.retMain, this);
		
		console.log('Control Screen');
	},
	
	preload: function (){
	//tilemap preload
		this.load.tilemapTiledJSON('map', 'assets/levelOne.json');
		this.load.spritesheet('tiles', 'assets/tileimage.png', {frameWidth: 50, frameHeight: 50});	
	
	},
	
	update: function(){
		
	
	}
};