import i18next from 'i18next'
import constants from '@/constants'

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

    this.startGameEvent()
    this.addResumeEvent()
  }

  private startGameEvent() {
    this.input.on(
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
}
