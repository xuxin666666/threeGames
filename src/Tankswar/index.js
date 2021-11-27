import { useReducer } from 'react'
import { Route } from 'react-router-dom'

import AnimatedSwitch from '../components/AnimateSwitch'
import Menu from './Menu'
import MainContent from './MainContent'
import CreateMap from './CreateMap'

import './scss/index.scss'

const initVal = {
    begin: false, // 游戏是否开始
    gameover: false, // 游戏是否结束
    maps: [], // 游戏时的地图
    mode: 'hard', // 游戏模式
    playerNum: 2, // 玩家数量
    volume: 10 // 声音大小
}
function reducer(prevState, action){
    switch (action.type) {
        case 'begin':
            return {...prevState, begin: true}
        case 'volume':
            return {...prevState, volume: action.value}
        case 'mode':
            return {...prevState, mode: action.value}
        case 'playerNum':
            return {...prevState, playerNum: action.value}
        case 'map':
            return {...prevState, maps: action.value}
        case 'gameover':
            return {...prevState, gameover: true}
        case 'reset':
            return {
                ...prevState,
                begin: false,
                pause: false,
                gameover: false
            }
        default:
            throw new Error()

    }
}

const TanksWar = () => {
    const [state, dispatch] = useReducer(reducer, initVal)

    return (
        <div className='tankswar'>
            <Menu state={state} dispatch={dispatch} />
            <AnimatedSwitch>
                <Route path='/tankswar/createmap' component={CreateMap} />
                <MainContent state={state} dispatch={dispatch} />
            </AnimatedSwitch>
        </div>
    )
}

export default TanksWar