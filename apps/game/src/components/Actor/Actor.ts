export default class Actor extends Phaser.Physics.Matter.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene.matter.world, x, y, texture, frame)

    scene.add.existing(this)
  }
}
