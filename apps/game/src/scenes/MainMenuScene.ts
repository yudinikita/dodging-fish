import i18next from 'i18next'
import { Buttons } from 'phaser3-rex-plugins/templates/ui/ui-components'
import LocalStorageData from 'phaser3-rex-plugins/plugins/localstorage-data'
import constants from '@/constants'
import Button from '@/components/Button'

export default class MainMenuScene extends Phaser.Scene {
  private playPanel!: Phaser.GameObjects.Rectangle
  private playerSkin!: Phaser.GameObjects.Image

  constructor() {
    super(constants.SCENES.MAIN_MENU)
  }

  create() {
    this.addTapToJump()
    this.addPlayerSkin()
    this.addInfoUi()

    this.addPlayPanel()
    this.startGameEvent()

    this.addResumeEvent()
    this.addChangeSkinEvent()

    this.addButtonUi()
  }

  private startGameEvent() {
    this.playPanel.on(
      'pointerdown',
      () => {
        this.scene.pause()
        this.scene.setVisible(false)

        this.scene.pause(constants.SCENES.GAME_INFO_UI)
        this.scene.setVisible(false, constants.SCENES.GAME_INFO_UI)

        this.scene.launch(constants.SCENES.GAME_FIELD)
      },
      this
    )
  }

  private addResumeEvent() {
    this.events.on(Phaser.Scenes.Events.START, () => {
      this.scene.launch(constants.SCENES.GAME_FIELD)
      this.scene.pause(constants.SCENES.GAME_FIELD)

      this.scene.launch(constants.SCENES.GAME_INFO_UI)
    })
  }

  private addInfoUi() {
    this.scene.run(constants.SCENES.GAME_INFO_UI)
  }

  private addTapToJump() {
    const { width, height } = this.cameras.main

    this.add
      .text(
        width / 2,
        height / 2 - 250,
        i18next.t('Tap to jump').toUpperCase(),
        {
          fontFamily: constants.FONT.FAMILY,
          fontSize: '54px',
          color: constants.COLORS.ACCENT,
          align: 'center',
        }
      )
      .setOrigin(0.5, 0.5)
  }

  private addPlayerSkin() {
    const { width, height } = this.cameras.main

    const localStorageScene = this.scene.get(constants.SCENES.LOCAL_STORAGE)
    const localStorageData = localStorageScene.data.get(
      'localStorageData'
    ) as LocalStorageData
    const selectFish = localStorageData.get('selectFish') as string

    this.playerSkin = this.add
      .image(width / 2, height / 2, 'fish', selectFish)
      .setScale(1.3)

    this.add.tween({
      targets: this.playerSkin,
      y: height / 2 + 70,
      duration: 700,
      repeat: -1,
      yoyo: true,
      ease: 'Sine.easeInOut',
    })
  }

  private addPlayPanel() {
    const { centerX, centerY } = this.cameras.main
    this.playPanel = this.add
      .rectangle(centerX, centerY, 600, 800, 0x00_00_00, 0)
      .setOrigin(0.5, 0.5)
      .setInteractive()
  }

  private addButtonUi() {
    const defaultStyle = {
      texture: 'ui',
      backgroundColor: 0x2b_af_f6,
      backgroundColorOver: 0x00_4f_79,
    }

    const skinsButton = new Button(this, {
      frameIcon: 'fish',
      ...defaultStyle,
    })
    const shopButton = new Button(this, {
      frameIcon: 'gift',
      ...defaultStyle,
    })
    const settingsButton = new Button(this, {
      frameIcon: 'settings',
      ...defaultStyle,
    })

    const buttons = new Buttons(this, {
      x: 200,
      y: 200,
      anchor: {
        centerX: 'right-125',
        centerY: 'center',
      },
      orientation: 'vertical',
      buttons: [skinsButton, shopButton, settingsButton],
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
            this.scene.launch(constants.SCENES.PLAYER_SKINS)
            break
          case 1:
            this.scene.launch(constants.SCENES.SHOP)
            break
          case 2:
            this.scene.launch(constants.SCENES.SETTINGS)
            break
        }
      },
      this
    )
  }

  private addChangeSkinEvent() {
    const localStorageScene = this.scene.get(constants.SCENES.LOCAL_STORAGE)
    const localStorageData = localStorageScene.data.get(
      'localStorageData'
    ) as LocalStorageData
    localStorageData.events.on(
      'changedata-selectFish',
      (_: any, selectSkin: string) => {
        this.playerSkin.setFrame(selectSkin)
      }
    )
  }
}
