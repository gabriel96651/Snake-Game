const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio("../assets/audio.mp3")

const size = 30;

let snake = [{ x: 270, y: 0 }]

const incrementScore = () => {
    score.innerHTML  = parseInt(score.innerHTML) + 10
}

const ramdomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const ramdomPosition = () => {
    const number = ramdomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const ramdomColor = () => {
    const red = ramdomNumber(0, 255)
    const green = ramdomNumber(0, 255)
    const blue = ramdomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

let direction, loopId

const food = {
    x: ramdomPosition(),
    y: ramdomPosition(),
    color: ramdomColor()
}

const drawFood = () => {

    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 30
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#7812d8";

    snake.forEach((position, index) => {

        if (index == snake.length - 1) {
            ctx.fillStyle = "yellow"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    const head = snake[snake.length - 1]

    if (!direction) return
    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    if (direction == "left") {
        snake.push({ x: head.x + -size, y: head.y })
    }
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }
    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "lightgrey"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = ramdomPosition()
        let y = ramdomPosition()

        while (snake.find((position) => position.x == x && position.y == y)){
            x = ramdomPosition()
            y = ramdomPosition()
        }

        food.x = x
        food.y = y
        food.color = ramdomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    
    const neckIndex = snake.length - 2
    const limitCanvas = 570

    const wallColision = head.x < 0 || head.x > limitCanvas || head.y < 0 || head.y > limitCanvas

    const selfColision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallColision || selfColision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerHTML = score.innerHTML
    canvas.style.filter = "blur(2px)"

}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 100)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "letft") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
})

buttonPlay.addEventListener("click" , () => {
    score.innerHTML = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [{ x: 270, y: 0 }]
})


