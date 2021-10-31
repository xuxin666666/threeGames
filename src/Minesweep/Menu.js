// mineSweep的菜单栏
import { Link } from "react-router-dom"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useEffect, useRef, useState } from "react"
import { Slider } from "antd"
import store from "store"

import Header from "../Auth/Header"
import Mask from '../components/Mask'
import { useInterval } from '../hook/useInterval'
import { playAudio } from "../utils"
import './scss/Menu.scss'

const Height = 16, Width = 30
const Menu = ({state, dispatch, setStage}) => {
    const {isBegin, isPause, isGameover, sound, timeStr, mine} = state

    const [maskVis, setMaskVis] = useState(false)
    const [soundImg, setSoundImg] = useState('sound.png')

    const maskContent = useRef() // 遮罩dom的ref
    const slider = useRef() // 音量条dom的ref
    const imgSound = useRef() // 音量图片dom的ref
    const sliderTimeout = useRef() // 控制音量条显示出来的timeout
    const canBeNone = useRef(true) // 是否能接着进行下去
 
    // 鼠标点击弹出框外，则隐藏遮罩
    useEffect(() => {
        function listenClick(e) {
            var x = e.clientX, y = e.clientY
            var left = maskContent.current.getBoundingClientRect().left, top = maskContent.current.getBoundingClientRect().top
            var right = maskContent.current.getBoundingClientRect().right, bottom = maskContent.current.getBoundingClientRect().bottom
            if (maskVis && maskContent.current && !(x >= left && y >= top && x <= right && y <= bottom)) {
                setMaskVis(false)
                dispatch({type: 'continue'})
            }
        }
        window.addEventListener('click', listenClick)
        return () => {
            window.removeEventListener('click', listenClick)
        }
    }, [maskVis, dispatch])

    // 音量条的鼠标移入、移出、按下事件
    useEffect(() => {
        slider.current.onmouseenter = function () {
            slider.current.style.display = 'block'
        }
        slider.current.onmouseleave = function () {
            if(canBeNone.current)
                slider.current.style.display = 'none'
        }
        slider.current.onmousedown = function () {
            canBeNone.current = false
        }
    }, [])

    // 鼠标抬起时，判断是否隐藏音量条
    useEffect(() => {
        function mouseup(e){
            if(!canBeNone.current) playAudio('mineSweep', 'click.mp3', sound)
            if(!slider.current.contains(e.target) && !imgSound.current.contains(e.target)) {
                slider.current.style.display = 'none'
            }
            canBeNone.current = true
        }
        window.addEventListener('mouseup', mouseup)
        return () => {
            window.removeEventListener('mouseup', mouseup)
        }
    }, [sound])

    // 开始/继续 计时
    useInterval(() => {
        if(isBegin && !isPause && !isGameover){ 
            dispatch({type: 'time'})
        }
    }, 1000)

    const pause = () => {
        dispatch({type: 'pause'})
        setMaskVis(true)
        playAudio('mineSweep', 'click.mp3', sound)
    }

    // 鼠标移入音量图片，则0.3s后显示音量条
    const soundMouseEnter = () => {
        sliderTimeout.current = setTimeout(() => {
            canBeNone.current = true
            slider.current.style.display = 'block'
        }, 300)
    }

    // 鼠标移出音量图片，则隐藏音量条
    const soundMouseLeave = () => {
        clearTimeout(sliderTimeout.current)
        slider.current.style.display = 'none'
    }

    // 开/关 游戏声音
    const soundClick = () => {
        if (soundImg === 'sound.png') {
            clearTimeout(sliderTimeout.current)
            setSoundImg('nosound.png')
            dispatch({type: 'sound', value: 0})
        } else {
            setSoundImg('sound.png')
            dispatch({type: 'sound', value: 50})
            playAudio('mineSweep', 'click.mp3', 50)
        }
    }

    // 改变音量大小
    const soundChange = (val) => {
        dispatch({type: 'sound', value: val})
        if(val > 0) setSoundImg('sound.png')
        else setSoundImg('nosound.png')
    }

    // 关闭遮罩
    const closeMask = () => {
        dispatch({type: 'continue'})
        setMaskVis(false)
        playAudio('mineSweep', 'click.mp3', sound)
    }

    // 重新开始
    const restart = () => {
        dispatch({type: 'reset', value: {sound}})
        setStage(Array(Height).fill(Array(Width).fill({ type: 'common', isReverse: false })))
        closeMask()
    }

    // 查看得分记录
    const sheet = () => {
        playAudio('mineSweep', 'click.mp3', sound)

    }

    return (
        <>
            <div className='minesweepHeader'>
                <Link to={'/'} className="link" ><ArrowLeftOutlined /></Link>
                <div className='menu'>
                    <div>
                        <img src='/assert/mineSweep/image/mine1.png' alt='img' />
                        <span>{mine}</span>
                    </div>
                    <div>
                        <img src='/assert/mineSweep/image/time.png' alt='img' />
                        <span>{timeStr}</span>
                    </div>
                    <img src='/assert/mineSweep/image/going.png' width='24' alt='img' className='pause' onClick={pause} />
                </div>
                <Header logined={store.get('login')} />
            </div>
            <Mask visible={maskVis} position="fixed" duration='300'>
                <div className='mineMaskC' ref={maskContent}>
                    <img src='/assert/mineSweep/image/dialog_statistics_bg.png' alt='img' className='bg' />
                    <button className='close' onClick={closeMask}>╳</button>
                    <img src="/assert/mineSweep/image/pause.png" alt='img' className='pause' onClick={closeMask} />
                    <div className='icons'>
                        <img src='/assert/mineSweep/image/restart.png' alt='img' onClick={restart} />
                        <div className='sheet' onClick={sheet}>
                            <img src='/assert/mineSweep/image/sheet.png' alt='img' />
                            <img src='/assert/mineSweep/image/sheetContent.png' alt='img' className='sheetContent' />
                        </div>
                        <div className='sound'>
                            <img
                                src={'/assert/mineSweep/image/' + soundImg}
                                alt='img'
                                onMouseEnter={soundMouseEnter}
                                onMouseLeave={soundMouseLeave}
                                onClick={soundClick}
                                ref={imgSound}
                            />
                            <div ref={slider} className='slider'>
                                <Slider
                                    vertical 
                                    value={sound} 
                                    onChange={soundChange}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </Mask>
        </>
    )
}

export default Menu