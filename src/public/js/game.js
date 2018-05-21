const createGame = () => {
  const game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT)

  game.fps = FPS
  game.scale = 2
  game.preload(MAP_IMAGE, CLEAR_IMAGE, CHARACTER_IMAGE)

  // ゲームの読み込みが完了した際に実行する
  game.addEventListener('load', () => {
    // マップを作成する
    const map = new Map(16, 16)
    map.image = game.assets[MAP_IMAGE]
    map.loadData(...mapData)
    map.collisionData = collisionMapData

    // プレイヤーよりも前に表示するマップを作成する
    const foregroundMap = new Map(16, 16)
    foregroundMap.image = game.assets[MAP_IMAGE]
    foregroundMap.loadData(foregroundMapData)

    // Player クラスで使用するため states で game と map を管理する
    states.game = game
    states.map = map

    // 自身が操作するプレイヤーを作成する
    const player = new Player()

    // マップやプレイヤーをひとまとめにするために使用する
    const stage = new Group()

    // 複数のプレイヤーをまとめるために使用する
    const playerStage = new Group()
    playerStage.addChild(player.getStage())

    const showClearScene = () => {
      const gameClearScene = new Scene()
      const gameClear = new Sprite(267, 48)
      gameClear.image = game.assets[CLEAR_IMAGE]
      gameClear.x = 0 - stage.x + (game.width - gameClear.width) / 2
      gameClear.y = 0 - stage.y + (game.height - gameClear.height) / 2
      gameClearScene.addChild(gameClear)
      stage.addChild(gameClearScene)
      setTimeout(() => {
        stage.removeChild(gameClearScene)
      }, 5000)
    }

    actions.showClearScene = showClearScene

    stage.addChild(map)
    stage.addChild(playerStage)
    stage.addChild(foregroundMap)

    states.playerStage = playerStage
    states.player = player

    // プレイヤーが画面の中心に表示されるようにする
    game.rootScene.addEventListener('enterframe', () => {
      stage.x =
        Math.max(
          game.width,
          Math.min((game.width - 16) / 2 - player.getPlayer().x, 0) + map.width
        ) - map.width
      stage.y =
        Math.max(
          game.height,
          Math.min((game.height - 16) / 2 - player.getPlayer().y, 0) +
            map.height
        ) - map.height
    })

    game.rootScene.addChild(stage)

    // マルチプレイで初期化が完了したことを伝える
    actions.send('login', {
      name: CHARACTER_NAME,
      x: CHARACTER_DEFAULT_POSITION_X,
      y: CHARACTER_DEFAULT_POSITION_Y,
      isAllPassed: isAllPassed
    })
  })

  const sendBtn = document.getElementById('send')
  const input = document.getElementById('input')
  sendBtn.addEventListener('click', () => {
    // 入力された文字があればメッセージとして送信する
    if (input.value !== '') {
      actions.send('message', {
        message: input.value
      })
      // プレイヤーに発言させる
      states.player.say(input.value)
      if (input.value.indexOf('クリア') !== -1) {
        if (isAllPassed) {
          actions.showClearScene()
        } else {
          states.player.say('（まだクリアできていない...）')
        }
      }
      // 入力に使用する textarea の中を空にする
      input.value = ''
    }
  })

  game.start()
}
