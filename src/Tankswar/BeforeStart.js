// 游戏未开始时
import { useEffect, useRef, useState } from 'react'
import {PlusSquareOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom'

import Options from './Options'
import Maps from './Maps'
import './scss/BeforeStart.scss'


const BeforeStart = ({dispatch, state}) => {
    const [selectMap, setSelectMap] = useState(false)
    const [showMaps, setShowMaps] = useState(false)

    const titleImg = useRef()
    const createMapIcon = useRef()

    useEffect(() => { // 要绘画的地形种类的图片高亮显示
        if(selectMap) {
            titleImg.current.classList.add('titleImgActive')
            setTimeout(() => {
                setShowMaps(true)
                createMapIcon.current.style.display = 'block'
            }, 300)
        } else {
            titleImg.current.classList.remove('titleImgActive')
            setShowMaps(false)
            createMapIcon.current.style.display = 'none'
        }
    }, [selectMap])

    return (
        <div className='tankswarBeforeStart'>
            <img src='/assert/tanksWar/image/Title.jpg' alt='img' className='titleImg' ref={titleImg} />
            <Link to='/tankswar/createmap'><PlusSquareOutlined className='createMapIcon' ref={createMapIcon} title='创建地图' /></Link>
            {
                selectMap
                    ? showMaps
                        ? <Maps setSelectMap={setSelectMap} dispatch={dispatch} state={state} />
                        : <div></div>
                    : <Options setSelectMap={setSelectMap} dispatch={dispatch} />
            }
        </div>
    )
}

export default BeforeStart