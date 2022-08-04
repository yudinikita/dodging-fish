import i18next from 'i18next'
import Anchor from 'phaser3-rex-plugins/plugins/behaviors/anchor/Anchor'
import { Buttons, Label } from 'phaser3-rex-plugins/templates/ui/ui-components'
import { DropDownList } from 'phaser3-rex-plugins/templates/ui/ui-components.js'
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas'
import constants from '@/constants'
import Button from '@/components/Button'
import Toast from '@/components/Toast'

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super(constants.SCENES.SETTINGS)
  }

  create() {
    this.addBackground()
    this.addTitle()
    this.addVersion()
    this.addButtons()
    this.addChangeLanguage()
  }

  private addBackground() {
    const { width, height } = this.cameras.main
    this.add
      .rectangle(0, 0, width, height, 0x00_4f_79, 0.9)
      .setOrigin(0, 0)
      .setInteractive()
  }

  private addTitle() {
    const title = this.add
      .text(0, 0, i18next.t('Settings'), {
        fontSize: '126px',
        fontFamily: constants.FONT.FAMILY,
        color: '#ffffff',
        align: 'right',
      })
      .setOrigin(1, 0.5)

    new Anchor(title, {
      x: 'right-50',
      y: 'top+180',
    })
  }

  private addVersion() {
    const version = this.game.config.gameVersion

    const title = this.add
      .text(0, 0, 'v' + version, {
        fontSize: '48px',
        fontFamily: constants.FONT.FAMILY,
        color: '#ffffff',
        align: 'right',
      })
      .setOrigin(0.5, 0.5)

    new Anchor(title, {
      x: 'center',
      y: 'bottom-100',
    })
  }

  private addButtons() {
    const backButton = new Button(this, {
      texture: 'ui',
      frameIcon: 'back',
      backgroundColor: 0xff_ff_ff,
      backgroundColorOver: 0x00_4f_79,
    })

    const buttons = new Buttons(this, {
      x: 0,
      y: 0,
      anchor: {
        centerX: 'left+120',
        centerY: 'top+180',
      },
      orientation: 'horizontal',
      buttons: [backButton],
      space: {
        item: 50,
      },
    }).layout()
    this.add.existing(buttons)

    buttons.on(
      'button.over',
      (button: Button) => {
        button.setOver()
      },
      this
    )

    buttons.on(
      'button.out',
      (button: Button) => {
        button.setDefaultStyle()
      },
      this
    )

    buttons.on(
      'button.click',
      (button: Button, index: number) => {
        switch (index) {
          case 0:
            this.scene.stop()
        }
      },
      this
    )
  }

  private addChangeLanguage() {
    type Language = {
      text: string
      value: string
      icon: string
    }

    const languages: Language[] = [
      { text: 'Русский', value: 'ru', icon: 'ru' },
      { text: 'English', value: 'en', icon: 'en' },
    ]

    const dropdownList = new DropDownList(this, {
      anchor: {
        centerX: 'center',
        centerY: 'top+450',
      },

      width: this.cameras.main.width * 0.8,

      background: createBackground(this),

      text: createTextObject(this, i18next.t('Change language')),

      icon: this.add.image(0, 0, 'ui', 'earth'),

      space: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50,
        icon: 50,
      },

      options: languages,

      list: {
        createBackgroundCallback: (scene) => {
          return createBackground(scene)
        },
        createButtonCallback: (scene, language: Language) => {
          const text = language.text
          const icon = language.icon

          const selectButton = createSelectButton(this, text, icon)

          return selectButton.setName(language.value)
        },
        onButtonClick: (button) => {
          new Toast(this).showMessage(
            i18next.t('Restart the game to apply the changes')
          )
          i18next.changeLanguage(button.name)
        },
        onButtonOver: (button) => {
          const bg = (button as Label).getElement(
            'background'
          ) as RoundRectangleCanvas
          bg.setFillStyle(0x00_4f_79)
        },
        onButtonOut: (button) => {
          const bg = (button as Label).getElement(
            'background'
          ) as RoundRectangleCanvas
          bg.setFillStyle(0x2b_af_f6)
        },

        space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
          item: 20,
        },
      },

      setValueCallback: (dropDownList, value: string) => {
        const textObject = dropDownList.getElement(
          'text'
        ) as Phaser.GameObjects.Text

        const language = languages.find((language) => language.value === value)

        if (language) {
          textObject.setText(language.text)
        }
      },

      value: i18next.language,
    }).layout()

    this.add.existing(dropdownList)
  }
}

const createBackground = (scene: Phaser.Scene) => {
  const background = new RoundRectangleCanvas(
    scene,
    0,
    0,
    0,
    0,
    {
      radius: 40,
    },
    0x2b_af_f6
  )
  scene.add.existing(background)

  return background
}

const createTextObject = (scene: Phaser.Scene, text: string) => {
  return scene.add.text(0, 0, text, {
    fontFamily: constants.FONT.FAMILY,
    fontSize: '48px',
    color: '#ffffff',
  })
}

const createSelectButton = (
  scene: Phaser.Scene,
  text: string,
  icon: string
) => {
  const selectButton = new Label(scene, {
    background: createBackground(scene).setName('background'),

    width: scene.cameras.main.width * 0.6,

    text: createTextObject(scene, text),

    icon: scene.add.image(0, 0, 'ui', icon),

    space: {
      left: 50,
      right: 50,
      top: 50,
      bottom: 50,
      icon: 50,
    },
  })
  scene.add.existing(selectButton)

  return selectButton
}
