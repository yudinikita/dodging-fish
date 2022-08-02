import Phaser from 'phaser'
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas'
import i18next from 'i18next'
import constants from '@/constants'
import getCurrentColor from '@/helpers/getCurrentColor'

type GameOverData = {
  score: number
}

export default class GameOverScene extends Phaser.Scene {
  private score = 0

  constructor() {
    super(constants.SCENES.GAME_OVER)
  }

  init(data: GameOverData) {
    this.score = data.score
  }

  create() {
    this.addBackgroundScore()
    this.addScore()
    this.startMainMenuEvent()

    this.scene.resume(constants.SCENES.GAME_INFO_UI, {
      color: getCurrentColor(this.score).spike,
    })
    this.scene.setVisible(true, constants.SCENES.GAME_INFO_UI)
  }

  private addBackgroundScore() {
    const { centerX, centerY } = this.cameras.main

    const rect = new RoundRectangleCanvas(
      this,
      centerX,
      centerY,
      700,
      700,
      {
        radius: 75,
      },
      constants.COLORS.ACCENT
    )
    this.add.existing(rect)
  }

  private addScore() {
    const { centerX, centerY } = this.cameras.main

    this.add
      .text(centerX, centerY - 200, i18next.t('Score'), {
        fontSize: '52px',
        fontFamily: constants.FONT.FAMILY,
        align: 'center',
      })
      .setOrigin(0.5, 0.5)

    this.add
      .text(centerX, centerY, String(this.score || 0), {
        fontSize: '300px',
        fontFamily: constants.FONT.FAMILY,
        align: 'center',
      })
      .setOrigin(0.5, 0.5)
  }

  private startMainMenuEvent() {
    this.input.on(
      'pointerdown',
      () => {
        this.scene.stop(constants.SCENES.GAME_FIELD)
        this.scene.stop(constants.SCENES.GAME_INFO_UI)
        this.scene.stop()

        this.scene.start(constants.SCENES.MAIN_MENU)
      },
      this
    )
  }
}
