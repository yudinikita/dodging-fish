import { Toast as ToastUi } from 'phaser3-rex-plugins/templates/ui/ui-components'
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas'
import constants from '@/constants'

export default class Toast extends ToastUi {
  constructor(scene: Phaser.Scene) {
    super(scene, {
      anchor: {
        x: 'center',
        y: 'bottom-200',
      },

      background: createBackground(scene),

      text: scene.add.text(0, 0, '', {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '48px',
      }),

      space: {
        left: 70,
        right: 70,
        top: 50,
        bottom: 50,
      },
    })
    scene.add.existing(this)
  }
}

const createBackground = (scene: Phaser.Scene) => {
  const background = new RoundRectangleCanvas(
    scene,
    0,
    0,
    500,
    500,
    {
      radius: 50,
    },
    0x00_4f_79
  )
  scene.add.existing(background)
  return background
}
