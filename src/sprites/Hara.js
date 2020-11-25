import {Physics} from 'phaser';
const {Matter} = Physics.Matter;

class Hara {
  constructor(scene, x, y) {
    this.scene = scene;

    this.sprite = scene.matter.add.sprite(0, 0, 'hara', 0);

    const {Body, Bodies} = Matter;
    const {width: w, height: h} = this.sprite;

    const mainBody = Bodies.rectangle(0, 0, w, h, { chamfer: { radius: 10 } });

    this.sensors = {
      bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
      right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })
    };

    const compoundBody = Body.create({
      parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      frictionStatic: 0,
      frictionAir: 0.02,
      friction: 0.1
    });

    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setOrigin(0.5)
      .setPosition(x, y);
    
    this.isTouching = { left: false, right: false, ground: false };

    // Before matter's update, reset our record of what surfaces the player is touching.
    scene.matter.world.on("beforeupdate", this.resetTouching, this);

    // If a sensor just started colliding with something, or it continues to collide with something,
    // call onSensorCollide
    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });

    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return; // We only care about collisions with physical objects

    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
    }

    else if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
    }

    else if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
      if (pair.separation > 0.5) this.sprite.y -= pair.separation - 0.5;
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
  }
}

export default Hara;