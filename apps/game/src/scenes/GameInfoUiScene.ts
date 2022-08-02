import Phaser from 'phaser'
import i18next from 'i18next'
import constants from '@/constants'

export default class GameInfoUiScene extends Phaser.Scene {
  constructor() {
    super(constants.SCENES.GAME_INFO_UI)
  }

  create() {
    this.addGameTitle()
    this.addBestScore()
    this.addGamesPlayed()
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
}
