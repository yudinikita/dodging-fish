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

    const color = this.getCurrentColor(this.player.data.get('score'))
    this.changeColor(color)
    this.changeCountSpikes()
  }

  private getCurrentColor(score: number) {
    if (score < 5) return { background: 0xeb_eb_eb, spike: 0x80_80_80 }
    if (score < 10) return { background: 0xdc_ec_f1, spike: 0x62_75_81 }
    if (score < 15) return { background: 0xf8_eb_e3, spike: 0x82_6c_61 }
    if (score < 20) return { background: 0xe8_f1_df, spike: 0x75_7c_64 }
    if (score < 25) return { background: 0xe8_e4_f7, spike: 0x6b_66_80 }
    if (score < 30) return { background: 0x76_76_75, spike: 0xfc_f9_fe }
    if (score < 35) return { background: 0x2b_69_7f, spike: 0x63_d1_f8 }
    if (score < 40) return { background: 0x1e_72_00, spike: 0x6e_cf_00 }
    if (score < 45) return { background: 0x00_29_8a, spike: 0x00_69_f5 }
    if (score < 50) return { background: 0x8c_0f_3e, spike: 0xfe_1f_67 }
    if (score < 55) return { background: 0xff_a9_2c, spike: 0xff_ff_ff }
    if (score < 60) return { background: 0x00_97_ff, spike: 0xff_ff_ff }
    if (score < 65) return { background: 0xb0_4d_ff, spike: 0xff_ff_ff }
    if (score < 70) return { background: 0x81_cc_12, spike: 0xff_ff_ff }
    if (score < 75) return { background: 0x00_00_00, spike: 0xff_ff_ff }
    if (score < 80) return { background: 0xed_a8_c8, spike: 0x00_00_00 }
    if (score < 85) return { background: 0x9c_c1_eb, spike: 0x00_00_00 }
    if (score < 90) return { background: 0xb8_e3_9c, spike: 0x00_00_00 }
    if (score < 95) return { background: 0xab_a4_f1, spike: 0x00_00_00 }
    if (score < 100) return { background: 0x98_dd_dd, spike: 0x00_00_00 }
    if (score >= 100) return { background: 0x00_00_00, spike: 0xff_19_00 }
    return { background: 0xeb_eb_eb, spike: 0x80_80_80 }
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
    this.player.velocity.x = Math.abs(this.player.velocity.x)
    this.player.resetFlip()
    this.player.setVelocity(0, 0)
    this.player.setPosition(constants.WIDTH / 2, constants.HEIGHT / 2)
    this.player.data.values.score = 0

    this.changeColor({ background: 0xeb_eb_eb, spike: 0x80_80_80 })

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
