var winMusic;
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
		winMusic = this.sound.add('victory',{volume:0.5, loop:true});
		winMusic.play();
		this.quit = this.add.text(300, 300, 'Main Menu', { fontSize: '40px', fill: '#001' });
		this.quit.setInteractive();
		this.quit.on('pointerdown', () => this.retMain());
		
	}
	
	retMain(){
		winMusic.stop();
		this.scene.start('MainMenu');
	}
}