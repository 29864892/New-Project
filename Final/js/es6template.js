class es6template extends Phaser.Scene{
	constructor(){
		super({key: 'es6template',
		type: Phaser.AUTO,
		width: 800,
		height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 600 },
				debug: false
            }
        }
    });
	}
	preload(){
		
	}
	create(){
		this.method1();
		this.method2();
	}
	update(){
	
	}
	method1(){
		console.log('method 1');
	}
	method2(){
		console.log('method 2');
	}
}