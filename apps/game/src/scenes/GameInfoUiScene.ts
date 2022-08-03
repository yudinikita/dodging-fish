import Phaser from 'phaser'
import i18next from 'i18next'
import LocalStorageData from 'phaser3-rex-plugins/plugins/localstorage-data'
import constants from '@/constants'

type GameInfoUiData = {
  color: number
}

export default class GameInfoUiScene extends Phaser.Scene {
  private localStorageData!: LocalStorageData
  private color?: number
  private gameTitle!: Phaser.GameObjects.Text
  private bestScoreText!: Phaser.GameObjects.Text
  private gamesPlayedText!: Phaser.GameObjects.Text
  private roeText!: Phaser.GameObjects.Text

  constructor() {
    super(constants.SCENES.GAME_INFO_UI)
  }

  init(data: GameInfoUiData) {
    this.color = data.color
  }

  create() {
    this.addLocalStorageData()
    this.addGameTitle()
    this.addBestScore()
    this.addGamesPlayed()
    this.addRoeText()
    this.addResumeEvent()
    this.addLocalStorageEvents()

    if (this.color) {
      this.changeColor(this.color)
    }
  }

  private addLocalStorageData() {
    const gameInfoUiScene = this.scene.get(constants.SCENES.LOCAL_STORAGE)
    this.localStorageData = gameInfoUiScene.data.get(
      'localStorageData'
    ) as LocalStorageData
  }

  private addLocalStorageEvents() {
    this.localStorageData.events.on(
      'changedata-bestScore',
      () => {
        const bestScore = this.localStorageData.get('bestScore')
        const text = (i18next.t('Best score') + ' ' + bestScore).toUpperCase()
        this.bestScoreText.setText(text)
      },
      this
    )

    this.localStorageData.events.on(
      'changedata-gamesPlayed',
      () => {
        const gamesPlayed = this.localStorageData.get('gamesPlayed')
        const text = (
          i18next.t('Games played') +
          ' ' +
          gamesPlayed
        ).toUpperCase()
        this.gamesPlayedText.setText(text)
      },
      this
    )

    this.localStorageData.events.on(
      'changedata-roe',
      () => {
        this.roeText.setText(String(this.localStorageData.get('roe')))
      },
      this
    )
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
      (scene: Phaser.Scene, { color }: GameInfoUiData) => {
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

    const bestScore = this.localStorageData.get('bestScore') as number
    const text = (i18next.t('Best score') + ' ' + bestScore).toUpperCase()

    this.bestScoreText = this.add
      .text(width / 2, height - 400, text, {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '72px',
        color: constants.COLORS.DEFAULT.SPIKE,
      })
      .setOrigin(0.5, 0.5)
  }

  private addGamesPlayed() {
    const { width, height } = this.cameras.main

    const gamesPlayed = this.localStorageData.get('gamesPlayed') as number
    const text = (i18next.t('Games played') + ' ' + gamesPlayed).toUpperCase()

    this.gamesPlayedText = this.add
      .text(width / 2, height - 300, text, {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '72px',
        color: constants.COLORS.DEFAULT.SPIKE,
      })
      .setOrigin(0.5, 0.5)
  }

  private addRoeText() {
    const { width, height } = this.cameras.main

    const roe = this.localStorageData.get('roe') as number

    this.add.image(width / 2 - 50, height - 500, 'roe', 'roe_1')

    this.roeText = this.add
      .text(width / 2, height - 500, String(roe), {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '72px',
        color: '#FC4100',
        align: 'left',
      })
      .setOrigin(0, 0.5)
  }
}
