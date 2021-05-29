import Phaser from '../libs/phaser-wx';
import Buttons from '../config/StartMenu';
import ShortRect from '../objects/ShortRect';
import LongRect from '../objects/LongRect';
import Title from '../objects/Title';
import About from '../objects/About';
import MuteButton from '../objects/MuteButton';
import generateMap from '../utils/MapGenerator';

export default class MenuState extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  create() {
    this.game.stage.backgroundColor = '#00C9B0';

    this.exampleGroup = this.game.add.group();

    const title = new Title(this.game,
      this.game.width / 2, 180, Buttons[3]);
    this.exampleGroup.add(title);

    // first long button
    const startLongRect = new LongRect(this.game,
      this.game.width / 2, this.game.height - 280, Buttons[0]);
    startLongRect.addClick(this.clickLongRect, { state: this, properties: Buttons[0] });
    this.exampleGroup.add(startLongRect);

    // choose level
    const levelRect = new ShortRect(this.game,
      this.game.width / 2 - 70, this.game.height - 180, Buttons[1]);
    levelRect.addClick(this.clickLevelRect, { state: this, properties: Buttons[1] });
    this.exampleGroup.add(levelRect);

    // ranklist
    const exampleRect = new ShortRect(this.game,
      this.game.width / 2 + 70, this.game.height - 180, Buttons[2]);

    exampleRect.addClick(this.clickRankRect, { state: this, properties: Buttons[2] });
    this.exampleGroup.add(exampleRect);

    const about = new About(this.game,
      169 + Math.floor(2 / 10) * 252,
      650 + Math.floor((0 % 10) / 2) * 126, Buttons[5]);
    this.exampleGroup.add(about);
    about.addClick(this.clickRankRect, { state: this, properties: Buttons[5] });

    this.muteButton = new MuteButton(
      this.game,
      levelRect.left + 20, levelRect.bottom + 30,
      !this.game.mute,
    );
    this.exampleGroup.add(this.muteButton);
    this.muteButton.addClick(this.clickMuteButton, this);

    this.exampleGroup.forEach((child) => {
      // eslint-disable-next-line no-param-reassign
      child.inputEnabled = true;
    });
  }

  clickMuteButton() {
    if (!this.game.mute) {
      this.game.mute = true;
      this.muteButton.setValue(false);
    } else {
      this.game.mute = false;
      this.muteButton.setValue(true);
    }
  }

  clickLongRect() {
    this.state.game.state.start('danzhuGame', true, false,
      {
        map: generateMap(),
      });
  }

  clickLevelRect() {
    this.state.game.state.start('levelmenu', true, false, this.properties);
  }

  clickRankRect() {
    this.state.game.state.start(this.properties.state, true, false, this.key);
  }
}
