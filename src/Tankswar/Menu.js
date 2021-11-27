// 顶部菜单栏
import { Slider } from 'antd'
import {SoundOutlined, ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons'
import { useCallback, useEffect, useRef, useState } from 'react'

import Mask from '../components/Mask'
import Header from '../components/Header'

import './scss/Menu.scss'

const Menu = ({ state, dispatch }) => {
    const { volume } = state
    const [maskVis, setMaskVis] = useState(false)
    const slider = useRef()
    const maskContent = useRef()

    function soundChange(value) {
        dispatch({ type: 'volume', value })
    }

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

    const infoClick = useCallback((e) => {
        e.stopPropagation();
        setMaskVis(c => !c)
    }, [])

    return (
        <div className='tanksWarMenu'>
            <Header>
                <img src='/assert/tanksWar/image/info.png' alt='img' className='info' onClick={infoClick} />
                <div ref={slider} className='slider'>
                    <SoundOutlined className='sound' />
                    <Slider
                        value={volume}
                        onChange={soundChange}
                    />
                </div>
            </Header>
            <Mask visible={maskVis}>
                <div className='maskContent' ref={maskContent}>
                    <ol>
                        <li>场上会一直刷新敌人，玩家生命值降为0时或老家被抄了，就游戏结束。地图上会定期出现补给</li>
                        <li>
                            玩家1的控制键为
                            <ul>
                                <li>A：<ArrowLeftOutlined />向左移动</li>
                                <li>W：<ArrowUpOutlined />向上移动</li>
                                <li>D：<ArrowRightOutlined />向右移动</li>
                                <li>S：<ArrowDownOutlined />向下移动</li>
                                <li>space：攻击</li>
                            </ul>
                        </li>
                        <li>
                            玩家2的控制键为（小键盘）
                            <ul>
                                <li>4：<ArrowLeftOutlined />向左移动</li>
                                <li>8：<ArrowUpOutlined />向上移动</li>
                                <li>6：<ArrowRightOutlined />向右移动</li>
                                <li>2：<ArrowDownOutlined />向下移动</li>
                                <li>5：攻击</li>
                            </ul>
                        </li>
                    </ol>
                </div>
            </Mask>
        </div>
    )
}

export default Menu