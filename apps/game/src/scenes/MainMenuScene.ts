import Phaser from 'phaser'
import constants from '@/constants'
import Wall from '@/components/Wall/Wall'

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super(constants.SCENES.MAIN_MENU)
  }

  create() {
    const { width, height } = this.cameras.main

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
      0
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
      label: 'player',
    })

    player.setOrigin(0.5, 0.5)

    // отключение вращения
    this.matter.body.setInertia(
      <MatterJS.BodyType>player.body,
      Number.POSITIVE_INFINITY
    )

    player.setBounce(0.5)
    player.setFriction(0, 0, 0)

    const wallLeft = new Wall(this, {
      x: 2,
      y: height / 2,
      width: 2,
      height,
      label: 'wallLeft',
      alpha: 0,
    })
    const wallRight = new Wall(this, {
      x: width - 2,
      y: height / 2,
      width: 2,
      height,
      label: 'wallRight',
      alpha: 0,
    })

    const wallTop = new Wall(this, {
      x: width / 2,
      y: 0,
      width,
      height: 150,
      label: 'wallTop',
      color: 0xcc_cc_cc,
      alpha: 1,
    })
    const wallBottom = new Wall(this, {
      x: width / 2,
      y: height,
      width,
      height: 150,
      label: 'wallBottom',
      color: 0xcc_cc_cc,
      alpha: 1,
    })

    this.add
      .text(width / 2, 10, 'Dodging Fish', {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '36px',
        color: constants.FONT.COLOR,
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0)

    const score = player.data.get('score')
    scoreText.setText(score)

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
          } else if ([bodyA.label, bodyB.label].includes('wallRight')) {
            vel.x = -3
            player.setFlipX(true)
            player.data.values.score++
            const randomColor = 0x1_00_00_00 + Math.random() * 0xff_ff_ff
            wallTop.changeColor(randomColor)
            wallBottom.changeColor(randomColor)
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
          }
        }
      }
    )
  }
}
