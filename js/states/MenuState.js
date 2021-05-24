import Phaser from '../libs/phaser-wx.js';
import Buttons from '../config/StartMenu.js';
import ShortRect from '../objects/ShortRect.js';
import LongRect from '../objects/LongRect.js';
import Title from '../objects/Title.js';
import Arrow from '../objects/Arrow.js';

export default class MenuState extends Phaser.State {
	
	constructor(game) {
		super();
		this.game = game;
	}

	create() {

		this.game.stage.backgroundColor = '#F4D03F';

		this.exampleGroup = this.game.add.group();

		var title = new Title(this.game, 169 + Math.floor(2 / 10) * 252, 150 + Math.floor(0 % 10 / 2) * 126, Buttons[3]);
		this.exampleGroup.add(title);

		var startLongRect = new LongRect(this.game, 169 + Math.floor(2 / 10) * 252, 420 + Math.floor(0 % 10 / 2) * 126, Buttons[0]);
		startLongRect.addClick(this.clickRect, {state: this, properties: Buttons[0]});
		this.exampleGroup.add(startLongRect);

		for(var i=1; i< 3; i++) {
			var exampleRect = new ShortRect(this.game, 126 + ((i+1) % 2) * 126 + Math.floor((i+1) / 10) * 252, 420 + Math.floor((i+1) % 10 / 2) * 126, Buttons[i]);
			exampleRect.addClick(this.clickRect, {state: this, properties: Buttons[i]});
			this.exampleGroup.add(exampleRect);
		}
		this.pageSize = 10;
		this.maxPageSize = Math.ceil(Buttons.length / this.pageSize);
		this.curPage = 1;
		this.enablePageInput(this.curPage);

		this.mask = this.game.add.graphics(0, 0);
    this.mask.beginFill(0xffffff);
    this.mask.drawRect(60, 0, 256, this.game.height);
    this.exampleGroup.mask = this.mask;

		this.arrowLeft = new Arrow(this.game, 26, this.game.height / 2, 'arrowLeft');
		this.arrowRight = new Arrow(this.game, this.game.width - 26, this.game.height / 2, 'arrowRight');

		this.arrowLeft.addClick(this.clickArrow, {state: this, dir: 'left'});
		this.arrowRight.addClick(this.clickArrow, {state: this, dir: 'right'});

		this.changeArrow(this.curPage);

	}

	clickArrow() {
		if(this.dir === 'left') {
			if(this.state.curPage > 1) {
				this.state.disablePageInput(this.state.curPage);
				this.state.curPage--;
				this.state.enablePageInput(this.state.curPage);
				this.changeArrow(this.curPage);
			}
		} else {
			if(this.state.curPage < this.state.maxPageSize) {
				this.state.disablePageInput(this.state.curPage);
				this.state.curPage++;
				this.state.enablePageInput(this.state.curPage);
				this.changeArrow(this.curPage);
			}
		}
		this.state.game.add.tween(this.state.exampleGroup).to({x: - (this.state.curPage - 1) * 252}, 200, "Linear", true);
	}

	clickRect() {
		this.state.game.state.start('submenu', true, false, this.properties);
	}

	enablePageInput(pageNum) {
		this.changePageInput(pageNum, true);
	}

	disablePageInput(pageNum) {
		this.changePageInput(pageNum, false);
	}

	changePageInput(pageNum, enabled) {
		for(var i = (pageNum - 1) * this.pageSize; i < pageNum * this.pageSize && i < this.exampleGroup.length; i++) {
			this.exampleGroup.getChildAt(i).inputEnabled = enabled;
		}
	}

	changeArrow(pageNum) {
		if(pageNum <= 1) {
			this.arrowLeft.showAndHide(false);
		} else {
			this.arrowLeft.showAndHide(true);
		}
		if(pageNum >= this.maxPageSize) {
			this.arrowRight.showAndHide(false);
		} else {
			this.arrowRight.showAndHide(true);
		}
	}

}