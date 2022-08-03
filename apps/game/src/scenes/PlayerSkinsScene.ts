import Phaser from 'phaser'
import Anchor from 'phaser3-rex-plugins/plugins/behaviors/anchor/Anchor'
import { Buttons } from 'phaser3-rex-plugins/templates/ui/ui-components'
import LocalStorageData from 'phaser3-rex-plugins/plugins/localstorage-data'
import type { SkinType } from '@/components/SkinSelectPanel/SkinSelectPanel'
import constants from '@/constants'
import Button from '@/components/Button'
import SkinSelectPanel from '@/components/SkinSelectPanel'
import DialogBuy from '@/components/DialogBuy'

export default class PlayerSkinsScene extends Phaser.Scene {
  private skins: SkinType[] = []
  private countText!: Phaser.GameObjects.Text

  constructor() {
    super(constants.SCENES.PLAYER_SKINS)
  }

  create() {
    this.addBackground()
    this.addCountSkins()
    this.addButtons()
    this.loadAllSkins()
    this.addSelectPanel()
  }

  private addBackground() {
    const { width, height } = this.cameras.main
    this.add
      .rectangle(0, 0, width, height, 0x2b_af_f6, 0.9)
      .setOrigin(0, 0)
      .setInteractive()
  }

  private addSelectPanel() {
    const selectPanel = new SkinSelectPanel(
      this,
      0,
      0,
      this.skins,
      (selectItem: Button) => {
        const localStorageScene = this.scene.get(constants.SCENES.LOCAL_STORAGE)
        const localStorageData = localStorageScene.data.get(
          'localStorageData'
        ) as LocalStorageData

        const fishes = localStorageData.get('fishes') as string

        if (fishes.includes(selectItem.frame.name)) {
          localStorageData.set('selectFish', selectItem.frame.name)
          selectItem.setOver()
        } else {
          const dialog = new DialogBuy(this, selectItem.frame.name)

          dialog.on('button.click', (button: Button) => {
            if (button.frame.name === 'back') {
              dialog.closeModal()
            } else if (
              button.frame.name === 'like' &&
              localStorageData.get('roe') > constants.FISH.BUY_COST
            ) {
              localStorageData.set('selectFish', selectItem.frame.name)
              localStorageData.set('fishes', [...fishes, selectItem.frame.name])

              selectItem.setDefaultStyle()
              selectItem.setOver()

              localStorageData.inc('roe', constants.FISH.BUY_COST * -1)

              dialog.closeModal()
            }
          })

          dialog.on('button.over', (button: Button) => {
            if (!button.isDisabled) {
              button.setOver()
            }
          })

          dialog.on('button.out', (button: Button) => {
            if (!button.isDisabled) {
              button.setDefaultStyle()
            }
          })
        }
      }
    )

    const localStorageScene = this.scene.get(constants.SCENES.LOCAL_STORAGE)
    const localStorageData = localStorageScene.data.get(
      'localStorageData'
    ) as LocalStorageData

    const selectFish = localStorageData.get('selectFish') as string

    selectPanel.selectItem(selectFish)
  }

  private loadAllSkins() {
    if (this.skins.length === 0) {
      for (let index = 1; index <= constants.FISH.COUNT; index++) {
        const frameIndex = Phaser.Utils.String.Pad(index, 2, '0', 1)
        const frameIcon = `fish_${frameIndex}a`

        this.skins.push({
          texture: 'fish',
          frameIcon,
        })
      }
    }
  }

  private addCountSkins() {
    const localStorageScene = this.scene.get(constants.SCENES.LOCAL_STORAGE)
    const localStorageData = localStorageScene.data.get(
      'localStorageData'
    ) as LocalStorageData

    localStorageData.events.on(
      'changedata-fishes',
      (_: any, fishes: string[]) => {
        this.countText.setText(`${fishes.length}/${constants.FISH.COUNT}`)
      },
      this
    )

    const currentSkins = localStorageData.get('fishes') as string[]

    const currentSkinsCount = currentSkins.length
    const allSkinsCount = constants.FISH.COUNT

    this.countText = this.add
      .text(0, 0, `${currentSkinsCount}/${allSkinsCount}`, {
        fontSize: '126px',
        fontFamily: constants.FONT.FAMILY,
        color: '#ffffff',
        align: 'left',
      })
      .setOrigin(1, 0)

    new Anchor(this.countText, {
      x: 'right-50',
      y: 'top+100',
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
        switch (index) {
          case 0:
            this.scene.stop()
        }
      },
      this
    )
  }
}
