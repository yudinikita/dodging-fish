import Phaser from 'phaser'
import i18next from 'i18next'
import constants from '@/constants'

type GameInfoUiData = {
  color: number
}

export default class GameInfoUiScene extends Phaser.Scene {
  private color?: number
  private gameTitle!: Phaser.GameObjects.Text
  private bestScoreText!: Phaser.GameObjects.Text
  private gamesPlayedText!: Phaser.GameObjects.Text

  constructor() {
    super(constants.SCENES.GAME_INFO_UI)
  }

  init(data: GameInfoUiData) {
    this.color = data.color
  }

  create() {
    this.addGameTitle()
    this.addBestScore()
    this.addGamesPlayed()
    this.addResumeEvent()

    if (this.color) {
      this.changeColor(this.color)
    }
  }

  private changeColor(color: number) {
    const colorString = '#' + Phaser.Display.Color.ComponentToHex(color)
    this.gameTitle.setColor(colorString)
    this.bestScoreText.setColor(colorString)
    this.gamesPlayedText.setColor(colorString)
  }

  private addResumeEvent() {
    this.events.on(
      Phaser.Scenes.Events.RESUME,
      (scene: Phaser.Scene, { color }: { color: number }) => {
        if (color) {
          this.changeColor(color)
        }
      },
      this
    )
  }

  private addGameTitle() {
    const { width } = this.cameras.main

    this.gameTitle = this.add
      .text(width / 2, 250, 'DODGING FISH', {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '112px',
        color: constants.COLORS.DEFAULT.SPIKE,
      })
      .setOrigin(0.5, 0.5)
  }

  private addBestScore() {
    const { width, height } = this.cameras.main

    this.bestScoreText = this.add
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

    this.gamesPlayedText = this.add
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
