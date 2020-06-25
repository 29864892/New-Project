"use strict";

BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		//this.music = this.add.audio('titleMusic');
		//this.music.play();

		this.add.sprite(0, 0, 'menu');
		this.playButton = this.add.button( 300, 290, 'playButton', this.startGame, this);
		this.controlsButton = this.add.button (270, 200, 'controlButton', this.controlState, this);
		console.log('Main menu');
	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();
		console.log('lvl 1 start');
		//	And start the actual game
		this.state.start('LevelOne');
	

	},
	
	controlState: function (pointer){
		console.log('control state');
		this.state.start('Controls');
	}
};
