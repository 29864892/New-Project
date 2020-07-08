class boot3 extends Phaser.Scene{
	constructor(){
		super('boot3');
	}
	init(){
		console.log('initialize');
		//  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.game.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            this.scale.pageAlignHorizontally = true;
			console.log('desktop');
        }
       
	}
	preload(){
		//  Here we load the assets required for our Preloader state (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'assets/menus/loading.png');
        this.load.image('preloaderBar', 'assets/menus/loadbar.png');
	}
	create(){
		console.log('boot');
		this.scene.start('Preloader3');
	}
}



