import './main.css';
import Phaser, {Game} from 'phaser';
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';

const canvas = document.getElementById('game-canvas');
const config = {
  type: Phaser.WEB_GL,
  width: window.innerWidth,
  height: window.innerHeight,
  canvas,
  pixelArt: true,
  plugins: {
    scene: [
      {
        key: 'rexGestures',
        plugin: GesturesPlugin,
        mapping: 'rexGestures'
      },
    ]
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: [
    BootScene,
    GameScene
  ]
};

const game = new Game(config);
