import Phaser from 'phaser'
import constants from '@/constants'
import Player from '@/components/Player'
import Wall from '@/components/Wall'
import SpikeGroup from '@/components/SpikeGroup'

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

  constructor() {
    super(constants.SCENES.GAME_FIELD)
  }

  create() {
    const { width, height } = this.cameras.main

    this.matter.world.setBounds(0, 0, constants.WIDTH, constants.HEIGHT)

    this.addScoreText()

    this.player = new Player(this, width / 2, height / 2)
    this.initPlayerData()
    this.addPlayerController()

    this.scoreText.setText(this.player.data.get('score'))

    this.addWalls()
    this.addSpikes()
    this.addCollisionStartEvent()
    this.addPauseEvent()

    this.startGame()
  }

  private initPlayerData() {
    this.player.setDataEnabled()

    this.player.data.set('score', 0)

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
    const { width, height } = this.cameras.main

    this.scoreText = this.add
      .text(width / 2, height / 2, '', {
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
      x: 10,
      y: height / 2,
      width: 4,
      height,
      label: 'wallLeft',
      alpha: 0,
    })
    this.wallRight = new Wall(this, {
      x: width - 10,
      y: height / 2,
      width: 6,
      height,
      label: 'wallRight',
      alpha: 0,
    })

    const wallHeight = constants.WALL.HEIGHT

    this.wallTop = new Wall(this, {
      x: width / 2,
      y: wallHeight / 4.5,
      width,
      height: wallHeight / 2.5,
      label: 'wallTop',
      color: 0xcc_cc_cc,
      alpha: 1,
    })
    this.wallBottom = new Wall(this, {
      x: width / 2,
      y: height - wallHeight / 2,
      width,
      height: wallHeight,
      label: 'wallBottom',
      color: 0xcc_cc_cc,
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
    this.player.flip()
    this.player.data.values.score++

    const randomColor = 0x1_00_00_00 + Math.random() * 0xff_ff_ff
    this.changeColor(randomColor)
    this.changeCountSpikes()
  }

  private changeColor(color: number) {
    this.wallTop.setFillStyle(color)
    this.wallBottom.setFillStyle(color)

    for (const spike of this.spikes) {
      spike.setFillStyle(color)
    }
  }

  private changeCountSpikes() {
    const countSpikes = this.player.data.values.score

    const countRightSpikes =
      this.spikeGroupLeft.getCurrentCount > 0 ? countSpikes : 0
    this.spikeGroupRight.changeCount(countRightSpikes)

    const countLeftSpikes =
      this.spikeGroupRight.getCurrentCount === 0 ? countSpikes : 0
    this.spikeGroupLeft.changeCount(countLeftSpikes)
  }

  private startGame() {
    this.player.velocity.x = Math.abs(this.player.velocity.x)
    this.player.resetFlip()
    this.player.setVelocity(0, 0)
    this.player.setPosition(constants.WIDTH / 2, constants.HEIGHT / 2)
    this.player.data.values.score = 0

    this.changeColor(0xcc_cc_cc)

    this.spikeGroupLeft.changeCount(0)
    this.spikeGroupRight.changeCount(0)

    this.player.jump()
  }

  private gameOver() {
    this.startGame()

    this.scene.pause(constants.SCENES.GAME_FIELD)
    this.scene.resume(constants.SCENES.MAIN_MENU)
    this.scene.setVisible(true, constants.SCENES.MAIN_MENU)
  }
}
