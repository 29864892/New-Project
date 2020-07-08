class Victory extends Phaser.Scene{
	constructor(){
		super({key: 'Victory',
		type: Phaser.AUTO,
		width: 800,
		height: 600,
    });
	}
	
	create(){
		console.log('Victory');
		this.add.sprite(400, 300, 'winScreen');
		
		this.quit = this.add.text(350, 250, 'Main Menu', { fontSize: '40px', fill: '#001' });
		this.quit.setInteractive();
		this.quit.on('pointerdown', () => this.retMain());
		
	}
	
	retMain(){
		
		this.scene.start('MainMenu');
	}
}