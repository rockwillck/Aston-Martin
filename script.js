apressed = false
dpressed = false
ad = false
function keydown(key) {
    if (key == "a" || key == "ArrowLeft") {
        velocity[0] = -0.05
        apressed = true
    }
    if (key == "d" || key == "ArrowRight") {
        velocity[0] = 0.05
        dpressed = true
    }
}

function keyup(key) {
    if ((key == "a" && velocity[0] < 0) || (key == "ArrowLeft" && velocity[0] < 0) || (key == "d" && velocity[0] > 0) || (key == "ArrowRight" && velocity[0] > 0)) {
        velocity[0] = 0
    }
}

var follow = true
function begin(f) {
    if (!started) {
        document.getElementById("menu").style.opacity = 0
        started = true
        var audio = new Audio("highoctane.mp3")
        audio.volume = 5/10
        audio.loop = true
        audio.play();
        follow = f
    }
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
        ctx.fillStyle = "gray"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        if (follow) {
            ctx.scale(2, 2)
            ctx.translate(canvas.width/4, canvas.height/4)
            ctx.rotate(-direction + Math.PI/2)
            // ctx.rotate(-direction)
            ctx.translate(-front[0], -front[1])
        }

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
    
        position = [(front[0] + front[0] + Math.cos(direction)*carLength)/2, (front[1] + front[1] + Math.sin(direction)*carLength)/2]
    
        back = [front[0] + Math.cos(direction)*carLength, front[1] + Math.sin(direction)*carLength]
        if (!follow) {
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
    
        if ((back[0] < -carLength || back[0] > canvas.width + carLength || back[1] < -carLength || back[1] > canvas.height + carLength) && follow) {
            ctx.beginPath()
            ctx.moveTo(position[0], position[1])
            ctx.lineTo(canvas.width/2, canvas.height/2)
            ctx.closePath()
            ctx.strokeStyle = ["rgb(150, 150, 150)", "rgb(250, 50, 50)"][Math.floor((frame % 50)/25)]
            ctx.lineWidth = 15
            ctx.stroke()
        }
    
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
                        setTimeout(() => {
                            document.getElementById("ui").style.opacity = 0
                            document.getElementById("playAgain").style.zIndex = 3
                            document.getElementById("playAgain").style.opacity = 1
                        }, 500)
                        clearInterval(id)
                    }
                }, 100)
            } else if (score < 10) {
                document.getElementById("ui").innerText = score
            }
        }

        frame++
        ctx.restore()
        
        if (follow && ad) {
            ctx.save()
            ctx.globalAlpha = 0.5
            ctx.fillStyle = "black"
            ctx.fillRect(10, 10, 300, 200)
            ctx.restore()
            ctx.save()
            ctx.rect(10, 10, 300, 200)
            ctx.clip()
            ctx.beginPath()
            ctx.arc(10 + position[0]*300/1536, 10 + position[1]*200/1024, 10, 0, 2*Math.PI)
            ctx.closePath()
            ctx.fillStyle = "yellow"
            ctx.fill()
            ctx.beginPath()
            ctx.arc(10 + target[0]*300/1536, 10 + target[1]*200/1024, 10, 0, 2*Math.PI)
            ctx.closePath()
            ctx.fillStyle = "red"
            ctx.fill()
            ctx.restore()
        }
    }
}