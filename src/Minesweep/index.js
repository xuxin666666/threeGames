// index.js
import { useReducer, useRef } from "react"
import MainContent from "./MainContent"
import Menu from "./Menu"

import './scss/index.scss'

const initValue = {
    isBegin: false,
    isPause: false,
    isGameover: false,
    sound: 50,
    time: 0,
    timeStr: '00:00',
    mine: 99
}

const reducer = (state, action) => {
    var {isBegin, isPause, isGameover, sound, time, timeStr, mine} = state
    switch (action.type) {
        case 'begin':
            isBegin = true
            return {...state, isBegin}
        case 'pause':
            isPause = true
            return {...state, isPause}
        case 'gameover':
            isGameover = true
            return {...state, isGameover}
        case 'continue':
            isPause = false
            return {...state, isPause}
        case 'restart':
            isBegin = false
            isPause = false
            time = 0
            mine = 99
            return {...state, isBegin, isPause, time, mine}
        case 'sound':
            sound = action.value
            return {...state, sound}
        case 'time':
            time++
            timeStr = showTime(time)
            return {...state, time, timeStr}
        case 'minedecre':
            mine--
            return {...state, mine}
        case 'mineincre':
            mine++
            return {...state, mine}
        case 'reset':
            return {...initValue, ...action.value}
        default:
            throw new Error()
    }
}

const MineSweep = () => {
    const [state, dispatch] = useReducer(reducer, initValue)
    const callback = useRef() // 子组件间传参的中介
    
    return (
        <div className='mineSweep'>
            <img src='/assert/mineSweep/image/home_bg.jpg' alt='img' className='bg' />
            <Menu state={state} dispatch={dispatch} setStage={callback.current} />
            <MainContent state={state} dispatch={dispatch} callback={callback} />
        </div>
    )
}

// 以 --:-- 的形式展示时间
function showTime(time) {
    var second = time % 60, minute = (time - second) / 60
    if(second / 10 < 1) second = '0' + second
    if(minute / 10 < 1) minute = '0' + minute
    return minute + ':' + second
}


export default MineSweep