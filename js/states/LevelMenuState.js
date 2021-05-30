import BackToMenuState from '../base/BackToMenuState';
import Arrow from '../objects/Arrow';
import LevelSquare from '../objects/LevelSquare';
import Title from '../objects/Title';
import Buttons from '../config/StartMenu';

export default class LevelMenuState extends BackToMenuState {
  constructor(game) {
    super();
    this.game = game;
  }

  init(properties) {
    this.key = properties.key;
    this.name = properties.name;
    this.list = properties.children;
  }

  create() {
    super.create();

    this.pageSize = 9;
    this.maxPageSize = Math.ceil(this.list.length / this.pageSize);

    this.caseGroup = this.game.add.group();
    // 选择关卡
    const title = new Title(this.game,
      this.game.width / 2, 180, Buttons[4]);
    this.game.world.add(title);
    for (let i = 0; i < this.list.length; i += 1) {
      const pageNumber = Math.floor(i / this.pageSize);
      const levelSqaure = new LevelSquare(
        this.game,
        this.game.width / 4 + (this.game.width / 4) * (i % 3),
        300 + (100 * Math.floor((i % this.pageSize) / 3)) + (pageNumber * 1000),
        { name: `${i + 1}` },
      );
      levelSqaure.addClick(this.clickRect,
        { state: this, properties: this.list[i], key: this.list[i].key });
      this.caseGroup.add(levelSqaure);
    }
    this.curPage = 1;
    this.enablePageInput(this.curPage);

    this.arrowUp = new Arrow(this.game, this.game.width / 2, 240, 'arrowUp');
    this.arrowDown = new Arrow(this.game, this.game.width / 2, this.game.height - 108, 'arrowDown');

    this.arrowUp.addClick(this.clickArrow, { state: this, dir: 'up' });
    this.arrowDown.addClick(this.clickArrow, { state: this, dir: 'down' });

    this.changeArrow(this.curPage);
  }

  clickArrow() {
    if (this.dir === 'up') {
      if (this.state.curPage > 1) {
        this.state.disablePageInput(this.state.curPage);
        this.state.curPage -= 1;
        this.state.enablePageInput(this.state.curPage);
        this.state.changeArrow(this.state.curPage);
      }
    } else if (this.state.curPage < this.state.maxPageSize) {
      this.state.disablePageInput(this.state.curPage);
      this.state.curPage += 1;
      this.state.enablePageInput(this.state.curPage);
      this.state.changeArrow(this.state.curPage);
    }
    this.state.game.add.tween(this.state.caseGroup).to({ y: -(this.state.curPage - 1) * 1000 }, 200, 'Linear', true);
  }

  clickRect() {
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
      i < pageNum * this.pageSize && i < this.caseGroup.length; i += 1) {
      this.caseGroup.getChildAt(i).inputEnabled = enabled;
    }
  }

  changeArrow(pageNum) {
    if (pageNum <= 1) {
      this.arrowUp.showAndHide(false);
    } else {
      this.arrowUp.showAndHide(true);
    }
    if (pageNum >= this.maxPageSize) {
      this.arrowDown.showAndHide(false);
    } else {
      this.arrowDown.showAndHide(true);
    }
  }
}
