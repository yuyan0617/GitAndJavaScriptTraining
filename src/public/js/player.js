class Player {
  constructor(options) {
    options = options || {}

    this.name = options.name || CHARACTER_NAME
    this.x = options.x || CHARACTER_DEFAULT_POSITION_X
    this.y = options.y || CHARACTER_DEFAULT_POSITION_Y
    this.id = options.id || ID

    // Player Image
    const playerImage = new Surface(98, 128)
    playerImage.draw(
      states.game.assets[CHARACTER_IMAGE],
      0,
      0,
      96,
      128,
      0,
      0,
      96,
      128
    )

    this.player = new Sprite(32, 32)
    this.player.x = this.x * 16 - 8
    this.player.y = this.y * 16
    this.player.image = playerImage
    this.player.isMoving = false
    this.player.direction = 0
    this.player.walkFrame = 1
    this.player.differenceX = 0
    this.player.differenceY = 0
    this.player.addEventListener('enterframe', this.enterframe.bind(this))

    // プレイヤーのラベルを作成する
    this.label = new Label(this.name)
    this.label.font = 'bold 8px sans-serif'
    this.label._style['text-align'] = 'center'
    this.label.width = this.name.length * 8
    this.label.addEventListener('enterframe', () => {
      // プレイヤーの位置を元にラベルを移動する
      this.label.moveTo(
        this.player.x + this.player.width / 2 - this.label.width / 2,
        this.player.y + this.player.height
      )
    })

    // プレイヤー，プレイヤーの名前，メッセージを管理する
    this.group = new Group()
    this.group.addChild(this.player)
    this.group.addChild(this.label)
  }

  // direction，またはキーの入力からプレイヤーの移動先を決定する
  move(direction) {
    // 実際に移動するドットの差を持つ
    this.player.differenceX = 0
    this.player.differenceY = 0

    // プレイヤーが自身の ID を持ち，また direction が与えられていない場合，キーからの入力を取得する
    if (this.id === ID && direction === undefined) {
      direction = getPlayerDirection(states.game)
    }

    if (direction !== undefined) {
      this.player.direction = direction

      // プレイヤーの次の X，Y 座標を取得する
      const nextXCoordinate = getPlayerNextXCoordinate(this.player, direction)
      const nextYCoordinate = getPlayerNextYCoordinate(this.player, direction)

      // 実際に移動するドットの差を更新する
      if (direction === LEFT || direction === RIGHT) {
        this.player.differenceX = nextXCoordinate - this.player.x
      } else if (direction === UP || direction === DOWN) {
        this.player.differenceY = nextYCoordinate - this.player.y
      }
    }

    // 移動する差が存在する場合，移動先について移動可能か確認する
    if (this.player.differenceX || this.player.differenceY) {
      // 移動した先の座標を計算する
      const x =
        this.player.x +
        (this.player.differenceX
          ? this.player.differenceX / Math.abs(this.player.differenceX) * 16
          : 0) +
        16
      const y =
        this.player.y +
        (this.player.differenceY
          ? this.player.differenceY / Math.abs(this.player.differenceY) * 16
          : 0) +
        16

      // 次に移動する座標がマップの範囲内であり，移動可能であれば移動する
      if (
        0 <= x &&
        x < states.map.width &&
        0 <= y &&
        y < states.map.height &&
        !states.map.hitTest(x, y)
      ) {
        if (direction === LEFT) {
          this.x -= 1
        } else if (direction === RIGHT) {
          this.x += 1
        } else if (direction === UP) {
          this.y -= 1
        } else if (direction === DOWN) {
          this.y += 1
        }

        this.player.isMoving = true

        // 移動可能な場合，マルチプレイサーバに接続中の他のプレイヤーに移動を通知する
        if (this.id === ID) {
          actions.send('move', { direction })
        }

        this.enterframe()
      }
    }
  }

  // Animation
  enterframe() {
    // プレイヤーの画像を選択する
    this.player.frame = this.player.direction * 3 + this.player.walkFrame

    if (this.player.isMoving) {
      // ゲーム中のフレームレートに合わせ，プレイヤーを移動させる
      this.player.moveBy(this.player.differenceX, this.player.differenceY)

      // 歩くアニメーションを再現する
      if (!(states.game.frame % 3)) {
        this.player.walkFrame++
        this.player.walkFrame %= 3
      } // 移動が完了した

      if (
        (this.player.differenceX && (this.player.x - 8) % 16 == 0) ||
        (this.player.differenceY && this.player.y % 16 == 0)
      ) {
        this.player.isMoving = false
        this.player.walkFrame = 1
      }
    } else {
      this.move()
    }
  }

  getStage() {
    return this.group
  }

  getPlayer() {
    return this.player
  }

  // message を受け取りプレイヤーの頭上に表示する
  say(message) {
    if (!message) {
      return
    }

    const label = new Label(message)
    label.font = 'bold 8px sans-serif'
    label._style['text-align'] = 'center'
    label.width = message.length * 8

    const balloon = new Sprite(50, 50)
    balloon.width = label.width + 10 // Padding
    balloon.height = 8 /* Font Size */ + 10 // Padding
    balloon.image = (() => {
      // balloon で使用する背景を作成する
      const surface = new Surface(50, 50)
      surface.context.beginPath()
      surface.context.fillStyle = '#FFF'
      surface.context.fillRect(0, 0, 100, 100)
      return surface
    })()

    // balloon の位置をプレイヤーの位置に合わせて変更する
    const updateBalloonPosition = () => {
      balloon.moveTo(
        this.player.x +
          this.player.width / 2 -
          label.width / 2 -
          5 /* Padding / 2 */,
        this.player.y - label.height - balloon.height / 2 - 5 /* Padding / 2 */
      )
    }

    // label の位置をプレイヤーの位置に合わせて変更する
    const updateLabelPosition = () => {
      label.moveTo(
        this.player.x + this.player.width / 2 - label.width / 2,
        this.player.y - label.height - balloon.height / 2
      )
    }

    // 初期位置に移動する
    updateBalloonPosition()
    updateLabelPosition()

    const stage = new Group()
    stage.addChild(balloon)
    stage.addChild(label)

    stage.addEventListener('enterframe', () => {
      updateBalloonPosition()
      updateLabelPosition()
    })

    // 3 秒後にメッセージを削除する
    setTimeout(() => {
      this.group.removeChild(stage)
    }, 3000)

    // メッセージを表示する
    this.group.addChild(stage)
  }
}
