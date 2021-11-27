// 选择游戏模式
import './scss/Options.scss'

const Options = ({setSelectMap, dispatch}) => {

    const modeClick = (mode, playerNum) => {
        setSelectMap(true)
        dispatch({type: 'mode', value: mode})
        dispatch({type: 'playerNum', value: playerNum})
    }

    return (
        <div className='tankswarOptions'>
            <div className='option'>
                <div className='mode'>简单模式</div>
                <div className='player'>
                    <span onClick={() => modeClick('easy', 1)}>1 player</span>
                    <span onClick={() => modeClick('easy', 2)}>2 players</span>
                </div>
            </div>
            <div className='option'>
                <div className='mode'>困难模式</div>
                <div className='player'>
                    <span onClick={() => modeClick('hard', 1)}>1 player</span>
                    <span onClick={() => modeClick('hard', 2)}>2 players</span>
                </div>
            </div>
            <div className='option'>
                <div className='mode'>直捣黄龙</div>
                <div className='player'>
                    <span onClick={() => modeClick('special', 1)}>1 player</span>
                    <span onClick={() => modeClick('special', 2)}>2 players</span>
                </div>
            </div>
        </div>
    )
}

export default Options