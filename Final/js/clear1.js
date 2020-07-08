//initially created as transition scene but not needed
class clear1 extends Phaser.Scene{
	constructor(){
		super({key: 'clear1',
		type: Phaser.AUTO,
		width: 800,
		height: 600,
    });
	}
	
	create(){
		this.add.sprite(400, 300, 'clearScreen');
		
		this.next = this.add.text(300, 240, 'Next Level', { fontSize: '40px', fill: '#001' });
		this.next.setInteractive();
		this.next.on('pointerdown', () => this.nextLevel());
		
		this.quit = this.add.text(350, 300, 'Quit', { fontSize: '40px', fill: '#001' });
		this.quit.setInteractive();
		this.quit.on('pointerdown', () => this.retMain());
		
	}
	nextLevel(){
		this.scene.start('LevelTwo');
	}
	retMain(){
		console.log('control state');
		this.scene.start('MainMenu');
	}
}