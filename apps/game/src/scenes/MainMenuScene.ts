import Phaser from 'phaser'
import constants from '@/constants'
import Wall from '@/components/Wall'
import SpikeGroup from '@/components/SpikeGroup'

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super(constants.SCENES.MAIN_MENU)
  }

  create() {
    this.matter.world.setBounds(0, 0, constants.WIDTH, constants.HEIGHT)

    const scoreText = this.add
      .text(width / 2, height / 2, '', {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '72px',
        color: constants.FONT.COLOR,
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0.5)

    const player = this.matter.add.image(
      constants.WIDTH / 2,
      constants.HEIGHT / 2,
      'bird_001',
      0,
      {}
    )

    player.setDataEnabled()
    player.data.set('score', 0)
    player.on(
      'changedata-score',
      (gameObject: Phaser.GameObjects.GameObject, value: number) => {
        scoreText.setText(value.toString())
      }
    )

    player.setScale(0.3)

    player.setRectangle(80, 40, {
      chamfer: { radius: [22, 22, 22, 22] },
    })

    player.setOrigin(0.5, 0.5)

    // отключение вращения
    this.matter.body.setInertia(
      <MatterJS.BodyType>player.body,
      Number.POSITIVE_INFINITY
    )

    player.setBounce(0.5)
    player.setFriction(0, 0, 0)

    //this.matter.add.mouseSpring()

    const wallHeight = 45

    const wallTop = new Wall(this, {
      x: width / 2,
      y: wallHeight / 2,
      width,
      height: wallHeight,
      label: 'wallTop',
      color: 0xcc_cc_cc,
      alpha: 1,
    })
    const wallBottom = new Wall(this, {
      x: width / 2,
      y: height - wallHeight / 2,
      width,
      height: wallHeight,
      label: 'wallBottom',
      color: 0xcc_cc_cc,
      alpha: 1,
    })

    const score = player.data.get('score')
    scoreText.setText(score)

    const spikeGroup = new SpikeGroup(this, {
      x: constants.SPIKE.WIDTH / 2,
      y: height - wallHeight - 7,
      count: 7,
      label: 'spike',
      color: 0xcc_cc_cc,
      alpha: 1,
      angle: 0,
      space: 7,
      orientation: 'horizontal',
    })

    const spikeGroup1 = new SpikeGroup(this, {
      x: constants.SPIKE.WIDTH / 2,
      y: wallHeight + 7,
      count: 7,
      label: 'spike',
      color: 0xcc_cc_cc,
      alpha: 1,
      angle: 180,
      space: 7,
      orientation: 'horizontal',
    })

    const spikeGroup2 = new SpikeGroup(this, {
      x: 8,
      y: constants.SPIKE.HEIGHT * 3,
      count: 0,
      maximum: 11,
      label: 'spike',
      color: 0xcc_cc_cc,
      alpha: 1,
      angle: 90,
      space: 7,
      orientation: 'vertical',
    })

    const spikeGroup3 = new SpikeGroup(this, {
      x: width - 8,
      y: constants.SPIKE.HEIGHT * 3,
      count: 0,
      maximum: 11,
      label: 'spike',
      color: 0xcc_cc_cc,
      alpha: 1,
      angle: -90,
      space: 7,
      orientation: 'vertical',
    })

    const vel = {
      x: 3,
      y: -3,
    }

    this.input.on(
      'pointerdown',
      () => {
        player.setVelocity(vel.x, vel.y)
      },
      this
    )

    this.matter.world.on(
      Phaser.Physics.Matter.Events.COLLISION_START,
      (
        _event: Phaser.Physics.Matter.Events.CollisionStartEvent,
        bodyA: Phaser.Types.Physics.Matter.MatterBodyConfig,
        bodyB: Phaser.Types.Physics.Matter.MatterBodyConfig
      ) => {
        if ([bodyA.label, bodyB.label].includes('player')) {
          if ([bodyA.label, bodyB.label].includes('wallLeft')) {
            vel.x = 3
            player.setFlipX(false)
            player.data.values.score++

            const randomColor = 0x1_00_00_00 + Math.random() * 0xff_ff_ff

            wallTop.changeColor(randomColor)
            wallBottom.changeColor(randomColor)

            spikeGroup.setFillStyle(randomColor)
            spikeGroup1.setFillStyle(randomColor)
            spikeGroup2.setFillStyle(randomColor)
            spikeGroup3.setFillStyle(randomColor)

            spikeGroup2.changeCount(0)
            spikeGroup3.changeCount(player.data.values.score)
          } else if ([bodyA.label, bodyB.label].includes('wallRight')) {
            vel.x = -3
            player.setFlipX(true)
            player.data.values.score++

            const randomColor = 0x1_00_00_00 + Math.random() * 0xff_ff_ff

            wallTop.changeColor(randomColor)
            wallBottom.changeColor(randomColor)

            spikeGroup.setFillStyle(randomColor)
            spikeGroup1.setFillStyle(randomColor)
            spikeGroup2.setFillStyle(randomColor)
            spikeGroup3.setFillStyle(randomColor)

            spikeGroup2.changeCount(player.data.values.score)
            spikeGroup3.changeCount(0)
          } else if (
            [bodyA.label, bodyB.label].includes('wallTop') ||
            [bodyA.label, bodyB.label].includes('wallBottom')
          ) {
            vel.x = 3

            player.resetFlip()
            player.setVelocity(0, 0)
            player.setPosition(constants.WIDTH / 2, constants.HEIGHT / 2)
            player.data.values.score = 0

            wallTop.changeColor(0xcc_cc_cc)
            wallBottom.changeColor(0xcc_cc_cc)

            spikeGroup.setFillStyle(0xcc_cc_cc)
            spikeGroup1.setFillStyle(0xcc_cc_cc)
            spikeGroup2.setFillStyle(0xcc_cc_cc)
            spikeGroup3.setFillStyle(0xcc_cc_cc)

            spikeGroup2.changeCount(0)
            spikeGroup3.changeCount(0)
          } else if ([bodyA.label, bodyB.label].includes('spike')) {
            vel.x = 3

            player.resetFlip()
            player.setVelocity(0, 0)
            player.setPosition(constants.WIDTH / 2, constants.HEIGHT / 2)
            player.data.values.score = 0

            wallTop.changeColor(0xcc_cc_cc)
            wallBottom.changeColor(0xcc_cc_cc)

            spikeGroup.setFillStyle(0xcc_cc_cc)
            spikeGroup1.setFillStyle(0xcc_cc_cc)
            spikeGroup2.setFillStyle(0xcc_cc_cc)
            spikeGroup3.setFillStyle(0xcc_cc_cc)

            spikeGroup2.changeCount(0)
            spikeGroup3.changeCount(0)
          }
        }
      }
    })
  }
}
