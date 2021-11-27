// 主要的游戏功能部分
import { useCallback, useEffect, useRef, useState } from 'react'

import BeforeStart from './BeforeStart'
import { init, getVolume, Brick, Water, Stone, Grass, Home, Enemy, Bonus, Player1, Player2 } from './partsOfMap'
import { findWayHard } from './AStar'
import { playAudio } from '../utils'
import './scss/MainContent.scss'

const audio = {
    hit: playAudio('tanksWar', 'Hit.wav'),
    die: playAudio('tanksWar', 'Die.mp3'),
    start: playAudio('tanksWar', 'Start.wav'),
    explosion: playAudio('tanksWar', 'Explosion.wav'),
    heartDamage: playAudio('tanksWar', 'HeartDamage.mp3'),
    getBonus: playAudio('tanksWar', 'GetBonus.wav')
}

const MainContent = ({ state, dispatch }) => {
    const { volume, mode, gameover, begin, playerNum, maps } = state

    const [enemyDestoried, setEnemyDestoried] = useState(0) // 消灭敌人数
    const [player1Life, setPlayer1Life] = useState(3) // 玩家1的生命
    const [player2Life, setPlayer2Life] = useState(3) // 玩家2的生命

    const canvas = useRef()
    const rafId = useRef()
    const newgame = useRef()

    useEffect(() => { // 控制音频的声音大小
        getVolume(volume)
        audio.hit.volume = volume / 2 / 100
        audio.die.volume = volume / 100
        audio.start.volume = volume / 100
        audio.explosion.volume = volume / 100
        audio.heartDamage.volume = volume / 100
        audio.getBonus.volume = volume / 100
    }, [volume])

    useEffect(() => { // 页面隐藏后停止播放音频
        var audioPlay = {
            hit: false,
            die: false,
            start: false,
            explosion: false,
            heartDamage: false
        }
        function visibilitychange() {
            if (document.hidden) {
                for (let item in audio) {
                    if (!audio[item].paused) audioPlay[item] = true
                    audio[item].pause()
                }
            } else {
                for (let item in audio) {
                    if (audioPlay[item]) {
                        audio[item].play()
                        audioPlay[item] = false
                    }
                }
            }
        }
        document.addEventListener('visibilitychange', visibilitychange)
        return () => {
            document.removeEventListener('visibilitychange', visibilitychange)
        }
    }, [])

    useEffect(() => {
        if (player1Life === 0 || player2Life === 0) {
            dispatch({ type: 'gameover' })
            setTimeout(() => {
                dispatch({ type: 'reset' })
            }, 2000)
        }
    }, [player1Life, player2Life, dispatch])

    const RENDERER = useCallback(function () {
        this.Canvas = canvas.current // dom中的canvas元素
        this.Height = 20 // 高多少格
        this.Width = 27 // 宽多少格
        this.Size = 50 // 每一格多大（px）
        this.playerNum = playerNum
        this.mapArr = maps
    }, [playerNum, maps])
    RENDERER.prototype = {
        init: function () {
            if (this.Canvas) {
                this.setParams()
                this.bindThis()
                this.setup()
                this.bindEvent()
                this.render()
            }
        },
        setParams: function () {
            this.ctx = this.Canvas.getContext('2d')
            this.width = this.Width * this.Size
            this.height = this.Height * this.Size
            this.map = [] // 地图
            this.mapBarrier = [] // 所有坦克在地图中的分布
            this.home = null // 家
            this.enemyOrder = 0 // 控制在哪个位置生成敌人
            this.enemyDX = [0, Math.floor(this.Width / 2), this.Width - 1]
            this.enemyArr = [] // 敌人
            this.playerArr = [] // 玩家
            this.bonus = null // 奖励
            this.bonusInterval = null // 奖励生成
            this.bonusTimeout = null // 奖励销毁
        },
        bindThis: function () {
            this.render = this.render.bind(this)
            this.checkCollision = this.checkCollision.bind(this)
            this.bullectsRender = this.bullectsRender.bind(this)
            this.findWayEasy = this.findWayEasy.bind(this)
            this.findWayHard = this.findWayHard.bind(this)
            this.findWaySpecial = this.findWaySpecial.bind(this)
            this.checkCanMove = this.checkCanMove.bind(this)
            this.createEnemy = this.createEnemy.bind(this)
            this.getAxis = this.getAxis.bind(this)
            this.gameoverFunc = this.gameoverFunc.bind(this)
            this.destroy = this.destroy.bind(this)
            this.createBonus = this.createBonus.bind(this)
            this.getBonus = this.getBonus.bind(this)
        },
        setup: function () {
            init({ ctx: this.ctx, size: this.Size }) // 把参数传到模块中

            audio.start.play()
            this.Canvas.width = this.width
            this.Canvas.height = this.height
            this.findWayMode = { // 游戏模式对应的寻路机制
                'easy': this.findWayEasy,
                'hard': this.findWayHard,
                'special': this.findWaySpecial
            }
            
            for (let i = 0; i < this.Height; i++) { // 初始化地图
                this.map[i] = []
                this.mapBarrier[i] = []
            }
            this.drawMap(this.mapArr)
            
            this.createEnemy()
            this.createBonus()
        },
        drawMap: function(map){ // 根据map绘出地图及玩家
            var x, y
            for(let i = 0; i < this.Height; i++){
                for(let j = 0; j < this.Width; j++){
                    x = j * this.Size
                    y = i * this.Size
                    switch (map[i][j]) {
                        case 'player1':
                            this.playerArr[0] = Player1({x, y})
                            this.playerArr[0].audioIdle.play()
                            break
                        case 'player2':
                            this.playerArr[1] = Player2({x, y})
                            this.playerArr[1].audioIdle.play()
                            break
                        case 'brick':
                            this.map[i][j] = new Brick({x, y})
                            break
                        case 'water':
                            this.map[i][j] = new Water({x, y})
                            break
                        case 'stone':
                            this.map[i][j] = new Stone({x, y})
                            break
                        case 'grass':
                            this.map[i][j] = new Grass({x, y})
                            break
                        case 'home':
                            this.home = new Home({x, y})
                            this.map[i][j] = this.home
                            break
                        default:
                            this.map[i][j] = null
                    }
                }
            }
        },
        bindEvent: function () { // 绑定事件

        },
        destroy: function () { // 组件卸载时执行的函数
            this.playerArr.forEach(item => {
                item.destroy()
            })
            this.enemyArr.forEach(item => {
                item.destroy()
            })
            window.cancelAnimationFrame(rafId.current)
            clearInterval(this.createEnemyTimer)
            clearInterval(this.bonusInterval)
            clearTimeout(this.bonusTimeout)
            if (!audio.start.paused) {
                audio.start.pause()
                audio.start.currentTime = 0
            }
        },
        getAxis: function (x) { // 根据距离算出坐标
            return Math.floor(x / this.Size)
        },
        gameoverFunc: function () { // 游戏结束
            audio.heartDamage.play()
            this.home.die()
            setTimeout(() => {
                this.destroy()
                dispatch({ type: 'gameover' })
            }, 1000 / 30)
            setTimeout(() => {
                dispatch({ type: 'reset' })
            }, 3000)

        },
        getBonus: function (target) { // 得到奖励时
            var I, J
            clearTimeout(this.bonusTimeout)
            audio.getBonus.play()
            if (this.bonus.species === 'HP') {
                if (target === this.playerArr[0]) setPlayer1Life(c => c + 1)
                else setPlayer2Life(c => c + 1)
            } else {
                target.invincible = true
                target.invincibleTimeCount = 0
            }
            I = this.getAxis(this.bonus.y)
            J = this.getAxis(this.bonus.x)
            this.map[I][J] = null // 销毁掉奖励
            this.bonus = null // 销毁掉奖励
        },
        checkCollision: function (target, recept) { // 检测是否碰撞
            var mapWidth = this.width, mapHeight = this.height
            var targetX = target.x, targetY = target.y, targetW = target.width, targetH = target.height
            var step = target.step, transform = { x: 0, y: 0 }, direction = target.direction
            var nextX = targetX, nextY = targetY

            if (direction === 'up') transform.y -= step
            else if (direction === 'left') transform.x -= step
            else if (direction === 'down') transform.y += step
            else if (direction === 'right') transform.x += step
            nextX += transform.x
            nextY += transform.y
            // 检查是否出边界了
            if (nextX < 0 || nextY < 0 || nextX + targetW > mapWidth || nextY + targetH > mapHeight)
                return true
            // 检查被碰着是否为空
            if (recept === null || recept === undefined) return false

            var receptX = recept.x, receptY = recept.y, receptW = recept.width, receptH = recept.height

            if (target.type === 'player' || target.type === 'enemy') {
                if (Math.max(nextX, receptX) < Math.min(nextX + targetW, receptX + receptW)
                    && Math.max(nextY, receptY) < Math.min(nextY + targetH, receptY + receptH)
                ) {
                    if (recept.type === 'brick' || recept.type === 'stone' || recept.type === 'water' || recept.type === 'player' || recept.type === 'enemy' || recept.type === 'home') {
                        return true
                    } else if (target.type === 'player' && recept.type === 'bonus') {
                        this.getBonus(target)
                    }
                }
            } else if (target.type === 'bullect') {
                if (Math.max(targetX, receptX) < Math.min(targetX + targetW, receptX + receptW)
                    && Math.max(targetY, receptY) < Math.min(targetY + targetH, receptY + receptH)
                ) {
                    if (recept.type === 'stone') {
                        if (target.parent === 'player') audio.hit.play()
                        return 1
                    } else if (recept.type === 'brick') {
                        if (target.parent === 'player') audio.hit.play()
                        return 2
                    } else if ((target.parent === 'player' && recept.type === 'enemy') || (target.parent === 'enemy' && recept.type === 'player')) {
                        return 2
                    } else if (recept.type === 'home') {
                        this.gameoverFunc()
                    }

                }
            }
            return false
        },
        bullectsRender: function (theTank) { // 渲染子弹
            var bullectI, bullectJ, bullectAxis = [], flag, ceil, f = 0
            theTank.bullects.forEach(item => { // 执行坦克的每个子弹的函数
                bullectI = this.getAxis(item.y)
                bullectJ = this.getAxis(item.x)

                if (item.direction === 'up') {
                    bullectAxis[0] = [bullectI - 1, bullectJ - 1]
                    bullectAxis[1] = [bullectI - 1, bullectJ]
                    bullectAxis[2] = [bullectI - 1, bullectJ + 1]
                    bullectAxis[3] = [bullectI, bullectJ - 1]
                    bullectAxis[4] = [bullectI, bullectJ]
                    bullectAxis[5] = [bullectI, bullectJ + 1]
                } else if (item.direction === 'right') {
                    bullectAxis[0] = [bullectI - 1, bullectJ]
                    bullectAxis[1] = [bullectI, bullectJ]
                    bullectAxis[2] = [bullectI + 1, bullectJ]
                    bullectAxis[3] = [bullectI - 1, bullectJ + 1]
                    bullectAxis[4] = [bullectI, bullectJ + 1]
                    bullectAxis[5] = [bullectI + 1, bullectJ + 1]
                } else if (item.direction === 'down') {
                    bullectAxis[0] = [bullectI, bullectJ - 1]
                    bullectAxis[1] = [bullectI, bullectJ]
                    bullectAxis[2] = [bullectI, bullectJ + 1]
                    bullectAxis[3] = [bullectI + 1, bullectJ - 1]
                    bullectAxis[4] = [bullectI + 1, bullectJ]
                    bullectAxis[5] = [bullectI + 1, bullectJ + 1]
                } else if (item.direction === 'left') {
                    bullectAxis[0] = [bullectI - 1, bullectJ - 1]
                    bullectAxis[1] = [bullectI, bullectJ - 1]
                    bullectAxis[2] = [bullectI + 1, bullectJ - 1]
                    bullectAxis[3] = [bullectI - 1, bullectJ]
                    bullectAxis[4] = [bullectI, bullectJ]
                    bullectAxis[5] = [bullectI + 1, bullectJ]
                }
                for (let i = 0; i < 6; i++) { // 检查子弹前面6个位置
                    let bullect = bullectAxis[i]

                    if (bullect[0] >= 0 && bullect[0] < this.Height && bullect[1] >= 0 && bullect[1] < this.Width) {
                        flag = this.checkCollision(item, this.map[bullect[0]][bullect[1]])
                        if (flag === 1) { // 撞到石头上了
                            item.x = -100
                            break
                        } else if (flag === 2) { // 不是石头
                            item.x = -100
                            this.map[bullect[0]][bullect[1]] = null
                            break
                        }
                        ceil = this.mapBarrier[bullect[0]][bullect[1]]
                        if (ceil) { // 再次检查mapBarrier
                            for (let j = 0; j < ceil.length; j++) {
                                if (theTank !== ceil[j]) {
                                    flag = this.checkCollision(item, ceil[j])
                                    if (flag === 1) {
                                        item.x = -100
                                        f = 1
                                    } else if (flag === 2) { // 撞到对方坦克了
                                        item.x = -100
                                        if (!ceil[j].invincible) ceil[j].HP-- // 血量 -1
                                        f = 1
                                    }
                                }
                            }
                            if (f) break
                        }
                    }
                }
                item.render() // 把子弹画出来
            })
        },
        filterBullects: function (theTank) { // 剔除掉没用的子弹
            var x, y
            theTank.bullects = theTank.bullects.filter(item => {
                x = item.x + item.width
                y = item.y + item.height
                return x >= 0 && y >= 0 && item.x <= this.width && item.y <= this.height
            })
        },
        checkCanMove: function (theTank) { // 判断坦克是否能移动
            var I = Math.floor(theTank.y / this.Size), J = Math.floor(theTank.x / this.Size)
            var x = 0, y = 0

            theTank.canMove = true
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    x = I + i
                    y = J + j
                    if (x >= 0 && x < this.Height && y >= 0 && y < this.Width) {
                        if (this.checkCollision(theTank, this.map[x][y])) { // 撞到障碍物
                            theTank.canMove = false
                            return
                        }
                        if (this.mapBarrier[x][y]) { // 撞到坦克
                            // console.log(this.mapBarrier[I][J])
                            this.mapBarrier[x][y].forEach(item => {
                                if (theTank !== item && this.checkCollision(theTank, item)) {
                                    theTank.canMove = false
                                    return
                                }
                            })
                        }
                    }
                }
            }
        },
        findWayEasy: function (theTank) { // 简单模式找路，随机走，往老家走的概率大些
            var destination, contrary, randomTime
            var findway = () => {
                if (!document.hidden) {
                    var index = 10 * Math.random(), I, J
                    if (this.home.x > theTank.x) {
                        destination = this.Width - 1
                        contrary = 0
                    } else {
                        destination = 0
                        contrary = this.Width - 1
                    }
                    // console.log(this)
                    I = this.getAxis(theTank.y)
                    J = this.getAxis(theTank.x)
                    theTank.path = []
                    if (index < 2) {
                        // theTank.direction = 'up'
                        theTank.path.push([0, J])
                    } else if (index < 4) {
                        // theTank.direction = contrary
                        theTank.path.push([I, contrary])
                    } else if (index < 7) {
                        // theTank.direction = 'down'
                        theTank.path.push([this.Height - 1, J])
                    } else {
                        // theTank.direction = destination
                        theTank.path.push([I, destination])
                    }
                    theTank.pathIndex = 0
                }
            }
            function find() {
                clearInterval(theTank.findWayTimer)
                randomTime = Math.random() * 2000 + 2000
                theTank.findWayTimer = setInterval(() => {
                    findway()
                    find()
                }, randomTime)
            }
            find()
        },
        findWayHard: function (theTank) { // 困难模式，追着玩家打
            var SI, SJ, EI, EJ, path, start, end
            theTank.findWayTimer = setInterval(() => {
                if (document.hidden) return

                // console.log(this)
                SI = this.getAxis(theTank.y)
                SJ = this.getAxis(theTank.x)
                start = [SI, SJ]
                if (theTank.target === 'player1') {
                    EI = this.getAxis(this.playerArr[0].y)
                    EJ = this.getAxis(this.playerArr[0].x)
                } else {
                    EI = this.getAxis(this.playerArr[1].y)
                    EJ = this.getAxis(this.playerArr[1].x)
                }
                end = [EI, EJ]
                path = findWayHard(this.map, start, end, false)
                if (path === null)
                    path = findWayHard(this.map, start, end, true)
                theTank.path = path
                theTank.pathIndex = 0
            }, 2000)
        },
        findWaySpecial: function (theTank) { // 特殊模式，直捣黄龙
            var SI, SJ, EI, EJ, path, start, end
            theTank.findWayTimer = setInterval(() => {
                if (document.hidden) return

                SI = this.getAxis(theTank.y)
                SJ = this.getAxis(theTank.x)
                EI = this.getAxis(this.home.y)
                EJ = this.getAxis(this.home.x)
                start = [SI, SJ]
                end = [EI, EJ]
                path = findWayHard(this.map, start, end, false)
                if (path === null)
                    path = findWayHard(this.map, start, end, true)
                theTank.path = path
                theTank.pathIndex = 0
            }, 3000)
        },
        createEnemy: function () { // 创建敌人
            var barrier
            this.createEnemyTimer = setInterval(() => {
                // 场上最多5个敌人
                if (document.hidden || this.enemyArr.length >= 5) return
                barrier = [
                    this.mapBarrier[0][this.enemyDX[this.enemyOrder]],
                    this.mapBarrier[0][this.enemyDX[this.enemyOrder] - 1]
                ]
                for (let i = 0; i < barrier.length; i++) {
                    if (barrier[i]) {
                        for (let j = 0; j < barrier[i].length; j++) {
                            if (barrier[i][j].type === 'player' || barrier[i][j].type === 'enemy') {
                                // 当前位置不是空的，则顺延到下个位置产生敌人
                                setTimeout(() => {
                                    this.enemyOrder++
                                    if (this.enemyOrder === 3) this.enemyOrder = 0
                                    this.createEnemy()
                                }, 100)
                                return
                            }
                        }
                    }
                }
                var y = 0, x = this.enemyDX[this.enemyOrder] * this.Size
                var ran = Math.random(), size = 'small', target, newEnemy
                if (ran < 0.5) size = 'small'
                else if (ran < 0.8) size = 'middle'
                else size = 'large'

                if (mode === 'easy') target = 'none'
                else if (mode === 'special') target = 'home'
                else {
                    if (Math.floor(this.playerArr.length * Math.random()) === 0)
                        target = 'player1'
                    else target = 'player2'
                }

                newEnemy = new Enemy({
                    position: { x, y },
                    size,
                    target
                })
                this.findWayMode[mode](newEnemy) // 给敌人添加寻路功能
                this.enemyArr.push(newEnemy)

                this.enemyOrder++
                if (this.enemyOrder === 3) this.enemyOrder = 0
            }, 3000)
        },
        createBonus: function () { // 定期出现奖励
            var I = 0, J = 0, type
            this.bonusTimer = setInterval(() => {
                if (document.hidden) return

                clearTimeout(this.bonusTimeout)
                if (Math.random() < 0.5) type = 'HP'
                else type = 'Shield'

                do { // 找个空位放奖励
                    I = Math.floor(Math.random() * this.Height)
                    J = Math.floor(Math.random() * this.Width)
                } while (this.map[I][J] !== null)

                this.bonus = new Bonus({
                    type,
                    position: { y: I * this.Size, x: J * this.Size }
                })
                this.map[I][J] = this.bonus
                this.bonusTimeout = setTimeout(() => { // 奖励出现15s后自动消失
                    this.bonus = null
                    this.map[I][J] = null
                }, 15 * 1000)
            }, 30 * 1000)
        },
        filterTanks: function () { // 剔除掉挂掉的坦克
            for (let i = 0; i < 2; i++) {
                if (this.playerArr[i] && this.playerArr[i].HP <= 0) {
                    this.playerArr[i].destroy()
                    audio.die.play()

                    if (i === 0) {
                        setPlayer1Life(c => c - 1)
                        this.playerArr[i] = Player1({
                            y: (this.Height - 1) * this.Size,
                            x: (Math.floor(this.Width / 2) - 2) * this.Size
                        })
                    } else {
                        setPlayer2Life(c => c - 1)
                        this.playerArr[i] = Player2({
                            x: (Math.floor(this.Width / 2) + 2) * this.Size,
                            y: (this.Height - 1) * this.Size
                        })
                    }
                    this.playerArr[i].audioIdle.play()
                }
            }
            this.enemyArr = this.enemyArr.filter(item => {
                if (item.HP > 0) return true
                else {
                    audio.explosion.play()
                    item.destroy()
                    setEnemyDestoried(c => c + 1)
                    return false
                }
            })
        },
        initMapBarrier: function () { // 记录坦克的位置以及一些每次渲染时的初始化操作
            var I, J
            for (let i = 0; i < this.Height; i++) {
                this.mapBarrier[i].length = 0
            }
            this.filterTanks()

            this.playerArr.forEach(item => {
                I = this.getAxis(item.y)
                J = this.getAxis(item.x)
                if (I < 0) I = 0
                else if (I >= this.Height) I = this.Height - 1
                if (J < 0) J = 0
                else if (J >= this.Width) J = this.Width - 1

                if (!this.mapBarrier[I][J])
                    this.mapBarrier[I][J] = []
                this.mapBarrier[I][J].push(item)
                this.filterBullects(item)
            })

            this.enemyArr.forEach(item => {
                I = this.getAxis(item.y)
                J = this.getAxis(item.x)
                if (I < 0) I = 0
                else if (I >= this.Height) I = this.Height - 1
                if (J < 0) J = 0
                else if (J >= this.Width) J = this.Width - 1

                if (!this.mapBarrier[I][J])
                    this.mapBarrier[I][J] = []
                this.mapBarrier[I][J].push(item)
                this.filterBullects(item)
            })
        },
        render: function () { // 总的渲染
            // console.time('x')
            rafId.current = window.requestAnimationFrame(this.render)

            this.initMapBarrier()

            this.ctx.clearRect(0, 0, this.width, this.height)

            this.playerArr.forEach(item => {
                this.checkCanMove(item)
                item.render()
            })

            this.enemyArr.forEach(item => {
                this.checkCanMove(item)
                item.render()
            })

            this.map.forEach(item => {
                item.forEach(ceil => {
                    if (ceil && ceil.render)
                        ceil.render()
                })
            })

            this.enemyArr.forEach(item => {
                this.bullectsRender(item)
            })

            this.playerArr.forEach(item => {
                this.bullectsRender(item)
            })

            this.bonus && this.bonus.render()

            // console.timeEnd('x')
        }
    }

    useEffect(() => {
        newgame.current = null
        if (!gameover && begin) {
            setPlayer1Life(3)
            setPlayer2Life(3)
            setEnemyDestoried(0)
            newgame.current = new RENDERER()
            newgame.current.init()
        }
        return () => {
            newgame.current && newgame.current.destroy()
        }
    }, [gameover, begin, RENDERER])

    return (
        <div className='transwarMain'>
            {
                !begin
                    ? <BeforeStart dispatch={dispatch} state={state} />
                    : <div className='content'>
                        <canvas ref={canvas} className='canvas'>你的浏览器不支持canvas，请升级或更换浏览器</canvas>
                        <div className='menuBar'>
                            <div className='mask'></div>
                            <div>
                                <img src='/assert/tanksWar/image/UIViewWipe.bmp' alt='img' className='UIView' />
                                <div className='span'>{enemyDestoried}</div>
                            </div>
                            <div>
                                <img src='/assert/tanksWar/image/UIViewIP.bmp' alt='img' className='UIView' />
                                <img src='/assert/tanksWar/image/UIViewLife.bmp' alt='img' className='UIView' />
                                <div className='span'>{player1Life}</div>
                            </div>
                            {
                                playerNum === 2
                                    ? <div>
                                        <img src='/assert/tanksWar/image/UIViewIIP.bmp' alt='img' className='UIView' />
                                        <img src='/assert/tanksWar/image/UIViewLife.bmp' alt='img' className='UIView' />
                                        <div className='span'>{player2Life}</div>
                                    </div>
                                    : null
                            }

                        </div>
                    </div>
            }
        </div>
    )
}

export default MainContent