class GameOver extends Phaser.Scene{
	constructor(){
		super({key: 'GameOver',
		type: Phaser.AUTO,
		width: 800,
		height: 600,
    });
	}
	
	create(){
		console.log('GameOver');
		this.add.sprite(400, 300, 'lossScreen');
		
		this.quit = this.add.text(350, 250, 'Back', { fontSize: '40px', fill: '#001' });
		this.quit.setInteractive();
		this.quit.on('pointerdown', () => this.retMain());
		
	}
	
	retMain(){
		
		this.scene.start('MainMenu');
	}
}