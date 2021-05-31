import BackToMenuState from '../base/BackToMenuState';

export default class LicenseState extends BackToMenuState {
  constructor(game) {
    super();
    this.game = game;
  }

  init(key) {
    super.init(key);
  }

  create() {
    super.create();

    const text = '关于弹珠之城';
    const style = { font: 'bold 28px Arial', fill: '#17202A' };
    this.t = this.game.add.text(this.game.world.centerX, 80, text, style);
    this.t.anchor.setTo(0.5, 0.5);

    const contentText = `依赖库:
Phaser v2.6.2:

The MIT License (MIT)

Copyright (c) 2017 Richard Davey, Photon Storm Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;
    const contentStyle = {
      font: '10px Arial', fill: '#000', wordWrap: true, wordWrapWidth: 360,
    };
    const content = this.game.add.text(this.game.world.centerX, 120, contentText, contentStyle);
    content.anchor.setTo(0.5, 0);
  }
}
