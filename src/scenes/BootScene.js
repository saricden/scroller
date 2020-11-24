import {Scene} from 'phaser';

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  
  preload() {
    // Load any assets here from your assets directory
    this.load.image('cat-like', 'assets/cat-like-creature.png');

    this.load.image('ts-basic', 'assets/tileset.png');
    this.load.tilemapTiledJSON('map-basic', 'assets/map-basic.json');

    this.load.atlas('hara', 'assets/hara.png', 'assets/hara.json');
  }

  create() {
    this.anims.createFromAseprite('hara');
    this.scene.start('scene-game');
  }
}

export default BootScene;
