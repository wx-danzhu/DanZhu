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
		this.game.load.image('bomb', 'assets/rolling_ball/block_locked_small.png');
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
		this.wallTop = this.wallGroup.create(-80, -10, 'wall');
		this.wallTop.scale.setTo(10, 1);
		this.wallTop.body.immovable = true;
		this.wallLeft = this.wallGroup.create(-55, -10, 'wall');
		this.wallLeft.scale.setTo(1, 15);
		this.wallLeft.body.immovable = true;
		this.wallRight = this.wallGroup.create(this.game.width - 9, -10, 'wall');
		this.wallRight.scale.setTo(1, 15);
		this.wallRight.body.immovable = true;

		// bricks
		this.brickGroup = this.game.add.group();
		this.brickGroup.enableBody = true;
		this.brickGroup.physicsBodyType = Phaser.Physics.ARCADE;

		// bricks
		this.bombGroup = this.game.add.group();
		this.bombGroup.enableBody = true;
		this.bombGroup.physicsBodyType = Phaser.Physics.ARCADE;

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

		// aiming lines
		this.aimingLineGroup = this.game.add.group();

		// score
		var style = { font: "32px", fill: "#ffffff" };
		this.score = 0;
		this.scoreText = this.game.add.text(15, 15, this.score + '', style);

		// generate bricks
		this.generateBricks(this.map);

		// generate bombs
		this.generateBombs(this.map);

		this.game.audio.bgm.play();

		// pause
		this.pause = new Pause(this.game, 26, 26, 'arrowBack');
		this.pause.addClick(this.showPause, this);
	}

	update() {
		// detect collision between bullets and bricks
		this.game.physics.arcade.collide(this.brickGroup, this.bulletGroup, this.hit, null, this);
		// detect collision between bullets and bombs
		this.game.physics.arcade.collide(this.bombGroup, this.bulletGroup, this.hitBomb, null, this);
		// detect collision between bullets and walls
		this.game.physics.arcade.collide(this.wallGroup, this.bulletGroup);
		// aiming and no bullet is shown
		if (this.dragging && !this.bulletGroup.getFirstExists(true)) {
			const p = this.game.input.activePointer;
			const angle = Phaser.Math.angleBetween(p.x, p.y, this.cannon.x, this.cannon.y) - Math.PI / 2;

			// rotate cannon to point towards pointer.
			this.cannon.rotation = angle;

			// show aiming assistance
			this.drawAimingLines(angle + Math.PI / 2);
		}
	}

	render() {
	}

	drawAimingLines() {
		const line_length = 500;
		const gap_length = 20;
		const angle = this.cannon.rotation + Math.PI / 2;
		const delta_x = Math.cos(Math.PI - angle) * gap_length;
		const delta_y = - Math.sin(Math.PI - angle) * gap_length;
		this.aimingLineGroup.removeAll();
		let current_length = 0;
		let current_x = this.cannon.x;
		let current_y = this.cannon.y;
		while (current_length < line_length) {
			const aimingLine = this.aimingLineGroup.create(current_x, current_y, 'bullet');
			aimingLine.anchor.setTo(0.5, 0.5);
			aimingLine.scale.setTo(0.1, 0.1);
			current_x += delta_x;
			current_y += delta_y;
			current_length += gap_length;

			if (this.checkAlOverlap(aimingLine)) {
				aimingLine.destroy();
				break;
			}
		}
	}

	checkAlOverlap(aimingLine) {
		let overlapping = false;
		const boundsA = new Phaser.Rectangle(aimingLine.left, aimingLine.top, aimingLine.width , aimingLine.height);
		this.wallGroup.forEachExists((o) => {
			const boundsB = o.getBounds();
			if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
				overlapping = true;
			}
		}, this);
		if (overlapping) {
			return true;
		}
		this.brickGroup.forEachExists((o) => {
			const boundsB = o.getBounds();
			if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
				overlapping = true;
			}
		}, this);

    return overlapping;

}

	generateBricks(map) {
		const start_pos_x = this.wallLeft.right;
		const start_pos_y = this.wallTop.bottom;
		const end_pos_x = this.wallRight.left;
		const brick_len = (end_pos_x - start_pos_x) / 10;
		const locations = map || [
			[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
			[0, 1],
			[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
			// [0, 10]
		];
		for (const location of locations) {
			if (location[0] < 0 || location[0] > 9 || location[1] < 0 || location[1] > 11) {
				continue;
			}
			const brick = this.brickGroup.create(start_pos_x + location[0] * brick_len, start_pos_y + location[1] * brick_len, 'brick');
			brick.body.immovable = true;
			brick.health = 10;
			brick.anchor.setTo(0, 0);
			brick.height = brick_len;
			brick.width = brick_len;
		}
	}

	generateBombs(bombMap) {
		const start_pos_x = this.wallLeft.right;
		const start_pos_y = this.wallTop.bottom;
		const end_pos_x = this.wallRight.left;
		const bomb_len = (end_pos_x - start_pos_x) / 10;
		const locations = bombMap || [[1,1]];
		for (const location of locations) {
			if (location[0] < 0 || location[0] > 9 || location[1] < 0 || location[1] > 11) {
				continue;
			}
			const bomb = this.bombGroup.create(start_pos_x + location[0] * bomb_len, start_pos_y + location[1] * bomb_len, 'bomb');
			bomb.body.immovable = true;
			bomb.health = 1;
			bomb.anchor.setTo(0, 0);
			bomb.height = bomb_len;
			bomb.width = bomb_len;
		}
	}

	dragStart() {
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
			this.aimingLineGroup.removeAll();
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
		const score = this.score + '';
		wx.setUserCloudStorage({
			KVDataList: [{
				key: "score",
				value: score,
			}],
			success: function () {
				console.log('save score ' + score + ' success');
			},
			fail: function () {
				console.log('save score ' + score + ' fail');
			},
		});
	}
	// const bomb = this.bombGroup.create(start_pos_x + location[0] * bomb_len, start_pos_y + location[1] * bomb_len, 'bomb');
	
	hitBomb(bomb, bullet) {
		const xpos = bomb.x;
		const ypos = bomb.y;
		bomb.health--;
		if (bomb.health <= 0) {
			bomb.kill();
		}
		// 	var explosion = this.explosionGroup.getFirstExists(false);
		// 	if (!explosion) {
		// 		explosion = this.explosionGroup.create(brick.x, brick.y, 'explosion');
		// 		explosion.anchor.setTo(0.5, 0.5);
		// 	} else {
		// 		explosion.reset(brick.x, brick.y);
		// 	}
		// 	var anim = explosion.animations.add('explosion');
		// 	anim.play('explosion', 20);
		// 	anim.onComplete.add(function () {
		// 		explosion.kill();
		// 	}, this);
		// 	this.game.audio.boom.play();
		// }
		this.brickGroup.forEach(
			(brick) => {
				console.log("inside for each");
				console.log(Math.pow(brick.x - xpos, 2));
				console.log(Math.sqrt(Math.pow(brick.x - xpos, 2) + Math.pow(brick.y - ypos, 2)));
				if (Math.sqrt(Math.pow(brick.x - xpos, 2) + Math.pow(brick.y - ypos, 2)) < 100) {
					console.log("trying to kill brick");
						this.killBrick(brick);
				}
			}
		);
	}

	killBrick(brick) {
		const healthLeft = brick.health;
		this.score += healthLeft;
		this.scoreText.text = this.score + '';
		brick.health == 0;
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
		const score = this.score + '';
		wx.setUserCloudStorage({
			KVDataList: [{
				key: "score",
				value: score,
			}],
			success: function () {
				console.log('save score ' + score + ' success');
			},
			fail: function () {
				console.log('save score ' + score + ' fail');
			},
		});
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
		this.continueButton = this.game.add.sprite(0, 0, 'common', 'button');
		this.continueButton.anchor.setTo(0.5, 0.5);
		this.continueButton.scale.setTo(1.2, 0.7);
		dialog.addChild(this.continueButton);

		var continueText = this.game.add.text(0, 2, '继续', style);
		continueText.anchor.setTo(0.5, 0.5);
		continueText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
		this.continueButton.addChild(continueText);

		// 返回
		this.backButton = this.game.add.sprite(0, 16, 'common', 'button');
		this.backButton.anchor.setTo(0.5, 0.5);
		this.backButton.scale.setTo(1.2, 0.7);
		dialog.addChild(this.backButton);

		var backText = this.game.add.text(0, 2, '返回', style);
		backText.anchor.setTo(0.5, 0.5);
		backText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
		this.backButton.addChild(backText);
		
		this.game.input.onDown.add(this.pausemenu_down.bind(this), self);

	}

	pausemenu_down(event) {
		if (!this.game.paused) {
			return;
		}
		const continueBonuds = this.continueButton.getBounds();
		const backBonuds = this.backButton.getBounds();

		if (Phaser.Rectangle.contains(continueBonuds, event.x, event.y)) {
			// continue button pressed
			console.log('continue button');
			this.dialog.destroy();
			this.game.paused = false;
		} else if (Phaser.Rectangle.contains(backBonuds, event.x, event.y)) {
			// back button pressed
			console.log('back button');
			this.game.paused = false;
			this.game.state.start('menu');
		}
	}

}
