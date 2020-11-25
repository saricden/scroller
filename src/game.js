import './main.css';
import Phaser, {Game} from 'phaser';
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import MatterScene from './scenes/MatterScene';

const canvas = document.getElementById('game-canvas');
const config = {
  type: Phaser.WEB_GL,
  width: window.innerWidth,
  height: window.innerHeight,
  canvas,
  pixelArt: true,
  physics: {
    // default: 'arcade',
    // arcade: {
    //   gravity: { y: 400 },
    //   debug: false
    // }
    default: 'matter',
    matter: {
      gravity: { y: 1 },
      debug: false
    }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: "matterCollision",
        mapping: "matterCollision"
      }
    ]
  },
  scene: [
    BootScene,
    GameScene,
    MatterScene
  ]
};

const game = new Game(config);
