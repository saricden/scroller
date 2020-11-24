import {Scene, Math as pMath} from 'phaser';

class GameScene extends Scene {

  constructor() {
    super("scene-game");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x0033CC);
    
    this.map = this.make.tilemap({ key: 'map-basic' });
    const tileset = this.map.addTilesetImage('ts-basic');
    const layer = this.map.createStaticLayer('solid', tileset);
    
    layer.setCollisionByProperty({ collides: true });
    
    // Add, scale, and make up a speed for our creature
    this.cat = this.physics.add.sprite(50, 50, 'hara');

    this.physics.add.collider(this.cat, layer);
    
    console.log(this.rexGestures);

    this.cameras.main.startFollow(this.cat);
    this.cameras.main.setZoom(3);

    this.input.on('pointerdown', this.pointerDown, this);
    this.input.on('pointermove', this.pointerMove, this);
    this.input.on('pointerup', this.pointerUp, this);
    this.input.on('pointerupoutside', this.pointerUp, this);

    this.pointerIsDown = false;
    this.initWorldX = null;
    this.initWorldY = null;
    this.speedModifier = 15;
    this.panVelocity = 100;
  }

  pointerDown(pointer) {
    const {worldX, worldY} = pointer;
    this.pointerIsDown = true;
    this.initWorldX = worldX;
    this.initWorldY = worldY;
    this.cat.setVelocity(0);
  }

  pointerMove(pointer) {
    if (this.pointerIsDown) {
      const {worldX, worldY} = pointer;

      const panX = (this.initWorldX - worldX);
      const panY = (this.initWorldY - worldY);

      // this.cat.x = (this.cat.x + panX);
      // this.cat.y = (this.cat.y + panY);

      const nx = (this.cat.x + panX);
      const ny = (this.cat.y + panY);

      this.physics.moveTo(this.cat, this.cat.x + panX, this.cat.y + panY, this.panVelocity, 50);

      this.cat.setAlpha(0.5);
    }
  }

  pointerUp(pointer) {
    const {upX, downX, upY, downY, upTime, moveTime} = pointer;

    const xv = (((downX - upX) / (upTime - moveTime)) * this.speedModifier);
    const yv = (((downY - upY) / (upTime - moveTime)) * this.speedModifier);

    // let xvel = 0;
    // let yvel = 0;

    // if (xv > 0) {
    //   xvel = Math.min(xv, this.maxVelocityX);
    // }
    // else if (xv <= 0) {
    //   xvel = Math.max(xv, -this.maxVelocityX);
    // }

    // this.cat.body.setVelocityX(xvel);

    // this.cat.body.setVelocityY(yv);

    this.cat.body.setVelocity(xv, yv);

    this.cat.setAlpha(1);

    this.pointerIsDown = false;
    this.initWorldX = null;
    this.initWorldY = null;
  }

  update() {
    const grounded = this.cat.body.blocked.down;

    if (this.cat.body.velocity.x > 0) {
      this.cat.setFlipX(false);
    }
    else if (this.cat.body.velocity.x < 0) {
      this.cat.setFlipX(true);
    }

    if (grounded && this.cat.body.velocity.x !== 0) {
      this.cat.play({ key: 'hara-run', frameRate: 10, repeat: -1 }, true);
    }
    else if (grounded) {
      this.cat.play({ key: 'hara-idle', frameRate: 6, repeat: -1 }, true);
    }
    else if (this.cat.body.velocity.y < 0) {
      this.cat.play({ key: 'hara-jump', frameRate: 12, repeat: 0 });
    }
    else if (this.cat.body.velocity.y >= 0) {
      this.cat.play({ key: 'hara-fall', frameRate: 1, repeat: 0 });
    }
  }

}
export default GameScene;
