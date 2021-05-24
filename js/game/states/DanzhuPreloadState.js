import Phaser from '../../libs/phaser-wx.js';
import Common from '../atlas/common.js';

export default class PreloadState extends Phaser.State {

	constructor(game) {
		super();
		this.game = game;
	}

	preload() {
		this.game.load.image('bg', 'assets/plane/images/bg.jpg');
		this.game.load.image('cannon', 'assets/plane/images/hero.png');
		this.game.load.image('wall', 'assets/rolling_ball/background_brown.png');
		this.game.load.image('brick', 'assets/rolling_ball/block_small.png');
		this.game.load.image('bullet', 'assets/rolling_ball/ball_blue_small.png');
		this.game.load.spritesheet('explosion', 'assets/plane/images/explosion.png', 47, 64, 19);

		this.game.load.atlas('common', 'assets/plane/images/common.png', null, Common);

		this.game.load.audio('bgm', 'assets/plane/audio/bgm.mp3');
		this.game.load.audio('boom', 'assets/plane/audio/boom.mp3');
		this.game.load.audio('bullet', 'assets/plane/audio/bullet.mp3');
	}

	create() {
		this.game.state.start('DanzhuGame');
	}

}
