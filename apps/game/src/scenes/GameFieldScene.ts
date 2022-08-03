import Phaser from 'phaser'
import LocalStorageData from 'phaser3-rex-plugins/plugins/localstorage-data'
import constants from '@/constants'
import Player from '@/components/Player'
import Wall from '@/components/Wall'
import SpikeGroup from '@/components/SpikeGroup'
import getCurrentColor from '@/helpers/getCurrentColor'
import Roe from '@/components/Roe'
import getCurrentRoe from '@/helpers/getCurrentRoe'

export default class GameFieldScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text
  private player!: Player

  private wallLeft!: Wall
  private wallRight!: Wall
  private wallTop!: Wall
  private wallBottom!: Wall

  private spikes: SpikeGroup[] = []
  private spikeGroupLeft!: SpikeGroup
  private spikeGroupRight!: SpikeGroup
  private spikeGroupTop!: SpikeGroup
  private spikeGroupBottom!: SpikeGroup
  private roe?: Roe | null

  constructor() {
    super(constants.SCENES.GAME_FIELD)
  }

  create() {
    const { width, height } = this.cameras.main

    this.matter.world.setBounds(0, 0, width, height)

    this.addScoreText()

    this.addPlayer()

    this.scoreText.setText(this.player.data.get('score'))

    this.addWalls()
    this.addSpikes()
    this.addCollisionStartEvent()
    this.addPauseEvent()
    this.addChangeSkinEvent()

    this.startGame()
  }

  private addPlayer() {
    const { centerX, centerY } = this.cameras.main

    const localStorageScene = this.scene.get(constants.SCENES.LOCAL_STORAGE)
    const localStorageData = localStorageScene.data.get(
      'localStorageData'
    ) as LocalStorageData
    const playerFrameName = localStorageData.get('selectFish')

    this.player = new Player(this, centerX, centerY, playerFrameName)
    this.initPlayerData()
    this.addPlayerController()
  }

  private addChangeSkinEvent() {
    const localStorageScene = this.scene.get(constants.SCENES.LOCAL_STORAGE)
    const localStorageData = localStorageScene.data.get(
      'localStorageData'
    ) as LocalStorageData

    localStorageData.events.on(
      'changedata-selectFish',
      (_: any, selectSkin: string) => {
        this.player.changeSkin(selectSkin)
      }
    )
  }

  private initPlayerData() {
    this.player.setDataEnabled()

    this.player.data.set('score', 0)
    this.player.data.set('roe', 0)

    this.player.on(
      'changedata-score',
      (gameObject: Phaser.GameObjects.GameObject, value: number) => {
        const score = Phaser.Utils.String.Pad(value.toString(), 2, '0', 1)
        this.scoreText.setText(score)
      },
      this
    )
  }

  private addScoreText() {
    const { centerX, centerY } = this.cameras.main

    this.scoreText = this.add
      .text(centerX, centerY, '', {
        fontFamily: constants.FONT.FAMILY,
        fontSize: '480px',
        color: constants.COLORS.DEFAULT.SPIKE + '40',
      })
      .setOrigin(0.5, 0.5)
  }

  private addPlayerController() {
    this.input.on(
      'pointerdown',
      () => {
        this.player.jump()
      },
      this
    )
  }

  private addWalls() {
    const { width, height } = this.cameras.main

    this.wallLeft = new Wall(this, {
      x: 5,
      y: height / 2,
      width: 50,
      height,
      label: 'wallLeft',
      alpha: 0,
      isSensor: true,
    })
    this.wallRight = new Wall(this, {
      x: width - 5,
      y: height / 2,
      width: 50,
      height,
      label: 'wallRight',
      alpha: 0,
      isSensor: true,
    })

    const wallHeight = constants.WALL.HEIGHT

    this.wallTop = new Wall(this, {
      x: width / 2,
      y: wallHeight / 5,
      width,
      height: wallHeight / 2.5,
      label: 'wallTop',
      color: 0x80_80_80,
      alpha: 1,
    })
    this.wallBottom = new Wall(this, {
      x: width / 2,
      y: height - wallHeight / 2,
      width,
      height: wallHeight,
      label: 'wallBottom',
      color: 0x80_80_80,
      alpha: 1,
    })
  }

  private addSpikes() {
    const { width, height } = this.cameras.main
    const wallHeight = constants.WALL.HEIGHT

    this.spikeGroupLeft = new SpikeGroup(this, {
      x: 8,
      y: constants.SPIKE.HEIGHT,
      count: 0,
      maximum: 11,
      label: 'spike',
      color: 0xcc_cc_cc,
      alpha: 1,
      angle: 90,
      space: 4,
      orientation: 'vertical',
      isAnimation: true,
    })

    this.spikeGroupRight = new SpikeGroup(this, {
      x: width - 8,
      y: constants.SPIKE.HEIGHT,
      count: 0,
      maximum: 11,
      label: 'spike',
      color: 0xcc_cc_cc,
      alpha: 1,
      angle: -90,
      space: 4,
      orientation: 'vertical',
      isAnimation: true,
    })

    this.spikeGroupTop = new SpikeGroup(this, {
      x: constants.SPIKE.WIDTH / 7,
      y: wallHeight / 4 + constants.SPIKE.HEIGHT / 2,
      count: 7,
      label: 'spike',
      color: 0xcc_cc_cc,
      alpha: 1,
      angle: 180,
      space: 4,
      orientation: 'horizontal',
    })

    this.spikeGroupBottom = new SpikeGroup(this, {
      x: constants.SPIKE.WIDTH / 7,
      y: height - wallHeight - constants.SPIKE.HEIGHT / 5,
      count: 7,
      label: 'spike',
      color: 0xcc_cc_cc,
      alpha: 1,
      angle: 0,
      space: 4,
      orientation: 'horizontal',
    })

    this.spikes.push(
      this.spikeGroupLeft,
      this.spikeGroupRight,
      this.spikeGroupTop,
      this.spikeGroupBottom
    )
  }

  private addCollisionStartEvent() {
    this.matter.world.on(
      Phaser.Physics.Matter.Events.COLLISION_START,
      (
        _event: Phaser.Physics.Matter.Events.CollisionStartEvent,
        bodyA: MatterJS.BodyType,
        bodyB: MatterJS.BodyType
      ) => {
        if ([bodyA.label, bodyB.label].includes('player')) {
          if (
            [bodyA.label, bodyB.label].includes('wallLeft') ||
            [bodyA.label, bodyB.label].includes('wallRight')
          ) {
            this.nextStep()
          } else if (
            [bodyA.label, bodyB.label].includes('wallTop') ||
            [bodyA.label, bodyB.label].includes('wallBottom') ||
            [bodyA.label, bodyB.label].includes('spike')
          ) {
            this.gameOver()
          } else if ([bodyA.label, bodyB.label].includes('roe')) {
            this.player.data.values.roe += this.roe?.getValue || 0
            this.roe?.showTakenValue()
            this.roe?.remove()
            this.roe = null
          }
        }
      }
    )
  }

  private addPauseEvent() {
    this.events.on(
      Phaser.Scenes.Events.PAUSE,
      () => {
        this.scoreText.setVisible(false)
        this.player.setVisible(false)
      },
      this
    )
  }

  private nextStep() {
    if (this.player.data.values.score <= 100) {
      this.player.addVelocity(0.04, 0.04)
    }

    this.player.flip()
    this.player.data.values.score++

    const color = getCurrentColor(this.player.data.get('score'))
    this.changeColor(color)
    this.changeCountSpikes()
    this.spawnRoe()
  }

  private spawnRoe() {
    if (this.roe) return

    const { width } = this.cameras.main

    const roeData = getCurrentRoe(this.player.data.get('score'))

    const roeX =
      this.player.direction === 'right'
        ? width - constants.SPIKE.WIDTH
        : constants.SPIKE.WIDTH

    const roeY = Phaser.Math.RND.between(300, constants.HEIGHT - 400)

    const roeValue = roeData.value

    this.roe = new Roe(this, roeX, roeY, roeValue)
    this.roe.setTexture('roe', roeData.frame)
  }

  private changeColor(color: { background: number; spike: number }) {
    this.cameras.main.setBackgroundColor(color.background)

    this.scoreText.setColor('#' + color.spike.toString(16) + '30')

    this.wallTop.setFillStyle(color.spike)
    this.wallBottom.setFillStyle(color.spike)

    for (const spike of this.spikes) {
      spike.setFillStyle(color.spike)
    }
  }

  private changeCountSpikes() {
    const countSpikes = SpikeGroup.getNeededSpikes(
      this.player.data.values.score
    )

    const countRightSpikes =
      this.spikeGroupLeft.getCurrentCount > 0 ? countSpikes : 0
    this.spikeGroupRight.changeCount(countRightSpikes)

    const countLeftSpikes =
      this.spikeGroupRight.getCurrentCount === 0 ? countSpikes : 0
    this.spikeGroupLeft.changeCount(countLeftSpikes)
  }

  private startGame() {
    this.player.spawn()

    this.changeColor({ background: 0xeb_eb_eb, spike: 0x80_80_80 })

    this.spikeGroupLeft.changeCount(0)
    this.spikeGroupRight.changeCount(0)

    this.player.jump()
  }

  private gameOver() {
    this.roe?.remove()
    this.roe = null

    this.player.death()

    this.scene.run(constants.SCENES.GAME_OVER, {
      score: this.player.data.values.score,
      roe: this.player.data.values.roe,
    })
  }
}
