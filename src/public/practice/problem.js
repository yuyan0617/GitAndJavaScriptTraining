// プレイヤーの名前
const CHARACTER_NAME = 'yuyan'

// 初期位置
const CHARACTER_DEFAULT_POSITION_X = 7
const CHARACTER_DEFAULT_POSITION_Y = 10

// 複数人でプレイする際に使用するサーバのアドレス
const MULTIPLAYER_SERVER = 'https://evening-reaches-62725.herokuapp.com/'

// 入力しているキーの情報からプレイヤーの向きを決定する
const getPlayerDirection = game => {
  let direction

  if (game.input.left) {
    direction = DOWN
  } else if (game.input.right) {
    direction = UP
  } else if (game.input.up) {
    direction = RIGHT
  } else if (game.input.down) {
    direction = LEFT
  }

  return direction
}

// 与えられた方向を元にプレイヤーの移動先の X 座標を返す
const getPlayerNextXCoordinate = (player, direction) => {
  const playerXCoordinate = player.x
  let nextPlayerXCoordinate

  if (direction === LEFT) {
    nextPlayerXCoordinate = playerXCoordinate - 1
  } else if (direction === RIGHT) {
    nextPlayerXCoordinate = playerXCoordinate + 4
  } else if (direction === UP || direction === DOWN) {
    nextPlayerXCoordinate = playerXCoordinate
  }

  return nextPlayerXCoordinate
}

// 与えられた方向を元にプレイヤーの移動後の Y 座標を返す
const getPlayerNextYCoordinate = (player, direction) => {
  const playerYCoordinate = player.y
  let nextPlayerYCoordinate

  if (direction === LEFT || direction === RIGHT) {
    nextPlayerYCoordinate = playerYCoordinate
  } else if (direction === UP) {
    nextPlayerYCoordinate = playerYCoordinate - 4
  } else if (direction === DOWN) {
    nextPlayerYCoordinate = playerYCoordinate + 2
  }

  return nextPlayerYCoordinate
}
