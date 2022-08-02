export default class Roe extends Phaser.Physics.Matter.Image {
  private value = 0
  private tween?: Phaser.Tweens.Tween

  constructor(scene: Phaser.Scene, x: number, y: number, value = 0) {
    super(scene.matter.world, x, y, 'roe', 'roe_1')
    this.scene.add.existing(this)

    this.value = value

    this.setCircle(this.width / 2, {
      label: 'roe',
    })

    this.setStatic(true)
    this.setSensor(true)

    this.spawn(x, y)
  }

  public spawn(x: number, y: number) {
    this.setActive(true)
    this.setVisible(true)
    this.setPosition(x, y)

    this.addAnimation()
  }

  public remove() {
    this.tween?.remove()
    this.destroy(true)
  }

  private addAnimation() {
    this.tween = this.scene.add.tween({
      targets: this,
      duration: 750,
      y: this.y - this.height,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    })
  }

  public get getValue() {
    return this.value
  }

  public set setValue(value: number) {
    this.value = value
  }
}
