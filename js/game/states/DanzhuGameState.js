import Phaser from '../../libs/phaser-wx.js';

export default class GameState extends Phaser.State {

	constructor(game) {
		super();
		this.game = game;
	}

	preload() {
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
		const wallLeft = this.wallGroup.create(0, 0, 'brick');
		wallLeft.anchor.setTo(0, 0);
		const wallRight = this.wallGroup.create(0, 1, 'brick');
		wallRight.anchor.setTo(0, 0);
		const wallTop = this.wallGroup.create(0, 2, 'brick');
		wallTop.anchor.setTo(0, 0);

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
		this.scoreText = this.game.add.text(10, 10, this.score + '', style);

		// generate bricks
		this.generateBricks();

		this.soundBgm = this.game.add.audio('bgm', 1, { loop: true, totalDuration: 62 });
		this.soundBgm.play();

		this.soundBullet = this.game.add.audio('bullet');
		this.soundBoom = this.game.add.audio('boom');
	}

	update() {
		this.game.physics.arcade.collide(this.brickGroup, this.bulletGroup, this.hit, null, this);
		if (this.dragging) {
			const p = this.game.input.activePointer;
			const angle = Phaser.Math.angleBetween(p.x, p.y, this.cannon.x, this.cannon.y) - Math.PI / 2;
			this.cannon.rotation = angle;
		}
	}

	render() {
	}

	generateBricks() {
		const locations = [
			[0, 0], [1, 0], [2, 0], [3, 0],
			[0, 1],
			[0, 2], [1, 2], [2, 2], [3, 2],
		];
		for (const location of locations) {
			let brick = this.brickGroup.create(location[0] * 30, (location[1] + 5) * 30, 'brick');
			brick.body.immovable = true;
			brick.health = 2;
			brick.anchor.setTo(0, 0);
			brick.scale.setTo(1, 1);
		}
	}

	dragStart() {
		console.log('show aiming assistance');
		this.dragging = true;
	}

	dragStop() {
		console.log('shoot~');
		this.dragging = false;
		this.shoot();
	}

	shoot() {
		let bullet = this.bulletGroup.getFirstExists(false);
		if (bullet) {
			bullet.reset(this.cannon.x, this.cannon.y);
			const bulletAngle = this.cannon.rotation + Math.PI / 2; // 0 -> left, pi/2 -> up
			bullet.body.velocity.x = Math.cos(Math.PI - bulletAngle) * 500;
			bullet.body.velocity.y = - Math.sin(Math.PI - bulletAngle) * 500;
		} else {
			bullet = this.bulletGroup.create(this.cannon.x, this.cannon.y, 'bullet');
			bullet.body.collideWorldBounds = true;
			bullet.body.bounce.set(1);
			bullet.outOfBoundsKill = true;
			bullet.checkWorldBounds = true;
			bullet.anchor.setTo(0.5, 0.5);
			bullet.scale.setTo(0.3, 0.3);
			const bulletAngle = this.cannon.rotation + Math.PI / 2; // 0 -> left, pi/2 -> up
			bullet.body.velocity.x = Math.cos(Math.PI - bulletAngle) * 500;
			bullet.body.velocity.y = - Math.sin(Math.PI - bulletAngle) * 500;
		}
		console.log(bullet.body.velocity.x, bullet.body.velocity.y);

		this.soundBullet.play();

	}

	dead(cannon) {
		this.stopAll();
		this.gameOver();
	}

	hit(brick, bullet) {
		console.log('hit brick!');
		brick.health--;
		if (brick.health <= 0) {
			brick.kill();
			this.score++;
			this.scoreText.text = this.score + '';

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

			this.soundBoom.play();
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

	restart() {
		this.game.state.start('menu');
	}

}
