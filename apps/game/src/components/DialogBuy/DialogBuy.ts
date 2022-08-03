import { Dialog } from 'phaser3-rex-plugins/templates/ui/ui-components.js'
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas'
import { Label } from 'phaser3-rex-plugins/templates/ui/ui-components'
import i18next from 'i18next'
import LocalStorageData from 'phaser3-rex-plugins/plugins/localstorage-data'
import constants from '@/constants'
import Button from '@/components/Button'

export default class DialogBuy extends Dialog {
  private readonly shadowBackground: Phaser.GameObjects.Rectangle

  constructor(scene: Phaser.Scene, fishName: string) {
    const shadowBackground = createShadowBackground(scene)

    super(scene, {
      anchor: {
        x: 'center',
        y: 'center',
      },

      width: 800,

      background: createBackground(scene),

      title: scene.add.text(0, 0, i18next.t('Buy'), {
        fontSize: '72px',
        fontFamily: constants.FONT.FAMILY,
      }),

      content: scene.add.image(0, 0, 'fish', fishName),

      description: createPrice(scene, constants.FISH.BUY_COST.toString()),

      actions: [createBackButton(scene), createBuyButton(scene)],

      space: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 30,

        title: 50,
        content: 50,
        description: 50,
        choices: 25,

        toolbarItem: 5,
        action: 25,
      },

      expand: {
        title: false,
        content: false,
        description: false,
      },

      align: {
        title: 'center',
        actions: 'right',
        description: 'right',
      },

      click: {
        mode: 'release',
      },
    })

    this.shadowBackground = shadowBackground

    this.layout()
    this.popUp(1000)

    scene.add.existing(this)

    scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      ease: 'Bounce',
      duration: 1000,
      repeat: 0,
      yoyo: false,
    })

    scene.tweens.add({
      targets: this.shadowBackground,
      alpha: 1,
      ease: 'Sine.easeInOut',
      duration: 700,
      repeat: 0,
      yoyo: false,
    })
  }

  public closeModal() {
    this.shadowBackground.destroy()
    this.destroy()
  }
}

const createShadowBackground = (scene: Phaser.Scene) => {
  const { width, height } = scene.cameras.main

  return scene.add
    .rectangle(0, 0, width, height, 0x00_4f_79, 0.5)
    .setOrigin(0, 0)
    .setInteractive()
    .setAlpha(0)
}

const createBackground = (scene: Phaser.Scene) => {
  const background = new RoundRectangleCanvas(
    scene,
    0,
    0,
    500,
    500,
    {
      radius: 50,
    },
    0x00_4f_79
  )
  scene.add.existing(background)
  return background
}

const createBackButton = (scene: Phaser.Scene) => {
  return new Button(scene, {
    texture: 'ui',
    frameIcon: 'back',
    backgroundColor: 0xff_ff_ff,
    backgroundColorOver: 0x2b_af_f6,
  })
}

const createBuyButton = (scene: Phaser.Scene) => {
  const buyButton = new Button(scene, {
    texture: 'ui',
    frameIcon: 'like',
    backgroundColor: 0xff_ff_ff,
    backgroundColorOver: 0x2b_af_f6,
  })

  const localStorageScene = scene.scene.get(constants.SCENES.LOCAL_STORAGE)
  const localStorageData = localStorageScene.data.get(
    'localStorageData'
  ) as LocalStorageData
  const roe = localStorageData.get('roe')

  if (roe < constants.FISH.BUY_COST) {
    buyButton.setDisabled()
  }

  return buyButton
}

const createPrice = (scene: Phaser.Scene, text: string) => {
  return new Label(scene, {
    width: 40,
    height: 40,

    text: scene.add.text(0, 0, text, {
      fontSize: '48px',
      fontFamily: constants.FONT.FAMILY,
    }),

    icon: scene.add.image(0, 0, 'roe', 'roe_1'),

    space: {
      right: 0,
      icon: 25,
    },
  })
}
