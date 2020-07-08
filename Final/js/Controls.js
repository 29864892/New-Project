//Menu screen to display controls
class Controls extends Phaser.Scene{
	constructor(){
		super({key: 'Controls',
		type: Phaser.AUTO,
		width: 800,
		height: 600,
        
    });
	}
	create(){
		this.add.sprite(400, 300, 'menu');
		this.add.sprite(400,300, 'controlScreen');
		this.controlButton = this.add.image(100, 420, 'backButton');
		this.controlButton.setInteractive();
		this.controlButton.on('pointerdown', () => this.retMain());
	}
	retMain(){
		this.scene.start('MainMenu');
	}
}