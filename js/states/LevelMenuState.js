import Phaser from '../libs/phaser-wx.js';
import BackToMenuState from '../base/BackToMenuState.js';
import Arrow from '../objects/Arrow.js';
import LevelSquare from '../objects/LevelSquare.js';
import Title from '../objects/Title.js';
import Buttons from '../config/StartMenu.js';

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

    this.caseGroup = this.game.add.group();
        // 选择关卡
        var title = new Title(this.game, 169 + Math.floor(2 / 10) * 252, 125 + Math.floor(0 % 10 / 2) * 126, Buttons[4]);
        this.caseGroup.add(title);
    for(var i=0; i< this.list.length; i++) {
      var levelSqaure = new LevelSquare(this.game, this.game.width / 4 
      + this.game.width / 4 * (i % 3), 200 + 60 * Math.floor(i / 3), this.list[i]);
      levelSqaure.addClick(this.clickRect, {state: this, properties: this.list[i], key: this.key});
      this.caseGroup.add(levelSqaure);
    }
    this.pageSize = 16;
    this.maxPageSize = Math.ceil(this.list.length / this.pageSize);
    this.curPage = 1;
    this.enablePageInput(this.curPage);

    this.mask = this.game.add.graphics(0, 0);
    this.mask.beginFill(0xffffff);
    this.mask.drawRect(0, 64, this.game.width, this.game.height - 124);
    this.caseGroup.mask = this.mask;

    this.arrowUp = new Arrow(this.game, this.game.width / 2, 26, 'arrowUp');
    this.arrowDown = new Arrow(this.game, this.game.width / 2, this.game.height - 26, 'arrowDown');

    this.arrowUp.addClick(this.clickArrow, {state: this, dir: 'up'});
    this.arrowDown.addClick(this.clickArrow, {state: this, dir: 'down'});

    this.changeArrow(this.curPage);
  }

  clickArrow() {
    if(this.dir === 'up') {
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
    this.state.game.add.tween(this.state.caseGroup).to({y: - (this.state.curPage - 1) * 544}, 200, "Linear", true);
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
    for(var i = (pageNum - 1) * this.pageSize; i < pageNum * this.pageSize && i < this.caseGroup.length; i++) {
      this.caseGroup.getChildAt(i).inputEnabled = enabled;
    }
  }

  changeArrow(pageNum) {
    if(pageNum <= 1) {
      this.arrowUp.showAndHide(false);
    } else {
      this.arrowUp.showAndHide(true);
    }
    if(pageNum >= this.maxPageSize) {
      this.arrowDown.showAndHide(false);
    } else {
      this.arrowDown.showAndHide(true);
    }
  }

}