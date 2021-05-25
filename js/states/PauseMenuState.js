import Phaser from '../libs/phaser-wx.js';

export default class PauseMenuState extends Phaser.State {
	constructor(game) {
		super();
		this.game = game;
	}

  preload() { 
      this.load.scenePlugin({
          key: 'rexuiplugin',
          url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
          sceneKey: 'rexUI'
      });      
  }

  create() {
      var dialog = this.rexUI.add.dialog({
              x: 400,
              y: 300,
              width: 500,

              background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

              //title: createLabel(this, 'Title').setDraggable(),
              title: createLabel(this, 'Title'),

              toolbar: [
                  createLabel(this, 'O'),
                  createLabel(this, 'X')
              ],

              leftToolbar: [
                  createLabel(this, 'A'),
                  createLabel(this, 'B')
              ],  

              content: createLabel(this, 'Content'),

              description: createLabel(this, 'Description'),

              choices: [
                  createLabel(this, 'Choice0'),
                  createLabel(this, 'Choice1'),
                  createLabel(this, 'Choice2')
              ],

              actions: [
                  createLabel(this, 'Action0'),
                  createLabel(this, 'Action1')
              ],

              space: {
                  left: 20,
                  right: 20,
                  top: -20,
                  bottom: -20,

                  title: 25,
                  titleLeft: 30,
                  content: 25,
                  description: 25,
                  descriptionLeft: 20,
                  descriptionRight: 20,
                  choices: 25,

                  toolbarItem: 5,
                  choice: 15,
                  action: 15,
              },

              expand: {
                  title: false,
                  // content: false,
                  // description: false,
                  // choices: false,
                  // actions: true,
              },

              align: {
                  title: 'center',
                  // content: 'left',
                  // description: 'left',
                  // choices: 'left',
                  actions: 'right', // 'center'|'left'|'right'
              },

              click: {
                  mode: 'release'
              }
          })
          .setDraggable('background')   // Draggable-background
          .layout()
          // .drawBounds(this.add.graphics(), 0xff0000)
          .popUp(1000);

      var tween = this.tweens.add({
          targets: dialog,
          scaleX: 1,
          scaleY: 1,
          ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 1000,
          repeat: 0, // -1: infinity
          yoyo: false
      });

      this.print = this.add.text(0, 0, '');
      dialog
          .on('button.click', function (button, groupName, index, pointer, event) {
              this.print.text += groupName + '-' + index + ': ' + button.text + '\n';
          }, this)
          .on('button.over', function (button, groupName, index, pointer, event) {
              button.getElement('background').setStrokeStyle(1, 0xffffff);
          })
          .on('button.out', function (button, groupName, index, pointer, event) {
              button.getElement('background').setStrokeStyle();
          });
  }

  update() {}
}

var createLabel = function (scene, text) {
  return scene.rexUI.add.label({
      width: 40, // Minimum width of round-rectangle
      height: 40, // Minimum height of round-rectangle
    
      background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),

      text: scene.add.text(0, 0, text, {
          fontSize: '24px'
      }),

      space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
      }
  });
}

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: PauseMenuState
};

var game = new Phaser.Game(config);