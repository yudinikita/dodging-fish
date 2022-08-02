export type WallConfig = {
  x: number
  y: number
  width: number
  height: number
  label?: string
  color?: number
  alpha?: number
  isSensor?: boolean
}

export default class Wall extends Phaser.GameObjects.Container {
  private readonly rect: Phaser.GameObjects.Rectangle

  constructor(scene: Phaser.Scene, config: WallConfig) {
    const {
      x,
      y,
      width,
      height,
      label,
      color,
      alpha,
      isSensor = false,
    } = config

    super(scene, x, y)
    scene.add.existing(this)

    this.setSize(width, height)

    this.rect = scene.add.rectangle(0, 0, width, height, color, alpha)
    this.add(this.rect)

    scene.matter.add.gameObject(this, {
      isStatic: true,
      isSensor,
      label: label,
    })
  }

  public setFillStyle(color: number, alpha?: number) {
    this.rect.setFillStyle(color, alpha)

    return this
  }
}
