import Phaser from '../libs/phaser-wx';
import Buttons from '../config/StartMenu';
import ShortRect from '../objects/ShortRect';
import LongRect from '../objects/LongRect';
import Title from '../objects/Title';
import Arrow from '../objects/Arrow';
import About from '../objects/About';

export default class MenuState extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  create() {
    this.game.stage.backgroundColor = '#F4D03F';

    this.exampleGroup = this.game.add.group();

    const title = new Title(this.game,
      169 + Math.floor(2 / 10) * 252, 150 + Math.floor((0 % 10) / 2) * 126, Buttons[3]);
    this.exampleGroup.add(title);

    // first long button
    const startLongRect = new LongRect(this.game,
      169 + Math.floor(2 / 10) * 252, 420 + Math.floor((0 % 10) / 2) * 126, Buttons[0]);
    startLongRect.addClick(this.clickRankRect, { state: this, properties: Buttons[0] });
    this.exampleGroup.add(startLongRect);

    // choose level
    const levelRect = new ShortRect(this.game,
      126 + ((1 + 1) % 2) * 126 + Math.floor((1 + 1) / 10) * 252,
      420 + Math.floor(((1 + 1) % 10) / 2) * 126, Buttons[1]);
    levelRect.addClick(this.clickLevelRect, { state: this, properties: Buttons[1] });
    this.exampleGroup.add(levelRect);

    // ranklist
    const exampleRect = new ShortRect(this.game,
      126 + ((2 + 1) % 2) * 126 + Math.floor((2 + 1) / 10) * 252,
      420 + Math.floor(((2 + 1) % 10) / 2) * 126, Buttons[2]);

    exampleRect.addClick(this.clickRankRect, { state: this, properties: Buttons[2] });
    this.exampleGroup.add(exampleRect);

    const about = new About(this.game,
      169 + Math.floor(2 / 10) * 252,
      650 + Math.floor((0 % 10) / 2) * 126, Buttons[5]);
    this.exampleGroup.add(about);
    about.addClick(this.clickRankRect, { state: this, properties: Buttons[5] });

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

    this.arrowLeft.addClick(this.clickArrow, { state: this, dir: 'left' });
    this.arrowRight.addClick(this.clickArrow, { state: this, dir: 'right' });

    this.changeArrow(this.curPage);
  }

  clickArrow() {
    if (this.dir === 'left') {
      if (this.state.curPage > 1) {
        this.state.disablePageInput(this.state.curPage);
        this.state.curPage -= 1;
        this.state.enablePageInput(this.state.curPage);
        this.changeArrow(this.curPage);
      }
    } else if (this.state.curPage < this.state.maxPageSize) {
      this.state.disablePageInput(this.state.curPage);
      this.state.curPage += 1;
      this.state.enablePageInput(this.state.curPage);
      this.changeArrow(this.curPage);
    }
    this.state.game.add.tween(this.state.exampleGroup).to({ x: -(this.state.curPage - 1) * 252 }, 200, 'Linear', true);
  }

  clickRect() {
    this.state.game.state.start('submenu', true, false, this.properties);
  }

  clickLevelRect() {
    this.state.game.state.start('levelmenu', true, false, this.properties);
  }

  clickRankRect() {
    this.state.game.state.start(this.properties.state, true, false, this.key);
  }

  enablePageInput(pageNum) {
    this.changePageInput(pageNum, true);
  }

  disablePageInput(pageNum) {
    this.changePageInput(pageNum, false);
  }

  changePageInput(pageNum, enabled) {
    for (let i = (pageNum - 1) * this.pageSize;
      i < pageNum * this.pageSize && i < this.exampleGroup.length; i += 1) {
      this.exampleGroup.getChildAt(i).inputEnabled = enabled;
    }
  }

  changeArrow(pageNum) {
    if (pageNum <= 1) {
      this.arrowLeft.showAndHide(false);
    } else {
      this.arrowLeft.showAndHide(true);
    }
    if (pageNum >= this.maxPageSize) {
      this.arrowRight.showAndHide(false);
    } else {
      this.arrowRight.showAndHide(true);
    }
  }
}
