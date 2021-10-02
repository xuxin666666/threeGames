// 主页面展示的内容

import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom"

import Header from "../Auth/Header"
import Mask from "../components/Mask";
import './App.scss'

const Home = () => {
    const [maskDisplay, setMaskDisplay] = useState('none') // 控制大遮罩层的展示
    const maskRef = useRef()


    const showMask = useCallback( // 展示大遮罩层并添加动画效果，动画的具体内容在scss中
        (e) => {
            setMaskDisplay('block')
            maskRef.current.style.animation = "graduationBigger 0.5s"
            e.stopPropagation();
        },
        []
    )

    const listenBegin = useCallback( // 全局点击事件的函数
        (e) => {
            // 如果遮罩层显示了，且是在遮罩层外点击
            if (maskDisplay === 'block' && maskRef.current && !maskRef.current.contains(e.target)) {
                setMaskDisplay('none')
            }
        },
        [maskDisplay]
    )

    useEffect(() => {
        window.addEventListener('click', listenBegin) // 监听全局点击事件
        return () => {
            window.removeEventListener('click', listenBegin)
        }
    }, [listenBegin])

    return (
        <div className="AnimateRoute">
            <header className="homeHeader">
                <Header logined={false} />
            </header>
            <img src="/assert/homeBG.jpg" alt="img" className="homeBG" />

            <div className="homeContent">
                <p>话不多说</p>
                <span onClick={showMask}>开始游玩</span>
            </div>

            <Mask width="50%" height="60%" opacity={0.4} className="homeMask" ref={maskRef} display={maskDisplay}>
                <div className="homeButtons">
                    <div>
                        <img src="/assert/tetris/image/button.png" width="100%" height="100%" alt="tetris" />
                        <Link to="/tetris">
                            <Mask position="relative" className="homeButtonMask">
                                俄罗斯方块
                            </Mask>
                        </Link>
                    </div>
                    <div>
                        <img src="/assert/mineSweep/image/button.png" width="100%" height="100%" alt="minesweep" />
                        <Link to="/minesweep">
                            <Mask position="relative" className="homeButtonMask">
                                扫雷
                            </Mask>
                        </Link>
                    </div>
                    <div>
                        <img src="/assert/tanksWar/image/button.png" width="100%" height="100%" alt="tankswar" />
                        <Link to="tankswar">
                            <Mask position="relative" className="homeButtonMask">
                                坦克大战
                            </Mask>
                        </Link>
                    </div>
                </div>
            </Mask>
        </div>
    )
}

export default Home