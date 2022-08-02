import i18next from 'i18next'
import constants from '@/constants'

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super(constants.SCENES.MAIN_MENU)
  }

  create() {
    this.addGameTitle()
    this.addBestScore()
    this.addGamesPlayed()
    this.addTapToJump()
    this.addPlayerSkin()

    this.startGameEvent()
  }

  private startGameEvent() {
    this.input.on(
      'pointerdown',
      () => {
        this.scene.pause()
        this.scene.setVisible(false)
        this.scene.launch(constants.SCENES.GAME_FIELD)
      },
      this
    )
  }

  private addGameTitle() {
    const { width } = this.cameras.main

    this.add
      .text(width / 2, 250, 'DODGING FISH', {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '112px',
        color: constants.COLORS.DEFAULT.SPIKE,
      })
      .setOrigin(0.5, 0.5)
  }

  private addBestScore() {
    const { width, height } = this.cameras.main

    this.add
      .text(
        width / 2,
        height - 400,
        (i18next.t('Best score') + ' 132').toUpperCase(),
        {
          fontFamily: constants.FONT.FAMILY,
          fontSize: '72px',
          color: constants.COLORS.DEFAULT.SPIKE,
        }
      )
      .setOrigin(0.5, 0.5)
  }

  private addGamesPlayed() {
    const { width, height } = this.cameras.main

    this.add
      .text(
        width / 2,
        height - 300,
        (i18next.t('Games played') + ' 860').toUpperCase(),
        {
          fontFamily: constants.FONT.FAMILY,
          fontSize: '72px',
          color: constants.COLORS.DEFAULT.SPIKE,
        }
      )
      .setOrigin(0.5, 0.5)
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

    const player = this.add
      .image(width / 2, height / 2, 'fish', 'fish_001')
      .setScale(1.3)

    this.add.tween({
      targets: player,
      y: height / 2 + 70,
      duration: 700,
      repeat: -1,
      yoyo: true,
      ease: 'Sine.easeInOut',
    })
  }
}
