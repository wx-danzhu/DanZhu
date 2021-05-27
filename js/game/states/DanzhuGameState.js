import Phaser from '../../libs/phaser-wx.js';
import Common from '../atlas/common.js';
import Pause from '../../objects/Pause.js'

export default class GameState extends Phaser.State {

	constructor(game) {
		super();
		this.game = game;
	}

	createAudio(name, src, loop = false, autoplay = false) {
		const audio = wx.createInnerAudioContext();
		audio.autoplay = autoplay;
		audio.loop = loop;
		audio.src = src;
		if (!this.game.audio) {
			this.game.audio = {
				name: audio,
			};
		} {
			this.game.audio[name] = audio;
		}
	}

	preload() {
		this.game.load.image('bg', 'assets/plane/images/bg.jpg');
		this.game.load.image('cannon', 'assets/plane/images/hero.png');
		this.game.load.image('wall', 'assets/rolling_ball/background_brown.png');
		this.game.load.image('brick', 'assets/rolling_ball/block_small.png');
		this.game.load.image('bullet', 'assets/rolling_ball/ball_blue_small.png');
		this.game.load.spritesheet('explosion', 'assets/plane/images/explosion.png', 47, 64, 19);

		this.game.load.atlas('common', 'assets/plane/images/common.png', null, Common);
		
		this.createAudio('bgm', 'assets/plane/audio/bgm.mp3', true);
		this.createAudio('boom', 'assets/plane/audio/boom.mp3');
		this.createAudio('bullet', 'assets/plane/audio/bullet.mp3');
	}

	init(parameters) {
		if (parameters) {
			this.map = parameters.map;
		}
	}

	create() {
		this.dragging = false;

		// start physics engine
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg');

		this.game.input.onDown.add(this.dragStart, this);
		this.game.input.onUp.add(this.dragStop, this);

		// world walls
		this.wallGroup = this.game.add.group();
		this.wallGroup.enableBody = true;
		this.wallGroup.physicsBodyType = Phaser.Physics.ARCADE;
		const wallTop = this.wallGroup.create(-80, -55, 'wall');
		wallTop.scale.setTo(10, 1.6);
		wallTop.body.immovable = true;
		const wallLeft = this.wallGroup.create(-55, -10, 'wall');
		wallLeft.scale.setTo(1, 15);
		wallLeft.body.immovable = true;
		const wallRight = this.wallGroup.create(this.game.width - 9, -10, 'wall');
		wallRight.scale.setTo(1, 15);
		wallRight.body.immovable = true;

		// bricks
		this.brickGroup = this.game.add.group();
		this.brickGroup.enableBody = true;
		this.brickGroup.physicsBodyType = Phaser.Physics.ARCADE;

		// bullet
		this.bulletGroup = this.game.add.group();
		this.bulletGroup.enableBody = true;
		this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;

		// explosion
		this.explosionGroup = this.game.add.group();
		this.explosionGroup.enableBody = true;

		// cannon
		this.cannon = this.game.add.sprite(this.game.width / 2, this.game.height - 50, 'cannon');
		this.cannon.anchor.setTo(0.5, 0.5);
		this.cannon.scale.setTo(0.5, 0.5);

		// score
		var style = { font: "32px", fill: "#ffffff" };
		this.score = 0;
		this.scoreText = this.game.add.text(15, 15, this.score + '', style);

		// generate bricks
		this.generateBricks(this.map);

		this.game.audio.bgm.play();

		// pause
		console.log("creating ur little pause...");
    this.pause = new Pause(this.game, 26, 26, 'arrowBack');
    this.pause.addClick(this.showPause, this);
	}

	// show pause menu, currently not working
  showPause() {
		console.log("directing to pausemenu...");
		this.game.paused = true;
		var dialog = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'common', 'dialog');
		this.dialog = dialog;
		dialog.anchor.setTo(0.5, 0.5);
		dialog.scale.setTo(2.5, 2.5);

		var style = { font: "16px", fill: "#ffffff" };
		var pauseMenuText = this.game.add.text(2, -35, '菜单', style);
		pauseMenuText.anchor.setTo(0.5, 0.5);
		pauseMenuText.scale.setTo(0.7, 0.7);
		dialog.addChild(pauseMenuText);

				// 继续
				var continueButton = this.game.add.sprite(0, 0, 'common', 'button');
				continueButton.anchor.setTo(0.5, 0.5);
				continueButton.scale.setTo(1.2, 0.7);
				dialog.addChild(continueButton);
		
				var continueText = this.game.add.text(0, 2, '继续', style);
				continueText.anchor.setTo(0.5, 0.5);
				continueText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
				continueButton.addChild(continueText);
		
				continueButton.inputEnabled = true;
				continueButton.events.onInputDown.add(this.resume, this);

		// 返回
		var restartButton = this.game.add.sprite(0, 16, 'common', 'button');
		restartButton.anchor.setTo(0.5, 0.5);
		restartButton.scale.setTo(1.2, 0.7);
		dialog.addChild(restartButton);

		var restartText = this.game.add.text(0, 2, '返回', style);
		restartText.anchor.setTo(0.5, 0.5);
		restartText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
		restartButton.addChild(restartText);

		restartButton.inputEnabled = true;
		restartButton.events.onInputDown.add(this.restart, this);
		
  }

	update() {
		this.game.physics.arcade.collide(this.brickGroup, this.bulletGroup, this.hit, null, this);
		this.game.physics.arcade.collide(this.wallGroup, this.bulletGroup);
		if (this.dragging) {
			const p = this.game.input.activePointer;
			const angle = Phaser.Math.angleBetween(p.x, p.y, this.cannon.x, this.cannon.y) - Math.PI / 2;
			this.cannon.rotation = angle;
		}
	}

	render() {
	}

	generateBricks(map) {
		const start_pos = [10, 10];
		const locations = map || [
			[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
			[0, 1],
			[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
		];
		for (const location of locations) {
			let brick = this.brickGroup.create(start_pos[0] + location[0] * 30, start_pos[1] + location[1] * 30, 'brick');
			brick.body.immovable = true;
			brick.health = 10;
			brick.anchor.setTo(0, 0);
			brick.scale.setTo(1, 1);
		}
	}

	dragStart() {
		console.log('show aiming assistance');
		this.dragging = true;
	}

	dragStop() {
		this.dragging = false;
		this.shoot();
	}

	shoot() {
		let bullet = this.bulletGroup.getFirstExists(true);
		if (bullet) {
		} else {
			this.game.audio.bullet.play();
			this.bulletGroup.removeAll();
			const bulletAngle = this.cannon.rotation + Math.PI / 2; // 0 -> left, pi/2 -> up
			for (let i = 0; i < 10; i++) {
				this.game.time.events.add(Phaser.Timer.SECOND / 10 * i, function () {
					bullet = this.bulletGroup.create(this.cannon.x, this.cannon.y, 'bullet');
					bullet.body.bounce.set(1);
					bullet.outOfBoundsKill = true;
					bullet.checkWorldBounds = true;
					bullet.anchor.setTo(0.5, 0.5);
					bullet.scale.setTo(0.3, 0.3);
					bullet.body.velocity.x = Math.cos(Math.PI - bulletAngle) * 500;
					bullet.body.velocity.y = - Math.sin(Math.PI - bulletAngle) * 500;
				}, this);
			}
		}
	}

	hit(brick, bullet) {
		this.score++;
		this.scoreText.text = this.score + '';
		brick.health--;
		if (brick.health <= 0) {
			brick.kill();
			var explosion = this.explosionGroup.getFirstExists(false);
			if (!explosion) {
				explosion = this.explosionGroup.create(brick.x, brick.y, 'explosion');
				explosion.anchor.setTo(0.5, 0.5);
			} else {
				explosion.reset(brick.x, brick.y);
			}
			var anim = explosion.animations.add('explosion');
			anim.play('explosion', 20);
			anim.onComplete.add(function () {
				explosion.kill();
			}, this);
			this.game.audio.boom.play();
		}
	}

	stopAll() {
		this.brickGroup.setAll('body.velocity.y', 0);
		this.bulletGroup.setAll('body.velocity.y', 0);
		this.bg.stopScroll();
		this.hero.input.disableDrag();
		this.soundBgm.stop();
	}

	gameOver() {
		var dialog = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'common', 'dialog');
		dialog.anchor.setTo(0.5, 0.5);
		dialog.scale.setTo(2.5, 2.5);

		var style = { font: "16px", fill: "#ffffff" };
		var gameOverText = this.game.add.text(2, -35, '游戏结束', style);
		gameOverText.anchor.setTo(0.5, 0.5);
		gameOverText.scale.setTo(0.7, 0.7);
		dialog.addChild(gameOverText);

		var gameOverScoreText = this.game.add.text(0, -8, '得分: ' + this.score, style);
		gameOverScoreText.anchor.setTo(0.5, 0.5);
		gameOverScoreText.scale.setTo(0.6, 0.6);
		dialog.addChild(gameOverScoreText);

		var restartButton = this.game.add.sprite(0, 16, 'common', 'button');
		restartButton.anchor.setTo(0.5, 0.5);
		restartButton.scale.setTo(1.2, 0.7);
		dialog.addChild(restartButton);

		var restartText = this.game.add.text(0, 2, '返回', style);
		restartText.anchor.setTo(0.5, 0.5);
		restartText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
		restartButton.addChild(restartText);

		restartButton.inputEnabled = true;
		restartButton.events.onInputDown.add(this.restart, this);
	}

	resume() {

		// Unpause the game
		this.dialog.destroy();
		this.game.paused = false;
	}

	restart() {
		this.game.state.start('menu');
	}

}
