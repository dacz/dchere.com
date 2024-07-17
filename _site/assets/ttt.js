// Copyright dchere.com
// License: MIT

function newGameSession() {
  const game = {
    status: 'initial',
    fields: Array(9).fill(''),
    playerAName: '',
    playerBName: '',
    nextToken: '',
    starts: 'A',
    nextTokenPrepared: -1, // -1 not prepared, 0 preparing, 1 prepared
    moveCount: 0,
    moveTokens: [],
    finished: false,
    finishedFields: [],
    postToken: '',
    history: [],

    // the whole game element
    domGameBox: null,

    // starts button
    startGameButtonEl: null,

    // game info elements
    gameInfoEl: null,
    whoIsPlayingEl: null,
    nextTokenEl: null,

    // game finished elements
    finishedEl: null,
    youDidEl: null,
    playAgainButtonEl: null,
    giveFeedbackLinkEl: null,

    // playing board elements
    domBoard: null,
    domFields: Array(9).fill(null),
  }

  game.reset = () => {
    game.fields = Array(9).fill('')
    game.nextToken = ''
    game.nextTokenPrepared = -1
    game.moveCount = 0
    game.moveTokens = []
    game.finished = false
    game.finishedFields = []

    for (let i = 0; i < 9; i++) {
      game.domFields[i].classList.remove('icox')
      game.domFields[i].classList.remove('icoo')
      game.domFields[i].classList.remove('finished-field')
    }

    game.render()
  }

  game.isBTurn = () => game.starts === 'A'
    ? game.moveCount % 2 !== 0
    : game.moveCount % 2 === 0

  // creates dom and makes refs to them
  game.renderInit = (el) => {
    game.domGameBox = el

    game.setGameStatusClass('game-init')

    // start button
    game.startButtonEl = el.querySelector('#game-start button')
    game.startButtonEl.addEventListener('click', (e) => {
      e.preventDefault()
      game.reset()
      game.startNew()
    })

    // create game info
    game.gameInfoEl = el.querySelector('#game-info')
    game.whoIsPlayingEl = game.gameInfoEl.querySelector('.who-is-playing')
    game.nextTokenEl = game.gameInfoEl.querySelector('.next-token')

    // create game finished
    game.finishedEl = el.querySelector('#game-finished')
    game.youDidEl = game.finishedEl.querySelector('.you-did')
    game.playAgainButtonEl = game.finishedEl.querySelector('.again button')
    game.playAgainButtonEl.addEventListener('click', (e) => {
      e.preventDefault()
      game.reset()
      game.startNew()
    })
    game.giveFeedbackLinkEl = game.finishedEl.querySelector('.give-feedback a')
    game.giveFeedbackLinkEl.addEventListener('click', (e) => {
      e.preventDefault()
      game.setGameStatusClass('game-feedback')
    })

    // game feedback
    game.feedbackFormEl = el.querySelector('#game-feedback form')
    game.feedbackFormEl.addEventListener('submit', (e) => {
      e.preventDefault()
      game.sendFeedback()
      game.reset()
      game.setGameStatusClass('game-init')
      game.render()
    })
    const noFeedbackPlayNew = game.feedbackFormEl.querySelector('#game-feedback .newgame')
    noFeedbackPlayNew.addEventListener('click', (e) => {
      e.preventDefault()
      game.reset()
      game.startNew()
    })

    // create game board
    const gameBoard = document.createElement('div')
    gameBoard.id = 'game-board'
    for (let i = 0; i < 9; i++) {
      const field = document.createElement('div')
      field.classList.add('field')
      if (i % 3 === 0) {
        field.classList.add('left')
      }
      if (i % 3 === 2) {
        field.classList.add('right')
      }
      if (i < 3) {
        field.classList.add('top')
      }
      if (i > 5) {
        field.classList.add('bottom')
      }
      field.id = 'field-' + i
      field.dataset.index = i
      field.innerHTML = '<div class="infield"></div>'
      gameBoard.appendChild(field)
      game.domFields[i] = field
    }
    gameBoard.addEventListener('click', (e) => {
      const fieldClicked = e.target.dataset.index
      if (game.fields[fieldClicked] !== '') {
        console.log('error: field is already taken');
        return
      }
      fieldClickedNumber = parseInt(fieldClicked)
      game.move(fieldClickedNumber)
    })
    game.domBoard = gameBoard
    el.appendChild(gameBoard)

    game.makeNextToken()
    game.render()
  }

  game.startNew = () => {
    game.setGameStatusClass('game-started')
    game.makeNextToken()
    game.render()
  }

  game.render = () => {
    for (let i = 0; i < 9; i++) {
      if (game.fields[i] != '') {
        game.domFields[i].classList.add('ico' + game.fields[i])
      }
      game.domFields[i].querySelector('.infield').innerText = game.fields[i]
    }

    if (game.finished) {
      game.renderFinished()
      return
    }

    if (game.isBTurn()) {
      game.domBoard.classList.add('b-turn')
      game.whoIsPlayingEl.innerHTML = `<div><span>${game.playerBName}</span> plays with</div>`
    } else {
      game.domBoard.classList.remove('b-turn')
      game.whoIsPlayingEl.innerHTML = `<div><span>${game.playerAName}</span> play with</div>`
    }

    if (game.nextTokenPrepared > 0) {
      game.nextTokenEl.innerText = game.nextToken
      game.nextTokenEl.classList.remove('icog')
      game.nextTokenEl.classList.add('ico' + game.nextToken)
    } else if (game.nextTokenPrepared === 0) {
      // todo - token is preparing
      game.nextTokenEl.classList.remove('icoo')
      game.nextTokenEl.classList.remove('icox')
      game.nextTokenEl.classList.add('icog')
      game.nextTokenEl.innerText = '?'
    } else {
      // not prepared - should be visible only before start
      game.nextTokenEl.innerText = ''
      game.nextTokenEl.classList.remove('icoo')
      game.nextTokenEl.classList.remove('icox')
      game.nextTokenEl.classList.remove('icog')
    }
  }

  game.makeNextToken = () => {
    if (game.finished) {
      console.log('should not be called: game is finished');
      return
    }

    game.nextTokenPrepared = 0

    // delayed token generation and if computer is next, then computer move
    setTimeout(() => {
      game.genNextToken()
      game.render()
      if (!game.isFinished() && game.isBTurn()) {
        setTimeout(() => {
          const field = game.randomChooseEmptyField()
          game.move(field)
        }, 500)
      }
    }, 1000)

    game.render()
  }

  game.move = (where) => {
    if (game.finished) {
      console.log('error: game is finished');
      return 'error: game is finished'
    }

    if (game.fields[where] !== '') {
      console.log('error: field is already taken');
      return 'error: field is already taken'
    }

    game.fields[where] = game.nextToken
    game.moveCount++
    game.moveTokens.push([game.nextToken, where + ''])

    !game.isFinished() && game.makeNextToken()
    game.render()
  }

  game.renderFinished = () => {
    game.genPostTokenAndPlaceIntoForm()

    // add to history
    game.history.push({
      // fields: game.fields.slice(),
      id: window.crypto.randomUUID(),
      moveTokens: game.moveTokens.slice(),
      starts: game.starts,
      postToken: game.postToken,
    })
    game.history = game.history.slice(-20)

    game.resetFeedbackForm()
    game.setFeedbackHistoryData()
    game.setGameStatusClass('game-finished')

    game.finishedFields.forEach((line) => {
      for (let i = 0; i < 3; i++) {
        game.domFields[line[i]].classList.add('finished-field')
      }
    })
  }

  game.isFinished = () => {
    game.checkWinningLines()

    if (game.moveCount >= 8) {
      game.finished = true
    }

    return game.finished
  }

  game.collectEmptyFields = () => {
    const emptyFields = []
    for (let i = 0; i < 9; i++) {
      if (game.fields[i] === '') {
        emptyFields.push(i)
      }
    }
    return emptyFields
  }

  game.randomChooseEmptyField = () => {
    const emptyFields = game.collectEmptyFields()
    const randomIndex = Math.floor(Math.random() * emptyFields.length)
    return emptyFields[randomIndex]
  }

  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const checkWinningLine = (game, line) => {
    const [a, b, c] = line
    return game.fields[a] != '' && game.fields[a] === game.fields[b] && game.fields[a] === game.fields[c]
  }

  game.checkWinningLines = () => {
    for (let i = 0; i < winningLines.length; i++) {
      if (checkWinningLine(game, winningLines[i])) {
        game.finished = true
        game.finishedFields = game.finishedFields.concat([winningLines[i]])
      }
    }
  }

  game.genNextToken = () => {
    game.nextToken = game.nextTokenAlgorithm(game.moveTokens)
    game.nextTokenPrepared = 1
  }

  game.nextTokenAlgorithm = (tokens) => {
    const xs = tokens.reduce((acc, [token, _]) => {
      if (token == 'x') acc++
      return acc
    }, 0)

    const diff = xs - (tokens.length / 2)

    const ratio = Math.abs(diff) <= 1
      ? 0.5
      : diff > 0
        ? 0.5 / diff
        : 1 + (0.5 / diff)

    return Math.random() < ratio ? 'x' : 'o'
  }

  game.resetGameBoxClasses = () => {
    const el = game.domGameBox
    el.classList.forEach((className) => {
      if (className.startsWith('game-')) {
        el.classList.remove(className)
      }
    })
  }

  game.setGameStatusClass = (status) => {
    game.resetGameBoxClasses()
    el.classList.add(status)
  }

  game.genPostTokenAndPlaceIntoForm = () => {
    if (game.postToken) {
      return
    }
    game.postToken = window.crypto.randomUUID()
    game.domGameBox.querySelector('#game-feedback input[name="gameid"]').value = game.postToken
  }

  game.resetFeedbackForm = () => {
    const eles = game.domGameBox.querySelectorAll('#game-feedback input[name="feeling"]')
    eles.forEach((el) => {
      el.checked = false
    })
    game.domGameBox.querySelector('#game-feedback textarea').value = ''
  }

  game.setFeedbackHistoryData = () => {
    game.domGameBox.querySelector('#game-feedback input[name="history"]').value = JSON.stringify(game.history)
  }

  game.sendFeedback = async () => {
    const data = new URLSearchParams();
    for (const pair of new FormData(game.feedbackFormEl)) {
      data.append(pair[0], pair[1]);
    }

    try {
      await fetch('http://localhost:8181/', {
        method: 'POST',
        body: data,
      })
    } catch (e) {
      console.error('error sending feedback', e)
    }
  }

  return game
}

const g = newGameSession()
g.playerAName = 'You'
g.playerBName = 'Computer Jane'
const el = document.getElementById('placegame')

g.renderInit(el)
