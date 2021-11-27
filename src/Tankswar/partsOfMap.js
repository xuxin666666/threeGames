// 地图的不同部分
import { playAudio } from '../utils'

let ctx = null, BSize = 25, volume = 10
function init(props) {
    ctx = props.ctx
    BSize = props.size
}
function getVolume(value) {
    if(value) volume = value
    return volume / 100
}
getVolume(3)
const key_codes = {
    w: 87,
    a: 65,
    s: 83,
    d: 68,
    space: 32,
    enter: 13,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    extraLeft: 100,
    extraUp: 104,
    extraRight: 102,
    extraDown: 98,
    extraSpace: 101,
    extraEnter: 108
}

class Map { // 整体地图
    constructor() {
        this.ctx = ctx
        this.BSize = BSize
        this.width = this.BSize
        this.height = this.BSize
    }
}
class Terrain extends Map { // 地形
    constructor() {
        super()
        this.img = new Image()
        this.img.src = '/assert/tanksWar/image/Map.bmp'
    }
}
class Water extends Terrain {
    constructor(position) {
        super()
        this.x = position.x
        this.y = position.y
        this.type = 'water'
        this.float = 0
        this.count = 0
        this.bindThis()
    }
    bindThis() {
        this.render = this.render.bind(this)
        this.flow = this.flow.bind(this)
    }
    flow() { // 不断改变水的图片，形成流动效果
        if (this.count < 5) {
            this.count++
            return
        }
        this.count = 0
        if (this.float === 0) this.float = 32
        else this.float = 0
    }
    render() {
        this.flow()
        this.ctx.drawImage(this.img, 96 + this.float, 0, 32, 32, this.x, this.y, this.width, this.height)
    }
}
class Brick extends Terrain {
    constructor(position) {
        super()
        this.x = position.x
        this.y = position.y
        this.type = 'brick'
        this.bindThis()
    }
    bindThis() {
        this.render = this.render.bind(this)
    }
    render() {
        this.ctx.drawImage(this.img, 0, 0, 32, 32, this.x, this.y, this.width, this.height)
    }
}
class Stone extends Terrain {
    constructor(position) {
        super()
        this.x = position.x
        this.y = position.y
        this.type = 'stone'
        this.bindThis()
    }
    bindThis() {
        this.render = this.render.bind(this)
    }
    render() {
        this.ctx.drawImage(this.img, 32, 0, 32, 32, this.x, this.y, this.width, this.height)
    }
}
class Grass extends Terrain {
    constructor(position) {
        super()
        this.x = position.x
        this.y = position.y
        this.type = 'grass'
        this.bindThis()
    }
    bindThis() {
        this.render = this.render.bind(this)
    }
    render() {
        this.ctx.drawImage(this.img, 64, 0, 32, 32, this.x, this.y, this.width, this.height)
    }
}
class Home extends Terrain {
    constructor(position) {
        super()
        this.x = position.x
        this.y = position.y
        this.type = 'home'
        this.float = 0
        this.bindThis()
    }
    bindThis() {
        this.render = this.render.bind(this)
        this.die = this.die.bind(this)
    }
    die() { // 挂了就换个图片
        this.float = 32
    }
    render() {
        this.ctx.drawImage(this.img, 160 + this.float, 0, 32, 32, this.x, this.y, this.width, this.height)
    }
}
class Bullect extends Map {
    constructor(props) {
        super()
        this.x = props.x // 位置，x
        this.y = props.y // 位置，y
        this.direction = props.direction // 方向
        this.type = 'bullect'
        this.parent = props.parent // 是谁的子弹
        this.width = 8 // 子弹的宽
        this.height = 8 // 子弹的高
        this.step = 8 // 子弹的运动速度
        this.sx = 0
        this.img = new Image()
        this.img.src = '/assert/tanksWar/image/Bullect.bmp'
        this.setTimer = null
        this.bindThis()
        this.setup(props)
    }
    bindThis() {
        this.render = this.render.bind(this)
    }
    setup(props) { // 刚生成时，设置子弹的位置
        var PW = props.width, PH = props.height
        if (this.direction === 'up') {
            this.x += PW / 2 - this.width / 2
            this.y -= this.height
        } else if (this.direction === 'right') {
            this.x += PW
            this.y += PH / 2 - this.height / 2
        } else if (this.direction === 'down') {
            this.x += PW / 2 - this.width / 2
            this.y += PH
        } else if (this.direction === 'left') {
            this.x -= this.width
            this.y += PH / 2 - this.height / 2
        }
    }
    render() {
        if (this.direction === 'up') {
            this.sx = 0
            this.y -= this.step
        } else if (this.direction === 'right') {
            this.sx = 8
            this.x += this.step
        } else if (this.direction === 'down') {
            this.sx = 16
            this.y += this.step
        } else if (this.direction === 'left') {
            this.sx = 24
            this.x -= this.step
        }
        this.ctx.drawImage(this.img, this.sx, 0, 8, 8, this.x, this.y, this.width, this.height)
    }
}
class Tank extends Map { // 坦克
    constructor(type) {
        super()
        this.width = this.width - 8
        this.height = this.height - 8
        this.sw = 28
        this.sh = 28
        this.bullects = []
        this.directionObj = {
            'up': 0,
            'right': this.sh,
            'down': 2 * this.sh,
            'left': 3 * this.sh
        }
        this.img = new Image()
        if (type === 'player1') {
            this.img.src = '/assert/tanksWar/image/Player1.bmp'
        } else if (type === 'player2') {
            this.img.src = '/assert/tanksWar/image/Player2.bmp'
        } else if (type === 'enemy') {
            this.img.src = '/assert/tanksWar/image/Enemys.bmp'
        }
        this.born = true // 是否还在出生
        this.invincible = true // 是否是无敌的
        this.imgBorn = new Image()
        this.imgBorn.src = '/assert/tanksWar/image/Born.bmp'
        this.bornX = 0
        this.bornY = 0
        this.bornW = 32
        this.bornH = 32
        this.bornCount = 0
        this.bornCountMax = 5
        this.bornProgress = [0, 32, 64, 96, 0, 32, 64, 96, 0, 32, 64, 96] // 出生时的过程
        this.bornIndex = 0
    }
    getAxis(x) {
        // console.log(x, this.size)
        return Math.floor(x / this.BSize)
    }
}
class Player extends Tank { // 玩家
    constructor(props) {
        super(props.player)
        this.x = props.position.x
        this.y = props.position.y
        this.lastX = this.x
        this.lastY = this.y
        this.type = 'player'
        this.HP = 1
        this.sx = 0
        this.sy = 0
        this.step = 3
        this.direction = 'up'
        this.nextDirection = 'up'
        this.keyPressed = []
        this.canMove = true
        this.move = {
            left: false,
            right: false,
            up: false,
            down: false
        }
        this.canAttack = true
        this.interval = 1000 / 60
        this.keyCode = {
            left: props.moveLeftKey,
            right: props.moveRightKey,
            up: props.moveUpKey,
            down: props.moveDownKey,
            attack: props.attackKey
        }
        this.listen = null
        this.audioIdle = playAudio('tanksWar', 'EngineIdle.mp3')
        this.audioDriving = playAudio('tanksWar', 'EngineDriving.mp3')
        this.audioFire = playAudio('tanksWar', 'Fire.wav')
        this.audioIdle.loop = true
        this.audioDriving.loop = true

        this.invincible = true
        this.invincibleCount = 0
        this.invincibleCountMax = 6
        this.invincibleTime = 60 * 7 // 最大无敌时间，7秒
        this.invincibleTimeCount = 0
        this.imgInvincible = new Image()
        this.imgInvincible.src = '/assert/tanksWar/image/Shield.bmp'
        this.invincibleX = 0
        this.invincibleY = 0
        this.invincibleW = 32
        this.invincibleH = 32

        this.bindThis()
        this.bindEvent()
    }
    bindThis() {
        this.render = this.render.bind(this)
        this.keydown = this.keydown.bind(this)
        this.keyup = this.keyup.bind(this)
        this.visibilitychange = this.visibilitychange.bind(this)
        this.audioPlayIdle = this.audioPlayIdle.bind(this)
        this.audioPlayDriving = this.audioPlayDriving.bind(this)
        this.setTimer = this.setTimer.bind(this)
        this.listenKeys = this.listenKeys.bind(this)
        this.keydownAction = this.keydownAction.bind(this)
        this.destroy = this.destroy.bind(this)
        this.mousemove = this.mousemove.bind(this)
    }
    bindEvent() {
        window.addEventListener('keydown', this.keydown)
        window.addEventListener('keyup', this.keyup)
        document.addEventListener('visibilitychange', this.visibilitychange)
        this.audioIdle.addEventListener('timeupdate', this.audioPlayIdle)
        this.audioDriving.addEventListener('timeupdate', this.audioPlayDriving)
        // window.addEventListener('click', this.mousemove)
        this.listenKeys()
    }
    visibilitychange() {
        if(document.hidden) {
            this.audioIdle.pause()
            this.audioDriving.pause()
        } else {
            this.audioIdle.play()
        }
    }
    mousemove(){
        this.audioIdle.play()
        window.removeEventListener('click', this.mousemove)
    }
    audioPlayIdle() {
        this.audioIdle.volume = getVolume()
        if(this.audioIdle.currentTime >= 6)
            this.audioIdle.currentTime = 1
    }
    audioPlayDriving() {
        this.audioDriving.volume = getVolume()
        if(this.audioDriving.currentTime >= 3)
            this.audioDriving.currentTime = 1
    }
    keydown(e) {
        for (let item in this.keyCode) {
            if (e.keyCode === this.keyCode[item]) {
                if (e.keyCode !== this.keyCode.attack) {
                    this.audioDriving.play()
                    this.audioIdle.pause()
                }

                if (this.keyPressed.indexOf(e.keyCode) === -1) {
                    this.keyPressed.push(e.keyCode)
                    this.keydownAction(e.keyCode)
                }
                return
            }
        }
    }
    listenKeys() {
        this.listen = setInterval(() => {
            if (document.hidden) {
                this.keyPressed.length = 0
                return
            }
            this.keyPressed.forEach(item => {
                this.keydownAction(item)
            })
        }, 60)
    }
    // 为了保证移动与渲染同步，不会出现卡墙里的现象，keydown事件不控制移动，而是控制是否移动和怎么移动
    keydownAction(keyCode) { 
        switch (keyCode) {
            case this.keyCode.up:
                this.nextDirection = 'up'
                this.move.up = true
                this.move.right = false
                this.move.down = false
                this.move.left = false
                break
            case this.keyCode.left:
                this.nextDirection = 'left'
                this.move.left = true
                this.move.up = false
                this.move.right = false
                this.move.down = false
                break
            case this.keyCode.down:
                this.nextDirection = 'down'
                this.move.down = true
                this.move.up = false
                this.move.right = false
                this.move.left = false
                break
            case this.keyCode.right:
                this.nextDirection = 'right'
                this.move.right = true
                this.move.up = false
                this.move.down = false
                this.move.left = false
                break
            case this.keyCode.attack:
                this.setTimer(() => {
                    this.audioFire.volume = getVolume()
                    this.audioFire.play()
                    this.bullects.push(new Bullect({
                        direction: this.direction,
                        x: this.x,
                        y: this.y,
                        width: this.width,
                        height: this.height,
                        parent: 'player'
                    }))
                }, 'attack')
                break
            default:
                break
        }
    }
    keyup(e) {
        this.keyPressed = this.keyPressed.filter(item => {
            return item !== e.keyCode
        })
        if (this.keyPressed.length === 0 || (this.keyPressed.length === 1 && this.keyPressed[0] === this.keyCode.attack)) {
            this.audioDriving.pause()
            this.audioIdle.play()
        }
        switch (e.keyCode) {
            case this.keyCode.up:
                this.move.up = false
                break
            case this.keyCode.left:
                this.move.left = false
                break
            case this.keyCode.down:
                this.move.down = false
                break
            case this.keyCode.right:
                this.move.right = false
                break
            default:
                break
        }
    }
    setTimer(callback, type) {
        switch (type) {
            case 'attack':
                if (this.canAttack) {
                    callback()
                    this.canAttack = false
                    setTimeout(() => {
                        this.canAttack = true
                    }, 500)
                }
                break
            default:
                break
        }
    }
    destroy() { // 卸载时清除掉interval和事件监听
        window.removeEventListener('keydown', this.keydown)
        window.removeEventListener('keyup', this.keyup)
        document.removeEventListener('visibilitychange', this.visibilitychange)
        this.audioIdle.removeEventListener('timeupdate', this.audioPlayIdle)
        this.audioDriving.removeEventListener('timeupdate', this.audioPlayDriving)
        clearInterval(this.listen)
        setTimeout(() => {
            this.audioIdle.pause()
            this.audioDriving.pause()
            this.audioFire.pause()
            this.audioIdle.remove()
            this.audioDriving.remove()
            this.audioFire.remove()
        }, 100)
    }
    render() {
        if(this.invincibleTimeCount < this.invincibleTime) {
            this.invincibleTimeCount++
        } else {
            this.invincible = false
            this.invincibleTimeCount = 0
        }

        if(this.born) {
            this.ctx.drawImage(this.imgBorn, this.bornX, this.bornY, this.bornW, this.bornH, this.x, this.y, this.width, this.height)
            this.bornCount++
            if(this.bornCount >= this.bornCountMax) {
                this.bornIndex++
                this.bornX = this.bornProgress[this.bornIndex]
                this.bornCount = 0
                if(this.bornIndex >= this.bornProgress.length) this.born = false
            }
            return
        }
        if(this.invincible) {
            this.ctx.drawImage(this.imgInvincible, this.invincibleX, this.invincibleY, this.invincibleW, this.invincibleH, this.x-3, this.y-3, this.width+6, this.height+6)
            this.invincibleCount++
            if(this.invincibleCount >= this.invincibleCountMax) {
                this.invincibleCount = 0
                this.invincibleY = this.invincibleH - this.invincibleY
            }
        }
        this.sy = this.directionObj[this.direction]
        if (this.x !== this.lastX || this.y !== this.lastY) {
            this.sx = 28 - this.sx
            this.lastX = this.x
            this.lastY = this.y
        }
        if (this.canMove) { // 控制移动的部分搬这里来了
            if (this.move.up && this.direction === 'up') this.y -= this.step
            else if (this.move.right && this.direction === 'right') this.x += this.step
            else if (this.move.down && this.direction === 'down') this.y += this.step
            else if (this.move.left && this.direction === 'left') this.x -= this.step
        }
        this.ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.width, this.height)
        this.direction = this.nextDirection
    }
}
class Enemy extends Tank { // 敌人
    constructor(props) {
        super('enemy')
        this.x = props.position.x
        this.y = props.position.y
        this.lastX = this.x
        this.lastY = this.y
        this.target = props.target || 'none'
        this.enemySX = { small: 0, middle: 112, large: 168 }
        this.enemyHP = { small: 1, middle: 2, large: 4 }
        this.enemyStep = { small: 4, middle: 3, large: 2 }
        this.size = props.size
        this.step = this.enemyStep[this.size]
        this.HP = this.enemyHP[this.size]
        this.sx = this.enemySX[this.size]
        this.sy = 2 * this.sh
        this.direction = 'down'
        this.type = 'enemy'
        this.canMove = true
        this.attackTimer = null
        this.findWayTimer = null
        this.path = []
        this.pathIndex = 0
        this.bindThis()
        this.attack()
    }
    bindThis() {
        this.render = this.render.bind(this)
        this.destroy = this.destroy.bind(this)
        this.controlDirection = this.controlDirection.bind(this)
    }
    attack() {
        this.attackTimer = setInterval(() => {
            if (document.hidden) return
            this.bullects.push(new Bullect({
                direction: this.direction,
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                parent: 'enemy'
            }))
        }, 5000)
    }
    destroy() {
        clearInterval(this.attackTimer)
        clearInterval(this.findWayTimer)
        this.attackTimer = null
        this.findWayTimer = null
        this.canMove = false
    }
    controlDirection() {
        if (this.path && this.path[this.pathIndex]) {
            var SI = this.getAxis(this.y), SJ = this.getAxis(this.x)
            var TI = this.path[this.pathIndex][0], TJ = this.path[this.pathIndex][1]

            if (TI > SI) {
                this.direction = 'down'
                if (this.getAxis(this.x + this.width) > SJ) {
                    this.direction = 'left'
                }
            } else if (TI < SI) {
                this.direction = 'up'
                if (this.getAxis(this.x + this.width) > SJ) {
                    this.direction = 'left'
                }
            } else if (TJ > SJ) {
                this.direction = 'right'
                if (this.getAxis(this.y + this.height) > SI) {
                    this.direction = 'up'
                }
            } else if (TJ < SJ) {
                this.direction = 'left'
                if (this.getAxis(this.y + this.height) > SI) {
                    this.direction = 'up'
                }
            }
            if (SI === TI && SJ === TJ)
                this.pathIndex++
        }

    }
    render() {
        if(this.born) {
            this.ctx.drawImage(this.imgBorn, this.bornX, this.bornY, this.bornW, this.bornH, this.x, this.y, this.width, this.height)
            this.bornCount++
            if(this.bornCount >= this.bornCountMax) {
                this.bornIndex++
                this.bornX = this.bornProgress[this.bornIndex]
                this.bornCount = 0
                if(this.bornIndex >= this.bornProgress.length) {
                    this.born = false
                    this.invincible = false
                }
            }
            return
        }

        this.sy = this.directionObj[this.direction]
        if (this.x !== this.lastX || this.y !== this.lastY) {
            this.sx = this.sw + 2 * this.enemySX[this.size] - this.sx
            this.lastX = this.x
            this.lastY = this.y
        }

        if (this.canMove) {
            if (this.direction === 'up') this.y -= this.step
            else if (this.direction === 'right') this.x += this.step
            else if (this.direction === 'down') this.y += this.step
            else this.x -= this.step
        }

        this.ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.width, this.height)
        this.controlDirection()
    }
}
class Bonus extends Map { // 奖励
    constructor(props){
        super()
        this.x = props.position.x
        this.y = props.position.y
        this.sy = 0
        this.sx = props.type === 'HP' ? 120 : 150
        this.sw = 30
        this.sh = 28
        this.type = 'bonus'
        this.species = props.type
        this.img = new Image()
        this.img.src = '/assert/tanksWar/image/Bonus.bmp'
    }
    render(){
        this.ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.width, this.height)
    }
}
const Player1 = (position) => {
    return new Player({
        position,
        player: 'player1',
        moveLeftKey: key_codes.a,
        moveRightKey: key_codes.d,
        moveUpKey: key_codes.w,
        moveDownKey: key_codes.s,
        attackKey: key_codes.space
    })
}
const Player2 = (position) => {
    return new Player({
        position,
        player: 'player2',
        moveLeftKey: key_codes.extraLeft,
        moveRightKey: key_codes.extraRight,
        moveUpKey: key_codes.extraUp,
        moveDownKey: key_codes.extraDown,
        attackKey: key_codes.extraSpace
    })
}

export { init, getVolume, Water, Brick, Stone, Grass, Home, Enemy, Bonus, Player1, Player2 }