BasicGame.Controls = function (game) {

	
};

BasicGame.Controls.prototype = {

	create: function () {

		this.add.sprite(0, 0, 'menu');
		this.add.sprite(250,200, 'controlScreen');
		this.playButton = this.add.button( 30, 390, 'backButton', this.retMain, this);
		
		console.log('Control Screen');
	},
	
	retMain: function (pointer){
		console.log('return to state');
		this.state.start('MainMenu');
	}
};