// 创建游戏地图
import store from 'store'
import { ExportOutlined } from '@ant-design/icons'
import { Input, message, Modal } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { init, Water, Brick, Stone, Grass, Home } from './partsOfMap'
import './scss/CreateMap.scss'

const Height = 20, Width = 27, Size = 50

const CreateMap = () => {
    const [mapArr, setMapArr] = useState(initArr())
    const [visible, setVisible] = useState(false)
    const [title, setTitle] = useState()

    const canvas = useRef()
    const terrain = useRef()
    const curTer = useRef('brick')
    const option = useRef()
    const loaded = useRef(false)
    const inputRef = useRef()

    useEffect(() => {
        var ctx = canvas.current.getContext('2d')
        canvas.current.width = Width * Size
        canvas.current.height = Height * Size
        init({ ctx, size: Size })
        terrain.current = {
            brick: new Brick({ x: 0, y: 0 }),
            water: new Water({ x: 0, y: 0 }),
            grass: new Grass({ x: 0, y: 0 }),
            stone: new Stone({ x: 0, y: 0 }),
            home: new Home({ x: 0, y: 0 }),
            ctx
        }
        let promiseAll = []

        for (let item in terrain.current) {
            if (item === 'ctx') continue
            promiseAll.push(
                new Promise((resolve) => {
                    terrain.current[item].img.onload = function () {
                        resolve()
                    }
                })
            )
        }
        Promise.all(promiseAll).then(() => {
            loaded.current = true

            initDraw()
        })
    }, [])

    useEffect(() => {
        // console.log(mapArr)
        var canvasX, canvasY,
            imgX, imgY, I, J, prevI = 0, prevJ = 0,
            map = JSON.parse(JSON.stringify(mapArr)),
            ctx = terrain.current.ctx

        canvas.current.onmousedown = function (e) {
            if (!loaded.current) return
            canvasX = canvas.current.getBoundingClientRect().left
            canvasY = canvas.current.getBoundingClientRect().top
            imgX = e.pageX
            imgY = e.pageY
            I = getAxis(imgY - canvasY)
            J = getAxis(imgX - canvasX)
            if (I >= 0 && I < Height && J >= 0 && J < Width) {
                prevI = I
                prevJ = J
                if (!(
                    (I >= 18 && J >= 12 && J <= 14)
                    || (I === 19 && J === 11)
                    || (I === 19 && J === 15)
                    || (I === 0 || J === 0 || J === 26)
                )) {
                    if (map[I][J] === curTer.current) {
                        map[I][J] = null
                        ctx.clearRect(J * Size, I * Size, Size, Size)
                    } else {
                        terrain.current[curTer.current].x = J * Size
                        terrain.current[curTer.current].y = I * Size
                        terrain.current[curTer.current].render()
                        map[I][J] = curTer.current
                    }
                }
            }
            canvas.current.onmousemove = function (event) {
                imgX = event.pageX
                imgY = event.pageY
                I = getAxis(imgY - canvasY)
                J = getAxis(imgX - canvasX)
                if (I >= 0 && I < Height && J >= 0 && J < Width) {
                    if (prevI === I && prevJ === J) return

                    if (!(
                        (I >= 18 && J >= 12 && J <= 14)
                        || (I === 19 && J === 11)
                        || (I === 19 && J === 15)
                        || (I === 0 || J === 0 || J === 26)
                    )) {
                        prevI = I
                        prevJ = J
                        if (map[I][J] === curTer.current) {
                            map[I][J] = null
                            ctx.clearRect(J * Size, I * Size, Size, Size)
                        } else {
                            terrain.current[curTer.current].x = J * Size
                            terrain.current[curTer.current].y = I * Size
                            terrain.current[curTer.current].render()
                            map[I][J] = curTer.current
                        }
                    }
                }
            }
            canvas.current.onmouseup = function () {
                canvas.current.onmousemove = null
                drawFinished()
            }
        }
        function drawFinished() {
            setMapArr(map)
        }
        function getAxis(x) {
            return Math.floor(x / Size * 2)
        }
    }, [mapArr])

    useEffect(() => {
        // console.log(visible, inputRef.current)
        if (visible)
            setTimeout(() => {
                inputRef.current.focus()
            }, 100)
        else setTitle('')
    }, [visible])

    function initDraw() {
        var x, y, player, map = [], ctx = terrain.current.ctx

        ctx.clearRect(0, 0, 27 * 50, 20 * 50)
        ctx.rect(0, 0, 27 * 50, 20 * 50)
        ctx.fillStyle = 'black'
        ctx.fill()
        for (let i = 0; i < Height; i++) {
            map[i] = []
            for (let j = 0; j < Width; j++) {
                if (i === 19 && j === 13) map[i][j] = 'home'
                else if (i >= 18 && j >= 12 && j <= 14) map[i][j] = 'brick'
                else map[i][j] = null
            }
        }
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 27; j++) {
                x = j * 50
                y = i * 50
                if (map[i][j]) {
                    player = terrain.current[map[i][j]]
                    player.x = x
                    player.y = y
                    player.render()
                }
            }
        }
        setMapArr(map)
    }

    function randomDraw() {
        var map = JSON.parse(JSON.stringify(mapArr)), random, X, Y, terr = null
        for (let i = 0; i < Height; i++) {
            for (let j = 0; j < Width; j++) {
                if (!(
                    (i >= 18 && j >= 12 && j <= 14)
                    || (i === 19 && j === 11)
                    || (i === 19 && j === 15)
                    || (i === 0 || j === 0 || j === 26)
                ) && !map[i][j]) {
                    X = j * Size
                    Y = i * Size
                    random = Math.random() * 30
                    if (random < 5) {
                        terr = 'brick'
                    } else if (random < 7) {
                        terr = 'stone'
                    } else if (random < 10) {
                        terr = 'grass'
                    } else if (random < 13) {
                        terr = 'water'
                    } else terr = null

                    if (terr) {
                        terrain.current[terr].x = X
                        terrain.current[terr].y = Y
                        terrain.current[terr].render()
                        map[i][j] = terr
                    }
                }
            }
        }
        setMapArr(map)
    }

    function save() {
        var maps = store.get('tanksWarMap')
        // console.log(typeof maps)
        if (typeof maps !== 'object') {
            maps = [{ title: title, src: mapArr }]
            store.set('tanksWarMap', maps)
            setVisible(false)
            message.success('保存地图成功')
        } else {
            var flag = false
            maps.forEach((item) => {
                if (item.title === title) flag = true
            })
            if (flag) {
                message.warn('请不要与已有的地图重名')
            } else {
                maps.push({ title: title, src: mapArr })
                store.set('tanksWarMap', maps)
                setVisible(false)
                message.success('保存地图成功')
            }
        }

    }

    const select = (e) => {
        // console.log(option)
        for (let item of option.current.children) {
            item.classList.remove('imgDecoration')
        }
        e.target.classList.add('imgDecoration')
        curTer.current = e.target.name
    }

    return (
        <div className='createMap'>

            <canvas className='map' ref={canvas}></canvas>
            <div className='slide'>
                <Link to='/tankswar'><ExportOutlined rotate={180} className='backIcon' /></Link>
                <div ref={option} className='option'>
                    <img src='/assert/tanksWar/image/brick.bmp' className='imgDecoration' name='brick' alt='img' onClick={select} />
                    <img src='/assert/tanksWar/image/stone.bmp' name='stone' alt='img' onClick={select} />
                    <img src='/assert/tanksWar/image/grass.bmp' name='grass' alt='img' onClick={select} />
                    <img src='/assert/tanksWar/image/water.bmp' name='water' alt='img' onClick={select} />
                </div>
                <div className='drawCont'>
                    <button onClick={randomDraw}>剩下的随机生成</button>
                    <button onClick={initDraw}>全部清除</button>
                </div>
                <button className='save' onClick={() => setVisible(true)}>
                    保存
                </button>
            </div>
            <Modal
                visible={visible}
                title='给你的地图命个名吧'
                onOk={save}
                onCancel={() => setVisible(false)}
            >
                <Input
                    onChange={e => setTitle(e.target.value)}
                    ref={inputRef}
                    value={title}
                    placeholder='请不要与已有的地图重名'
                    onPressEnter={save}
                />
            </Modal>
        </div>
    )
}

function initArr() {
    var a = []
    for (let i = 0; i < Height; i++) {
        a[i] = []
    }
    return a
}

export default CreateMap