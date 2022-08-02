import Phaser from 'phaser'
import Actor from '@/components/Actor'

export default class Player extends Actor {
  public velocity: { x: number; y: number }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'fish_001')

    this.velocity = {
      x: 12,
      y: -18,
    }

    this.setScale(1.3)

    this.setRectangle(150, 100, {
      chamfer: { radius: 50 },
      label: 'player',
    })

    this.setOrigin(0.5, 0.5)

    scene.matter.body.setInertia(
      <MatterJS.BodyType>this.body,
      Number.POSITIVE_INFINITY
    )

    this.setBounce(1)
    this.setFriction(0, 0, 0)
  }

  public jump() {
    this.setVelocity(this.velocity.x, this.velocity.y)

    return this
  }

  public flip() {
    this.velocity.x =
      Math.sign(this.velocity.x) === -1
        ? Math.abs(this.velocity.x)
        : Math.abs(this.velocity.x) * -1

    this.setFlipX(!this.flipX)

    return this
  }

  public addVelocity(x: number, y = 0) {
    this.velocity.x =
      Math.sign(this.velocity.x) === -1
        ? (Math.abs(this.velocity.x) + x) * -1
        : this.velocity.x + x

    this.velocity.y =
      Math.sign(this.velocity.y) === -1
        ? (Math.abs(this.velocity.y) + y) * -1
        : this.velocity.y + y

    return this
  }
}
