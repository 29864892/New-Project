
window.onload = function() {

	let config = {
		type: Phaser.WEBGL,
		width: 800,
		height: 600,
		physics:{
			arcade: {
				debug: true,
				gravity: {y:200}
			}
		},
		scene: {
			boot3: boot3,
			Preloader3: Preloader3,
			MainMenu: MainMenu,
			controls: controls,
			LevelOne: LevelOne,
			clear1: clear1,
			LevelTwo: LevelTwo,
			LevelThree: LevelThree,
			LevelFour: LevelFour,
			GameOver: GameOver,
			Victory: Victory
		}
	};
	
	let game = new Phaser.Game(config);
	
	game.scene.add('boot3', boot3);
	game.scene.add('Preloader3', Preloader3);
	game.scene.add('MainMenu', MainMenu);
	game.scene.add('controls', controls);
	game.scene.add('LevelOne', LevelOne);
	game.scene.add('clear1', clear1);
	game.scene.add('LevelTwo', LevelTwo);
	game.scene.add('LevelThree', LevelThree);
	game.scene.add('LevelFour', LevelFour);
	game.scene.add('GameOver', GameOver);
	game.scene.add('Victory', Victory);
	game.scene.start('boot3');
	
};
