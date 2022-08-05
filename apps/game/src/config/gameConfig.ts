import Phaser from 'phaser'
import constants from '@/constants'
import SceneList from '@/config/sceneList'
import plugins from '@/config/pluginsConfig'

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Dont Touch',
  version: '0.0.15',
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: constants.COLORS.DEFAULT.BACKGROUND,
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
        y: 3,
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
  dom: {
    createContainer: true,
  },
  scene: SceneList,
  plugins,
}

export default gameConfig
