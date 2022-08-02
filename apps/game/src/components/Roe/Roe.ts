import constants from '@/constants'

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
    this.setAlpha(0)
    this.scene.add.tween({
      targets: this,
      duration: 250,
      alpha: {
        from: 0,
        to: 1,
      },
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.addAnimation()
      },
    })

    this.setActive(true)
    this.setVisible(true)
    this.setPosition(x, y)
  }

  public remove() {
    this.tween?.remove()
    this.destroy(true)
  }

  public showTakenValue() {
    this.scene.floatingNumbers.createFloatingText({
      textOptions: {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '72px',
        color: '#FC4100',
      },
      align: 'top-center',
      animation: 'up',
      animationEase: 'Sine.easeInOut',
      text: '+' + this.value,
      offsetY: this.height,
      parentObject: this,
    })
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
