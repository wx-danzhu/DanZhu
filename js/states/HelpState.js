import BackToMenuState from '../base/BackToMenuState';

export default class HelpState extends BackToMenuState {
  constructor(game) {
    super();
    this.game = game;
  }

  init(key) {
    super.init(key);
  }
  
  preload(){
    this.game.load.image('para', 'assets/plane/images/GameIntro.png');
  }
  
  create() {
    super.create();

    
    
    this.para = this.game.add.sprite(this.game.width / 2, this.game.height-320, 'para');
    this.para.anchor.setTo(0.5, 0.5);
    this.para.scale.setTo(1.3, 1.3);
    /**

    const text = '弹珠之城是一款子弹闯关游戏,   \
      玩家通过炮台发射炮弹，\
      击碎砖块来得分并通关。        在每一个地图里，玩家获一定数量的子弹 并可以拖动瞄准器发射子弹。 子弹在触碰到砖块或墙的时候会反射。 子弹撞击到砖块会令其减血。 游戏有选关和排行两个模式。    在选关模式里， 玩家选择一个地图，并用获得的子弹将所有的砖块击碎。';
    //const text
    const style = { font: '20px Arial', fill: '#17202A', align: 'center' };
    this.t = this.game.add.text(this.game.world.centerX - 160, 50, text, style);
    this.t.inputEnabled = true;
    */
  }
}
