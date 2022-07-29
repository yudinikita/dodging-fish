export type SpikeConfig = {
  x: number
  y: number
  width: number
  height: number
  label?: string
  color?: number
  alpha?: number
}

export default class Spike extends Phaser.GameObjects.Polygon {
  constructor(scene: Phaser.Scene, config: SpikeConfig) {
    const { x, y, width, height, label, color, alpha } = config

    const trianglePoints = `0 ${height} ${width} ${height} ${width / 2} 0`

    super(scene, x, y, trianglePoints, color, alpha)
    scene.add.existing(this)

    scene.matter.add.gameObject(
      this,
      {
        isStatic: true,
        label,
        shape: {
          type: 'fromVerts',
          verts: trianglePoints,
          flagInternal: true,
        },
      },
      true
    )
  }
}
