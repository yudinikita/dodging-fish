import Phaser from 'phaser'
import constants from '@/constants'
import SceneList from '@/config/sceneList'

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Dont Touch',
  version: '1.0.0',
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#3e66d2',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: constants.SCALE,
    width: constants.WIDTH,
    height: constants.HEIGHT,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: constants.DEBUG,
      gravity: {
        y: 0.3,
      },
    },
  },
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: true,
    roundPixels: true,
  },
  autoFocus: true,
  scene: SceneList,
}

export default gameConfig
