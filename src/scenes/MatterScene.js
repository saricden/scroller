import {Scene, Math as pMath} from 'phaser';
import Hara from '../sprites/Hara';

const velocityToTarget = (from, to, speed = 1) => {
  const direction = Math.atan((to.x - from.x) / (to.y - from.y));
  const speed2 = to.y >= from.y ? speed : -speed;
 
  return { velX: speed2 * Math.sin(direction), velY: speed2 * Math.cos(direction) };
 };

class MatterScene extends Scene {

  constructor() {
    super("scene-matter");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x33CCFF);
    
    this.map = this.make.tilemap({ key: 'map-basic' });
    const tileset = this.map.addTilesetImage('ts-basic');
    const layer = this.map.createDynamicLayer('solid', tileset);
    
    layer.setCollisionByProperty({ collides: true });

    this.matter.world.convertTilemapLayer(layer);

    this.hara = new Hara(this, 50, 50);

    for (let i = 0; i < 5; i++) {
      this.matter.add.image(500 + 100 * i, 0, 'cat-like', {
        restitution: 1,
        friction: 0
      }).setScale(0.2);
    }

    // Add, scale, and make up a speed for our creature
    // this.cat = this.physics.add.sprite(50, 50, 'hara');

    // this.physics.add.collider(this.cat, layer);
    
    this.cameras.main.startFollow(this.hara.sprite);
    this.cameras.main.setZoom(3);

    this.input.on('pointerdown', this.pointerDown, this);
    this.input.on('pointermove', this.pointerMove, this);
    this.input.on('pointerup', this.pointerUp, this);
    this.input.on('pointerupoutside', this.pointerUp, this);

    this.pointerIsDown = false;
    this.initWorldX = null;
    this.initWorldY = null;
    this.speedModifier = 0.5;
    this.panVelocity = 100;
  }

  pointerDown(pointer) {
    const {worldX, worldY} = pointer;
    this.pointerIsDown = true;
    this.initWorldX = worldX;
    this.initWorldY = worldY;
    this.hara.sprite.setVelocity(0);
  }

  pointerMove(pointer) {
    if (this.pointerIsDown) {
      const {worldX, worldY} = pointer;

      const panX = (this.initWorldX - worldX);
      const panY = (this.initWorldY - worldY);

      const nx = (this.hara.sprite.x + panX);
      const ny = (this.hara.sprite.y + panY);

      // this.physics.moveTo(this.hara, this.hara.x + panX, this.hara.y + panY, this.panVelocity, 50);

      const v2p = velocityToTarget(
        {
          x: this.hara.sprite.x,
          y: this.hara.sprite.y
        },
        {
          x: nx,
          y: ny
        },
        2
      );

      if (!isNaN(v2p.velX) && !isNaN(v2p.velY)) {
        this.hara.sprite.setVelocity(v2p.velX, v2p.velY);
      }

      console.log(v2p);

      // this.hara.sprite.setPosition(nx, ny);

      this.hara.sprite.setAlpha(0.5);
    }
  }

  pointerUp(pointer) {
    const {upX, downX, upY, downY, upTime, moveTime} = pointer;

    const xv = (((downX - upX) / (upTime - moveTime)) * this.speedModifier);
    const yv = (((downY - upY) / (upTime - moveTime)) * this.speedModifier);
    
    if (xv > 0) {
      this.hara.sprite.setFlipX(false);
    }
    else if (xv < 0) {
      this.hara.sprite.setFlipX(true);
    }

    this.hara.sprite.setVelocity(xv, yv);

    this.hara.sprite.setAlpha(1);

    this.pointerIsDown = false;
    this.initWorldX = null;
    this.initWorldY = null;
  }

  update() {
    const grounded = this.hara.isTouching.ground;

    if (grounded && this.hara.sprite.body.velocity.x !== 0) {
      this.hara.sprite.play({ key: 'hara-run', frameRate: 10, repeat: -1 }, true);
    }
    else if (grounded) {
      this.hara.sprite.play({ key: 'hara-idle', frameRate: 6, repeat: -1 }, true);
    }
    else if (this.hara.sprite.body.velocity.y < 0) {
      this.hara.sprite.play({ key: 'hara-jump', frameRate: 12, repeat: 0 });
    }
    else if (this.hara.sprite.body.velocity.y >= 0) {
      this.hara.sprite.play({ key: 'hara-fall', frameRate: 1, repeat: 0 });
    }
  }

}
export default MatterScene;
