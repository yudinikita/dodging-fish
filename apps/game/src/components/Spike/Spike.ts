export type SpikeConfig = {
  x: number
  y: number
  label?: string
  color?: number
  alpha?: number
}

export default class Spike extends Phaser.GameObjects.Container {
  private readonly triangle: Phaser.GameObjects.Polygon

  constructor(scene: Phaser.Scene, config: SpikeConfig) {
    const { x, y, label, color, alpha } = config

    super(scene, x, y)
    scene.add.existing(this)

    const trianglePoints = '0 40 70 40 35 0'
    this.triangle = scene.add.polygon(x, y, trianglePoints, color, alpha)

    scene.matter.add.gameObject(this.triangle, {
      isStatic: true,
      label,
      shape: {
        type: 'fromVerts',
        verts: trianglePoints,
        flagInternal: true,
      },
    })
  }

  public changeColor(color: number) {
    this.triangle.setFillStyle(color)
  }
}
