apressed = false
dpressed = false
ad = false
function keydown(key) {
    if (key == "a" || key == "ArrowLeft") {
        velocity[0] = -0.1
        apressed = true
    }
    if (key == "d" || key == "ArrowRight") {
        velocity[0] = 0.1
        dpressed = true
    }
}

function keyup(key) {
    if ((key == "a" && velocity[0] < 0) || (key == "ArrowLeft" && velocity[0] < 0) || (key == "d" && velocity[0] > 0) || (key == "ArrowRight" && velocity[0] > 0)) {
        velocity[0] = 0
    }
}

function begin() {
    document.getElementById("menu").style.opacity = 0
    started = true
    var audio = new Audio("highoctane.mp3")
    audio.volume = 5/10
    audio.loop = true
    audio.play();
}

var direction = 0
var front = [canvas.width/2, canvas.height/2]
var carLength = 100
var carWidth = 50
var velocity = [0, 10]
var tracks = []
var target = [-canvas.width, -canvas.height]
var targetRadius = 50
var frame = 0
var score = 0
var started = false
function runtime() {
    if (started) {
        if (apressed && dpressed && !ad) {
            id = setInterval(() => {
                if (document.getElementById("ui").innerText.length > 0) {
                    document.getElementById("ui").innerText = document.getElementById("ui").innerText.slice(0, -1)
                } else {
                    index = 1
                    next = "HIT 10 TARGETS"
                    id2 = setInterval(() => {
                        if (index <= next.length) {
                            document.getElementById("ui").innerText = next.slice(0, index)
                            index++
                        } else {
                            target = [Math.random()*canvas.width*0.8 + canvas.width*0.1, Math.random()*canvas.height*0.8 + canvas.height*0.1]
                            clearInterval(id2)
                        }
                    }, 100)
                    clearInterval(id)
                }
            }, 100)
            ad = true
        }
        direction += velocity[0]
    
        ctx.fillStyle = "gray"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    
        position = [(front[0] + front[0] + Math.cos(direction)*carLength)/2, (front[1] + front[1] + Math.sin(direction)*carLength)/2]
    
        back = [front[0] + Math.cos(direction)*carLength, front[1] + Math.sin(direction)*carLength]
        if (back[0] < -carLength) {
            front[0] = canvas.width
        } else if (back[0] > canvas.width + carLength) {
            front[0] = 0
        }
        if (back[1] < -carLength) {
            front[1] = canvas.height
        } else if (back[1] > canvas.height + carLength) {
            front[1] = 0
        }
    
        front[0] -= Math.cos(direction)*velocity[1]
        front[1] -= Math.sin(direction)*velocity[1]
    
        ctx.fillStyle = "rgb(70, 70, 70)"
        tracks.forEach((track, index) => {
            ctx.save()
            ctx.globalAlpha = index/tracks.length
            ctx.beginPath()
            ctx.arc(track[0][0], track[0][1], 10, 0, 2*Math.PI)
            ctx.closePath()
            ctx.fill()
            ctx.restore()
        })
    
        tracks.forEach((track, index) => {
            ctx.save()
            ctx.globalAlpha = index/tracks.length
            ctx.beginPath()
            ctx.arc(track[1][0], track[1][1], 10, 0, 2*Math.PI)
            ctx.closePath()
            ctx.fill()
            ctx.restore()
    
            if (tracks.length - index > 100) {
                tracks.splice(index, 1)
            }
        })
    
        car = new Image()
        car.src = "aston.png"
        ctx.save()
        ctx.translate(position[0], position[1])
        ctx.rotate(-Math.PI/2 + direction)
        ctx.drawImage(car, -carWidth/2, -carLength/2, carWidth, carLength)
        ctx.restore()
    
        tracks.push([[front[0] + Math.cos(direction)*carLength + Math.cos(Math.PI/2 + direction)*carWidth/2 - Math.cos(Math.PI/2 + direction)*10, front[1] + Math.sin(direction)*carLength + Math.sin(Math.PI/2 + direction)*carWidth/2 - Math.sin(Math.PI/2 + direction)*10], [front[0] + Math.cos(direction)*carLength - Math.cos(Math.PI/2 + direction)*carWidth/2 + Math.cos(Math.PI/2 + direction)*10, front[1] + Math.sin(direction)*carLength - Math.sin(Math.PI/2 + direction)*carWidth/2 + Math.sin(Math.PI/2 + direction)*10]])
        
        ctx.strokeStyle = "red"
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.arc(target[0], target[1], targetRadius, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = "red"
        ctx.beginPath()
        ctx.arc(target[0], target[1], Math.abs(frame % 200 - 100)/100 * targetRadius, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
    
        if (Math.sqrt((position[0] - target[0])**2 + (position[1] - target[1])**2) <= carLength/2 + targetRadius) {
            target = [Math.random()*canvas.width*0.8 + canvas.width*0.1, Math.random()*canvas.height*0.8 + canvas.height*0.1]
            score += 1
            if (score == 10) {
                index = 1
                next = "MERRY CHRISTMAS!"
                id = setInterval(() => {
                    if (index <= next.length) {
                        document.getElementById("ui").innerText = next.slice(0, index)
                        index++
                    } else {
                        clearInterval(id)
                    }
                }, 100)
            } else if (score < 10) {
                document.getElementById("ui").innerText = score
            }
        }
    
        frame++
    }
}