let isAllPassed = true

const showTestMessage = (problemNumber, title, testCases, errorMessage) => {
  let isFailed = false

  let testCasesResult = ''
  testCases.forEach(testCase => {
    const result = eval(testCase)

    // Test Failed
    if (!eval(testCase)) {
      isFailed = true
      isAllPassed = false
    }

    testCasesResult += `\t${result ? 'Passed' : 'Failed'} - ${testCase}\n`
  })

  const message = `Problem ${problemNumber} : ${title}\n\nTest Cases:\n${testCasesResult}`

  if (isFailed) {
    console.error(`${message}\n\n${errorMessage}`)
  } else {
    console.log(`${message}\n\nPassed.`)
  }
}

// Player Name

showTestMessage(
  1,
  'Player Name',
  ["CHARACTER_NAME !== 'Guest'"],
  'Please change player name.'
)

// Player Default Position X

showTestMessage(
  2,
  'Player Default Position X',
  ['CHARACTER_DEFAULT_POSITION_X !== 6'],
  'Please change player default position.'
)

// Player Default Position Y

showTestMessage(
  3,
  'Player Default Position Y',
  ['CHARACTER_DEFAULT_POSITION_Y !== 4'],
  'Please change player default position.'
)

// Get Player Direction

showTestMessage(
  4,
  'Get Player Direction',
  [
    'getPlayerDirection({ input: { left: true } }) === LEFT',
    'getPlayerDirection({ input: { right: true } }) === RIGHT',
    'getPlayerDirection({ input: { up: true } }) === UP',
    'getPlayerDirection({ input: { down: true } }) === DOWN'
  ],
  'Please correct getPlayerDirection function.'
)

// Get Player Next X Coordinate

showTestMessage(
  5,
  'Get Player Next X Coordinate',
  [
    'getPlayerNextXCoordinate({ x: 100 }, LEFT) === 96',
    'getPlayerNextXCoordinate({ x: 123 }, LEFT) === 119',
    'getPlayerNextXCoordinate({ x: 100 }, RIGHT) === 104',
    'getPlayerNextXCoordinate({ x: 123 }, RIGHT) === 127'
  ],
  'Please correct playerXCoordinate function.'
)

// Get Player Next Y Coordinate

showTestMessage(
  6,
  'Get Player Next Y Coordinate',
  [
    'getPlayerNextYCoordinate({ y: 100 }, UP) === 96',
    'getPlayerNextYCoordinate({ y: 123 }, UP) === 119',
    'getPlayerNextYCoordinate({ y: 100 }, DOWN) === 104',
    'getPlayerNextYCoordinate({ y: 123 }, DOWN) === 127'
  ],
  'Please correct playerYCoordinate function.'
)

// Multiplayer

showTestMessage(
  7,
  'Multiplayer',
  ["MULTIPLAYER_SERVER !== 'http://localhost:3000/'"],
  'Please change the address of multiplayer server.'
)
