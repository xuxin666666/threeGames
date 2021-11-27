// 选择游戏地图
import store from 'store'
import { Popconfirm } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'

import { init, Water, Brick, Stone, Grass, Home, Player1, Player2 } from './partsOfMap'
import './scss/Maps.scss'


const Maps = ({ setSelectMap, dispatch, state }) => {
    const { playerNum } = state
    const [mapsArr, setMapsArr] = useState([])
    const [update, setUpdate] = useState(0) // 控制是否要重新获取地图
    useEffect(() => {
        // 从localStorage中获取地图
        var maps = store.get('tetrisMap')
        if(typeof maps !== 'object') return
        maps.forEach(item => {
            item.src[19][11] = 'player1'
            if (playerNum === 2) item.src[19][15] = 'player2'
        })
        setMapsArr(maps)
    }, [playerNum, update])
    return (
        <div className='tanksWarMaps'>
            <ExportOutlined rotate={180} onClick={() => setSelectMap(false)} className='icon' />
            <ApplyMap mapArr={mapsArr} dispatch={dispatch} setUpdate={setUpdate} />
        </div>
    )
}


function ApplyMap({ mapArr, dispatch, setUpdate }) {
    const len = (mapArr && mapArr.length) || 0
    const [current, setCurrent] = useState(0)
    const [visible, setVisible] = useState(false)
    const [mapImages, setMapImages] = useState([{ title: '', src: [] }])

    const canvas = useRef()

    useEffect(() => {
        if (!mapArr || mapArr.length === 0) return
       
        var ctx = canvas.current.getContext('2d'), maps = []
        canvas.current.width = 27 * 50
        canvas.current.height = 20 * 50
        init({ ctx, size: 50 })
        var terrain = {
            brick: new Brick({ x: 0, y: 0 }),
            water: new Water({ x: 0, y: 0 }),
            grass: new Grass({ x: 0, y: 0 }),
            stone: new Stone({ x: 0, y: 0 }),
            home: new Home({ x: 0, y: 0 }),
            player1: Player1({ x: 0, y: 0 }),
            player2: Player2({ x: 0, y: 0 })
        }

        let promiseAll = []
        for (let item in terrain) {
            promiseAll.push(
                new Promise((resolve, reject) => {
                    terrain[item].img.onload = function () {
                        resolve()
                    }
                })
            )
        }
        Promise.all(promiseAll).then(() => { // 所有图片都加载完成后
            mapArr.forEach(item => {
                var x, y, player, map = item.src
                ctx.clearRect(0, 0, 27 * 50, 20 * 50)
                ctx.rect(0, 0, 27 * 50, 20 * 50)
                ctx.fillStyle = 'black'
                ctx.fill()
                for (let i = 0; i < 20; i++) {
                    for (let j = 0; j < 27; j++) {
                        x = j * 50
                        y = i * 50
                        if (map[i][j] === 'player1') {
                            player = terrain[map[i][j]]
                            player.x = x
                            player.y = y
                            player.born = false
                            player.invincible = false
                            player.render()
                        } else if (map[i][j] === 'player2') {
                            player = terrain[map[i][j]]
                            player.x = x
                            player.y = y
                            player.born = false
                            player.invincible = false
                            player.render()
                        } else if (map[i][j]) {
                            player = terrain[map[i][j]]
                            player.x = x
                            player.y = y
                            player.render()
                        }
                    }
                }
                maps.push({ title: item.title, src: canvas.current.toDataURL() })
            })
            terrain.player1.destroy()
            terrain.player2.destroy()
            setMapImages(maps)
        })
        return () => {
            terrain.player1 && terrain.player1.destroy()
            terrain.player2 && terrain.player2.destroy()
        }

    }, [mapArr])

    useEffect(() => { // 可以通过键盘选择地图
        function keydown(e) {
            if (e.keyCode === 37)
                setCurrent(c => {
                    if (c > 0) return c - 1
                    else return c
                })
            else if (e.keyCode === 39)
                setCurrent(c => {
                    if (c < len - 1) return c + 1
                    else return c
                })
            else if(e.keyCode === 13)
                beginGame()
        }
        window.addEventListener('keydown', keydown)
        return () => {
            window.removeEventListener('keydown', keydown)
        }
    }, [len])

    useEffect(() => {
        if(len > 0 && current >= len) setCurrent(current - 1)
    }, [len, current])

    const left = () => {
        setCurrent(current - 1)
    }
    const right = () => {
        setCurrent(current + 1)
    }
    const beginGame = () => {
        dispatch({ type: 'begin' })
        dispatch({ type: 'map', value: mapArr[current].src })
    }

    const deleteMap = () => {
        var title = mapImages[current].title,
            maps = store.get('tetrisMap')
        
        maps = maps.filter(item => {
            return item.title !== title
        })
        setUpdate(c => c + 1)
        store.set('tetrisMap', maps)
        setVisible(false)
    }

    const contextmenu = (e) => {
        e.preventDefault();
        setVisible(true)
    }

    return (
        <div className='applyMap'>
            <span className='title'>{mapImages[current].title}</span>
            <Popconfirm
                title='确认删除该地图？'
                visible={visible}
                onCancel={() => setVisible(false)}
                onConfirm={deleteMap}
                placement='top'
            >
                {
                    mapImages.map((item, index) => {
                        if (current < 0) return null
                        if (current >= len) return null
                        if (index + 2 === current)
                            return <img src={item.src} className='imgLeftest' key={index} alt='img' />
                        else if (index - 2 === current)
                            return <img src={item.src} className='imgRightest' key={index} alt='img' />
                        else if (index + 1 === current)
                            return <img src={item.src} className='imgLeft' key={index} onClick={left} alt='img' />
                        else if (index === current + 1)
                            return <img src={item.src} className='imgRight' key={index} onClick={right} alt='img' />
                        else if (index === current)
                            return <img src={item.src} alt='img' className='imgCurrent' key={index} onClick={beginGame} onContextMenu={contextmenu} />
                        else return null
                    })
                }
            </Popconfirm>

            <canvas ref={canvas} style={{ position: 'fixed', top: '5000px', left: '5000px' }} />
        </div>
    )
}

export default Maps