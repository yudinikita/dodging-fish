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
      radius: 150,

      trackColor: '#004F79',
      barColor: '#2BAFF6',

      textSize: '86px',
      textStyle: 'bold',
      textFormatCallback: function (value) {
        return (100 - Math.floor(value * 100)).toString()
      },
      textColor: '#004F79',
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

      this.scene.launch(constants.SCENES.LOCAL_STORAGE)

      this.scene.launch(constants.SCENES.GAME_FIELD)
      this.scene.pause(constants.SCENES.GAME_FIELD)

      this.scene.launch(constants.SCENES.MAIN_MENU)
    })
  }

  private loadResources() {
    this.load.atlas('ui', 'spritesheets/ui.png', 'spritesheets/ui.json')

    this.load.atlas('fish', 'spritesheets/fish.png', 'spritesheets/fish.json')

    this.load.atlas(
      'particle',
      'spritesheets/particle.png',
      'spritesheets/particle.json'
    )

    this.load.atlas('roe', 'spritesheets/roe.png', 'spritesheets/roe.json')

    this.load.image('fish_death', 'sprites/fish_death.png')
    this.load.image('gift', 'sprites/gift.png')

    this.load.audioSprite('sfx', 'sfx/sfxSprite.json', 'sfx/sfxSprite.ogg')
  }
}
