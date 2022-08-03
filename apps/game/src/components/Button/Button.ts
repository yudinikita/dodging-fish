import { Label } from 'phaser3-rex-plugins/templates/ui/ui-components'
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas'

type ButtonConfig = {
  texture: string
  frameIcon: string
  backgroundColor?: number
  backgroundColorOver?: number
}

export default class Button extends Label {
  public isDisabled = false

  private config: ButtonConfig

  constructor(scene: Phaser.Scene, config: ButtonConfig) {
    super(scene, {
      background: Button.createBackground(scene, config),
      icon: Button.createIcon(scene, config),
      space: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 30,
      },
      name: 'button',
    })

    this.config = config

    scene.add.existing(this)
  }

  public setOver() {
    const background = this.getElement('background') as RoundRectangleCanvas
    const icon = this.getElement('icon') as Phaser.GameObjects.Image

    this.scene.tweens.add({
      targets: icon,
      scale: 1.3,
      duration: 250,
      ease: 'Sine.easeInOut',
    })

    background.setFillStyle(this.config.backgroundColorOver)

    return this
  }

  public setDisabled() {
    this.isDisabled = true

    const background = this.getElement('background') as RoundRectangleCanvas
    const icon = this.getElement('icon') as Phaser.GameObjects.Image

    background.setTint(0x89_89_89)
    icon.setTint(0x89_89_89)

    return this
  }

  public setDefaultStyle() {
    const background = this.getElement('background') as RoundRectangleCanvas
    const icon = this.getElement('icon') as Phaser.GameObjects.Image

    this.scene.tweens.add({
      targets: icon,
      scale: 1,
      duration: 250,
      ease: 'Sine.easeInOut',
    })

    background.setFillStyle(this.config.backgroundColor)
    background.clearTint()
    icon.clearTint()

    return this
  }

  private static createBackground(scene: Phaser.Scene, config: ButtonConfig) {
    const background = new RoundRectangleCanvas(
      scene,
      0,
      0,
      0,
      0,
      {
        radius: 40,
      },
      config.backgroundColor
    ).setName('background')

    scene.add.existing(background)

    return background
  }

  private static createIcon(scene: Phaser.Scene, config: ButtonConfig) {
    const icon = scene.add
      .image(0, 0, config.texture, config.frameIcon)
      .setOrigin(0.5, 0.5)
    icon.setName('icon')

    scene.add.existing(icon)

    return icon
  }
}
