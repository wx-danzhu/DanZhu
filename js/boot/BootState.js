import Phaser from '../libs/phaser-wx.js';

export default class PreloadState extends Phaser.State {

	constructor(game) {
		super();
		this.game = game;
	}

	preload() {
		this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    console.log('scale: ', this.game.scale);
	}

	create() {
		this.game.state.start('danzhuGame', true, false, {
			map: [
				[0, 0], [1, 1], [2, 2],
			],
		});
	}

}
