// Tetris的主要逻辑和展示部分
// 游戏的展示区（stage）和侧边栏操作区共用的状态太多了，所以就不分开了

import { useCallback, useState, useEffect, useRef } from 'react'
import { message } from 'antd'
import axios from 'axios'
import store from 'store'

import Header from "../components/Header"
import Display from './Display'
import PaiMeng from '../components/PaiMeng'
// import { useInterval, useEleInterval } from '../hook/useInterval'
import { useEleInterval } from '../hook/useInterval'
import { randomTetrimino } from './Tetrimino'
import './scss/index.scss'
import Mask from '../components/Mask'


// 获取新的方块，返回新的方块和一些其他信息
const getTetri = () => {
    var tetri = randomTetrimino(), len1 = tetri[0].length
    var X = -len1, flag = 1
    for (let i = 0; i < tetri[0][0].length; i++) {
        if (tetri[0][len1 - 1][i] !== '0') flag = 0
    }
    if (flag) X++ // 使的方块有颜色的部分的底部刚好在地图外
    return { tetri, index: 0, pos: { X, Y: 4 }, moveable: true }
    // tetri：方块类型，index：方块的旋转状态
    // pos：方块相对地图左上角的位置，moveable：该方块是否可动
}

const Tetris = () => {
    const Height = 22, Width = 11 // 地图的高、宽
    const MaxSpeed = 5 // 速度最大为4.5格/秒
    // const Interval = 8 // 根据时长更新速度时，每8秒速度增一次

    const [isStart, setIsStart] = useState(false) // 游戏是否开始
    const [isPause, setIsPause] = useState(false) // 游戏是否暂停
    const [isGameover, setIsGameover] = useState(false) // 游戏是否结束
    const [cur, setCur] = useState(getTetri()) // 当前可移动的方块
    const [next, setNext] = useState(getTetri()) // 下一个方块
    const [speed, setSpeed] = useState(1.0) // 方块下落的速度：格/秒
    const [stage, setStage] = useState(Array.from(Array(Height), () => Array(Width).fill({ type: '0', moveable: true }))) // 地图
    const [score, setScore] = useState(0) // 得分
    const [maskVis, setMaskVis] = useState(false)
    const [showScores, setShowScores] = useState([])

    const startBtn = useRef() // 开始、暂停、继续 按钮的ref
    const timeCount = useRef(0) // 根据时长更新速度时，用以计时
    const mouseInterval = useRef() // 保存mousedown事件调用的函数的interval的id
    const mouseTimeout = useRef() // 保存mousedown事件调用的函数的timeout的id
    const operation = useRef() // 控制方块的操作函数置于此处
    const maskContent = useRef() // 遮罩层的内容块

    // useInterval(() => { // 根据时长更新速度
    //     if (!isStart || isPause || isGameover) return

    //     timeCount.current++
    //     if (timeCount.current === Interval) {
    //         setSpeed(speed + 0.1)
    //         timeCount.current = 0
    //     }
    // }, speed < MaxSpeed ? 1000 : null)

    useEffect(() => { // 根据得分更新速度
        var spe = 1
        if (spe < MaxSpeed) {
            spe = score / 100 + 1
            if (spe > MaxSpeed) spe = MaxSpeed
            setSpeed(spe)
        }
    }, [score])

    useEleInterval(() => {
        if (isStart && !isPause && !isGameover) {
            drop()
        }
    }, 1000 / speed)

    // 记录分数
    const recordScore = useCallback(async (score) => {
        setScore(0)
        if(store.get("login")) { // 如果登录了，就把分数上传到服务器
            const {data: res} = await axios.post("/tetris/postScores", {"scores": score})
            if(res.status === 200) {
                message.success("分数上传成功", 1)
            } else {
                message.error("分数上传失败", 1)
            }
        }

        // 本地也存一份
        var tetrisScores, currentTime = new Date().getTime()
        var newScore = score + '`' + currentTime + "```", resScores = '', flag = true
        if(!store.get('tetris', false)) {
            resScores = newScore
        } else {
            tetrisScores = store.get('tetris')
            var oneScore = tetrisScores.split("```"), s
            if(oneScore.length - 1 < 5) {
                for(let i = 0; i < oneScore.length - 1; i++) {
                    s = oneScore[i].split('`')[0]
                    if(parseInt(s) < score && flag) {
                        resScores = resScores + newScore
                        flag = false
                    }
                    resScores = resScores + oneScore[i] + '```'
                }
                if(flag) {
                    resScores = resScores + newScore
                }
            } else {
                for(let i = 0; i < oneScore.length - 1; i++) {
                    s = oneScore[i].split('`')[0]
                    if(flag && parseInt(s) < score) {
                        resScores = resScores + newScore
                        flag = false
                    }
                    if (flag || i < oneScore.length - 2) 
                        resScores = resScores + oneScore[i] + '```'
                }
            }
        }
        store.set('tetris', resScores)
    }, [])

    // 游戏结束了，做好收尾工作和准备下一局游戏
    const gameover = useCallback(() => {
        message.info('游戏结束')
        setIsGameover(true)
        setIsPause(false)
        setIsStart(false)
        setCur(getTetri())
        setNext(getTetri())
        setSpeed(1)
        setStage(Array.from(Array(Height), () => Array(Width).fill({ type: '0', moveable: true })))
        recordScore(score)

        timeCount.current = 0
        startBtn.current.src = '/assert/tetris/image/pause.png'
        startBtn.current.title = '点击开始游戏'
    }, [recordScore, score])

    // 执行清除操作并计算得分
    const sweep = useCallback((stage) => {
        var len1 = Height, len2 = Width
        let i, j, flag, newStage = []
        for (i = 0; i < len1; i++) {
            // console.log(newStage)
            flag = 1
            for (j = 0; j < len2; j++) {
                if (stage[i][j].type === '0' || stage[i][j].moveable) {
                    flag = 0
                    break
                }
            }
            if (!flag) newStage.push(stage[i]) // 这一行没满，不动
            else {
                // 满了，丢掉这一行，添加新的行，并计分
                newStage.unshift(Array.from(Array(11), () => ({ type: '0', moveable: true })))
                setScore(c => c + 10)
            }
        }
        // return JSON.parse(JSON.stringify(newStage))
        return newStage
    }, [])

    // 把cur对应的数据拷贝到stage对应的位置
    const updateStage = useCallback((cur, manual = false, s) => {
        // cur：当前的可移动方块
        // manual：是否手动setStage，为false的话自动setStage， 否则返回拷贝后的stage
        // s：手动传一份stage，不用state里的stage

        // 先复制一份stage，每个格子moveable为true时type设置为0，因为它们是可动的，要清除残留
        s = s || stage.map(item =>
            item.map(ceil =>
                ceil.moveable ? { type: '0', moveable: true } : ceil
            )
        )
        var i, j, index = cur.index
        var X = cur.pos.X, Y = cur.pos.Y, len = cur.tetri[index].length
        for (i = 0; i < len; i++) {
            if (i + X < 0) continue
            for (j = 0; j < len; j++) {
                if (cur.tetri[index][i][j] !== '0') {
                    s[i + X][j + Y].type = cur.tetri[index][i][j]
                    s[i + X][j + Y].moveable = cur.moveable
                }
            }
        }
        if (!manual) setStage(s)
        else return s
    }, [stage])

    // 检查能否把cur复制到stage中
    const checkEnable = useCallback((cur) => {
        var index = cur.index, i, j
        var X = cur.pos.X, Y = cur.pos.Y, len = cur.tetri[index].length
        for (i = 0; i < len; i++) {
            if (i + X < 0) { // 方块没出来的部分，保证左右不越界就行
                for (j = 0; j < len; j++) {
                    if (cur.tetri[index][i][j] !== '0' && (Y + j < 0 || Y + j >= Width))
                        return false
                }
                continue
            }
            for (j = 0; j < len; j++) {
                // 当前格子不为'0'时：格子在地图中、格子能动，有一个不满足就返回false
                if (cur.tetri[index][i][j] !== '0'
                    && (X + i < 0
                        || Y + j < 0
                        || X + i >= Height
                        || Y + j >= Width
                        || !stage[i + X][j + Y].moveable
                    )
                ) {
                    return false
                }
            }
        }
        return true
    }, [stage])

    // 控制方块的旋转
    const rotate = useCallback((c) => {
        if (c.pos.X < 0) return // 方块没完全出来时不能旋转
        var index = c.index, len1 = c.tetri.length, len2 = c.tetri[0].length
        let i, j
        index++ // 得到方块旋转一次后的形状
        if (index >= len1) index = 0 // 轮回
        c.index = index
        for (i = 0; i < len2; i++) {
            for (j = 0; j < len2; j++) {
                if (c.tetri[index][i][j] !== '0') {
                    // 如果旋转后方块的左侧或右侧超出边界，就调整位置
                    while (j + c.pos.Y < 0) c.pos.Y++
                    while (j + c.pos.Y >= Width) c.pos.Y--
                }
            }
        }
        if (checkEnable(c)) {
            updateStage(c)
            setCur(c)
        }
    }, [checkEnable, updateStage])

    const drop = useCallback(() => {
        var cCur = JSON.parse(JSON.stringify(cur)) // 事先拷贝一份，避免直接修改原对象
        cCur.pos.X++ // 方块掉落一格
        if (checkEnable(cCur)) {
            updateStage(cCur)
            setCur(cCur)
        } else {
            if (cur.pos.X <= 0) gameover()
            else {
                var cStage, cNext = JSON.parse(JSON.stringify(next))
                cNext.pos.X++
                cCur.pos.X--
                cCur.moveable = false
                cStage = updateStage(cCur, true)
                cStage = sweep(cStage)
                updateStage(cNext, false, cStage) // 当前方块不动了，提前传入下一个方块到stage
                setCur(cNext)
                setNext(getTetri())
            }
        }
    }, [cur, next, checkEnable, updateStage, sweep, gameover])

    useEffect(() => {
        // 操作部分
        // mousedown事件设置了interval循环调用函数，确保每次函数都是最新的
        operation.current = function (type) {
            if (!isStart || isPause || isGameover) return

            var c = JSON.parse(JSON.stringify(cur))
            switch (type) {
                case 'up': // 旋转
                    rotate(c)
                    break
                case 'left': // 往左移一格
                    c.pos.Y--
                    if (checkEnable(c)) {
                        updateStage(c)
                        setCur(c)
                    }
                    break
                case 'right': // 往右移一格
                    c.pos.Y++
                    if (checkEnable(c)) {
                        updateStage(c)
                        setCur(c)
                    }
                    break
                case 'down': // 往下移一格
                    drop()
                    break
                default:
                    throw new Error("wrong type: ", type)
            }
        }
    }, [cur, isStart, isPause, isGameover, checkEnable, updateStage, rotate, drop])

    // 鼠标长按能快速多次操作
    const continueOpera = useCallback((type, e) => {
        // 阻止默认行为和冒泡，否则很容易丢失mouseup事件的监听
        e.preventDefault();
        e.stopPropagation();
        mouseTimeout.current = setTimeout(() => {
            mouseInterval.current = setInterval(() => {
                operation.current(type)
            }, 60)
        }, 500)
    }, [])

    // 清除interval和timeout
    const clearMouseDown = useCallback((e) => {
        clearTimeout(mouseTimeout.current)
        clearInterval(mouseInterval.current)
    }, [])

    // 控制游戏的开始、暂停与继续，同时更改对应的图片和文本
    const startAndPause = useCallback(() => {
        if (!isStart) {
            setIsGameover(false)
            setIsStart(true)
            startBtn.current.src = '/assert/tetris/image/going.png'
            startBtn.current.title = '点击暂停游戏'
            return
        }
        if (isPause) {
            setIsPause(false)
            startBtn.current.src = '/assert/tetris/image/going.png'
            startBtn.current.title = '点击暂停游戏'
        } else {
            setIsPause(true)
            startBtn.current.src = '/assert/tetris/image/pause.png'
            startBtn.current.title = '点击继续游戏'
        }
    }, [isStart, isPause])

    // 用键盘来操作
    const onKeyDown = useCallback((e) => {
        if (e.keyCode === 87 || e.keyCode === 38) operation.current('up')
        else if (e.keyCode === 65 || e.keyCode === 37) operation.current('left')
        else if (e.keyCode === 68 || e.keyCode === 39) operation.current('right')
        else if (e.keyCode === 83 || e.keyCode === 40) operation.current('down')
        else if (e.keyCode === 32) startAndPause()
    }, [startAndPause])

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('mouseup', clearMouseDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('mouseup', clearMouseDown)
        }
    }, [onKeyDown, clearMouseDown])

    // 点击查看成绩
    const sheetClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setMaskVis(c => !c)
    }, [])

    useEffect(() => {
        function click(e){
            if(!maskContent.current.contains(e.target)) {
                setMaskVis(false)
            }
        }
        window.addEventListener('click', click)
        return () => {
            window.removeEventListener('click', click)
        }
    }, [])

    // 请求分数以展示
    useEffect(() => {
        if(!maskVis) return

        async function postScores(){
            var scores = store.get('tetris', '')
            const {data:res} = await axios.post('/tetris/postScores/list', {scores})
            if(res.status === 200) {
                scores = res.data.scores
                store.set('tetris', scores)
            } else {
                message.error("获取得分失败，正在展示本地数据")
            }
        }
        if(store.get('login', false)) { // 如果登录了，先把数据传到服务器，再获取服务器合并后的数据
            postScores()
        }

        var scores = store.get('tetris', ''), scoreArr = []
        scoreArr = scores.split("```")
        scoreArr.pop()
        for(let i = 0; i < scoreArr.length; i++) {
            scoreArr[i] = scoreArr[i].split("`")
            scoreArr[i][1] = new Date(parseInt(scoreArr[i][1])).toLocaleDateString()
        }
        setShowScores(scoreArr)
    }, [maskVis])

    return (
        <div className='tetrisContain'>
            <div className='tetris'>
                <Header background='skyblue'>
                    <div className="tetrisHeader">
                        <div className="scoreBoard">{score}</div>
                        <img src='/assert/tetris/image/sheetContent.png' alt='img' className='scores' onClick={sheetClick} />
                    </div>
                </Header>
                <div className='tetrisMain'>
                    <div className="tetrisContent">
                        {
                            isStart
                                ? isPause
                                    ? <div className='tetrisPaused'>
                                        <img src='/assert/tetris/image/upcoming.png' alt="img" />
                                        当前速度为：{speed.toFixed(1)}格/秒
                                    </div>
                                    : <div className='tetrisStage'>
                                        <Display stage={stage} />
                                    </div>
                                : <div className='tetrisPaused'>
                                    <img src='/assert/tetris/image/upcoming.png' alt="img" />
                                </div>
                        }
                    </div>
                    <div className='tetrisSlide'>
                        <div className='nextBlock'>下一个方块</div>
                        <div className="tetrisSlidePreview">
                            {
                                isStart
                                    ? <Display stage={next.tetri[0]} />
                                    : <div></div>
                            }

                        </div>
                        <div className="start">
                            <img
                                src='/assert/tetris/image/pause.png'
                                alt="img"
                                title="点击开始游戏"
                                ref={startBtn}
                                onClick={startAndPause}
                            />
                        </div>
                        <div className="operation">
                            <div className="up">
                                <img
                                    src='/assert/tetris/image/action.png'
                                    alt="img"
                                    onClick={() => operation.current('up')}
                                    onMouseDown={(e) => continueOpera('up', e)}
                                />
                                <div>W/&uarr;</div>
                            </div>

                            <div className="middle">
                                <div className="left">
                                    <img
                                        src='/assert/tetris/image/action.png'
                                        alt="img"
                                        onClick={() => operation.current('left')}
                                        onMouseDown={(e) => continueOpera('left', e)}
                                    />
                                    <div>A/&larr;</div>
                                </div>

                                <div className="right">
                                    <img
                                        src='/assert/tetris/image/action.png'
                                        alt="img"
                                        onClick={() => operation.current('right')}
                                        onMouseDown={(e) => continueOpera('right', e)}
                                    />
                                    <div>D/&rarr;</div>
                                </div>
                            </div>

                            <div className="down">
                                <img
                                    src='/assert/tetris/image/action.png'
                                    alt="img"
                                    onClick={() => operation.current('down')}
                                    onMouseDown={(e) => continueOpera('down', e)}
                                />
                                <div>S/&darr;</div>
                            </div>
                        </div>
                    </div>
                    <div className='tetrisPaimeng'>
                        <PaiMeng />
                    </div>
                </div>
                <Mask visible={maskVis} opacity={0.01}>
                    <div className='maskContent' ref={maskContent}>
                        <div className='header'>您的得分</div>
                        <div className="scoresBoard">
                            {
                                showScores.map((item, index) => 
                                    <div key={index}>
                                        <span>{item[0]}</span>
                                        <span>{item[1]}</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </Mask>
            </div>
        </div>
    )
}

export default Tetris
