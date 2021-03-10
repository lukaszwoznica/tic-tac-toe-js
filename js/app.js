const NOUGHT = 'fa-circle-o'
const CROSS = 'fa-times'
const noughtIndicator = document.querySelector('#nought-indicator')
const crossIndicator = document.querySelector('#cross-indicator')
let noughtScore = 0
let crossScore = 0
let turnCount = 1;
let fields = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('#board')

    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            const field = document.createElement('div')
            field.classList.add('field', 'fa')
            field.dataset.row = row.toString()
            field.dataset.column = column.toString()
            field.addEventListener('click', fieldClicked)
            board.appendChild(field)
        }
    }
})

function fieldClicked(event) {
    const {row, column} = event.target.dataset
    const turn = turnCount % 2 === 0 ? CROSS : NOUGHT

    if (fields[row][column] !== '')
        return

    fields[row][column] = turn
    event.target.classList.add(turn)
    turnCount++
    if (turn === NOUGHT) {
        noughtIndicator.classList.remove('active')
        crossIndicator.classList.add('active')
    } else {
        noughtIndicator.classList.add('active')
        crossIndicator.classList.remove('active')
    }


    const gameResult = checkGameResult()
    if (gameResult !== null) {
        generateGameOverScreen(gameResult)
    }
}

function checkGameResult() {
    const flatFieldsArray = fields.flat()
    let gameResult = null
    let playersMoves = {
        'fa-circle-o': [],
        'fa-times': []
    }

    flatFieldsArray.forEach((field, index) => {
        playersMoves[field] ? playersMoves[field].push(index) : null
    })

    winningCombinations.forEach(combination => {
        if (combination.every(index => playersMoves[NOUGHT].indexOf(index) > -1)) {
            noughtScore++
            const noughtScoreDiv = document.querySelector('#nought-score')
            noughtScoreDiv.innerText = noughtScore
            gameResult = 'nought'
        }
        if (combination.every(index => playersMoves[CROSS].indexOf(index) > -1)) {
            crossScore++
            const crossScoreDiv = document.querySelector('#cross-score')
            crossScoreDiv.innerText = crossScore
            gameResult = 'cross'
        }
    })

    if (flatFieldsArray.indexOf('') === -1 && gameResult === null) {
        gameResult = 'draw'
    }

    return gameResult
}

function generateGameOverScreen(gameResult) {
    const board = document.querySelector('#board')
    const gameOverScreen = document.createElement('div')
    gameOverScreen.classList.add('game-over-screen')
    const resetButton = document.createElement('button')
    resetButton.innerText = 'Next round'
    resetButton.classList.add('reset-button')
    resetButton.addEventListener('click', resetBoard)

    let message
    if (gameResult === 'nought') {
        message = 'Nought wins!'
    } else if (gameResult === 'cross') {
        message = 'Cross wins!'
    } else {
        message = 'Draw!'
    }

    gameOverScreen.innerText = message
    gameOverScreen.appendChild(resetButton)
    board.appendChild(gameOverScreen)
}

function resetBoard(event) {
    const fieldDivs = document.querySelectorAll('.field')
    fieldDivs.forEach(field => {
        field.classList.remove('fa-circle-o', 'fa-times')
    })
    document.querySelector('.game-over-screen').remove()
    turnCount = 1
    fields = Array(3).fill(null).map(() => Array(3).fill(''));
    noughtIndicator.classList.add('active')
    crossIndicator.classList.remove('active')
}