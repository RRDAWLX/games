import Block from "./block.js"

const unitWidth = 10 // 单个方块宽度，单位 px
const columns = Math.floor(window.innerWidth / unitWidth)
const rows = Math.floor(window.innerHeight / unitWidth)

const container = document.querySelector('#container')
container.style.cssText = `
width: ${unitWidth * columns}px;
grid-template: repeat(${rows}, ${unitWidth}px) / repeat(${columns}, ${unitWidth}px);
`


const restBlocks = new Array(columns * rows).fill(0).map((_v, no) => new Block({ no }))
container.append(...restBlocks.map(b => b.el))

function getRandomBlockFromRestBlocks() {
  if (restBlocks.length === 0) {
    throw new Error('no available block')
  }

  return restBlocks[Math.floor(Math.random() * restBlocks.length)]
}

function removeBlockFromRestBlocks(block) {
  let idx = restBlocks.indexOf(block)
  restBlocks.splice(idx, 1)
}


const directions = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
}
let curDirection = 'right'
window.addEventListener('keydown', (e) => {
  let direction = directions[e.key]

  if (!direction || direction === curDirection) {
    return
  }

  if (snake.length > 1) {
    let no = getNeighborNo(snake.at(-1), direction)

    if (no === snake.at(-2).no) {
      return
    }
  }

  curDirection = direction
})

/**
 * 
 * @param {Block} block 
 * @param {string} direction 'left'、'right'、'up'、'down'
 */
function getNeighborNo(block, direction) {
  let rowIdx = Math.floor(block.no / columns)
  let columnIdx = block.no % columns

  if (direction === 'left') {
    if (columnIdx === 0) {
      columnIdx = columns - 1
    } else {
      columnIdx--
    }
  } else if (direction === 'right') {
    columnIdx = (columnIdx + 1) % columns
  } else if (direction === 'up') {
    if (rowIdx === 0) {
      rowIdx = rows - 1
    } else {
      rowIdx--
    }
  } else {
    rowIdx = (rowIdx + 1) % rows
  }

  return rowIdx * columns + columnIdx
}

// 左边是蛇尾，右边是蛇头
const snake = [getRandomBlockFromRestBlocks()]
snake[0].eat()
removeBlockFromRestBlocks(snake[0])

function gameOver() {
  clearInterval(timedTask)
  setTimeout(() => window.alert('Game Over'), 100)
}

function win() {
  clearInterval(timedTask)
  window.alert('Win!!!')
}


let selectedBlock

/**
 * 选择接下来要吃掉的方块
 */
function selectBlock() {
  selectedBlock = getRandomBlockFromRestBlocks()
  selectedBlock.select()
}

selectBlock()


/**
 * 吃掉一个方块，将其设置为新的蛇头
 * @param {Block} block 
 */
function eatBlock(block) {
  removeBlockFromRestBlocks(block)
  block.eat()
  snake.push(block)
}

function moveForward() {
  let nextBlockNo = getNeighborNo(snake.at(-1), curDirection)

  if (nextBlockNo === selectedBlock.no) {
    eatBlock(selectedBlock)
    
    if (restBlocks.length) {
      selectBlock()
    } else {
      win()
    }

    return
  }
  
  let nextBlock = restBlocks.find(block => block.no === nextBlockNo)

  if (nextBlock){
    eatBlock(nextBlock)
    let tail = snake.shift()
    tail.release()
    restBlocks.push(tail)
  } else {
    snake.some(block => {
      if (block.no === nextBlockNo) {
        block.crash()
        return true
      }

      return false
    })
    gameOver()
  }
}

const timedTask = setInterval(moveForward, 200)

// window.addEventListener('click', moveForward)