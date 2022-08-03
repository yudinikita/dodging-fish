import {
  GridSizer,
  ScrollablePanel,
} from 'phaser3-rex-plugins/templates/ui/ui-components'
import LocalStorageData from 'phaser3-rex-plugins/plugins/localstorage-data'
import Button from '@/components/Button'
import constants from '@/constants'

export type SkinType = {
  texture: string
  frameIcon: string
}

export default class SkinSelectPanel extends Phaser.GameObjects.Container {
  private panel!: ScrollablePanel
  private grid!: GridSizer
  private readonly selectCallback!: (selectItem: Button) => void

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    skins: SkinType[],
    selectCallback: (selectItem: Button) => void
  ) {
    super(scene, x, y)
    this.scene.add.existing(this)

    this.selectCallback = selectCallback

    this.addPanel(skins)
  }

  public selectItem(string: string): void {
    const allButtons = this.grid.getChildren()

    const localStorageScene = this.scene.scene.get(
      constants.SCENES.LOCAL_STORAGE
    )
    const localStorageData = localStorageScene.data.get(
      'localStorageData'
    ) as LocalStorageData

    const fishes = localStorageData.get('fishes') as string

    for (const oneButton of allButtons) {
      const button = oneButton as Button

      if (fishes.includes(button.frame.name)) {
        button.setDefaultStyle()

        if (button.frame.name === string) {
          button.setOver()
        }
      } else {
        button.setDisabled()
      }
    }
  }

  private addPlayerItem(skin: SkinType): void {
    const item = new Button(this.scene, {
      texture: skin.texture,
      frameIcon: skin.frameIcon,
      backgroundColorOver: 0x6e_cf_00,
    })

    this.grid.add(item)
  }

  private createGrid(skins: SkinType[]): GridSizer {
    this.grid = new GridSizer(this.scene, {
      x: 0,
      y: 0,
      column: 4,
      row: 35,
      rowProportions: 0,
      space: {
        row: 50,
        column: 50,
      },
      name: 'fishes',
    })

    for (const skin of skins) {
      this.addPlayerItem(skin)
    }

    this.grid.setInteractive()

    return this.grid
  }

  private addPanel(skins: SkinType[]): void {
    this.panel = new ScrollablePanel(this.scene, {
      x: 0,
      y: 0,
      width: 700,
      height: 1480,

      anchor: {
        centerX: 'center',
        centerY: 'center+100',
      },

      scrollMode: 0,

      panel: {
        child: this.createGrid(skins),
        mask: {
          padding: 1,
        },
      },

      mouseWheelScroller: {
        focus: false,
        speed: 0.7,
      },

      space: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 30,
        panel: 30,
      },
    })

    this.panel.layout()

    this.panel.setChildrenInteractive({
      targets: [this.panel.getByName('fishes', true)],
    })

    this.add(this.panel)

    this.panel.on('child.click', (selectItem: Button) => {
      this.selectItem(selectItem.frame.name)
      this.selectCallback(selectItem)
    })
  }
}
