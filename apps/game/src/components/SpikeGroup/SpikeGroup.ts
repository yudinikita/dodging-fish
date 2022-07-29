import Spike from '@/components/Spike'
import constants from '@/constants'

type SpikeGroupConfig = {
  x?: number
  y?: number
  count?: number
  maximum?: number
  label?: string
  color?: number
  alpha?: number
  angle?: number
  space?: number
  orientation?: 'horizontal' | 'vertical'
}

export default class SpikeGroup {
  private spikes: Spike[] = []
  private currentSpikes = 0
  private maximumSpikes = 0

  constructor(scene: Phaser.Scene, config: SpikeGroupConfig) {
    const {
      x = 0,
      y = 0,
      count = 0,
      maximum = count,
      label,
      color,
      alpha,
      angle,
      space = 0,
      orientation = 'horizontal',
    } = config

    this.currentSpikes = count
    this.maximumSpikes = maximum

    const spikeWidth = constants.SPIKE.WIDTH
    const spikeHeight = constants.SPIKE.HEIGHT

    for (let index = 0; index < maximum; index++) {
      const spikeX =
        x +
        (orientation === 'horizontal'
          ? index * spikeWidth + spikeWidth / 2 + index * space
          : 0)

      const spikeY =
        y +
        (orientation === 'vertical'
          ? index * spikeWidth + spikeWidth / 2 + index * space
          : 0)

      const spike = new Spike(scene, {
        x: spikeX,
        y: spikeY,
        width: spikeWidth,
        height: spikeHeight,
        label,
        color,
        alpha,
      })

      spike.setAngle(angle)

      this.spikes.push(spike)
    }

    this.hideSpikes()

    this.changeCount(count)
  }

  public setFillStyle(color: number | undefined, alpha?: number | undefined) {
    for (const spike of this.spikes) spike.setFillStyle(color, alpha)

    return this
  }

  private randNumber(min: number, max: number, exclude: number[] = []) {
    let number_ = Math.floor(
      Math.random() * (max - min + 1 - exclude.length) + min
    )
    ;[...exclude]
      .sort((a, b) => a - b)
      .every((exeption) => exeption <= number_ && (number_++, true))
    return number_
  }

  public changeCount(count: number) {
    if (count > this.maximumSpikes) count = this.maximumSpikes
    this.currentSpikes = count

    this.hideSpikes()

    const excludedIndexes = []

    for (const [index, spike] of this.spikes.entries()) {
      if (spike.visible) {
        excludedIndexes.push(index)
      }
    }

    while (excludedIndexes.length < count) {
      const index = this.randNumber(0, this.maximumSpikes - 1, excludedIndexes)

      this.showSpike(index)

      excludedIndexes.push(index)
    }

    return this
  }

  private showSpike(index: number) {
    const spike = this.spikes[index]

    spike.setVisible(true)
    spike.setActive(true)

    // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Matter.Components.Collision.html
    // @ts-ignore
    spike.setCollisionCategory(true)

    return this
  }

  private hideSpikes() {
    for (const spike of this.spikes) {
      spike.setVisible(false)
      spike.setActive(false)

      // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Matter.Components.Collision.html
      // @ts-ignore
      spike.setCollisionCategory(false)
    }

    return this
  }

  public get getCurrentCount() {
    return this.currentSpikes
  }
}
