
var menuMusic;
var added = false;
var started = false;

class MainMenu extends Phaser.Scene{
	
	constructor(){
		super({key: 'MainMenu',
		type: Phaser.AUTO,
		width: 800,
		height: 600,
    });
	}
	create(){
		if(!added){
			menuMusic = this.sound.add('titleMusic',{volume:0.5, loop:true});
			added = true;
		}
		this.clickSound = this.sound.add('click');
		if(!menuMusic.isPlaying){
			menuMusic.play();
		}
		menuMusic.setVolume(.35);
		this.add.image(400, 300, 'menu');
		//make a button
		this.playButton = this.add.image(400, 300, 'playButton');
		this.playButton.setInteractive();
		this.playButton.on('pointerdown', () => this.startGame());
		
		this.controlButton = this.add.image(400, 230, 'controlButton');
		this.controlButton.setInteractive();
		this.controlButton.on('pointerdown', () => this.controls());
		//used for testing other scenes
		/*
		this.testButton = this.add.image(200, 300, 'drone');
		this.testButton.setInteractive();
		this.testButton.on('pointerdown', () => this.sceneTest());
		//*/
	}
	startGame(){
		if(menuMusic.isPlaying){
			menuMusic.stop();
		}
		this.clickSound.play();
		if(started){
			this.scene.restart('LevelOne');
		}
		started = true;
		this.registry.events.off('changedata', undefined, undefined, false);
		this.registry.destroy();
		this.events.off();
		this.scene.start('LevelOne');
	}
	controls(){
		this.clickSound.play();
		this.scene.start('Controls');
	}
	/*
	sceneTest(){
		if(menuMusic.isPlaying){
			menuMusic.stop();
		}
		this.scene.start('Victory');
	}*/
}