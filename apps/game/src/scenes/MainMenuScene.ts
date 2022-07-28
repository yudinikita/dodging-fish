import Phaser from 'phaser'
import constants from '../constants'

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super(constants.SCENES.MAIN_MENU)
  }

  create() {
    this.matter.world.setBounds(0, 0, constants.WIDTH, constants.HEIGHT)

    const rect = this.matter.add.image(
      constants.WIDTH / 2,
      constants.HEIGHT / 2,
      'bird_001',
      0,
      {}
    )

    rect.setScale(0.3)

    rect.setRectangle(80, 40, {
      chamfer: { radius: [22, 22, 22, 22] },
    })

    rect.setOrigin(0.5, 0.5)

    // отключение вращения
    this.matter.body.setInertia(
      <MatterJS.BodyType>rect.body,
      Number.POSITIVE_INFINITY
    )

    // rect.setVelocity(3, 1)
    // rect.setAngularVelocity(0.01)
    rect.setBounce(0.5)
    rect.setFriction(0, 0, 0)

    //this.matter.add.mouseSpring()

    this.add.text(0, 0, 'Dodging Fish', {
      fontFamily: constants.FONT.FAMILY,
      fontSize: '46px',
      color: constants.FONT.COLOR,
    })

    const vel = {
      x: 3,
      y: -3,
    }

    this.input.on(
      'pointerdown',
      () => {
        rect.setVelocity(vel.x, vel.y)
      },
      this
    )

    this.matter.world.on('collisionstart', (_event: any, b1: any) => {
      if (b1.id === 2) {
        vel.x = 3
        rect.setFlipX(false)
      } else if (b1.id === 3) {
        vel.x = -3
        rect.setFlipX(true)
      } else {
        rect.setVelocity(0, 0)
        rect.setPosition(constants.WIDTH / 2, constants.HEIGHT / 2)
      }
    })
  }
}
