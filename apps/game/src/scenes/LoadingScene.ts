import Phaser from 'phaser'
import CircularProgressCanvas from 'phaser3-rex-plugins/plugins/circularprogresscanvas.js'
import constants from '@/constants'

export default class LoadingScene extends Phaser.Scene {
  private circularProgress!: CircularProgressCanvas

  constructor() {
    super(constants.SCENES.LOADING)
  }

  preload() {
    this.load.baseURL = 'assets/'

    this.addLoader()
    this.addLoaderEvents()

    this.loadResources()
  }

  create() {
    this.input.setDefaultCursor(constants.CURSOR.DEFAULT)
  }

  private addLoader() {
    const { width, height } = this.cameras.main
    this.circularProgress = new CircularProgressCanvas(this, {
      x: width / 2,
      y: height / 2,
      radius: 50,

      trackColor: '#2442A4',
      barColor: '#fff',

      textSize: '26px',
      textStyle: 'bold',
      textFormatCallback: function (value) {
        return (100 - Math.floor(value * 100)).toString()
      },
      textColor: constants.FONT.COLOR,
      textFamily: constants.FONT.FAMILY,

      valuechangeCallback(
        newValue: number,
        oldValue: number,
        circularProgress: CircularProgressCanvas
      ): void {},

      value: 0,
    })
    this.add.existing(this.circularProgress)
  }

  private addLoaderEvents() {
    this.load.on(Phaser.Loader.Events.PROGRESS, (value: number) => {
      this.circularProgress.easeValueTo(value)
    })

    this.load.on(Phaser.Loader.Events.COMPLETE, () => {
      this.circularProgress.destroy()

      this.scene.stop(constants.SCENES.LOADING)

      this.scene.start(constants.SCENES.GAME_FIELD)
      this.scene.pause(constants.SCENES.GAME_FIELD)

      this.scene.start(constants.SCENES.MAIN_MENU)
    })
  }

  private loadResources() {
    this.load.image('fish_death', 'sprites/fish_death.png')

    this.load.atlas(
      'fish',
      'spritesheets/fishes.png',
      'spritesheets/fishes.json'
    )

    this.load.image('particle_fish_001', 'sprites/particle_fish_001.png')
  }
}
