import LocalStorageData from 'phaser3-rex-plugins/plugins/localstorage-data'
import constants from '@/constants'

export default class LocalStorageScene extends Phaser.Scene {
  private localStorageData!: LocalStorageData

  constructor() {
    super(constants.SCENES.LOCAL_STORAGE)
  }

  create() {
    this.addLocalStorageData()
  }

  private addLocalStorageData() {
    this.localStorageData = new LocalStorageData(this, {
      name: constants.SCENES.LOCAL_STORAGE,
      default: {
        bestScore: 0,
        gamesPlayed: 0,
        roe: 0,
        selectFish: 'fish_01a',
        fishes: ['fish_01a', 'fish_02a'],
        soundVolume: 0.5,
      },
    })

    this.data.set('localStorageData', this.localStorageData)
  }
}
