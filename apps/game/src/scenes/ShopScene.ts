import Phaser from 'phaser'
import { Buttons } from 'phaser3-rex-plugins/templates/ui/ui-components'
import Anchor from 'phaser3-rex-plugins/plugins/behaviors/anchor/Anchor'
import { Label } from 'phaser3-rex-plugins/templates/ui/ui-components'
import ShakePosition from 'phaser3-rex-plugins/plugins/shakeposition'
import LocalStorageData from 'phaser3-rex-plugins/plugins/localstorage-data'
import i18next from 'i18next'
import constants from '@/constants'
import Button from '@/components/Button'
import Toast from '@/components/Toast'
import DialogGift from '@/components/DialogGift'
import getNewRandomFish from '@/helpers/getNewRandomFish'

export default class ShopScene extends Phaser.Scene {
  private gift!: Label

  constructor() {
    super(constants.SCENES.SHOP)
  }

  create() {
    this.addBackground()
    this.addTitle()
    this.addButtons()
    this.addGift()
  }

  private addBackground() {
    const { width, height } = this.cameras.main
    this.add
      .rectangle(0, 0, width, height, 0x2b_af_f6, 0.9)
      .setOrigin(0, 0)
      .setInteractive()
  }

  private addTitle() {
    const title = this.add
      .text(0, 0, i18next.t('Shop'), {
        fontSize: '126px',
        fontFamily: constants.FONT.FAMILY,
        color: '#ffffff',
        align: 'right',
      })
      .setOrigin(1, 0.5)

    new Anchor(title, {
      x: 'right-50',
      y: 'top+180',
    })
  }

  private addButtons() {
    const backButton = new Button(this, {
      texture: 'ui',
      frameIcon: 'back',
      backgroundColor: 0xff_ff_ff,
      backgroundColorOver: 0x00_4f_79,
    })

    const buttons = new Buttons(this, {
      x: 0,
      y: 0,
      anchor: {
        centerX: 'left+120',
        centerY: 'top+180',
      },
      orientation: 'horizontal',
      buttons: [backButton],
      space: {
        item: 50,
      },
    }).layout()
    this.add.existing(buttons)

    buttons.on(
      'button.over',
      (button: Button) => {
        button.setOver()
      },
      this
    )

    buttons.on(
      'button.out',
      (button: Button) => {
        button.setDefaultStyle()
      },
      this
    )

    buttons.on(
      'button.click',
      (button: Button, index: number) => {
        this.game.sound.playAudioSprite('sfx', 'button')

        switch (index) {
          case 0:
            this.scene.stop()
        }
      },
      this
    )
  }

  private addGift() {
    const priceLabel = new Label(this, {
      text: this.add.text(0, 0, constants.FISH.GIFT_COST.toString(), {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '76px',
      }),

      icon: this.add.image(0, 0, 'roe', 'roe_1'),

      space: {
        icon: 25,
      },
    }).layout()
    this.add.existing(priceLabel)

    this.gift = new Label(this, {
      anchor: {
        centerX: 'center',
        centerY: 'center',
      },

      orientation: 'y',

      text: priceLabel,

      icon: this.add.image(0, 0, 'gift'),

      space: {
        icon: 40,
      },
    })
      .layout()
      .setInteractive()
      .on('pointerover', (_: any) => {
        const icon = this.gift.getElement('icon') as Phaser.GameObjects.Image
        icon.setTint(0xbb_bb_bb)
      })
      .on('pointerout', (_: any) => {
        const icon = this.gift.getElement('icon') as Phaser.GameObjects.Image
        icon.clearTint()
      })
      .on('pointerdown', (_: any) => {
        const localStorageScene = this.scene.get(constants.SCENES.LOCAL_STORAGE)
        const localStorageData = localStorageScene.data.get(
          'localStorageData'
        ) as LocalStorageData

        const playerFishes = localStorageData.get('fishes') as string[]

        const roe = localStorageData.get('roe') as number

        if (playerFishes.length >= constants.FISH.COUNT) {
          this.game.sound.playAudioSprite('sfx', 'error')

          new Toast(this).showMessage(i18next.t('You have all the fish'))
          return
        }

        if (roe < constants.FISH.GIFT_COST) {
          this.game.sound.playAudioSprite('sfx', 'error')

          const lacks = constants.FISH.GIFT_COST - roe
          new Toast(this).showMessage(i18next.t('Missing') + ' ' + lacks)
          return
        }

        this.game.sound.playAudioSprite('sfx', 'victory')

        const icon = this.gift.getElement('icon') as Phaser.GameObjects.Image
        new ShakePosition(icon, {
          mode: 'effect',
          duration: 1500,
          magnitude: 10,
          magnitudeMode: 'decay',
        }).shake()

        const newFish = getNewRandomFish(playerFishes)

        const dialog = new DialogGift(this, newFish)

        dialog.on('button.click', (button: Button) => {
          if (button.frame.name === 'back') {
            this.game.sound.playAudioSprite('sfx', 'button')
            dialog.closeModal()
          } else if (button.frame.name === 'like') {
            this.game.sound.playAudioSprite('sfx', 'button')

            localStorageData.set('selectFish', newFish)

            dialog.closeModal()
          }

          if (!playerFishes.includes(newFish)) {
            localStorageData.set('fishes', [...playerFishes, newFish])
          }
        })

        dialog.on('button.over', (button: Button) => {
          button.setOver()
        })

        dialog.on('button.out', (button: Button) => {
          button.setDefaultStyle()
        })

        localStorageData.inc('roe', constants.FISH.GIFT_COST * -1)
      })

    this.add.existing(this.gift)
  }
}
