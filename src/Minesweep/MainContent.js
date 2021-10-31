// mineSweep的主要游戏内容区
import { useCallback, useEffect, useRef, useState } from "react"

import { CeilCommon, CeilDark, CeilNotReverse, CeilFlag, CeilMine } from './Ceil'
import { playAudio } from "../utils"
import './scss/MainContent.scss'

const Width = 30, Height = 16, MineNumber = 99
const MainContent = ({ state, dispatch, callback }) => {
    const { isBegin, isGameover, sound } = state

    const [stage, setStage] = useState(Array(Height).fill(Array(Width).fill({ type: 'common', isReverse: false })))

    const mainContent = useRef() // 主要内容区dom的ref
    const darkArr = useRef([]) // 储存变成深色的方块

    useEffect(() => { // 给父组件传参
        callback.current = setStage
    }, [callback])

    // 鼠标左键点击后
    const click = (e) => {
        // 获取坐标
        var py = mainContent.current.getBoundingClientRect().left,
            px = mainContent.current.getBoundingClientRect().top,
            cy = e.clientX,
            cx = e.clientY,
            x = Math.floor((cx - px - 3) / 30),
            y = Math.floor((cy - py - 3) / 30),
            newStage

        if(!checkBorder(x, y) || isGameover) return
        if (!isBegin) { // 游戏开始
            newStage = initStage(x, y)
            autoClick(x, y, newStage)
            playAudio('mineSweep', 'sweep.mp3', sound)
            setStage(newStage)
            dispatch({ type: 'begin' })
            return
        }
        if(stage[x][y].flag) return // 如果该位置已下旗，不操作
        if(stage[x][y].isReverse) { // 如果该位置是已翻转的
            var i, j, flag = 0, arr = []
            for(i = -1; i <= 1; i++){
                for(j = -1; j <= 1; j++){
                    if(checkBorder(x+i, y+j)){
                        if(stage[x+i][y+j].flag) flag++
                        else if(!stage[x+i][y+j].isReverse) arr.push([x+i, y+j])
                    }
                }
            }
            if(flag === stage[x][y].number && arr.length > 0){ // 未翻转数等于下旗数，则自动翻转
                // newStage = JSON.parse(JSON.stringify(stage))
                newStage = [...stage]
                arr.forEach(item => {
                    newStage[item[0]][item[1]].isReverse = true
                    autoClick(item[0], item[1], newStage)
                })
                playAudio('mineSweep', 'sweep.mp3', sound)
                setStage(newStage)
                checkGameover(newStage)
            }
        } else { // 如果未翻转，则直接将该位置翻转
            // newStage = JSON.parse(JSON.stringify(stage))
            newStage = [...stage]
            newStage[x][y].isReverse = true
            autoClick(x, y, newStage)
            playAudio('mineSweep', 'sweep.mp3', sound)
            setStage(newStage)
            checkGameover(newStage)
        }
    }

    // 检查是否gameover
    const checkGameover = (stage) => {
        var flag = true, remainMines = [] // 剩下的是否都是雷，剩余的雷的数组
        var i, j
        for(i = 0; i < Height; i++){
            for(j = 0; j < Width; j++){
                if(stage[i][j].isReverse && stage[i][j].type === 'mine'){
                    gameover(stage) // 嗯，gameover了
                    return
                }
                if(!stage[i][j].isReverse && !stage[i][j].flag) {
                    if(stage[i][j].type === 'mine') remainMines.push([i, j])
                    else flag = false
                }
            }
        }
        if(flag){ // 剩下的都是雷，获胜
            win(stage, remainMines)
        }
    }

    // 游戏结束
    const gameover = (stage) => {
        dispatch({type: 'gameover'})
        playAudio('mineSweep', 'bomb.mp3', sound)
        setTimeout(() => { // 0.5s后显示出所有的雷
            var mineFlag = false
            var i, j
            for(i = 0; i < Height; i++){
                for(j = 0; j < Width; j++){
                    if(stage[i][j].type === 'mine' && !stage[i][j].flag){
                        stage[i][j].isReverse = true
                        mineFlag = true
                    }
                }
            }
            if(mineFlag) setStage([...stage])
        }, 500)
        setTimeout(() => { // 1.5s后播放游戏结束音频
            playAudio('mineSweep', 'gameover.mp3', sound)
        }, 1500)
        setTimeout(() => { // 3.3s后重新开局
            dispatch({type: 'reset', value: {sound}})
            setStage(Array(Height).fill(Array(Width).fill({ type: 'common', isReverse: false })))
        }, 3300)
    }

    useEffect(() => { // 播放爆炸音频
        if(isGameover) {
            playAudio('mineSweep', 'bomb.mp3', sound)
        }
    }, [stage, isGameover, sound])

    // 游戏获胜
    const win = (stage, remainMines) => { 
        recordScore()
        remainMines.forEach(item => {
            stage[item[0]][item[1]].isReverse = true
        })
        setTimeout(() => { // 0.6s后显示剩下的雷
            setStage(stage)
        }, 600)
        setTimeout(() => { // 1.6s后播放获胜音频
            playAudio('mineSweep', 'win.mp3', sound)
        }, 1600)
        setTimeout(() => { // 3.6s后重新开局
            dispatch({type: 'reset', value: {sound}})
            setStage(Array(Height).fill(Array(Width).fill({ type: 'common', isReverse: false })))
        }, 3600)
    }

    // 记录分数
    const recordScore = () => {

    }

    // 鼠标按下，深色显示
    const mousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        var py = mainContent.current.getBoundingClientRect().left,
            px = mainContent.current.getBoundingClientRect().top,
            cy = e.clientX,
            cx = e.clientY,
            x = Math.floor((cx - px - 3) / 30),
            y = Math.floor((cy - py - 3) / 30),
            newStage, i, j
        
        if(!checkBorder(x, y) || isGameover) return
        if(!stage[x][y].isReverse) return
        for(i = -1; i <= 1; i++){ // 点击方块的周围8格未翻转未下旗的方块变成深色
            for(j = -1; j <= 1; j++){
                if(checkBorder(x+i, y+j) && !stage[x+i][y+j].isReverse && !stage[x+i][y+j].flag){
                    darkArr.current.push([x+i, y+j])
                }
            }
        }
        if(darkArr.current.length > 0){
            newStage = JSON.parse(JSON.stringify(stage))
            darkArr.current.forEach(item => {
                newStage[item[0]][item[1]].dark = true
            })
            setStage(newStage)
        }
    }

    // 鼠标抬起，恢复之前变成深色的方块
    const mouseup = () => {
        if(darkArr.current.length > 0){
            var newStage = JSON.parse(JSON.stringify(stage))
            darkArr.current.forEach(item => {
                newStage[item[0]][item[1]].dark = false
            })
            setStage(newStage)
            darkArr.current = []
        }
    }

    // 检查是否越界
    const checkBorder = useCallback((x, y) => {
        if (x >= 0 && x < Height && y >= 0 && y < Width) return true
        return false
    }, [])

    // 点击时如果本位置和周围8格无雷，则自动点击周围8格
    const autoClick = useCallback((x, y, stage) => {
        var i, j
        if (stage[x][y].number === 0) {
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    if (checkBorder(x + i, y + j)
                        && stage[x + i][y + j].type === 'common'
                        && !stage[x + i][y + j].isReverse) {
                        stage[x + i][y + j].isReverse = true
                        autoClick(x + i, y + j, stage)
                    }
                }
            }
        }

    }, [checkBorder])

    // 鼠标右键点击，插旗或取消插旗
    const contextMenu = (e) => {
        e.preventDefault();
        var py = mainContent.current.getBoundingClientRect().left,
            px = mainContent.current.getBoundingClientRect().top,
            cy = e.clientX,
            cx = e.clientY,
            x = Math.floor((cx - px - 3) / 30),
            y = Math.floor((cy - py - 3) / 30),
            newStage

        if(!checkBorder(x, y) || isGameover) return
        if (stage[x][y].flag) {
            newStage = JSON.parse(JSON.stringify(stage))
            newStage[x][y].flag = false
            playAudio('mineSweep', 'flag_mine.mp3', sound)
            setStage(newStage)
            dispatch({type: 'mineincre'})
        } else if (!stage[x][y].isReverse) {
            playAudio('mineSweep', 'flag_mine.mp3', sound)
            newStage = JSON.parse(JSON.stringify(stage))
            newStage[x][y].flag = true
            setStage(newStage)
            dispatch({ type: 'minedecre' })
        }

    }

    return (
        <div className='mineSweepMainContent' onClick={click} onContextMenu={contextMenu} ref={mainContent} onMouseDown={mousedown} onMouseUp={mouseup}>
            {
                stage.map(item =>
                    item.map((ceil, key) => {
                        if (ceil.flag)
                            return <CeilFlag key={key} />
                        else if (ceil.dark)
                            return <CeilDark key={key} />
                        else if (!ceil.isReverse)
                            return <CeilNotReverse key={key} />
                        else if (ceil.type === 'common')
                            return <CeilCommon number={ceil.number} key={key} />
                        else if (ceil.type === 'mine')
                            return <CeilMine key={key} />
                        else throw new Error()
                    })
                )
            }
        </div>
    )
}

function initStage(x, y) {
    var stage = []
    var i, j, nx, ny, count = MineNumber
    for (i = 0; i < Height; i++) {
        stage[i] = []
        for (j = 0; j < Width; j++) {
            if (i === x && j === y) stage[i][j] = { type: 'common', number: 0, isReverse: true, flag: false, dark: false }
            else stage[i][j] = { type: 'common', number: 0, isReverse: false, flag: false, dark: false }
        }
    }
    while (count) {
        nx = Math.floor(Math.random() * Height)
        ny = Math.floor(Math.random() * Width)
        if (Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1) continue
        if (stage[nx][ny].type !== 'mine') {
            stage[nx][ny].type = 'mine'
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    if (nx + i >= 0 && nx + i < Height && ny + j >= 0 && ny + j < Width) {
                        stage[nx + i][ny + j].number++
                    }
                }
            }
            count--
        }
    }
    return stage
}

export default MainContent